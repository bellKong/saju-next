const KASI_BASE_URL = "http://apis.data.go.kr/B090041/openapi/service";
const KASI_API_KEY = process.env.KASI_API_KEY;

export interface LunarCalInfo {
  lunYear: number;
  lunMonth: number;
  lunDay: number;
  lunSecha: string; // 음력 연간지 (예: "갑자(甲子)")
  lunWolgeon: string; // 음력 월간지
  lunIljin: string; // 음력 일간지
  solYear: number;
  solMonth: number;
  solDay: number;
  lunLeapmonth: string; // "윤" or ""
}

export interface SolarCalInfo {
  solYear: number;
  solMonth: number;
  solDay: number;
  lunYear: number;
  lunMonth: number;
  lunDay: number;
}

export interface JeolgiInfo {
  locdate: number; // YYYYMMDD
  kst: string; // "HH:MM" 절입시각
  dateName: string; // 절기 이름 (예: "입춘")
}

function normalizeItems<T>(items: any): T[] {
  if (!items || !items.item) return [];
  if (Array.isArray(items.item)) return items.item;
  return [items.item];
}

async function kasiRequest(
  service: string,
  operation: string,
  params: Record<string, string | number>
): Promise<any> {
  if (!KASI_API_KEY) {
    throw new Error("KASI_API_KEY is not configured");
  }

  const url = new URL(`${KASI_BASE_URL}/${service}/${operation}`);
  url.searchParams.set("serviceKey", KASI_API_KEY);
  url.searchParams.set("_type", "json");
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, String(value));
  }

  const res = await fetch(url.toString(), { cache: "force-cache" });
  if (!res.ok) {
    throw new Error(`KASI API HTTP error: ${res.status}`);
  }

  const data = await res.json();
  const header = data?.response?.header;
  if (header?.resultCode !== "00") {
    throw new Error(
      `KASI API error: ${header?.resultCode} - ${header?.resultMsg}`
    );
  }

  return data.response.body;
}

export async function getSolarToLunar(
  year: number,
  month: number,
  day: number
): Promise<LunarCalInfo> {
  const body = await kasiRequest("LrsrCldInfoService", "getLunCalInfo", {
    solYear: String(year),
    solMonth: String(month).padStart(2, "0"),
    solDay: String(day).padStart(2, "0"),
  });

  const items = normalizeItems<any>(body.items);
  if (items.length === 0) {
    throw new Error(`No lunar calendar data for ${year}-${month}-${day}`);
  }

  const item = items[0];
  return {
    lunYear: Number(item.lunYear),
    lunMonth: Number(item.lunMonth),
    lunDay: Number(item.lunDay),
    lunSecha: item.lunSecha || "",
    lunWolgeon: item.lunWolgeon || "",
    lunIljin: item.lunIljin || "",
    solYear: Number(item.solYear),
    solMonth: Number(item.solMonth),
    solDay: Number(item.solDay),
    lunLeapmonth: item.lunLeapmonth || "",
  };
}

export async function getLunarToSolar(
  year: number,
  month: number,
  day: number,
  leapMonth: boolean = false
): Promise<SolarCalInfo> {
  const body = await kasiRequest("LrsrCldInfoService", "getSolCalInfo", {
    lunYear: String(year),
    lunMonth: String(month).padStart(2, "0"),
    lunDay: String(day).padStart(2, "0"),
    leapMonth: leapMonth ? "leap" : "",
  });

  const items = normalizeItems<any>(body.items);
  if (items.length === 0) {
    throw new Error(`No solar calendar data for lunar ${year}-${month}-${day}`);
  }

  const item = items[0];
  return {
    solYear: Number(item.solYear),
    solMonth: Number(item.solMonth),
    solDay: Number(item.solDay),
    lunYear: Number(item.lunYear),
    lunMonth: Number(item.lunMonth),
    lunDay: Number(item.lunDay),
  };
}

export async function get24Divisions(
  year: number,
  month?: number
): Promise<JeolgiInfo[]> {
  const params: Record<string, string | number> = {
    solYear: String(year),
    numOfRows: 30,
  };
  if (month !== undefined) {
    params.solMonth = String(month).padStart(2, "0");
  }

  const body = await kasiRequest("SpcdeInfoService", "get24DivisionsInfo", params);
  const items = normalizeItems<any>(body.items);

  return items.map((item: any) => ({
    locdate: Number(item.locdate),
    kst: item.kst || "",
    dateName: item.dateName || "",
  }));
}

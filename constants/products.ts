export interface UIProduct {
  code: string;
  name: string;
  credits: number;
  price: number;
  pricePerCredit: number;
  description: string;
  icon: string;
  badge?: string;
  popular?: boolean;
}

export const UI_PRODUCTS: UIProduct[] = [
  {
    code: "CREDIT_1",
    name: "1회",
    credits: 1,
    price: 990,
    pricePerCredit: 990,
    description: "가볍게 한 번 이용",
    icon: "🎯",
  },
  {
    code: "CREDIT_5",
    name: "5+1회",
    credits: 6,
    price: 4950,
    pricePerCredit: 825,
    description: "5회 구매 시 +1회 보너스",
    badge: "+1 보너스",
    popular: true,
    icon: "⭐",
  },
  {
    code: "CREDIT_10",
    name: "10+2회",
    credits: 12,
    price: 9900,
    pricePerCredit: 825,
    description: "10회 구매 시 +2회 보너스",
    badge: "+2 보너스",
    icon: "👑",
  },
];

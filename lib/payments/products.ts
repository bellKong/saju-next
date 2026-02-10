export const PRODUCTS = {
  CREDIT_1: {
    code: "CREDIT_1",
    name: "1회 이용권",
    credits: 1,
    price: 990,
  },
  CREDIT_5: {
    code: "CREDIT_5",
    name: "5회+1회 이용권",
    credits: 6,
    price: 4950,
  },
  CREDIT_10: {
    code: "CREDIT_10",
    name: "10회+2회 이용권",
    credits: 12,
    price: 9900,
  },
} as const;

export type ProductCode = keyof typeof PRODUCTS;

export function getProduct(code: string) {
  return PRODUCTS[code as ProductCode];
}

export function isValidProductCode(code: string): code is ProductCode {
  return code in PRODUCTS;
}

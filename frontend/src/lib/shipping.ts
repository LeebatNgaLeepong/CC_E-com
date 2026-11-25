export const FREE_SHIPPING_OVER_CENTS = 500_000;
export const FLAT_SHIPPING_CENTS = 15_000;

export function totals(subtotalCents: number) {
  const shippingCents =
    subtotalCents === 0 || subtotalCents >= FREE_SHIPPING_OVER_CENTS
      ? 0
      : FLAT_SHIPPING_CENTS;
  return {
    subtotalCents,
    shippingCents,
    totalCents: subtotalCents + shippingCents,
  };
}

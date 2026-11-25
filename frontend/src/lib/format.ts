const pesoFormatter = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  maximumFractionDigits: 0,
});

export function formatPeso(centavos: number) {
  return pesoFormatter.format(centavos / 100);
}

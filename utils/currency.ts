export const currencyFormat = (value: number) => {
  const formater = new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return formater.format(value);
};

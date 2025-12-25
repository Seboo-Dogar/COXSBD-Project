export const getRates = async () => {
  const res = await fetch("/rates");
  return res.json();
};

export const ellipsizeAddress = (address: string) => {
  if (!address) return null;
  if (address.length && address.length < 6) return address;
  return `${address.slice(0, 6)}...${address.slice(address.length - 4)}`;
};

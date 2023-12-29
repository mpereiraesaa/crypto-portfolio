
export const formatPrice = (price: string, decimals: number) => {
    const zeroPaddedValue = price.padStart(decimals, '0');
    const integer = zeroPaddedValue.slice(0, -decimals);
    const fraction = zeroPaddedValue.slice(-decimals).replace(/\.?0+$/, '');
    if (integer === '') return `0.${fraction}`;
    if (fraction === '') return integer;
    return `${integer}.${fraction}`;
};

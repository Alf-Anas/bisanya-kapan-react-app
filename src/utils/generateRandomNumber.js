export const generateRandomNumber = (digit = 16) => {
    const max = Math.pow(10, digit) - 1;
    const min = Math.pow(10, digit - 1);
    return Math.floor(Math.random() * (max - min) + min);
};

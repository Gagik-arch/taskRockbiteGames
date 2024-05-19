export const genRandomNumber = (min: number = 0, max: number = 10): number => {
    if (min > max) throw new Error("max num must be greater than min");

    return min + Math.floor(Math.random() * (max - min));
};

export const generateColor = (): string => {
    const r = genRandomNumber(50, 230);
    const b = genRandomNumber(50, 230);
    const g = genRandomNumber(50, 230);
    return `rgba(${r},${g},${b},1)`;
};

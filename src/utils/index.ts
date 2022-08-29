export enum Colors {
  PINK = "FF238D",
  YELLOW = "FFB800",
  ORANGE = "FF8D23",
}

export const uidGen = (str: string = "") => {
  let i = 0;

  return () => {
    i++;
    return `${Date.now()}-${i}-${str}`;
  };
};

export enum Colors {
  PINK = "FF238D",
  YELLOW = "FFB800",
  ORANGE = "FF8D23",
  SKY = "00C2FF",
  BLUE = "0066FF",
  GRAY = "8E9CBB",
}

// export const uidGen = (str: string = "") => {
//   let i = 0;

//   return () => {
//     i++;
//     return `${Date.now()}-${i}-${str}`;
//   };
// };

export const uidGen = (str = "") => {
  const _uidGen = (function* () {
    let i = 0;

    while (true) {
      i++;
      yield `${Date.now()}-${i}-${str}`;
    }
  })();

  return () => _uidGen.next().value;
};

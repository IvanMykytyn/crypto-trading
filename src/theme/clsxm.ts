import clsx, { type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        { text: ["3xs", "xxs", "xs", "s", "m", "l", "xl", "xxl", "xxxl"] },
      ],
    },
  },
});

/** Merge classes with tailwind-merge with clsx full feature */
export const clsxm = (...classes: ClassValue[]) => {
  return twMerge(clsx(...classes));
};

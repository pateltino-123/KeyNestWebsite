export interface SizingTip {
  brand: string;
  tip: string;
  direction: "small" | "large" | "normal";
  adjustment: number;
}

export const brandSizingTips: SizingTip[] = [
  {
    brand: "Adidas",
    tip: "Yeezy models typically run 0.5 size small - consider sizing up",
    direction: "small",
    adjustment: 0.5,
  },
  {
    brand: "Nike",
    tip: "Nike Air Force 1s fit true to size for most feet",
    direction: "normal",
    adjustment: 0,
  },
  {
    brand: "New Balance",
    tip: "New Balance tends to run wide - great for wider feet",
    direction: "large",
    adjustment: 0,
  },
  {
    brand: "Converse",
    tip: "Chuck Taylors run large - size down 0.5 to 1 full size",
    direction: "large",
    adjustment: 1,
  },
  {
    brand: "ASICS",
    tip: "ASICS fits true to size and offers wide width options",
    direction: "normal",
    adjustment: 0,
  },
  {
    brand: "On",
    tip: "On running shoes fit true to size with a snug, performance fit",
    direction: "normal",
    adjustment: 0,
  },
  {
    brand: "Reebok",
    tip: "Reebok Classic styles run slightly narrow",
    direction: "small",
    adjustment: 0.5,
  },
  {
    brand: "Skechers",
    tip: "Skechers often runs slightly large - consider sizing down",
    direction: "large",
    adjustment: 0.5,
  },
];

export const footTypeTips = {
  flat: "For flat feet, look for shoes with motion control and stability features. ASICS GEL-Kayano and Brooks Adrenaline are great options.",
  neutral: "Neutral feet have the most shoe options! Focus on what feels comfortable and matches your activity.",
  high: "High arches benefit from extra cushioning. Look for well-cushioned shoes like Nike Air Max or Adidas Ultraboost.",
};

export const widthTips = {
  narrow: "For narrow feet, consider brands like Nike and Converse which tend to run slimmer. Avoid New Balance unless going with their narrow width options.",
  normal: "Standard width should fit most shoes comfortably. Focus on your preferred style and activity.",
  wide: "For wide feet, New Balance and ASICS offer excellent wide width options. Avoid Yeezys and slim-fit styles.",
};

export interface SizingTip {
  brand: string;
  tip: string;
  direction: "small" | "large" | "normal";
  adjustment: number;
}

export const brandSizingTips: SizingTip[] = [
  {
    brand: "Nike",
    tip: "Nike running shoes typically fit true to size. Racing models (Vaporfly, Alphafly) run narrow — consider half-size up for wide feet.",
    direction: "normal",
    adjustment: 0,
  },
  {
    brand: "Adidas",
    tip: "Adidas running shoes generally fit true to size. Adizero racing models fit snug — size up half if between sizes.",
    direction: "normal",
    adjustment: 0,
  },
  {
    brand: "New Balance",
    tip: "New Balance tends to run wide and offers excellent width options. Most models are true to size with generous toe box room.",
    direction: "large",
    adjustment: 0,
  },
  {
    brand: "ASICS",
    tip: "ASICS fits true to size across the lineup. Wide width options available on most models. Kayano and GT-2000 run slightly snug in the midfoot.",
    direction: "normal",
    adjustment: 0,
  },
  {
    brand: "On",
    tip: "On running shoes fit true to size with a snug, performance-oriented fit. The Cloudmonster series has the roomiest toe box.",
    direction: "normal",
    adjustment: 0,
  },
  {
    brand: "Hoka",
    tip: "Hoka fits true to size with a roomy toe box. The MetaRocker design can feel different at first — allow a few runs to adapt.",
    direction: "normal",
    adjustment: 0,
  },
  {
    brand: "Saucony",
    tip: "Saucony fits true to size. Endorphin racing models run narrow; Triumph and Ride have a roomier, more accommodating fit.",
    direction: "normal",
    adjustment: 0,
  },
  {
    brand: "Puma",
    tip: "Puma Nitro running shoes fit true to size. Deviate and Fast-R models have a performance snug fit — size up if between sizes.",
    direction: "normal",
    adjustment: 0,
  },
  {
    brand: "Reebok",
    tip: "Reebok FloatZig running shoes fit true to size with a medium-width toe box. FloatZig Double runs slightly roomier for long-run comfort.",
    direction: "normal",
    adjustment: 0,
  },
  {
    brand: "Skechers",
    tip: "Skechers performance running shoes fit true to size. AERO models with Arch Fit provide additional arch support — great for flat feet.",
    direction: "normal",
    adjustment: 0,
  },
  {
    brand: "Brooks",
    tip: "Brooks fits true to size with excellent width options (narrow to extra wide). Ghost and Adrenaline are the most accommodating models.",
    direction: "normal",
    adjustment: 0,
  },
  {
    brand: "Under Armour",
    tip: "Under Armour running shoes generally fit true to size. Velociti racing models fit snug; Charged series runs slightly roomy for everyday comfort.",
    direction: "normal",
    adjustment: 0,
  },
];

export const footTypeTips = {
  flat: "For flat feet, look for stability shoes with motion control. ASICS GEL-Kayano, Brooks Adrenaline GTS, Hoka Arahi, and Saucony Guide are excellent options.",
  neutral: "Neutral feet have the most shoe options! Focus on what feels comfortable. Daily trainers like Nike Pegasus, Brooks Ghost, and New Balance 880 are versatile choices.",
  high: "High arches benefit from extra cushioning. Look for well-cushioned neutral shoes like ASICS GEL-Nimbus, Brooks Glycerin, Hoka Bondi, and Saucony Triumph.",
};

export const widthTips = {
  narrow: "For narrow feet, racing models from Nike (Vaporfly, Alphafly), Adidas (Adizero), and ASICS (Metaspeed) tend to run slimmer. New Balance and Brooks offer narrow width options in many daily trainers.",
  normal: "Standard width should fit most running shoes comfortably. Most brands' daily trainers are built for medium-width feet.",
  wide: "For wide feet, New Balance, Brooks, and ASICS offer excellent wide and extra-wide options. Hoka and Saucony also have wide sizing. Nike and Adidas racing shoes run narrow — look for their daily trainers instead.",
};

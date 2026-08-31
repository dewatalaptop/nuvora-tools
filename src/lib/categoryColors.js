// Tailwind's scanner only picks up class names it can see literally in
// source — dynamically built strings like `bg-${accent}-50` are invisible to
// it and get purged. So every accent's full class set is spelled out here
// once; components look it up by name instead of constructing classes.
export const ACCENT_COLORS = {
  emerald: {
    badgeBg: "bg-emerald-50", badgeText: "text-emerald-600",
    heroBg: "bg-emerald-100", heroText: "text-emerald-600",
    gradient: "from-emerald-500 to-emerald-600", ring: "hover:border-emerald-300",
  },
  violet: {
    badgeBg: "bg-violet-50", badgeText: "text-violet-600",
    heroBg: "bg-violet-100", heroText: "text-violet-600",
    gradient: "from-violet-500 to-violet-600", ring: "hover:border-violet-300",
  },
  rose: {
    badgeBg: "bg-rose-50", badgeText: "text-rose-600",
    heroBg: "bg-rose-100", heroText: "text-rose-600",
    gradient: "from-rose-500 to-rose-600", ring: "hover:border-rose-300",
  },
  amber: {
    badgeBg: "bg-amber-50", badgeText: "text-amber-600",
    heroBg: "bg-amber-100", heroText: "text-amber-600",
    gradient: "from-amber-500 to-amber-600", ring: "hover:border-amber-300",
  },
  green: {
    badgeBg: "bg-green-50", badgeText: "text-green-600",
    heroBg: "bg-green-100", heroText: "text-green-600",
    gradient: "from-green-500 to-green-600", ring: "hover:border-green-300",
  },
  pink: {
    badgeBg: "bg-pink-50", badgeText: "text-pink-600",
    heroBg: "bg-pink-100", heroText: "text-pink-600",
    gradient: "from-pink-500 to-pink-600", ring: "hover:border-pink-300",
  },
  indigo: {
    badgeBg: "bg-indigo-50", badgeText: "text-indigo-600",
    heroBg: "bg-indigo-100", heroText: "text-indigo-600",
    gradient: "from-indigo-500 to-indigo-600", ring: "hover:border-indigo-300",
  },
  red: {
    badgeBg: "bg-red-50", badgeText: "text-red-600",
    heroBg: "bg-red-100", heroText: "text-red-600",
    gradient: "from-red-500 to-red-600", ring: "hover:border-red-300",
  },
  orange: {
    badgeBg: "bg-orange-50", badgeText: "text-orange-600",
    heroBg: "bg-orange-100", heroText: "text-orange-600",
    gradient: "from-orange-500 to-orange-600", ring: "hover:border-orange-300",
  },
  teal: {
    badgeBg: "bg-teal-50", badgeText: "text-teal-600",
    heroBg: "bg-teal-100", heroText: "text-teal-600",
    gradient: "from-teal-500 to-teal-600", ring: "hover:border-teal-300",
  },
  cyan: {
    badgeBg: "bg-cyan-50", badgeText: "text-cyan-600",
    heroBg: "bg-cyan-100", heroText: "text-cyan-600",
    gradient: "from-cyan-500 to-cyan-600", ring: "hover:border-cyan-300",
  },
};

export function getAccent(colorName) {
  return ACCENT_COLORS[colorName] ?? ACCENT_COLORS.indigo;
}

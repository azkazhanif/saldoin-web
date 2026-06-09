/**
 * Helper to resolve category colors (hex color codes or Tailwind bg-* classes) to hex values.
 */
export const resolveCategoryColor = (color: string | undefined | null): string => {
  if (!color) return "#6B7280";
  if (color.startsWith("#")) return color;

  const colorMap: Record<string, string> = {
    "bg-amber-500": "#F59E0B",
    "bg-blue": "#3B82F6",
    "bg-purple-500": "#8B5CF6",
    "bg-red-500": "#EF4444",
    "bg-blue-600": "#2563EB",
    "bg-orange-500": "#F97316",
    "bg-teal-600": "#0D9488",
    "bg-rose-500": "#F43F5E",
    "bg-indigo-600": "#4F46E5",
    "bg-gray-500": "#6B7280",
    "bg-green-600": "#16A34A",
    "bg-emerald-600": "#059669",
    "bg-green-700": "#15803D",
    "bg-sky-600": "#0284C7",
  };

  return colorMap[color] || color.replace("bg-", "") || "#6B7280";
};

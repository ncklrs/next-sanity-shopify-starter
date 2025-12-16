import * as Icons from "../../icons";

// Map common icon name variations to our icon component names
// This handles cases where Sanity editors might use different naming conventions
const iconNameMap: Record<string, string> = {
  // Shopping/Commerce
  cart: "shoppingCart",
  "shopping-cart": "shoppingCart",
  shoppingcart: "shoppingCart",

  // Navigation (camelCase from picker gets lowercased)
  "arrow-right": "arrowRight",
  "arrow-left": "arrowLeft",
  arrowright: "arrowRight",
  arrowleft: "arrowLeft",
  "chevron-right": "chevronRight",
  "chevron-left": "chevronLeft",
  "chevron-down": "chevronDown",
  "chevron-up": "chevronUp",
  chevronright: "chevronRight",
  chevronleft: "chevronLeft",
  chevrondown: "chevronDown",
  chevronup: "chevronUp",

  // Common variations (camelCase from picker gets lowercased)
  "bar-chart": "barChart",
  barchart: "barChart",
  chart: "barChart",
  "file-text": "fileText",
  filetext: "fileText",
  document: "fileText",
  "help-circle": "helpCircle",
  helpcircle: "helpCircle",
  help: "helpCircle",
  "message-square": "messageSquare",
  messagesquare: "messageSquare",
  message: "messageSquare",
  chat: "messageSquare",
  "mouse-pointer": "mousePointer",
  mousepointer: "mousePointer",
  cursor: "mousePointer",
  creditcard: "creditCard",
  "credit-card": "creditCard",

  // Lucide naming to our naming
  layouttemplate: "grid",
  layout: "grid",
  pencil: "type",
  edit: "type",
  eye: "globe",
  view: "globe",
  filecode: "code",
  "file-code": "code",

  // Direct mappings (single word - already correct)
  sparkles: "sparkles",
  heart: "heart",
  rocket: "rocket",
  shield: "shield",
  zap: "zap",
  layers: "layers",
  code: "code",
  users: "users",
  check: "check",
  globe: "globe",
  play: "play",
  star: "star",
  menu: "menu",
  x: "x",
  close: "x",
  quote: "quote",
  type: "type",
  video: "video",
  award: "award",
  bell: "bell",
  building: "building",
  database: "database",
  grid: "grid",
  image: "image",
  mail: "mail",
  email: "mail",
  paintbrush: "paintbrush",
  brush: "paintbrush",
  puzzle: "puzzle",
  settings: "settings",
  cog: "settings",
  gear: "settings",
  trash: "trash",
  delete: "trash",
  minus: "minus",
  plus: "plus",
  add: "plus",
  package: "package",
  box: "package",
  truck: "truck",
  delivery: "truck",
  shipping: "truck",
  search: "search",
  clock: "clock",
  time: "clock",
};

export function getSpacingClass(spacing?: string): string {
  const spacingMap: Record<string, string> = {
    none: "",
    sm: "py-8 px-4",
    small: "py-8 px-4",
    md: "py-12 px-6",
    medium: "py-12 px-6",
    lg: "py-16 px-6",
    large: "py-16 px-6",
    xl: "py-24 px-6",
  };
  return spacingMap[spacing || "lg"] || spacingMap.lg;
}

export function getBackgroundClass(variant?: string): string {
  const backgroundMap: Record<string, string> = {
    default: "bg-[var(--background)]",
    white: "bg-[var(--background)]",
    secondary: "bg-[var(--background-secondary)]",
    gray: "bg-[var(--background-secondary)]",
    muted: "bg-[var(--background-secondary)]",
    tertiary: "bg-[var(--background-tertiary)]",
    primary: "bg-[var(--background-tertiary)]",
    accent: "bg-[var(--background-tertiary)]",
    gradient: "bg-gradient-to-b from-[var(--background)] to-[var(--background-secondary)]",
  };
  return backgroundMap[variant || "default"] || backgroundMap.default;
}

export function getGridColumnsClass(columns?: number): string {
  const columnsMap: Record<number, string> = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  };
  return columnsMap[columns || 3] || columnsMap[3];
}

export function renderIcon(iconName?: string, props?: React.SVGProps<SVGSVGElement>) {
  if (!iconName) return null;

  // Normalize the icon name: lowercase and check mapping
  const normalizedName = iconName.toLowerCase().trim();
  const mappedName = iconNameMap[normalizedName] || normalizedName;

  // Convert icon name to component name (e.g., "sparkles" -> "SparklesIcon")
  const componentName = `${mappedName.charAt(0).toUpperCase()}${mappedName.slice(1)}Icon`;

  // Type-safe icon lookup
  const IconComponent = Icons[componentName as keyof typeof Icons] as React.ComponentType<
    React.SVGProps<SVGSVGElement>
  >;

  if (!IconComponent) {
    // Only warn in development
    if (process.env.NODE_ENV === "development") {
      console.warn(`Icon "${iconName}" (mapped to "${mappedName}") not found.`);
    }
    return null;
  }

  return <IconComponent {...props} />;
}

export function splitTextWithGradient(text?: string, gradientText?: string): {
  beforeGradient: string;
  gradientPart: string;
  afterGradient: string;
} {
  if (!text) {
    return {
      beforeGradient: "",
      gradientPart: "",
      afterGradient: "",
    };
  }

  if (!gradientText || !text.includes(gradientText)) {
    return {
      beforeGradient: text,
      gradientPart: "",
      afterGradient: "",
    };
  }

  const index = text.indexOf(gradientText);
  return {
    beforeGradient: text.slice(0, index),
    gradientPart: gradientText,
    afterGradient: text.slice(index + gradientText.length),
  };
}

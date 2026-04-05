export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  children?: NavItem[];
}

export const navigation: NavItem[] = [
  {
    label: "Home",
    href: "/",
    icon: "home",
  },
  {
    label: "Search",
    href: "/search",
    icon: "search",
  },
  {
    label: "Tools",
    href: "/tools",
    icon: "tools",
  },
  {
    label: "Workflows",
    href: "/workflows",
    icon: "workflow",
  },
  {
    label: "Resources",
    href: "/resources",
    icon: "book",
  },
];

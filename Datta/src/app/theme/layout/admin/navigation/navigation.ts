import { Injectable } from "@angular/core";

export interface NavigationItem {
  id: string;
  title: string;
  type: "item" | "collapse" | "group";
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  exactMatch?: boolean;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  function?: any;
  badge?: {
    title?: string;
    type?: string;
  };
  children?: Navigation[];
}

export interface Navigation extends NavigationItem {
  children?: NavigationItem[];
}

const NavigationItems = [
  {
    id: "navigation",
    title: "Navigation",
    type: "group",
    icon: "icon-navigation",
    children: [
      {
        id: "dashboard",
        title: "Dashboard",
        type: "item",
        url: "/dashboard/default",
        icon: "feather icon-home",
        classes: "nav-item",
      },
    ],
  },
  {
    id: "Management",
    title: "Management",
    type: "group",
    icon: "icon-navigation",
    children: [
      {
        id: "students",
        title: "Students",
        type: "item",
        url: "/students/record",
        icon: "feather icon-users",
        classes: "nav-item",
      },
      {
        id: "users",
        title: "Users",
        type: "item",
        url: "/users",
        classes: "nav-item",
        icon: "feather icon-user",
      },
    ],
  },
];

@Injectable()
export class NavigationItem {
  get() {
    return NavigationItems;
  }
}

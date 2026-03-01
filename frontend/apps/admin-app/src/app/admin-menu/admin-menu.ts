import {Signal} from "@angular/core";

export interface AdminMenuGroup {
  title: string,
  items: AdminMenuItem[]
}

export interface AdminMenuItem {
  routerLink: string,
  icon: string,
  text: string,
  badges?: AdminMenuBadge[]
}

export interface AdminMenuBadge {
  value: Signal<number>
  colorClass: string
}



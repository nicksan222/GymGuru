import { ReactElement } from "react";

export interface SidebarButtonProps {
  icon: ReactElement;
  text: string;
  goTo?: string;
}

export interface SidebarSectionProps {
  text: string;
  buttons: SidebarButtonProps[];
}

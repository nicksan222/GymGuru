import { SidebarSectionProps } from "./types";
import { FiHeart, FiList, FiPlus } from "react-icons/fi";

export const sidebarConfig: SidebarSectionProps[] = [
  {
    text: "Clienti",
    buttons: [
      {
        icon: <FiList />,
        text: "Tutti",
        goTo: "clienti",
      },
      {
        icon: <FiPlus />,
        text: "Aggiungi cliente",
        goTo: "clienti/add",
      },
    ],
  },
  {
    text: "Esercizi",
    buttons: [
      {
        icon: <FiList />,
        text: "Tutti",
        goTo: "esercizi",
      },
      {
        icon: <FiPlus />,
        text: "Aggiungi esercizio",
        goTo: "esercizi/add",
      },
    ],
  },
];

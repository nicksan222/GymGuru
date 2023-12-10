import { SidebarSectionProps } from "./types";
import { FiClock, FiDollarSign, FiHeart, FiList, FiPlus } from "react-icons/fi";

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
  {
    text: "Scadenze",
    buttons: [
      {
        icon: <FiClock />,
        text: "Scadenze piani",
        goTo: "scadenze/piani",
      },
      {
        icon: <FiDollarSign />,
        text: "Pagamenti",
        goTo: "scadenze/pagamenti",
      },
    ],
  },
];

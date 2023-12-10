import Link from "next/link";
import { Button } from "#/components/ui/button";

interface Props {
  icon: React.ReactNode;
  text: string;
  isSection?: boolean;
  goTo?: string;
}

export default function SidebarButton({ icon, text, isSection, goTo }: Props) {
  return (
    <Link href={"/dashboard/" + (goTo ?? "")}>
      <Button
        variant={isSection ? "secondary" : "ghost"}
        className="w-full justify-start"
      >
        <div className="mr-4">{icon}</div>
        {text[0]?.toUpperCase() + text.slice(1)}
      </Button>
    </Link>
  );
}

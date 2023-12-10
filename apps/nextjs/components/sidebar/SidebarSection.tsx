interface Props {
  children: React.ReactNode;

  text: string;
}

export default function SidebarSection({ children, text }: Props) {
  return (
    <div className="space-y-4 py-4">
      <div className="px-3 py-2">
        <h2 className="mb-4 px-4 text-lg font-semibold tracking-tight">
          {text.charAt(0).toUpperCase() + text.slice(1)}
        </h2>
        <div className="space-y-1">{children}</div>
      </div>
    </div>
  );
}

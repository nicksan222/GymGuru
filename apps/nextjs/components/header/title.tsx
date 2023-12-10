interface Props {
  title: string;
  subtitle?: string;
}

export default function DashboardTitle(props: Props) {
  return (
    <div className="flex flex-row justify-between">
      <div>
        <h1 className="text-2xl font-semibold">{props.title}</h1>
        {props.subtitle && (
          <h3 className="mt-2 text-gray-700">{props.subtitle}</h3>
        )}
      </div>
      <div></div>
    </div>
  );
}

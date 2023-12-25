import { Skeleton } from "../ui/skeleton";

interface Props {
  title: string;
  subtitle?: string;
}

export default function DashboardTitle(props: Props) {
  if (!props.title || props.subtitle?.includes("undefined")) {
    return (
      <div className="flex flex-row justify-between">
        <div>
          <Skeleton>
            <h1 className="text-2xl font-semibold opacity-0">{props.title}</h1>
          </Skeleton>
          <Skeleton>
            {props.subtitle && (
              <h3 className="mt-2 text-gray-700 opacity-0">{props.subtitle}</h3>
            )}
          </Skeleton>
        </div>
        <div></div>
      </div>
    );
  }

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

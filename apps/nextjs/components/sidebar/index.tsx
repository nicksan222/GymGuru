import { cn } from "#/lib/utils";

import SidebarSection from "./SidebarSection";
import SidebarButton from "./SidebarButton";
import { sidebarConfig } from "./config";

interface Props {
  children: React.ReactNode;
  className?: string;
}

export function Sidebar({ className, children }: Props) {
  return (
    <>
      <button
        data-drawer-target="default-sidebar"
        data-drawer-toggle="default-sidebar"
        aria-controls="default-sidebar"
        type="button"
        className="mt-2 ml-3 inline-flex items-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 sm:hidden"
      >
        <span className="sr-only">Apri sidebar</span>
        <svg
          className="h-6 w-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          ></path>
        </svg>
      </button>

      <aside
        id="default-sidebar"
        className="fixed top-0 left-0 z-40 h-screen w-64 -translate-x-full transition-transform sm:translate-x-0"
        aria-label="Sidebar"
      >
        <div className="h-full overflow-y-auto bg-gray-50 px-3 py-4 dark:bg-gray-800">
          <div className={cn("pb-12", className)}>
            {sidebarConfig.map((section) => (
              <SidebarSection key={section.text} text={section.text}>
                {section.buttons.map((button) => (
                  <SidebarButton
                    key={button.text}
                    icon={button.icon}
                    text={button.text}
                    goTo={button.goTo}
                  />
                ))}
              </SidebarSection>
            ))}
          </div>
        </div>
      </aside>

      <div className="p-4 sm:ml-64 md:p-8">{children}</div>
    </>
  );
}

import { IconHome } from "@tabler/icons-react";
import { SidebarItem } from "./SidebarItem";
import { Profile } from "./Profile";
import { SidebarDivider } from "./SidebarDivider";

export function Sidebar(props: {
  isOpen: boolean;
  activePage: string;
  onClose: () => void;
  onActivePageChange: (page: string) => void;
}) {
  return (
    <div>
      <div
        onClick={props.onClose}
        className={`fixed inset-0 z-30 bg-black/50 transition-opacity duration-300
          ${props.isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
          sm:hidden`}
      />
      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-full transition-transform bg-[#242424] border-r border-[#424242]
        ${props.isOpen ? "translate-x-0" : "-translate-x-full"} 
        sm:translate-x-0`}
      >
        <div className="h-full px-3 py-4 overflow-y-auto">
          <Profile name="ugokitakunai" />
          <SidebarDivider />
          <SidebarItem
            icon={<IconHome stroke={1} size={22} />}
            title="Home"
            active={props.activePage === "home"}
            onClick={() => {
              window.location.href = "/";
              props.onActivePageChange("home");
            }}
          />
        </div>
      </aside>
    </div>
  );
}

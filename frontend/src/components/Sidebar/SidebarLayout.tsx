import { useState } from "react";
import { Header } from "./Header";
import { Sidebar } from "./SIdebar";

export function SidebarLayout(props: { children: React.ReactNode }) {
  let [isOpen, setIsOpen] = useState(false);
  return (
    <div className="flex h-screen">
      <Sidebar
        isOpen={isOpen}
        activePage="aa"
        onClose={() => setIsOpen(false)}
      />
      <div className="flex-1">
        <div className="sm:ml-52 mb-12 sm:mb-12 transition-all duration-200 ease-in-out">
          {props.children}
        </div>
        <div className="h-1">
          <Header
            title="Home"
            onMenuClick={() => {
              setIsOpen(!isOpen);
            }}
          />
        </div>
      </div>
    </div>
  );
}

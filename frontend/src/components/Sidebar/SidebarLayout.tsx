import { useEffect, useState } from "react";
import { Header } from "./Header";
import { Sidebar } from "./SIdebar";

export function SidebarLayout(props: {
  children: React.ReactNode;
  activePage?: string;
  backPage?: string;
  title: string;
  accentColor?: string;
}) {
  let [isOpen, setIsOpen] = useState(false);
  let [activePage, setActivePage] = useState("home");
  let [backPage, setBackPage] = useState(props.backPage || undefined);

  useEffect(() => {
    if (props.activePage) {
      setActivePage(props.activePage);
    }
    if (props.backPage) {
      setBackPage(props.backPage);
    }
  }, [props.activePage, props.backPage]);

  return (
    <div className="flex h-screen">
      <Sidebar
        isOpen={isOpen}
        activePage={activePage}
        onClose={() => setIsOpen(false)}
        onActivePageChange={(page) => setActivePage(page)}
        accentColor="#7dffdf"
      />
      <div className="flex-1">
        <div className="sm:ml-64 mb-12 sm:mb-12 transition-all duration-200 ease-in-out">
          {props.children}
        </div>
        <div className="h-1">
          <Header
            title={props.title}
            onMenuClick={() => {
              setIsOpen(!isOpen);
            }}
            backPage={backPage}
            accentColor={props.accentColor || "#C0ECE2"}
          />
        </div>
      </div>
    </div>
  );
}

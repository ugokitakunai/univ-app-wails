export function Sidebar(props: {
  isOpen: boolean;
  activePage: string;
  onClose: () => void;
}) {
  return (
    <>
      <div
        onClick={props.onClose}
        className={`fixed inset-0 z-30 bg-black/50 transition-opacity duration-300
          ${props.isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
          sm:hidden`}
      />
      <aside
        className={`fixed top-0 left-0 z-40 w-52 h-full transition-transform bg-sky-100 border-e border-default
        ${props.isOpen ? "translate-x-0" : "-translate-x-full"} 
        sm:translate-x-0`}
      >
        <div className="h-full px-3 py-4 overflow-y-auto">test</div>
      </aside>
    </>
  );
}

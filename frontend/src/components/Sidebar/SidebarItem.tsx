export function SidebarItem(props: {
  icon: React.ReactNode;
  title: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      className={`flex items-center gap-3 py-2 px-2 w-full cursor-pointer`}
      onClick={props.onClick}
      style={{
        color: props.active ? "#5fbdf5" : "white",
      }}
    >
      <div className="w-5 h-5">{props.icon}</div>
      <div>{props.title}</div>
    </div>
  );
}

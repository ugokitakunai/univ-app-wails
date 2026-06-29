export function ListHeading(props: {
  children: React.ReactNode;
  accentColor?: string;
  backPage?: string;
}) {
  let accentColor = props.accentColor || "#C0ECE2";
  return (
    <div className="flex justify-between w-full select-none">
      <div className="items-center w-full">
        <div
          className={`text-lg w-full px-5 py-1 text-black font-semibold items-center`}
          style={{ backgroundColor: accentColor }}
        >
          <div className="flex justify-between w-full gap-3 items-center">
            {props.children}
          </div>
        </div>
      </div>
    </div>
  );
}

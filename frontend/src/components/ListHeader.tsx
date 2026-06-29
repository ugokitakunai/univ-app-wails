export function ListHeader(props: {
  children: React.ReactNode;
  accentColor?: string;
}) {
  let accentColor = props.accentColor || "#C0ECE2";
  return (
    <div className="flex justify-between w-full select-none">
      <div className="items-center w-full">
        <div
          className={`text-xl w-full px-5 py-3 text-black font-bold items-center`}
          style={{ backgroundColor: accentColor }}
        >
          <div className="flex justify-between w-full">{props.children}</div>
        </div>
        <div
          className={`w-full h-2`}
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, ${accentColor}, ${accentColor} 4px, transparent 4px, transparent 10px)`,
          }}
        ></div>
      </div>
    </div>
  );
}

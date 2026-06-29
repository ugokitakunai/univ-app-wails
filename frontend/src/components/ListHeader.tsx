import { IconChevronLeft } from "@tabler/icons-react";

export function ListHeader(props: {
  children: React.ReactNode;
  accentColor?: string;
  backPage?: string;
}) {
  let accentColor = props.accentColor || "#C0ECE2";
  return (
    <div className="flex justify-between w-full select-none">
      <div className="items-center w-full">
        <div
          className={`text-xl w-full px-5 py-3 text-black font-bold items-center`}
          style={{ backgroundColor: accentColor }}
        >
          <div className="flex justify-between w-full gap-3 items-center">
            {props.backPage && (
              <div
                className="flex items-center px-2 rounded-full hover:bg-black/10 cursor-pointer sm:block hidden"
                onClick={() => {
                  window.location.hash = props.backPage!;
                }}
              >
                <IconChevronLeft stroke={2} size={22} />
              </div>
            )}
            {props.children}
          </div>
        </div>
        <div
          className={`w-full h-2`}
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, ${accentColor},  ${accentColor} 4px, transparent 4px, transparent 10px)`,
          }}
        ></div>
      </div>
    </div>
  );
}

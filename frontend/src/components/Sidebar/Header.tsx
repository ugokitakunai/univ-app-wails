import { IconChevronLeft, IconMenu } from "@tabler/icons-react";

export function Header(props: {
  title: string;
  onMenuClick: () => void;
  backPage?: string;
  accentColor?: string;
}) {
  return (
    <>
      <div
        className="fixed text-xl bottom-0 select-none w-full h-12 px-5 py-3 text-black font-bold items-center transition-transform -translate-y-0 sm:translate-y-full"
        style={{ backgroundColor: props.accentColor || "#C0ECE2" }}
      >
        <div className="flex justify-between">
          <div className="flex items-center gap-3">
            {props.backPage && (
              <div
                className="flex items-center gap-2 px-2 rounded-full hover:bg-black/10 cursor-pointer"
                onClick={() => {
                  window.location.hash = props.backPage!;
                }}
              >
                <IconChevronLeft stroke={2} size={22} />
              </div>
            )}

            <div>{props.title}</div>
          </div>
          <div className="flex items-center px-2 gap-2 rounded-full hover:bg-black/10">
            <IconMenu stroke={2} size={22} onClick={props.onMenuClick} />
          </div>
        </div>
      </div>
    </>
  );
}

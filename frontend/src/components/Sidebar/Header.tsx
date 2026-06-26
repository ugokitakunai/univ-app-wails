import { IconMenu } from "@tabler/icons-react";

export function Header(props: { title: string; onMenuClick: () => void }) {
  return (
    <>
      <div className="fixed text-xl bottom-0 bg-[#C0ECE2] w-full h-12 px-5 py-3 text-black font-bold items-center transition-transform -translate-y-0 sm:translate-y-full">
        <div className="flex justify-between">
          <div className="flex items-center gap-3">
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

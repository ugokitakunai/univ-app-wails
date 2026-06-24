export function Button(props: {
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  className?: string;
  value?: string;
}) {
  return (
    <div className={props.className}>
      <button
        className="text-slate-200 text-sm border border-slate-700 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-slate-800 focus:border-slate-400 placeholder:text-slate-500 hover:bg-white hover:text-black trandition duration-200 w-full"
        onClick={(e) => {
          e.preventDefault();
          props.onClick(e);
        }}
      >
        {props.value && <div>{props.value}</div>}
      </button>
    </div>
  );
}

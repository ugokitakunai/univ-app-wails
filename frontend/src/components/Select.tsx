export function Select(props: {
  className?: string;
  disabled?: boolean;
  children: React.ReactNode;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) {
  return (
    <div className={props.className}>
      <select
        className="text-slate-200 text-sm border border-slate-700 bg-[#202020] rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-slate-800 focus:border-slate-400 placeholder:text-slate-500 w-full"
        onChange={props.onChange}
        disabled={props.disabled}
      >
        {props.children}
      </select>
    </div>
  );
}

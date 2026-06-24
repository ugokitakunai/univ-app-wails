export function Input(props: {
  placeholder: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}) {
  return (
    <div className={props.className + " relative"}>
      {props.placeholder && (
        <label className="" htmlFor={props.placeholder.toLowerCase()}>
          {props.placeholder}
        </label>
      )}
      <input
        type={props.type}
        value={props.value}
        onChange={props.onChange}
        className="block text-slate-200 border border-slate-700 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-slate-800 focus:border-slate-400 placeholder:text-slate-500 w-full text-heading bg-transparent peer"
        placeholder={props.placeholder}
      ></input>
    </div>
  );
}

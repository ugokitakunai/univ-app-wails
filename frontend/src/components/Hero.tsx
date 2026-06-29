export function Hero(props: { title: string; subtitle?: string }) {
  return (
    <div>
      <div className="text-2xl font-bold h-36 px-5 py-1 text-white flex flex-col justify-center items-start">
        {props.title}
        {props.subtitle && (
          <div className="text-sm font-normal text-white/80">
            {props.subtitle}
          </div>
        )}
      </div>
    </div>
  );
}

export function Modal(props: {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-100 ease-in-out"
      style={{
        opacity: props.isOpen ? 1 : 0,
        pointerEvents: props.isOpen ? "auto" : "none",
      }}
      onClick={props.onClose}
    >
      <div
        className="rounded-lg p-3 w-11/12 max-w-md bg-[#202020] shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {props.title && (
          <div className="text-xl font-bold mb-4 text-white">{props.title}</div>
        )}
        {props.children}
      </div>
    </div>
  );
}

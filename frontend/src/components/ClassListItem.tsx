export function Button(props: {
  className?: string;
  title: string;
  classRoom: string;
  time: string;
  classId: string;
  active: boolean;
}) {
  return (
    <div className={props.className}>
      <div className="container px-5 py-3 "></div>
    </div>
  );
}

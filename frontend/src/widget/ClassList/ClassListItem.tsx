import { useEffect, useState } from "react";
import { GetTimeSchedule } from "../../../bindings/changeme/lib/meijo/service";

export function ClassListItem(props: {
  className: string;
  title: string;
  classRoom: string;
  classId: string;
  active: boolean;
  period: string;
  accentColor: string;
}) {
  let [time, setTime] = useState("");
  async function getTime() {
    const time = await GetTimeSchedule(parseInt(props.period));
    setTime(time);
  }

  useEffect(() => {
    getTime();
  }, [props.period]);

  const stripeStyle = {
    position: "absolute" as const,
    left: 0,
    top: 0,
    bottom: 0,
    width: "10px",
    backgroundImage: `repeating-linear-gradient(45deg, ${props.accentColor}, ${props.accentColor} 4px, transparent 4px, transparent 10px)`,
  };

  return (
    <div className={props.className}>
      <div className="px-2 py-3 flex items-center justify-center relative">
        <span style={stripeStyle} />

        <div
          className="flex w-16 items-center text-6xl font-semibold h-full justify-center opacity-85 me-2"
          style={{ color: props.active ? props.accentColor : "#FFFFFF50" }}
        >
          {props.period}
        </div>
        <div
          className="flex flex-col flex-1"
          style={{ color: props.active ? "white" : "#FFFFFF90" }}
        >
          <div className="flex flex-2 text-lg">
            <div className="me-3">{props.classRoom}</div>
            <div>{props.title}</div>
          </div>
          <div className="flex-1">{time}</div>
        </div>
      </div>
    </div>
  );
}

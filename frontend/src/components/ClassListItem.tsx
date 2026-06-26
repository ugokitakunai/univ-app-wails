import { useEffect, useState } from "react";
import { GetTimeSchedule } from "../../bindings/changeme/lib/meijo/service";

export function ClassListItem(props: {
  className: string;
  title: string;
  classRoom: string;
  classId: string;
  active: boolean;
  period: string;
}) {
  // active -> border-solid
  // inactive -> border-dashed
  let [time, setTime] = useState("");
  async function getTime() {
    const time = await GetTimeSchedule(parseInt(props.period));
    setTime(time);
  }

  useEffect(() => {
    getTime();
  }, [props.period]);

  return (
    <div className={props.className}>
      <div className="px-2 py-3 flex items-center justify-center relative before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[10px] before:bg-[repeating-linear-gradient(45deg,#F2C7D4,#F2C7D4_4px,transparent_2px,transparent_10px)]">
        <div className="flex w-16 items-center text-6xl font-semibold text-pink-200 h-full justify-center opacity-85 me-2">
          {props.period}
        </div>
        <div className="flex flex-col flex-1">
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

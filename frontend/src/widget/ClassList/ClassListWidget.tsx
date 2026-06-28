import { ScheduleEntry } from "../../../bindings/changeme/lib/meijo";
import { ClassListItem } from "./ClassListItem";
import { ListHeader } from "../../components/ListHeader";
import { useState, useEffect } from "react";
import { GetCurrentPeriod } from "../../../bindings/changeme/lib/meijo/service";

export default function ClassListWidget(props: {
  schedule: ScheduleEntry[];
  currentWeekday?: number;
  onClickRefresh?: () => void;
  onWeekdayChange?: (e: number) => void;
}) {
  let days = ["日", "月", "火", "水", "木", "金", "土"];
  let accentColor = "#d3faf1";

  const [currentPeriod, setCurrentPeriod] = useState<number>(-1);

  useEffect(() => {
    async function updatePeriod() {
      try {
        const period = await GetCurrentPeriod();
        setCurrentPeriod(period);
      } catch (e) {
        console.error("Failed to get current period:", e);
      }
    }

    updatePeriod();

    const timer = setInterval(updatePeriod, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="">
      <ListHeader accentColor={accentColor}>
        <div>授業一覧</div>
        {props.currentWeekday !== undefined && (
          <div className="flex items-center">
            : {days[props.currentWeekday]}
          </div>
        )}
      </ListHeader>
      <div className="">
        {props.schedule.map((entry) => (
          <ClassListItem
            key={entry.period}
            className="mt-3"
            title={entry.className}
            classRoom={entry.room}
            classId={entry.code}
            period={entry.period.toString()}
            active={entry.period === currentPeriod}
            accentColor={accentColor}
          />
        ))}
        {props.schedule.length == 0 && (
          <>
            <div className="text-center text-gray-500 py-4">
              登録されている授業はありません
            </div>
          </>
        )}
      </div>
    </div>
  );
}

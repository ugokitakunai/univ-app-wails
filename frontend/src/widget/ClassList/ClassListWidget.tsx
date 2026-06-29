import { ScheduleEntry } from "../../../bindings/changeme/lib/meijo";
import { ClassListItem } from "./ClassListItem";
import { useState, useEffect } from "react";
import { GetCurrentPeriod } from "../../../bindings/changeme/lib/meijo/service";
import { IconQueuePopOut } from "@tabler/icons-react";
import { ListHeader } from "../../components/ListHeader";
import { GetBestTextColorForAccent } from "../../../bindings/changeme/lib/settings/settings";

export default function ClassListWidget(props: {
  schedule: ScheduleEntry[];
  currentWeekday?: number;
  onClickRefresh?: () => void;
  onWeekdayChange?: (e: number) => void;
  accentColor?: string;
}) {
  let days = ["日", "月", "火", "水", "木", "金", "土"];
  let accentColor = props.accentColor || "#d3faf1";

  const [currentPeriod, setCurrentPeriod] = useState<number>(-1);
  currentPeriod;
  let [textColor, setTextColor] = useState("#000000");

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
    async function GetTextColorForAccent(accentColor: string) {
      await GetBestTextColorForAccent(accentColor).then((charColor) => {
        setTextColor(charColor);
      });
    }
    GetTextColorForAccent(accentColor).catch((err) => {
      console.error("Error fetching best text color:", err);
    });

    const timer = setInterval(updatePeriod, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="">
      <ListHeader accentColor={accentColor}>
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-3" style={{ color: textColor }}>
            <div>授業一覧</div>
            {props.currentWeekday !== undefined && (
              <div className="flex items-center">
                : {days[props.currentWeekday]}
              </div>
            )}
          </div>
          <div
            className="flex px-2 gap-2 rounded-full hover:bg-black/10 cursor-pointer"
            onClick={() => {
              window.location.href = "/#/class";
            }}
          >
            <IconQueuePopOut stroke={2} />
          </div>
        </div>
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
            active={true}
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

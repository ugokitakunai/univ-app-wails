import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { ScheduleEntry } from "../../bindings/changeme/lib/meijo";
import { ClassListItem } from "../components/ClassListItem";

export default function ClassListWidget(props: {
  schedule: ScheduleEntry[];
  currentWeekday?: number;
  onClickRefresh?: () => void;
  onWeekdayChange?: (e: number) => void;
}) {
  let days = ["日", "月", "火", "水", "木", "金", "土"];
  return (
    <div className="border-y border-gray-900">
      <div className="flex justify-between w-full">
        <div className="items-center w-full">
          <div className="text-xl bg-[#C0ECE2] w-full px-5 py-3 text-black font-bold items-center">
            <div className="flex justify-between">
              <div className="flex items-center gap-3">
                {props.currentWeekday !== undefined && (
                  <div className="flex items-center">
                    <IconChevronLeft stroke={2.5} size={22} />
                    {days[props.currentWeekday]}
                    <IconChevronRight stroke={2.5} size={22} />
                  </div>
                )}
                <div>授業一覧</div>
              </div>
              {props.onClickRefresh && <button />}
            </div>
          </div>
          <div className="w-full h-2 bg-[repeating-linear-gradient(45deg,#C0ECE2,#C0ECE2_4px,transparent_1px,transparent_10px)]"></div>
        </div>
      </div>
      <div className="mt-2">
        {props.schedule.map((entry) => (
          <ClassListItem
            key={entry.period}
            className="mt-3"
            title={entry.className}
            classRoom={entry.room}
            classId={entry.code}
            period={entry.period.toString()}
            active={true}
          />
        ))}
      </div>
    </div>
  );
}

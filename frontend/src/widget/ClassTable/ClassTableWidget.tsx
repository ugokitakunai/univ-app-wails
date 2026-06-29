import { useEffect, useState } from "react";
import { GetScheduleFromStorage } from "../../../bindings/changeme/lib/meijo/service";
import { ScheduleEntry } from "../../../bindings/changeme/lib/meijo";
import { ListHeader } from "../../components/ListHeader";

export function ClassTable(props: { accentColor?: string }) {
  let [schedule, setSchedule] = useState<ScheduleEntry[]>([]);
  useEffect(() => {
    async function fetchSchedule() {
      let sc = await GetScheduleFromStorage(-1);
      if (sc === null) {
        sc = [];
      }
      setSchedule(sc);
      console.log(`Fetched schedule: ${JSON.stringify(schedule)}`);
    }
    fetchSchedule().catch((err) => {
      console.error("Error fetching schedule:", err);
    });
  }, []);
  return (
    <div>
      <ListHeader accentColor={props.accentColor || "#C0ECE2"}>
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-3">
            <div>授業一覧</div>
          </div>
        </div>
      </ListHeader>
      <table className="w-full mt-2 table-fixed">
        <thead className="text-black">
          <tr style={{ backgroundColor: props.accentColor || "#C0ECE2" }}>
            <th className="text-center w-10">#</th>
            <th className="text-center">月</th>
            <th className="text-center">火</th>
            <th className="text-center">水</th>
            <th className="text-center">木</th>
            <th className="text-center">金</th>
            <th className="text-center">土</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 7 }, (_, period) => (
            <tr key={period}>
              <td className="border-r border-b border-[#424242] text-center py-2">
                {period + 1}
              </td>
              {Array.from({ length: 6 }, (_, weekday) => {
                const entry = schedule.find(
                  (e) => e.period === period + 1 && e.weekday - 1 === weekday,
                );
                return (
                  <td
                    key={weekday}
                    className="border-l border-b border-[#424242] text-center px-1 py-1"
                  >
                    {entry && (
                      <div>
                        <div>{entry.className}</div>
                        <div>{entry.room}</div>
                      </div>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

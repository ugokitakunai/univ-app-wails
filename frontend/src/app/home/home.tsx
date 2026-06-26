import { useEffect, useState } from "react";
import {
  GetSchedule,
  GetScheduleFromStorage,
} from "../../../bindings/changeme/lib/meijo/service";
import ClassListWidget from "../../widget/ClassListWidget";
import { ScheduleEntry } from "../../../bindings/changeme/lib/meijo";

export default function Home() {
  let [schedule, setSchedule] = useState<ScheduleEntry[]>([]);

  async function fetchSchedule() {
    let schedule = await GetScheduleFromStorage(1);
    if (schedule !== null) {
      setSchedule(schedule);
    }
  }

  async function refreshSchedule() {
    let schedule = await GetSchedule();
    if (schedule !== null) {
      setSchedule(schedule);
    }
  }

  useEffect(() => {
    fetchSchedule().catch((err) => {
      console.error("Error fetching schedule:", err);
    });
  }, []);

  return (
    <div className="mx-2 my-2">
      <ClassListWidget schedule={schedule} onRefresh={refreshSchedule} />
    </div>
  );
}

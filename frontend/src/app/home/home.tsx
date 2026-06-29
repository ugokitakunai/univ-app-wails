import { useEffect, useState } from "react";
import {
  GetSchedule,
  GetScheduleFromStorage,
} from "../../../bindings/changeme/lib/meijo/service";
import ClassListWidget from "../../widget/ClassList/ClassListWidget";
import { ScheduleEntry } from "../../../bindings/changeme/lib/meijo";
import { SidebarLayout } from "../../components/Sidebar/SidebarLayout";
import { DateChangeListener } from "../../utils/dateChangeListener";

export default function Home() {
  let [schedule, setSchedule] = useState<ScheduleEntry[]>([]);
  let [currentWeekday, setCurrentWeekday] = useState<number>(
    new Date().getDay(),
  );

  async function fetchSchedule(weekday?: number) {
    if (weekday === undefined) {
      weekday = new Date().getDay();
    }

    let schedule = await GetScheduleFromStorage(weekday);
    if (schedule !== null) {
      setSchedule(schedule);
    }

    console.log(`Fetched schedule: ${JSON.stringify(schedule)}`);
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
    const listener = new DateChangeListener(() => {
      setCurrentWeekday(new Date().getDay());
      setSchedule([]);
      fetchSchedule(currentWeekday).catch((err) => {
        console.error("Error fetching schedule:", err);
      });
    });
    listener.start();
    return () => listener.stop();
  }, []);

  return (
    <SidebarLayout title="Home">
      <ClassListWidget
        schedule={schedule}
        onClickRefresh={refreshSchedule}
        onWeekdayChange={(weekday) => {
          setCurrentWeekday(weekday);
        }}
        currentWeekday={currentWeekday}
      />
    </SidebarLayout>
  );
}

import { useEffect, useState, useRef } from "react";
import {
  GetSchedule,
  GetScheduleFromStorage,
} from "../../../bindings/changeme/lib/meijo/service";
import ClassListWidget from "../../widget/ClassList/ClassListWidget";
import { ClassTable } from "../../widget/ClassTable/ClassTableWidget";
import { ScheduleEntry } from "../../../bindings/changeme/lib/meijo";
import { SidebarLayout } from "../../components/Sidebar/SidebarLayout";
import { DateChangeListener } from "../../utils/dateChangeListener";
import { Widget } from "../../../bindings/changeme/lib/settings";
import { GetWidgets } from "../../../bindings/changeme/lib/settings/settings";

export default function Home() {
  const [schedule, setSchedule] = useState<ScheduleEntry[]>([]);
  const [currentWeekday, setCurrentWeekday] = useState<number>(
    new Date().getDay(),
  );
  const [sidebarColor, setSidebarColor] = useState("#9af1dd");
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const widgetRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    GetWidgets().then((settings) => {
      if (settings) {
        const sorted = [...settings].sort((a, b) => a.position - b.position);
        setWidgets(sorted);
      }
    });

    fetchSchedule().catch(console.error);

    const listener = new DateChangeListener(() => {
      setCurrentWeekday(new Date().getDay());
      setSchedule([]);
      fetchSchedule(currentWeekday).catch(console.error);
    });
    listener.start();
    return () => listener.stop();
  }, []);

  useEffect(() => {
    if (widgets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const widgetId = entry.target.getAttribute("data-widget-id");
            const activeWidget = widgets.find((w) => w.widgetId === widgetId);

            if (activeWidget) {
              setSidebarColor(activeWidget.accentColor);
            }
          }
        });
      },
      {
        rootMargin: "-30% 0px -70% 0px",
        threshold: 0,
      },
    );

    Object.values(widgetRefs.current).forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [widgets]);

  async function fetchSchedule(weekday?: number) {
    if (weekday === undefined) weekday = new Date().getDay();
    let schedule = await GetScheduleFromStorage(weekday);
    if (schedule !== null) setSchedule(schedule);
  }

  async function refreshSchedule() {
    let schedule = await GetSchedule();
    if (schedule !== null) setSchedule(schedule);
  }

  const renderWidget = (widget: Widget) => {
    switch (widget.widgetId) {
      case "classList":
        return (
          <ClassListWidget
            schedule={schedule}
            onClickRefresh={refreshSchedule}
            onWeekdayChange={setCurrentWeekday}
            currentWeekday={currentWeekday}
            accentColor={widget.accentColor}
          />
        );
      case "classTable":
        return <ClassTable accentColor={widget.accentColor} />;
      default:
        return null;
    }
  };

  return (
    <div style={{ transition: "all 0.5s ease" }} className="w-full h-full">
      <SidebarLayout title="Home" accentColor={sidebarColor}>
        <div className="flex flex-col gap-19">
          {widgets.map((widget) => (
            <div
              key={widget.widgetId}
              data-widget-id={widget.widgetId}
              ref={(el) => {
                widgetRefs.current[widget.widgetId] = el;
              }}
            >
              {renderWidget(widget)}
            </div>
          ))}
        </div>
      </SidebarLayout>
    </div>
  );
}

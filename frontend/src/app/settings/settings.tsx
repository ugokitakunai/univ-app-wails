import { useEffect, useState, useRef } from "react";
import { ListHeader } from "../../components/ListHeader";
import { SidebarLayout } from "../../components/Sidebar/SidebarLayout";
import {
  GetBestTextColorForAccent,
  GetWidgets,
  SetWidgets,
} from "../../../bindings/changeme/lib/settings/settings";
import { DragDropProvider } from "@dnd-kit/react";
import { useSortable } from "@dnd-kit/react/sortable";
import { isSortable } from "@dnd-kit/react/sortable";
import { Widget } from "../../../bindings/changeme/lib/settings/models";
import { Button } from "../../components/Button";
import { Modal } from "../../components/Modal";
import { Select } from "../../components/Select";
import { IconMenu, IconPalette, IconTrash } from "@tabler/icons-react";
import { HexColorPicker } from "react-colorful";

const availableWidgets = ["classList", "classTable"];
const friendlyNames: { [key: string]: string } = {
  classList: "授業一覧(1日)",
  classTable: "授業一覧(週)",
};

function SortableWidget({
  widget,
  index,
  onClickRemove,
  onClickChangeColor,
}: {
  widget: Widget;
  index: number;
  onClickRemove?: (pos: number) => void;
  onClickChangeColor?: (widgetId: string) => void;
}) {
  const handleRef = useRef<SVGSVGElement>(null);
  const { ref } = useSortable({
    id: widget.widgetId,
    index,
    handle: handleRef,
  });

  const [color, setColor] = useState(widget.accentColor || "#6eb0fc");

  useEffect(() => {
    setColor(widget.accentColor || "#6eb0fc");
    async function getCharColor() {
      await GetBestTextColorForAccent(widget.accentColor || "#6eb0fc").then(
        (charColor) => {
          widget.charColor = charColor;
        },
      );
    }
    getCharColor().catch((err) => {
      console.error("Error fetching best text color:", err);
    });
  }, [widget.accentColor]);

  return (
    <div ref={ref} className="p-2 mb-2" style={{ backgroundColor: color }}>
      <div
        className="font-semibold flex justify-between items-center"
        style={{ color: widget.charColor || "#000000" }}
      >
        <IconMenu
          ref={handleRef}
          color={widget.charColor || "#000000"}
          style={{ cursor: "grab" }}
        />
        {friendlyNames[widget.widgetId] || widget.widgetId}
        <div className="flex gap-4">
          <IconPalette
            color={widget.charColor || "#000000"}
            onClick={() => {
              if (onClickChangeColor) onClickChangeColor(widget.widgetId);
            }}
          />
          <IconTrash
            color={widget.charColor || "#000000"}
            onClick={() => {
              if (onClickRemove) onClickRemove(index);
            }}
          />
        </div>
      </div>
    </div>
  );
}

export function Settings() {
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const colors = ["#EFBCF8", "#A0FFF2", "#9EFFD0", "#FFF5A8"];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [changingColorWidgetId, setChangingColorWidgetId] = useState<
    string | null
  >(null);

  useEffect(() => {
    GetWidgets()
      .then((settings) => {
        if (settings) {
          const sorted = [...settings].sort((a, b) => a.position - b.position);
          console.log("Fetched widgets:", sorted);
          setWidgets(sorted);
        }
      })
      .catch((err) => {
        console.error("Error fetching widgets:", err);
      });
  }, []);

  return (
    <SidebarLayout title="Settings" activePage="settings" accentColor="#6eb0fc">
      {/* Add Widget*/}
      <Modal
        onClose={() => {
          setIsModalOpen(false);
        }}
        isOpen={isModalOpen}
      >
        <div className="p-4">
          <div className="text-lg font-semibold mb-2">ウィジェットの追加</div>
          <Select
            className="mb-2"
            onChange={(e) => {
              const newWidget: Widget = {
                widgetId: e.target.value,
                position: widgets.length,
                accentColor: colors[widgets.length % colors.length],
                charColor: "#000000",
              };
              if (widgets.some((w) => w.widgetId === newWidget.widgetId)) {
                e.target.value = "";
                return;
              }
              setWidgets([...widgets, newWidget]);
              setIsModalOpen(false);
              e.target.value = "";
            }}
          >
            <option value="">Select...</option>
            {availableWidgets.map((widgetId) => (
              <option value={widgetId}>{widgetId}</option>
            ))}
          </Select>
        </div>
      </Modal>

      {/* Change Color */}
      <Modal
        onClose={() => setChangingColorWidgetId(null)}
        isOpen={changingColorWidgetId !== null}
      >
        <div className="p-4">
          <div className="text-lg font-semibold mb-2">
            ウィジェットの色を変更
          </div>
          <HexColorPicker
            color={
              widgets.find((w) => w.widgetId === changingColorWidgetId)
                ?.accentColor || "#6eb0fc"
            }
            onChange={(newColor) => {
              setWidgets((prevWidgets) =>
                prevWidgets.map((w) =>
                  w.widgetId === changingColorWidgetId
                    ? { ...w, accentColor: newColor, charColor: "#000000" }
                    : w,
                ),
              );
            }}
          />
        </div>
      </Modal>

      <ListHeader accentColor="#6eb0fc">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-3">
            <div>設定</div>
          </div>
        </div>
      </ListHeader>
      <div className="p-4">
        <div className="mt-4">
          <div className="text-lg font-semibold mb-2">Widgets</div>
          <DragDropProvider
            onDragEnd={(event) => {
              if (event.canceled) return;

              const { source } = event.operation;

              if (isSortable(source)) {
                const { initialIndex, index } = source;

                if (initialIndex !== index) {
                  setWidgets((prev) => {
                    const next = [...prev];
                    const [removed] = next.splice(initialIndex, 1);
                    next.splice(index, 0, removed);
                    return next.map((w, i) => ({ ...w, position: i }));
                  });
                }
              }
            }}
          >
            {widgets.map((widget, index) => (
              <SortableWidget
                key={widget.widgetId}
                widget={widget}
                index={index}
                onClickRemove={(idx) => {
                  setWidgets((prev) =>
                    prev
                      .filter((_, i) => i !== idx)
                      .map((w, i) => ({ ...w, position: i })),
                  );
                }}
                onClickChangeColor={(widgetId) => {
                  setChangingColorWidgetId(widgetId);
                }}
              />
            ))}
          </DragDropProvider>
          <Button
            onClick={() => {
              setIsModalOpen(true);
            }}
            value="ウィジェットを追加"
          />
          <Button
            onClick={async () => {
              await SetWidgets(widgets);
            }}
            className="mt-4"
            value="保存"
          />
        </div>
      </div>
    </SidebarLayout>
  );
}

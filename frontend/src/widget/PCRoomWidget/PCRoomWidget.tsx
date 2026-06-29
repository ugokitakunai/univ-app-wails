import { useEffect, useState } from "react";
import { PCRoomStatus } from "../../../bindings/changeme/lib/meijo";
import { GetPCRoomStatus } from "../../../bindings/changeme/lib/meijo/service";
import { ListHeader } from "../../components/ListHeader";
import { GetBestTextColorForAccent } from "../../../bindings/changeme/lib/settings/settings";
import { IconRefresh } from "@tabler/icons-react";

export function PCRoomWidget(props: { accentColor?: string }) {
  let [pcRoomData, setPCRoomData] = useState<PCRoomStatus[]>([]);
  let [textColor, setTextColor] = useState("#000000");
  async function refreshPCRoomData() {
    let campus = "tempaku"; // Default campus
    let data: PCRoomStatus[] | null = await GetPCRoomStatus(campus);
    if (data === null) {
      data = [];
    }
    setPCRoomData(data);
  }

  useEffect(() => {
    refreshPCRoomData;
    pcRoomData;
    async function GetTextColorForAccent(accentColor: string) {
      await GetBestTextColorForAccent(accentColor).then((charColor) => {
        setTextColor(charColor);
      });
    }
    GetTextColorForAccent(props.accentColor || "#C0ECE2").catch((err) => {
      console.error("Error fetching best text color:", err);
    });
  }, []);
  return (
    <ListHeader accentColor={props.accentColor || "#C0ECE2"}>
      <div
        className="flex justify-between items-center w-full"
        style={{ color: textColor }}
      >
        <div className="flex items-center gap-3">
          <div>情報処理教室</div>
        </div>
        <IconRefresh color={textColor} />
      </div>
    </ListHeader>
  );
}

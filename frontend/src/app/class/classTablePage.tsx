import { SidebarLayout } from "../../components/Sidebar/SidebarLayout";
import { ClassTable } from "../../widget/ClassTable/ClassTableWidget";

export function ClassTablePage() {
  return (
    <SidebarLayout
      activePage="class"
      backPage="/home"
      title="Class"
      accentColor="#C0ECE2"
    >
      <div>
        <ClassTable accentColor="#C0ECE2"></ClassTable>
      </div>
    </SidebarLayout>
  );
}

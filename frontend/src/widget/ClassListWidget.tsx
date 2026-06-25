import { ClassListItem } from "../components/ClassListItem";

export default function ClassListWidget() {
  return (
    <div className="border-y border-gray-900">
      <div className="flex justify-between w-full">
        <div className="items-center w-full">
          <div className="text-xl bg-[#C0ECE2] w-full px-5 py-3 text-black font-bold items-center">
            授業一覧
          </div>
          <div className="w-full h-2 bg-[repeating-linear-gradient(45deg,#C0ECE2,#C0ECE2_4px,transparent_1px,transparent_10px)]"></div>
        </div>
      </div>
      <div className="mt-2">
        <ClassListItem
          className=""
          title="材料力学1"
          classRoom="E-101"
          time="10:00-11:30"
          classId="123123"
          period="1"
          active={false}
        />
        <ClassListItem
          className="mt-3"
          title="材料力学1"
          classRoom="E-101"
          time="10:00-11:30"
          classId="123123"
          period="2"
          active={false}
        />
        <ClassListItem
          className="mt-3"
          title="材料力学1"
          classRoom="E-101"
          time="10:00-11:30"
          classId="123123"
          period="3"
          active={false}
        />
      </div>
    </div>
  );
}

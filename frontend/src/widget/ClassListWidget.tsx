import { ClassListItem } from "../components/ClassListItem";

export default function ClassListWidget() {
  return (
    <div className="py-3 border-y border-gray-900">
      <div className="flex justify-between w-full">
        <div className="flex items-center">
          <div className="text-xl">授業一覧</div>
        </div>
      </div>
      <div className="mt-3">
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

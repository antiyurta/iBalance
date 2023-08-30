import { FilteredColumns } from "@/service/consumer/entities";
import { Space, Tag } from "antd";

interface IProps {
  columns: FilteredColumns;
  isActive: (key: any, state: boolean) => void;
}

const Filtered = (props: IProps) => {
  const { columns, isActive } = props;
  return (
    <div
      className="extra"
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        gap: 24,
        width: "100%",
      }}
    >
      <Space size={[6, 6]} wrap>
        {Object.entries(columns)?.map(([key, value]) => {
          if (value.isFiltered) {
            return (
              <Tag closable onClose={() => isActive(key, false)} key={key}>
                {value.label}
              </Tag>
            );
          }
        })}
      </Space>
    </div>
  );
};
export default Filtered;

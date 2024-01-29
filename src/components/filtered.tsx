import { useTypedSelector } from "@/feature/store/reducer";
import { AppDispatch } from "@/feature/store/store";
import { Space, Tag } from "antd";
import { useDispatch } from "react-redux";

interface IProps {
  columns: object;
  isActive: (key: any, state: boolean) => void;
}

const Filtered = (props: IProps) => {
  const { columns, isActive } = props;
  const { activeKey, tabItems } = useTypedSelector((state) => state.tabs);
  const currentTab = tabItems.find((item) => item.key == activeKey);
  const dispatch = useDispatch<AppDispatch>();
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
        {Object?.entries(columns)?.map(([key, value]) => {
          if (value.isFiltered) {
            return (
              <Tag closable onClose={() => isActive(key, false)} key={key}>
                {value.label}
              </Tag>
            );
          }
        })}
      </Space>
      <button
        onClick={() => {
          {
            Object.entries(columns)?.map(([key, value]) => {
              if (value.isFiltered) {
                isActive(key, false);
              }
            });
          }
        }}
      >
        Цэвэрлэх
      </button>
    </div>
  );
};
export default Filtered;

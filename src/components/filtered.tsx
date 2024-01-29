import { useTypedSelector } from "@/feature/store/reducer";
import { changeParam } from "@/feature/store/slice/tab.slice";
import { AppDispatch } from "@/feature/store/store";
import { ColumnType } from "@/service/entities";
import { Space, Tag } from "antd";
import { useDispatch } from "react-redux";

interface IProps {
  columns: object;
}

const Filtered = (props: IProps) => {
  const { columns } = props;
  const { activeKey, tabItems } = useTypedSelector((state) => state.tabs);
  const currentTab = tabItems.find((item) => item.key == activeKey);
  const data = Object.entries(columns)?.map(
    ([key, value]: [any, ColumnType]) => {
      return value;
    }
  );
  const filters = currentTab?.param.filters || [];
  const dispatch = useDispatch<AppDispatch>();
  const filteredData: ColumnType[] = [];
  data.forEach((dataItem) => {
    filters?.forEach((filterItem) => {
      const commonIndexes = dataItem.dataIndex.filter((index) =>
        filterItem.dataIndex.includes(index)
      );
      if (commonIndexes.length > 0) {
        filteredData.push(dataItem);
      }
    });
  });
  const closeFilter = (dataIndex: string[]) => {
    const existingFilterIndex = filters.findIndex(
      (filter) => JSON.stringify(filter.dataIndex) === JSON.stringify(dataIndex)
    );
    if (existingFilterIndex !== -1 && currentTab) {
      const newFilters = filters.filter(
        (_, index) => index !== existingFilterIndex
      );
      dispatch(
        changeParam({
          ...currentTab.param,
          filters: newFilters,
          page: 1,
          limit: 10,
        })
      );
    }
  };
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
        {filteredData.map((item, index) => (
          <Tag closable onClose={() => closeFilter(item.dataIndex)} key={index}>
            {item.label}
          </Tag>
        ))}
      </Space>
      <button
        onClick={() =>
          currentTab &&
          dispatch(
            changeParam({
              ...currentTab.param,
              filters: [],
              page: 1,
              limit: 10,
            })
          )
        }
      >
        Цэвэрлэх
      </button>
    </div>
  );
};
export default Filtered;

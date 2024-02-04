import { getParam } from "@/feature/common";
import { useTypedSelector } from "@/feature/store/reducer";
import { changeParam } from "@/feature/store/slice/param.slice";
import { AppDispatch } from "@/feature/store/store";
import { ColumnType, RadioType } from "@/service/entities";
import { Space, Tag } from "antd";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

interface IProps {
  columns: object;
}

const Filtered = (props: IProps) => {
  const { columns } = props;
  const { activeKey, items } = useTypedSelector((state) => state.pane);
  const param = getParam(items, activeKey);
  const data = Object.entries(columns)?.map(([_, value]: [any, ColumnType]) => {
    return value;
  });
  const filters = param?.filters || [];
  const dispatch = useDispatch<AppDispatch>();
  const filteredData: ColumnType[] = [];
  data.forEach((dataItem) => {
    filters?.forEach((filterItem) => {
      if (
        JSON.stringify(dataItem.dataIndex) ===
        JSON.stringify(filterItem.dataIndex)
      ) {
        filteredData.push(dataItem);
      }
    });
  });
  const closeFilter = (dataIndex: string[]) => {
    const existingFilterIndex = filters.findIndex(
      (filter) => JSON.stringify(filter.dataIndex) === JSON.stringify(dataIndex)
    );
    if (existingFilterIndex !== -1) {
      const newFilters = filters.filter(
        (_, index) => index !== existingFilterIndex
      );
      dispatch(
        changeParam({
          ...param,
          filters: newFilters,
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
          dispatch(
            changeParam({
              filters: [],
              page: 1,
              limit: 10,
              order: "DESC",
              orderParam: ["createdAt"],
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

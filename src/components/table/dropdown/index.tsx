import { useEffect, useState } from "react";
import { DataIndexType, IParam, RadioType, ToolsIcons } from "@/service/entities";
import { typeOfFilters } from "@/feature/common";
import Sorter from "./sorter";
import DropdownSearch from "./search";
import DropdownTitle from "./title";
import CheckboxGroup from "./checkbox-group";
import { useRouter } from "next/navigation";
import { useTypedSelector } from "@/feature/store/reducer";

interface IProps {
  label: string;
  dataIndex: string;
  type: DataIndexType;
  filters: number[] | string[] | boolean[];
  isFiltered: boolean;
  params: IParam;
  handleSearch: (params: object, state: boolean) => void;
}
type TypeCheck = number | string | boolean;
interface IFilterType {
  text: string;
  value: TypeCheck;
}
const NewDropdown = (props: IProps) => {
  const { label, dataIndex, type, filters, isFiltered, handleSearch } = props;
  const { activeKey, tabItems } = useTypedSelector((state) => state.tabs);
  const currentTab = tabItems.find((item) => item.key == activeKey);
  const [tool, setTool] = useState<keyof typeof ToolsIcons>(
    (type === "NUMBER" && "EQUALS") || (type === "DATE" && "EQUALS") || "EQUALS"
  );
  const [params, setParams] = useState<IParam>({
    page: 1,
    limit: 10,
    order: RadioType.DESC,
    filters: [],
  });
  const [checkboxs, setCheckboxs] = useState<IFilterType[]>([]);
  const [filterText, setFilterText] = useState<string>();
  const [filterCheckboxes, setFilterCheckboxes] = useState<IFilterType[]>([]);

  const configureSearch = (isState?: boolean) => {
    handleSearch(params, isState ? true : false);
  };
  const filterCheckbox = (value?: TypeCheck): IFilterType[] => {
    if (!value) {
      return checkboxs;
    } else {
      if (tool == "CONTAINS") {
        return checkboxs.filter((item) =>
          item.text.toLowerCase().includes(value.toString().toLowerCase())
        );
      } else if (tool == "EQUALS") {
        return checkboxs.filter((item) => item.text == value.toString());
      } else if (tool == "IS_GREATER" && typeof value == "number") {
        return checkboxs.filter((item) => Number(item.text) > value);
      } else if (tool == "IS_GREATOR_OR_EQUAL" && typeof value == "number") {
        return checkboxs.filter((item) => Number(item.text) >= value);
      } else if (tool == "IS_LESS" && typeof value == "number") {
        return checkboxs.filter((item) => Number(item.text) < value);
      } else if (tool == "IS_LESS_OR_EQUAL" && typeof value == "number") {
        return checkboxs.filter((item) => Number(item.text) <= value);
      } else return checkboxs;
    }
  };
  const gg = async () => {
    const dd: IFilterType[] = await typeOfFilters({
      type: type,
      filters: filters,
    });
    setCheckboxs(dd);
  };
  useEffect(() => {
    if (filters && type) {
      gg();
    }
  }, [filters, type]);
  useEffect(() => {
    setFilterCheckboxes(filterCheckbox(filterText));
  }, [filterText]);
  useEffect(() => {
    setFilterCheckboxes(checkboxs);
  }, [checkboxs]);
  return (
    <div
      style={{
        display: "flex",
        padding: 16,
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 8,
        borderRadius: 8,
        background: "white",
        boxShadow: "0px 8px 16px 0px rgba(0, 0, 0, 0.15)",
      }}
      onKeyDown={(e) => e.stopPropagation()}
    >
      <div
        style={{
          display: "flex",
          width: 248,
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 8,
        }}
      >
        <DropdownTitle>Эрэмбэлэх</DropdownTitle>
        <Sorter dataIndex={dataIndex} />
        <div
          style={{
            width: "100%",
            height: 1,
            backgroundColor: "#DEE2E6",
          }}
        />
        <DropdownTitle>Хайх</DropdownTitle>
        <DropdownSearch type={type} />
        {
          type != (DataIndexType.DATE || DataIndexType.DATETIME) && <CheckboxGroup
            options={filters.map((item) => ({
              value: String(item),
              label: String(item),
            }))}
          />
        }
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: 20,
          alignSelf: "stretch",
        }}
      >
        <button
          onClick={() => {
            setParams({
              page: 1,
              limit: 10,
              order: RadioType.DESC,
              filters: [],
            });
            configureSearch(true);
            handleSearch(params, false);
          }}
          className="app-button-regular"
          style={{
            color: "#198754",
          }}
        >
          Цэвэрлэх
        </button>
        <button
          onClick={() => configureSearch(false)}
          className="app-button-regular"
          style={{
            color: "white",
            backgroundColor: "#198754",
            border: "1px solid #198754",
          }}
        >
          Хайх
        </button>
      </div>
    </div>
  );
};
export default NewDropdown;

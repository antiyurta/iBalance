import { useEffect, useState } from "react";
import {
  NewCheckbox,
  NewCheckboxGroup,
  NewDatePicker,
  NewInput,
  NewInputNumber,
  NewRadio,
  NewRadioGroup,
} from "./input";
import { Popover, Space } from "antd";
import Image from "next/image";
import {
  DataIndexType,
  Queries,
  RadioType,
  ToolsIcons,
} from "@/service/entities";
import { typeOfFilters } from "@/feature/common";

import { SearchOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";

interface IProps {
  label: string;
  dataIndex: string;
  type: DataIndexType;
  filters: number[] | string | boolean[];
  isFiltered: boolean;
  handleSearch: (params: object, state: boolean) => void;
}
type TypeCheck = number | string | boolean;
interface IParam {
  page: number;
  limit: number;
  order: RadioType;
  queries: Queries[];
}
interface IFilterType {
  text: string;
  value: TypeCheck;
}
const DropDown = (props: IProps) => {
  const { label, dataIndex, type, filters, isFiltered, handleSearch } = props;
  const [radioValue, setRadioValue] = useState<keyof typeof RadioType>();
  const [tool, setTool] = useState<keyof typeof ToolsIcons>(
    (type === "NUMBER" && "EQUALS") || (type === "DATE" && "EQUALS") || "EQUALS"
  );
  const [params, setParams] = useState<IParam>({
    page: 1,
    limit: 10,
    order: RadioType.DESC,
    queries: [],
  });
  const [datePickerValue, setDatePickerValue] = useState<any>();
  const [checkboxs, setCheckboxs] = useState<IFilterType[]>([]);
  const [filterCheckboxes, setFilterCheckboxes] = useState<IFilterType[]>([]);
  const [checkedList, setCheckedList] = useState<TypeCheck[]>([]);
  let indeterminate =
    checkedList.length > 0 && checkedList.length < checkboxs.length;
  const onCheckAllChange = (e: any) => {
    setCheckedList(
      e.target.checked ? checkboxs?.map((checkbox: any) => checkbox.value) : []
    );
  };
  const onChange = (list: TypeCheck[]) => {
    setCheckedList(list);
  };
  const checkAll = checkboxs?.length === checkedList.length;
  const Tools = () => {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "4px",
        }}
      >
        <button onClick={() => setTool("EQUALS")} className="popupButton">
          <Image src={ToolsIcons.EQUALS} width={16} height={16} alt="edit" />
          <p
            style={{
              color: "black",
              margin: 0,
              fontSize: "14px",
              fontWeight: 400,
              lineHeight: "16px",
            }}
          >
            Equals
          </p>
        </button>
        <button onClick={() => setTool("NOT_EQUAL")} className="popupButton">
          <Image src={ToolsIcons.NOT_EQUAL} width={16} height={16} alt="edit" />
          <p
            style={{
              color: "black",
              margin: 0,
              fontSize: "14px",
              fontWeight: 400,
              lineHeight: "16px",
            }}
          >
            Does not equals
          </p>
        </button>
        <button
          disabled={type === "NUMBER" || type === "DATE"}
          onClick={() => setTool("CONTAINS")}
          className="popupButton"
        >
          <Image src={ToolsIcons.CONTAINS} width={16} height={16} alt="edit" />
          <p
            style={{
              color: "black",
              margin: 0,
              fontSize: "14px",
              fontWeight: 400,
              lineHeight: "16px",
            }}
          >
            Contains
          </p>
        </button>
        <button onClick={() => setTool("NOT_CONTAINS")} className="popupButton">
          <Image
            src={ToolsIcons.NOT_CONTAINS}
            width={16}
            height={16}
            alt="edit"
          />
          <p
            style={{
              color: "black",
              margin: 0,
              fontSize: "14px",
              fontWeight: 400,
              lineHeight: "16px",
            }}
          >
            Does Not Contain
          </p>
        </button>
        <button onClick={() => setTool("IS_GREATER")} className="popupButton">
          <Image
            src={ToolsIcons.IS_GREATER}
            width={16}
            height={16}
            alt="edit"
          />
          <p
            style={{
              color: "black",
              margin: 0,
              fontSize: "14px",
              fontWeight: 400,
              lineHeight: "16px",
            }}
          >
            Is greater than
          </p>
        </button>
        <button
          onClick={() => setTool("IS_GREATOR_OR_EQUAL")}
          className="popupButton"
        >
          <Image
            src={ToolsIcons.IS_GREATOR_OR_EQUAL}
            width={16}
            height={16}
            alt="edit"
          />
          <p
            style={{
              color: "black",
              margin: 0,
              fontSize: "14px",
              fontWeight: 400,
              lineHeight: "16px",
            }}
          >
            Is greater than or equal to
          </p>
        </button>
        <button onClick={() => setTool("IS_LESS")} className="popupButton">
          <Image src={ToolsIcons.IS_LESS} width={16} height={16} alt="edit" />
          <p
            style={{
              color: "black",
              margin: 0,
              fontSize: "14px",
              fontWeight: 400,
              lineHeight: "16px",
            }}
          >
            Is less than
          </p>
        </button>
        <button
          onClick={() => setTool("IS_LESS_OR_EQUAL")}
          className="popupButton"
        >
          <Image
            src={ToolsIcons.IS_LESS_OR_EQUAL}
            width={16}
            height={16}
            alt="edit"
          />
          <p
            style={{
              color: "black",
              margin: 0,
              fontSize: "14px",
              fontWeight: 400,
              lineHeight: "16px",
            }}
          >
            Is less than equal to
          </p>
        </button>
      </div>
    );
  };
  const configureSearch = (order?: RadioType) => {
    if (order) params.order = order;
    if (dataIndex) setParams({ ...params, [dataIndex]: checkedList });
    handleSearch(params, true);
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
    if (!isFiltered) {
      setCheckedList([]);
      setRadioValue(undefined);
      indeterminate = false;
    }
    if (filters && type) {
      gg();
    }
  }, [filters, type]);
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
        <p
          style={{
            fontSize: 14,
            fontWeight: 500,
            color: "black",
            margin: 0,
          }}
        >
          Эрэмбэлэх
        </p>
        <NewRadioGroup
          style={{
            width: "100%",
          }}
          value={radioValue}
          onChange={(e: any) => {
            setRadioValue(e.target.value);
            configureSearch(e.target.value);
          }}
          optionType="button"
          buttonStyle="solid"
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 12,
              alignSelf: "stretch",
              justifyContent: "space-evenly",
            }}
          >
            <NewRadio
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: 22,
                width: "100%",
                fontSize: 12,
                lineHeight: "13px",
              }}
              value={RadioType.ASC}
            >
              A-Я
            </NewRadio>
            <NewRadio
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: 22,
                width: "100%",
                fontSize: 12,
                lineHeight: "13px",
              }}
              value={RadioType.DESC}
            >
              Я-A
            </NewRadio>
          </div>
        </NewRadioGroup>
        <div
          style={{
            width: "100%",
            height: 1,
            backgroundColor: "#DEE2E6",
          }}
        />
        <p
          style={{
            fontSize: 14,
            fontWeight: 500,
            color: "black",
            margin: 0,
          }}
        >
          Хайх
        </p>
        <div
          style={{
            padding: "12px 8px",
            backgroundColor: "#F8F9FA",
            borderRadius: 4,
            width: "100%",
          }}
        >
          {type === "DATE" ? (
            <Space.Compact>
              <div className="extraButton">
                <Popover
                  placement="bottom"
                  content={<Tools />}
                  trigger={"click"}
                >
                  <Image
                    src={ToolsIcons[`${tool}`]}
                    width={12}
                    height={12}
                    alt="searchIcon"
                  />
                </Popover>
              </div>
              <NewDatePicker
                style={{
                  width: "100%",
                }}
                value={dayjs(datePickerValue)}
                onChange={(date) => {
                  setDatePickerValue(date);
                }}
              />
              <div className="extraButton-right">
                <SearchOutlined onClick={() => configureSearch()} />
              </div>
            </Space.Compact>
          ) : null}
          {type === "MULTI" ? (
            <NewInput
              style={{
                gap: 4,
              }}
              disabled={checkedList.length > 0 ? true : false}
              onChange={(e) => {
                setFilterCheckboxes(filterCheckbox(e.target.value));
                setCheckedList(filterCheckboxes.map((item) => item.value));
              }}
              addonBefore={
                <Popover
                  placement="bottom"
                  content={<Tools />}
                  trigger={"click"}
                >
                  <Image
                    src={ToolsIcons[`${tool}`]}
                    width={12}
                    height={12}
                    alt="searchIcon"
                  />
                </Popover>
              }
              placeholder={`${label} хайх`}
            />
          ) : null}
          {type === "NUMBER" ? (
            <NewInputNumber
              style={{
                gap: 4,
                width: "100%",
              }}
              disabled={checkedList.length > 0 ? true : false}
              onChange={(e) => filterCheckbox(Number(e))}
              addonBefore={
                <Popover
                  placement="bottom"
                  content={<Tools />}
                  trigger={"click"}
                >
                  <Image
                    src={ToolsIcons[`${tool}`]}
                    width={12}
                    height={12}
                    alt="searchIcon"
                  />
                </Popover>
              }
              placeholder={`${label} хайх`}
            />
          ) : null}
        </div>
        <div
          style={{
            padding: "12px 8px",
            backgroundColor: "#F8F9FA",
            borderRadius: 4,
            width: "100%",
          }}
        >
          <NewCheckbox
            indeterminate={indeterminate}
            onChange={onCheckAllChange}
            checked={checkAll}
          >
            Бүгд сонгох
          </NewCheckbox>
          <div
            style={{
              paddingLeft: 20,
              height: 140,
              overflow: "auto",
            }}
          >
            <NewCheckboxGroup
              style={{
                display: "flex",
                flexDirection: "column",
              }}
              value={checkedList}
              onChange={onChange}
            >
              {filterCheckboxes.map((item: IFilterType, index: number) => {
                return (
                  <NewCheckbox key={index} value={item.value}>
                    {item.text}
                  </NewCheckbox>
                );
              })}
            </NewCheckboxGroup>
          </div>
        </div>
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
            setCheckedList([]);
            setParams({
              page: 1,
              limit: 10,
              order: RadioType.DESC,
              queries: [],
            });
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
          onClick={() => configureSearch()}
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
export default DropDown;

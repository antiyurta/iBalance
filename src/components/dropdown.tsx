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
import { DataIndexType, RadioType, ToolsIcons } from "@/service/entities";
import { typeOfFilters } from "@/feature/common";

import { SearchOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

interface IProps {
  label: string;
  dataIndex: string;
  type: DataIndexType;
  filters: number[] | string | boolean[];
  isFiltered: boolean;
  handleSearch: (params: object, state: boolean) => void;
}
type CheckedList = (number | string | boolean)[];
enum SearchType {
  RADIO = "RADIO",
  INPUT = "INPUT",
  CHECKBOX = "CHECKBOX",
  DEFUALT = "DEFUALT",
}
const DropDown = (props: IProps) => {
  const { label, dataIndex, type, filters, isFiltered, handleSearch } = props;
  const [radioValue, setRadioValue] = useState<keyof typeof RadioType>();
  const [tool, setTool] = useState<keyof typeof ToolsIcons>(
    (type === "NUMBER" && "EQUALS") || (type === "DATE" && "EQUALS") || "EQUALS"
  );
  const [datePickerValue, setDatePickerValue] = useState<any>();
  const [checkboxs, setCheckboxs] = useState<any>([]);
  const [searchValue, setSearchValue] = useState<string | number>("");
  const [checkedList, setCheckedList] = useState<CheckedList>([]);
  let indeterminate =
    checkedList.length > 0 && checkedList.length < checkboxs.length;
  const onCheckAllChange = (e: any) => {
    setCheckedList(
      e.target.checked ? checkboxs?.map((checkbox: any) => checkbox.value) : []
    );
  };
  const onChange = (list: CheckedList) => {
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
  const configureSearch = (SType: SearchType, order?: RadioType) => {
    switch (SType) {
      case SearchType.RADIO:
        handleSearch(
          {
            page: 1,
            limit: 10,
            orderParam: dataIndex,
            order: order,
          },
          true
        );
        break;
      case SearchType.INPUT:
        handleSearch(
          {
            page: 1,
            limit: 10,
            queries: [
              {
                param: dataIndex,
                operator: tool,
                value: searchValue,
                // typeof: type === "DATE" ? "date" : "number",
              },
            ],
          },
          true
        );
        setSearchValue("");
        break;
      case SearchType.CHECKBOX:
        handleSearch(
          {
            page: 1,
            limit: 10,
            [dataIndex]: checkedList,
          },
          true
        );
        break;
      case SearchType.DEFUALT:
        handleSearch(
          {
            page: 1,
            limit: 10,
          },
          false
        );
        break;
      default:
        break;
    }
  };
  const gg = async () => {
    console.log(type, filters);
    const dd: any = await typeOfFilters({
      type: type,
      filters: filters,
    });
    setCheckboxs(dd);
  };
  useEffect(() => {
    if (!isFiltered) {
      setSearchValue("");
      setCheckedList([]);
      setRadioValue(undefined);
      indeterminate = false;
    }
    if (filters && type) {
      gg();
    }
  }, [filters, type]);
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
            configureSearch(SearchType.RADIO, e.target.value);
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
                onChange={async (date: any, dateString: string) => {
                  setDatePickerValue(date);
                  setSearchValue(dateString);
                }}
              />
              <div className="extraButton-right">
                <SearchOutlined
                  onClick={() => configureSearch(SearchType.INPUT)}
                />
              </div>
            </Space.Compact>
          ) : null}
          {type === "MULTI" ? (
            <NewInput
              style={{
                gap: 4,
              }}
              disabled={checkedList.length > 0 ? true : false}
              value={searchValue}
              onChange={(e: any) => setSearchValue(e.target.value)}
              onPressEnter={() => configureSearch(SearchType.INPUT)}
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
              value={searchValue}
              // onChange={(e: number) => setSearchValue(e)}
              onChange={(e) => console.log(typeof e)}
              onPressEnter={() => configureSearch(SearchType.INPUT)}
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
              {checkboxs?.map((checkbox: any, index: number) => {
                return (
                  <NewCheckbox key={index} value={checkbox.value}>
                    {checkbox.text}
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
            setSearchValue("");
            configureSearch(SearchType.DEFUALT);
          }}
          className="app-button-regular"
          style={{
            color: "#198754",
          }}
        >
          Цэвэрлэх
        </button>
        <button
          onClick={() => configureSearch(SearchType.CHECKBOX)}
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

import { IDataConsumer } from "@/service/consumer/entities";
import {
  IDataTreeSection,
  TreeSectionType,
} from "@/service/reference/tree-section/entities";
import { TreeSectionService } from "@/service/reference/tree-section/service";
import { ConsumerService } from "@/service/consumer/service";
import { DataIndexType, Queries } from "@/service/entities";
import { IDataReference, IType } from "@/service/reference/entity";
import { ReferenceService } from "@/service/reference/reference";
import { message } from "antd";
import type { DefaultOptionType } from "antd/es/cascader";
import { ColumnFilterItem } from "antd/es/table/interface";
import dayjs from "dayjs";
import Image from "next/image";
import React from "react";
import { NumericFormat } from "react-number-format";
import { IDataCountry } from "@/service/reference/country/entities";
import { enumTranslation } from "./constraint-translation";
import { authService } from "@/service/authentication/service";
type NotificationType = "success" | "info" | "warning" | "error";
export const openNofi = (
  type: NotificationType,
  description: string,
  messge?: string
) => {
  message.config({
    duration: 4,
  });
  switch (type) {
    case "success":
      messge = "Амжилттай";
      break;
    case "error":
      messge = "Амжилтгүй";
      break;
    case "warning":
      messge = "Анхаар";
      break;
    case "info":
      messge = "Мэдээлэл";
      break;
    default:
      break;
  }
  return message[type]({
    content: description,
  });
};

function parseNumber(event: any) {
  var charCode = event.charCode;
  if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 46) {
    event.preventDefault();
  } else {
    return true;
  }
}

const isChecked = (state: boolean) => {
  if (state) {
    return (
      <Image src={"/icons/checked.png"} width={15} height={15} alt="checked" />
    );
  }
  return (
    <Image
      src={"/icons/unchecked.png"}
      width={15}
      height={15}
      alt="unchecked"
    />
  );
};

function renderCheck(text: any, type: DataIndexType) {
  switch (type) {
    case DataIndexType.BOOLEAN:
      return isChecked(text);
    case DataIndexType.BOOLEAN_STRING:
      if (text) {
        return (
          <span
            style={{
              color: "green",
            }}
          >
            Идэвхтэй
          </span>
        );
      }
      return "Идэвхгүй";
    case DataIndexType.DATE:
      return dayjs(text).format("YYYY/MM/DD");
    case DataIndexType.DATETIME:
      return dayjs(text).format("YYYY/MM/DD HH:mm");
    case DataIndexType.TIME:
      return dayjs(String(text), "HH.mm").format("HH:mm");
    case DataIndexType.VALUE:
      return (
        <NumericFormat
          value={text}
          suffix={"₮"}
          displayType="text"
          thousandSeparator=","
          fixedDecimalScale
          decimalScale={2}
        />
      );
    case DataIndexType.ENUM:
      return enumTranslation(text);
    default:
      return text;
  }
}
function removeDuplicates(set: any[]) {
  const uniqueIds = new Set(set.map((item) => item.value));
  const clone: ColumnFilterItem[] = [...uniqueIds];
  return clone
    .map((id) => set.find((item) => item.value === id))
    .filter(Boolean);
}

function unDuplicate(text: string, newParams: any) {
  var newQueries: Queries[] = [];
  newParams.queries?.map((query: any) => {
    if (query.param != text) {
      newQueries.push(query);
    }
  });
  return newQueries;
}
/** Давхардал шалгах давхартай бол => false үгүй бол => true */
function hasUniqueValues(arr: any[]): boolean {
  const valueSet = new Set();

  for (const item of arr) {
    if (valueSet.has(item)) {
      return false; // Duplicate value found
    }
    valueSet.add(item);
  }

  return true; // All values are unique
}
interface IFindIndexInColumnSettins {
  newRowIndexes: string[];
  unSelectedRow: string[];
  columns: any;
  onColumns: (columns: any) => void;
  params: any;
  onParams: (params: any) => void;
  getData: (params: any) => void;
}

function findIndexInColumnSettings(props: IFindIndexInColumnSettins) {
  const {
    newRowIndexes,
    unSelectedRow,
    columns,
    onColumns,
    params,
    onParams,
    getData,
  } = props;
  unSelectedRow?.map((row) => {
    onCloseFilterTag({
      key: row,
      state: false,
      column: columns,
      onColumn: (columns) => onColumns(columns),
      params: params,
      onParams: (params) => onParams(params),
    });
  });
  const clone = { ...columns };
  Object.entries(clone).map(([key, _value]) => {
    clone![key]!.isView = false;
  });
  newRowIndexes?.map((index) => {
    clone![index]!.isView = true;
  });
  onColumns(clone);
  getData(params);
}

// filter tohiruulga
interface IOnCloseFilterTag {
  key: string;
  state: boolean;
  column: any;
  onColumn: (column: any) => void;
  params: any;
  onParams: (params: any) => void;
}

function onCloseFilterTag(props: IOnCloseFilterTag) {
  const { key, state, column, onColumn, params, onParams } = props;
  const clone = column;
  clone[key].isFiltered = state;
  onColumn(clone);
  if (!state) {
    var newClonedParams = params;
    newClonedParams[key] = undefined;
    if (params.orderParam === key) {
      newClonedParams.orderParam = undefined;
      newClonedParams.order = undefined;
    }
    if (params.queries) {
      var newQueries: Queries[] = [];
      params.queries.map((query: Queries) => {
        if (query.param != key) {
          newQueries.push(query);
        }
      });
      newClonedParams.queries = newQueries.filter(Boolean) || undefined;
    }
    onParams(newClonedParams);
  }
}

interface ITypeOfFilters {
  type: DataIndexType;
  filters: any;
}

async function typeOfFilters(props: ITypeOfFilters) {
  const { type, filters } = props;
  switch (type) {
    case DataIndexType.BOOLEAN:
      if (filters) {
        return filters?.map((filter: any) => {
          return {
            text: filter === true ? "Тийм" : "Үгүй",
            value: filter,
          };
        });
      }
    case DataIndexType.BOOLEAN_STRING:
      if (filters) {
        return filters?.map((filter: any) => {
          return {
            text: filter === true ? "Идэвхтэй" : "Идэвхгүй",
            value: filter,
          };
        });
      }
    case DataIndexType.USER:
      if (filters) {
        return await userToFilter(filters);
      }
    case DataIndexType.COUNTRY:
      if (filters) {
        return await countries(filters);
      }
    case DataIndexType.STRING_SECTION:
      if (filters) {
        return await sectionToFilterName(filters);
      }
    case DataIndexType.STRING_CONSUMER_NAME:
      if (filters) {
        return await consumerToFilterName(filters);
      }
    case DataIndexType.STRING_BANK:
      if (filters) {
        return await banksToFilter(filters);
      }
    case DataIndexType.VALUE:
      if (filters) {
        return filters?.map((filter: any) => {
          return {
            text: (
              <NumericFormat
                value={filter}
                prefix="₮"
                thousandSeparator=","
                displayType="text"
              />
            ),
            value: filter,
          };
        });
      }
    case DataIndexType.DATE:
      if (filters) {
        return filters?.map((filter: any) => {
          return {
            text: dayjs(filter).format("YYYY/MM/DD HH:mm"),
            value: filter,
          };
        });
      }
    case DataIndexType.MULTI:
      if (filters) {
        return filters?.map((filter: any) => {
          return {
            text: filter,
            value: filter,
          };
        });
      }
    default:
      break;
  }
}

async function userToFilter(ids: number[]) {
  const outFilters: ColumnFilterItem[] = [];
  const { response } = await authService.getAllUsers({ ids });
  response.map((res) => {
    outFilters.push({ text: res.firstName, value: res.id });
  });
  return outFilters;
}

async function banksToFilter(filters: any) {
  const outFilters: ColumnFilterItem[] = [];
  const { response } = await ReferenceService.get({ type: IType.BANK });
  filters?.map((filterSection: any) => {
    response.data.map((section: IDataReference) => {
      if (section.id === filterSection) {
        outFilters.push({
          text: section.name,
          value: filterSection,
        });
      }
    });
  });
  return outFilters;
}

async function consumerToFilterName(filters: any) {
  const outFilters: ColumnFilterItem[] = [];
  const {
    response: { data },
  } = await ConsumerService.get({});
  console.log(filters, data);
  filters?.map((filterSection: any) => {
    data.map((consumer: IDataConsumer) => {
      if (consumer.id === filterSection) {
        outFilters.push({
          text: consumer.name,
          value: filterSection,
        });
      }
    });
  });
  return outFilters;
}

async function countries(filters: any) {
  const outFilters: ColumnFilterItem[] = [];
  const {
    response: { data },
  } = await ReferenceService.getCountries();
  filters?.map((filterSection: any) => {
    data.map((section: IDataCountry) => {
      if (section.id === filterSection) {
        outFilters.push({
          text: section.name,
          value: filterSection,
        });
      }
    });
  });
  return outFilters;
}

async function sectionToFilterName(filters: any) {
  const outFilters: ColumnFilterItem[] = [];
  const { response } = await TreeSectionService.get(TreeSectionType.Consumer);
  filters?.map((filterSection: any) => {
    response.map((section: IDataTreeSection) => {
      if (section.id === filterSection) {
        outFilters.push({
          text: section.name,
          value: filterSection,
        });
      }
    });
  });
  return outFilters;
}

const displayRender = (labels: string[]) => labels[labels.length - 1];
const filterCascader = (inputValue: string, path: DefaultOptionType[]) => {
  return path.some(
    (option) =>
      (option.label as string).toLowerCase().indexOf(inputValue.toLowerCase()) >
      -1
  );
};

const getFile = async (id: number) => {
  return await ReferenceService.getImage(id).then((response) => {
    const file = new Blob([response], { type: response.type });
    const fileUrl = URL.createObjectURL(file);
    return fileUrl;
  });
};

interface FieldData {
  [key: string]: any;
}
/** формийн field set хийх
 * @example
 * form.setFieldsValue(fieldValue([etc...], value));
 */
function fieldValue(dataIndex: (string | number)[], value: number): FieldData {
  const result: FieldData = {};
  let temp = result;
  for (let i = 0; i < dataIndex.length - 1; i++) {
    temp[dataIndex[i]] = {};
    temp = temp[dataIndex[i]];
  }
  temp[dataIndex[dataIndex.length - 1]] = value;
  return result;
}
function getUniqueValues<T, K extends keyof T>(array: T[], key: K): T[K][] {
  return [
    ...new Set(
      array
        .map((item) => item[key])
        .filter((value) => value !== null && value !== undefined)
    ),
  ] as T[K][];
}
export {
  parseNumber,
  isChecked,
  renderCheck,
  removeDuplicates,
  unDuplicate,
  hasUniqueValues,
  findIndexInColumnSettings,
  typeOfFilters,
  onCloseFilterTag,
  displayRender,
  filterCascader,
  getFile,
  fieldValue,
  getUniqueValues,
};

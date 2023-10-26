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
import { message, notification } from "antd";
import type { DefaultOptionType } from "antd/es/cascader";
import { ColumnFilterItem } from "antd/es/table/interface";
import { DataNode } from "antd/es/tree";
import dayjs from "dayjs";
import Image from "next/image";
import React from "react";
import { NumericFormat } from "react-number-format";
import { MeasurementType } from "@/service/material/unitOfMeasure/entities";
import { IDataCountry } from "@/service/reference/country/entities";
type NotificationType = "success" | "info" | "warning" | "error";
export const openNofi = (
  type: NotificationType,
  message: string,
  description: string
) => {
  notification.config({
    top: 80,
    duration: 4,
  });
  return notification[type]({
    message: message,
    description: description,
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
    case DataIndexType.MEASUREMENT:
      switch (text) {
        case MeasurementType.Area:
          return "Талбайн хэмжих нэгж";
        case MeasurementType.Length:
          return "Уртын хэмжих нэгж";
        case MeasurementType.Quantity:
          return "Тооны хэмжих нэгж";
        case MeasurementType.Time:
          return "Цаг хугацааны хэмжих нэгж";
        case MeasurementType.Volume:
          return "Шингэний хэмжих нэгж";
        case MeasurementType.Weight:
          return "Хүндийн хэмжих нэгж";
        default:
          return;
      }
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
      return dayjs(text).format("YYYY/MM/DD HH:mm");
    case DataIndexType.VALUE:
      return (
        <NumericFormat
          value={text}
          prefix={"₮"}
          displayType="text"
          thousandSeparator=","
        />
      );
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
    case DataIndexType.MEASUREMENT:
      var data: any = [];
      filters.map((filter: MeasurementType) => {
        switch (filter) {
          case MeasurementType.Area:
            data.push({
              text: "Талбайн хэмжих нэгж",
              value: MeasurementType.Area,
            });
            break;
          case MeasurementType.Length:
            data.push({
              text: "Уртын хэмжих нэгж",
              value: MeasurementType.Length,
            });
            break;
          case MeasurementType.Quantity:
            data.push({
              text: "Тооны хэмжих нэгж",
              value: MeasurementType.Quantity,
            });
            break;
          case MeasurementType.Time:
            data.push({
              text: "Цаг хугацааны хэмжих нэгж",
              value: MeasurementType.Time,
            });
            break;
          case MeasurementType.Volume:
            data.push({
              text: "Эзлэхүүн хэмжих нэгж",
              value: MeasurementType.Volume,
            });
            break;
          case MeasurementType.Weight:
            data.push({
              text: "Хүндийн хэмжих нэгж",
              value: MeasurementType.Weight,
            });
          default:
            break;
        }
      });
      return data;
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
  const { response } = await ReferenceService.getUsers({ ids });
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

function listToTree(data: any) {
  let root: DataNode[] = [];
  const cloneData: DataNode[] = data?.map((el: any, index: number) => {
    return {
      title: el.name,
      key: el.id,
      parentId: el.sectionId,
      isLeaf: !el.isExpand ? !el.isExpand : undefined,
    };
  });
  const idMapping = data?.reduce((acc: any, el: any, i: number) => {
    acc[el.id] = i;
    return acc;
  }, {});
  cloneData?.forEach((el: any) => {
    if (el.parentId === null) {
      root.push(el);
      return;
    }
    const parentEl = cloneData?.[idMapping[el.parentId]];
    parentEl!.children = [...(parentEl?.children || []), el];
  });
  return root;
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

export {
  parseNumber,
  isChecked,
  renderCheck,
  removeDuplicates,
  unDuplicate,
  hasUniqueValues,
  listToTree,
  findIndexInColumnSettings,
  typeOfFilters,
  onCloseFilterTag,
  displayRender,
  filterCascader,
  getFile,
};

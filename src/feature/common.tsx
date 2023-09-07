import {
  IDataConsumerSection,
  TreeSectionType,
} from "@/service/consumer/section/entities";
import { ConsumerSectionService } from "@/service/consumer/section/service";
import { DataIndexType, Quearies } from "@/service/entities";
import { IDataReference, IType } from "@/service/reference/entity";
import { ReferenceService } from "@/service/reference/reference";
import type { DefaultOptionType } from "antd/es/cascader";
import { ColumnFilterItem } from "antd/es/table/interface";
import dayjs from "dayjs";
import Image from "next/image";
import React from "react";
import { NumericFormat } from "react-number-format";

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
  var newQueries: Quearies[] = [];
  newParams.queries?.map((query: any) => {
    if (query.param != text) {
      newQueries.push(query);
    }
  });
  return newQueries;
}
//

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
      var newQueries: Quearies[] = [];
      params.queries.map((query: Quearies) => {
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
      return [
        {
          text: "Тийм",
          value: true,
        },
        {
          text: "Үгүй",
          value: false,
        },
      ];
    case DataIndexType.BOOLEAN_STRING:
      return [
        {
          text: "Идэвхтэй",
          value: true,
        },
        {
          text: "Идэвхгүй",
          value: false,
        },
      ];
    case DataIndexType.STRING_SECTION:
      if (filters) {
        return await consumersToFilterCode(filters);
      }
    case DataIndexType.STRING_CONSUMER_SECTION:
      if (filters) {
        return await consumersToFilterCode(filters);
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

async function banksToFilter(filters: any) {
  const outFilters: ColumnFilterItem[] = [];
  const { response } = await ReferenceService.get(IType.BANK);
  filters?.map((filterSection: any) => {
    response.map((section: IDataReference) => {
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

function sectionsToFilter(filters: any) {
  // const { response } = ConsumerSectionService.get(
  //   TreeSectionType.Consumer
  // );
  // const response: any = [];
  // const data: ColumnFilterItem[] = [];
  // filters?.map((filterSection: any) => {
  //   response.find((section) => {
  //     if (section.id === filterSection) {
  //       data.push({
  //         text: section.name,
  //         value: filterSection,
  //       });
  //     }
  //   });
  // });
  // return data;
}

async function consumersToFilterCode(filters: any) {
  const outFilters: ColumnFilterItem[] = [];
  const { response } = await ConsumerSectionService.get(
    TreeSectionType.Consumer
  );
  filters?.map((filterSection: any) => {
    response.map((section: IDataConsumerSection) => {
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

function listToCascader(data: any) {
  interface Option {
    value: string | number;
    label: string;
    children: Option[];
  }
  let root: Option[] = [];
  const cloneData: Option[] = data.map((el: any) => {
    return {
      label: el.name,
      value: el.id,
      parentId: el.sectionId,
      isLeaf: !el.isExpand ? !el.isExpand : undefined,
    };
  });
  const idMapping = data.reduce((acc: any, el: any, i: number) => {
    acc[el.id] = i;
    return acc;
  }, {});
  cloneData.forEach((el: any) => {
    if (el.parentId === null) {
      root.push(el);
      return;
    }
    const parentEl = cloneData[idMapping[el.parentId]];
    parentEl.children = [...(parentEl.children || []), el];
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

export {
  parseNumber,
  isChecked,
  renderCheck,
  removeDuplicates,
  unDuplicate,
  listToCascader,
  sectionsToFilter,
  findIndexInColumnSettings,
  typeOfFilters,
  onCloseFilterTag,
  displayRender,
  filterCascader,
};

import { IDataConsumer } from "@/service/consumer/entities";
import {
  IDataTreeSection,
  TreeSectionType,
} from "@/service/reference/tree-section/entities";
import { TreeSectionService } from "@/service/reference/tree-section/service";
import { ConsumerService } from "@/service/consumer/service";
import { DataIndexType, Quearies } from "@/service/entities";
import { IDataCountry } from "@/service/material/brand/entities";
import { ReceivableAccountService } from "@/service/receivable-account/service";
import { IDataReference, IDataUser, IType } from "@/service/reference/entity";
import { ReferenceService } from "@/service/reference/reference";
import { message, notification } from "antd";
import type { DefaultOptionType } from "antd/es/cascader";
import { ColumnFilterItem } from "antd/es/table/interface";
import { DataNode } from "antd/es/tree";
import dayjs from "dayjs";
import Image from "next/image";
import React from "react";
import { NumericFormat } from "react-number-format";
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
    case DataIndexType.MEASUREMENT:
      return [
        {
          text: "Талбайн хэмжих нэгж",
          value: "AREA",
        },
        {
          text: "Уртын хэмжих нэгж",
          value: "LENGTH",
        },
        {
          text: "Тооны хэмжих нэгж",
          value: "Quantity",
        },
        {
          text: "Цаг хугацааны хэмжих нэгж",
          value: "TIME",
        },
        {
          text: "Цаг хугацааны хэмжих нэгж",
          value: "TIME",
        },
        {
          text: "Шингэний хэмжих нэгж",
          value: "VOLUME",
        },
        {
          text: "Хүндийн хэмжих нэгж",
          value: "WEIGTH",
        },
      ];
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

async function userToFilter(filters: any) {
  const outFilters: ColumnFilterItem[] = [];
  const { response } = await ReferenceService.getUsers({ ids: filters });
  console.log("======>", response);
  filters?.map((filterSection: any) => {
    response.map((user: IDataUser) => {
      if (user.id === filterSection) {
        outFilters.push({
          text: user.firstName,
          value: filterSection,
        });
      }
    });
  });
  return outFilters;
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

async function consumerToFilterName(filters: any) {
  const outFilters: ColumnFilterItem[] = [];
  const {
    response: { data },
  } = await ConsumerService.getAll();
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
  const { response } = await TreeSectionService.get(
    TreeSectionType.Consumer
  );
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

const getConsumerByCode = async (code: number | string) => {
  if (!code) {
    message.error("Код заавал оруулж хайх");
  } else {
    return await ConsumerService.get({
      queries: [
        {
          param: "code",
          operator: "CONTAINS",
          value: code.toString(),
        },
      ],
    }).then((response) => {
      if (response.success) {
        if (response.response.data.length === 0) {
          message.warning("Хайсан утгаар дата алга");
          return {
            state: false,
            data: [],
          };
        } else {
          return {
            state: true,
            data: response.response.data,
          };
        }
      }
    });
  }
};

const getReceivableAccountByCode = async (code: string) => {
  if (!code) {
    message.error("Код заавал оруулж хайх");
  } else {
    return await ReceivableAccountService.get({
      queries: [
        {
          param: "code",
          operator: "CONTAINS",
          value: code,
        },
      ],
    }).then((response) => {
      if (response.success) {
        if (response.response.data.length === 0) {
          message.warning("Хайсан утгаар дата алга");
          return [];
        } else {
          return response.response.data;
        }
      }
    });
  }
};

export {
  getConsumerByCode,
  getReceivableAccountByCode,
  parseNumber,
  isChecked,
  renderCheck,
  removeDuplicates,
  unDuplicate,
  listToTree,
  findIndexInColumnSettings,
  typeOfFilters,
  onCloseFilterTag,
  displayRender,
  filterCascader,
};

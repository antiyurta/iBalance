"use client";

import { MoreOutlined, FilterOutlined } from "@ant-design/icons";
import ColumnSettings from "@/components/columnSettings";
import NewDirectoryTree from "@/components/directoryTree";
import DropDown from "@/components/dropdown";
import Filtered from "@/components/filtered";
import { DataIndexType, Meta, Quearies } from "@/service/entities";
import {
  ColumnType,
  DataIndex,
  FilteredColumnsLimitOfLoans,
  IDataLimitOfLoans,
  Params,
} from "@/service/limit-of-loans/entities";
import { Popover, Table } from "antd";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { removeDuplicates, renderCheck, unDuplicate } from "@/feature/common";
import Popup from "@/components/popup";

import { limitOfLoansService } from "@/service/limit-of-loans/service";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);
import { BlockContext, BlockView } from "@/feature/context/BlockContext";

import { NumericFormat } from "react-number-format";
import { TreeSectionType } from "@/service/consumer/section/entities";

const { Column } = Table;

const CustomerList = () => {
  const blockContext: BlockView = useContext(BlockContext); // uildeliig blockloh
  const [newParams, setNewParams] = useState<Params>({});
  const [isOpenTree, setIsOpenTree] = useState<boolean>(true);
  const [data, setData] = useState<IDataLimitOfLoans[]>([]);
  const [meta, setMeta] = useState<Meta>({ page: 1, limit: 10 });
  const [selectedRow, setSelectedRow] = useState<any>([]);
  const [tableWidth, setTableWidth] = useState<string>("calc(100% - 262px)");
  const [columns, setColumns] = useState<FilteredColumnsLimitOfLoans>({
    code: {
      label: "Харилцагчийн код",
      isView: true,
      isFiltered: false,
      dataIndex: ["consumer", "code"],
      type: DataIndexType.STRING_CONSUMER_CODE,
    },
    name: {
      label: "Харилцагчийн нэр",
      isView: true,
      isFiltered: false,
      dataIndex: ["consumer", "name"],
      type: DataIndexType.STRING_CONSUMER_NAME,
    },
    sectionId: {
      label: "Харилцагчийн бүлэг",
      isView: true,
      isFiltered: false,
      dataIndex: ["consumer", "section", "name"],
      type: DataIndexType.STRING_CONSUMER_SECTION,
    },
    isAccount: {
      label: "Дансаар тохируулсан эсэх",
      isView: true,
      isFiltered: false,
      dataIndex: "isAccount",
      type: DataIndexType.BOOLEAN,
    },
    limitAmount: {
      label: "Харилцагчид олгох нийт лимит",
      isView: true,
      isFiltered: false,
      dataIndex: "limitAmount",
      type: DataIndexType.VALUE,
    },
    isClose: {
      label: "Захиалга хаасан эсэх",
      isView: true,
      isFiltered: false,
      dataIndex: "isClose",
      type: DataIndexType.BOOLEAN,
    },
    isActive: {
      label: "Төлөв",
      isView: true,
      isFiltered: false,
      dataIndex: ["consumer", "isActive"],
      type: DataIndexType.BOOLEAN_STRING,
    },
    updatedAt: {
      label: "Өөрчлөлт хийсэн огноо",
      isView: true,
      isFiltered: false,
      dataIndex: "updatedAt",
      type: DataIndexType.DATE,
    },
    updatedBy: {
      label: "Өөрчлөлт хийсэн хэрэглэгч",
      isView: true,
      isFiltered: false,
      dataIndex: "updatedBy",
      type: DataIndexType.STRING,
    },
  });
  const openModal = (state: boolean, row?: IDataLimitOfLoans) => {
    // setIsMode(state);
    // if (!state) {
    //   form.resetFields();
    // } else {
    //   form.setFieldsValue(row);
    // }
    // setIsOpenModal(true);
    setSelectedRow(row);
  };
  // ustgah
  const onDelete = async (id: number) => {
    // blockContext.block();
    // await ConsumerService.remove(id).then((response) => {
    //   if (response.success) {
    //     setSelectedRow(undefined);
    //     getData({ page: 1, limit: 10 });
    //   }
    // });
    // blockContext.unblock();
  };
  // mor filter
  const onCloseFilterTag = (key: string, state: boolean) => {
    const clone = columns;
    clone![key as keyof FilteredColumnsLimitOfLoans]!.isFiltered = state;
    setColumns(clone);
    if (!state) {
      var newClonedParams = newParams;
      newClonedParams[key as keyof Params] = undefined;
      if (newParams.orderParam === key) {
        newClonedParams.orderParam = undefined;
        newClonedParams.order = undefined;
      }
      if (newParams.queries) {
        var newQueries: Quearies[] = [];
        newParams.queries.map((query) => {
          if (query.param != key) {
            newQueries.push(query);
          }
        });
        newClonedParams.queries = newQueries.filter(Boolean) || undefined;
      }
      setNewParams(newClonedParams);
    }
  };
  // bagana tohirhoo hiih ued
  const findIndexInColumnSettings = (
    newRowIndexes: string[],
    unSelectedRow: string[]
  ) => {
    unSelectedRow?.map((row) => {
      onCloseFilterTag(row, false);
    });
    const clone = { ...columns };
    Object.entries(clone).map(([key, _value]) => {
      clone![key as keyof FilteredColumnsLimitOfLoans]!.isView = false;
    });
    newRowIndexes?.map((index) => {
      clone![index as unknown as keyof FilteredColumnsLimitOfLoans]!.isView =
        true;
    });
    setColumns(clone);
    getData(newParams);
  };
  const typeOfFilters = (type: DataIndexType, dataIndex: DataIndex) => {
    if (type === DataIndexType.BOOLEAN) {
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
    } else if (type === DataIndexType.VALUE) {
      return removeDuplicates(
        data?.map((item) => ({
          text: (
            <NumericFormat
              value={item[dataIndex].toString()}
              prefix={"₮"}
              displayType="text"
              thousandSeparator=","
            />
          ),
          value: item[dataIndex],
        }))
      );
    } else if (type === DataIndexType.DATE) {
      return removeDuplicates(
        data?.map((item) => ({
          text: dayjs(item[dataIndex].toString()).format("YYYY/MM/DD HH:mm"),
          value: dayjs.utc(item[dataIndex].toString()),
        }))
      );
    } else if (type === DataIndexType.STRING_CONSUMER_CODE) {
      return removeDuplicates(
        data?.map((item) => ({
          text: item.consumer.code,
          value: item.consumer.code,
        }))
      );
    } else if (type === DataIndexType.STRING_CONSUMER_NAME) {
      return removeDuplicates(
        data?.map((item) => ({
          text: item.consumer.name,
          value: item.consumer.name,
        }))
      );
    } else if (type === DataIndexType.STRING_CONSUMER_SECTION) {
      return removeDuplicates(
        data?.map((item) => ({
          text: item.consumer.section.name,
          value: item.consumer.section.id,
        }))
      );
    } else if (type === DataIndexType.STRING) {
      return removeDuplicates(
        data?.map((item) => ({
          text: item[dataIndex],
          value: item[dataIndex],
        }))
      );
    } else if (type === DataIndexType.BOOLEAN_STRING) {
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
    }
  };
  const getData = async (params: Params) => {
    blockContext.block();
    var prm: Params = {
      page: params.page || newParams.page,
      limit: params.limit || newParams.limit,
      orderParam: params.orderParam || newParams.orderParam,
      order: params.order || newParams.order,
      code: params.code || newParams.code,
      name: params.name || newParams.name,
      sectionId: params.sectionId || newParams.sectionId,
      isAccount: params.isAccount || newParams.isAccount,
      limitAmount: params.limitAmount || newParams.limitAmount,
      isClose: params.isClose || newParams.isClose,
      isActive: params.isActive || newParams.isActive,
      updatedAt: params.updatedAt || newParams.updatedAt,
      updatedBy: params.updatedBy || newParams.updatedBy,
      queries: newParams.queries,
    };
    if (params.queries?.length) {
      const incomeParam = params.queries[0].param;
      prm.queries = [...unDuplicate(incomeParam, newParams), ...params.queries];
    }
    if (params.code) {
      prm.queries = [...unDuplicate("code", newParams)];
    }
    if (params.name) {
      prm.queries = [...unDuplicate("name", newParams)];
    }
    if (params.sectionId) {
      prm.queries = [...unDuplicate("sectionId", newParams)];
    }
    if (params.isAccount) {
      prm.queries = [...unDuplicate("isAccount", newParams)];
    }
    if (params.limitAmount) {
      prm.queries = [...unDuplicate("limitAmount", newParams)];
    }
    if (params.isClose) {
      prm.queries = [...unDuplicate("isClose", newParams)];
    }
    if (params.isActive) {
      prm.queries = [...unDuplicate("isActive", newParams)];
    }
    if (params.updatedAt) {
      prm.queries = [...unDuplicate("updatedAt", newParams)];
    }
    if (params.updatedBy) {
      prm.queries = [...unDuplicate("updatedBy", newParams)];
    }
    setNewParams(prm);
    await limitOfLoansService.get(prm).then((response) => {
      if (response.success) {
        setData(response.response.data);
        setMeta(response.response.meta);
      }
    });
    blockContext.unblock();
  };
  useEffect(() => {
    getData({ page: 1, limit: 10 });
  }, []);
  return (
    <div>
      <div className="second-header">
        <Filtered
          columns={columns}
          isActive={(key, state) => {
            onCloseFilterTag(key, state);
            getData(newParams);
          }}
        />
        <div className="extra">
          <ColumnSettings
            columns={columns}
            columnIndexes={(arg1, arg2) =>
              findIndexInColumnSettings(arg1, arg2)
            }
          />
          <Image
            src={"/images/PrintIcon.svg"}
            width={24}
            height={24}
            alt="printIcon"
          />
          <Image
            src={"/images/DownloadIcon.svg"}
            width={24}
            height={24}
            alt="downloadIcon"
          />
        </div>
      </div>
      <div className="body">
        <NewDirectoryTree
          isLeaf={true}
          type={TreeSectionType.Consumer}
          open={isOpenTree}
          onClick={(key) => {
            getData({ page: 1, limit: 10, sectionId: [`${key}`] });
          }}
        />
        <div
          style={{
            width: tableWidth,
          }}
        >
          <Table
            scroll={{ x: 1700 }}
            rowKey={"id"}
            dataSource={data}
            pagination={{
              position: ["bottomCenter"],
              size: "small",
              current: meta.page,
              total: meta.itemCount,
              showTotal: (total, range) =>
                `${range[0]}-ээс ${range[1]}, Нийт ${total}`,
              pageSize: meta.limit,
              showSizeChanger: true,
              pageSizeOptions: ["5", "10", "20", "50"],
              showQuickJumper: true,
              onChange: (page, pageSize) =>
                getData?.({ page: page, limit: pageSize }),
            }}
          >
            {Object.entries(columns)?.map(([key, value]: [any, ColumnType]) => {
              if (value.isView) {
                return (
                  <Column
                    key={key}
                    dataIndex={value.dataIndex}
                    title={value.label}
                    filterDropdown={({ confirm, filters }) => (
                      <DropDown
                        label={value.label}
                        dataIndex={key}
                        type={DataIndexType.STRING}
                        filters={filters || []}
                        isFiltered={value.isFiltered}
                        handleSearch={(params, state) => {
                          confirm();
                          onCloseFilterTag(key, state);
                          getData(params);
                        }}
                      />
                    )}
                    filters={typeOfFilters(value.type, key)}
                    filterIcon={() => {
                      return (
                        <FilterOutlined
                          style={{
                            fontSize: 7,
                            color: value.isFiltered ? "#198754" : "black",
                          }}
                        />
                      );
                    }}
                    render={(text) => renderCheck(text, value.type)}
                  />
                );
              }
            })}
            <Column
              title=" "
              fixed="right"
              width={40}
              render={(text, row: IDataLimitOfLoans) => {
                return (
                  <Popover
                    content={
                      <Popup
                        onEdit={() => openModal(true, row)}
                        onDelete={() => onDelete(text)}
                      />
                    }
                    trigger="click"
                    placement="bottomRight"
                  >
                    <MoreOutlined
                      style={{
                        fontSize: 22,
                      }}
                    />
                  </Popover>
                );
              }}
            />
          </Table>
        </div>
      </div>
    </div>
  );
};
export default CustomerList;

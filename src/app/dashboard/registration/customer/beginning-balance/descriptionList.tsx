"use client";
import { MoreOutlined, FilterOutlined } from "@ant-design/icons";
import ColumnSettings from "@/components/columnSettings";
import Filtered from "@/components/filtered";
import Image from "next/image";
import { useEffect, useState } from "react";
import { NumericFormat } from "react-number-format";
import { limitOfLoansAccountService } from "@/service/limit-of-loans/account/service";
import {
  ColumnType,
  DataIndex,
  FilteredColumnsLimitOfLoansAccount,
  IDataLimitOfLoansAccount,
  Params,
} from "@/service/limit-of-loans/account/entities";
import { DataIndexType, Meta, Quearies } from "@/service/entities";
import { Popover, Table } from "antd";
import DropDown from "@/components/dropdown";
import { removeDuplicates, renderCheck } from "@/feature/common";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import Popup from "@/components/popup";
dayjs.extend(utc);
const { Column } = Table;

const DescriptionList = () => {
  const [data, setData] = useState<IDataLimitOfLoansAccount[]>([]);
  const [meta, setMeta] = useState<Meta>({ page: 1, limit: 10 });
  const [newParams, setNewParams] = useState<Params>({});
  const [columns, setColumns] = useState<FilteredColumnsLimitOfLoansAccount>({
    code: {
      label: "Харилцагчийн код",
      isView: true,
      isFiltered: false,
      dataIndex: ["lendLimit", "consumer", "code"],
      type: DataIndexType.STRING_CONSUMER_CODE,
    },
    name: {
      label: "Харилцагчийн нэр",
      isView: true,
      isFiltered: false,
      dataIndex: ["lendLimit", "consumer", "name"],
      type: DataIndexType.STRING_CONSUMER_NAME,
    },
    sectionId: {
      label: "Харилцагчийн бүлэг",
      isView: true,
      isFiltered: false,
      dataIndex: ["lendLimit", "consumer", "section", "name"],
      type: DataIndexType.STRING_CONSUMER_SECTION,
    },
    isAccount: {
      label: "Дансаар тохируулсан эсэх",
      isView: true,
      isFiltered: false,
      dataIndex: ["lendLimit", "isAccount"],
      type: DataIndexType.BOOLEAN,
    },
    accountCode: {
      label: "Дансны код",
      isView: true,
      isFiltered: false,
      dataIndex: ["account", "code"],
      type: DataIndexType.STRING_ACCOUNT_CODE,
    },
    accountName: {
      label: "Дансны нэр",
      isView: true,
      isFiltered: false,
      dataIndex: ["account", "name"],
      type: DataIndexType.STRING,
    },
    amount: {
      label: "Зээлийн лимит /дансаарх/",
      isView: true,
      isFiltered: false,
      dataIndex: "amount",
      type: DataIndexType.VALUE,
    },
    isClose: {
      label: "Захиалга хаасан эсэх",
      isView: true,
      isFiltered: false,
      dataIndex: ["lendLimit", "isClose"],
      type: DataIndexType.BOOLEAN,
    },
    isActive: {
      label: "Төлөв",
      isView: true,
      isFiltered: false,
      dataIndex: ["lendLimit", "consumer", "isActive"],
      type: DataIndexType.BOOLEAN_STRING,
    },
  });
  const getData = async (params: Params) => {
    await limitOfLoansAccountService.get(params).then((response) => {
      if (response.success) {
        setData(response.response.data);
        setMeta(response.response.meta);
      }
    });
  };
  const onCloseFilterTag = (key: string, state: boolean) => {
    const clone = columns;
    clone![key as keyof FilteredColumnsLimitOfLoansAccount]!.isFiltered = state;
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
      clone![key as keyof FilteredColumnsLimitOfLoansAccount]!.isView = false;
    });
    newRowIndexes?.map((index) => {
      clone![
        index as unknown as keyof FilteredColumnsLimitOfLoansAccount
      ]!.isView = true;
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
          text: item.lendLimit.consumer.code,
          value: item.lendLimit.consumer.code,
        }))
      );
    } else if (type === DataIndexType.STRING_CONSUMER_NAME) {
      return removeDuplicates(
        data?.map((item) => ({
          text: item.lendLimit.consumer.name,
          value: item.lendLimit.consumer.name,
        }))
      );
    } else if (type === DataIndexType.STRING_CONSUMER_SECTION) {
      return removeDuplicates(
        data?.map((item) => ({
          text: item.lendLimit.consumer.section.name,
          value: item.lendLimit.consumer.section.id,
        }))
      );
    } else if (type === DataIndexType.STRING_ACCOUNT_CODE) {
      return removeDuplicates(
        data?.map((item) => ({
          text: item.account.code,
          value: item.account.code,
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
        <div
          style={{
            width: "100%",
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
              render={(text, row: IDataLimitOfLoansAccount) => {
                function openModal(
                  arg0: boolean,
                  row: IDataLimitOfLoansAccount
                ): void {
                  throw new Error("Function not implemented.");
                }

                function onDelete(text: any): void {
                  throw new Error("Function not implemented.");
                }

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
export default DescriptionList;

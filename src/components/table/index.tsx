import React, { ReactNode } from "react";
import { App, ConfigProvider, Dropdown, Table } from "antd";
import mnMn from "antd/es/locale/mn_MN";
import { FilterOutlined, MoreOutlined } from "@ant-design/icons";
import DragListView from "react-drag-listview";
import { Meta, ColumnType, ComponentType } from "@/service/entities";
import NewDropdown from "./dropdown";
import { getParam, onCloseFilterTag, renderCheck } from "@/feature/common";
import Image from "next/image";
import type { TableProps } from "antd/lib";
import { useTypedSelector } from "@/feature/store/reducer";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/feature/store/store";
import { changeParam } from "@/feature/store/slice/param.slice";
export const { Column } = Table;
export const AntTable = (props: TableProps<any>) => {
  return <Table {...props} />;
};

type columns = {
  [T in keyof any]: ColumnType;
};
export type TableItemType = {
  key: string;
  label: React.JSX.Element | string;
};
interface ITable {
  componentType?: ComponentType;
  scroll: {
    x?: number;
    y?: number;
  };
  rowKey: string;
  rowSelection?: any;
  doubleClick?: boolean;
  onDClick?: (value: any) => void;
  data: any;
  columns: columns;
  meta: Meta;
  onColumns: (columns: any) => void;
  incomeFilters: any;
  isEdit?: boolean;
  onEdit?: (row: any) => void;
  isDelete?: boolean;
  onDelete?: (id: number) => void;
  children?: ReactNode;
  addItems?: TableItemType[];
  custom?: (value: string, id: number) => void;
}

function NewTable(props: ITable) {
  const { modal } = App.useApp();
  const {
    componentType,
    scroll,
    rowKey,
    rowSelection,
    doubleClick,
    onDClick,
    data,
    meta,
    columns,
    onColumns,
    incomeFilters,
    isEdit = false,
    onEdit,
    isDelete = false,
    onDelete,
    addItems,
    custom,
  } = props;
  const pane = useTypedSelector((state) => state.pane);
  const param = getParam(pane.items, pane.activeKey);
  const dispatch = useDispatch<AppDispatch>();
  const dragProps = {
    onDragEnd(fromIndex: number, toIndex: number) {
      // console.log(fromIndex, toIndex);
      // const clone = [...columns];
      // const item = clone.splice(fromIndex - 1, 1)[0];
      // clone.splice(toIndex - 1, 0, item);
      // setCurrentColumns(columns);
    },
    nodeSelector: "th",
  };
  const warning = (key: number) => {
    modal.error({
      title: "Устгах",
      content: "Та бүртгэлийг устгахдаа итгэлтэй байна уу ?",
      maskClosable: true,
      onOk: () => onDelete?.(key),
    });
  };
  const mergeItems = (): TableItemType[] => {
    if (addItems && addItems.length > 0) {
      return addItems;
    } else {
      return [];
    }
  };
  const items = [
    isEdit
      ? {
          key: "edit",
          label: (
            <div className="popupButton">
              <Image src="/icons/Edit.png" width={16} height={16} alt="edit" />
              <p
                style={{
                  color: "#FD7E14",
                  margin: 0,
                  fontSize: "14px",
                  fontWeight: 400,
                  lineHeight: "16px",
                }}
              >
                Засварлах
              </p>
            </div>
          ),
        }
      : null,
    isDelete
      ? {
          key: "delete",
          label: (
            <div className="popupButton">
              <Image
                src="/icons/DeleteOff.png"
                width={16}
                height={16}
                alt="delete"
              />
              <p
                style={{
                  color: "#DC3545",
                  margin: 0,
                  fontSize: "14px",
                  fontWeight: 400,
                  lineHeight: "16px",
                }}
              >
                Устгах
              </p>
            </div>
          ),
        }
      : null,
    ...mergeItems(),
  ];
  return (
    <ConfigProvider locale={mnMn}>
      <DragListView.DragColumn {...dragProps}>
        <Table
          scroll={scroll}
          rowKey={rowKey}
          rowSelection={rowSelection}
          dataSource={data}
          onRow={(record, rowIndex) => {
            return {
              onDoubleClick: (event) => {
                if (doubleClick) {
                  onDClick?.(record);
                }
              },
            };
          }}
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
            onChange: (page, pageSize) => {
              dispatch(
                changeParam({
                  ...param,
                  page,
                  limit: pageSize,
                })
              );
            },
          }}
        >
          {Object.entries(columns)?.map(([key, value]: [any, ColumnType]) => {
            if (value.isView) {
              return (
                <Column
                  key={key}
                  width={value.width}
                  dataIndex={value.dataIndex}
                  title={value.label}
                  filterDropdown={({ confirm }) => {
                    return (
                      <NewDropdown
                        label={value.label}
                        dataIndex={value.dataIndex}
                        type={value.type}
                        filters={incomeFilters?.[key]}
                        isFiltered={value.isFiltered}
                        handleSearch={(params, state) => {
                          confirm();
                          onCloseFilterTag({
                            key: key,
                            state: state,
                            column: columns,
                            onColumn: (columns) => onColumns(columns),
                          });
                        }}
                      />
                    );
                  }}
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
                  render={(text) => renderCheck(text, value.type, key)}
                />
              );
            }
          })}
          {props.children}
          {items.length > 0 ? (
            <Column
              title=" "
              dataIndex={"id"}
              fixed="right"
              width={40}
              render={(text, row) => {
                return (
                  <Dropdown
                    menu={{
                      items,
                      onClick: ({ key }) => {
                        if (key === "delete") {
                          warning(text);
                        } else if (key === "edit") {
                          onEdit?.(row);
                        } else {
                          custom?.(key, text);
                        }
                      },
                    }}
                    trigger={["click"]}
                  >
                    <MoreOutlined
                      style={{
                        fontSize: 22,
                      }}
                    />
                  </Dropdown>
                );
              }}
            />
          ) : null}
        </Table>
      </DragListView.DragColumn>
    </ConfigProvider>
  );
}

export { NewTable };

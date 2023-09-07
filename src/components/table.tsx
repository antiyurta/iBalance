import React from "react";
import { ConfigProvider, Popover, Table } from "antd";
import mnMn from "antd/es/locale/mn_MN";
import { FilterOutlined, MoreOutlined } from "@ant-design/icons";
import DragListView from "react-drag-listview";
import { Meta, ColumnType, ComponentsType } from "@/service/entities";
import DropDown from "./dropdown";
import { onCloseFilterTag, renderCheck } from "@/feature/common";
import Popup from "./popup";

const { Column } = Table;

type columns = {
  [T in keyof any]: ColumnType;
};

interface ITable {
  componentsType?: ComponentsType;
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
  onChange?: (params: any) => void;
  onColumns: (columns: any) => void;
  newParams: any;
  onParams: (params: any) => void;
  incomeFilters: any;
  onEdit: (row: any) => void;
  onDelete: (id: number) => void;
}

function NewTable(props: ITable) {
  const {
    componentsType,
    scroll,
    rowKey,
    rowSelection,
    doubleClick,
    onDClick,
    data,
    meta,
    columns,
    onChange,
    onColumns,
    newParams,
    onParams,
    incomeFilters,
    onEdit,
    onDelete,
  } = props;
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
            onChange: (page, pageSize) =>
              onChange?.({ page: page, limit: pageSize }),
          }}
        >
          {Object.entries(columns)?.map(([key, value]: [any, ColumnType]) => {
            if (value.isView) {
              return (
                <Column
                  key={key}
                  dataIndex={value.dataIndex}
                  title={value.label}
                  filterDropdown={({ confirm }) => (
                    <DropDown
                      label={value.label}
                      dataIndex={key}
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
                          params: newParams,
                          onParams: (params) => onParams(params),
                        });
                        onChange?.(params);
                      }}
                    />
                  )}
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
            render={(text, row) => {
              return (
                <Popover
                  content={
                    <Popup
                      onEdit={() => onEdit(row)}
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
      </DragListView.DragColumn>
    </ConfigProvider>
  );
}

export { NewTable };

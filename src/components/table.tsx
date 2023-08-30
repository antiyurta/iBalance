import React, { ReactNode, useState } from "react";
import { ConfigProvider, Table } from "antd";
import mnMn from "antd/es/locale/mn_MN";
import type { TableColumnProps, TableProps } from "antd";
import { ColumnGroupProps } from "antd/es/table/ColumnGroup";
import { FooterRowProps } from "rc-table/lib/Footer/Row";
import { SummaryCellProps } from "rc-table/lib/Footer/Cell";
//
import DragListView from "react-drag-listview";
import { ColumnType } from "antd/es/table";
//
import { Meta } from "@/service/entities";
import { FilterDropdownProps, RefTable } from "antd/es/table/interface";

const { Column, ColumnGroup } = Table;

interface ITable {
  prop: RefTable;
  meta: Meta;
  isLoading: boolean;
  isPagination: boolean;
  onChange?: (page: number, pageSize: number) => void;
}

export interface IColumnData {
  title: string;
  dataIndex?: string;
  width?: number | string;
  filters?: object[] | any;
  filterMode?: "menu" | "tree";
  filterDropdown?:
    | React.ReactNode
    | ((props: FilterDropdownProps) => React.ReactNode);
  render?: (value?: any, record?: IColumnData, index?: number) => ReactNode;
}

interface IColumnGroup {
  title: string;
}

function NewColumn(props: TableColumnProps<IColumnData>) {
  return <Column {...props} />;
}

function NewColumnGroup(props: ColumnGroupProps<IColumnGroup>) {
  return <ColumnGroup {...props} />;
}

function NewSummaryRow(props: FooterRowProps) {
  return <Table.Summary.Row {...props}>{props.children}</Table.Summary.Row>;
}

function NewSummaryCell(props: SummaryCellProps) {
  return <Table.Summary.Cell {...props}>{props.children}</Table.Summary.Cell>;
}

function NewTable(props: ITable) {
  const { prop, meta, isLoading, isPagination, onChange } = props;
  // const [currentColumns, setCurrentColumns] =
  //   useState<ColumnType<IColumnData>[]>);
  const dragProps = {
    onDragEnd(fromIndex: number, toIndex: number) {
      console.log(fromIndex, toIndex);
      // const columns = [...currentColumns];
      // const item = columns.splice(fromIndex - 1, 1)[0];
      // columns.splice(toIndex - 1, 0, item);
      // setCurrentColumns(columns);
    },
    nodeSelector: "th",
  };
  return (
    <ConfigProvider locale={mnMn}>
      <DragListView.DragColumn {...dragProps}>
        <Table
          // rowClassName={!prop.rowClassName && "hover: cursor-pointer"}
          {...prop}
          loading={{
            spinning: isLoading,
            tip: "Уншиж байна....",
          }}
          pagination={
            isPagination
              ? {
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
                  onChange: (page, pageSize) => onChange?.(page, pageSize),
                }
              : false
          }
        >
          <NewColumn
            title="№"
            width={10}
            render={(_text, _row, index) => {
              return meta.page * meta.limit - (meta.limit - index - 1);
            }}
          />
          {/* {currentColumns?.map((column, index) => {
            return (
              <NewColumn
                key={index}
                title={column.title}
                dataIndex={column.dataIndex}
                width={column.width}
                filters={column.filters}
                filterMode={column.filterMode}
                filterDropdown={column.filterDropdown}
                render={column.render}
              />
            );
          })} */}
        </Table>
      </DragListView.DragColumn>
    </ConfigProvider>
  );
}

export { NewTable, NewColumn, NewSummaryRow, NewSummaryCell, NewColumnGroup };

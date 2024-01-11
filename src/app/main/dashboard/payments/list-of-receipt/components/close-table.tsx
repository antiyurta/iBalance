import { Divider, Table } from "antd";
import Column from "antd/es/table/Column";
import { CSSProperties, ReactNode, StyleHTMLAttributes } from "react";
import { NumericFormat } from "react-number-format";
export interface StatisticDoc {
  state: ReactNode;
  qty?: ReactNode;
  amount: ReactNode;
}
interface IProps {
  title: string;
  dataSource: StatisticDoc[];
  isQty?: boolean;
  isLoading?: boolean;
}
export const CloseTable = (props: IProps) => {
  const { title, dataSource, isQty, isLoading } = props;
  return (
    <>
      <Divider>{title}</Divider>
      <Table pagination={false} dataSource={dataSource} loading={isLoading}>
        <Column align="left" width={300} dataIndex={"state"} title="Төлөв" />
        {isQty && (
          <Column
            align="left"
            width={150}
            dataIndex={"qty"}
            title="Тоо хэмжээ"
          />
        )}
        <Column align="left" width={150} dataIndex={"amount"} title="Дүн" />
      </Table>
    </>
  );
};
/** Тоо хэмжээгийн props */
interface IQtyProps {
  value: number;
  isBracket?: boolean;
  isBold?: boolean;
  isDanger?: boolean;
}
export const closeNumber = (props: IQtyProps) => {
  const { value, isBracket, isBold, isDanger } = props;
  const style: CSSProperties = {
    fontWeight: isBold ? "bold" : "normal",
    color: isDanger ? "red" : "black",
  };
  return (
    <>
      {isBracket && "("}
      <NumericFormat
        style={style}
        value={value}
        thousandSeparator=","
        decimalScale={2}
        fixedDecimalScale
        displayType="text"
      />
      {isBracket && ")"}
    </>
  );
};

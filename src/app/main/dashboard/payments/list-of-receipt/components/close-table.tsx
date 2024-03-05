import { Divider, Table } from "antd";
import Column from "antd/es/table/Column";
import { CSSProperties } from "react";
import { NumericFormat } from "react-number-format";
export interface ICloseColumn {
  state: React.ReactNode;
  qty?: IRowProps;
  amount: IRowProps;
}
/** Тоо хэмжээгийн props */
interface IRowProps {
  value: number;
  isBracket?: boolean;
  isBold?: boolean;
  isDanger?: boolean;
}
interface IProps {
  title: string;
  dataSource: ICloseColumn[];
  isQty?: boolean;
}
const RowRender: React.FC<IRowProps> = ({
  value = 0,
  isBracket,
  isBold,
  isDanger,
}) => {
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
const CloseTable: React.FC<IProps> = ({ title, dataSource, isQty }) => {
  return (
    <>
      <Divider>{title}</Divider>
      <Table
        pagination={false}
        dataSource={dataSource}
      >
        <Column
          align="left"
          width={300}
          dataIndex={"state"}
          key={"state"}
          title="Төлөв"
          render={(value) => (<span>{value}</span>)}
        />
        {isQty && (
          <Column
            align="left"
            width={150}
            dataIndex={"qty"}
            key={"qty"}
            title="Тоо хэмжээ"
            render={(row: IRowProps) => (
              <RowRender
                value={row.value}
                isBracket={row.isBracket}
                isBold={row.isBold}
              />
            )}
          />
        )}
        <Column
          align="left"
          width={150}
          dataIndex={"amount"}
          key={"amount"}
          title="Дүн"
          render={(row: IRowProps) => (
            <RowRender
              value={row.value}
              isBracket={row.isBracket}
              isBold={row.isBold}
            />
          )}
        />
      </Table>
    </>
  );
};
export default CloseTable;

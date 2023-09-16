import { FormInstance, FormListFieldData, Table } from "antd";
import { useEffect } from "react";

interface IProps {
  data: FormListFieldData[];
  form: FormInstance;
  add: () => void;
  remove: (index: number) => void;
}

const { Column } = Table;

const EditableTableCard = (props: IProps) => {
  const { data } = props;
  return (
    <Table dataSource={data}>
      <Column dataIndex={"code"} title={"Картын дугаар"}></Column>
      <Column dataIndex={"code"} title={"Оноо хуримтлуулдах эсэх"}></Column>
      <Column dataIndex={"code"} title={"Хөнгөлөлт бодогдох үнэ"}></Column>
      <Column dataIndex={"code"} title={"Хөнгөлөлт хувиар эсэх"}></Column>
      <Column dataIndex={"code"} title={"Хөнгөлөлт"}></Column>
      <Column
        dataIndex={"code"}
        title={"Ашиглах боломжтой онооны дээд хязгаар"}
      ></Column>
      <Column dataIndex={"code"} title={"Тайлбар"}></Column>
    </Table>
  );
};
export default EditableTableCard;

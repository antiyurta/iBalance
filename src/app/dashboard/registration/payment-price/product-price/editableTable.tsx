import Image from "next/image";
import { FormInstance, Table } from "antd";
import { FormListFieldData } from "antd/lib";

const { Column } = Table;

interface IProps {
  data: FormListFieldData[];
  form: FormInstance;
  add: () => void;
  remove: (index: number) => void;
}

const EditableTable = (props: IProps) => {
  const { data, form, add, remove } = props;
  const addService = () => {};
  return (
    <>
      <Table
        dataSource={data}
        footer={() => {
          return (
            <div
              className="button-editable-footer"
              onClick={() => addService()}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 8,
                  placeContent: "center",
                }}
              >
                <Image
                  src={"/images/AddIconBlack.svg"}
                  alt="addiconblack"
                  width={16}
                  height={16}
                />
                <span
                  style={{
                    fontWeight: 500,
                    fontSize: 14,
                    lineHeight: "13px",
                    color: "#6C757D",
                  }}
                >
                  Нэмэх
                </span>
              </div>
            </div>
          );
        }}
      >
        <Column dataIndex={"code"} title="Дотоод код" />
        <Column dataIndex={"code"} title="Бараа материалын нэр" />
        <Column dataIndex={"code"} title="Хэмжих нэгж" />
        <Column dataIndex={"code"} title="Багц доторх тоо" />
        <Column dataIndex={"code"} title="Бараа материалын бүлэг" />
        <Column dataIndex={"code"} title="Нэгж үнэ" />
        <Column dataIndex={"code"} title="Бөөний үнээрх тоо хэмжээ" />
        <Column dataIndex={"code"} title="Бөөний нэгж үнэ" />
      </Table>
    </>
  );
};
export default EditableTable;

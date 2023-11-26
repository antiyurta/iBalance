import Image from "next/image";
import { App, Button, Form, FormInstance, Popconfirm, Table } from "antd";
import { Column } from "@/components/table";
import { NewInput, NewInputNumber } from "@/components/input";
import { FormListFieldData } from "antd/lib";
import { Fragment, useState } from "react";
import { MaterialSelect } from "@/components/material-select";
import {
  SaveOutlined,
  CloseOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { MaterialType } from "@/service/material/entities";

interface IProps {
  data: FormListFieldData[];
  form: FormInstance;
  add: () => void;
  remove: (index: number) => void;
}
export const EditableTableCencus = (props: IProps) => {
  const { message } = App.useApp();
  const { data, form, add, remove } = props;
  const [isNewService, setNewService] = useState<boolean>(false);
  const [editingIndex, setEditingIndex] = useState<number>();

  const onSave = async () => {
    if (editingIndex !== undefined) {
      const quantity = form.getFieldValue([
        "transactions",
        editingIndex,
        "quantity",
      ]);
      const lastQty = form.getFieldValue([
        "transactions",
        editingIndex,
        "lastQty",
      ]);
      const unitAmount = form.getFieldValue([
        "transactions",
        editingIndex,
        "unitAmount",
      ]);
      form.setFieldsValue({
        transactions: {
          [editingIndex]: {
            excessOrDeficiency: quantity - lastQty,
            amount: (quantity - lastQty) * unitAmount,
          },
        },
      });
    }
    return form
      .validateFields([
        ["transactions"],
        ["transactions", editingIndex, "materialId"],
        ["transactions", editingIndex, "name"],
        ["transactions", editingIndex, "countPackage"],
        ["transactions", editingIndex, "quantity"],
      ])
      .then(() => {
        setNewService(false);
        setEditingIndex(undefined);
        return true;
      })
      .catch((error) => {
        error.errorFields?.map((errorMsg: any) => {
          message.error(errorMsg.errors[0]);
        });
        return false;
      });
  };
  const addService = () => {
    onSave().then((state) => {
      if (state) {
        add();
        setEditingIndex(data.length);
        setNewService(true);
      }
    });
  };
  const onCancel = (index: number) => {
    if (isNewService) {
      remove(index);
    } else {
      onSave().then((state) => {
        if (state) {
          setNewService(false);
          setEditingIndex(undefined);
        }
      });
    }
    setEditingIndex(undefined);
  };
  const onRemove = (index: number) => {
    remove(index);
  };
  return (
    <Table
      pagination={false}
      dataSource={data}
      footer={() => {
        return (
          <div className="button-editable-footer" onClick={() => addService()}>
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
      <Column
        dataIndex={"materialId"}
        title="Дотоод код"
        render={(_, __, index) => (
          <MaterialSelect
            params={{ types: [MaterialType.Material] }}
            form={form}
            rules={[{ required: true, message: "Дотоод код заавал" }]}
            name={[index, "materialId"]}
            disabled={!(index === editingIndex)}
            listName={"transactions"}
            onClear={() => {
              form.resetFields([
                ["transactions", index, "name"],
                ["transactions", index, "measurement"],
                ["transactions", index, "countPackage"],
              ]);
            }}
            onSelect={(value) => {
              form.setFieldsValue({
                transactions: {
                  [index]: {
                    name: value.name,
                    measurement: value.measurementName,
                    countPackage: value.countPackage,
                    unitAmount: value.unitAmount,
                    lastQty: value.lastQty,
                    quantity: 1,
                  },
                },
              });
            }}
          />
        )}
      />
      <Column
        dataIndex={"name"}
        title="Бараа материалын нэр"
        render={(_, __, index) => (
          <Form.Item name={[index, "name"]}>
            <NewInput disabled />
          </Form.Item>
        )}
      />
      <Column
        dataIndex={"measurement"}
        title="Хэмжих нэгж"
        render={(_, __, index) => (
          <Form.Item name={[index, "measurement"]}>
            <NewInput disabled />
          </Form.Item>
        )}
      />
      <Column
        dataIndex={"countPackage"}
        title="Багц доторх тоо"
        render={(_, __, index) => (
          <Form.Item name={[index, "countPackage"]}>
            <NewInputNumber disabled />
          </Form.Item>
        )}
      />
      <Column
        dataIndex={"unitAmount"}
        title="Нэгж үнэ"
        render={(_, __, index) => (
          <Form.Item name={[index, "unitAmount"]}>
            <NewInputNumber disabled />
          </Form.Item>
        )}
      />
      <Column
        dataIndex={"lastQty"}
        title="Тооллохын өмнөх үлдэгдэл"
        render={(_, __, index) => (
          <Form.Item name={[index, "lastQty"]}>
            <NewInputNumber disabled />
          </Form.Item>
        )}
      />
      <Column
        dataIndex={"quantity"}
        title="Тооллогоор"
        render={(_, __, index) => (
          <Form.Item
            name={[index, "quantity"]}
            rules={[{ required: true, message: "Тооллогоор заавал" }]}
          >
            <NewInputNumber disabled={!(index === editingIndex)} />
          </Form.Item>
        )}
      />
      <Column
        dataIndex={"excessOrDeficiency"}
        title="Илүүдэл (дутагдал)"
        render={(_, __, index) => (
          <Form.Item name={[index, "excessOrDeficiency"]}>
            <NewInputNumber disabled />
          </Form.Item>
        )}
      />
      <Column
        dataIndex={"amount"}
        title="Борлуулалтын үнээрх дүн"
        render={(_, __, index) => (
          <Form.Item name={[index, "amount"]}>
            <NewInputNumber disabled />
          </Form.Item>
        )}
      />
      <Column
        dataIndex={"description"}
        title="Гүйлгээний утга"
        render={(_, __, index) => (
          <Form.Item name={[index, "description"]}>
            <NewInput disabled={!(index === editingIndex)} />
          </Form.Item>
        )}
      />
      {/* Засах устгах хэсэг */}
      <Column
        title={" "}
        width={110}
        render={(_, __, index) => {
          if (index === editingIndex) {
            return (
              <Fragment>
                <Button
                  icon={<SaveOutlined />}
                  shape={"circle"}
                  type={"primary"}
                  style={{ marginRight: 8 }}
                  onClick={onSave}
                />
                <Button
                  danger
                  icon={
                    <CloseOutlined
                      style={{
                        color: "red",
                      }}
                    />
                  }
                  shape={"circle"}
                  onClick={() => onCancel(index)}
                />
              </Fragment>
            );
          } else {
            return (
              <Fragment>
                <Button
                  icon={<EditOutlined />}
                  shape={"circle"}
                  style={{ marginRight: 8 }}
                  onClick={() => setEditingIndex(index)}
                />
                <Popconfirm
                  title="Are you sure？"
                  okText="Yes"
                  cancelText="No"
                  onConfirm={() => onRemove(index)}
                >
                  <Button
                    danger
                    icon={
                      <DeleteOutlined
                        style={{
                          color: "red",
                        }}
                      />
                    }
                    shape={"circle"}
                  />
                </Popconfirm>
              </Fragment>
            );
          }
        }}
      />
    </Table>
  );
};

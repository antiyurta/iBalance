import Image from "next/image";
import { App, Button, Form, FormInstance, Popconfirm, Table } from "antd";
import { Column } from "@/components/table";
import { NewDatePicker, NewInput } from "@/components/input";
import { FormListFieldData } from "antd/lib";
import { Fragment, useEffect, useState } from "react";
import { MaterialSelect } from "@/components/material-select";
import mnMN from "antd/es/calendar/locale/mn_MN";
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
export const EditableTableIncome = (props: IProps) => {
  const { message } = App.useApp();
  const { data, form, add, remove } = props;
  const [isNewService, setNewService] = useState<boolean>(false);
  const [editingIndex, setEditingIndex] = useState<number>();
  const onSave = async () => {
    return form
      .validateFields([
        ["transactions"],
        ["transactions", editingIndex, "materialId"],
        ["transactions", editingIndex, "name"],
        ["transactions", editingIndex, "countPackage"],
        ["transactions", editingIndex, "quantity"],
        ["transactions", editingIndex, "endAt"],
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
    const amount = form.getFieldValue(["accounts", index, "amount"]);
    const limitAmount = form.getFieldValue("amount");
    form.setFieldValue("amount", limitAmount - amount);
    remove(index);
  };
  return (
    <Table
      dataSource={data}
      footer={() => {
        return (
          <div className="button-editable-footer" onClick={() => add()}>
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
            materialTypes={[MaterialType.Material]}
            form={form}
            rules={[{ required: true, message: "Дотоод код заавал" }]}
            name={[index, "materialId"]}
            listName="transactions"
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
        render={(_, __, index) => {
          return (
            <Form.Item
              name={[index, "name"]}
              rules={[
                { required: true, message: "Бараа материалын нэр заавал" },
              ]}
            >
              <NewInput disabled />
            </Form.Item>
          );
        }}
      />
      <Column
        dataIndex={"measurement"}
        title="Хэмжих нэгж"
        render={(_, __, index) => {
          return (
            <Form.Item
              name={[index, "measurement"]}
              rules={[{ required: true, message: "Хэмжих нэгж заавал" }]}
            >
              <NewInput disabled />
            </Form.Item>
          );
        }}
      />
      <Column
        dataIndex={"countPackage"}
        title="Багц доторх тоо"
        render={(_, __, index) => {
          return (
            <Form.Item
              name={[index, "countPackage"]}
              rules={[{ required: true, message: "Багц доторх тоо заавал" }]}
            >
              <NewInput disabled />
            </Form.Item>
          );
        }}
      />
      <Column
        dataIndex={"quantity"}
        title="Орлогын тоо хэмжээ"
        render={(_, __, index) => {
          return (
            <Form.Item
              name={[index, "quantity"]}
              rules={[{ required: true, message: "Орлогын тоо хэмжээ заавал" }]}
            >
              <NewInput disabled />
            </Form.Item>
          );
        }}
      />
      <Column
        dataIndex={"endAt"}
        title="Дуусах хугацаа"
        render={(_, __, index) => {
          return (
            <Form.Item
              name={[index, "endAt"]}
              rules={[{ required: true, message: "Дуусах хугацаа заавал" }]}
            >
              <NewDatePicker
                disabled={!(index === editingIndex)}
                format={"YYYY-MM-DD"}
                locale={mnMN}
              />
            </Form.Item>
          );
        }}
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
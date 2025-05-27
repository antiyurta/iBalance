import {
  EditOutlined,
  DeleteOutlined,
  SaveOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { App, Button, Form, Popconfirm, Table } from "antd";
import type { FormListFieldData } from "antd";
import Image from "next/image";
import React, { useState } from "react";
import { NewInput, NewInputNumber } from "@/components/input";
import { FormInstance } from "antd/lib";
import { MaterialType } from "@/service/material/entities";
import { MaterialSelect } from "@/components/material-select";
interface IProps {
  data: FormListFieldData[];
  form: FormInstance;
  add: () => void;
  remove: (index: number) => void;
}

const { Column } = Table;

function EditableTableMaterial(props: IProps) {
  const { message } = App.useApp();
  const { data, form, add, remove } = props;
  const [isNewService, setNewService] = useState<boolean>(false);
  const [editingIndex, setEditingIndex] = useState<number>();
  const addService = () => {
    onSave().then((state) => {
      if (state) {
        add();
        setEditingIndex(data.length);
        setNewService(true);
      }
    });
  };
  const onSave = async () => {
    return form
      .validateFields([
        ["packageMaterials", editingIndex, "materialId"],
        ["packageMaterials", editingIndex, "quantity"],
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
  return (
    <Table
      locale={{
        emptyText: <>Дата байхгүй</>,
      }}
      dataSource={data}
      pagination={false}
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
        dataIndex={"id"}
        title={"Дотоод код"}
        render={(_, __, index) => (
          <MaterialSelect
            params={{ types: [MaterialType.Service, MaterialType.Material] }}
            form={form}
            rules={[{ required: true, message: "Дотоод код заавал" }]}
            name={[index, "materialId"]}
            listName="packageMaterials"
            disabled={!(index === editingIndex)}
            onClear={() => {
              form.resetFields([
                ["packageMaterials", index, "name"],
                ["packageMaterials", index, "measurement"],
                ["packageMaterials", index, "countPackage"],
                ["packageMaterials", index, "section"],
                ["packageMaterials", index, "unitAmount"],
              ]);
            }}
            onSelect={(value) => {
              form.setFieldsValue({
                packageMaterials: {
                  [index]: {
                    name: value.name,
                    measurement: value.measurement.name,
                    countPackage: value.countPackage,
                    section: value.section.name,
                  },
                },
              });
            }}
          />
        )}
      />
      <Column
        dataIndex={"name"}
        title={"Бараа материалын нэр"}
        render={(_, __, index) => (
          <Form.Item name={[index, "name"]}>
            <NewInput disabled />
          </Form.Item>
        )}
      />
      <Column
        dataIndex={"section"}
        title={"Бараа материалын бүлэг"}
        render={(_, __, index) => (
          <Form.Item name={[index, "section"]}>
            <NewInput disabled />
          </Form.Item>
        )}
      />
      <Column
        dataIndex={"measurement"}
        title={"Хэмжих нэгж"}
        render={(_, __, index) => (
          <Form.Item name={[index, "measurement"]}>
            <NewInput disabled />
          </Form.Item>
        )}
      />
      <Column
        dataIndex={"countPackage"}
        title={"Багц доторх тоо"}
        render={(_, __, index) => (
          <Form.Item name={[index, "countPackage"]}>
            <NewInputNumber disabled />
          </Form.Item>
        )}
      />
      <Column
        dataIndex={"quantity"}
        title={"Тоо ширхэг"}
        render={(_, __, index) => (
          <Form.Item
            name={[index, "quantity"]}
            rules={[{ required: true, message: "Тоо ширхэг заавал" }]}
          >
            <NewInputNumber disabled={editingIndex != index} />
          </Form.Item>
        )}
      />
      <Column
        title={" "}
        width={110}
        render={(_, __, index) => {
          if (index === editingIndex) {
            return (
              <React.Fragment>
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
              </React.Fragment>
            );
          } else {
            return (
              <React.Fragment>
                <Button
                  icon={<EditOutlined />}
                  shape={"circle"}
                  style={{ marginRight: 8 }}
                  disabled={editingIndex ? true : false}
                  onClick={() => setEditingIndex(index)}
                />
                <Popconfirm
                  title="Are you sure？"
                  okText="Yes"
                  cancelText="No"
                  onConfirm={() => remove(index)}
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
                    disabled={editingIndex !== undefined}
                  />
                </Popconfirm>
              </React.Fragment>
            );
          }
        }}
      />
    </Table>
  );
}
export default EditableTableMaterial;

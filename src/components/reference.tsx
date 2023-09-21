import { IDataReference, IType } from "@/service/reference/entity";
import { ReferenceService } from "@/service/reference/reference";
import { Button, Form, FormInstance, Popconfirm, Table, message } from "antd";
import { FormListFieldData } from "antd/lib";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { NewInput } from "./input";
import {
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { openNofi } from "@/feature/common";

interface IProps {
  type: IType;
  onClickModal?: (id: number) => void;
}

interface IPropsTable {
  data: FormListFieldData[];
  form: FormInstance;
  add: () => void;
  remove: (index: number) => void;
}

const { Column } = Table;

const Reference = (props: IProps) => {
  const { type, onClickModal } = props;
  const [form] = Form.useForm();
  const getData = async () => {
    await ReferenceService.get({ type }).then((response) => {
      form.setFieldsValue({
        reference: response.response.data,
      });
    });
  };
  //
  const EditableTable = (props: IPropsTable) => {
    const { data, form, add, remove } = props;
    const [editMode, setEditMode] = useState<boolean>(false);
    const [editingIndex, setEditingIndex] = useState<number | undefined>(
      undefined
    );
    const [isNewService, setNewService] = useState<boolean>(false);
    const onDelete = async (dataIndex: number) => {
      const rowId = form.getFieldValue(["reference", dataIndex, "id"]);
      console.log(form.getFieldValue("reference"));
      console.log(rowId);
      await ReferenceService.remove(rowId).then((response) => {
        if (response.success) {
          openNofi("success", "Амжиллтай", "Устгагдав");
        }
      });
      remove(dataIndex);
    };
    const addService = () => {
      form
        .validateFields([["reference", editingIndex, "name"]])
        .then(() => {
          add();
          setEditingIndex(data.length);
          setNewService(true);
          setEditMode(false);
        })
        .catch((error) => {
          error.errorFields?.map((errorMsg: any) => {
            message.error(errorMsg.errors[0]);
          });
        });
    };
    const onCancel = (index: number) => {
      if (isNewService) {
        remove(index);
      } else {
        form.resetFields([["reference", index, "name"]]);
      }
      setNewService(false);
      setEditingIndex(undefined);
    };
    const onSave = async () => {
      form
        .validateFields([["reference", editingIndex, "name"]])
        .then(async () => {
          setNewService(false);
          setEditingIndex(undefined);
          if (editMode) {
            console.log("end acount patch");
          } else {
            var data: IDataReference = {
              type: type,
              name: form.getFieldValue(["reference", editingIndex, "name"]),
            };
            await ReferenceService.post(data).then((response) => {
              if (response.success) {
                openNofi("success", "Амжилттай", "Нэмэгдэв");
                getData();
              }
            });
          }
        })
        .catch((error) => {
          error.errorFields?.map((errorMsg: any) => {
            message.error(errorMsg.errors[0]);
          });
        });
    };
    return (
      <div>
        <Table
          onRow={(record, rowIndex) => {
            return {
              onDoubleClick: (event) => {
                onClickModal?.(
                  form.getFieldValue(["reference", rowIndex, "id"])
                );
              }, // double click row
            };
          }}
          dataSource={data}
          pagination={false}
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
          <Column
            dataIndex={"name"}
            title={"Нэр"}
            render={(value, row, index) => {
              return (
                <Form.Item
                  rules={[
                    {
                      required: true,
                      message: "Нэр заавал",
                    },
                  ]}
                  name={[index, "name"]}
                >
                  <NewInput
                    disabled={!(index === editingIndex)}
                    placeholder="Нэр"
                    min={0}
                    max={150}
                  />
                </Form.Item>
              );
            }}
          />
          <Column
            title={" "}
            width={110}
            render={(value, row, index) => {
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
                      disabled={editingIndex !== undefined}
                      onClick={() => {
                        setEditingIndex(index);
                        setEditMode(true);
                      }}
                    />
                    <Popconfirm
                      title="Are you sure？"
                      okText="Yes"
                      cancelText="No"
                      onConfirm={() => {
                        onDelete(index);
                      }}
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
      </div>
    );
  };
  //
  useEffect(() => {
    getData();
  }, []);
  return (
    <div>
      <Form form={form}>
        <Form.List name="reference">
          {(reference, { add, remove }) => (
            <EditableTable
              data={reference}
              form={form}
              add={add}
              remove={remove}
            />
          )}
        </Form.List>
      </Form>
    </div>
  );
};
export default Reference;

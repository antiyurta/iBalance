import Image from "next/image";
import { App, Button, Form, FormInstance, Popconfirm, Table } from "antd";
import { FormListFieldData } from "antd/lib";
import { Fragment, SetStateAction, useState } from "react";
import {
  SaveOutlined,
  CloseOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { NewInput, NewInputNumber } from "@/components/input";
import { MaterialType } from "@/service/material/entities";
import { MaterialSelect } from "@/components/material-select";
import MaterialSearch from "@/components/material-search";
import { IDataViewMaterial } from "@/service/material/view-material/entities";

const { Column } = Table;

interface IProps {
  data: FormListFieldData[];
  form: FormInstance;
  add: () => void;
  remove: (index: number) => void;
}

const EditableTableProduct = (props: IProps) => {
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
        ["prices"],
        ["prices", editingIndex, "materialId"],
        ["prices", editingIndex, "unitAmount"],
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
  const onRemove = (index: number) => {
    const amount = form.getFieldValue(["accounts", index, "amount"]);
    const limitAmount = form.getFieldValue("amount");
    form.setFieldValue("amount", limitAmount - amount);
    remove(index);
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
        pagination={false}
      >
        <Column
          dataIndex={"materialId"}
          title="Дотоод код"
          render={(_, __, index) => (
            <MaterialSearch
              params={{ types: [MaterialType.Material] }}
              isDisable={editingIndex !== index}
              isEdit={true}
              materialId={form.getFieldValue(["prices", index, "materialId"])}
              onMaterial={(material) => {
                form.setFieldsValue({
                  prices: {
                    [index]: {
                      materialId: material?.id,
                      name: material?.name,
                      measurement: material?.measurementName,
                      countPackage: material?.countPackage,
                      section: material?.sectionName,
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
              <Form.Item name={[index, "name"]}>
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
              <Form.Item name={[index, "measurement"]}>
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
              <Form.Item name={[index, "countPackage"]}>
                <NewInput disabled />
              </Form.Item>
            );
          }}
        />
        <Column
          dataIndex={"section"}
          title="Бараа материалын бүлэг"
          render={(_, __, index) => {
            return (
              <Form.Item name={[index, "section"]}>
                <NewInput disabled />
              </Form.Item>
            );
          }}
        />
        <Column
          dataIndex={"unitAmount"}
          title="Нэгж үнэ"
          render={(_, __, index) => {
            return (
              <Form.Item
                name={[index, "unitAmount"]}
                rules={[
                  {
                    required: true,
                    message: "Нэгж үнэ заавал",
                  },
                ]}
              >
                <NewInputNumber
                  disabled={!(index === editingIndex)}
                  prefix={"₮ "}
                  formatter={(value: any) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value: any) => value.replace(/\$\s?|(,*)/g, "")}
                />
              </Form.Item>
            );
          }}
        />
        <Column
          dataIndex={"lumpQuantity"}
          title="Бөөний үнээрх тоо хэмжээ"
          render={(_, __, index) => {
            return (
              <Form.Item name={[index, "lumpQuantity"]}>
                <NewInputNumber
                  disabled={!(index === editingIndex)}
                  prefix={"ш "}
                  formatter={(value: any) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value: any) => value.replace(/\$\s?|(,*)/g, "")}
                />
              </Form.Item>
            );
          }}
        />
        <Column
          dataIndex={"lumpAmount"}
          title="Бөөний нэгж үнэ"
          render={(_, __, index) => {
            return (
              <Form.Item name={[index, "lumpAmount"]}>
                <NewInputNumber
                  disabled={!(index === editingIndex)}
                  prefix={"₮ "}
                  formatter={(value: any) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value: any) => value.replace(/\$\s?|(,*)/g, "")}
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
    </>
  );
};
export default EditableTableProduct;

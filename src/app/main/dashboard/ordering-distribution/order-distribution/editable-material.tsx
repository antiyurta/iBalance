import { NewInput, NewInputNumber } from "@/components/input";
import MaterialSearch from "@/components/material-search";
import { Column } from "@/components/table";
import { MaterialType } from "@/service/material/entities";
import { App, Button, Form, Popconfirm, Table } from "antd";
import { FormInstance, FormListFieldData } from "antd/lib";
import Image from "next/image";
import { Fragment, useState } from "react";
import {
  SaveOutlined,
  CloseOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { BookingStatus } from "@/service/booking/entities";

interface IProps {
  data: FormListFieldData[];
  form: FormInstance;
  status?: BookingStatus;
  add: () => void;
  remove: (index: number) => void;
}
const EditableMateral: React.FC<IProps> = ({
  data,
  form,
  status = "NEW",
  add,
  remove,
}) => {
  const { message } = App.useApp();
  const [isNewService, setNewService] = useState<boolean>(false);
  const [editingIndex, setEditingIndex] = useState<number>();
  const onSave = async () => {
    const fields = [
      ["bookingMaterials"],
      ["bookingMaterials", editingIndex, "materialId"],
      ["bookingMaterials", editingIndex, "material", "name"],
      ["bookingMaterials", editingIndex, "material", "countPackage"],
      ["bookingMaterials", editingIndex, "quantity"],
    ];
    if (status == "DISTRIBUTE") {
      fields.push(["bookingMaterials", editingIndex, "distributeQuantity"]);
    }
    if (status == "CONFIRM") {
      fields.push(["bookingMaterials", editingIndex, "confirmQuantty"]);
    }
    return form
      .validateFields(fields)
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
  const onDisabled = (index: number): boolean => {
    if (status !== "NEW") return true;
    else return editingIndex !== index;
  };
  return (
    <Table
      dataSource={data}
      footer={() => {
        return (
          status == "NEW" && (
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
          )
        );
      }}
    >
      <Column
        dataIndex={"materialId"}
        title="Дотоод код"
        render={(_, __, index) => (
          <Form.Item
            name={[index, "materialId"]}
            rules={[{ required: true, message: "Дотоод код заавал" }]}
          >
            <MaterialSearch
              isDisable={onDisabled(index)}
              params={{ types: [MaterialType.Material] }}
              onMaterial={(material) => {
                form.setFieldsValue({
                  bookingMaterials: {
                    [index]: {
                      materialId: material?.id,
                      material: {
                        name: material?.name,
                        countPackage: material?.countPackage,
                        measurement: {
                          name: material?.measurementName,
                        },
                      },
                      lastQty: material?.lastQty,
                      quantity: 1,
                    },
                  },
                });
              }}
            />
          </Form.Item>
        )}
      />
      <Column
        dataIndex={"name"}
        title="Бараа материалын нэр"
        render={(_, __, index) => (
          <Form.Item name={[index, "material", "name"]}>
            <NewInput disabled />
          </Form.Item>
        )}
      />
      <Column
        dataIndex={"measurement"}
        title="Хэмжих нэгж"
        render={(_, __, index) => (
          <Form.Item name={[index, "material", "measurement", "name"]}>
            <NewInput disabled />
          </Form.Item>
        )}
      />
      <Column
        dataIndex={"countPackage"}
        title="Багц доторх тоо"
        render={(_, __, index) => (
          <Form.Item name={[index, "material", "countPackage"]}>
            <NewInputNumber disabled />
          </Form.Item>
        )}
      />
      <Column
        dataIndex={"lastQty"}
        title="Агуулахын үлдэгдэл"
        render={(_, __, index) => (
          <Form.Item name={[index, "lastQty"]}>
            <NewInputNumber disabled />
          </Form.Item>
        )}
      />
      <Column
        dataIndex={"quantity"}
        title="Тоо хэмжээ/захиалга/"
        render={(_, __, index) => (
          <Form.Item
            name={[index, "quantity"]}
            rules={[{ required: true, message: "Тоо хэмжээ/захиалга/" }]}
          >
            <NewInputNumber disabled={onDisabled(index)} />
          </Form.Item>
        )}
      />
      {status == "DISTRIBUTE" && (
        <Column
          dataIndex={"distributeQuantity"}
          title="Тоо хэмжээ/зөвшөөрсөн/"
          render={(_, __, index) => (
            <Form.Item
              name={[index, "distributeQuantity"]}
              rules={[{ required: true, message: "Тоо хэмжээ/зөвшөөрсөн/" }]}
            >
              <NewInputNumber disabled={editingIndex != index} />
            </Form.Item>
          )}
        />
      )}
      {status == "CONFIRM" && (
        <Column
          dataIndex={"confirmQuantity"}
          title="Тоо хэмжээ/олгосон/"
          render={(_, __, index) => (
            <Form.Item
              name={[index, "confirmQuantity"]}
              rules={[{ required: true, message: "Тоо хэмжээ/олгосон/" }]}
            >
              <NewInputNumber disabled={editingIndex != index} />
            </Form.Item>
          )}
        />
      )}
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
                  title="Итгэлтэй байна уу."
                  okText="Тийм"
                  cancelText="Үгүй"
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
export default EditableMateral;

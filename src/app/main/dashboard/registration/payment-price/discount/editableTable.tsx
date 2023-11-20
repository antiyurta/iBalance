import Image from "next/image";
import {
  Button,
  Form,
  FormInstance,
  Popconfirm,
  Switch,
  Table,
  message,
} from "antd";
import { FormListFieldData } from "antd/lib";
import { Fragment, useState } from "react";
import {
  SaveOutlined,
  CloseOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { NewDatePicker, NewInput, NewInputNumber } from "@/components/input";
import { MaterialSelect } from "@/components/material-select";
import { MaterialType } from "@/service/material/entities";
const { Column } = Table;

interface IProps {
  data: FormListFieldData[];
  form: FormInstance;
  add: () => void;
  remove: (index: number) => void;
}

const EditableTableDiscount = (props: IProps) => {
  const { data, form, add, remove } = props;
  const [isNewService, setNewService] = useState<boolean>(false);
  const [editingIndex, setEditingIndex] = useState<number>();
  const [isPercent, setIsPercent] = useState<boolean>(false);
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
        ["discounts", editingIndex, "materialId"],
        ["discounts", editingIndex, "endAt"],
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
    <Table
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
            params={{
              types: [
                MaterialType.Service,
                MaterialType.Material,
                MaterialType.Package,
              ],
            }}
            form={form}
            rules={[{ required: true, message: "Дотоод код заавал" }]}
            name={[index, "materialId"]}
            listName="discounts"
            disabled={!(index === editingIndex)}
            onClear={() => {
              form.resetFields([
                ["discounts", index, "name"],
                ["discounts", index, "measurement"],
                ["discounts", index, "countPackage"],
                ["discounts", index, "section"],
                ["discounts", index, "unitAmount"],
              ]);
            }}
            onSelect={(value) => {
              form.setFieldsValue({
                discounts: {
                  [index]: {
                    name: value.name,
                    measurement: value.measurementName,
                    countPackage: value.countPackage,
                    section: value.sectionName,
                    unitAmount: value.unitAmount,
                  },
                },
              });
            }}
            materialTypes={[]}
          />
        )}
      />
      <Column
        dataIndex={"name"}
        title="Бараа/Үйлчилгээний нэр"
        render={(_, __, index) => (
          <Form.Item name={[index, "name"]}>
            <NewInput disabled />
          </Form.Item>
        )}
      />
      <Column
        dataIndex={"section"}
        title="Бараа/Үйлчилгээний нэр"
        render={(_, __, index) => (
          <Form.Item name={[index, "section"]}>
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
        dataIndex={"unitAmount"}
        title="Нэгж үнэ"
        render={(_, __, index) => (
          <Form.Item name={[index, "unitAmount"]}>
            <NewInputNumber
              disabled
              prefix={"₮ "}
              formatter={(value: any) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value: any) => value.replace(/\$\s?|(,*)/g, "")}
            />
          </Form.Item>
        )}
      />
      <Column
        dataIndex={"endAt"}
        title="Хөнгөлөлт дуусах огноо"
        render={(_, __, index) => (
          <Form.Item
            name={[index, "endAt"]}
            rules={[
              {
                required: true,
                message: "Хөнгөлөлт дуусах огноо",
              },
            ]}
          >
            <NewDatePicker disabled={!(index === editingIndex)} />
          </Form.Item>
        )}
      />
      <Column
        title="Хөнгөлөлт хувь эсэх"
        render={(_, __, index) => (
          <Form.Item name={[index, "isPercent"]} valuePropName="checked">
            <Switch
              disabled={!(index === editingIndex)}
              onChange={(value) => setIsPercent(value)}
            />
          </Form.Item>
        )}
      />
      {isPercent ? (
        <Column
          dataIndex={"percent"}
          title="Хөнгөлөлт"
          render={(_, __, index) => (
            <Form.Item name={[index, "percent"]}>
              <NewInputNumber
                disabled={!(index === editingIndex)}
                suffix={"%"}
                formatter={(value: any) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value: any) => value.replace(/\$\s?|(,*)/g, "")}
              />
            </Form.Item>
          )}
        />
      ) : (
        <Column
          dataIndex={"amount"}
          title="Хөнгөлөлт"
          render={(_, __, index) => (
            <Form.Item name={[index, "amount"]}>
              <NewInputNumber
                disabled={!(index === editingIndex)}
                suffix={"₮"}
                parser={(value: any) => value.replace(/\$\s?|(,*)/g, "")}
              />
            </Form.Item>
          )}
        />
      )}
      {/* Засах устгах хэсэг */}
      <Column
        title={" "}
        width={160}
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
export default EditableTableDiscount;

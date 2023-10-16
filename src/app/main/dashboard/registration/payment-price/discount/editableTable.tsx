import Image from "next/image";
import {
  Button,
  Form,
  FormInstance,
  Popconfirm,
  Space,
  Table,
  message,
} from "antd";
import { FormListFieldData } from "antd/lib";
import { Fragment, useEffect, useState } from "react";
import {
  SaveOutlined,
  CloseOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import {
  NewDatePicker,
  NewInput,
  NewInputNumber,
  NewSelect,
} from "@/components/input";
import { MaterialType } from "@/service/material/entities";
import {
  IDataViewMaterial,
  IParamViewMaterial,
} from "@/service/material/view-material/entities";
import { ViewMaterialService } from "@/service/material/view-material/service";
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
  const [viewMaterials, setViewMaterials] = useState<IDataViewMaterial[]>([]);
  const [viewMaterialDictionary, setViewMaterialDictionary] =
    useState<Map<number, IDataViewMaterial>>();
  const [isOpenPopover, setIsOpenPopOver] = useState<boolean>(false);

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
  const getViewMaterials = async (params: IParamViewMaterial) => {
    await ViewMaterialService.get(params).then((response) => {
      if (response.success) {
        setViewMaterials(response.response.data);
      }
    });
  };
  const materialFormField = (id: number) => {
    const material = viewMaterialDictionary?.get(id);
    if (material) {
      form.setFieldsValue({
        ["discounts"]: {
          [`${editingIndex}`]: {
            name: material.name,
            measurement: material.measurementName,
            section: material.sectionName,
            unitAmount: material.unitAmount,
          },
        },
      });
    }
  };
  useEffect(() => {
    setViewMaterialDictionary(
      viewMaterials.reduce((dict, material) => {
        dict.set(material.id, material);
        return dict;
      }, new Map<number, IDataViewMaterial>())
    );
  }, [viewMaterials]);

  useEffect(() => {
    getViewMaterials({ types: [MaterialType.Material, MaterialType.Service] });
  }, []);
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
        render={(value, row, index) => (
          <Form.Item>
            <Space.Compact>
              {index === editingIndex ? (
                <div className="extraButton">
                  <Image
                    onClick={() => setIsOpenPopOver(true)}
                    src="/icons/clipboardBlack.svg"
                    width={16}
                    height={16}
                    alt="clipboard"
                  />
                </div>
              ) : null}
              <Form.Item
                name={[index, "materialId"]}
                rules={[
                  {
                    required: true,
                    message: "Дотоод код заавал",
                  },
                ]}
              >
                <NewSelect
                  allowClear
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toString()
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  disabled={!(index === editingIndex)}
                  onClear={() => {
                    form.resetFields([
                      ["prices", index, "name"],
                      ["prices", index, "measurement"],
                      ["prices", index, "countPackage"],
                      ["prices", index, "section"],
                    ]);
                  }}
                  options={viewMaterials?.map((material) => ({
                    value: material.id,
                    label: material.code,
                  }))}
                  onSelect={materialFormField}
                />
              </Form.Item>
            </Space.Compact>
          </Form.Item>
        )}
      />
      <Column
        dataIndex={"name"}
        title="Бараа/Үйлчилгээний нэр"
        render={(value, row, index) => (
          <Form.Item name={[index, "name"]}>
            <NewInput disabled />
          </Form.Item>
        )}
      />
      <Column
        dataIndex={"section"}
        title="Бараа/Үйлчилгээний нэр"
        render={(value, row, index) => (
          <Form.Item name={[index, "section"]}>
            <NewInput disabled />
          </Form.Item>
        )}
      />
      <Column
        dataIndex={"measurement"}
        title="Хэмжих нэгж"
        render={(value, row, index) => (
          <Form.Item name={[index, "measurement"]}>
            <NewInput disabled />
          </Form.Item>
        )}
      />
      <Column
        dataIndex={"unitAmount"}
        title="Нэгж үнэ"
        render={(value, row, index) => (
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
        render={(value, row, index) => (
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
        dataIndex={"percent"}
        title="Хөнгөлөлтийн хувь"
        render={(value, row, index) => (
          <Form.Item name={[index, "percent"]}>
            <NewInputNumber
              disabled={!(index === editingIndex)}
              prefix={"₮"}
              formatter={(value: any) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value: any) => value.replace(/\$\s?|(,*)/g, "")}
            />
          </Form.Item>
        )}
      />
      <Column
        dataIndex={"amount"}
        title="Хөнгөлөлт хассан /Хямдарсан/ үнэ"
        render={(value, row, index) => (
          <Form.Item name={[index, "amount"]}>
            <NewInputNumber
              disabled={!(index === editingIndex)}
              prefix={"%"}
              parser={(value: any) => value.replace(/\$\s?|(,*)/g, "")}
            />
          </Form.Item>
        )}
      />
      {/* Засах устгах хэсэг */}
      <Column
        title={" "}
        width={160}
        render={(value, row, index) => {
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

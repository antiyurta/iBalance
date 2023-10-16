import { App, Button, Form, Popconfirm, Space, Table } from "antd";
import { FormInstance, FormListFieldData } from "antd/lib";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import {
  SaveOutlined,
  CloseOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { NewInput, NewInputNumber, NewSelect } from "@/components/input";
import NewModal from "@/components/modal";
import InventoriesRegistration from "@/app/main/dashboard/registration/inventory/inventories-registration/inventoriesRegistration";
import { IDataMaterial } from "@/service/material/entities";
import { MaterialService } from "@/service/material/service";
import { IDataUnitOfMeasure } from "@/service/material/unitOfMeasure/entities";
import { UnitOfMeasureService } from "@/service/material/unitOfMeasure/service";

interface IProps {
  isFormAdd: boolean;
  data: FormListFieldData[];
  form: FormInstance;
  add: () => void;
  remove: (index: number) => void;
}

const { Column } = Table;

const EditableTableOrder = (props: IProps) => {
  const { isFormAdd, data, form, add, remove } = props;
  const [isOpenModalMaterial, setIsOpenModalMaterial] =
    useState<boolean>(false);
  const { message } = App.useApp();
  const [isNewService, setNewService] = useState<boolean>(false);
  const [editingIndex, setEditingIndex] = useState<number | undefined>(
    undefined
  );
  //material
  const [materials, setMaterials] = useState<IDataMaterial[]>([]);
  const [materialDictory, setMaterialDictionary] =
    useState<Map<number, IDataMaterial>>();
  // hemjih negj
  const [measuries, setMeasuries] = useState<IDataUnitOfMeasure[]>([]);
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
        // ["discounts", editingIndex, "materialId"],
        // ["discounts", editingIndex, "endAt"],
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
    // const amount = form.getFieldValue(["accounts", index, "amount"]);
    // const limitAmount = form.getFieldValue("amount");
    // form.setFieldValue("amount", limitAmount - amount);
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
  //
  const Footer = () => (
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
  //
  const materialFormField = (id: number) => {
    console.log(id);
    const material = materialDictory?.get(id);
    if (material) {
      form.setFieldsValue({
        ["test"]: {
          [`${editingIndex}`]: {
            code: material.id,
            name: material.name,
            measurementId: material.measurementId,
            countPackage: material.countPackage,
            order_price: material.price,
          },
        },
      });
    }
  };
  const getMaterials = async () => {
    await MaterialService.get().then((response) => {
      if (response.success) {
        const data = response.response.data;
        setMaterials(response.response.data);
        setMaterialDictionary(
          data.reduce((dict, material) => {
            dict.set(material.id, material);
            return dict;
          }, new Map<number, IDataMaterial>())
        );
      }
    });
  };
  const getMeasurements = async () => {
    await UnitOfMeasureService.get({}).then((response) => {
      setMeasuries(response.response.data);
    });
  };
  useEffect(() => {
    getMaterials();
    getMeasurements();
  }, []);
  return (
    <>
      <Table dataSource={data} footer={isFormAdd ? Footer : undefined}>
        <Column
          title="Дотоод код"
          dataIndex={"code"}
          render={(_, __, index) => (
            <Form.Item>
              <Space.Compact>
                <div
                  className="extraButton"
                  onClick={() => {
                    if (index === editingIndex) {
                      setIsOpenModalMaterial(true);
                    }
                  }}
                >
                  <Image
                    src="/icons/clipboardBlack.svg"
                    width={16}
                    height={16}
                    alt="clipboard"
                  />
                </div>
                <Form.Item name={[index, "code"]}>
                  <NewSelect
                    disabled={!(index === editingIndex)}
                    allowClear
                    showSearch
                    virtual={false}
                    optionFilterProp="children"
                    filterOption={(input, label) =>
                      (label?.label ?? "")
                        .toString()
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    onSelect={materialFormField}
                    options={materials?.map((material) => ({
                      label: material.code,
                      value: material.id,
                    }))}
                  />
                </Form.Item>
              </Space.Compact>
            </Form.Item>
          )}
        />
        <Column
          title="Бараа материалын нэр"
          dataIndex={"name"}
          render={(_, __, index) => (
            <Form.Item name={[index, "name"]}>
              <NewInput disabled />
            </Form.Item>
          )}
        />
        <Column
          title="Хэмжих нэгж"
          dataIndex={"measurementId"}
          render={(_, __, index) => (
            <Form.Item name={[index, "measurementId"]}>
              <NewSelect
                disabled
                allowClear
                showSearch
                optionFilterProp="children"
                filterOption={(input, label) =>
                  (label?.label ?? "")
                    .toString()
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={measuries?.map((measure) => ({
                  label: measure.name,
                  value: measure.id,
                }))}
              />
            </Form.Item>
          )}
        />
        <Column
          title="Багц доторх тоо"
          dataIndex={"countPackage"}
          render={(_, __, index) => (
            <Form.Item name={[index, "countPackage"]}>
              <NewInputNumber disabled />
            </Form.Item>
          )}
        />
        <Column
          title="Агуулахын үлдэгдэл"
          dataIndex={"balance"}
          render={(_, __, index) => (
            <Form.Item name={[index, "balance"]}>
              <NewInputNumber disabled />
            </Form.Item>
          )}
        />
        <Column
          title="Тоо хэмжээ /захиалга/"
          dataIndex={"order_quantity"}
          render={(_, __, index) => (
            <Form.Item name={[index, "order_quantity"]}>
              <NewInputNumber disabled={!(index === editingIndex)} />
            </Form.Item>
          )}
        />
        <Column
          title="Нэгж үнэ /захиалга/"
          dataIndex={"order_price"}
          render={(_, __, index) => (
            <Form.Item name={[index, "order_price"]}>
              <NewInputNumber disabled />
            </Form.Item>
          )}
        />
        <Column
          title="Дүн /захиалга/"
          dataIndex={"order_amount"}
          render={(_, __, index) => (
            <Form.Item name={[index, "order_amount"]}>
              <NewInputNumber disabled />
            </Form.Item>
          )}
        />
        <Column
          title="Бараа үйлчилгээний хөнгөлөлт/захиалга/"
          dataIndex={"order_discount"}
          render={(_, __, index) => (
            <Form.Item name={[index, "order_discount"]}>
              <NewInputNumber disabled />
            </Form.Item>
          )}
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
                      disabled={editingIndex !== undefined}
                    />
                  </Popconfirm>
                </React.Fragment>
              );
            }
          }}
        />
      </Table>
      <NewModal
        width={1300}
        title="Бараа материал бүртгэл"
        open={isOpenModalMaterial}
        onCancel={() => setIsOpenModalMaterial(false)}
        footer={null}
      >
        <InventoriesRegistration
          ComponentType="MIDDLE"
          onClickModal={(row: IDataMaterial) => {
            materialFormField(row.id);
            setIsOpenModalMaterial(false);
          }}
        />
      </NewModal>
    </>
  );
};
export default EditableTableOrder;

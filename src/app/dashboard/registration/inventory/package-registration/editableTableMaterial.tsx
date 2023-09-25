import {
  EditOutlined,
  DeleteOutlined,
  SaveOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { Button, Form, Popconfirm, Table, message } from "antd";
import type { FormListFieldData } from "antd";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { NewInput, NewInputNumber, NewSelect } from "@/components/input";
import { FormInstance } from "antd/lib";
import { IDataMaterial, IParamMaterial } from "@/service/material/entities";
import { MaterialService } from "@/service/material/service";
interface IProps {
  data: FormListFieldData[];
  form: FormInstance;
  add: () => void;
  remove: (index: number) => void;
}

const { Column } = Table;

function EditableTableMaterial(props: IProps) {
  const { data, form, add, remove } = props;
  const [materials, setMaterials] = useState<IDataMaterial[]>([]);
  const [isNewService, setNewService] = useState<boolean>(false);
  const [editingIndex, setEditingIndex] = useState<number>();
  const [materialDictionary, setMaterialDictionary] =
    useState<Map<number, IDataMaterial>>();
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
      form.resetFields([
        ["packageMaterials", index, "materialId"],
        ["packageMaterials", index, "name"],
        ["packageMaterials", index, "materialSectionId"],
        ["packageMaterials", index, "measurementId"],
        ["packageMaterials", index, "countPackage"],
        ["packageMaterials", index, "quantity"],
      ]);
    }
    setNewService(false);
    setEditingIndex(undefined);
  };
  const materialFormField = (id: number) => {
    const material = materialDictionary?.get(id);
    if (material) {
      form.setFieldsValue({
        ["packageMaterials"]: {
          [`${editingIndex}`]: {
            name: material.name,
            materialSectionId: material.materialSectionId,
            measurementId: material.measurementId,
            countPackage: material.countPackage,
          },
        },
      });
    }
  };
  const getMaterials = async (params: IParamMaterial) => {
    await MaterialService.get(params).then((response) => {
      if (response.success) {
        setMaterials(response.response.data);
      }
    });
  };
  useEffect(() => {
    getMaterials({});
  }, []);
  useEffect(() => {
    setMaterialDictionary(
      materials.reduce((dict, material) => {
        dict.set(material.id, material);
        return dict;
      }, new Map<number, IDataMaterial>())
    );
  }, [materials]);
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
        render={(value, row, index) => (
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
              options={materials.map((material) => ({
                value: material.id,
                label: material.code,
              }))}
              onSelect={materialFormField}
            />
          </Form.Item>
        )}
      />
      <Column
        dataIndex={"name"}
        title={"Бараа материалын нэр"}
        render={(value, row, index) => (
          <Form.Item name={[index, "name"]}>
            <NewInput disabled />
          </Form.Item>
        )}
      />
      <Column
        dataIndex={"materialSectionId"}
        title={"Бараа материалын бүлэг"}
        render={(value, row, index) => (
          <Form.Item name={[index, "materialSectionId"]}>
            <NewSelect
              disabled
              options={materials.map((material) => ({
                value: material.materialSectionId,
                label: material.section?.name,
              }))}
            />
          </Form.Item>
        )}
      />
      <Column
        dataIndex={"measurementId"}
        title={"Хэмжих нэгж"}
        render={(value, row, index) => (
          <Form.Item name={[index, "measurementId"]}>
            <NewSelect
              disabled
              options={materials.map((material) => ({
                value: material.measurementId,
                label: material.measurement?.name,
              }))}
            />
          </Form.Item>
        )}
      />
      <Column
        dataIndex={"countPackage"}
        title={"Багц доторх тоо"}
        render={(value, row, index) => (
          <Form.Item name={[index, "countPackage"]}>
            <NewInputNumber disabled />
          </Form.Item>
        )}
      />
      <Column
        dataIndex={"quantity"}
        title={"Тоо ширхэг"}
        render={(value, row, index) => (
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
                  disabled={editingIndex ? true : false }
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

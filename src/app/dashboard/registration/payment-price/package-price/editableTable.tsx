import Image from "next/image";
import {
  App,
  Button,
  Form,
  FormInstance,
  Popconfirm,
  Space,
  Table,
} from "antd";
import { FormListFieldData } from "antd/lib";
import { Fragment, useContext, useEffect, useState } from "react";
import {
  SaveOutlined,
  CloseOutlined,
  EditOutlined,
  DeleteOutlined,
  DownOutlined,
  UpOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { NewInput, NewInputNumber, NewSelect } from "@/components/input";
import {
  IDataMaterial,
  IParamMaterial,
  MaterialType,
} from "@/service/material/entities";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import { MaterialService } from "@/service/material/service";
import { IncludedMaterialTable } from "./included-materials";
import { ViewMaterialService } from "@/service/material/view-material/service";
// import { IDataViewMaterial, IParamViewMaterial } from "@/service/material/view-material/entities";
// import { ViewMaterialService } from "@/service/material/view-material/service";
const { Column } = Table;

interface IProps {
  data: FormListFieldData[];
  form: FormInstance;
  add: () => void;
  remove: (index: number) => void;
}

const EditableTablePackage = (props: IProps) => {
  const { message } = App.useApp();
  const { data, form, add, remove } = props;
  const blockContext: BlockView = useContext(BlockContext);
  const [isNewService, setNewService] = useState<boolean>(false);
  const [materials, setMaterials] = useState<IDataMaterial[]>([]);
  const [materialDictionary, setMaterialDictionary] =
    useState<Map<number, IDataMaterial>>();
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
  const getMaterials = async (params: IParamMaterial) => {
    await MaterialService.get(params).then((response) => {
      if (response.success) {
        setMaterials(response.response.data);
      }
    });
  };
  const materialFormField = (id: number) => {
    const material = materialDictionary?.get(id);
    if (material) {
      form.setFieldsValue({
        ["prices"]: {
          [`${editingIndex}`]: {
            name: material.name,
            measurement: material.measurement.name,
            section: material.section.name,
            countPackage: material.countPackage,
          },
        },
      });
    }
  };
  useEffect(() => {
    setMaterialDictionary(
      materials.reduce((dict, material) => {
        const materialIds: number[] = material.packageMaterials.map(
          (packageMaterial) => packageMaterial.materialId
        );
        ViewMaterialService.get({
          ids: materialIds,
          types: [MaterialType.Service, MaterialType.Material],
        }).then(({ response }) => {
          material.materials = response.data;
        });
        dict.set(material.id, material);
        return dict;
      }, new Map<number, IDataMaterial>())
    );
  }, [materials]);

  useEffect(() => {
    getMaterials({ types: [MaterialType.Package] });
  }, []);
  return (
    <>
      <Table
        dataSource={data}
        expandable={{
          expandedRowRender: (render) => {
            const materialId = form.getFieldValue([
              "prices",
              render.key,
              "materialId",
            ]);
            if (materialId) {
              const material = materialDictionary?.get(materialId);
              if (material) {
                return <IncludedMaterialTable materials={material.materials} />;
              }
              return;
            }
            if (editingIndex === render.key) {
              form.getFieldValue("materialId");
              console.log("expandedRowRender", render);
            }
          },
          expandIcon: ({ expanded, onExpand, record }) =>
            expanded ? (
              <UpOutlined onClick={(e) => onExpand(record, e)} />
            ) : (
              <DownOutlined onClick={(e) => onExpand(record, e)} />
            ),
        }}
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
          dataIndex={"materialId"}
          title="Дотоод код"
          render={(value, row, index) => {
            return (
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
                      options={materials?.map((material) => ({
                        value: material.id,
                        label: material.code,
                      }))}
                      onSelect={materialFormField}
                    />
                  </Form.Item>
                </Space.Compact>
              </Form.Item>
            );
          }}
        />
        <Column
          dataIndex={"name"}
          title="Багцын нэр"
          render={(value, row, index) => {
            return (
              <Form.Item name={[index, "name"]}>
                <NewInput disabled />
              </Form.Item>
            );
          }}
        />
        <Column
          dataIndex={"section"}
          title="Багцын бүлэг"
          render={(value, row, index) => {
            return (
              <Form.Item name={[index, "section"]}>
                <NewInput disabled />
              </Form.Item>
            );
          }}
        />
        <Column
          dataIndex={"measurement"}
          title="Хэмжих нэгж"
          render={(value, row, index) => {
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
          render={(value, row, index) => {
            return (
              <Form.Item name={[index, "countPackage"]}>
                <NewInputNumber disabled />
              </Form.Item>
            );
          }}
        />
        <Column
          dataIndex={"unitAmount"}
          title="Нэгж үнэ"
          render={(value, row, index) => {
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
    </>
  );
};
export default EditableTablePackage;

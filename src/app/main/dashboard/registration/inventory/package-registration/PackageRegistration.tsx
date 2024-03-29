import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { SignalFilled } from "@ant-design/icons";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import ColumnSettings from "@/components/columnSettings";
import Description from "@/components/description";
import NewDirectoryTree from "@/components/tree";
import Filtered from "@/components/table/filtered";
import { ComponentType, DataIndexType, Meta } from "@/service/entities";
import {
  Button,
  Col,
  Form,
  Input,
  Popover,
  Row,
  Space,
  Typography,
} from "antd";
import {
  NewInput,
  NewInputNumber,
  NewSelect,
  NewSwitch,
} from "@/components/input";
import { findIndexInColumnSettings, getParam } from "@/feature/common";
import { NewTable } from "@/components/table";
import NewModal from "@/components/modal";
import {
  IDataMaterialSection,
  IParamMaterialSection,
} from "@/service/material/section/entities";
import { MaterialSectionService } from "@/service/material/section/service";
import {
  FilteredColumnsMaterial,
  IDataMaterial,
  IFilterMaterial,
  IParamMaterial,
  IResponseOneMaterial,
  MaterialType,
} from "@/service/material/entities";
import { MaterialService } from "@/service/material/service";
import {
  IDataUnitOfMeasure,
  IParamUnitOfMeasure,
} from "@/service/material/unitOfMeasure/entities";
import { UnitOfMeasureService } from "@/service/material/unitOfMeasure/service";
import EditableTableMaterial from "./editableTableMaterial";
import { useTypedSelector } from "@/feature/store/reducer";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/feature/store/store";
import { newPane } from "@/feature/store/slice/param.slice";
import PageTitle from "@/components/page-title";
import NewTreeSelect from "@/components/tree/tree-select";
const { Title } = Typography;

interface IProps {
  ComponentType: ComponentType;
  type: MaterialType;
  onClickModal?: (row: any) => void;
}
const key = "inventory/package-registration";
const PackageRegistration = (props: IProps) => {
  const { ComponentType, type, onClickModal } = props;
  const [form] = Form.useForm(); // add hiih Form
  const [data, setData] = useState<IDataMaterial[]>([]);
  const [meta, setMeta] = useState<Meta>({ page: 1, limit: 10 });
  const [filters, setFilters] = useState<IFilterMaterial>();
  const blockContext: BlockView = useContext(BlockContext);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<IDataMaterial>();
  const [materialSections, setMaterialSections] = useState<
    IDataMaterialSection[]
  >([]);
  const [measurements, setMeasurements] = useState<IDataUnitOfMeasure[]>([]);
  const [isDescription, setIsDescription] = useState<boolean>(false);
  const [isOpenPopOver, setIsOpenPopOver] = useState<boolean>(false);
  const [tableSelectedRows, setTableSelectedRows] = useState<IDataMaterial[]>(
    []
  );
  const { items } = useTypedSelector((state) => state.pane);
  const param = getParam(items, key);
  const dispatch = useDispatch<AppDispatch>();
  const [columns, setColumns] = useState<FilteredColumnsMaterial>({
    code: {
      label: "Багцын код",
      isView: true,
      isFiltered: false,
      dataIndex: ["code"],
      type: DataIndexType.MULTI,
    },
    name: {
      label: "Багцын нэр",
      isView: true,
      isFiltered: false,
      dataIndex: ["name"],
      type: DataIndexType.MULTI,
    },
    measurementId: {
      label: "Багцын хэмжих нэгж",
      isView: true,
      isFiltered: false,
      dataIndex: ["measurement", "name"],
      type: DataIndexType.MULTI,
    },
    materialSectionId: {
      label: "Багцын бүлэг",
      isView: true,
      isFiltered: false,
      dataIndex: ["section", "name"],
      type: DataIndexType.MULTI,
    },
    isActive: {
      label: "Төлөв",
      isView: true,
      isFiltered: false,
      dataIndex: ["isActive"],
      type: DataIndexType.BOOLEAN_STRING,
    },
    countPackage: {
      label: "Багц доторх тоо хэмжээ",
      isView: true,
      isFiltered: false,
      dataIndex: ["isActive"],
      type: DataIndexType.NUMBER,
    },
    updatedAt: {
      label: "Өөрчлөлт хийсэн огноо",
      isView: false,
      isFiltered: false,
      dataIndex: ["updatedAt"],
      type: DataIndexType.DATE,
    },
    updatedBy: {
      label: "Өөрчлөлт хийсэн хэрэглэгч",
      isView: false,
      isFiltered: false,
      dataIndex: ["updatedUser", "firstName"],
      type: DataIndexType.USER,
    },
  });
  const openModal = (state: boolean, row?: IDataMaterial) => {
    setIsEdit(state);
    setIsOpenModal(true);
    if (!state) {
      form.resetFields();
    } else {
      form.setFieldsValue({
        ...row,
        packageMaterials: row?.packageMaterials.map((packageMaterial) => ({
          materialId: packageMaterial.materialId,
          name: packageMaterial.material.name,
          materialSectionId: packageMaterial.material.materialSectionId,
          measurementId: packageMaterial.material.measurementId,
          countPackage: packageMaterial.material.countPackage,
          quantity: packageMaterial.quantity,
        })),
      });

      setSelectedRow(row);
    }
  };
  const rowSelection = {
    onSelectAll: (state: boolean, allRow: any, changeRow: any) => {
      console.log("select all", state, allRow, changeRow);
      if (state) {
        const clone = [...tableSelectedRows, ...changeRow];
        console.log(clone);
        setTableSelectedRows(clone);
      } else {
        const clone = [...tableSelectedRows];
        changeRow?.map((row: any) => {
          clone.splice(
            clone.findIndex((clo) => {
              return clo.id === row.id;
            }),
            1
          );
        });
        setTableSelectedRows(clone);
      }
    },
    onSelect: (selectedRow: IDataMaterial, selected: boolean) => {
      if (selected) {
        if (!tableSelectedRows.find((e) => e.id === selectedRow.id)) {
          setTableSelectedRows([...tableSelectedRows, selectedRow]);
        }
      } else {
        var clone = [...tableSelectedRows];
        clone.splice(
          tableSelectedRows.findIndex((e) => e.id === selectedRow.id),
          1
        );
        setTableSelectedRows(clone);
      }
    },
    onChange: (
      selectedRowKeys: React.Key[],
      selectedRows: IDataMaterial[]
    ) => {},
    selectedRowKeys: tableSelectedRows.map((e) => e.id),
  };
  // end zuragtai hamaarah functionuud
  const getData = async (params: IParamMaterial) => {
    blockContext.block();
    await MaterialService.get(params).then((response) => {
      setData(response.response.data);
      setMeta(response.response.meta);
      setFilters(response.response.filter);
    });
    blockContext.unblock();
  };
  const getMaterialSection = async (params: IParamMaterialSection) => {
    await MaterialSectionService.get(params).then((response) => {
      setMaterialSections(response.response);
    });
  };
  const getMeasurements = async (params: IParamUnitOfMeasure) => {
    await UnitOfMeasureService.get(params).then((response) => {
      setMeasurements(response.response.data);
    });
  };
  // Өгөгдөлөө хадгалах
  const onFinish = async (data: IDataMaterial) => {
    blockContext.block();
    data.type = MaterialType.Package;
    if (isEdit && selectedRow) {
      await MaterialService.patchPackage(selectedRow.id, data)
        .then((response) => {
          success(response);
        })
        .finally(() => blockContext.unblock());
    } else {
      await MaterialService.postPackage(data)
        .then((response) => {
          success(response);
        })
        .finally(() => blockContext.unblock());
    }
  };
  const success = (response: IResponseOneMaterial) => {
    if (response.success) {
      getData({ ...param });
    }
    setIsOpenModal(false);
  };
  const onDelete = async (id: number) => {
    blockContext.block();
    await MaterialService.remove(id)
      .then((response) => {
        if (response.success) {
          getData({ ...param });
        }
      })
      .finally(() => {
        blockContext.unblock();
      });
  };
  useEffect(() => {
    getMaterialSection({ materialType: type });
    dispatch(newPane({ key, param: {} }));
  }, []);
  useEffect(() => {
    getData({ ...param, types: [MaterialType.Package] });
  }, [param]);
  useEffect(() => {
    if (isOpenModal) {
      getMeasurements({});
    }
  }, [isOpenModal]);
  return (
    <>
      {ComponentType === "FULL" && (
        <PageTitle onClick={() => openModal(false)} />
      )}
      <Row style={{ paddingTop: 12 }} gutter={[12, 24]}>
        <Col span={24}>
          <Row gutter={[0, 12]}>
            <Col span={24}>
              <Space
                style={{
                  width: "100%",
                  justifyContent: "flex-end",
                }}
                size={12}
              >
                <Filtered columns={columns} />
                {ComponentType === "FULL" ? (
                  <Space
                    style={{
                      width: "100%",
                      justifyContent: "flex-end",
                    }}
                    size={12}
                  >
                    <ColumnSettings
                      columns={columns}
                      columnIndexes={(arg1, arg2) =>
                        findIndexInColumnSettings({
                          newRowIndexes: arg1,
                          unSelectedRow: arg2,
                          columns,
                          onColumns: (columns) => setColumns(columns),
                        })
                      }
                    />
                    <Image
                      src={"/images/PrintIcon.svg"}
                      width={24}
                      height={24}
                      alt="printIcon"
                    />
                    <Image
                      src={"/images/UploadIcon.svg"}
                      width={24}
                      height={24}
                      alt="uploadIcon"
                    />
                    <Image
                      src={"/images/DownloadIcon.svg"}
                      width={24}
                      height={24}
                      alt="downloadIcon"
                    />
                  </Space>
                ) : null}
              </Space>
            </Col>
            <Col span={24}>
              <NewTable
                componentType={ComponentType}
                scroll={{ x: ComponentType === "FULL" ? 1700 : 400 }}
                rowKey="id"
                rowSelection={ComponentType === "LITTLE" ? rowSelection : null}
                doubleClick={true}
                onDClick={(value) => {
                  if (ComponentType === "FULL") {
                    setSelectedRow(value);
                    setIsDescription(true);
                  } else if (ComponentType === "MIDDLE") {
                    onClickModal?.(value);
                  }
                }}
                data={data}
                meta={meta}
                columns={columns}
                onColumns={(columns) => setColumns(columns)}
                incomeFilters={filters}
                isEdit
                isDelete
                onEdit={(row) => openModal(true, row)}
                onDelete={onDelete}
              />
            </Col>
          </Row>
        </Col>
        {isDescription ? (
          <Col md={24} lg={10} xl={6}>
            <Description
              title="Барааны мэдээлэл"
              open={isDescription}
              columns={columns}
              selectedRow={selectedRow}
              onEdit={() => openModal(true, selectedRow)}
              onDelete={onDelete}
              onCancel={(state) => {
                setIsDescription(state);
              }}
            />
          </Col>
        ) : null}
      </Row>
      <NewModal
        title="Багцын бүртгэл"
        open={isOpenModal}
        onCancel={() => setIsOpenModal(false)}
        onOk={() =>
          form.validateFields().then((values) => {
            onFinish(values);
          })
        }
        okText="Хадгалах"
        cancelText="Болих"
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            isIndividual: false,
            isEmployee: false,
            isActive: true,
          }}
        >
          <div className="form-grid-3">
            <Form.Item
              label="Багцын нэр"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Багцын нэр заавал",
                },
              ]}
            >
              <NewInput />
            </Form.Item>
            <Form.Item
              label="Дотоод код"
              name="code"
              rules={[
                {
                  required: true,
                  message: "Дотоод код заавал",
                },
                {
                  pattern: /^-?\d*(\.\d*)?$/,
                  message: "тоо оруулна уу",
                },
              ]}
            >
              <NewInput disabled={isEdit} />
            </Form.Item>
            <Form.Item label="Багцын хэмжих нэгж">
              <Space.Compact>
                <Form.Item
                  name="measurementId"
                  rules={[
                    {
                      required: true,
                      message: "Хэмжих нэгж заавал",
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
                    options={measurements.map((measurement) => ({
                      value: measurement.id,
                      label: measurement.name,
                    }))}
                  />
                </Form.Item>
                <div
                  style={{
                    marginLeft: 4,
                  }}
                  className="app-button-square"
                  //   onClick={() => setIsOpenModalBrand(true)}
                >
                  <Image
                    src={"/icons/plusGray.svg"}
                    height={18}
                    width={18}
                    alt="Нэмэх"
                  />
                </div>
              </Space.Compact>
            </Form.Item>
            <Form.Item label="Багцын бүлэг" name={"materialSectionId"}>
              <NewTreeSelect
                sections={materialSections}
                onChange={(value: string) =>
                  form.setFieldValue("materialSectionId", value)
                }
              />
            </Form.Item>
            <Form.Item label="Нийт тоо хэмжээ" name="countPackage">
              <NewInputNumber disabled />
            </Form.Item>
            <Form.Item
              label="Идэвхтэй эсэх"
              name="isActive"
              valuePropName="checked"
            >
              <NewSwitch />
            </Form.Item>
          </div>
          <hr />
          <Form.List name="packageMaterials">
            {(packageMaterials, { add, remove }) => (
              <EditableTableMaterial
                data={packageMaterials}
                form={form}
                add={add}
                remove={remove}
              />
            )}
          </Form.List>
        </Form>
      </NewModal>
    </>
  );
};
export default PackageRegistration;

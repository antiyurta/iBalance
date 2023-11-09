import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { SignalFilled } from "@ant-design/icons";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import ColumnSettings from "@/components/columnSettings";
import Description from "@/components/description";
import NewDirectoryTree from "@/components/directoryTree";
import Filtered from "@/components/filtered";
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
import { findIndexInColumnSettings, onCloseFilterTag } from "@/feature/common";
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
const { Title } = Typography;

interface IProps {
  ComponentType: ComponentType;
  type: MaterialType;
  onClickModal?: (row: any) => void;
}

const PackageRegistration = (props: IProps) => {
  const { ComponentType, type, onClickModal } = props;
  const [form] = Form.useForm(); // add hiih Form
  const [switchForm] = Form.useForm(); // buleg solih
  const [isOpenPopOverLittle, setIsOpenPopOverLittle] =
    useState<boolean>(false);
  const [data, setData] = useState<IDataMaterial[]>([]);
  const [meta, setMeta] = useState<Meta>({ page: 1, limit: 10 });
  const [filters, setFilters] = useState<IFilterMaterial>();
  const blockContext: BlockView = useContext(BlockContext);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<IDataMaterial>();
  // start used datas
  const [materialSections, setMaterialSections] = useState<
    IDataMaterialSection[]
  >([]);
  const [measurements, setMeasurements] = useState<IDataUnitOfMeasure[]>([]);
  // end used datas
  const [isDescription, setIsDescription] = useState<boolean>(false);
  const [params, setParams] = useState<IParamMaterial>({});
  const [isOpenPopOver, setIsOpenPopOver] = useState<boolean>(false);
  const [tableSelectedRows, setTableSelectedRows] = useState<IDataMaterial[]>(
    []
  );
  const [fileList, setFileList] = useState<any[]>([]);
  const [columns, setColumns] = useState<FilteredColumnsMaterial>({
    code: {
      label: "Багцын код",
      isView: true,
      isFiltered: false,
      dataIndex: "code",
      type: DataIndexType.MULTI,
    },
    name: {
      label: "Багцын нэр",
      isView: true,
      isFiltered: false,
      dataIndex: "name",
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
      dataIndex: "isActive",
      type: DataIndexType.BOOLEAN_STRING,
    },
    countPackage: {
      label: "Багц доторх тоо хэмжээ",
      isView: true,
      isFiltered: false,
      dataIndex: "isActive",
      type: DataIndexType.NUMBER,
    },
    updatedAt: {
      label: "Өөрчлөлт хийсэн огноо",
      isView: false,
      isFiltered: false,
      dataIndex: "updatedAt",
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
    setParams(params);
    await MaterialService.get(params).then((response) => {
      setData(response.response.data);
      setMeta(response.response.meta);
      setFilters(response.response.filter);
    });
    blockContext.unblock();
  };
  const getMaterialSection = async (params: IParamMaterialSection) => {
    await MaterialSectionService.get(params).then((response) => {
      setMaterialSections(response.response.data);
    });
  };
  const getMeasurements = async (params: IParamUnitOfMeasure) => {
    await UnitOfMeasureService.get(params).then((response) => {
      setMeasurements(response.response.data);
    });
  };
  useEffect(() => {
    getMaterialSection({ materialTypes: [type] });
    getData({ page: 1, limit: 10, types: [MaterialType.Package] });
  }, []);
  useEffect(() => {
    if (isOpenModal) {
      getMeasurements({});
    }
  }, [isOpenModal]);

  // Өгөгдөлөө хадгалах
  const onFinish = async (data: IDataMaterial) => {
    blockContext.block();
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
      getData(params);
    }
    setIsOpenModal(false);
  };
  const onDelete = async (id: number) => {
    blockContext.block();
    await MaterialService.remove(id)
      .then((response) => {
        if (response.success) {
          getData(params);
        }
      })
      .finally(() => {
        blockContext.unblock();
      });
  };
  return (
    <>
      <Row style={{ paddingTop: 12 }} gutter={[12, 24]}>
        {ComponentType === "FULL" ? (
          <>
            <Col md={24} lg={16} xl={19}>
              <Space size={24}>
                <Title level={5}>
                  Үндсэн бүртгэл / Бараа материал / Багцын бүртгэл
                </Title>
                <Button
                  type="primary"
                  onClick={() => openModal(false)}
                  icon={
                    <Image
                      src={"/images/AddIcon.svg"}
                      width={12}
                      height={12}
                      alt="addicon"
                    />
                  }
                >
                  Шинээр бүртгэх
                </Button>
              </Space>
            </Col>
            <Col md={24} lg={8} xl={5}>
              <Input.Search />
            </Col>
          </>
        ) : null}
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
                <Filtered
                  columns={columns}
                  isActive={(key, state) => {
                    onCloseFilterTag({
                      key: key,
                      state: state,
                      column: columns,
                      onColumn: (columns) => setColumns(columns),
                      params,
                      onParams: (params) => setParams(params),
                    });
                    getData(params);
                  }}
                />
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
                          params,
                          onParams: (params) => setParams(params),
                          getData: (params) => getData(params),
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
                onChange={(params) => getData(params)}
                onColumns={(columns) => setColumns(columns)}
                newParams={params}
                onParams={(params) => setParams(params)}
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
            <Form.Item label="Багцын бүлэг">
              <Space.Compact>
                <div className="extraButton">
                  <Popover
                    placement="bottom"
                    open={isOpenPopOver}
                    onOpenChange={(state) => setIsOpenPopOver(state)}
                    content={
                      <NewDirectoryTree
                        data={materialSections}
                        extra="HALF"
                        isLeaf={true}
                        onClick={(key, isLeaf) => {
                          if (isLeaf) {
                            setIsOpenPopOver(false);
                            form.setFieldsValue({
                              sectionId: key,
                            });
                          }
                        }}
                      />
                    }
                    trigger={"click"}
                  >
                    <SignalFilled rotate={-90} />
                  </Popover>
                </div>
                <Form.Item
                  style={{
                    width: "100%",
                  }}
                  name="materialSectionId"
                  rules={[
                    {
                      required: true,
                      message: "Багцын бүлэг заавал",
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
                    options={materialSections.map((materialSection) => ({
                      value: materialSection.id,
                      label: materialSection.name,
                    }))}
                  />
                </Form.Item>
              </Space.Compact>
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

"use client";

import { SignalFilled, PlusOutlined, SwapOutlined } from "@ant-design/icons";
import ColumnSettings from "@/components/columnSettings";
import Description from "@/components/description";
import NewDirectoryTree from "@/components/directoryTree";
import Filtered from "@/components/filtered";
import {
  NewInput,
  NewInputNumber,
  NewSelect,
  NewSwitch,
  NewTextArea,
} from "@/components/input";
import NewModal from "@/components/modal";
import { NewTable } from "@/components/table";
import {
  findIndexInColumnSettings,
  onCloseFilterTag,
  openNofi,
} from "@/feature/common";
import {
  ComponentType,
  DataIndexType,
  FilteredColumns,
  IFilters,
  Meta,
} from "@/service/entities";
import {
  IDataMaterial,
  IDataUnitCode,
  IFilterMaterial,
  IParamMaterial,
} from "@/service/material/entities";
import { MaterialService } from "@/service/material/service";
import {
  Button,
  Col,
  Form,
  Input,
  Popover,
  Row,
  Space,
  Typography,
  Upload,
} from "antd";
import Image from "next/image";
import { useEffect, useState } from "react";
import { UnitOfMeasureService } from "@/service/material/unitOfMeasure/service";
import { IDataUnitOfMeasure } from "@/service/material/unitOfMeasure/entities";
import UnitOfMeasure from "../unit-of-measure/unitOfMeasure";
import { IDataReference, IType } from "@/service/reference/entity";
import { ReferenceService } from "@/service/reference/reference";
import Reference from "@/components/reference";
import { RootState, useTypedSelector } from "@/feature/store/reducer";
import { BrandService } from "@/service/reference/brand/service";
import { IDataBrand } from "@/service/reference/brand/entities";
import Information from "../../customer/information/information";
import { IDataConsumer } from "@/service/consumer/entities";
import { ConsumerService } from "@/service/consumer/service";
import { IDataMaterialSection } from "@/service/material/section/entities";
import { MaterialSectionService } from "@/service/material/section/service";
import InventoriesBrand from "../inventories-brand/inventoriesBrand";
import { UnitCodeService } from "@/service/reference/unit-code/service";

interface IProps {
  ComponentType: ComponentType;
  onClickModal?: (row: any) => void;
}

const { Title } = Typography;

const InventoriesRegistration = (props: IProps) => {
  const { ComponentType = "FULL", onClickModal } = props;
  const [form] = Form.useForm();
  const [switchForm] = Form.useForm();
  const {
    login_data: {
      response: { accessToken },
    },
  } = useTypedSelector((state: RootState) => state.core);
  const [newParams, setNewParams] = useState<IParamMaterial>({});
  const [editMode, setEditMode] = useState<boolean>(false);
  const [meta, setMeta] = useState<Meta>({ page: 1, limit: 10 });
  const [data, setData] = useState<IDataMaterial[]>([]);
  //
  const [materialSections, setMaterialSections] = useState<
    IDataMaterialSection[]
  >([]);
  // hemjih negj
  const [measuries, setMeasuries] = useState<IDataUnitOfMeasure[]>([]);
  const [isOpenMeasure, setIsOpenMeasure] = useState<boolean>(false);
  // material rank
  const [materialRanks, setMaterialRanks] = useState<IDataReference[]>([]);
  const [isOpenMaterialRank, setIsOpenMaterialRank] = useState<boolean>(false);
  //
  const [unitCodes, setUnitCodes] = useState<IDataUnitCode[]>([]);
  //
  const [brands, setBrands] = useState<IDataBrand[]>([]);
  const [isOpenModalBrand, setIsOpenModalBrand] = useState<boolean>(false);
  //
  const [consumers, setConsumers] = useState<IDataConsumer[]>([]);
  //
  const [filters, setFilters] = useState<IFilterMaterial>();
  const [isOpenTree, setIsOpenTree] = useState<boolean>(true);
  const [isDescription, setIsDescription] = useState<boolean>(false);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<IDataMaterial>();
  const [isOpenPopOver, setIsOpenPopOver] = useState<boolean>(false);
  const [isOpenPopOverLittle, setIsOpenPopoverLittle] =
    useState<boolean>(false);
  const [isOpenModalConsumer, setIsOpenModalConsumer] =
    useState<boolean>(false);
  const [imageIds, setImageIds] = useState<number[]>([]);
  const [fileList, setFileList] = useState<any[]>([]);
  const [columns, setColumns] = useState<FilteredColumns>({
    code: {
      label: "Дотоод код",
      isView: true,
      isFiltered: false,
      dataIndex: "code",
      type: DataIndexType.MULTI,
    },
    name: {
      width: 120,
      label: "Бараа материалын нэр",
      isView: true,
      isFiltered: false,
      dataIndex: "name",
      type: DataIndexType.MULTI,
    },
    barCode: {
      label: "Бар код",
      isView: true,
      isFiltered: false,
      dataIndex: "barCode",
      type: DataIndexType.MULTI,
    },
    serial: {
      label: "Сериал",
      isView: true,
      isFiltered: false,
      dataIndex: "serial",
      type: DataIndexType.MULTI,
    },
    unitCodeId: {
      label: "Нэгдсэн ангилалын код",
      isView: true,
      isFiltered: false,
      dataIndex: ["unitCode", "name"],
      type: DataIndexType.MULTI,
    },
    measurementId: {
      label: "Хэмжих нэгж",
      isView: true,
      isFiltered: false,
      dataIndex: ["measurement", "name"],
      type: DataIndexType.MEASUREMENT,
    },
    countPackage: {
      label: "Багц доторх тоо",
      isView: true,
      isFiltered: false,
      dataIndex: "countPackage",
      type: DataIndexType.MULTI,
    },
    materialSectionId: {
      width: 120,
      label: "Бараа материалын бүлэг",
      isView: true,
      isFiltered: false,
      dataIndex: ["section", "name"],
      type: DataIndexType.MULTI,
    },
    brandId: {
      label: "Брэнд",
      isView: true,
      isFiltered: false,
      dataIndex: ["brand", "name"],
      type: DataIndexType.MULTI,
    },
    rankId: {
      label: "Зэрэглэл",
      isView: true,
      isFiltered: false,
      dataIndex: ["rank", "name"],
      type: DataIndexType.MULTI,
    },
    isActive: {
      label: "Төлөв",
      isView: true,
      isFiltered: false,
      dataIndex: "isActive",
      type: DataIndexType.BOOLEAN_STRING,
    },
    isTax: {
      label: "НӨАТ суутгах эсэх",
      isView: true,
      isFiltered: false,
      dataIndex: "isTax",
      type: DataIndexType.BOOLEAN,
    },
    isCitizenTax: {
      label: "НХАТ суутгах эсэх",
      isView: true,
      isFiltered: false,
      dataIndex: "isCitizenTax",
      type: DataIndexType.BOOLEAN,
    },
    description: {
      label: "Дэлгэрэнгүй мэдээлэл",
      isView: true,
      isFiltered: false,
      dataIndex: "description",
      type: DataIndexType.MULTI,
    },
  });
  // modal neeh edit uu esvel new uu ??
  const openModal = (state: boolean, row?: IDataMaterial) => {
    setEditMode(state);
    if (!state) {
      form.resetFields();
    } else {
      form.setFieldsValue(row);
    }
    setIsOpenModal(true);
    setSelectedRow(row);
  };
  const getData = async (params: IParamMaterial) => {
    await MaterialService.get(params).then((response) => {
      if (response.success) {
        setData(response.response.data);
        setMeta(response.response.meta);
        setFilters(response.response.filter);
      }
    });
  };
  const getMeasurements = async () => {
    await UnitOfMeasureService.get({}).then((response) => {
      setMeasuries(response.response.data);
    });
  };
  const getMaterialSections = async () => {
    await MaterialSectionService.get({}).then((response) => {
      setMaterialSections(response.response.data);
    });
  };
  const getMaterialRanks = async (type: IType) => {
    await ReferenceService.get({ type }).then((response) => {
      setMaterialRanks(response.response.data);
    });
  };
  const getUnitCode = async () => {
    await UnitCodeService.get({}).then((response) => {
      setUnitCodes(response.response.data);
    });
  };
  const getBrands = async () => {
    await BrandService.get({}).then((response) => {
      setBrands(response.response.data);
    });
  };
  const getConsumers = async () => {
    await ConsumerService.get({}).then((response) => {
      setConsumers(response.response.data);
    });
  };
  // upload headers
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    "x-api-key": `${process.env.NEXT_PUBLIC_API_KEY}`,
  };
  const onChange = (info: any) => {
    console.log(info);
    setFileList(info.fileList);
    if (info.file.status === "done" || info.file.status === "removed") {
      const ids: number[] = info.fileList?.map((file: any) => {
        return file.response.response.id;
      });
      setImageIds(ids);
    }
  };
  const onPreview = (info: any) => {
    var my = window.open("about:blank", "_blank");
    my?.document.write(`<image src="${info.thumbUrl}" alt="any" />`);
  };
  const handleRemove = async (info: any) => {
    const id = info.response.response.id;
    await ReferenceService.removeUploadImage(id).then((response) => {
      if (response.success) {
        openNofi("success", "Амжиллтай", "Устгагдав");
      }
    });
  };
  const handleRemoveAll = async () => {
    try {
      Promise.all(
        imageIds.map(async (id) => {
          await ReferenceService.removeUploadImage(id);
        })
      );
      setImageIds([]);
    } catch (error) {}
  };
  //
  const onFinish = async (values: IDataMaterial) => {
    values.fileIds = imageIds;
    await MaterialService.post(values).then((response) => {
      setImageIds([]);
      console.log(response);
    });
  };
  //
  const rowSelection = {
    onSelectAll: (state: boolean, allRow: any, changeRow: any) => {
      console.log("select all", state, allRow, changeRow);
      // if (state) {
      //   const clone = [...tableSelectedRows, ...changeRow];
      //   console.log(clone);
      //   setTableSelectedRows(clone);
      // } else {
      //   const clone = [...tableSelectedRows];
      //   changeRow?.map((row: any) => {
      //     clone.splice(
      //       clone.findIndex((clo) => {
      //         return clo.id === row.id;
      //       }),
      //       1
      //     );
      //   });
      //   setTableSelectedRows(clone);
      // }
    },
    onSelect: (selectedRow: IDataConsumer, selected: boolean) => {
      // if (selected) {
      //   if (!tableSelectedRows.find((e) => e.id === selectedRow.id)) {
      //     setTableSelectedRows([...tableSelectedRows, selectedRow]);
      //   }
      // } else {
      //   var clone = [...tableSelectedRows];
      //   clone.splice(
      //     tableSelectedRows.findIndex((e) => e.id === selectedRow.id),
      //     1
      //   );
      //   setTableSelectedRows(clone);
      // }
    },
    onChange: (
      selectedRowKeys: React.Key[],
      selectedRows: IDataConsumer[]
    ) => {},
    // selectedRowKeys: tableSelectedRows.map((e) => e.id),
  };
  useEffect(() => {
    getData({ page: 1, limit: 10 });
    getMaterialSections();
    getUnitCode();
  }, []);
  return (
    <div>
      <Row style={{ paddingTop: 12 }} gutter={[12, 24]}>
        {ComponentType === "FULL" ? (
          <>
            <Col md={24} lg={16} xl={19}>
              <Space size={24}>
                <Title level={5}>
                  Үндсэн бүртгэл / Бараа материал / Бүртгэл
                </Title>
                <Button
                  type="primary"
                  onClick={() => {
                    form.resetFields();
                    setFileList([]);
                    openModal(false);
                    getMeasurements(); // hemjih neg awcirah
                    getMaterialRanks(IType.MATERIAL_RANK); // zereglel
                    getMaterialSections();
                    getConsumers();
                    getBrands();
                  }}
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
        {isOpenTree && materialSections?.length > 0 ? (
          <Col md={24} lg={10} xl={6}>
            <NewDirectoryTree
              data={materialSections}
              mode="MATERIAL"
              extra="HALF"
              isLeaf={true}
              onClick={(key, isLeaf) => {
                if (isLeaf) {
                  getData({
                    page: 1,
                    limit: 10,
                    materialSectionId: key,
                  });
                }
              }}
            />
          </Col>
        ) : null}
        <Col md={24} lg={14} xl={18}>
          <Row gutter={[0, 12]}>
            {ComponentType === "LITTLE" ? (
              <Col span={24}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "flex-end",
                    width: "100%",
                    gap: 12,
                  }}
                >
                  <Form
                    form={switchForm}
                    layout="vertical"
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: 12,
                      width: "100%",
                    }}
                  >
                    <Row style={{ width: "100%" }} gutter={[12, 0]}>
                      <Col span={12}>
                        <Form.Item label="Бараа материалын бүлэг">
                          <Space.Compact>
                            <div
                              className="extraButton"
                              style={{
                                display: "flex",
                                alignItems: "center",
                                placeContent: "center",
                              }}
                            >
                              <Popover
                                placement="bottom"
                                open={isOpenPopOverLittle}
                                onOpenChange={(state) =>
                                  setIsOpenPopoverLittle(state)
                                }
                                content={
                                  <NewDirectoryTree
                                    mode="MATERIAL"
                                    extra="HALF"
                                    data={materialSections}
                                    isLeaf={false}
                                    onClick={(key, isLeaf) => {
                                      if (isLeaf) {
                                        setIsOpenPopoverLittle(false);
                                        switchForm.setFieldsValue({
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
                              name="sectionId"
                              rules={[
                                {
                                  required: true,
                                  message: "Шинээр шилжүүлэх бүлэг заавал",
                                },
                              ]}
                            >
                              <NewSelect
                                disabled={true}
                                style={{
                                  width: "100%",
                                }}
                                options={materialSections?.map(
                                  (section: IDataMaterialSection) => ({
                                    label: section.name,
                                    value: section.id,
                                  })
                                )}
                              />
                            </Form.Item>
                          </Space.Compact>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Холбох дансны код" name="code">
                          <Space.Compact>
                            <div className="extraButton">
                              <Image
                                onClick={() => setIsOpenModalConsumer(true)}
                                src="/icons/clipboardBlack.svg"
                                width={16}
                                height={16}
                                alt="clipboard"
                              />
                            </div>
                            <Form.Item
                              name="consumerId"
                              rules={[
                                {
                                  required: true,
                                  message: "Харилцагчийн код",
                                },
                                {
                                  pattern: /^\d*(?:\.\d+)?$/,
                                  message: "Зөвхөн тоо оруулах",
                                },
                              ]}
                            >
                              <NewSelect
                                allowClear
                                showSearch
                                filterOption={(input, label) =>
                                  (label ?? "")
                                    .toLowerCase()
                                    .includes(input.toLowerCase())
                                }
                                options={consumers?.map((consumer) => ({
                                  label: consumer.code + "-" + consumer.name,
                                  value: consumer.id,
                                }))}
                              />
                            </Form.Item>
                          </Space.Compact>
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form>
                  <Button
                    type="primary"
                    icon={<SwapOutlined />}
                    onClick={() => {
                      switchForm.validateFields().then((value) => {
                        console.log(value);
                      });
                    }}
                  >
                    Шилжүүлэх
                  </Button>
                </div>
              </Col>
            ) : null}
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
                      params: newParams,
                      onParams: (params) => setNewParams(params),
                    });
                    getData(newParams);
                  }}
                />
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
                        columns: columns,
                        onColumns: (columns) => setColumns(columns),
                        params: newParams,
                        onParams: (params) => setNewParams(params),
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
              </Space>
            </Col>
            <Col span={24}>
              <NewTable
                scroll={{ x: 1400 }}
                rowKey="id"
                doubleClick={true}
                rowSelection={ComponentType === "LITTLE" ? rowSelection : null}
                onDClick={(value) => {
                  if (ComponentType === "FULL") {
                    setSelectedRow(value);
                    setIsDescription(true);
                    setIsOpenTree(false);
                  } else if (ComponentType === "MIDDLE") {
                    onClickModal?.(value);
                  }
                }}
                data={data}
                meta={meta}
                columns={columns}
                onChange={(params) => getData(params)}
                onColumns={(columns) => setColumns(columns)}
                newParams={newParams}
                onParams={(params) => setNewParams(params)}
                incomeFilters={filters}
                onEdit={(row) => openModal(true, row)}
                onDelete={(id) => console.log(id)}
              />
            </Col>
          </Row>
        </Col>
        {isDescription ? (
          <Col md={24} lg={10} xl={6}>
            <Description
              mode="PICTURE"
              title="Харилцагчийн мэдээлэл"
              open={isDescription}
              columns={columns}
              selectedRow={selectedRow}
              onEdit={() => openModal(true, selectedRow)}
              onDelete={(id) => console.log(id)}
              onCancel={(state) => {
                setIsDescription(state);
                setIsOpenTree(!state);
              }}
            />
          </Col>
        ) : null}
      </Row>
      <NewModal
        positionTitle="center"
        width={900}
        title="Бараа материалын бүртгэл"
        open={isOpenModal}
        onCancel={() => {
          handleRemoveAll();
          setIsOpenModal(false);
        }}
        onOk={() =>
          form.validateFields().then((values) => {
            onFinish(values);
          })
        }
      >
        <Form form={form} layout="vertical">
          <div className="form-grid-3">
            <div className="box-1">
              <p className="title">Үндсэн мэдээлэл</p>
              <Form.Item label="Бараа материалын нэр" name="name">
                <NewInput />
              </Form.Item>
              <Form.Item
                label="Бараа материалын бүлэг"
                style={{
                  width: "100%",
                }}
              >
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
                          mode="MATERIAL"
                          isLeaf={true}
                          onClick={(key, isLeaf) => {
                            if (isLeaf) {
                              setIsOpenPopOver(false);
                              form.setFieldsValue({
                                materialSectionId: key,
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
                        message: "Бараа материалын бүлэг заавал",
                      },
                    ]}
                  >
                    <NewSelect
                      disabled={true}
                      style={{
                        width: "100%",
                      }}
                      options={materialSections?.map(
                        (section: IDataMaterialSection) => ({
                          label: section.name,
                          value: section.id,
                        })
                      )}
                    />
                  </Form.Item>
                </Space.Compact>
              </Form.Item>
              <Form.Item label="Хэмжих нэгж">
                <Space.Compact>
                  <Form.Item name="measurementId">
                    <NewSelect
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
                  <div
                    style={{
                      marginLeft: 4,
                    }}
                    className="app-button-square"
                    onClick={() => setIsOpenMeasure(true)}
                  >
                    <Image
                      src={"/icons/plusGray.svg"}
                      height={18}
                      width={18}
                      alt="plsu"
                    />
                  </div>
                </Space.Compact>
              </Form.Item>
              <Form.Item label="Багц доторх тоо" name="countPackage">
                <NewInputNumber />
              </Form.Item>
              <Form.Item label="Зэрэглэл">
                <Space.Compact>
                  <Form.Item name="rankId">
                    <NewSelect
                      allowClear
                      showSearch
                      optionFilterProp="children"
                      filterOption={(input, label) =>
                        (label?.label ?? "")
                          .toString()
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      options={materialRanks?.map((rank) => ({
                        label: rank.name,
                        value: rank.id,
                      }))}
                    />
                  </Form.Item>
                  <div
                    style={{
                      marginLeft: 4,
                    }}
                    className="app-button-square"
                    onClick={() => setIsOpenMaterialRank(true)}
                  >
                    <Image
                      src={"/icons/plusGray.svg"}
                      height={18}
                      width={18}
                      alt="plsu"
                    />
                  </div>
                </Space.Compact>
              </Form.Item>
            </div>
            <div className="box-1">
              <p className="title">Кодын мэдээлэл</p>
              <Form.Item label="Дотоод код" name="code">
                <NewInput />
              </Form.Item>
              <Form.Item label="Бар код" name="barCode">
                <NewInput />
              </Form.Item>
              <Form.Item label="Сериал код" name="serial">
                <NewInput />
              </Form.Item>
              <Form.Item label="Нэгдсэн ангилалын код" name="unitCodeId">
                <NewSelect
                  allowClear
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, label) =>
                    (label?.label ?? "")
                      .toString()
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={unitCodes?.map((unitCode) => ({
                    label: unitCode.name,
                    value: unitCode.id,
                  }))}
                />
              </Form.Item>
            </div>
            <div className="box">
              <p className="title">Нэмэлт мэдээлэл</p>
              <Form.Item label="Зураг оруулах" valuePropName="fileList">
                <Upload
                  headers={headers}
                  action={`${process.env.NEXT_PUBLIC_BASEURL}/local-files/fileUpload`}
                  listType="picture-card"
                  fileList={fileList}
                  onPreview={onPreview}
                  onChange={onChange}
                  onRemove={handleRemove}
                >
                  <PlusOutlined
                    style={{
                      fontSize: 24,
                      color: "#6c757d",
                    }}
                  />
                </Upload>
              </Form.Item>
              <Form.Item label="Брэнд">
                <Space.Compact>
                  <Form.Item name="brandId">
                    <NewSelect
                      allowClear
                      showSearch
                      optionFilterProp="children"
                      filterOption={(input, label) =>
                        (label?.label ?? "")
                          .toString()
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      options={brands?.map((brand) => ({
                        label: brand.name,
                        value: brand.id,
                      }))}
                    />
                  </Form.Item>
                  <div
                    style={{
                      marginLeft: 4,
                    }}
                    className="app-button-square"
                    onClick={() => setIsOpenModalBrand(true)}
                  >
                    <Image
                      src={"/icons/plusGray.svg"}
                      height={18}
                      width={18}
                      alt="plsu"
                    />
                  </div>
                </Space.Compact>
              </Form.Item>
              <Form.Item label="Бэлтгэн нийлүүлэгчийн код, нэр">
                <Space.Compact>
                  <div className="extraButton">
                    <Image
                      onClick={() => setIsOpenModalConsumer(true)}
                      src="/icons/clipboardBlack.svg"
                      width={16}
                      height={16}
                      alt="clipboard"
                    />
                  </div>
                  <Form.Item
                    name="consumerId"
                    rules={[
                      {
                        required: true,
                        message: "Харилцагчийн код",
                      },
                      {
                        pattern: /^\d*(?:\.\d+)?$/,
                        message: "Зөвхөн тоо оруулах",
                      },
                    ]}
                  >
                    <NewSelect
                      allowClear
                      showSearch
                      optionFilterProp="children"
                      filterOption={(input, label) =>
                        (label?.label ?? "")
                          .toString()
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      options={consumers?.map((consumer) => ({
                        label: consumer.code + "-" + consumer.name,
                        value: consumer.id,
                      }))}
                    />
                  </Form.Item>
                </Space.Compact>
              </Form.Item>
              <Form.Item label="Дэлгэрэнгүй мэдээлэл" name="description">
                <NewTextArea />
              </Form.Item>
            </div>
          </div>
          <div className="switches-col">
            <Form.Item
              label="НӨАТ суутгах эсэх"
              name="isTax"
              valuePropName="checked"
            >
              <NewSwitch size={"LARGE"} />
            </Form.Item>
            <Form.Item
              label="НХАТ суутгах эсэх"
              name="isCitizenTax"
              valuePropName="checked"
            >
              <NewSwitch />
            </Form.Item>
            <Form.Item
              label="Идэвхтэй эсэх"
              name="isActive"
              valuePropName="checked"
            >
              <NewSwitch />
            </Form.Item>
          </div>
        </Form>
      </NewModal>
      <NewModal
        title="Хэмжих нэгж"
        open={isOpenMeasure}
        footer={false}
        onCancel={() => setIsOpenMeasure(false)}
      >
        <UnitOfMeasure
          ComponentsType="MODAL"
          onClickModal={(row) => {
            getMeasurements();
            form.setFieldsValue({
              measurementId: row.id,
            });
            setIsOpenMeasure(false);
          }}
        />
      </NewModal>
      <NewModal
        title="Зэрэглэл"
        open={isOpenMaterialRank}
        footer={false}
        onCancel={() => setIsOpenMaterialRank(false)}
        destroyOnClose={true}
      >
        <Reference
          type={IType.MATERIAL_RANK}
          onClickModal={(id) => {
            getMaterialRanks(IType.MATERIAL_RANK);
            form.setFieldsValue({
              rankId: id,
            });
            setIsOpenMaterialRank(false);
          }}
        />
      </NewModal>
      <NewModal
        width={1300}
        title="Харилцагчын бүртгэл"
        open={isOpenModalConsumer}
        onCancel={() => setIsOpenModalConsumer(false)}
      >
        <Information
          ComponentType="MIDDLE"
          onClickModal={(row: IDataConsumer) => {
            form.setFieldsValue({
              consumerId: row.id,
            });
            setIsOpenModalConsumer(false);
          }}
        />
      </NewModal>
      <NewModal
        title="Бренд"
        open={isOpenModalBrand}
        onCancel={() => setIsOpenModalBrand(false)}
      >
        <InventoriesBrand
          ComponentType="MODAL"
          onClickModal={(row) => console.log(row)}
        />
      </NewModal>
    </div>
  );
};
export default InventoriesRegistration;

"use client";
import { SignalFilled, PlusOutlined, SwapOutlined } from "@ant-design/icons";
import ColumnSettings from "@/components/columnSettings";
import Description from "@/components/description";
import NewDirectoryTree from "@/components/tree";
import Filtered from "@/components/table/filtered";
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
  getFile,
  getParam,
  openNofi,
} from "@/feature/common";
import {
  ComponentType,
  DataIndexType,
  FilteredColumns,
  Meta,
} from "@/service/entities";
import {
  IDataMaterial,
  IFilterMaterial,
  IParamMaterial,
  MaterialType,
} from "@/service/material/entities";

import { IDataUnitCode } from "@/service/reference/unit-code/entities";
import { MaterialService } from "@/service/material/service";
import {
  Button,
  Col,
  Form,
  Popover,
  Row,
  Space,
  Tooltip,
  Typography,
  Upload,
} from "antd";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
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
import { IDataMaterialSection } from "@/service/material/section/entities";
import { MaterialSectionService } from "@/service/material/section/service";
import InventoriesBrand from "../inventories-brand/inventoriesBrand";
import { UnitCodeService } from "@/service/reference/unit-code/service";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import { IDataMaterialAccount } from "@/service/material/account/entities";
import InventoriesType from "../inventories-type/inventoriesType";
import type { UploadFile } from "antd/es/upload/interface";
import type { UploadProps } from "antd";
import { ViewMaterialService } from "@/service/material/view-material/service";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/feature/store/store";
import { changeParam, newPane } from "@/feature/store/slice/param.slice";
import PageTitle from "@/components/page-title";
import NewTreeSelect from "@/components/tree/tree-select";
interface IProps {
  ComponentType: ComponentType;
  materialType: MaterialType;
  onClickModal?: (row: any) => void;
}

interface MyUploadFile extends UploadFile {
  response?: {
    message: string;
    response: {
      filename: string;
      id: number;
      mimetype: string;
      path: string;
    };
    success: true;
  };
}

const { Title } = Typography;
const key = "inventory/inventories-registration";
const InventoriesRegistration = (props: IProps) => {
  const { ComponentType = "FULL", materialType, onClickModal } = props;
  const [form] = Form.useForm();
  const [switchForm] = Form.useForm();
  const isActive = Form.useWatch("isActive", form);
  const {
    login_data: {
      response: { accessToken },
    },
  } = useTypedSelector((state: RootState) => state.core);
  const blockContext: BlockView = useContext(BlockContext); // uildeliig blockloh
  const [editMode, setEditMode] = useState<boolean>(false);
  const [meta, setMeta] = useState<Meta>({ page: 1, limit: 10 });
  const [data, setData] = useState<IDataMaterial[]>([]);
  const { items } = useTypedSelector((state) => state.pane);
  const param = getParam(items, key);
  const dispatch = useDispatch<AppDispatch>();
  const [materialSections, setMaterialSections] = useState<
    IDataMaterialSection[]
  >([]);
  const [isReload, setIsReload] = useState<boolean>(false);
  // hemjih negj
  const [measuries, setMeasuries] = useState<IDataUnitOfMeasure[]>([]);
  const [isOpenMeasure, setIsOpenMeasure] = useState<boolean>(false);
  // material rank
  const [materialRanks, setMaterialRanks] = useState<IDataReference[]>([]);
  const [isOpenMaterialRank, setIsOpenMaterialRank] = useState<boolean>(false);
  const [unitCodes, setUnitCodes] = useState<IDataUnitCode[]>([]);
  const [brands, setBrands] = useState<IDataBrand[]>([]);
  const [isOpenModalBrand, setIsOpenModalBrand] = useState<boolean>(false);
  const [isOpenMaterialType, setIsOpenMaterialType] = useState<boolean>(false);
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
  const [fileList, setFileList] = useState<MyUploadFile[]>([]);
  const [columns, setColumns] = useState<FilteredColumns>({
    code: {
      label: "Дотоод код",
      isView: true,
      isFiltered: false,
      dataIndex: ["code"],
      type: DataIndexType.MULTI,
    },
    name: {
      width: 120,
      label: "Бараа материалын нэр",
      isView: true,
      isFiltered: false,
      dataIndex: ["name"],
      type: DataIndexType.MULTI,
    },
    barCode: {
      label: "Бар код",
      isView: true,
      isFiltered: false,
      dataIndex: ["barCode"],
      type: DataIndexType.MULTI,
    },
    serial: {
      label: "Сериал",
      isView: true,
      isFiltered: false,
      dataIndex: ["serial"],
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
      type: DataIndexType.MULTI,
    },
    countPackage: {
      label: "Багц доторх тоо",
      isView: true,
      isFiltered: false,
      dataIndex: ["countPackage"],
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
      label: "Эмийн хэрэглээ",
      isView: true,
      isFiltered: false,
      dataIndex: ["rank", "name"],
      type: DataIndexType.MULTI,
    },
    isActive: {
      label: "Төлөв",
      isView: true,
      isFiltered: false,
      dataIndex: ["isActive"],
      type: DataIndexType.BOOLEAN_STRING,
    },
    isTax: {
      label: "НӨАТ суутгах эсэх",
      isView: true,
      isFiltered: false,
      dataIndex: ["isTax"],
      type: DataIndexType.BOOLEAN,
    },
    isCitizenTax: {
      label: "НХАТ суутгах эсэх",
      isView: true,
      isFiltered: false,
      dataIndex: ["isCitizenTax"],
      type: DataIndexType.BOOLEAN,
    },
    isExpired: {
      label: "Хугацаа дуусах эсэх",
      isView: true,
      isFiltered: false,
      dataIndex: ["isExpired"],
      type: DataIndexType.BOOLEAN,
    },
    description: {
      label: "Дэлгэрэнгүй мэдээлэл",
      isView: true,
      isFiltered: false,
      dataIndex: ["description"],
      type: DataIndexType.MULTI,
    },
  });
  const [tableSelectedRows, setTableSelectedRows] = useState<IDataMaterial[]>(
    []
  );

  useEffect(() => {
    getMaterialRanks(IType.MATERIAL_RANK);
  }, [isOpenMaterialRank]);
  const renderImage = async (fileIds: number[]) => {
    var blobImages: UploadFile[] = [];
    await Promise.all(
      fileIds?.map(async (fileId, index) => {
        const blobImage = await getFile(fileId);
        blobImages.push({
          uid: index.toString(),
          name: fileId.toString(),
          status: "done",
          url: blobImage,
          response: {
            response: {
              id: fileId,
            },
          },
        });
      })
    );
    setFileList(blobImages);
  };
  // modal neeh edit uu esvel new uu ??
  const openModal = (state: boolean, row?: IDataMaterial) => {
    setEditMode(state);
    setFileList([]);
    getMeasurements();
    getMaterialRanks(IType.MATERIAL_RANK); // zereglel
    getMaterialSections();
    getBrands();
    if (!state) {
      form.resetFields();
      form.setFieldsValue({ isActive: true });
    } else {
      if (row?.fileIds) renderImage(row?.fileIds);
      form.setFieldsValue(row);
    }
    setIsOpenModal(true);
    setSelectedRow(row);
  };
  const getData = async () => {
    setTableSelectedRows([]);
    blockContext.block();
    const params: IParamMaterial = { ...param };
    await MaterialService.get(params)
      .then((response) => {
        if (response.success) {
          setData(response.response.data);
          setMeta(response.response.meta);
          setFilters(response.response.filter);
        }
      })
      .finally(() => {
        blockContext.unblock();
      });
  };
  const getMeasurements = async () => {
    await UnitOfMeasureService.get({}).then((response) => {
      setMeasuries(response.response.data);
    });
  };
  const getMaterialSections = async () => {
    await MaterialSectionService.get({ materialType }).then((response) => {
      setMaterialSections(response.response);
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
  // upload headers
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    "x-api-key": `${process.env.NEXT_PUBLIC_API_KEY}`,
  };
  const onChange: UploadProps["onChange"] = (info) => {
    setFileList(info.fileList);
    if (info.file.status === "done" || info.file.status === "removed") {
      const ids: number[] = info.fileList?.map((file) => {
        return file.response.response.id;
      });
      setImageIds(ids);
    }
  };
  const onPreview = (info: UploadFile) => {
    const url = info.url || info.thumbUrl;
    var my = window.open("about:blank", "_blank");
    my?.document.write(`<image src="${url}" alt="any" />`);
  };
  const handleRemove = async (info: MyUploadFile) => {
    if (info.response?.response.id) {
      const id = info.response.response.id;
      await ReferenceService.removeUploadImage(id).then((response) => {
        if (response.success) {
          console.log(response);
        }
      });
    }
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
    blockContext.block();
    values.fileIds = imageIds;
    values.type = MaterialType.Material;
    if (editMode && selectedRow) {
      await MaterialService.patch(selectedRow.id, values)
        .then((response) => {
          if (response.success) {
            setSelectedRow(response.response);
            setIsOpenModal(false);
            getData();
          }
        })
        .finally(() => {
          blockContext.unblock();
        });
    } else {
      await MaterialService.post(values)
        .then((response) => {
          setImageIds([]);
          if (response.success) {
            setIsOpenModal(false);
            getData();
          }
        })
        .finally(() => {
          blockContext.unblock();
        });
    }
  };
  const switchGroup = async (values: { sectionId: number }) => {
    if (tableSelectedRows.length > 0) {
      await MaterialService.switchPatch({
        materialSectionId: values.sectionId,
        ids: tableSelectedRows.map((row) => row.id),
      }).then((response) => {
        if (response.success) {
          switchForm.resetFields();
          onClickModal?.(false);
          setIsReload(!isReload);
        }
      });
    } else {
      openNofi("error", "Бараа сонгоно уу");
    }
  };
  //
  const rowSelection = {
    onSelectAll: (state: boolean, allRow: any, changeRow: any) => {
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
      selectedRows: IDataConsumer[]
    ) => {},
    selectedRowKeys: tableSelectedRows.map((e) => e.id),
  };
  const onDeleteMaterial = (id: number) => {
    MaterialService.remove(id).then((response) => {
      if (response.success) {
        getData();
        setIsDescription(false);
        setIsOpenTree(true);
      }
    });
  };
  useEffect(() => {
    dispatch(newPane({ key, param: {} }));
    getMaterialSections();
    getUnitCode();
  }, []);
  useEffect(() => {
    getData();
  }, [param, isReload]);
  useEffect(() => {
    getBrands();
  }, [isOpenModalBrand]);
  useEffect(() => {
    if (selectedRow && !isActive) {
      ViewMaterialService.getById(selectedRow.id).then((response) => {
        if (response.success && response.response.lastQty > 0) {
          form.setFieldValue("isActive", true);
          openNofi(
            "warning",
            `${response.response.code} кодтой бараа үлдэгдэлтэй байгаа тул идэвхигүй болгох боломжгүй байна.`
          );
        }
      });
    }
  }, [isActive]);
  return (
    <div>
      <PageTitle onClick={() => openModal(false)} />
      <Row style={{ paddingTop: 12 }} gutter={[12, 24]}>
        {isOpenTree ? (
          <Col md={24} lg={10} xl={6}>
            <NewDirectoryTree
              data={materialSections}
              onClick={(sectionNames) => {
                dispatch(
                  changeParam({
                    ...param,
                    filters: [
                      {
                        dataIndex: ["section", "name"],
                        operator: "IN",
                        filter: sectionNames,
                      },
                    ],
                  })
                );
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
                                  <NewDirectoryTree data={materialSections} />
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
                    </Row>
                  </Form>
                  <Button
                    type="primary"
                    icon={<SwapOutlined />}
                    onClick={() => {
                      switchForm.validateFields().then((value) => {
                        switchGroup(value);
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
                <Filtered columns={columns} />
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
                onColumns={(columns) => setColumns(columns)}
                incomeFilters={filters}
                isEdit={true}
                onEdit={(row) => openModal(true, row)}
                isDelete={true}
                onDelete={(id) => onDeleteMaterial(id)}
              />
            </Col>
          </Row>
        </Col>
        {isDescription ? (
          <Col md={24} lg={10} xl={6}>
            <Description
              mode="PICTURE"
              title="Бараа материалын мэдээлэл"
              open={isDescription}
              columns={columns}
              selectedRow={selectedRow}
              onEdit={() => openModal(true, selectedRow)}
              onDelete={onDeleteMaterial}
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
              <Title
                level={4}
                style={{
                  textAlign: "center",
                }}
              >
                Үндсэн мэдээлэл
              </Title>
              <Form.Item
                label="Бараа материалын нэр"
                name="name"
                rules={[
                  { required: true, message: "Бараа материалын нэр заавал" },
                ]}
              >
                <NewInput />
              </Form.Item>
              <Form.Item
                label="Бараа материалын бүлэг"
                name="materialSectionId"
              >
                <NewTreeSelect
                  sections={materialSections}
                  onChange={(value) =>
                    form.setFieldValue("materialSectionId", value)
                  }
                />
              </Form.Item>
              <Form.Item label="Хэмжих нэгж">
                <Space.Compact>
                  <Form.Item
                    name="measurementId"
                    rules={[{ required: true, message: "Хэмжих нэгж заавал" }]}
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
              <Form.Item
                label="Багц доторх тоо"
                name="countPackage"
                rules={[{ required: true, message: "Багц доторх тоо заавал" }]}
              >
                <NewInputNumber />
              </Form.Item>
              <Form.Item label="Эмийн хэрэглээ">
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
              <Title
                level={4}
                style={{
                  textAlign: "center",
                }}
              >
                Кодын мэдээлэл
              </Title>
              <Form.Item
                label="Дотоод код"
                name="code"
                rules={[{ required: true, message: "Дотоод код заавал" }]}
              >
                <NewInput />
              </Form.Item>
              <Form.Item
                label="Бар код"
                name="barCode"
                rules={[
                  {
                    pattern: /^-?\d*(\.\d*)?$/,
                    message: "тоо оруулна уу",
                  },
                ]}
              >
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
              <Title
                level={4}
                style={{
                  textAlign: "center",
                }}
              >
                Нэмэлт мэдээлэл
              </Title>
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
              <Tooltip title="Эм үед ОУНэр бөглөх шаардлагтай">
                <Form.Item
                  label="Дэлгэрэнгүй мэдээлэл (ОУНэр)"
                  name="description"
                >
                  <NewTextArea />
                </Form.Item>
              </Tooltip>
            </div>
          </div>
          <div className="switches-col">
            <Form.Item
              label="НӨАТ суутгах эсэх"
              name="isTax"
              valuePropName="checked"
            >
              <NewSwitch />
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
            <Form.Item
              label="Хугацаа дуусах эсэх"
              name="isExpired"
              valuePropName="checked"
            >
              <NewSwitch />
            </Form.Item>
            <Form.Item
              label="Эм эсэх"
              name="isMedicine"
              valuePropName="checked"
            >
              <NewSwitch />
            </Form.Item>
          </div>
        </Form>
      </NewModal>
      <NewModal
        title="Хэмжих нэгж"
        width={1000}
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
        title="Эмийн хэрэглээ"
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
              consumerSupplierId: row.id,
            });
            setIsOpenModalConsumer(false);
          }}
        />
      </NewModal>
      <NewModal
        title="Брэнд"
        open={isOpenModalBrand}
        onCancel={() => setIsOpenModalBrand(false)}
        footer={null}
      >
        <InventoriesBrand
          ComponentType="MODAL"
          onClickModal={(row) => console.log(row)}
        />
      </NewModal>
      <NewModal
        title="Данс"
        open={isOpenMaterialType}
        onCancel={() => setIsOpenMaterialType(false)}
      >
        <InventoriesType
          ComponentType="MODAL"
          onClickModal={(row: IDataMaterialAccount) => {
            switchForm.setFieldsValue({
              materialAccountId: row.id,
            });
            setIsOpenMaterialType(false);
          }}
        />
      </NewModal>
    </div>
  );
};
export default InventoriesRegistration;

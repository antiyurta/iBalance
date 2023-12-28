import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { SignalFilled, PlusOutlined } from "@ant-design/icons";
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
  Upload,
} from "antd";
import {
  NewInput,
  NewSelect,
  NewSwitch,
  NewTextArea,
} from "@/components/input";
import { findIndexInColumnSettings, onCloseFilterTag } from "@/feature/common";
import { NewTable } from "@/components/table";
import {
  IDataReference,
  IParamReference,
  IType,
} from "@/service/reference/entity";
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
  IDataUnitCode,
  IParamUnitCode,
} from "@/service/reference/unit-code/entities";
import { UnitCodeService } from "@/service/reference/unit-code/service";
import { ReferenceService } from "@/service/reference/reference";
import {
  IDataUnitOfMeasure,
  IParamUnitOfMeasure,
} from "@/service/material/unitOfMeasure/entities";
import { UnitOfMeasureService } from "@/service/material/unitOfMeasure/service";
import { IDataBrand, IParamBrand } from "@/service/reference/brand/entities";
import { BrandService } from "@/service/reference/brand/service";
import { RootState, useTypedSelector } from "@/feature/store/reducer";
import { IDataConsumer, IParamConsumer } from "@/service/consumer/entities";
import { ConsumerService } from "@/service/consumer/service";
const { Title } = Typography;

interface IProps {
  ComponentType: ComponentType;
  type: MaterialType;
  onClickModal?: (row: any) => void;
}

const ServicesRegistration = (props: IProps) => {
  const {
    login_data: {
      response: { accessToken },
    },
  } = useTypedSelector((state: RootState) => state.core);
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    "x-api-key": `${process.env.NEXT_PUBLIC_API_KEY}`,
  };
  const { ComponentType, onClickModal, type } = props;
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
  const [unitCodes, setUnitCodes] = useState<IDataUnitCode[]>([]);
  const [ranks, setRanks] = useState<IDataReference[]>([]);
  const [brands, setBrands] = useState<IDataBrand[]>([]);
  const [consumers, setConsumers] = useState<IDataConsumer[]>([]);
  // end used datas
  const [imageIds, setImageIds] = useState<number[]>([]);
  const [isDescription, setIsDescription] = useState<boolean>(false);
  const [isOpenTree, setIsOpenTree] = useState<boolean>(true);
  const [params, setParams] = useState<IParamMaterial>({});
  const [isOpenPopOver, setIsOpenPopOver] = useState<boolean>(false);
  const [tableSelectedRows, setTableSelectedRows] = useState<IDataMaterial[]>(
    []
  );
  const [fileList, setFileList] = useState<any[]>([]);
  const [columns, setColumns] = useState<FilteredColumnsMaterial>({
    code: {
      label: "Дотоод код",
      isView: true,
      isFiltered: false,
      dataIndex: "code",
      type: DataIndexType.MULTI,
    },
    name: {
      label: "Үйлчилгээний нэр",
      isView: ComponentType === "FULL" ? true : false,
      isFiltered: false,
      dataIndex: "name",
      type: DataIndexType.MULTI,
    },
    measurementId: {
      label: "Хэмжих нэгж",
      isView: ComponentType === "FULL" ? true : false,
      isFiltered: false,
      dataIndex: ["measurement", "name"],
      type: DataIndexType.MULTI,
    },
    brandId: {
      label: "Брэнд",
      isView: true,
      isFiltered: false,
      dataIndex: ["brand", "name"],
      type: DataIndexType.MULTI,
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
    isActive: {
      label: "Төлөв",
      isView: true,
      isFiltered: false,
      dataIndex: "isActive",
      type: DataIndexType.BOOLEAN_STRING,
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
      form.setFieldsValue(row);
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
  // start zuragtai hamaarah functionuud
  const onPreview = (info: any) => {
    var my = window.open("about:blank", "_blank");
    my?.document.write(`<image src="${info.thumbUrl}" alt="any" />`);
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
  const handleRemove = async (info: any) => {
    const id = info.response.response.id;
    await ReferenceService.removeUploadImage(id);
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
  const getUnitCode = async (params: IParamUnitCode) => {
    await UnitCodeService.get(params).then((response) => {
      setUnitCodes(response.response.data);
    });
  };
  const getRanks = async (params: IParamReference) => {
    await ReferenceService.get(params).then((response) => {
      setRanks(response.response.data);
    });
  };
  const getBrands = async (params: IParamBrand) => {
    await BrandService.get(params).then((response) => {
      setBrands(response.response.data);
    });
  };
  const getConsumers = async (params: IParamConsumer) => {
    await ConsumerService.get(params).then((response) => {
      setConsumers(response.response.data);
    });
  };
  useEffect(() => {
    getMaterialSection({ materialTypes: [type] });
    getData({ page: 1, limit: 10, types: [MaterialType.Service] });
  }, []);
  useEffect(() => {
    if (isOpenModal) {
      getMeasurements({});
      getUnitCode({});
      getRanks({ type: IType.MATERIAL_RANK });
      getBrands({});
      getConsumers({ isSupplier: true });
    }
  }, [isOpenModal]);

  // Өгөгдөлөө хадгалах
  const onFinish = async (data: IDataMaterial) => {
    blockContext.block();
    data.type = MaterialType.Service;
    if (isEdit && selectedRow) {
      await MaterialService.patch(selectedRow.id, data)
        .then((response) => {
          success(response);
        })
        .finally(() => blockContext.unblock());
    } else {
      await MaterialService.postService(data)
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
          setIsDescription(false);
          setIsOpenTree(true);
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
                <Title level={3}>
                  Үндсэн бүртгэл / Бараа материал / Үйлчилгээний бүртгэл
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
        {isOpenTree && materialSections?.length > 0 ? (
          <Col md={24} lg={10} xl={6}>
            <NewDirectoryTree
              extra="HALF"
              data={materialSections}
              isLeaf={true}
              onClick={(keys, isLeaf) => {
                if (isLeaf) {
                  // getData({
                  //   page: 1,
                  //   limit: 10,
                  //   sectionId: [`${key}`],
                  // });
                  onCloseFilterTag({
                    key: "sectionId",
                    state: true,
                    column: columns,
                    onColumn: (columns) => setColumns(columns),
                    params,
                    onParams: (params) => setParams(params),
                  });
                  getData({
                    page: 1,
                    limit: 10,
                    materialSectionId: keys,
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
                      width: "100%",
                    }}
                  >
                    <Form.Item
                      label="Харилцагчийн бүлэг"
                      style={{
                        width: "100%",
                      }}
                    >
                      <Space.Compact>
                        <div
                          className="extraButton"
                          style={{
                            display: "flex",
                            height: 38,
                            alignItems: "center",
                            placeContent: "center",
                          }}
                        >
                          <Popover
                            placement="bottom"
                            open={isOpenPopOverLittle}
                            onOpenChange={(state) =>
                              setIsOpenPopOverLittle(state)
                            }
                            content={
                              <NewDirectoryTree
                                extra="HALF"
                                data={materialSections}
                                isLeaf={false}
                                onClick={(key, isLeaf) => {
                                  if (isLeaf) {
                                    setIsOpenPopOverLittle(false);
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
                            allowClear
                            showSearch
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                              (option?.label ?? "")
                                .toString()
                                .toLowerCase()
                                .includes(input.toLowerCase())
                            }
                            options={materialSections.map(
                              (materialSection) => ({
                                value: materialSection.id,
                                label: materialSection.name,
                              })
                            )}
                          />
                        </Form.Item>
                      </Space.Compact>
                    </Form.Item>
                  </Form>
                  {/* <Button
                    type="primary"
                    icon={<SwapOutlined />}
                    onClick={() => {
                      switchForm.validateFields().then((value) => {
                        switchGroup(value);
                      });
                    }}
                  >
                    Шилжүүлэх
                  </Button> */}
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
              title="Үйлчилгээний мэдээлэл"
              open={isDescription}
              columns={columns}
              selectedRow={selectedRow}
              onEdit={() => openModal(true, selectedRow)}
              onDelete={onDelete}
              onCancel={(state) => {
                setIsDescription(state);
                setIsOpenTree(!state);
              }}
            />
          </Col>
        ) : null}
      </Row>
      <NewModal
        title="Үйлчилгээний бүртгэл"
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
          <div className="form-grid-2">
            <div className="box-1">
              <p className="title">Үндсэн мэдээлэл</p>
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
                <NewInput />
              </Form.Item>
              <Form.Item
                label="Үйлчилгээний нэр"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Үйлчилгээний нэр заавал",
                  },
                ]}
              >
                <NewInput />
              </Form.Item>
              <Form.Item label="Үйлчилгээний бүлэг">
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
                        message: "Үйлчилгээний бүлэг заавал",
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
              <Form.Item label="Хэмжих нэгж">
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
              <Form.Item label="Нэгдсэн ангилалын код" name="unitCodeId">
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
                  options={unitCodes.map((unitCode) => ({
                    value: unitCode.id,
                    label: unitCode.name,
                  }))}
                />
              </Form.Item>
            </div>
            <div className="box-1">
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
              <Form.Item label="Зэрэглэл">
                <Space.Compact>
                  <Form.Item name="rankId">
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
                      options={ranks.map((rank) => ({
                        value: rank.id,
                        label: rank.name,
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
                      alt="plsu"
                    />
                  </div>
                </Space.Compact>
              </Form.Item>
              <Form.Item label="Брэнд">
                <Space.Compact>
                  <Form.Item name="brandId">
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
                      options={brands.map((rank) => ({
                        value: rank.id,
                        label: rank.name,
                      }))}
                    />
                  </Form.Item>
                  <div
                    style={{
                      marginLeft: 4,
                    }}
                    className="app-button-square"
                  >
                    <Image
                      src={"/icons/plusGray.svg"}
                      height={18}
                      width={18}
                      alt="plus"
                    />
                  </div>
                </Space.Compact>
              </Form.Item>
              <Form.Item label="Бэлтгэн нийлүүлэгч">
                <Space.Compact>
                  <div
                    className="extraButton"
                    onClick={() => setIsOpenPopOver(true)}
                  >
                    <Image
                      src="/icons/clipboardBlack.svg"
                      width={16}
                      height={16}
                      alt="clipboard"
                    />
                  </div>
                  <Form.Item name="consumerSupplierId">
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
                      options={consumers.map((consumer) => ({
                        value: consumer.id,
                        label: `${consumer.code},${consumer.name}`,
                      }))}
                    />
                  </Form.Item>
                </Space.Compact>
              </Form.Item>
              <Form.Item label="Дэлгэрэнгүй мэдээлэл">
                <NewTextArea />
              </Form.Item>
            </div>
          </div>
          <div className="form-grid-3">
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
          </div>
        </Form>
      </NewModal>
    </>
  );
};
export default ServicesRegistration;

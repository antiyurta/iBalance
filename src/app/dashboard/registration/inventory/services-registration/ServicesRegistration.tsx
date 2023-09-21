import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { SignalFilled, SwapOutlined } from "@ant-design/icons";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import ColumnSettings from "@/components/columnSettings";
import Description from "@/components/description";
import NewDirectoryTree from "@/components/directoryTree";
import Filtered from "@/components/filtered";
import {
  Params,
  IDataConsumer,
  FilteredColumns,
} from "@/service/consumer/entities";
import {
  ComponentType,
  DataIndexType,
  IFilters,
  Meta,
} from "@/service/entities";
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
  NewOption,
  NewSelect,
  NewSwitch,
  NewTextArea,
} from "@/components/input";
import {
  findIndexInColumnSettings,
  onCloseFilterTag,
  openNofi,
  unDuplicate,
} from "@/feature/common";
import { NewTable } from "@/components/table";
import { IType, IDataReference } from "@/service/reference/entity";
import {
  IDataTreeSection,
  TreeSectionType,
} from "@/service/reference/tree-section/entities";
import NewModal from "@/components/modal";
const { Title } = Typography;

interface IProps {
  ComponentType: ComponentType;
  onClickModal?: (row: any) => void;
}

const ServicesRegistration = (props: IProps) => {
  const { ComponentType, onClickModal } = props;
  const [form] = Form.useForm(); // add hiih Form
  const [switchForm] = Form.useForm(); // buleg solih
  const [isOpenPopOverLittle, setIsOpenPopOverLittle] =
    useState<boolean>(false);
  const [data, setData] = useState<IDataConsumer[]>([]);
  const [meta, setMeta] = useState<Meta>({ page: 1, limit: 10 });
  const blockContext: BlockView = useContext(BlockContext);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [editMode, setIsMode] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<IDataConsumer>();
  const [sections, setSections] = useState<IDataTreeSection[]>([]);
  const [isFilterIcon, setIsFilterIcon] = useState<boolean>(false);
  const [isDescription, setIsDescription] = useState<boolean>(false);
  const [isOpenTree, setIsOpenTree] = useState<boolean>(true);
  const [newParams, setNewParams] = useState<Params>({});
  const [isOpenPopOver, setIsOpenPopOver] = useState<boolean>(false);
  const [filters, setFilters] = useState<IFilters>();
  const [banks, setBanks] = useState<IDataReference[]>([]);
  const [tableSelectedRows, setTableSelectedRows] = useState<IDataConsumer[]>(
    []
  );
  const [columns, setColumns] = useState<FilteredColumns>({
    code: {
      label: "Дотоод код",
      isView: true,
      isFiltered: false,
      dataIndex: "code",
      type: DataIndexType.MULTI,
    },
    isIndividual: {
      label: "Үйлчилгээний нэр",
      isView: ComponentType === "FULL" ? true : false,
      isFiltered: false,
      dataIndex: "isIndividual",
      type: DataIndexType.MULTI,
    },
    isEmployee: {
      label: "Хэмжих нэгж",
      isView: ComponentType === "FULL" ? true : false,
      isFiltered: false,
      dataIndex: "isEmployee",
      type: DataIndexType.STRING_SECTION,
    },
    lastName: {
      label: "Брэнд",
      isView: true,
      isFiltered: false,
      dataIndex: "lastName",
      type: DataIndexType.MULTI,
    },
    name: {
      label: "НӨАТ суутгах эсэх",
      isView: true,
      isFiltered: false,
      dataIndex: "name",
      type: DataIndexType.BOOLEAN,
    },
    sectionId: {
      label: "НХАТ суутгах эсэх",
      isView: true,
      isFiltered: false,
      dataIndex: ["section", "name"],
      type: DataIndexType.BOOLEAN,
    },
    isActive: {
      label: "Төлөв",
      isView: true,
      isFiltered: false,
      dataIndex: "isActive",
      type: DataIndexType.BOOLEAN_STRING,
    },
  });
  const openModal = (state: boolean, row?: IDataConsumer) => {
    setIsMode(state);
    if (!state) {
      form.resetFields();
    } else {
      form.setFieldsValue(row);
    }
    setIsOpenModal(true);
    setSelectedRow(row);
  };
  const getData = async (params: Params) => {
    blockContext.block();
    var prm: Params = {
      page: params.page || newParams.page,
      limit: params.limit || newParams.limit,
      orderParam: params.orderParam || newParams.orderParam,
      order: params.order || newParams.order,
      code: params.code || newParams.code,
      isIndividual: params.isIndividual || newParams.isIndividual,
      isEmployee: params.isEmployee || newParams.isEmployee,
      lastName: params.lastName || newParams.lastName,
      name: params.name || newParams.name,
      sectionId: params.sectionId || newParams.sectionId,
      regno: params.regno || newParams.regno,
      phone: params.phone || newParams.phone,
      address: params.address || newParams.address,
      bankId: params.bankId || newParams.bankId,
      bankAccountNo: params.bankAccountNo || newParams.bankAccountNo,
      email: params.email || newParams.email,
      isActive: params.isActive || newParams.isActive,
      queries: newParams.queries,
    };
    if (params.queries?.length) {
      const incomeParam = params.queries[0].param;
      prm.queries = [...unDuplicate(incomeParam, newParams), ...params.queries];
    }
    if (params.code) {
      prm.queries = [...unDuplicate("code", newParams)];
    }
    if (params.isIndividual) {
      prm.queries = [...unDuplicate("isIndividual", newParams)];
    }
    if (params.isEmployee) {
      prm.queries = [...unDuplicate("isEmployee", newParams)];
    }
    if (params.lastName) {
      prm.queries = [...unDuplicate("lastName", newParams)];
    }
    if (params.name) {
      prm.queries = [...unDuplicate("name", newParams)];
    }
    if (params.sectionId) {
      prm.queries = [...unDuplicate("sectionId", newParams)];
    }
    if (params.regno) {
      prm.queries = [...unDuplicate("regno", newParams)];
    }
    if (params.phone) {
      prm.queries = [...unDuplicate("phone", newParams)];
    }
    if (params.address) {
      prm.queries = [...unDuplicate("address", newParams)];
    }
    if (params.bankId) {
      prm.queries = [...unDuplicate("bankId", newParams)];
    }
    if (params.bankAccountNo) {
      prm.queries = [...unDuplicate("bankAccountNo", newParams)];
    }
    if (params.email) {
      prm.queries = [...unDuplicate("email", newParams)];
    }
    if (params.isActive) {
      prm.queries = [...unDuplicate("isActive", newParams)];
    }
    setNewParams(prm);
    blockContext.unblock();
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
    onSelect: (selectedRow: IDataConsumer, selected: boolean) => {
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
  const isisIndividual = (checked: boolean) => {
    if (checked) {
      form.setFieldsValue({
        isIndividual: checked,
      });
    }
  };
  return (
    <>
      <Row style={{ paddingTop: 12 }} gutter={[12, 24]}>
        {ComponentType === "FULL" ? (
          <>
            <Col md={24} lg={16} xl={19}>
              <Space size={24}>
                <Title level={5}>
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
        {isOpenTree && sections?.length > 0 ? (
          <Col md={24} lg={10} xl={6}>
            <NewDirectoryTree
              mode="CONSUMER"
              extra="HALF"
              data={sections}
              isLeaf={true}
              onClick={(key, isLeaf) => {
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
                    params: newParams,
                    onParams: (params) => setNewParams(params),
                  });
                  getData({
                    page: 1,
                    limit: 10,
                    sectionId: [`${key}`],
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
                                mode="CONSUMER"
                                extra="HALF"
                                data={sections}
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
                            className="ant-selecto-38px"
                            disabled={true}
                            style={{
                              width: "100%",
                            }}
                          >
                            {sections?.map(
                              (section: IDataTreeSection, index) => {
                                return (
                                  <NewOption key={index} value={section.id}>
                                    {section.name}
                                  </NewOption>
                                );
                              }
                            )}
                          </NewSelect>
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
                      params: newParams,
                      onParams: (params) => setNewParams(params),
                    });
                    getData(newParams);
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
                newParams={newParams}
                onParams={(params) => setNewParams(params)}
                incomeFilters={filters}
                onEdit={(row) => openModal(true, row)}
                onDelete={(id) => 1}
              />
            </Col>
          </Row>
        </Col>
        {isDescription ? (
          <Col md={24} lg={10} xl={6}>
            <Description
              title="Харилцагчийн мэдээлэл"
              open={isDescription}
              columns={columns}
              selectedRow={selectedRow}
              onEdit={() => openModal(true, selectedRow)}
              onDelete={(id) => 1}
              onCancel={(state) => {
                setIsDescription(state);
                setIsOpenTree(!state);
              }}
            />
          </Col>
        ) : null}
      </Row>
      <NewModal
        title="Харилцагчийн бүртгэл"
        open={isOpenModal}
        onCancel={() => setIsOpenModal(false)}
        onOk={() =>
          form.validateFields().then((values) => {
            values;
          })
        }
        width={800}
        maskClosable={false}
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
              <Form.Item label="Дотоод код" name="code"
               rules={[
                {
                  required: true,
                  message: "Дотоод код заавал",
                },
              ]}>
                <NewInput />
              </Form.Item>
              <Form.Item
              label="Үйлчилгээний нэр"
              rules={[
                {
                  required: true,
                  message: "Үйлчилгээний нэр заавал",
                },
              ]}
            >
              <NewInput />
            </Form.Item>
            <Form.Item
              label="Үйлчилгээний бүлэг"
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
                        mode={"CONSUMER"}
                        data={sections}
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
                  name="sectionId"
                  rules={[
                    {
                      required: true,
                      message: "Үйлчилгээний бүлэг заавал",
                    },
                  ]}
                >
                  <NewSelect
                    disabled={true}
                    style={{
                      width: "100%",
                    }}
                  >
                    {sections?.map((section: IDataTreeSection, index) => {
                      return (
                        <NewOption key={index} value={section.id}>
                          {section.name}
                        </NewOption>
                      );
                    })}
                  </NewSelect>
                </Form.Item>
                
              </Space.Compact>
            </Form.Item>
            <Form.Item label="Хэмжих нэгж">
              <Space.Compact>
                <Form.Item name="sectionId">
                  <NewSelect>
                    {sections?.map((section, index) => {
                      return (
                        <NewOption
                          style={{
                            display: section.isExpand ? "none" : "block",
                          }}
                          key={index}
                          value={section.id}
                        >
                          {section.name}
                        </NewOption>
                      );
                    })}
                  </NewSelect>
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
            <Form.Item
                label="Нэгдсэн ангилалын код"
                name="bankId"
              >
                <NewSelect>
                  {banks?.map((bank, index) => {
                    return (
                      <NewOption key={index} value={bank.id}>
                        {bank.name}
                      </NewOption>
                    );
                  })}
                </NewSelect>
              </Form.Item>
            </div>
            <div className="box-1">
              <p className="title">Нэмэлт мэдээлэл</p>
              <Form.Item label="Зэрэглэл">
              <Space.Compact>
                <Form.Item name="sectionId">
                  <NewSelect>
                    {sections?.map((section, index) => {
                      return (
                        <NewOption
                          style={{
                            display: section.isExpand ? "none" : "block",
                          }}
                          key={index}
                          value={section.id}
                        >
                          {section.name}
                        </NewOption>
                      );
                    })}
                  </NewSelect>
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
                <Form.Item name="sectionId">
                  <NewSelect>
                    {sections?.map((section, index) => {
                      return (
                        <NewOption
                          style={{
                            display: section.isExpand ? "none" : "block",
                          }}
                          key={index}
                          value={section.id}
                        >
                          {section.name}
                        </NewOption>
                      );
                    })}
                  </NewSelect>
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
                    alt="plsu"
                  />
                </div>
              </Space.Compact>
            </Form.Item>
            <Form.Item label="Дэлгэрэнгүй мэдээлэл">
              <NewTextArea />
            </Form.Item>
            </div>
          </div>
          <div className="switches">
            <Form.Item
              label="НӨАТ суутгах эсэх"
              name="isIndividual"
              valuePropName="checked"
            >
              <NewSwitch />
            </Form.Item>
            <Form.Item
              label="НХАТ суутгах эсэх"
              name="isEmployee"
              valuePropName="checked"
            >
              <NewSwitch
                onChange={(checked: boolean) => isisIndividual(checked)}
              />
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

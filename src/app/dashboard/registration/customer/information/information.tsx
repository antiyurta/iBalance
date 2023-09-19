import Image from "next/image";
import { useContext, useEffect, useState } from "react";
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
import { SignalFilled, SwapOutlined } from "@ant-design/icons";

// components
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import ColumnSettings from "@/components/columnSettings";
import Description from "@/components/description";
import NewDirectoryTree from "@/components/directoryTree";
import Filtered from "@/components/filtered";
import {
  NewInput,
  NewOption,
  NewSelect,
  NewSwitch,
  NewTextArea,
} from "@/components/input";
import NewModal from "@/components/modal";
// interface
import {
  ComponentsType,
  DataIndexType,
  IFilters,
  Meta,
} from "@/service/entities";
import {
  Params,
  IDataConsumer,
  FilteredColumns,
} from "@/service/consumer/entities";
//service iid
import { ConsumerService } from "@/service/consumer/service";
import { ReferenceService } from "@/service/reference/reference";
import { TreeSectionService } from "@/service/reference/tree-section/service";
// types
import { IType, IDataReference } from "@/service/reference/entity";
import {
  IDataTreeSection,
  TreeSectionType,
} from "@/service/reference/tree-section/entities";

//commans
import {
  findIndexInColumnSettings,
  onCloseFilterTag,
  openNofi,
  unDuplicate,
} from "@/feature/common";
import { NewTable } from "@/components/table";

const { Title } = Typography;

interface IProps {
  ComponentsType: ComponentsType;
  onClickModal?: (row: any) => void;
}

const Information = (props: IProps) => {
  const { ComponentsType, onClickModal } = props;
  const [form] = Form.useForm(); // add hiih Form
  const [switchForm] = Form.useForm(); // buleg solih
  const blockContext: BlockView = useContext(BlockContext); // uildeliig blockloh
  const [filters, setFilters] = useState<IFilters>();
  const [columns, setColumns] = useState<FilteredColumns>({
    code: {
      label: "Харилцагчийн код",
      isView: true,
      isFiltered: false,
      dataIndex: "code",
      type: DataIndexType.MULTI,
    },
    isIndividual: {
      label: "Хувь хүн эсэх",
      isView: ComponentsType === "FULL" ? true : false,
      isFiltered: false,
      dataIndex: "isIndividual",
      type: DataIndexType.BOOLEAN,
    },
    isEmployee: {
      label: "Ажилтан эсэх",
      isView: ComponentsType === "FULL" ? true : false,
      isFiltered: false,
      dataIndex: "isEmployee",
      type: DataIndexType.BOOLEAN,
    },
    lastName: {
      label: "Харилцагчийн овог",
      isView: true,
      isFiltered: false,
      dataIndex: "lastName",
      type: DataIndexType.MULTI,
    },
    name: {
      label: "Харилцагчийн нэр",
      isView: true,
      isFiltered: false,
      dataIndex: "name",
      type: DataIndexType.MULTI,
    },
    sectionId: {
      label: "Харилцагчийн бүлэг",
      isView: true,
      isFiltered: false,
      dataIndex: ["section", "name"],
      type: DataIndexType.STRING_SECTION,
    },
    regno: {
      label: "Регистр №",
      isView: ComponentsType === "FULL" ? true : false,
      isFiltered: false,
      dataIndex: "regno",
      type: DataIndexType.MULTI,
    },
    isActive: {
      label: "Төлөв",
      isView: true,
      isFiltered: false,
      dataIndex: "isActive",
      type: DataIndexType.BOOLEAN_STRING,
    },
    phone: {
      label: "Утасны дугаар",
      isView: ComponentsType === "FULL" ? true : false,
      isFiltered: false,
      dataIndex: "phone",
      type: DataIndexType.MULTI,
    },
    bankId: {
      label: "Банкны нэр",
      isView: ComponentsType === "FULL" ? true : false,
      isFiltered: false,
      dataIndex: ["bank", "name"],
      type: DataIndexType.STRING_BANK,
    },
    bankAccountNo: {
      label: "Дансны дугаар",
      isView: ComponentsType === "FULL" ? true : false,
      isFiltered: false,
      dataIndex: "bankAccountNo",
      type: DataIndexType.MULTI,
    },
    email: {
      label: "И-мэйл хаяг",
      isView: ComponentsType === "FULL" ? true : false,
      isFiltered: false,
      dataIndex: "email",
      type: DataIndexType.MULTI,
    },
    address: {
      label: "Хаяг",
      isView: ComponentsType === "FULL" ? true : false,
      isFiltered: false,
      dataIndex: "address",
      type: DataIndexType.MULTI,
    },
  });
  const [data, setData] = useState<IDataConsumer[]>([]);
  const [meta, setMeta] = useState<Meta>({ page: 1, limit: 10 });
  const [newParams, setNewParams] = useState<Params>({});
  const [banks, setBanks] = useState<IDataReference[]>([]);
  const [editMode, setIsMode] = useState<boolean>(false);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [isOpenTree, setIsOpenTree] = useState<boolean>(true);
  const [isFilterIcon, setIsFilterIcon] = useState<boolean>(false);
  const [isDescription, setIsDescription] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<IDataConsumer>();
  const [sections, setSections] = useState<IDataTreeSection[]>([]);
  const [isOpenPopOver, setIsOpenPopOver] = useState<boolean>(false);
  const [isOpenPopOverLittle, setIsOpenPopOverLittle] =
    useState<boolean>(false);
  const [tableSelectedRows, setTableSelectedRows] = useState<IDataConsumer[]>(
    []
  );
  //functions
  // modal neeh edit uu esvel new uu ??
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
  //data awcirah
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
    await ConsumerService.get(prm).then((response) => {
      if (response.success) {
        setData(response.response.data);
        setMeta(response.response.meta);
        setFilters(response.response.filter);
      }
    });
    blockContext.unblock();
  };
  // bank awcirah
  const getBanks = async (type: IType) => {
    await ReferenceService.get(type).then((response) => {
      setBanks(response.response);
    });
  };
  // section awchirah
  const getConsumerSection = async (type: TreeSectionType) => {
    await TreeSectionService.get(type).then((response) => {
      setSections(response.response);
    });
  };
  // hadgalah
  const onFinish = async (values: IDataConsumer) => {
    blockContext.block();
    if (editMode) {
      await ConsumerService.patch(selectedRow?.id, values)
        .then((response) => {
          if (response.success) {
            setSelectedRow(response.response);
            setIsOpenModal(false);
            getData({ page: 1, limit: 10 });
          }
        })
        .finally(() => {
          blockContext.unblock();
        });
    } else {
      await ConsumerService.post(values)
        .then((response) => {
          if (response.success) {
            setIsOpenModal(false);
            getData({ page: 1, limit: 10 });
          }
        })
        .finally(() => {
          blockContext.unblock();
        });
    }
  };
  // ustgah
  const onDelete = async (id: number) => {
    blockContext.block();
    await ConsumerService.remove(id)
      .then((response) => {
        if (response.success) {
          setSelectedRow(undefined);
          getData({ page: 1, limit: 10 });
        }
      })
      .finally(() => {
        blockContext.unblock();
      });
  };
  // ajiltan bwal bas huwi hun bolnoo
  const isisIndividual = (checked: boolean) => {
    if (checked) {
      form.setFieldsValue({
        isIndividual: checked,
      });
    }
  };
  // row selection GROUP UED
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
  // switch group solih
  const switchGroup = async (values: { sectionId: number }) => {
    if (tableSelectedRows.length > 0) {
      console.log(values, tableSelectedRows);
      await ConsumerService.switchPatch({
        sectionId: values.sectionId,
        ids: tableSelectedRows.map((row) => row.id),
      }).then((response) => {
        if (response.success) {
          openNofi("success", "Амжилттай", "Амилттай солигдлоо");
          onClickModal?.(false);
        }
      });
    } else {
      openNofi("error", "Алдаа", "Харилцагч сонгоно уу");
    }
  };
  //row selection
  useEffect(() => {
    if (isFilterIcon) {
      setIsOpenTree(false);
      if (isDescription) {
        setIsDescription(false);
      }
    } else {
      if (!isDescription) {
        setIsOpenTree(true);
      }
    }
  }, [isFilterIcon]);
  useEffect(() => {
    getData({ page: 1, limit: 10 });
    getConsumerSection(TreeSectionType.Consumer);
    getBanks(IType.BANK);
  }, []);
  return (
    <>
      <Row style={{ paddingTop: 12 }} gutter={[12, 24]}>
        {ComponentsType === "FULL" ? (
          <>
            <Col md={24} lg={16} xl={19}>
              <Space size={24}>
                <Title level={5}>Үндсэн бүртгэл / Харилцагч / Бүртгэл</Title>
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
            {ComponentsType === "LITTLE" ? (
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
                {ComponentsType === "FULL" ? (
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
                componentsType={ComponentsType}
                scroll={{ x: ComponentsType === "FULL" ? 1700 : 400 }}
                rowKey="id"
                rowSelection={ComponentsType === "LITTLE" ? rowSelection : null}
                doubleClick={true}
                onDClick={(value) => {
                  if (ComponentsType === "FULL") {
                    setSelectedRow(value);
                    setIsDescription(true);
                    setIsOpenTree(false);
                  } else if (ComponentsType === "MIDDLE") {
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
                onDelete={(id) => onDelete(id)}
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
              onDelete={(id) => onDelete(id)}
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
            onFinish(values);
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
          <div className="information-modal">
            <div className="switches">
              <Form.Item
                label="Хувь хүн эсэх"
                name="isIndividual"
                valuePropName="checked"
              >
                <NewSwitch />
              </Form.Item>
              <Form.Item
                label="Ажилтан эсэх"
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
            <div className="inputs">
              <Form.Item
                style={{
                  minWidth: 130,
                }}
                label="Харилцагчийн код"
                name="code"
                rules={[
                  {
                    required: true,
                    message: "Харилцагчийн код заавал",
                  },
                ]}
              >
                <NewInput />
              </Form.Item>
              <Form.Item
                style={{
                  minWidth: 260,
                }}
                label="Харилцагчийн овог"
                name="lastName"
              >
                <NewInput />
              </Form.Item>
              <Form.Item
                style={{
                  width: "100%",
                }}
                label="Харилцагчийн нэр"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Харилцагчийн нэр заавал",
                  },
                ]}
              >
                <NewInput />
              </Form.Item>
            </div>
            <div className="inputs">
              <Form.Item
                style={{
                  minWidth: 130,
                  maxWidth: 130,
                }}
                label="Регистр №"
                name="regno"
                rules={[
                  {
                    required: true,
                    message: "Регистр № заавал",
                  },
                  {
                    validator: async (_, regno) => {
                      const isIndividual = form.getFieldValue("isIndividual");
                      if (isIndividual) {
                        if (!regno || regno.length === 10) {
                          return Promise.resolve();
                        }
                        return Promise.reject("10 орон");
                      } else if (!isIndividual) {
                        if (!regno || regno.length === 7) {
                          return Promise.resolve();
                        }
                        return Promise.reject("7 орон");
                      }
                    },
                  },
                ]}
              >
                <NewInput />
              </Form.Item>
              <Form.Item
                style={{
                  maxWidth: 130,
                  minWidth: 130,
                }}
                label="И-Баримт дугаар"
                name="ebarimtNo"
                rules={[
                  {
                    required: true,
                    message: "И-Баримт дугаар заавал",
                  },
                ]}
              >
                <NewInput />
              </Form.Item>
              <Form.Item
                style={{
                  maxWidth: 105,
                  minWidth: 105,
                }}
                label="Утасны дугаар"
                name="phone"
              >
                <NewInput />
              </Form.Item>
              <Form.Item
                label="Харилцагчийн бүлэг"
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
                        message: "Харилцагчийн бүлэг заавал",
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
            </div>
            <div className="inputs">
              <Form.Item
                style={{
                  minWidth: 130,
                }}
                label="Дансны дугаар"
                name="bankAccountNo"
              >
                <NewInput />
              </Form.Item>
              <Form.Item
                style={{
                  minWidth: 260,
                }}
                label="Банкны нэр"
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
              <Form.Item
                style={{
                  width: "100%",
                }}
                label="И-мэйл хаяг"
                name="email"
              >
                <NewInput />
              </Form.Item>
            </div>
            <Form.Item label="Хаяг" name="address">
              <NewTextArea />
            </Form.Item>
          </div>
        </Form>
      </NewModal>
    </>
  );
};
export default Information;

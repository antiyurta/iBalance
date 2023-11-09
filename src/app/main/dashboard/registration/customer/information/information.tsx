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
  NewSelect,
  NewSwitch,
  NewTextArea,
} from "@/components/input";
import NewModal from "@/components/modal";
// interface
import { ComponentType, DataIndexType, Meta } from "@/service/entities";
import {
  FilteredColumnsConsumer,
  IDataConsumer,
  IFilterConsumer,
  IParamConsumer,
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
import Export from "@/components/Export";
import { TreeSectionSelect } from "@/components/tree-select";

const { Title } = Typography;

interface IProps {
  ComponentType: ComponentType;
  onClickModal?: (row: any) => void;
}

const Information = (props: IProps) => {
  const { ComponentType, onClickModal } = props;
  const [form] = Form.useForm(); // add hiih Form
  const [switchForm] = Form.useForm(); // buleg solih
  const blockContext: BlockView = useContext(BlockContext); // uildeliig blockloh
  const [filters, setFilters] = useState<IFilterConsumer>();
  const [columns, setColumns] = useState<FilteredColumnsConsumer>({
    code: {
      label: "Харилцагчийн код",
      isView: true,
      isFiltered: false,
      dataIndex: "code",
      type: DataIndexType.MULTI,
    },
    isIndividual: {
      label: "Хувь хүн эсэх",
      isView: ComponentType === "FULL" ? true : false,
      isFiltered: false,
      dataIndex: "isIndividual",
      type: DataIndexType.BOOLEAN,
    },
    isEmployee: {
      label: "Ажилтан эсэх",
      isView: ComponentType === "FULL" ? true : false,
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
      isView: ComponentType === "FULL" ? true : false,
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
      isView: ComponentType === "FULL" ? true : false,
      isFiltered: false,
      dataIndex: "phone",
      type: DataIndexType.MULTI,
    },
    bankId: {
      label: "Банкны нэр",
      isView: ComponentType === "FULL" ? true : false,
      isFiltered: false,
      dataIndex: ["bank", "name"],
      type: DataIndexType.STRING_BANK,
    },
    bankAccountNo: {
      label: "Дансны дугаар",
      isView: ComponentType === "FULL" ? true : false,
      isFiltered: false,
      dataIndex: "bankAccountNo",
      type: DataIndexType.MULTI,
    },
    email: {
      label: "И-мэйл хаяг",
      isView: ComponentType === "FULL" ? true : false,
      isFiltered: false,
      dataIndex: "email",
      type: DataIndexType.MULTI,
    },
    address: {
      label: "Хаяг",
      isView: ComponentType === "FULL" ? true : false,
      isFiltered: false,
      dataIndex: "address",
      type: DataIndexType.MULTI,
    },
    updatedAt: {
      label: "Өөрчлөлт оруулсан огноо",
      isView: ComponentType === "FULL" ? true : false,
      isFiltered: false,
      dataIndex: "updatedAt",
      type: DataIndexType.DATE,
    },
    updatedBy: {
      label: "Өөрчлөлт оруулсан хэрэглэгч",
      isView: ComponentType === "FULL" ? true : false,
      isFiltered: false,
      dataIndex: ["updatedUser", "firstName"],
      type: DataIndexType.USER,
    },
  });
  const [data, setData] = useState<IDataConsumer[]>([]);
  const [meta, setMeta] = useState<Meta>({ page: 1, limit: 10 });
  const [params, setParams] = useState<IParamConsumer>({});
  const [banks, setBanks] = useState<IDataReference[]>([]);
  const [editMode, setIsMode] = useState<boolean>(false);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [isOpenTree, setIsOpenTree] = useState<boolean>(true);
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
  const getData = async (param: IParamConsumer) => {
    blockContext.block();
    var prm: IParamConsumer = {
      ...params,
      ...param,
      queries: params.queries,
    };
    if (param.queries?.length) {
      const incomeParam = param.queries[0].param;
      prm.queries = [...unDuplicate(incomeParam, params), ...param.queries];
    }
    if (param.code) {
      prm.queries = [...unDuplicate("code", params)];
    }
    if (param.isIndividual) {
      prm.queries = [...unDuplicate("isIndividual", params)];
    }
    if (param.isEmployee) {
      prm.queries = [...unDuplicate("isEmployee", params)];
    }
    if (param.lastName) {
      prm.queries = [...unDuplicate("lastName", params)];
    }
    if (param.name) {
      prm.queries = [...unDuplicate("name", params)];
    }
    if (param.sectionId) {
      prm.queries = [...unDuplicate("sectionId", params)];
    }
    if (param.regno) {
      prm.queries = [...unDuplicate("regno", params)];
    }
    if (param.phone) {
      prm.queries = [...unDuplicate("phone", params)];
    }
    if (param.address) {
      prm.queries = [...unDuplicate("address", params)];
    }
    if (param.bankId) {
      prm.queries = [...unDuplicate("bankId", params)];
    }
    if (param.bankAccountNo) {
      prm.queries = [...unDuplicate("bankAccountNo", params)];
    }
    if (param.email) {
      prm.queries = [...unDuplicate("email", params)];
    }
    if (param.isActive) {
      prm.queries = [...unDuplicate("isActive", params)];
    }
    if (params.updatedAt) {
      prm.queries = [...unDuplicate("updatedAt", params)];
    }
    if (params.updatedBy) {
      prm.queries = [...unDuplicate("updatedBy", params)];
    }
    setParams(prm);
    await ConsumerService.get(prm)
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
  // bank awcirah
  const getBanks = async (type: IType) => {
    await ReferenceService.get({ type }).then((response) => {
      setBanks(response.response.data);
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
    if (editMode && selectedRow) {
      await ConsumerService.patch(selectedRow.id, values)
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
      if (state) {
        const clone = [...tableSelectedRows, ...changeRow];
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
      await ConsumerService.switchPatch({
        sectionId: values.sectionId,
        ids: tableSelectedRows.map((row) => row.id),
      }).then((response) => {
        if (response.success) {
          onClickModal?.(false);
        }
      });
    } else {
      openNofi("error", "Харилцагч сонгоно уу");
    }
  };
  useEffect(() => {
    getData({ page: 1, limit: 10 });
    getConsumerSection(TreeSectionType.Consumer);
    getBanks(IType.BANK);
  }, []);
  return (
    <>
      <Row style={{ paddingTop: 12 }} gutter={[12, 24]}>
        {ComponentType === "FULL" ? (
          <>
            <Col md={24} lg={16} xl={19}>
              <Space size={24}>
                <Title level={3}>Үндсэн бүртгэл / Харилцагч / Бүртгэл</Title>
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
        {isOpenTree ? (
          <Col md={24} lg={10} xl={6}>
            <NewDirectoryTree
              data={sections}
              isLeaf={false}
              extra="HALF"
              onClick={(keys) => {
                onCloseFilterTag({
                  key: "sectionId",
                  state: true,
                  column: columns,
                  onColumn: (columns) => setColumns(columns),
                  params: params,
                  onParams: (params) => setParams(params),
                });
                getData({
                  page: 1,
                  limit: 10,
                  sectionId: keys,
                });
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
                      <TreeSectionSelect
                        type={TreeSectionType.Consumer}
                        form={switchForm}
                        rules={[
                          {
                            required: true,
                            message: "Шинээр шилжүүлэх бүлэг заавал",
                          },
                        ]}
                        name="sectionId"
                      />
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
                      params: params,
                      onParams: (params) => setParams(params),
                    });
                    getData(params ? params : {});
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
                          params: params,
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
                    <Export
                      pdfConfig={{
                        orientation: "l",
                        unit: "px",
                        format: "A4",
                      }}
                      userOptions={{
                        columns: [
                          {
                            header: "Харилцагч код",
                            dataKey: "code",
                          },
                          {
                            header: "Хувь хүн эсэх",
                            dataKey: "isIndividual",
                          },
                          {
                            header: "Ажилтан эсэх",
                            dataKey: "isEmployee",
                          },
                          {
                            header: "Харилцагчийн овог",
                            dataKey: "lastName",
                          },
                          {
                            header: "Харилцагчийн нэр",
                            dataKey: "name",
                          },
                          {
                            header: "Харилцагчийн бүлэг",
                            dataKey: "sectionName",
                          },
                          {
                            header: "Регистр №",
                            dataKey: "regno",
                          },
                          {
                            header: "Төлөв",
                            dataKey: "isActive",
                          },
                          {
                            header: "Утасны дугаар",
                            dataKey: "phone",
                          },
                          {
                            header: "Банкны нэр",
                            dataKey: "bankName",
                          },
                          {
                            header: "Дансны дугаар",
                            dataKey: "bankAccountNo",
                          },
                          {
                            header: "И-мэйл хаяг",
                            dataKey: "email",
                          },
                          {
                            header: "Хаяг",
                            dataKey: "address",
                          },
                        ],
                        body: data?.map((item) => ({
                          code: item.code,
                          isIndividual: item.isIndividual ? "Тийм" : "Үгүй",
                          isEmployee: item.isEmployee ? "Тийм" : "Үгүй",
                          lastName: item.lastName,
                          name: item.name,
                          sectionName: item.section.name,
                          regno: item.regno,
                          isActive: item.isActive ? "Идэвхтэй" : "Идэвхгүй",
                          phone: item.phone,
                          bankName: item.bank?.name,
                          bankAccountNo: item.bankAccountNo,
                          email: item.email,
                          address: item.address,
                        })),
                      }}
                      columnLength={10}
                      docName="Үндсэн бүртгэл / Харилцагч / Бүртгэл"
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
                isEdit={true}
                onEdit={(row) => openModal(true, row)}
                isDelete={true}
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
                <TreeSectionSelect
                  type={TreeSectionType.Consumer}
                  form={form}
                  rules={[
                    {
                      required: true,
                      message: "Харилцагчийн бүлэг заавал",
                    },
                  ]}
                  name="sectionId"
                />
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
                <NewSelect
                  options={banks?.map((bank) => ({
                    label: bank.name,
                    value: bank.id,
                  }))}
                />
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

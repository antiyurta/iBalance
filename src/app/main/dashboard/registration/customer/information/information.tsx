import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { App, Button, Col, Form, Row, Space } from "antd";
import { SwapOutlined } from "@ant-design/icons";

// components
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import ColumnSettings from "@/components/columnSettings";
import Description from "@/components/description";
import NewDirectoryTree from "@/components/tree";
import Filtered from "@/components/table/filtered";
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
  getParam,
  openNofi,
} from "@/feature/common";
import { NewTable } from "@/components/table";
import Export from "@/components/Export";
import { WarningOutlined } from "@ant-design/icons";
import { useTypedSelector } from "@/feature/store/reducer";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/feature/store/store";
import { changeParam, newPane } from "@/feature/store/slice/param.slice";
import PageTitle from "@/components/page-title";
import NewTreeSelect from "@/components/tree/tree-select";

interface IProps {
  ComponentType: ComponentType;
  onClickModal?: (row: any) => void;
}
const key = "customer/information";
const Information = (props: IProps) => {
  const { ComponentType, onClickModal } = props;
  const { modal } = App.useApp();
  const [form] = Form.useForm(); // add hiih Form
  const isIndividual = Form.useWatch("isIndividual", form);
  const isEmployee = Form.useWatch("isEmployee", form);
  const [switchForm] = Form.useForm(); // buleg solih
  const blockContext: BlockView = useContext(BlockContext);
  const [filters, setFilters] = useState<IFilterConsumer>();
  const { items } = useTypedSelector((state) => state.pane);
  const param = getParam(items, key);
  const dispatch = useDispatch<AppDispatch>();
  const [columns, setColumns] = useState<FilteredColumnsConsumer>({
    code: {
      label: "Харилцагчийн код",
      isView: true,
      isFiltered: false,
      dataIndex: ["code"],
      type: DataIndexType.MULTI,
    },
    isIndividual: {
      label: "Хувь хүн эсэх",
      isView: ComponentType === "FULL" ? true : false,
      isFiltered: false,
      dataIndex: ["isIndividual"],
      type: DataIndexType.BOOLEAN,
    },
    isEmployee: {
      label: "Ажилтан эсэх",
      isView: ComponentType === "FULL" ? true : false,
      isFiltered: false,
      dataIndex: ["isEmployee"],
      type: DataIndexType.BOOLEAN,
    },
    lastName: {
      label: "Харилцагчийн овог",
      isView: true,
      isFiltered: false,
      dataIndex: ["lastName"],
      type: DataIndexType.MULTI,
    },
    name: {
      label: "Харилцагчийн нэр",
      isView: true,
      isFiltered: false,
      dataIndex: ["name"],
      type: DataIndexType.MULTI,
    },
    sectionName: {
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
      dataIndex: ["regno"],
      type: DataIndexType.MULTI,
    },
    isActive: {
      label: "Төлөв",
      isView: true,
      isFiltered: false,
      dataIndex: ["isActive"],
      type: DataIndexType.BOOLEAN_STRING,
    },
    phone: {
      label: "Утасны дугаар",
      isView: ComponentType === "FULL" ? true : false,
      isFiltered: false,
      dataIndex: ["phone"],
      type: DataIndexType.MULTI,
    },
    bank: {
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
      dataIndex: ["bankAccountNo"],
      type: DataIndexType.MULTI,
    },
    email: {
      label: "И-мэйл хаяг",
      isView: ComponentType === "FULL" ? true : false,
      isFiltered: false,
      dataIndex: ["email"],
      type: DataIndexType.MULTI,
    },
    address: {
      label: "Хаяг",
      isView: ComponentType === "FULL" ? true : false,
      isFiltered: false,
      dataIndex: ["address"],
      type: DataIndexType.MULTI,
    },
    updatedAt: {
      label: "Өөрчлөлт оруулсан огноо",
      isView: ComponentType === "FULL" ? true : false,
      isFiltered: false,
      dataIndex: ["updatedAt"],
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
  const [banks, setBanks] = useState<IDataReference[]>([]);
  const [editMode, setIsMode] = useState<boolean>(false);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [isOpenTree, setIsOpenTree] = useState<boolean>(true);
  const [isDescription, setIsDescription] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<IDataConsumer>();
  const [sections, setSections] = useState<IDataTreeSection[]>([]);
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
  const getData = async () => {
    blockContext.block();
    if (ComponentType !== "FULL") {
      // prm.isActive = [true];
    }
    await ConsumerService.get(param)
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
    await ReferenceService.get({
      type,
    }).then((response) => {
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
            getData();
          }
        })
        .finally(() => {
          blockContext.unblock();
        });
    } else {
      await ConsumerService.get({ registerNumber: values.regno })
        .then((response) => {
          if (response.success && response.response.meta.itemCount === 0) {
            insertConsumer(values);
          } else {
            const consumerNames = response.response.data
              .map((item) => item.name)
              .toString();
            modal.confirm({
              title: (
                <div
                  style={{ fontWeight: 400, fontSize: 20, color: "#ffc107" }}
                >
                  <WarningOutlined />
                  {" Анхааруулга"}
                </div>
              ),
              icon: null,
              width: 280,
              content: (
                <div style={{ textAlign: "justify" }}>
                  {`${values.regno} дугаартай регистр ${consumerNames} гэсэн
                  харилцагч дээр үүссэн байна. Уг РД-аар дахин харилцагч
                  үүсгэхтэй итгэлтэй байна уу?`}
                </div>
              ),
              onOk: () => insertConsumer(values),
            });
          }
        })
        .finally(() => blockContext.unblock());
    }
  };
  const insertConsumer = async (values: IDataConsumer) => {
    blockContext.block();
    await ConsumerService.post(values)
      .then((response) => {
        if (response.success) {
          setIsOpenModal(false);
          getData();
        }
      })
      .finally(() => {
        blockContext.unblock();
      });
  };
  // ustgah
  const onDelete = async (id: number) => {
    blockContext.block();
    await ConsumerService.remove(id)
      .then((response) => {
        if (response.success) {
          setSelectedRow(undefined);
          getData();
        }
      })
      .finally(() => {
        blockContext.unblock();
      });
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
          switchForm.resetFields();
          getData();
          setTableSelectedRows([]);
          onClickModal?.(false);
        }
      });
    } else {
      openNofi("error", "Харилцагч сонгоно уу");
    }
  };
  useEffect(() => {
    dispatch(newPane({ key, param: {} }));
    getConsumerSection(TreeSectionType.Consumer);
    getBanks(IType.BANK);
  }, []);
  useEffect(() => {
    // ajiltan bwal bas huwi hun bolnoo
    form.setFieldValue("isIndividual", isEmployee);
  }, [isEmployee]);
  useEffect(() => {
    getData();
  }, [param]);
  return (
    <>
      {ComponentType === "FULL" && (
        <PageTitle onClick={() => openModal(false)} />
      )}
      <Row style={{ paddingTop: 12 }} gutter={[12, 24]}>
        {isOpenTree && (
          <Col md={24} lg={10} xl={6}>
            <NewDirectoryTree
              data={sections}
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
        )}
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
                      name="sectionId"
                      rules={[
                        {
                          required: true,
                          message: "Шинээр шилжүүлэх бүлэг заавал",
                        },
                      ]}
                    >
                      <NewTreeSelect
                        sections={sections}
                        onChange={(value) =>
                          switchForm.setFieldValue("sectionId", value)
                        }
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
                scroll={{
                  x: ComponentType === "FULL" ? 1700 : 400,
                }}
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
                onColumns={(columns) => setColumns(columns)}
                incomeFilters={filters}
                isEdit={ComponentType == "FULL" ? true : false}
                onEdit={(row) => openModal(true, row)}
                isDelete={ComponentType == "FULL" ? true : false}
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
                name="sectionId"
                rules={[
                  {
                    required: true,
                    message: "Харилцагчийн бүлэг заавал",
                  },
                ]}
              >
                <NewTreeSelect
                  sections={sections}
                  onChange={(value) => form.setFieldValue("sectionId", value)}
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
                  options={banks.map((bank) => ({
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

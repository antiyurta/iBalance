"use client";
import { MoreOutlined, FilterOutlined } from "@ant-design/icons";
import ColumnSettings from "@/components/columnSettings";
import Description from "@/components/description";
import NewDirectoryTree from "@/components/directoryTree";
import {
  NewInput,
  NewInputNumber,
  NewOption,
  NewSearch,
  NewSelect,
  NewSwitch,
  NewTextArea,
} from "@/components/input";
import NewModal from "@/components/modal";
import { Form, Popover, Space, Table } from "antd";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import dayjs from "dayjs";
// components
import Popup from "@/components/popup";
import FilterMore from "./filterMore";
// interface
import { Meta } from "@/service/entities";
import {
  Params,
  DataIndexType,
  IDataConsumer,
  Quearies,
  FilteredColumns,
  DataIndex,
  ColumnType,
} from "@/service/consumer/entities";
//service iid
import { ConsumerService } from "@/service/consumer/service";
import { ReferenceService } from "@/service/reference/reference";
import { ConsumerSectionService } from "@/service/consumer/section/service";
// types
import { IType, IDataReference } from "@/service/reference/entity";
import { isChecked } from "@/feature/common";
import Filtered from "@/components/filtered";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import { IDataConsumerSection } from "@/service/consumer/section/entities";
import DropDown from "@/components/dropdown";
import { ColumnFilterItem } from "antd/es/table/interface";

const { Column } = Table;

enum Open {
  DUAL = "DUAL",
  TREE = "TREE",
  DESC = "DESC",
  FILTER = "FILTER",
}

const Information = () => {
  const [form] = Form.useForm(); // add hiih Form
  const blockContext: BlockView = useContext(BlockContext); // uildeliig blockloh
  const [testColumns, setTestColumns] = useState<FilteredColumns>({
    code: {
      label: "Харилцагчийн код",
      isView: true,
      isFiltered: false,
      dataIndex: "code",
      type: DataIndexType.STRING,
    },
    isIndividual: {
      label: "Хувь хүн эсэх",
      isView: true,
      isFiltered: false,
      dataIndex: "isIndividual",
      type: DataIndexType.BOOLEAN,
    },
    isEmployee: {
      label: "Ажилтан эсэх",
      isView: true,
      isFiltered: false,
      dataIndex: "isEmployee",
      type: DataIndexType.BOOLEAN,
    },
    lastName: {
      label: "Харилцагчийн овог",
      isView: true,
      isFiltered: false,
      dataIndex: "lastName",
      type: DataIndexType.STRING,
    },
    name: {
      label: "Харилцагчийн нэр",
      isView: true,
      isFiltered: false,
      dataIndex: "name",
      type: DataIndexType.STRING,
    },
    sectionId: {
      label: "Харилцагчийн бүлэг",
      isView: true,
      isFiltered: false,
      dataIndex: ["section", "name"],
      type: DataIndexType.STRING_TREE,
    },
    regno: {
      label: "Регистр №",
      isView: true,
      isFiltered: false,
      dataIndex: "regno",
      type: DataIndexType.STRING,
    },
    phone: {
      label: "Утасны дугаар",
      isView: true,
      isFiltered: false,
      dataIndex: "phone",
      type: DataIndexType.STRING,
    },
    address: {
      label: "Хаяг",
      isView: true,
      isFiltered: false,
      dataIndex: "address",
      type: DataIndexType.STRING,
    },
    bankId: {
      label: "Банкны нэр",
      isView: true,
      isFiltered: false,
      dataIndex: ["bank", "name"],
      type: DataIndexType.STRING_BANK,
    },
    bankAccountNo: {
      label: "Дансны дугаар",
      isView: true,
      isFiltered: false,
      dataIndex: "bankAccountNo",
      type: DataIndexType.STRING,
    },
    email: {
      label: "И-мэйл хаяг",
      isView: true,
      isFiltered: false,
      dataIndex: "email",
      type: DataIndexType.STRING,
    },
    isActive: {
      label: "Төлөв",
      isView: true,
      isFiltered: false,
      dataIndex: "isActive",
      type: DataIndexType.BOOLEAN_STRING,
    },
  });
  const [data, setData] = useState<IDataConsumer[]>([]);
  const [meta, setMeta] = useState<Meta>({ page: 1, limit: 10 });
  const [newParams, setNewParams] = useState<Params>({});
  const [banks, setBanks] = useState<IDataReference[]>([]);
  const [editMode, setIsMode] = useState<boolean>(false);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [isOpenTree, setIsOpenTree] = useState<boolean>(true);
  const [isDualMirror, setIsDualMirror] = useState<boolean>(false);
  const [isFilterIcon, setIsFilterIcon] = useState<boolean>(false);
  const [isDescription, setIsDescription] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<IDataConsumer>();
  const [sections, setSections] = useState<IDataConsumerSection[]>([]);
  const [tableWidth, setTableWidth] = useState<string>("calc(100% - 262px)");
  // isOpen udig shiideh
  const configureOpens = (type: Open) => {
    switch (type) {
      case Open.DUAL:
        if (isDualMirror) {
          setIsOpenTree(true);
          setIsDualMirror(false);
          setTableWidth("calc(100% - 274px)");
        } else {
          setIsOpenTree(false);
          setIsDualMirror(true);
          setTableWidth("100%");
        }
      case Open.DESC:
        setIsDescription(true);
        setTableWidth("calc(100% - 274px)");
    }
  };
  // filter iih data g dawhtsal arigalh
  const removeDuplicates = (set: any[]) => {
    const uniqueIds = new Set(set.map((item) => item.value));
    const clone: ColumnFilterItem[] = [...uniqueIds];
    return clone
      .map((id) => set.find((item) => item.value === id))
      .filter(Boolean);
  };
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
  // mor filter
  const onCloseFilterTag = (key: string, state: boolean) => {
    const clone = testColumns;
    clone![key as keyof FilteredColumns]!.isFiltered = state;
    setTestColumns(clone);
    if (!state) {
      var newClonedParams = newParams;
      newClonedParams[key as keyof Params] = undefined;
      if (newParams.orderParam === key) {
        newClonedParams.orderParam = undefined;
        newClonedParams.order = undefined;
      }
      if (newParams.queries) {
        var newQueries: Quearies[] = [];
        newParams.queries.map((query) => {
          if (query.param != key) {
            newQueries.push(query);
          }
        });
        newClonedParams.queries = newQueries.filter(Boolean) || undefined;
      }
      setNewParams(newClonedParams);
    }
  };
  // paramsiin dawhtsal arigal confi hiih
  const unDuplicate = (text: string) => {
    var newQueries: Quearies[] = [];
    newParams.queries?.map((query) => {
      if (query.param != text) {
        newQueries.push(query);
      }
    });
    return newQueries;
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
      prm.queries = [...unDuplicate(incomeParam), ...params.queries];
    }
    if (params.code) {
      prm.queries = [...unDuplicate("code")];
    }
    if (params.isIndividual) {
      prm.queries = [...unDuplicate("isIndividual")];
    }
    if (params.isEmployee) {
      prm.queries = [...unDuplicate("isEmployee")];
    }
    if (params.lastName) {
      prm.queries = [...unDuplicate("lastName")];
    }
    if (params.name) {
      prm.queries = [...unDuplicate("name")];
    }
    if (params.sectionId) {
      prm.queries = [...unDuplicate("sectionId")];
    }
    if (params.regno) {
      prm.queries = [...unDuplicate("regno")];
    }
    if (params.phone) {
      prm.queries = [...unDuplicate("phone")];
    }
    if (params.address) {
      prm.queries = [...unDuplicate("address")];
    }
    if (params.bankId) {
      prm.queries = [...unDuplicate("bankId")];
    }
    if (params.bankAccountNo) {
      prm.queries = [...unDuplicate("bankAccountNo")];
    }
    if (params.email) {
      prm.queries = [...unDuplicate("email")];
    }
    if (params.isActive) {
      prm.queries = [...unDuplicate("isActive")];
    }
    setNewParams(prm);
    await ConsumerService.get(prm).then((response) => {
      if (response.success) {
        setData(response.response.data);
        setMeta(response.response.meta);
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
  const getConsumerSection = async () => {
    await ConsumerSectionService.get().then((response) => {
      setSections(response.response);
    });
  };
  // hadgalah
  const onFinish = async (values: IDataConsumer) => {
    blockContext.block();
    if (editMode) {
      await ConsumerService.patch(selectedRow?.id, values).then((response) => {
        if (response.success) {
          setSelectedRow(response.response);
          setIsOpenModal(false);
          getData({ page: 1, limit: 10 });
        }
      });
    } else {
      await ConsumerService.post(values).then((response) => {
        if (response.success) {
          setIsOpenModal(false);
          getData({ page: 1, limit: 10 });
        }
      });
    }
    blockContext.unblock();
  };
  // ustgah
  const onDelete = async (id: number) => {
    blockContext.block();
    await ConsumerService.remove(id).then((response) => {
      if (response.success) {
        setSelectedRow(undefined);
        getData({ page: 1, limit: 10 });
      }
    });
    blockContext.unblock();
  };
  // ajiltan bwal bas huwi hun bolnoo
  const isisIndividual = (checked: boolean) => {
    if (checked) {
      form.setFieldsValue({
        isIndividual: checked,
      });
    }
  };
  // bagana tohirhoo hiih ued
  const findIndexInColumnSettings = (
    newRowIndexes: string[],
    unSelectedRow: string[]
  ) => {
    unSelectedRow?.map((row) => {
      onCloseFilterTag(row, false);
    });
    const clone = { ...testColumns };
    Object.entries(clone).map(([key, _value]) => {
      clone![key as keyof FilteredColumns]!.isView = false;
    });
    newRowIndexes?.map((index) => {
      clone![index as unknown as keyof FilteredColumns]!.isView = true;
    });
    setTestColumns(clone);
    getData(newParams);
  };
  const typeOfFilters = (type: DataIndexType, dataIndex: DataIndex) => {
    if (type === DataIndexType.BOOLEAN) {
      return [
        {
          text: "Тийм",
          value: true,
        },
        {
          text: "Үгүй",
          value: false,
        },
      ];
    } else if (type === DataIndexType.STRING_TREE) {
      return removeDuplicates(
        data?.map((item) => ({
          text: sections.find((section) => section.id === item[dataIndex])
            ?.name,
          value: item[dataIndex],
        }))
      );
    } else if (type === DataIndexType.STRING_BANK) {
      return removeDuplicates(
        data?.map((item) => ({
          text: banks.find((bank) => bank.id === item[dataIndex])?.name,
          value: item[dataIndex],
        }))
      );
    } else if (type === DataIndexType.STRING) {
      return removeDuplicates(
        data?.map((item) => ({
          text: item[dataIndex],
          value: item[dataIndex],
        }))
      );
    } else if (type === DataIndexType.BOOLEAN_STRING) {
      return [
        {
          text: "Идэвхтэй",
          value: true,
        },
        {
          text: "Идэвхгүй",
          value: false,
        },
      ];
    }
  };
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
    getConsumerSection();
    getBanks(IType.BANK);
  }, []);
  return (
    <>
      <div className="information">
        <div className="header">
          <div className="left">
            <p>Үндсэн бүртгэл / Харилцагч / Бүртгэл</p>
            <button className="app-button" onClick={() => openModal(false)}>
              <Image
                src={"/images/AddIcon.svg"}
                width={12}
                height={12}
                alt="addicon"
              />
              Шинээр бүртгэх
            </button>
          </div>
          <div className="right">
            <NewSearch
              prefix={
                <Image
                  src={"/images/SearchIcon.svg"}
                  width={12}
                  height={12}
                  alt="searchIcon"
                />
              }
              allowClear={true}
              onSearch={(values: string) => console.log(values)}
            />
          </div>
        </div>
        <div className="second-header">
          <Filtered
            columns={testColumns}
            isActive={(key, state) => {
              onCloseFilterTag(key, state);
              getData(newParams);
            }}
          />
          <div className="extra">
            <ColumnSettings
              columns={testColumns}
              columnIndexes={(arg1, arg2) =>
                findIndexInColumnSettings(arg1, arg2)
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
            {/* <Image
              src={
                isDualMirror
                  ? "/images/DualMirrorBlack.svg"
                  : "/images/DualMirror.svg"
              }
              onClick={() => {
                setIsDualMirror(!isDualMirror);
                setIsOpenTree(!isDualMirror);
              }}
              width={24}
              height={24}
              alt="dualMirror"
            /> */}
            <Image
              src={
                isFilterIcon
                  ? "/images/filterTrue.svg"
                  : "/images/filterFalse.svg"
              }
              onClick={() => {
                setIsFilterIcon(!isFilterIcon);
              }}
              width={24}
              height={24}
              alt="dualMirror"
            />
          </div>
        </div>
        <div className="body">
          <NewDirectoryTree
            open={isOpenTree}
            onClick={(key) => {
              getData({ page: 1, limit: 10, sectionId: [`${key}`] });
            }}
          />
          <div
            style={{
              width: tableWidth,
            }}
          >
            <Table
              scroll={{ x: 1700 }}
              rowKey={"id"}
              onRow={(record) => {
                return {
                  onDoubleClick: () => {
                    setIsOpenTree(false);
                    setIsFilterIcon(false);
                    if (isOpenTree) {
                      setIsOpenTree(false);
                    }
                    setSelectedRow(record);
                    setIsDescription(true);
                  },
                };
              }}
              dataSource={data}
              pagination={{
                position: ["bottomCenter"],
                size: "small",
                current: meta.page,
                total: meta.itemCount,
                showTotal: (total, range) =>
                  `${range[0]}-ээс ${range[1]}, Нийт ${total}`,
                pageSize: meta.limit,
                showSizeChanger: true,
                pageSizeOptions: ["5", "10", "20", "50"],
                showQuickJumper: true,
                onChange: (page, pageSize) =>
                  getData?.({ page: page, limit: pageSize }),
              }}
            >
              {Object.entries(testColumns)?.map(
                ([key, value]: [any, ColumnType]) => {
                  if (value.isView) {
                    return (
                      <Column
                        key={key}
                        dataIndex={value.dataIndex}
                        title={value.label}
                        filterDropdown={({ confirm, filters }) => (
                          <DropDown
                            label={value.label}
                            dataIndex={key}
                            type={DataIndexType.STRING}
                            filters={filters || []}
                            isFiltered={value.isFiltered}
                            handleSearch={(params, state) => {
                              confirm();
                              onCloseFilterTag(key, state);
                              getData(params);
                            }}
                          />
                        )}
                        filters={typeOfFilters(value.type, key)}
                        filterIcon={() => {
                          return (
                            <FilterOutlined
                              style={{
                                fontSize: 7,
                                color: value.isFiltered ? "#198754" : "black",
                              }}
                            />
                          );
                        }}
                        render={(text) => {
                          if (value.type === "BOOLEAN") {
                            return isChecked(text);
                          } else if (value.type === "BOOLEAN_STRING") {
                            if (text) {
                              return (
                                <span
                                  style={{
                                    color: "green",
                                  }}
                                >
                                  Идэвхтэй
                                </span>
                              );
                            }
                            return "Идэвхгүй";
                          } else {
                            return text;
                          }
                        }}
                      />
                    );
                  }
                }
              )}
              <Column
                title=" "
                fixed="right"
                width={40}
                render={(text, row: IDataConsumer) => {
                  return (
                    <Popover
                      content={
                        <Popup
                          onEdit={() => openModal(true, row)}
                          onDelete={() => onDelete(text)}
                        />
                      }
                      trigger="click"
                      placement="bottomRight"
                    >
                      <MoreOutlined
                        style={{
                          fontSize: 22,
                        }}
                      />
                    </Popover>
                  );
                }}
              />
            </Table>
          </div>
          <Description
            title="Харилцагчийн мэдээлэл"
            open={isDescription}
            columns={testColumns}
            selectedRow={selectedRow}
            onEdit={() => openModal(true, selectedRow)}
            onDelete={(id) => onDelete(id)}
            onCancel={(state) => {
              setIsDescription(state);
              setIsOpenTree(!state);
            }}
          />
          <FilterMore
            title="Шүүлтүүр"
            open={isFilterIcon}
            onOk={(value) => {
              onCloseFilterTag("lastName", true);
              getData({ page: 1, limit: 10, lastName: ["Андгай"] });
            }}
            onCancel={(state) => {
              setIsOpenTree(true);
              setIsFilterIcon(state);
            }}
          />
        </div>
      </div>
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
                <NewInputNumber />
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
                  minWidth: 120,
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
                  minWidth: 116,
                }}
                label="Утасны дугаар"
                name="phone"
              >
                <NewInput />
              </Form.Item>
              <Form.Item label="Харилцагчийн бүлэг">
                <Space.Compact>
                  <div className="extraButton">
                    <Popover
                      placement="bottom"
                      content={
                        <NewDirectoryTree
                          open={true}
                          onClick={(key) => {
                            form.setFieldsValue({
                              sectionId: key,
                            });
                          }}
                        />
                      }
                      trigger={"click"}
                    >
                      <Image
                        src="/icons/clipboardBlack.svg"
                        width={16}
                        height={16}
                        alt="clipboard"
                      />
                    </Popover>
                  </div>
                  <Form.Item
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
                      {sections?.map((section: IDataConsumerSection, index) => {
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

"use client";
import { MoreOutlined, FilterOutlined } from "@ant-design/icons";
import ColumnSettings from "@/components/columnSettings";
import Description from "@/components/description";
import NewDirectoryTree from "@/components/directoryTree";
import getColumnSearchProps from "@/components/filterDropDown2";
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
// interface
import { Meta } from "@/service/entities";
import {
  Params,
  DataIndexType,
  IDataConsumer,
  Quearies,
  FilteredColumns,
  DataIndex,
} from "@/service/consumer/entities";
//service iid
import { ConsumerService } from "@/service/consumer/service";
import { ReferenceService } from "@/service/reference/reference";
import { ConsumerSectionService } from "@/service/consumer/section/service";
// types
import { IType, IDataReference } from "@/service/reference/entity";
import { isChecked } from "@/feature/common";
import type { ColumnsType } from "antd/es/table";
import Filtered from "@/components/filtered";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import { IDataConsumerSection } from "@/service/consumer/section/entities";
import DropDown from "@/components/dropdown";
import { ColumnFilterItem } from "antd/es/table/interface";

const { Column, ColumnGroup } = Table;

const Information = () => {
  const [form] = Form.useForm(); // add hiih Form
  const blockContext: BlockView = useContext(BlockContext); // uildeliig blockloh
  const defualtColumnIndexes: number[] = [0, 1, 2, 3]; // default mor nuud
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
    lastName: {
      label: "Харилцагчийн овог",
      isView: false,
      isFiltered: false,
      dataIndex: "lastName",
      type: DataIndexType.STRING,
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
  const [isDescription, setIsDescription] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<IDataConsumer>();
  const [sections, setSections] = useState<IDataConsumerSection[]>([]);
  const [selectedColumns, setSelectedColumns] = useState<FilteredColumns>({
    // code: {
    //   label: "Харилцагчийн код",
    //   isActive: false,
    // },
    // isIndividual: {
    //   label: "Хувь хүн эсэх",
    //   isActive: false,
    // },
    // isEmployee: {
    //   label: "Ажилтан эсэх",
    //   isActive: false,
    // },
    // lastName: {
    //   label: "Харилцагчийн овог",
    //   isActive: false,
    // },
    // name: {
    //   label: "Харилцагчийн нэр",
    //   isActive: false,
    // },
    // sectionId: {
    //   label: "Харилцагчийн бүлэг",
    //   isActive: false,
    //   relationIndex: ["section", "name"],
    // },
    // regno: {
    //   label: "Регистр №",
    //   isActive: false,
    // },
    // phone: {
    //   label: "Утасны дугаар",
    //   isActive: false,
    // },
    // address: {
    //   label: "Хаяг",
    //   isActive: false,
    // },
    // bankId: {
    //   label: "Банкны нэр",
    //   isActive: false,
    //   relationIndex: ["bank", "name"],
    // },
    // bankAccountNo: {
    //   label: "Дансны дугаар",
    //   isActive: false,
    // },
    // email: {
    //   label: "И-мэйл хаяг",
    //   isActive: false,
    // },
    // isActive: {
    //   label: "Төлөв",
    //   isActive: false,
    // },
  });
  const [filteredColumns, setFilteredColumns] = useState<
    ColumnsType<IDataConsumer>
  >([]);

  // filter iih data g dawhtsal arigalh
  const removeDuplicates = (set: any[]) => {
    const uniqueIds = new Set(set.map((item) => item.value));
    const clone: ColumnFilterItem[] = [...uniqueIds];
    return clone
      .map((id) => set.find((item) => item.value === id))
      .filter(Boolean);
  };
  // tabliin mor nuud
  // const columns: ColumnsType<IDataConsumer> = [
  //   {
  //     title: "Харилцагчийн код",
  //     dataIndex: "code",
  //     width: 140,
  //     ...getColumnSearchProps({
  //       label: "Харилцагчийн код",
  //       dataIndex: "code",
  //       type: DataIndexType.NUMBER,
  //       isActive: selectedColumns.code?.isActive,
  //       filter: (key, state) => onCloseFilterTag(key, state),
  //       handleSearch: (params) => getData(params),
  //     }),
  //     filters: removeDuplicates(
  //       data?.map((item) => ({
  //         text: item.code,
  //         value: item.code,
  //       }))
  //     ),
  //     filterIcon: () => {
  //       return (
  //         <FilterOutlined
  //           style={{
  //             fontSize: 12,
  //             color: selectedColumns.code?.isActive ? "#198754" : "black",
  //           }}
  //         />
  //       );
  //     },
  //   },
  //   {
  //     title: "Хувь хүн эсэх",
  //     dataIndex: "isIndividual",
  //     render: (text) => {
  //       return isChecked(text);
  //     },
  //   },
  //   {
  //     title: "Ажилтан эсэх",
  //     dataIndex: "isEmployee",
  //     render: (text) => {
  //       return isChecked(text);
  //     },
  //   },
  //   {
  //     title: "Харилцагчийн овог",
  //     dataIndex: "lastName",
  //     ...getColumnSearchProps({
  //       label: "Харилцагчийн овог",
  //       dataIndex: "lastName",
  //       type: DataIndexType.STRING,
  //       isActive: selectedColumns.lastName?.isActive,
  //       filter: (key, state) => onCloseFilterTag(key, state),
  //       handleSearch: (params) => getData(params),
  //     }),
  //     filters: removeDuplicates(
  //       data?.map((item) => ({
  //         text: item.lastName,
  //         value: item.lastName,
  //       }))
  //     ),
  //     filterIcon: () => {
  //       return (
  //         <FilterOutlined
  //           style={{
  //             fontSize: 12,
  //             color: selectedColumns.lastName?.isActive ? "#198754" : "black",
  //           }}
  //         />
  //       );
  //     },
  //   },
  //   {
  //     title: "Харилцагчийн нэр",
  //     dataIndex: "name",
  //   },
  //   {
  //     title: "Харилцагчийн бүлэг",
  //     dataIndex: ["section", "name"],
  //   },
  //   {
  //     title: "Регистр",
  //     dataIndex: "regno",
  //   },
  //   {
  //     title: "Утасны дугаар",
  //     dataIndex: "phone",
  //   },
  //   {
  //     title: "Хаяг",
  //     dataIndex: "address",
  //   },
  //   {
  //     title: "Банкны нэр",
  //     dataIndex: ["bank", "name"],
  //   },
  //   {
  //     title: "Дансны дугаар",
  //     dataIndex: "bankAccountNo",
  //   },
  //   {
  //     title: "И-мэйл хаяг",
  //     dataIndex: "email",
  //   },
  //   {
  //     title: "Төлөв",
  //     dataIndex: "isActive",
  //     render: (text) => {
  //       if (text) {
  //         return (
  //           <span
  //             style={{
  //               color: "green",
  //             }}
  //           >
  //             Идэвхтэй
  //           </span>
  //         );
  //       }
  //       return "Идэвхгүй";
  //     },
  //   },
  //   {
  //     title: "Өөрчлөлт хийсэн огноо",
  //     dataIndex: "updatedAt",
  //     render: (text) => {
  //       return dayjs(text).format("YYYY/MM/DD HH:mm");
  //     },
  //   },
  //   {
  //     title: " ",
  //     fixed: "right",
  //     dataIndex: "id",
  //     width: 40,
  //     render: (value, row) => {
  //       return (
  //         <Popover
  //           content={
  //             <Popup
  //               onEdit={() => openModal(true, row)}
  //               onDelete={() => onDelete(value)}
  //             />
  //           }
  //           trigger="click"
  //           placement="bottomRight"
  //         >
  //           <MoreOutlined
  //             style={{
  //               fontSize: 22,
  //             }}
  //           />
  //         </Popover>
  //       );
  //     },
  //   },
  // ];
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
    const clone = { ...testColumns };
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
      sectionId: params.sectionId || newParams.sectionId,
      orderParam: params.orderParam || newParams.orderParam,
      order: params.order || newParams.order,
      code: params.code || newParams.code,
      lastName: params.lastName || newParams.lastName,
      queries: newParams.queries,
    };
    if (params.queries?.length) {
      const incomeParam = params.queries[0].param;
      prm.queries = [...unDuplicate(incomeParam), ...params.queries];
    } else if (params.code) {
      prm.queries = [...unDuplicate("code")];
    } else if (params.lastName) {
      prm.queries = [...unDuplicate("lastName")];
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
    console.log(newRowIndexes, unSelectedRow);
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
    } else if (type === DataIndexType.STRING) {
      return removeDuplicates(
        data?.map((item) => ({
          text: item[dataIndex],
          value: item[dataIndex],
        }))
      );
    }
  };
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
            <Image
              src={
                isDualMirror
                  ? "/images/DualMirrorBlack.svg"
                  : "/images/DualMirror.svg"
              }
              onClick={() => {
                setIsDualMirror(!isDualMirror);
                setIsDescription(false);
                setIsOpenTree(!isOpenTree);
              }}
              width={24}
              height={24}
              alt="dualMirror"
            />
          </div>
        </div>
        <div className="body">
          {!isDualMirror ? (
            <NewDirectoryTree
              open={isOpenTree}
              onClick={(key) => {
                getData({ page: 1, limit: 10, sectionId: [`${key}`] });
              }}
            />
          ) : null}
          <div
            style={{
              width: !isDualMirror
                ? "calc(100% - 324px)"
                : isDescription
                ? "calc(100% - 380px)"
                : "100%",
            }}
          >
            <Table rowKey={"id"} dataSource={data}>
              {Object.entries(testColumns)?.map(([key, value]) => {
                if (value.isView) {
                  return (
                    <Column
                      key={key}
                      dataIndex={value.dataIndex}
                      title={value.label}
                      filterDropdown={({ confirm, filters }) => (
                        <DropDown
                          label={value.label}
                          dataIndex={value.dataIndex}
                          type={DataIndexType.STRING}
                          filters={filters || []}
                          isFiltered={value.isFiltered}
                          handleSearch={(params) => {
                            onCloseFilterTag(value.dataIndex, true);
                            getData(params);
                          }}
                        />
                      )}
                      filters={typeOfFilters(value.type, value.dataIndex)}
                      filterIcon={() => {
                        return (
                          <FilterOutlined
                            style={{
                              fontSize: 12,
                              color: value.isFiltered ? "#198754" : "black",
                            }}
                          />
                        );
                      }}
                      render={(text) => {
                        if (value.type === "BOOLEAN") {
                          return isChecked(text);
                        } else {
                          return text;
                        }
                      }}
                    />
                  );
                }
              })}
            </Table>
            {/* <Table
              rowKey={"id"}
              // columns={columns}
              columns={filteredColumns}
              dataSource={data}
              scroll={{
                x: filteredColumns?.length > 5 ? 1500 : 500,
              }}
              loading={blockContext.isBlock()}
              onRow={(record) => {
                return {
                  onDoubleClick: () => {
                    if (isDualMirror) {
                      setIsDescription(true);
                      setSelectedRow(record);
                    }
                  },
                };
              }}
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
            /> */}
          </div>
          <Description
            title="Харилцагчийн мэдээлэл"
            open={isDescription}
            columns={selectedColumns}
            selectedRow={selectedRow}
            onEdit={() => openModal(true, selectedRow)}
            onDelete={(id) => onDelete(id)}
            onCancel={(state) => setIsDescription(state)}
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

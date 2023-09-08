"use client";

import { SignalFilled, PlusOutlined } from "@ant-design/icons";
import ColumnSettings from "@/components/columnSettings";
import Description from "@/components/description";
import NewDirectoryTree from "@/components/directoryTree";
import Filtered from "@/components/filtered";
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
import { NewTable } from "@/components/table";
import {
  displayRender,
  findIndexInColumnSettings,
  onCloseFilterTag,
} from "@/feature/common";
import {
  IDataConsumerSection,
  TreeSectionType,
} from "@/service/consumer/section/entities";
import {
  DataIndexType,
  FilteredColumns,
  IFilters,
  Meta,
} from "@/service/entities";
import { IDataMaterial, IParams } from "@/service/material/entities";
import { MaterialService } from "@/service/material/service";
import {
  AutoComplete,
  Cascader,
  Form,
  Input,
  Popover,
  Space,
  Upload,
} from "antd";
import Image from "next/image";
import { useEffect, useState } from "react";

const InventoriesRegistration = () => {
  const tableWidth = "calc(100% - 262px)";
  const [form] = Form.useForm();
  const [newParams, setNewParams] = useState<IParams>({});
  const [editMode, setEditMode] = useState<boolean>(false);
  const [meta, setMeta] = useState<Meta>({ page: 1, limit: 10 });
  const [data, setData] = useState<IDataMaterial[]>([]);
  const [sections, setSections] = useState<IDataConsumerSection[]>();
  const [filters, setFilters] = useState<IFilters>();
  const [isOpenTree, setIsOpenTree] = useState<boolean>(true);
  const [isDescription, setIsDescription] = useState<boolean>(false);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<IDataMaterial>();
  const [isOpenPopOver, setIsOpenPopOver] = useState<boolean>(false);
  const [columns, setColumns] = useState<FilteredColumns>({
    code: {
      label: "Дотоод код",
      isView: true,
      isFiltered: false,
      dataIndex: "code",
      type: DataIndexType.MULTI,
    },
    name: {
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
    measurementId: {
      label: "Хэмжих нэгж",
      isView: true,
      isFiltered: false,
      dataIndex: "measurement",
      type: DataIndexType.MULTI,
    },
    countPackage: {
      label: "Багц доторх тоо",
      isView: true,
      isFiltered: false,
      dataIndex: "countPackage",
      type: DataIndexType.MULTI,
    },
    brandId: {
      label: "Брэнд",
      isView: true,
      isFiltered: false,
      dataIndex: "brand",
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
  const getData = async (params: IParams) => {
    await MaterialService.get(params).then((response) => {
      if (response.success) {
        setData(response.response.data);
        setMeta(response.response.meta);
        setFilters(response.response.filter);
      }
    });
  };
  useEffect(() => {
    getData({ page: 1, limit: 10 });
  }, []);
  return (
    <div>
      <div className="information">
        <div className="header">
          <div className="left">
            <p>Үндсэн бүртгэл / Бараа материал / Бүртгэл</p>
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
          <div className="extra">
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
          </div>
        </div>
        <div className="body">
          <NewDirectoryTree
            isLeaf={true}
            type={TreeSectionType.Consumer}
            open={isOpenTree}
            onClick={(key, isLeaf) => {
              if (isLeaf) {
                getData({
                  page: 1,
                  limit: 10,
                  sectionId: [`${key}`],
                });
              }
            }}
          />
          <div
            style={{
              width: tableWidth,
            }}
          >
            <NewTable
              scroll={{ x: 1000 }}
              rowKey="id"
              doubleClick={true}
              onDClick={(value) => {
                setSelectedRow(value);
                setIsDescription(true);
                setIsOpenTree(false);
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
          </div>
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
        </div>
      </div>
      <NewModal
        width={900}
        title="Бараа материалын бүртгэл"
        open={isOpenModal}
        onCancel={() => setIsOpenModal(false)}
        onOk={() =>
          form.validateFields().then((values) => {
            console.log(values);
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
                          isLeaf={true}
                          type={TreeSectionType.Consumer}
                          open={true}
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
              <Form.Item label="Хэмжих нэгж">
                <Space.Compact>
                  <Form.Item name="measurement">
                    <Cascader
                      displayRender={displayRender}
                      options={[
                        {
                          value: "zhejiang",
                          label: "Zhejiang",
                          children: [
                            {
                              value: "hangzhou",
                              label: "Hangzhou",
                              children: [
                                {
                                  value: "xihu",
                                  label: "West Lake",
                                },
                              ],
                            },
                          ],
                        },
                      ]}
                    />
                  </Form.Item>
                  <button
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
                  </button>
                </Space.Compact>
              </Form.Item>
              <Form.Item label="Багц доторх тоо" name="countPackage">
                <NewInputNumber />
              </Form.Item>
              <Form.Item label="Зэрэглэл">
                <Space.Compact>
                  <Form.Item name="asdasd">
                    <NewSelect>
                      <NewOption value={1}>vasd</NewOption>
                    </NewSelect>
                  </Form.Item>
                  <button
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
                  </button>
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
              <Form.Item label="Сериал код" name="serialNumber">
                <NewInput />
              </Form.Item>
              <Form.Item label="Сериал код" name="serialNumber">
                <Cascader displayRender={displayRender} />
              </Form.Item>
            </div>
            <div className="box">
              <p className="title">Нэмэлт мэдээлэл</p>
              <Form.Item
                label="Зураг оруулах"
                valuePropName="fileList"
                // getValueFromEvent={normFile}
              >
                <Upload action="/upload.do" listType="picture-card">
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
                  <Form.Item name="brand">
                    <Cascader
                      displayRender={displayRender}
                      options={[
                        {
                          value: "zhejiang",
                          label: "Zhejiang",
                          children: [
                            {
                              value: "hangzhou",
                              label: "Hangzhou",
                              children: [
                                {
                                  value: "xihu",
                                  label: "West Lake",
                                },
                              ],
                            },
                          ],
                        },
                      ]}
                    />
                  </Form.Item>
                  <button
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
                  </button>
                </Space.Compact>
              </Form.Item>
              <Form.Item label="Бэлтгэн нийлүүлэгчийн код, нэр">
                <Space.Compact>
                  <div className="extraButton">
                    <Image
                      // onClick={() => setIsOpenPopOver(true)}
                      src="/icons/clipboardBlack.svg"
                      width={16}
                      height={16}
                      alt="clipboard"
                    />
                  </div>
                  <Form.Item
                    name="code"
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
                    <AutoComplete
                      // options={consumers?.map((consumer) => {
                      //   return {
                      //     label: consumer.code,
                      //     value: consumer.code,
                      //   };
                      // })}
                      // onChange={(id) => {
                      //   console.log(id);
                      // }}
                      // onSelect={(id) => {
                      //   const data = consumers.find(
                      //     (consumer) => consumer.code === id
                      //   );
                      //   setSelectedConsumer(data);
                      //   form.setFieldsValue(data);
                      // }}
                      className="ant-selecto-border-no"
                    >
                      <Input.Search
                        style={{
                          border: "none",
                        }}
                        onChange={(e) => console.log(e)}
                        enterButton={false}
                        placeholder="Хайх"
                        onSearch={(e: any) => {
                          // getConsumerByCode(e);
                        }}
                      />
                    </AutoComplete>
                  </Form.Item>
                </Space.Compact>
              </Form.Item>
              <Form.Item label="Дэлгэрэнгүй мэдээлэл">
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
    </div>
  );
};
export default InventoriesRegistration;

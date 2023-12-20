import ColumnSettings from "@/components/columnSettings";
import NewDirectoryTree from "@/components/directoryTree";
import Filtered from "@/components/filtered";
import { NewInput, NewSwitch } from "@/components/input";
import NewModal from "@/components/modal";
import { NewTable } from "@/components/table";
import {
  findIndexInColumnSettings,
  onCloseFilterTag,
  openNofi,
  unDuplicate,
} from "@/feature/common";
import { ComponentType, DataIndexType, Meta } from "@/service/entities";
import {
  IDataTreeSection,
  TreeSectionType,
} from "@/service/reference/tree-section/entities";
import { TreeSectionService } from "@/service/reference/tree-section/service";
import { Button, Col, Form, Input, Row, Space, Typography } from "antd";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { SwapOutlined } from "@ant-design/icons";
import {
  FilteredColumnsWarehouse,
  IDataWarehouse,
  IFilterWarehouse,
  IParamWarehouse,
} from "@/service/reference/warehouse/entities";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import { WarehouseService } from "@/service/reference/warehouse/service";
import TextArea from "antd/es/input/TextArea";
import { UserSelect } from "@/components/user-select";
import { TreeSectionSelect } from "@/components/tree-select";

interface IProps {
  ComponentType: ComponentType;
  onClickModal?: (row: any) => void;
}

const { Title } = Typography;

const StoragiesRegistration = (props: IProps) => {
  const { ComponentType, onClickModal } = props;
  const [form] = Form.useForm();
  const [switchForm] = Form.useForm();
  const blockContext: BlockView = useContext(BlockContext);
  const [sections, setSections] = useState<IDataTreeSection[]>([]);
  const [params, setParams] = useState<IParamWarehouse>({});
  const [data, setData] = useState<any[]>([]);
  const [meta, setMeta] = useState<Meta>({ page: 1, limit: 10 });
  const [filters, setFilters] = useState<IFilterWarehouse>();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<IDataWarehouse>();
  const [tableSelectedRows, setTableSelectedRows] = useState<IDataWarehouse[]>(
    []
  );
  const [columns, setColumns] = useState<FilteredColumnsWarehouse>({
    code: {
      label: "Байршлын код",
      isView: true,
      isFiltered: false,
      dataIndex: "code",
      type: DataIndexType.MULTI,
    },
    names: {
      label: "Байршлын нэр",
      isView: true,
      isFiltered: false,
      dataIndex: "name",
      type: DataIndexType.MULTI,
    },
    sectionId: {
      label: "Байршлын бүлэг",
      isView: true,
      isFiltered: false,
      dataIndex: ["section", "name"],
      type: DataIndexType.MULTI,
    },
    userIds: {
      label: "Хариуцсан нярав",
      isView: true,
      isFiltered: false,
      dataIndex: ["users"],
      type: DataIndexType.MULTI,
    },
    address: {
      label: "Байршлын хаяг",
      isView: true,
      isFiltered: false,
      dataIndex: "address",
      type: DataIndexType.MULTI,
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
      isView: true,
      isFiltered: false,
      dataIndex: "updatedAt",
      type: DataIndexType.DATE,
    },
    updatedBy: {
      label: "Өөрчлөлт хийсэн хэрэглэгч",
      isView: true,
      isFiltered: false,
      dataIndex: ["updatedUser", "firstName"],
      type: DataIndexType.MULTI,
    },
  });
  const openModal = (state: boolean, row?: IDataWarehouse) => {
    setIsEdit(state);
    form.resetFields();
    if (state && row) {
      form.setFieldsValue(row);
      setSelectedRow(row);
    }
    setIsOpenModal(true);
  };
  const getData = async (param: IParamWarehouse) => {
    setTableSelectedRows([]);
    blockContext.block();
    var prm: IParamWarehouse = {
      ...params,
      ...param,
      queries: params.queries,
    };
    if (param.queries?.length) {
      const incomeParam = param.queries[0].param;
      prm.queries = [...unDuplicate(incomeParam, params), ...param.queries];
    }
    setParams(prm);
    await WarehouseService.get(prm)
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
  const getSections = async (type: TreeSectionType) => {
    await TreeSectionService.get(type).then((response) => {
      if (response.success) {
        setSections(response.response);
      }
    });
  };
  // switch group solih
  const switchGroup = async (values: { sectionId: number }) => {
    if (tableSelectedRows.length > 0) {
      await WarehouseService.switchPatch({
        sectionId: values.sectionId,
        ids: tableSelectedRows.map((row) => row.id),
      }).then((response) => {
        if (response.success) {
          switchForm.resetFields();
          getData({ page: 1, limit: 10 });
          setTableSelectedRows([]);
          onClickModal?.(false);
        }
      });
    } else {
      openNofi("error", "Байршил сонгоно уу");
    }
  };
  /** row selection GROUP UED */
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
    onSelect: (selectedRow: IDataWarehouse, selected: boolean) => {
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
    selectedRowKeys: tableSelectedRows.map((e) => e.id),
  };
  const onFinish = async (values: IDataWarehouse) => {
    blockContext.block();
    if (isEdit && selectedRow) {
      await WarehouseService.patch(selectedRow.id, values)
        .then((response) => {
          if (response.success) {
            setIsOpenModal(false);
            getData(params);
          }
        })
        .finally(() => {
          blockContext.unblock();
        });
    } else {
      await WarehouseService.post(values)
        .then((response) => {
          if (response.success) {
            setIsOpenModal(false);
            getData(params);
          }
        })
        .finally(() => {
          blockContext.unblock();
        });
    }
  };
  const onDelete = async (id: number) => {
    blockContext.block();
    await WarehouseService.remove(id)
      .then((response) => {
        if (response.success) {
          getData(params);
        }
      })
      .finally(() => {
        blockContext.unblock;
      });
  };
  useEffect(() => {
    getData({ page: 1, limit: 10 });
    getSections(TreeSectionType.Warehouse);
  }, []);
  return (
    <div>
      <Row style={{ paddingTop: 12 }} gutter={[12, 24]}>
        {ComponentType === "FULL" ? (
          <>
            <Col md={24} lg={16} xl={19}>
              <Space size={24}>
                <Title level={3}>
                  Үндсэн бүртгэл / Бараа материал / Байршлын бүртгэл
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
                sectionIds: keys,
              });
            }}
          />
        </Col>
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
                      label="Байршлын бүлэг"
                      style={{
                        width: "100%",
                      }}
                    >
                      <TreeSectionSelect
                        isLeaf={true}
                        type={TreeSectionType.Warehouse}
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
                onDelete={(id) => onDelete(id)}
                onDClick={(value) => {
                  if (ComponentType === "FULL") {
                    setSelectedRow(value);
                  } else if (ComponentType === "MIDDLE") {
                    onClickModal?.(value);
                  }
                }}
              />
            </Col>
          </Row>
        </Col>
      </Row>
      <NewModal
        width={290}
        title="Байршлын бүртгэл"
        open={isOpenModal}
        onCancel={() => setIsOpenModal(false)}
        onOk={() =>
          form.validateFields().then((values) => {
            onFinish(values);
          })
        }
      >
        <Form form={form} layout="vertical">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <Form.Item label="Байршлын код" name="code">
              <NewInput />
            </Form.Item>
            <Form.Item label="Байршлын нэр" name="name">
              <NewInput />
            </Form.Item>
            <Form.Item label="Байршлын бүлэг">
              <TreeSectionSelect
                isLeaf={true}
                type={TreeSectionType.Warehouse}
                form={form}
                rules={[]}
                name="sectionId"
              />
            </Form.Item>
            <Form.Item label="Хариуцсан нярав">
              <UserSelect
                form={form}
                rules={[]}
                name="userIds"
                isMultiple={true}
              />
            </Form.Item>
            <Form.Item label="Байршлын хаяг" name="address">
              <TextArea />
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
export default StoragiesRegistration;

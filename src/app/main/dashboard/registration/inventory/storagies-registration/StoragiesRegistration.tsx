import ColumnSettings from "@/components/columnSettings";
import NewDirectoryTree from "@/components/tree";
import Filtered from "@/components/table/filtered";
import { NewInput, NewSwitch } from "@/components/input";
import NewModal from "@/components/modal";
import { NewTable } from "@/components/table";
import {
  findIndexInColumnSettings,
  getParam,
  openNofi,
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
import { UploadImage } from "@/components/upload-image";
import { EmployeeSelect } from "@/components/employee-select";
import { useTypedSelector } from "@/feature/store/reducer";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/feature/store/store";
import { changeParam, newPane } from "@/feature/store/slice/param.slice";
import NewTreeSelect from "@/components/tree/tree-select";

interface IProps {
  ComponentType: ComponentType;
  onClickModal?: (row: any) => void;
}

const { Title } = Typography;
const key = "inventory/storagies-registration";
const StoragiesRegistration = (props: IProps) => {
  const { ComponentType, onClickModal } = props;
  const [form] = Form.useForm();
  const [switchForm] = Form.useForm();
  const blockContext: BlockView = useContext(BlockContext);
  const [sections, setSections] = useState<IDataTreeSection[]>([]);
  const { items } = useTypedSelector((state) => state.pane);
  const param = getParam(items, key);
  const dispatch = useDispatch<AppDispatch>();
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
      dataIndex: ["code"],
      type: DataIndexType.MULTI,
    },
    name: {
      label: "Байршлын нэр",
      isView: true,
      isFiltered: false,
      dataIndex: ["name"],
      type: DataIndexType.MULTI,
    },
    sectionName: {
      label: "Байршлын бүлэг",
      isView: true,
      isFiltered: false,
      dataIndex: ["section", "name"],
      type: DataIndexType.MULTI,
    },
    employeeName: {
      label: "Хариуцсан нярав",
      isView: true,
      isFiltered: false,
      dataIndex: ["employees", "firstName"],
      type: DataIndexType.MULTI,
    },
    address: {
      label: "Байршлын хаяг",
      isView: true,
      isFiltered: false,
      dataIndex: ["address"],
      type: DataIndexType.MULTI,
    },
    isActive: {
      label: "Төлөв",
      isView: true,
      isFiltered: false,
      dataIndex: ["isActive"],
      type: DataIndexType.BOOLEAN_STRING,
    },
    updatedAt: {
      label: "Өөрчлөлт хийсэн огноо",
      isView: true,
      isFiltered: false,
      dataIndex: ["updatedAt"],
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
      form.setFieldsValue({
        ...row,
        employeeIds: row.employees.map((item) => item.id),
      });
      setSelectedRow(row);
    }
    setIsOpenModal(true);
  };
  const getData = async (param: IParamWarehouse) => {
    setTableSelectedRows([]);
    blockContext.block();
    await WarehouseService.get(param)
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
          getData({ ...param });
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
            getData({ ...param });
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
            getData({ ...param });
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
          getData({ ...param });
        }
      })
      .finally(() => {
        blockContext.unblock;
      });
  };
  useEffect(() => {
    dispatch(newPane({ key, param: {} }));
    getSections(TreeSectionType.Warehouse);
  }, []);
  useEffect(() => {
    getData({ ...param });
  }, [param]);
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
                onColumns={(columns) => setColumns(columns)}
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
        <Form form={form} layout="vertical" initialValues={{ isActive: true }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <Form.Item label="Зураг" name="logoId">
              <UploadImage
                imageId={form.getFieldValue("logoId")}
                setImage={(id) => form.setFieldValue("logoId", id)}
              />
            </Form.Item>
            <Form.Item label="Байршлын код" name="code">
              <NewInput />
            </Form.Item>
            <Form.Item label="Байршлын нэр" name="name">
              <NewInput />
            </Form.Item>
            <Form.Item label="Байршлын бүлэг" name="sectionId">
              <NewTreeSelect
                sections={sections}
                onChange={(value) => form.setFieldValue("sectionId", value)}
              />
            </Form.Item>
            <Form.Item label="Хариуцсан нярав">
              <EmployeeSelect
                form={form}
                rules={[]}
                name="employeeIds"
                query={{ isTreasure: true }}
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

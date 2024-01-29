import ColumnSettings from "@/components/columnSettings";
import NewDirectoryTree from "@/components/directoryTree";
import Filtered from "@/components/filtered";
import { NewInput, NewSearch, NewSelect } from "@/components/input";
import NewModal from "@/components/modal";
import { NewTable } from "@/components/table/index";
import { findIndexInColumnSettings, onCloseFilterTag } from "@/feature/common";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import { DataIndexType, FilteredColumns, Meta } from "@/service/entities";
import {
  IDataUnitOfMeasure,
  IParamUnitOfMeasure,
  MeasurementType,
} from "@/service/material/unitOfMeasure/entities";
import { UnitOfMeasureService } from "@/service/material/unitOfMeasure/service";
import { App, Col, Form, Row, Space, Typography } from "antd";
import Image from "next/image";
import { ChangeEvent, useContext, useEffect, useState } from "react";

import { unitSwitch, units } from "./unit";
import { useTypedSelector } from "@/feature/store/reducer";
export interface IDataUnit {
  id: number;
  sectionId: number | null;
  name: string;
  isExpand: boolean;
}

interface IProps {
  ComponentsType: string;
  onClickModal?: (row: IDataUnitOfMeasure) => void;
}

const { Title } = Typography;

const UnitOfMeasure = (props: IProps) => {
  const { message } = App.useApp();
  const { ComponentsType, onClickModal } = props;
  const blockContext: BlockView = useContext(BlockContext); // uildeliig blockloh
  const [form] = Form.useForm();
  const [data, setData] = useState<IDataUnitOfMeasure[]>([]);
  const [newParams, setNewParams] = useState<IParamUnitOfMeasure>({
    page: 1,
    limit: 10,
    filters: [],
  });
  const [meta, setMeta] = useState<Meta>({ page: 1, limit: 10 });
  const [filters, setFilters] = useState<IParamUnitOfMeasure>();
  const [editMode, setEditMode] = useState<boolean>(false);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<IDataUnitOfMeasure>();
  const { activeKey, tabItems } = useTypedSelector((state) => state.tabs);
  const currentTabParam = tabItems.find((item) => item.key == activeKey)?.param;
  const [columns, setColumns] = useState<FilteredColumns>({
    shortName: {
      label: "Богино нэр",
      isView: true,
      isFiltered: false,
      dataIndex: ["shortName"],
      type: DataIndexType.MULTI,
    },
    name: {
      label: "Хэмжих нэгжийн нэр",
      isView: true,
      isFiltered: false,
      dataIndex: ["name"],
      type: DataIndexType.MULTI,
    },
    type: {
      label: "Хэмжих нэгжийн бүлэг",
      isView: true,
      isFiltered: false,
      dataIndex: ["type"],
      type: DataIndexType.ENUM,
    },
    updatedAt: {
      label: "Өөрчлөлт хийсэн огноо",
      isView: ComponentsType === "FULL" ? true : false,
      isFiltered: false,
      dataIndex: ["updatedAt"],
      type: DataIndexType.DATE,
    },
    updatedBy: {
      label: "Өөрчлөлт хийсэн хэрэглэгч",
      isView: ComponentsType === "FULL" ? true : false,
      isFiltered: false,
      dataIndex: ["updatedUser", "firstName"],
      type: DataIndexType.MULTI,
    },
  });
  // modal neeh edit uu esvel new uu ??
  const openModal = (state: boolean, row?: any) => {
    setEditMode(state);
    if (!state) {
      form.resetFields();
    } else {
      form.setFieldsValue(row);
    }
    setIsOpenModal(true);
    setSelectedRow(row);
  };
  const getData = async (params: IParamUnitOfMeasure) => {
    blockContext.block();
    await UnitOfMeasureService.get(currentTabParam)
      .then((response) => {
        if (response.success) {
          setData(response.response.data);
          setMeta(response.response.meta);
        }
      })
      .finally(() => {
        blockContext.unblock();
      });
  };
  const getHeader = async () => {
    blockContext.block();
    await UnitOfMeasureService.getHeader().then((response) => {
      if (response.success) {
        setFilters(response.response);
      }
    });
  };
  const onFinish = async (values: IDataUnitOfMeasure) => {
    blockContext.block();
    if (editMode) {
      await UnitOfMeasureService.patch(selectedRow?.id, values)
        .then((response) => {
          if (response.success) {
            getData({
              page: 1,
              limit: 10,
              filters: [],
            });
            setIsOpenModal(false);
          }
        })
        .finally(() => {
          blockContext.unblock();
        });
    } else {
      await UnitOfMeasureService.post(values).then((response) => {
        if (response.success) {
          getData({
            page: 1,
            limit: 10,
            filters: [],
          });
          setIsOpenModal(false);
        }
      });
    }
  };
  const onDelete = async (id: number) => {
    await UnitOfMeasureService.remove(id).then((response) => {
      if (response.success) {
        getData({
          page: 1,
          limit: 10,
          filters: [],
        });
      }
    });
  };
  const checkDuplicate = (e: ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = e;
    if (data.find((item) => item.shortName === value)) {
      message.error({
        content: <p>Богино нэр давхцаж байна</p>,
      });
      form.setFieldsValue({
        shortName: "",
      });
    }
  };

  useEffect(() => {
    getHeader();
  }, []);
  useEffect(() => {
    getData({
      filters: [],
      page: 0,
      limit: 0,
    });
  }, [currentTabParam]);
  return (
    <>
      <Row
        style={{
          paddingTop: 12,
        }}
        gutter={[12, 24]}
      >
        <Col md={24} lg={16} xl={19}>
          <Space size={24}>
            {ComponentsType === "FULL" ? (
              <>
                <Title level={3}>
                  Үндсэн бүртгэл / Бараа материал / Хэмжих нэгж
                </Title>
                <button className="app-button" onClick={() => openModal(false)}>
                  <Image
                    src={"/images/AddIcon.svg"}
                    width={12}
                    height={12}
                    alt="addicon"
                  />
                  Шинээр бүртгэх
                </button>
              </>
            ) : (
              <Title level={3}>Хэмжих нэгж</Title>
            )}
          </Space>
        </Col>
        <Col md={24} lg={8} xl={5}>
          <NewSearch />
        </Col>
        <Col md={24} lg={10} xl={6}>
          <NewDirectoryTree
            data={units}
            extra="HALF"
            isLeaf={true}
            onClick={(keys) => {
              getData({
                page: 1,
                limit: 10,
                filters: [],
              });
            }}
          />
        </Col>
        <Col md={24} lg={14} xl={18}>
          <Row gutter={[0, 12]}>
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
              </Space>
            </Col>
            <Col span={24}>
              <NewTable
                scroll={{ x: ComponentsType === "FULL" ? 700 : 400 }}
                rowKey="id"
                doubleClick={true}
                onDClick={(value) => {
                  if (ComponentsType === "MODAL") {
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
                isEdit={true}
                onEdit={(row) => openModal(true, row)}
                isDelete={true}
                onDelete={(id) => onDelete(id)}
              />
            </Col>
          </Row>
        </Col>
      </Row>
      <NewModal
        title="Хэмжих нэгж"
        width={300}
        open={isOpenModal}
        onCancel={() => setIsOpenModal(false)}
        onOk={() => form.validateFields().then((values) => onFinish(values))}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Хэмжих нэгжийн нэр"
            name="name"
            rules={[
              {
                required: true,
                message: "Хэмжих нэгжийн нэр заавал",
              },
            ]}
          >
            <NewInput placeholder="Хэмжих нэгжийн нэр" />
          </Form.Item>
          <Form.Item
            label="Богино нэр"
            name="shortName"
            rules={[
              {
                required: true,
                message: "Богино нэр заавал",
              },
            ]}
          >
            <NewInput onChange={checkDuplicate} placeholder="Богино нэр" />
          </Form.Item>
          <Form.Item
            label="Бүлэг"
            name="type"
            rules={[
              {
                required: true,
                message: "Бүлэг",
              },
            ]}
          >
            <NewSelect
              placeholder="Бүлэг"
              options={[
                {
                  label: "Тооны хэмжих нэгж",
                  value: MeasurementType.Quantity,
                },
                {
                  label: "Уртын хэмжих нэгж",
                  value: MeasurementType.Length,
                },
                {
                  label: "Эзлэхүүн хэмжих нэгж",
                  value: MeasurementType.Volume,
                },
                {
                  label: "Талбайн хэмжих нэгж",
                  value: MeasurementType.Area,
                },
                {
                  label: "Цаг хугацааны хэмжих нэгж",
                  value: MeasurementType.Time,
                },
                {
                  label: "Хүндийн хэмжих нэгж",
                  value: MeasurementType.Weight,
                },
                {
                  label: "Тусгай хэмжих нэгж",
                  value: MeasurementType.Other,
                },
              ]}
            />
          </Form.Item>
        </Form>
      </NewModal>
    </>
  );
};
export default UnitOfMeasure;

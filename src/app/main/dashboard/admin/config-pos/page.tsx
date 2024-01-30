"use client";

import ColumnSettings from "@/components/columnSettings";
import { EmployeeSelect } from "@/components/employee-select";
import Filtered from "@/components/filtered";
import { NewFilterSelect, NewInput, NewSwitch } from "@/components/input";
import NewModal from "@/components/modal";
import { NewTable } from "@/components/table";
import { findIndexInColumnSettings, onCloseFilterTag } from "@/feature/common";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import { DataIndexType, Meta } from "@/service/entities";
import {
  FilteredColumnsPos,
  ICreatePos,
  IDataPos,
  IFilterPos,
  IParamPos,
} from "@/service/pos/entities";
import { PosService } from "@/service/pos/service";
import {
  IDataWarehouse,
  IParamWarehouse,
} from "@/service/reference/warehouse/entities";
import { WarehouseService } from "@/service/reference/warehouse/service";
import { Button, Col, Form, Row, Space, Typography } from "antd";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";

const { Title } = Typography;
const ConfigPos = () => {
  const blockContext: BlockView = useContext(BlockContext);
  const [form] = Form.useForm<ICreatePos>();
  const [data, setData] = useState<IDataPos[]>([]);
  const [filters, setFilters] = useState<IFilterPos>();
  const [params, setParams] = useState<IParamPos>({
    page: 1,
    limit: 10,
    isAuth: false,
    filters: [],
  });
  const [meta, setMeta] = useState<Meta>({ page: 1, limit: 10 });
  const [isModal, setIsModal] = useState<boolean>(false);
  const [isFilterToggle, setIsFilterToggle] = useState<boolean>(false);
  const [selectedPos, setSelectedPos] = useState<IDataPos>();
  const [warehouses, setWarehouses] = useState<IDataWarehouse[]>([]);
  const [columns, setColumns] = useState<FilteredColumnsPos>({
    ids: {
      label: "Посын код",
      isView: true,
      isFiltered: false,
      dataIndex: ["id"],
      type: DataIndexType.MULTI,
    },
    names: {
      label: "Посын нэр",
      isView: true,
      isFiltered: false,
      dataIndex: ["name"],
      type: DataIndexType.MULTI,
    },
    warehouseCodes: {
      label: "Байршлын код",
      isView: true,
      isFiltered: false,
      dataIndex: ["warehouse", "code"],
      type: DataIndexType.MULTI,
    },
    warehouseNames: {
      label: "Байршил",
      isView: true,
      isFiltered: false,
      dataIndex: ["warehouse", "name"],
      type: DataIndexType.MULTI,
    },
    warehouseAddress: {
      label: "Хаягийн мэдээлэл",
      isView: true,
      isFiltered: false,
      dataIndex: ["warehouse", "address"],
      type: DataIndexType.MULTI,
    },
    // warehouseLogos: {
    //   label: "Лого",
    //   isView: true,
    //   isFiltered: false,
    //   dataIndex: ["warehouse", "image"],
    //   type: DataIndexType.MULTI,
    // },
    isActive: {
      label: "Төлөв",
      isView: true,
      isFiltered: false,
      dataIndex: ["isActive"],
      type: DataIndexType.BOOLEAN_STRING,
    },
    createdAt: {
      label: "Үүсгэсэн огноо",
      isView: true,
      isFiltered: false,
      dataIndex: ["createdAt"],
      type: DataIndexType.DATE,
    },
  });
  const getData = async (params: IParamPos) => {
    await PosService.get(params).then((response) => {
      if (response.success) {
        setData(response.response.data);
        setMeta(response.response.meta);
        // setFilters(response.response.filter);
      }
    });
  };
  const getWareshouse = async (params: IParamWarehouse) => {
    await WarehouseService.get(params).then((response) => {
      if (response.success) {
        setWarehouses(response.response.data);
      }
    });
  };
  const onFinish = async (values: ICreatePos) => {
    blockContext.block();
    if (selectedPos) {
      await PosService.patch(selectedPos.id, values)
        .then((response) => {
          if (response.success) {
            getData(params);
            setIsModal(false);
          }
        })
        .finally(() => blockContext.unblock());
    } else {
      await PosService.post(values)
        .then((response) => {
          if (response.success) {
            getData(params);
            setIsModal(false);
          }
        })
        .finally(() => blockContext.unblock());
    }
  };
  const onDelete = async (id: number) => {
    blockContext.block();
    await PosService.remove(id)
      .then((response) => {
        if (response.success) {
          getData(params);
        }
      })
      .finally(() => blockContext.unblock());
  };
  useEffect(() => {
    getData(params);
    getWareshouse({});
  }, []);
  return (
    <>
      <Row style={{ paddingTop: 12 }} gutter={[12, 24]}>
        <Col md={24} lg={16} xl={19}>
          <Space size={24}>
            <Title level={3}>Админ / POS-ын тохиргоо</Title>
            <Button
              type="primary"
              onClick={() => {
                form.resetFields();
                setSelectedPos(undefined);
                setIsModal(true);
              }}
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
        <Col span={isFilterToggle ? 20 : 24}>
          <div className="information">
            <div className="second-header">
              <Filtered columns={columns} />
              <div className="extra">
                <ColumnSettings
                  columns={columns}
                  columnIndexes={(arg1, arg2) =>
                    findIndexInColumnSettings({
                      newRowIndexes: arg1,
                      unSelectedRow: arg2,
                      columns,
                      onColumns: setColumns,
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
                <Image
                  onClick={() => setIsFilterToggle(!isFilterToggle)}
                  src={
                    isFilterToggle
                      ? "/images/filterTrue.svg"
                      : "/images/filterFalse.svg"
                  }
                  width={24}
                  height={24}
                  alt="filter"
                />
              </div>
            </div>
            <NewTable
              scroll={{ x: 1000 }}
              rowKey="id"
              doubleClick={true}
              data={data}
              meta={meta}
              columns={columns}
              onColumns={setColumns}
              incomeFilters={filters}
              isEdit
              onEdit={(row: IDataPos) => {
                form.resetFields();
                setSelectedPos(row);
                form.setFieldsValue({
                  warehouseId: row.warehouseId,
                  name: row.name,
                  password: row.password,
                  employeeIds: row.employees.map((item) => item.id),
                });
                setIsModal(true);
              }}
              isDelete
              onDelete={onDelete}
            />
          </div>
        </Col>
      </Row>
      <NewModal
        title={"POS-ын тохиргоо"}
        open={isModal}
        onCancel={() => setIsModal(false)}
        onOk={() =>
          form.validateFields().then((values) => {
            onFinish(values);
          })
        }
      >
        <Form form={form} layout="vertical" initialValues={{ isActive: true }}>
          <Form.Item label="Байршил" name={"warehouseId"}>
            <NewFilterSelect
              options={warehouses.map((item) => ({
                value: item.id,
                label: item.name,
              }))}
            />
          </Form.Item>
          <Form.Item label="Нэр" name={"name"}>
            <NewInput />
          </Form.Item>
          <Form.Item label="Нууц үг" name={"password"}>
            <NewInput />
          </Form.Item>
          <Form.Item
            label="Идэвхтэй эсэх"
            name={"isActive"}
            valuePropName="checked"
          >
            <NewSwitch />
          </Form.Item>
          <Form.Item label="Кассчид" name={"employeeIds"}>
            <EmployeeSelect
              form={form}
              rules={[]}
              name="employeeIds"
              query={{ isTreasure: true }}
              isMultiple
            />
          </Form.Item>
        </Form>
      </NewModal>
    </>
  );
};
export default ConfigPos;

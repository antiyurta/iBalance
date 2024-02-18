"use client";
import ColumnSettings from "@/components/columnSettings";
import Filtered from "@/components/table/filtered";
import { NewFilterSelect, NewInput, NewSwitch } from "@/components/input";
import NewModal from "@/components/modal";
import { NewTable } from "@/components/table";
import { findIndexInColumnSettings } from "@/feature/common";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import {
  EmployeeType,
  FilteredColumnsEmployee,
  IDataEmployee,
  IParamEmployee,
} from "@/service/employee/entities";
import { EmployeeService } from "@/service/employee/service";
import { DataIndexType, Meta } from "@/service/entities";
import { IDataRole, IParamRole } from "@/service/permission/role/entities";
import { RoleService } from "@/service/permission/role/service";
import { Button, Col, Form, Row, Space, Typography } from "antd";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import PageTitle from "@/components/page-title";
const { Title } = Typography;
const Users = () => {
  const [columns, setColumns] = useState<FilteredColumnsEmployee>({
    email: {
      label: "Мэйл",
      isView: true,
      isFiltered: false,
      dataIndex: ["email"],
      type: DataIndexType.MULTI,
    },
    lastName: {
      label: "Овог",
      isView: true,
      isFiltered: false,
      dataIndex: ["lastName"],
      type: DataIndexType.MULTI,
    },
    firstName: {
      label: "Нэр",
      isView: true,
      isFiltered: false,
      dataIndex: ["firstName"],
      type: DataIndexType.MULTI,
    },
    phoneNo: {
      label: "Утасны дугаар",
      isView: true,
      isFiltered: false,
      dataIndex: ["phoneNo"],
      type: DataIndexType.MULTI,
    },
    warehouseRoleId: {
      label: "Чиг үүрэг",
      isView: true,
      isFiltered: false,
      dataIndex: ["warehouseRole", "name"],
      type: DataIndexType.MULTI,
    },
    isTreasure: {
      label: "Нярав эсэх",
      isView: true,
      isFiltered: false,
      dataIndex: ["isTreasure"],
      type: DataIndexType.BOOLEAN,
    },
    isCashier: {
      label: "Кассчин эсэх",
      isView: true,
      isFiltered: false,
      dataIndex: ["isCashier"],
      type: DataIndexType.BOOLEAN,
    },
    createdAt: {
      label: "Үүсгэсэн огноо",
      isView: true,
      isFiltered: false,
      dataIndex: ["createdAt"],
      type: DataIndexType.DATE,
    },
  });
  const blockContext: BlockView = useContext(BlockContext);
  const [form] = Form.useForm<IDataEmployee>();
  const [data, setData] = useState<IDataEmployee[]>([]);
  const [meta, setMeta] = useState<Meta>({ page: 1, limit: 10 });
  const [isFilterToggle, setIsFilterToggle] = useState<boolean>(false);
  const [isAddModal, setIsAddModal] = useState<boolean>(false);
  const [selectedEmployee, setSelectedEmployee] = useState<IDataEmployee>();
  const [roles, setRoles] = useState<IDataRole[]>([]);

  const getData = async (params?: IParamEmployee) => {
    await EmployeeService.get(params).then((response) => {
      if (response.success) {
        setData(response.response.data);
        setMeta(response.response.meta);
      }
    });
  };
  const getRole = async (params?: IParamRole) => {
    await RoleService.get(params).then((response) => {
      if (response.success) {
        setRoles(response.response.data);
      }
    });
  };
  const edit = async (employee: IDataEmployee) => {
    form.resetFields();
    setSelectedEmployee(employee);
    employee && form.setFieldsValue(employee);
    setIsAddModal(true);
  };
  const onFinish = async (values: IDataEmployee) => {
    values.type = EmployeeType.NOT_MEDICAL;
    values.homeAddress = "";
    values.isWorking = true;
    values.dateInEmployment = new Date();
    blockContext.block();
    if (selectedEmployee) {
      await EmployeeService.patch(selectedEmployee.id, values)
        .then((response) => {
          if (response.success) {
            getData();
          }
        })
        .finally(() => {
          setIsAddModal(false);
          blockContext.unblock();
        });
    } else {
      await EmployeeService.post(values)
        .then((response) => {
          if (response.success) {
            getData();
          }
        })
        .finally(() => {
          setIsAddModal(false);
          blockContext.unblock();
        });
    }
  };
  useEffect(() => {
    getData();
    getRole();
  }, []);
  return (
    <>
      <PageTitle
        onClick={() => {
          form.resetFields();
          setSelectedEmployee(undefined);
          setIsAddModal(true);
        }}
      />
      <Row style={{ paddingTop: 12 }} gutter={[12, 24]}>
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
              incomeFilters={undefined}
              isEdit
              onEdit={(row: IDataEmployee) => edit(row)}
            />
          </div>
        </Col>
      </Row>
      <NewModal
        title={"Хэрэглэгчийн бүртгэл"}
        open={isAddModal}
        onCancel={() => setIsAddModal(false)}
        onOk={() =>
          form.validateFields().then((values) => {
            onFinish(values);
          })
        }
      >
        <Form form={form} layout="vertical">
          <Form.Item label="И-мэйл" name={"email"}>
            <NewInput />
          </Form.Item>
          <Form.Item label="РД" name={"registerNumber"}>
            <NewInput />
          </Form.Item>
          <Form.Item label="Овог" name={"lastName"}>
            <NewInput />
          </Form.Item>
          <Form.Item label="Нэр" name={"firstName"}>
            <NewInput />
          </Form.Item>
          <Form.Item label="Утас" name={"phoneNo"}>
            <NewInput />
          </Form.Item>
          <Form.Item label="Чиг үүрэг" name={"warehouseRoleId"}>
            <NewFilterSelect
              options={roles.map((item) => ({
                value: item.id,
                label: item.name,
              }))}
            />
          </Form.Item>
          <Form.Item
            label="Нярав эсэх"
            name={"isTreasure"}
            valuePropName="checked"
          >
            <NewSwitch />
          </Form.Item>
          <Form.Item
            label="Кассчин эсэх"
            name={"isCashier"}
            valuePropName="checked"
          >
            <NewSwitch />
          </Form.Item>
        </Form>
      </NewModal>
    </>
  );
};
export default Users;

"use client";
import ColumnSettings from "@/components/columnSettings";
import Filtered from "@/components/filtered";
import { NewDatePicker, NewInput, NewSelect } from "@/components/input";
import NewModal from "@/components/modal";
import { NewTable } from "@/components/table";
import { findIndexInColumnSettings, onCloseFilterTag } from "@/feature/common";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import {
  FilteredColumnsUser,
  IFilterUser,
  IParamUser,
  IUser,
  JobPosition,
} from "@/service/authentication/entities";
import { authService } from "@/service/authentication/service";
import { EmployeeType, IDataEmployee } from "@/service/employee/entities";
import { EmployeeService } from "@/service/employee/service";
import { DataIndexType, Meta } from "@/service/entities";
import { Button, Col, Form, Row, Space, Typography } from "antd";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
const { Title } = Typography;
const Users = () => {
  const [columns, setColumns] = useState<FilteredColumnsUser>({
    email: {
      label: "Мэйл",
      isView: true,
      isFiltered: false,
      dataIndex: "email",
      type: DataIndexType.MULTI,
    },
    lastName: {
      label: "Овог",
      isView: true,
      isFiltered: false,
      dataIndex: "lastName",
      type: DataIndexType.MULTI,
    },
    firstName: {
      label: "Нэр",
      isView: true,
      isFiltered: false,
      dataIndex: "firstName",
      type: DataIndexType.MULTI,
    },
    phonoNo: {
      label: "Утасны дугаар",
      isView: true,
      isFiltered: false,
      dataIndex: "phonoNo",
      type: DataIndexType.MULTI,
    },
    hospitalId: {
      label: "Байгууллага",
      isView: true,
      isFiltered: false,
      dataIndex: ["hospital", "name"],
      type: DataIndexType.MULTI,
    },
    createdAt: {
      label: "Үүсгэсэн огноо",
      isView: true,
      isFiltered: false,
      dataIndex: "createdAt",
      type: DataIndexType.DATE,
    },
    isActive: {
      label: "Идэвхтэй ",
      isView: true,
      isFiltered: false,
      dataIndex: "isActive",
      type: DataIndexType.BOOLEAN_STRING,
    },
    jobPosition: {
      label: "Албан тушаал",
      isView: true,
      isFiltered: false,
      dataIndex: "jobPosition",
      type: DataIndexType.ENUM,
    },
  });
  const blockContext: BlockView = useContext(BlockContext);
  const [form] = Form.useForm<IDataEmployee>();
  const [data, setData] = useState<IUser[]>([]);
  const [filters, setFilters] = useState<IFilterUser>();
  const [params, setParams] = useState<IParamUser>({ page: 1, limit: 10 });
  const [meta, setMeta] = useState<Meta>({ page: 1, limit: 10 });
  const [isFilterToggle, setIsFilterToggle] = useState<boolean>(false);
  const [isAddModal, setIsAddModal] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<IUser>();
  const getData = async (params: IParamUser) => {
    await authService.getUsers(params).then((response) => {
      if (response.success) {
        setData(response.response.data);
        setMeta(response.response.meta);
        setFilters(response.response.filter);
      }
    });
  };
  const edit = async (id: number) => {
    blockContext.block();
    form.resetFields();
    authService
      .getUserById(id)
      .then((response) => {
        if (response.success) {
          setSelectedUser(response.response);
        }
      })
      .then(() => {
        selectedUser?.employee && form.setFieldsValue(selectedUser.employee);
      })
      .finally(() => {
        setIsAddModal(true);
        blockContext.unblock();
      });
  };
  const onFinish = async (values: IDataEmployee) => {
    values.type = EmployeeType.NOT_MEDICAL;
    values.homeAddress = "";
    values.isWorking = true;
    values.dateInEmployment = new Date();
    blockContext.block();
    if (selectedUser && selectedUser.employee) {
      await EmployeeService.patch(selectedUser.employee.id, values)
        .then((response) => {
          if (response.success) {
            getData(params);
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
            getData(params);
          }
        })
        .finally(() => {
          setIsAddModal(false);
          blockContext.unblock();
        });
    }
  };
  useEffect(() => {
    getData(params);
  }, []);
  return (
    <>
      <Row style={{ paddingTop: 12 }} gutter={[12, 24]}>
        <Col md={24} lg={16} xl={19}>
          <Space size={24}>
            <Title level={3}>Админ / Хэрэглэгчийн бүртгэл</Title>
            <Button
              type="primary"
              onClick={() => {
                form.resetFields();
                setSelectedUser(undefined);
                setIsAddModal(true);
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
              <Filtered
                columns={columns}
                isActive={(key, state) => {
                  onCloseFilterTag({
                    key: key,
                    state: state,
                    column: columns,
                    onColumn: setColumns,
                    params: params,
                    onParams: setParams,
                  });
                  getData(params);
                }}
              />
              <div className="extra">
                <ColumnSettings
                  columns={columns}
                  columnIndexes={(arg1, arg2) =>
                    findIndexInColumnSettings({
                      newRowIndexes: arg1,
                      unSelectedRow: arg2,
                      columns,
                      onColumns: setColumns,
                      params,
                      onParams: (params) => setParams(params),
                      getData,
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
              onChange={getData}
              onColumns={setColumns}
              newParams={params}
              onParams={setParams}
              incomeFilters={filters}
              isEdit
              onEdit={(row: IUser) => edit(row.id)}
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
          <Form.Item label="Албан тушаал" name={"jobPosition"}>
            <NewSelect
              options={[
                { value: JobPosition.Employee, label: "Ажилтан" },
                { value: JobPosition.Treasure, label: "Нярав" },
                { value: JobPosition.Cashier, label: "Кассчин" },
              ]}
            />
          </Form.Item>
        </Form>
      </NewModal>
    </>
  );
};
export default Users;

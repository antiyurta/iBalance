import Image from "next/image";
import { FilteredColumnsUser, IFilterUser, IParamUser, IUser } from "@/service/authentication/entities";
import { authService } from "@/service/authentication/service";
import { FormInstance, Space } from "antd";
import { Rule } from "antd/es/form";
import { useEffect, useState } from "react";
import { Form } from "antd/lib";
import { NewFilterSelect } from "./input";
import NewModal from "./modal";
import { NewTable } from "./table";
import { DataIndexType, Meta } from "@/service/entities";
interface IProps {
  form: FormInstance;
  rules: Rule[];
  /** default => userId */
  name?: string;
}
export const UserSelect = (props: IProps) => {
  const { form, rules, name } = props;
  const [isOpenPopOver, setIsOpenPopOver] = useState<boolean>(false);
  const [users, setUsers] = useState<IUser[]>([]);
  const [filters, setFilters] = useState<IFilterUser>();
  const [params, setParams] = useState<IParamUser>({});
  const [meta, setMeta] = useState<Meta>({ page: 1, limit: 10 });
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
      type: DataIndexType.MULTI,
    },
    isActive: {
        label: "Идэвхтэй ",
        isView: true,
      isFiltered: false,
      dataIndex: "isActive",
      type: DataIndexType.BOOLEAN_STRING,
    }
  });
  const getUsers = async (params: IParamUser) => {
    await authService.getAllUsers(params).then((response) => {
      if (response.success) {
        setUsers(response.response);
      }
    });
  };
  useEffect(() => {
    getUsers({});
  }, []);
  return (
    <>
      <Space.Compact>
        <div className="extraButton" onClick={() => setIsOpenPopOver(true)}>
          <Image
            src="/icons/clipboardBlack.svg"
            width={16}
            height={16}
            alt="clipboard"
          />
        </div>
        <Form.Item name={name ? name : "updatedBy"} rules={rules}>
          <NewFilterSelect
            style={{
              width: "100%",
            }}
            options={users.map((user) => ({
              value: user.id,
              label: `${user.lastName?.substring(0, 1)}. ${user.firstName}`,
            }))}
          />
        </Form.Item>
      </Space.Compact>
      <NewModal
        width={1300}
        title="Хэрэглэгчийн жагсаалт"
        open={isOpenPopOver}
        onCancel={() => setIsOpenPopOver(false)}
      >
        <NewTable
          scroll={{ x: 1400 }}
          rowKey="id"
          doubleClick={true}
          onDClick={(value) => {
            form.setFieldsValue({
              [`${name}`]: value.id,
            });
            setIsOpenPopOver(false);
          }}
          data={users}
          meta={meta}
          columns={columns}
          onChange={(params) => getUsers(params)}
          onColumns={(columns) => setColumns(columns)}
          newParams={params}
          onParams={(params) => setParams(params)}
          incomeFilters={filters}
        />
      </NewModal>
    </>
  );
};

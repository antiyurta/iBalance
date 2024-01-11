import Image from "next/image";
import { FormInstance, Space } from "antd";
import { Rule } from "antd/es/form";
import { useEffect, useState } from "react";
import { Form } from "antd/lib";
import { NewFilterSelect } from "./input";
import NewModal from "./modal";
import { NewTable } from "./table";
import { DataIndexType, Meta } from "@/service/entities";
import {
  FilteredColumnsEmployee,
  IDataEmployee,
  IFilterEmployee,
  IParamEmployee,
} from "@/service/employee/entities";
import { EmployeeService } from "@/service/employee/service";
interface IProps {
  form: FormInstance;
  rules: Rule[];
  name: string;
  query?: { isTreasure?: boolean; isCashier?: boolean };
  isMultiple?: boolean;
  isDisable?: boolean;
}
export const EmployeeSelect = (props: IProps) => {
  const { form, rules, name, query, isMultiple, isDisable } = props;
  const [isOpenPopOver, setIsOpenPopOver] = useState<boolean>(false);
  const [data, setData] = useState<IDataEmployee[]>([]);
  const [filters, setFilters] = useState<IFilterEmployee>();
  const [params, setParams] = useState<IParamEmployee>({
    isTreasure: query?.isTreasure,
    isCashier: query?.isCashier,
  });
  const [meta, setMeta] = useState<Meta>({ page: 1, limit: 10 });
  const [columns, setColumns] = useState<FilteredColumnsEmployee>({
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
    phoneNo: {
      label: "Утасны дугаар",
      isView: true,
      isFiltered: false,
      dataIndex: "phoneNo",
      type: DataIndexType.MULTI,
    },
    createdAt: {
      label: "Үүсгэсэн огноо",
      isView: true,
      isFiltered: false,
      dataIndex: "createdAt",
      type: DataIndexType.MULTI,
    },
  });
  const getEmployee = async (params: IParamEmployee) => {
    await EmployeeService.get(params).then((response) => {
      if (response.success) {
        setData(response.response.data);
        setMeta(response.response.meta);
      }
    });
  };
  useEffect(() => {
    getEmployee(params);
  }, []);
  return (
    <>
      <Space.Compact>
        {isDisable ? null : (
          <div className="extraButton" onClick={() => setIsOpenPopOver(true)}>
            <Image
              src="/icons/clipboardBlack.svg"
              width={16}
              height={16}
              alt="clipboard"
            />
          </div>
        )}
        <Form.Item name={name ? name : "updatedBy"} rules={rules}>
          <NewFilterSelect
            style={{
              width: "100%",
            }}
            mode={isMultiple ? "multiple" : undefined}
            options={data.map((item) => ({
              value: item.id,
              label: `${item.lastName?.substring(0, 1)}. ${item.firstName}`,
            }))}
            disabled={isDisable}
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
            if (isMultiple) {
              const values = form.getFieldValue(name);
              form.setFieldsValue({
                [`${name}`]: [...values, value.id],
              });
            } else {
              form.setFieldsValue({
                [`${name}`]: value.id,
              });
            }
            setIsOpenPopOver(false);
          }}
          data={data}
          meta={meta}
          columns={columns}
          onChange={(params) => getEmployee(params)}
          onColumns={(columns) => setColumns(columns)}
          newParams={params}
          onParams={(params) => setParams(params)}
          incomeFilters={filters}
        />
      </NewModal>
    </>
  );
};

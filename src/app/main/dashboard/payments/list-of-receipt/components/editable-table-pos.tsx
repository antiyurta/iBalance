import { Form, FormInstance, Table } from "antd";
import { Column } from "@/components/table";
import { NewInput, NewInputNumber } from "@/components/input";
import { FormListFieldData } from "antd/lib";
import { useState } from "react";
import { MaterialSelect } from "@/components/material-select";
import { MaterialType } from "@/service/material/entities";
import { IDataDiscount } from "@/service/command/discount/entities";

interface IProps {
  data: FormListFieldData[];
  form: FormInstance;
}
export const EditableTablePos = (props: IProps) => {
  const { data, form } = props;
  return (
    <Table dataSource={data} pagination={false}>
      <Column
        dataIndex={"materialId"}
        title="Дотоод код"
        render={(_, __, index) => (
          <MaterialSelect
            form={form}
            rules={[{ required: true, message: "Дотоод код заавал" }]}
            name={[index, "materialId"]}
            disabled
            params={{ types: [MaterialType.Material] }}
          />
        )}
      />
      <Column
        dataIndex={"name"}
        title="Бараа материалын нэр"
        render={(_, __, index) => (
          <Form.Item name={[index, "material", "name"]}>
            <NewInput disabled />
          </Form.Item>
        )}
      />
      <Column
        dataIndex={"measurement"}
        title="Хэмжих нэгж"
        render={(_, __, index) => (
          <Form.Item name={[index, "material", "measurement", "name"]}>
            <NewInput disabled />
          </Form.Item>
        )}
      />
      <Column
        dataIndex={"countPackage"}
        title="Багц доторх тоо"
        render={(_, __, index) => (
          <Form.Item name={[index, "material", "countPackage"]}>
            <NewInputNumber disabled />
          </Form.Item>
        )}
      />
      <Column
        dataIndex={"quantity"}
        title="Тоо хэмжээ"
        render={(_, __, index) => (
          <Form.Item name={[index, "quantity"]}>
            <NewInputNumber disabled />
          </Form.Item>
        )}
      />
      <Column
        dataIndex={"unitAmount"}
        title="Нэгжийн үнэ"
        render={(_, __, index) => (
          <Form.Item name={[index, "unitAmount"]}>
            <NewInputNumber disabled />
          </Form.Item>
        )}
      />
      <Column
        dataIndex={"unitAmount"}
        title="Дүн"
        render={(_, __, index) => (
          <Form.Item name={[index, "unitAmount"]}>
            <NewInputNumber disabled />
          </Form.Item>
        )}
      />
      <Column
        dataIndex={"discountAmount"}
        title="Бараа материалын үнийн хөнгөлөлт"
        render={(_, __, index) => (
          <Form.Item name={[index, "discountAmount"]}>
            <NewInputNumber disabled suffix="₮" />
          </Form.Item>
        )}
      />
    </Table>
  );
};

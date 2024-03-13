import { NewFilterSelect, NewSelect } from "@/components/input";
import { ISelectValueType } from "@/service/entities";
import { Col, Form, Row, SelectProps } from "antd";
import { FormInstance } from "antd/lib";
import React, { useEffect, useState } from "react";
interface IProps {
  form: FormInstance;
  label: string;
  name: string;
  selectProps: SelectProps;
}
export const NewReportSelect: React.FC<IProps> = ({
  form,
  label,
  name,
  selectProps,
}) => {
  const [type, setType] = useState<ISelectValueType>("all");
  const typeOptions = [
    {
      label: "Бүгд",
      value: "all",
    },
    {
      label: "Тухайн",
      value: "that",
    },
    {
      label: "Сонголтоор",
      value: "selection",
    },
  ];
  useEffect(() => {
    if (type == "all") {
      form.setFieldValue(name, undefined);
    }
  }, [type]);
  return (
    <Row>
      <Col span={4}>{label}</Col>
      <Col span={20} style={{ display: "flex" }}>
        <NewSelect
          onSelect={setType}
          value={type}
          options={typeOptions}
          style={{ width: 150 }}
        />
        <Form.Item name={name} noStyle>
          <NewFilterSelect
            allowClear
            style={{ width: "100%" }}
            {...selectProps}
            showSearch
            disabled={type == "all"}
            mode={type == "selection" ? "multiple" : undefined}
          />
        </Form.Item>
      </Col>
    </Row>
  );
};

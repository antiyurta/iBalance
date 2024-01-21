import { NewFilterSelect, NewSelect } from "@/components/input";
import { ISelectValueType } from "@/service/entities";
import { Col, Form, Row, SelectProps } from "antd";
import React, { useState } from "react";
interface IProps {
  sectionLabel: string;
  sectionName: string;
  sectionSelectProps: SelectProps;
  label: string;
  name: string;
  selectProps: SelectProps;
}
export const NewReportSectionSelect: React.FC<IProps> = ({
  sectionLabel,
  sectionName,
  sectionSelectProps,
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
      label: "Бүлэг",
      value: "section",
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
  return (
    <Row>
      <Col span={4}>{type === "section" ? sectionLabel : label}</Col>
      <Col span={20} style={{ display: "flex" }}>
        <NewSelect
          onSelect={setType}
          value={type}
          options={typeOptions}
          style={{ width: 150 }}
        />
        {type === "section" ? (
          <Form.Item name={sectionName} noStyle>
            <NewFilterSelect
              {...sectionSelectProps}
              style={{ width: "100%" }}
            />
          </Form.Item>
        ) : (
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
        )}
      </Col>
    </Row>
  );
};

import { Form, Space } from "antd";
import { useEffect, useState } from "react";
import { FormInstance } from "antd/lib";
import { Rule } from "antd/es/form";
import {
  IDataTreeSection,
  TreeSectionType,
} from "@/service/reference/tree-section/entities";
import { TreeSectionService } from "@/service/reference/tree-section/service";
import NewTreeSelect from "./tree/tree-select";
interface IProps {
  form: FormInstance;
  rules: Rule[];
  name?: string;
}
export const ConsumerSectionSelect: React.FC<IProps> = ({
  form,
  rules,
  name = "sectionId",
}) => {
  const [sections, setSections] = useState<IDataTreeSection[]>([]);

  const getConsumerSection = async (type: TreeSectionType) => {
    await TreeSectionService.get(type).then((response) => {
      setSections(response.response);
    });
  };
  useEffect(() => {
    getConsumerSection(TreeSectionType.Consumer);
  }, []);
  return (
    <Space.Compact>
      <Form.Item
        style={{
          width: "100%",
        }}
        name={name}
        rules={rules}
      >
        <NewTreeSelect
          sections={sections}
          onChange={(value) => form.setFieldValue(name, value)}
        />
      </Form.Item>
    </Space.Compact>
  );
};

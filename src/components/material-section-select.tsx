import { Form, Popover, Space } from "antd";
import { NewSelect } from "./input";
import { useEffect, useState } from "react";
import { SignalFilled } from "@ant-design/icons";
import { FormInstance } from "antd/lib";
import { Rule } from "antd/es/form";
import NewDirectoryTree from "./tree";
import { MaterialSectionService } from "@/service/material/section/service";
import { IDataMaterialSection } from "@/service/material/section/entities";
import { MaterialType } from "@/service/material/entities";
import NewTreeSelect from "./tree/tree-select";
interface IProps {
  form: FormInstance;
  rules: Rule[];
  /** default => sectionId */
  name?: string;
  isLeaf: boolean;
}

export const MaterialSectionSelect: React.FC<IProps> = ({
  form,
  rules,
  isLeaf,
  name = "sectionId",
}) => {
  const [sections, setSections] = useState<IDataMaterialSection[]>([]);

  const getMaterialSection = async () => {
    await MaterialSectionService.get({
      materialType: MaterialType.Material,
    }).then((response) => {
      setSections(response.response);
    });
  };
  useEffect(() => {
    getMaterialSection();
  }, []);
  return (
    <Space.Compact>
      <Form.Item
        style={{
          width: "100%",
        }}
        name={name ? name : "sectionId"}
        rules={rules}
      >
        <NewTreeSelect
          sections={[]}
          onChange={(value: string) => form.setFieldValue(name, value)}
          disabled={true}
        />
      </Form.Item>
    </Space.Compact>
  );
};

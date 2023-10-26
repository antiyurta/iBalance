import { Form, Popover, Space } from "antd";
import { NewSelect } from "./input";
import { useEffect, useState } from "react";
import { SignalFilled } from "@ant-design/icons";
import { FormInstance } from "antd/lib";
import { Rule } from "antd/es/form";
import NewDirectoryTree from "./directoryTree";
import { MaterialSectionService } from "@/service/material/section/service";
import { IDataMaterialSection } from "@/service/material/section/entities";
interface IProps {
  form: FormInstance;
  rules: Rule[];
  /** default => sectionId */
  name?: string;
}
export const MaterialSectionSelect = (props: IProps) => {
  const { form, rules, name } = props;
  const [isOpenPopOver, setIsOpenPopOver] = useState<boolean>(false);
  const [sections, setSections] = useState<IDataMaterialSection[]>([]);

  const getMaterialSection = async () => {
    await MaterialSectionService.get({}).then((response) => {
      setSections(response.response.data);
    });
  };
  useEffect(() => {
    getMaterialSection();
  }, []);
  return (
    <Space.Compact>
      <div className="extraButton">
        <Popover
          placement="bottom"
          open={isOpenPopOver}
          onOpenChange={(state) => setIsOpenPopOver(state)}
          content={
            <NewDirectoryTree
              data={sections}
              isLeaf={true}
              extra="HALF"
              onClick={(keys, isLeaf) => {
                if (!isLeaf) {
                  setIsOpenPopOver(false);
                  form.setFieldsValue({
                    [name ? `${name}` : "sectionId"]: keys![0],
                  });
                }
              }}
            />
          }
          trigger={"click"}
        >
          <SignalFilled rotate={-90} />
        </Popover>
      </div>
      <Form.Item
        style={{
          width: "100%",
        }}
        name={name ? name : "sectionId"}
        rules={rules}
      >
        <NewSelect
          disabled={true}
          style={{
            width: "100%",
          }}
          options={sections?.map((section: IDataMaterialSection) => ({
            label: section.name,
            value: section.id,
          }))}
        />
      </Form.Item>
    </Space.Compact>
  );
};

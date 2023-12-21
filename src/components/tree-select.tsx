import { FormInstance, Popover, Space } from "antd";
import { Rule } from "antd/es/form";
import { SignalFilled } from "@ant-design/icons";
import { useEffect, useMemo, useState } from "react";
import NewDirectoryTree from "./directoryTree";
import { Form } from "antd/lib";
import { NewSelect } from "./input";
import {
  IDataTreeSection,
  TreeSectionType,
} from "@/service/reference/tree-section/entities";
import { TreeSectionService } from "@/service/reference/tree-section/service";
import Image from "next/image";

interface IProps {
  isLeaf: boolean;
  type: TreeSectionType;
  form: FormInstance;
  rules: Rule[];
  name: string;
}
export const TreeSectionSelect = (props: IProps) => {
  const { isLeaf, type, form, name, rules } = props;
  const [isOpenPopOver, setIsOpenPopOver] = useState<boolean>(false);
  const [sections, setSections] = useState<IDataTreeSection[]>([]);

  const getSections = async (type: TreeSectionType) => {
    await TreeSectionService.get(type).then((response) => {
      if (response.success) {
        setSections(response.response);
      }
    });
  };

  const filteredSections = useMemo(() => {
    if (!isLeaf) {
      return sections?.map((section) => ({
        label: section.name,
        value: section.id,
      }));
    }
    return sections
      ?.filter((section) => !section.isExpand)
      .map((section) => ({
        label: section.name,
        value: section.id,
      }));
  }, [sections]);

  useEffect(() => {
    getSections(type);
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
              extra="HALF"
              isLeaf={isLeaf}
              onClick={(keys, isLeaf) => {
                console.log(keys);
                if (!isLeaf) {
                  setIsOpenPopOver(false);
                  form.setFieldsValue({
                    [`${name}`]: keys![0],
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
      <Form.Item name={name} rules={rules}>
        <NewSelect options={filteredSections} />
      </Form.Item>
    </Space.Compact>
  );
};

import { FormInstance, Popover, Space } from "antd";
import { Rule } from "antd/es/form";
import { SignalFilled } from "@ant-design/icons";
import { useEffect, useState } from "react";
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
  type: TreeSectionType;
  form: FormInstance;
  rules: Rule[];
  name: string;
}
export const TreeSectionSelect = (props: IProps) => {
  const { type, form, name, rules } = props;
  const [isOpenPopOver, setIsOpenPopOver] = useState<boolean>(false);
  const [sections, setSections] = useState<IDataTreeSection[]>([]);

  const getSections = async (type: TreeSectionType) => {
    await TreeSectionService.get(type).then((response) => {
      if (response.success) {
        setSections(response.response);
      }
    });
  };
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
              isLeaf={false}
              onClick={(keys, isLeaf) => {
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
        <NewSelect
          options={sections
            ?.filter((section) => !section.isExpand)
            ?.map((section) => ({
              label: section.name,
              value: section.id,
            }))}
        />
      </Form.Item>
      <div
        style={{
          marginLeft: 4,
        }}
        className="app-button-square"
        //   onClick={() => setIsOpenModalBrand(true)}
      >
        <Image src={"/icons/plusGray.svg"} height={18} width={18} alt="plus" />
      </div>
    </Space.Compact>
  );
};

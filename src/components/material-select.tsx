import Image from "next/image";
import { Form, Space } from "antd";
import { NewFilterSelect } from "./input";
import { useEffect, useState } from "react";
import NewModal from "./modal";
import { FormInstance } from "antd/lib";
import { Rule } from "antd/es/form";
import { IDataMaterial, IParamMaterial } from "@/service/material/entities";
import { MaterialService } from "@/service/material/service";
import InventoriesRegistration from "@/app/main/dashboard/registration/inventory/inventories-registration/inventoriesRegistration";
interface IProps {
  form: FormInstance;
  rules: Rule[];
  /** default => materialId */
  name?: string;
}
export const MaterialSelect = (props: IProps) => {
  const { form, name, rules } = props;
  const [isOpenPopOver, setIsOpenPopOver] = useState<boolean>(false);
  const [materials, setMaterials] = useState<IDataMaterial[]>([]);
  const getMaterials = async (params: IParamMaterial) => {
    await MaterialService.get(params).then((response) => {
      if (response.success) {
        setMaterials(response.response.data);
      }
    });
  };
  useEffect(() => {
    getMaterials({});
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
        <Form.Item name={name ? name : "materialId"} rules={rules}>
          <NewFilterSelect
            style={{
              width: "100%",
            }}
            options={materials.map((material) => ({
              value: material.id,
              label: `${material.code} - ${material.name}`,
            }))}
          />
        </Form.Item>
      </Space.Compact>
      <NewModal
        width={1300}
        title="Барааны жагсаалт"
        open={isOpenPopOver}
        onCancel={() => setIsOpenPopOver(false)}
      >
        <InventoriesRegistration
          ComponentType="MIDDLE"
          onClickModal={(row: IDataMaterial) => {
            form.setFieldsValue({
              [name ? `${name}` : "materialId"]: row.id,
            });
            setIsOpenPopOver(false);
          }}
        />
      </NewModal>
    </>
  );
};

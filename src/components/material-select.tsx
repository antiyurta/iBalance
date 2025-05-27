import Image from "next/image";
import { Form, Space } from "antd";
import { NewFilterSelect } from "./input";
import { CSSProperties, useEffect, useState } from "react";
import NewModal from "./modal";
import { FormInstance } from "antd/lib";
import { Rule } from "antd/es/form";
import {
  IDataMaterial,
  IParamMaterial,
  MaterialType,
} from "@/service/material/entities";
import InventoriesRegistration from "@/app/main/dashboard/registration/inventory/inventories-registration/inventoriesRegistration";
import { fieldValue } from "@/feature/common";
import { IDataViewMaterial } from "@/service/material/view-material/entities";
import { MaterialService } from "@/service/material/service";

interface IProps {
  form: FormInstance;
  params: IParamMaterial;
  rules: Rule[];
  name: string | (string | number)[];
  listName?: string;
  disabled?: boolean;
  onClear?: () => void;
  onSelect?: (value: IDataMaterial) => void;
}

export const MaterialSelect = (props: IProps) => {
  const { form, params, name, rules, listName, disabled, onClear, onSelect } =
    props;
  const [isOpenPopOver, setIsOpenPopOver] = useState<boolean>(false);
  const [materials, setMaterials] = useState<IDataMaterial[]>([]);
  const [viewMaterialDictionary, setViewMaterialDictionary] =
    useState<Map<number, IDataMaterial>>();
  const getViewMaterials = async (params: IParamMaterial) => {
    await MaterialService.get(params).then((response) => {
      if (response.success) {
        setMaterials(response.response.data);
      }
    });
  };

  useEffect(() => {
    if (params) {
      getViewMaterials(params);
    }
  }, []);
  useEffect(() => {
    return setViewMaterialDictionary(
      materials.reduce((dict, material) => {
        dict.set(material.id, material);
        return dict;
      }, new Map<number, IDataMaterial>())
    );
  }, [materials]);
  return (
    <>
      <Space.Compact>
        {!disabled ? (
          <div className="extraButton" onClick={() => setIsOpenPopOver(true)}>
            <Image
              src="/icons/clipboardBlack.svg"
              width={16}
              height={16}
              alt="clipboard"
            />
          </div>
        ) : null}
        <Form.Item name={name ? name : "materialId"} rules={rules}>
          <NewFilterSelect
            style={{ minWidth: 150, width: "100%" }}
            options={materials.map((material) => ({
              value: material.id,
              label: `${material.code} - ${material.name}`,
            }))}
            onClear={onClear}
            disabled={disabled}
            onSelect={(id) => {
              const material = viewMaterialDictionary?.get(id);
              if (material) onSelect?.(material);
            }}
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
            if (listName) {
              form.setFieldsValue(fieldValue([listName, ...name], row.id));
            } else {
              form.setFieldsValue(fieldValue([name.toString()], row.id));
            }
            const material = viewMaterialDictionary?.get(row.id);
            if (material) onSelect?.(material);
            setIsOpenPopOver(false);
          }}
          materialType={MaterialType.Material}
        />
      </NewModal>
    </>
  );
};

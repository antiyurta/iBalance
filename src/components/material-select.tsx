import Image from "next/image";
import { Form, Space } from "antd";
import { NewFilterSelect } from "./input";
import { useEffect, useState } from "react";
import NewModal from "./modal";
import { FormInstance, SelectProps } from "antd/lib";
import { Rule } from "antd/es/form";
import {
  IDataMaterial,
  IParamMaterial,
  MaterialType,
} from "@/service/material/entities";
import { MaterialService } from "@/service/material/service";
import InventoriesRegistration from "@/app/main/dashboard/registration/inventory/inventories-registration/inventoriesRegistration";
import { fieldValue } from "@/feature/common";
import {
  IDataViewMaterial,
  IParamViewMaterial,
} from "@/service/material/view-material/entities";
import { ViewMaterialService } from "@/service/material/view-material/service";

interface IProps {
  materialTypes: MaterialType[];
  form: FormInstance;
  rules: Rule[];
  name: string | (string | number)[];
  listName?: string;
  disabled?: boolean;
  onClear?: () => void;
  onSelect?: (value: IDataViewMaterial) => void;
}

export const MaterialSelect = (props: IProps) => {
  const {
    materialTypes,
    form,
    name,
    rules,
    listName,
    disabled,
    onClear,
    onSelect,
  } = props;
  const [isOpenPopOver, setIsOpenPopOver] = useState<boolean>(false);
  const [viewMaterials, setViewMaterials] = useState<IDataViewMaterial[]>([]);
  const [viewMaterialDictionary, setViewMaterialDictionary] =
    useState<Map<number, IDataViewMaterial>>();
  const getViewMaterials = async (params: IParamViewMaterial) => {
    await ViewMaterialService.get(params).then((response) => {
      if (response.success) {
        setViewMaterials(response.response.data);
      }
    });
  };

  useEffect(() => {
    getViewMaterials({ types: materialTypes });
  }, []);
  useEffect(() => {
    setViewMaterialDictionary(
      viewMaterials.reduce((dict, material) => {
        dict.set(material.id, material);
        return dict;
      }, new Map<number, IDataViewMaterial>())
    );
  }, [viewMaterials]);
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
            style={{
              width: "100%",
            }}
            options={viewMaterials.map((material) => ({
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
          materialTypes={materialTypes}
        />
      </NewModal>
    </>
  );
};

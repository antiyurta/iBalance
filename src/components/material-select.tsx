import Image from "next/image";
import { Form, Space } from "antd";
import { NewFilterSelect } from "./input";
import { useEffect, useMemo, useState } from "react";
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
  const [loading, setLoading] = useState<boolean>(false);
  const [materials, setMaterials] = useState<IDataMaterial[]>([]);
  const [viewMaterialDictionary, setViewMaterialDictionary] =
    useState<Map<number, IDataMaterial>>();
  const getViewMaterials = async (params: IParamMaterial) => {
    try {
      setLoading(true);
      const result = await MaterialService.get(params);
      if (result.success) {
        setMaterials(result.response.data);
      }
    } catch (error) {
      console.log("material selection error =>", error);
    } finally {
      setLoading(false);
    }
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
      }, new Map<number, IDataMaterial>()),
    );
  }, [materials]);

  const options = useMemo(() => {
    return materials.map((material) => ({
      value: material.id,
      label: `${material.code} - ${material.name}`,
    }));
  }, [materials]);

  const handleSearch = async (value: string) => {
    await getViewMaterials({
      page: 1,
      limit: 10,
      orderParam: ["createdAt"],
      order: "DESC",
      filters: [
        {
          dataIndex: ["code"],
          operator: "CONTAINS",
          filter: value,
        },
      ],
    });
  };

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
        <pre>{JSON.stringify(options, null, 2)}</pre>
        <Form.Item name={name ? name : "materialId"} rules={rules}>
          <NewFilterSelect
            style={{ minWidth: 150, width: "100%" }}
            options={options}
            onClear={onClear}
            loading={loading}
            optionFilterProp="label"
            onSearch={handleSearch}
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

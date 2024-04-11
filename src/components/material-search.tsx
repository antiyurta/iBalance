import { NewFilterSelect, NewInput, NewInputNumber } from "@/components/input";
import { openNofi } from "@/feature/common";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import { MaterialService } from "@/service/material/service";
import {
  IDataViewMaterial,
  IParamViewMaterial,
} from "@/service/material/view-material/entities";
import { ViewMaterialService } from "@/service/material/view-material/service";
import {
  BarcodeOutlined,
  QrcodeOutlined,
  BarsOutlined,
} from "@ant-design/icons";
import { Button, Tooltip } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { KeyboardEvent, useContext, useEffect, useState } from "react";
type CodeType = "CODE" | "NAME" | "BARCODE";
interface IProps {
  isDisable: boolean;
  params: IParamViewMaterial;
  materialId?: number;
  isEdit?: boolean;
  onMaterial: (value?: IDataViewMaterial) => void;
  warehouseId?: number;
  documentAt?: Dayjs;
}
const MaterialSearch: React.FC<IProps> = ({
  isDisable,
  params,
  onMaterial,
  materialId,
  isEdit,
  warehouseId,
  documentAt = dayjs(),
}) => {
  const blockContext: BlockView = useContext(BlockContext);
  const [type, setType] = useState<CodeType>("BARCODE");
  const [code, setCode] = useState<string>();
  const [barcode, setBarcode] = useState<string>();
  const [name, setName] = useState<string>();
  const [materials, setMaterials] = useState<IDataViewMaterial[]>([]);

  const getBlock = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.ctrlKey && (event.key === "j" || event.key === "р")) {
      event.preventDefault();
    }
  };
  const getMaterial = async () => {
    blockContext.block();
    if (type == "BARCODE") {
      params.barCode = barcode;
    }
    if (type == "CODE") {
      params.code = code;
    }
    if (type == "NAME") {
      params.name = name;
    }
    if (warehouseId) {
      params.warehouseId = warehouseId;
    }
    params.documentAt = documentAt;
    if (!isEdit) {
      setBarcode(undefined);
      setCode(undefined);
    }
    await ViewMaterialService.get(params)
      .then((response) => {
        if (response.success) {
          if (type == "NAME") {
            setMaterials(response.response.data);
          } else if (response.response.data.length > 0) {
            onMaterial(response.response.data[0]);
          } else {
            blockContext.unblock();
            openNofi("warning", "Бараа олдсонгүй!");
            return;
          }
        }
      })
      .finally(() => {
        params.barCode = undefined;
        params.code = undefined;
        params.name = undefined;
        blockContext.unblock();
      });
  };
  const getType = (
    type: CodeType
  ): { icon: React.ReactNode; label: string } => {
    if (type == "NAME") return { icon: <BarsOutlined />, label: "Нэр" };
    else if (type == "BARCODE")
      return { icon: <BarcodeOutlined />, label: "Баркод" };
    else return { icon: <QrcodeOutlined />, label: "Дотоод код" };
  };
  const onSelect = (id: number) => {
    const currentIndex = materials.findIndex((item) => item.id == id);
    if (currentIndex > -1) onMaterial(materials[currentIndex]);
  };
  const getMaterialById = (materialId: number) => {
    ViewMaterialService.getById(materialId, warehouseId)
      .then((response) => {
        if (response.success) {
          setBarcode(response.response.barCode);
          onMaterial(response.response);
        }
      })
      .finally();
  };
  useEffect(() => {
    materialId && getMaterialById(materialId);
  }, [materialId]);
  return (
    <div style={{ display: "flex" }}>
      <Tooltip title={getType(type).label}>
        <Button
          type="default"
          icon={getType(type).icon}
          disabled={isDisable}
          onClick={() =>
            setType(
              type === "BARCODE" ? "CODE" : type === "CODE" ? "NAME" : "BARCODE"
            )
          }
        />
      </Tooltip>
      {type == "CODE" && (
        <NewInput
          style={{ width: "100%" }}
          placeholder={"Дотоод код оруулна уу."}
          value={code}
          disabled={isDisable}
          onChange={(e) => setCode(e.target.value)}
          onPressEnter={() => getMaterial()}
        />
      )}
      {type == "BARCODE" && (
        <NewInputNumber
          style={{ width: "100%" }}
          placeholder={"Баркод оруулна уу."}
          value={barcode}
          disabled={isDisable}
          onChange={(e) => setBarcode(e as string)}
          onPressEnter={() => getMaterial()}
          onKeyDown={getBlock}
        />
      )}
      {type == "NAME" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
            width: "100%",
          }}
        >
          <NewInput
            style={{ width: "100%" }}
            placeholder={"Нэр оруулна уу."}
            value={name}
            disabled={isDisable}
            onChange={(e) => setName(e.target.value)}
            onPressEnter={() => getMaterial()}
          />
          <NewFilterSelect
            style={{ width: "100%" }}
            options={materials.map((item) => ({
              value: item.id,
              label: item.name,
            }))}
            disabled={isDisable}
            onSelect={onSelect}
          />
        </div>
      )}
    </div>
  );
};
export default MaterialSearch;

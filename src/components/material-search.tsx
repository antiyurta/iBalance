import { NewFilterSelect, NewInput, NewInputNumber } from "@/components/input";
import { getFile, openNofi } from "@/feature/common";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import { useTypedSelector } from "@/feature/store/reducer";
import { saveGoods } from "@/feature/store/slice/point-of-sale/goods.slice";
import { AppDispatch } from "@/feature/store/store";
import { MaterialType } from "@/service/material/entities";
import {
  IDataViewMaterial,
  IParamViewMaterial,
} from "@/service/material/view-material/entities";
import { ViewMaterialService } from "@/service/material/view-material/service";
import { IGoods } from "@/service/pos/entities";
import {
  BarcodeOutlined,
  QrcodeOutlined,
  BarsOutlined,
} from "@ant-design/icons";
import { Button, Tooltip } from "antd";
import {
  Dispatch,
  KeyboardEvent,
  SetStateAction,
  useContext,
  useState,
} from "react";
type CodeType = "CODE" | "NAME" | "BARCODE";
interface IProps {
  params: IParamViewMaterial;
  onMaterial: (value?: IDataViewMaterial) => void;
}
const MaterialSearch: React.FC<IProps> = ({ onMaterial, params }) => {
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
      .finally(() => blockContext.unblock());
    setBarcode(undefined);
    setCode(undefined);
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
  return (
    <div style={{ display: "flex" }}>
      <Tooltip title={getType(type).label}>
        <Button
          type="default"
          icon={getType(type).icon}
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
          onChange={(e) => setCode(e.target.value)}
          onPressEnter={() => getMaterial()}
        />
      )}
      {type == "BARCODE" && (
        <NewInputNumber
          style={{ width: "100%" }}
          placeholder={"Баркод оруулна уу."}
          value={barcode}
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
            onChange={(e) => setName(e.target.value)}
            onPressEnter={() => getMaterial()}
          />
          <NewFilterSelect
            style={{ width: "100%" }}
            options={materials.map((item) => ({
              value: item.id,
              label: item.name,
            }))}
            onSelect={onSelect}
          />
        </div>
      )}
    </div>
  );
};
export default MaterialSearch;

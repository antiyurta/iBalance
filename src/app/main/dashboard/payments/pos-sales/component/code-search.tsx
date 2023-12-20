import { NewFilterSelect, NewInput, NewSelect } from "@/components/input";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import { usePaymentGroupContext } from "@/feature/context/PaymentGroupContext";
import { MaterialType } from "@/service/material/entities";
import {
  IDataViewMaterial,
  IParamViewMaterial,
} from "@/service/material/view-material/entities";
import { ViewMaterialService } from "@/service/material/view-material/service";
import { CreateGoodsDto } from "@/service/pos/shopping-card/goods/entites";
import { ShoppingGoodsService } from "@/service/pos/shopping-card/goods/service";
import { BarcodeOutlined, QrcodeOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useContext, useEffect, useState } from "react";
interface IProps {}
export const CodeSearch = () => {
  const blockContext: BlockView = useContext(BlockContext);
  const [isCode, setIsCode] = useState<boolean>(false);
  const { setReload } = usePaymentGroupContext();
  const [materials, setMaterials] = useState<IDataViewMaterial[]>([]);
  const getMaterials = (params: IParamViewMaterial) => {
    ViewMaterialService.get(params).then((response) => {
      if (response.success) {
        setMaterials(response.response.data);
      }
    });
  };
  useEffect(() => {
    getMaterials({
      types: [MaterialType.Material],
      moreUnitAmount: 0,
    });
  }, []);
  const insertGoods = async (data: CreateGoodsDto) => {
    blockContext.block();
    await ShoppingGoodsService.post(data).finally(() => {
        setReload(true);
        blockContext.unblock();
    });
  };
  return (
    <div style={{ display: "flex", background: "white" }}>
      <Button
        type="link"
        icon={isCode ? <QrcodeOutlined /> : <BarcodeOutlined />}
        onClick={() => setIsCode(!isCode)}
      />
      <NewFilterSelect
        style={{ width: "100%" }}
        onSelect={(id) => insertGoods({ materialId: id })}
        options={materials.map((material) => ({
          value: material.id,
          label: `${material.code}-${material.barCode}-${material.name}`,
        }))}
      />
    </div>
  );
};

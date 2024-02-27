import { NewInputNumber } from "@/components/input";
import { getFile, openNofi } from "@/feature/common";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import { usePaymentGroupContext } from "@/feature/context/PaymentGroupContext";
import { useTypedSelector } from "@/feature/store/reducer";
import { saveGoods } from "@/feature/store/slice/point-of-sale/goods.slice";
import { AppDispatch } from "@/feature/store/store";
import { Operator } from "@/service/entities";
import { MaterialType } from "@/service/material/entities";
import { MaterialService } from "@/service/material/service";
import { ViewMaterialService } from "@/service/material/view-material/service";
import { IGoods } from "@/service/pos/entities";
import { BarcodeOutlined, QrcodeOutlined } from "@ant-design/icons";
import { Button, Space, Tooltip } from "antd";
import { KeyboardEvent, useContext, useState } from "react";
import { useDispatch } from "react-redux";
export const CodeSearch = () => {
  const blockContext: BlockView = useContext(BlockContext);
  const dispatch = useDispatch<AppDispatch>();
  const goods = useTypedSelector((state) => state.shoppingGoods);
  const [isCode, setIsCode] = useState<boolean>(false);
  const [barcode, setBarcode] = useState<string>("");
  const getBlock = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.ctrlKey && (event.key === "j" || event.key === "р")) {
      event.preventDefault();
    }
  };
  const getMaterial = async () => {
    blockContext.block();
    const material = await ViewMaterialService.get({
      barCode: barcode,
      types: [MaterialType.Material],
    })
      .then((response) => {
        if (!response.success) blockContext.unblock();
        if (response.success && response.response.data.length > 0) {
          return response.response.data[0];
        } else {
          blockContext.unblock();
          openNofi("warning", "Бараа олдсонгүй!");
          return;
        }
      })
      .finally(() => blockContext.unblock());
    if (material) {
      const currentIndex = goods.findIndex(
        (item) => item.materialId == material.id
      );
      const currentGoods: IGoods = {
        materialId: material.id,
        materialName: material.name,
        imageUrl: material.fileId
          ? await getFile(material.fileId)
          : "/images/emptyMarket.png",
        sectionName: material.sectionName,
        unitAmount: material.unitAmount,
        quantity: 1,
        discountAmount: 0,
        payAmount: material.unitAmount,
        totalAmount: material.unitAmount,
      };
      if (currentIndex !== -1) {
        currentGoods.quantity = goods[currentIndex].quantity + 1;
        currentGoods.payAmount =
          goods[currentIndex].unitAmount * (goods[currentIndex].quantity + 1);
      }
      dispatch(saveGoods(currentGoods));
    }
    setBarcode("");
  };
  return (
    <div style={{ display: "flex" }}>
      <Tooltip title={isCode ? "Дотоод код" : "Баркод"}>
        <Button
          type="default"
          icon={isCode ? <QrcodeOutlined /> : <BarcodeOutlined />}
          onClick={() => setIsCode(!isCode)}
        />
      </Tooltip>
      <NewInputNumber
        style={{ width: "100%" }}
        placeholder={isCode ? "Дотоод код" : "Баркод"}
        value={barcode}
        onChange={(e) => setBarcode(e as string)}
        onKeyDown={getBlock}
        onPressEnter={() => getMaterial()}
      />
    </div>
  );
};

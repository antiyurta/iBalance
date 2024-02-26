import { NewInputNumber } from "@/components/input";
import { openNofi } from "@/feature/common";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import { usePaymentGroupContext } from "@/feature/context/PaymentGroupContext";
import { Operator } from "@/service/entities";
import { MaterialService } from "@/service/material/service";
import { ShoppingGoodsService } from "@/service/pos/shopping-card/goods/service";
import { BarcodeOutlined, QrcodeOutlined } from "@ant-design/icons";
import { Button, Space, Tooltip } from "antd";
import { KeyboardEvent, useContext, useState } from "react";
export const CodeSearch = () => {
  const blockContext: BlockView = useContext(BlockContext);
  const [isCode, setIsCode] = useState<boolean>(false);
  const [barcode, setBarcode] = useState<string>("");
  const { isReload, setReload } = usePaymentGroupContext();
  const getBlock = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.ctrlKey && (event.key === "j" || event.key === "р")) {
      event.preventDefault();
    }
  };
  const getMaterial = async () => {
    blockContext.block();
    const material = await MaterialService.get({
      filters: [
        { dataIndex: ["barCode"], operator: Operator.Equals, filter: barcode },
      ],
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
      await ShoppingGoodsService.post({
        materialId: material.id,
        quantity: 1,
      }).finally(() => {
        setReload(!isReload);
        blockContext.unblock();
      });
    }
    setBarcode("");
  };
  return (
    <Space>
      <Tooltip title={isCode ? "Дотоод код" : "Баркод"}>
        <Button
          type="default"
          icon={isCode ? <QrcodeOutlined /> : <BarcodeOutlined />}
          onClick={() => setIsCode(!isCode)}
        />
      </Tooltip>
      <NewInputNumber
        style={{ width: "100%" }}
        value={barcode}
        onChange={(e) => setBarcode(e as string)}
        onKeyDown={getBlock}
        onPressEnter={() => getMaterial()}
      />
    </Space>
  );
};

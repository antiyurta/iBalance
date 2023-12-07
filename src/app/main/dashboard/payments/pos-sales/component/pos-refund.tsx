import { NewInputNumber, NewSwitch, NewTextArea } from "@/components/input";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import { IDataShoppingCart } from "@/service/pos/shopping-card/entities";
import { Button, Form } from "antd";
import { useContext, useState } from "react";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import { ICreatePosRefund } from "@/service/pos/refund/entities";
import { PosRefundService } from "@/service/pos/refund/service";
import { openNofi } from "@/feature/common";
interface IProps {
  shoppingCart?: IDataShoppingCart;
  onSave?: (state: boolean) => void;
}
const PosRefund = (props: IProps) => {
  const { shoppingCart, onSave } = props;
  const blockContext: BlockView = useContext(BlockContext);
  const [isHide, setIsHide] = useState<boolean>(false);
  const [refundForm] = Form.useForm();
  const onFinish = (values: ICreatePosRefund) => {
    if (!shoppingCart) {
      openNofi("warning", "Баримт сонгогдоогүй байна.");
    } else {
      blockContext.block();
      PosRefundService.post({
        shoppingCartId: shoppingCart.id,
        description: values.description,
        amount: values.amount,
      })
        .then((response) => {
          if (response.success) {
            onSave?.(true);
          }
        })
        .finally(() => blockContext.unblock());
    }
  };
  return (
    <Form layout="vertical" form={refundForm} onFinish={onFinish}>
      <Form.Item
        label="Буцаалтын шалтгаан"
        name="description"
        rules={[{ required: true, message: "Заавал" }]}
      >
        <NewTextArea />
      </Form.Item>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2,1fr)",
          gap: 12,
          padding: 5,
        }}
      >
        <Form.Item
          label="Төлбөрийг бэлнээр буцааж өгсөн эсэх"
          valuePropName="checked"
          name={"isCash"}
        >
          <NewSwitch />
        </Form.Item>
        <Form.Item label="Буцаалт олгосон дүн" name={"amount"}>
          <NewInputNumber />
        </Form.Item>
        <Form.Item label="Татварын ДДТД" name={"billId"}>
          <NewInputNumber />
        </Form.Item>
        <Form.Item label="Баримтын огноо" name={"documentAt"}>
          <NewInputNumber />
        </Form.Item>
        <Form.Item label="И-баримтын төлөв" name={"isEbarimt"}>
          <NewInputNumber />
        </Form.Item>
        <Form.Item label="И-баримт руу илгээх дүн" name={"paidAmount"}>
          <NewInputNumber />
        </Form.Item>
        <Form.Item label="Нийт дүн" name={"paidAmount"} hidden={isHide}>
          <NewInputNumber />
        </Form.Item>
        <Form.Item
          label="Харилцагчийн хөнгөлөлт"
          name={"paidAmount"}
          hidden={isHide}
        >
          <NewInputNumber />
        </Form.Item>
        <Form.Item
          label="Бараа материалын үнийн хөнгөлөлт"
          name={"paidAmount"}
          hidden={isHide}
        >
          <NewInputNumber />
        </Form.Item>
        <Form.Item label="Төлөх дүн" name={"paidAmount"} hidden={isHide}>
          <NewInputNumber />
        </Form.Item>
        <Form.Item label="Төлсөн дүн" name={"paidAmount"} hidden={isHide}>
          <NewInputNumber />
        </Form.Item>
        <Form.Item label="Ашигласан огноо" name={"paidAmount"} hidden={isHide}>
          <NewInputNumber />
        </Form.Item>
        <Form.Item label="Бэлгийн карт" name={"paidAmount"} hidden={isHide}>
          <NewInputNumber />
        </Form.Item>
      </div>
      <Button
        style={{ width: "100%" }}
        icon={isHide ? <DownOutlined /> : <UpOutlined />}
        onClick={() => {
          setIsHide(!isHide);
        }}
      />
      <Button style={{ width: "100%" }} htmlType="submit" type="primary" danger>
        Буцаалт хийх
      </Button>
    </Form>
  );
};
export default PosRefund;

import { NewInputNumber, NewSwitch, NewTextArea } from "@/components/input";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import { Button, Form } from "antd";
import { useContext, useEffect, useState } from "react";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import { openNofi } from "@/feature/common";
import { IDataDocument } from "@/service/document/entities";
import { DocumentService } from "@/service/document/service";
interface IProps {
  posDocument?: IDataDocument;
  onSave?: (state: boolean) => void;
}
const PosRefund = (props: IProps) => {
  const { posDocument, onSave } = props;
  const blockContext: BlockView = useContext(BlockContext);
  const [isHide, setIsHide] = useState<boolean>(false);
  const [refundForm] = Form.useForm();
  const onFinish = () => {
    if (!posDocument) {
      openNofi("warning", "Баримт сонгогдоогүй байна.");
    } else {
      blockContext.block();
      DocumentService.removePosDocument(
        posDocument.id,
        refundForm.getFieldValue("description")
      )
        .then((response) => {
          if (response.success) {
            onSave?.(false);
          }
        })
        .finally(() => blockContext.unblock());
    }
  };
  useEffect(() => {
    refundForm.setFieldsValue({
      amount: posDocument?.amount,
      billId: posDocument?.billId,
      documentAt: posDocument?.documentAt,
      paidAmount: 0,
      discountAmount: posDocument?.discountAmount,
      consumerDiscountAmount: posDocument?.consumerDiscountAmount,
    });
  }, [posDocument]);
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
          <NewInputNumber disabled />
        </Form.Item>
        <Form.Item label="Татварын ДДТД" name={"billId"}>
          <NewInputNumber disabled />
        </Form.Item>
        <Form.Item label="Баримтын огноо" name={"documentAt"}>
          <NewInputNumber disabled />
        </Form.Item>
        <Form.Item label="И-баримтын төлөв" name={"isEbarimt"}>
          <NewInputNumber disabled />
        </Form.Item>
        <Form.Item label="И-баримт руу илгээх дүн" name={"paidAmount"}>
          <NewInputNumber disabled />
        </Form.Item>
        <Form.Item label="Нийт дүн" name={"paidAmount"} hidden={isHide}>
          <NewInputNumber disabled />
        </Form.Item>
        <Form.Item
          label="Харилцагчийн хөнгөлөлт"
          name={"consumerDiscountAmount"}
          hidden={isHide}
        >
          <NewInputNumber disabled />
        </Form.Item>
        <Form.Item
          label="Бараа материалын үнийн хөнгөлөлт"
          name={"discountAmount"}
          hidden={isHide}
        >
          <NewInputNumber disabled />
        </Form.Item>
        <Form.Item label="Төлөх дүн" name={"paidAmount"} hidden={isHide}>
          <NewInputNumber disabled />
        </Form.Item>
        <Form.Item label="Төлсөн дүн" name={"paidAmount"} hidden={isHide}>
          <NewInputNumber disabled />
        </Form.Item>
        <Form.Item label="Ашигласан огноо" name={"paidAmount"} hidden={isHide}>
          <NewInputNumber disabled />
        </Form.Item>
        <Form.Item label="Бэлгийн карт" name={"paidAmount"} hidden={isHide}>
          <NewInputNumber disabled />
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

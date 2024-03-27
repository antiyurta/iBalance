import { NewInput } from "@/components/input";
import NewModal from "@/components/modal";
import { openNofi } from "@/feature/common";
import { IDataMerchantInfo } from "@/service/ebarimt/entities";
import { EbarimtService } from "@/service/ebarimt/service";
import {
  LeftOutlined,
  PrinterOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { Button, Form, Space, Typography } from "antd";
import React, { useContext, useEffect, useState } from "react";
import Bill from "./Step3/Bill";
import { DocumentService } from "@/service/document/service";
import { MovingStatus } from "@/service/document/entities";
import { useTypedSelector } from "@/feature/store/reducer";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/feature/store/store";
import { prevStep } from "@/feature/store/slice/point-of-sale/shopping-cart.slice";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import { usePaymentContext } from "@/feature/context/PaymentGroupContext";
import { PosDocumentService } from "@/service/document/pos-document/service";
import { IDataPosDocument } from "@/service/document/pos-document/entites";

const { Title } = Typography;

type TaxType = "PERSON" | "BUSINESS";

const Step3: React.FC = () => {
  const blockContext: BlockView = useContext(BlockContext);
  const dispatch = useDispatch<AppDispatch>();
  const warehouse = useTypedSelector((state) => state.warehouse);
  const posOpenClose = useTypedSelector((state) => state.posOpenClose);
  const { invoices } = useTypedSelector((state) => state.shoppingCart);
  const goods = useTypedSelector((state) => state.shoppingGoods);
  const { paidAmount } = usePaymentContext();
  const [form] = Form.useForm();
  const [isActiveTaxType, setIsActiveTaxType] = useState<TaxType>("PERSON");
  const [merchantInfo, setMerchantInfo] = useState<
    IDataMerchantInfo | undefined
  >();
  const [isBill, setIsBill] = useState<boolean>(false);
  const [posDocument, setPosDocument] = useState<IDataPosDocument>();
  const regno = Form.useWatch("regno", form);
  const getInfo = async (values: { regno: number }) => {
    await EbarimtService.getOrganizationInfo(values.regno).then((response) => {
      if (response.response.status) {
        setMerchantInfo(response.response.result);
      } else {
        openNofi("error", response.response.message);
        setMerchantInfo(undefined);
      }
    });
  };
  const saveDocument = async () => {
    let code = "";
    blockContext.block();
    await DocumentService.generateCode({ movingStatus: MovingStatus.Pos }).then(
      (response) => {
        if (response.success) {
          code = response.response;
        }
      }
    );
    const res = await PosDocumentService.post({
      regno,
      code,
      warehouseId: warehouse.id,
      openCloseId: posOpenClose.id,
      invoices: invoices.map((item) => ({
        type: item.type,
        paymentMethodName: item.methodName,
        incomeAmount: item.incomeAmount,
        expenseAmount: item.expenseAmount,
      })),
      transactions: goods.map((item) => ({
        materialId: item.materialId,
        unitAmount: item.unitAmount,
        discountAmount: item.discountAmount,
        expenseQty: item.quantity,
        amount: item.payAmount,
        totalAmount: item.payAmount,
      })),
    });
    if (res.success) {
      await PosDocumentService.getById(res.response.id)
        .then((response) => {
          if (response.success) {
            setPosDocument(response.response);
          }
        })
        .finally(() => {
          blockContext.unblock();
          setIsBill(true);
        });
    }
  };
  useEffect(() => {
    if (isActiveTaxType === "PERSON") {
      form.resetFields();
      setMerchantInfo(undefined);
    }
  }, [isActiveTaxType]);
  return (
    <>
      <div className="step-tax">
        <div className="tax-type">
          <button
            className={
              isActiveTaxType === "PERSON" ? "app-button" : "app-button-regular"
            }
            style={{
              height: 55,
              fontSize: 16,
              fontWeight: 500,
            }}
            onClick={() => setIsActiveTaxType("PERSON")}
          >
            Хувь хүнд
          </button>
          <button
            className={
              isActiveTaxType === "BUSINESS"
                ? "app-button"
                : "app-button-regular"
            }
            style={{
              height: 55,
              fontSize: 16,
              fontWeight: 500,
            }}
            onClick={() => setIsActiveTaxType("BUSINESS")}
          >
            Бизнэсийн үйл ажиллагаанд
          </button>
        </div>
        {isActiveTaxType === "BUSINESS" ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 12,
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <Title level={3}>Регистрийн дугаар:</Title>
              </div>
              <div>
                <Form form={form}>
                  <Form.Item>
                    <Space.Compact>
                      <Form.Item
                        name="regno"
                        rules={[
                          {
                            required: true,
                            message: "Байгууллагын регистр оруулна уу.",
                          },
                        ]}
                      >
                        <NewInput />
                      </Form.Item>
                      <Button
                        style={{
                          height: 36,
                        }}
                        onClick={() => form.validateFields().then(getInfo)}
                        icon={<RightOutlined />}
                      />
                    </Space.Compact>
                  </Form.Item>
                </Form>
              </div>
            </div>
            {merchantInfo ? (
              <div
                style={{
                  padding: 12,
                  background: "#f5f5f5",
                  borderRadius: 12,
                  textAlign: "center",
                }}
              >
                <Title
                  level={4}
                  style={{
                    color: "black",
                  }}
                >
                  {merchantInfo?.name}
                </Title>
              </div>
            ) : null}
          </div>
        ) : null}
        <div className="numbers">
          <Title level={3} type="secondary">
            Төлсөн дүн
          </Title>
          <Title level={3} type="secondary">
            {paidAmount}
          </Title>
        </div>
        <div className="numbers">
          <Title level={3} type="secondary">
            Ибаримт руу илгээх дүн:
          </Title>
          <Title level={3} type="secondary">
            {paidAmount}
          </Title>
        </div>
        <Title
          level={3}
          style={{
            alignSelf: "center",
          }}
        >
          НӨАТ: {"0.00"}
        </Title>
        <Title
          level={3}
          style={{
            alignSelf: "center",
          }}
        >
          НХАТ: 0.00
        </Title>
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            gap: 12,
          }}
        >
          <Button
            onClick={() => dispatch(prevStep())}
            icon={<LeftOutlined />}
          />
          <Button
            htmlType="submit"
            type="primary"
            style={{
              width: "100%",
            }}
            onClick={() => {
              saveDocument();
            }}
            icon={<PrinterOutlined />}
          >
            Баримт хэвлэх
          </Button>
        </div>
      </div>
      {posDocument && (
        <Bill isBill={isBill} setIsBill={setIsBill} posDocument={posDocument} />
      )}
    </>
  );
};
export default Step3;

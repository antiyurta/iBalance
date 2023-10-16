import { NewDatePicker, NewInput, NewInputNumber } from "@/components/input";
import NewModal from "@/components/modal";
import { Button, Col, Form, Row, Space } from "antd";
import dayjs from "dayjs";
import { useContext, useEffect, useState } from "react";
import EditableTable from "./editableTable";
import { ReferenceService } from "@/service/reference/reference";
import { IDataReference, IType } from "@/service/reference/entity";
import { IDataPosOpener } from "@/service/pos/opener/entities";
import { OpenerService } from "@/service/pos/opener/service";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import { useRouter } from "next/navigation";

const OpenState = () => {
  const [form] = Form.useForm();
  const router = useRouter();
  const [moneyForm] = Form.useForm();
  const today = dayjs(new Date());
  const blockContext: BlockView = useContext(BlockContext); // uildeliig blockloh
  const [isBankNote, setIsBankNote] = useState<boolean>(false);
  const [isOpenMoneyListModal, setIsOpenMoneyListModal] =
    useState<boolean>(false);
  const [moneyType, setMoneyType] = useState<IDataReference[]>();
  const getMoneyTypes = async (type: IType) => {
    await ReferenceService.get({
      type: type,
    }).then((response) => {
      const data = response.response.data;
      const sorted = data
        .sort((a, b) => {
          return Number(a.name) - Number(b.name);
        })
        .reverse();
      setMoneyType(sorted);
    });
  };
  // form defualt values
  const setDefualtValues = () => {
    moneyForm.setFieldsValue({
      moneys: moneyType?.map((type) => ({
        sectionMoneyId: type.id,
        quantity: 0,
        amount: 0,
      })),
    });
  };
  const onFinish = async (values: IDataPosOpener) => {
    blockContext.block();
    values.isBankNote = isBankNote;
    values.posBankNotes = moneyForm.getFieldValue("moneys");
    await OpenerService.post(values)
      .then((response) => {
        if (response.success) {
          router.push("/main/dashboard/payments/pos-sales");
        }
      })
      .finally(() => {
        blockContext.unblock();
      });
  };
  useEffect(() => {
    getMoneyTypes(IType.MONEY);
  }, []);
  useEffect(() => {
    setDefualtValues();
  }, [moneyType]);
  return (
    <>
      <Row
        style={{
          width: "100%",
          margin: "auto",
        }}
      >
        <Col
          style={{
            margin: "auto",
          }}
          span={4}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
              date: today,
              amount: 0,
              ppasword: "",
            }}
          >
            <Space
              style={{
                width: "100%",
              }}
              direction="vertical"
              size={12}
            >
              <Form.Item
                label="Нээлт хийх өдөр"
                name="date"
                rules={[
                  {
                    required: true,
                    message: "sadsa",
                  },
                ]}
              >
                <NewDatePicker
                  style={{
                    width: "100%",
                  }}
                />
              </Form.Item>
              <Form.Item label="Эхлэх мөнгө">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 12,
                    justifyContent: "space-between",
                  }}
                >
                  <Form.Item name="amount">
                    <NewInputNumber
                      style={{
                        alignItems: "center",
                        width: "100%",
                        height: 39,
                      }}
                      prefix="₮"
                      formatter={(value: any) =>
                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      parser={(value: any) => value.replace(/\$\s?|(,*)/g, "")}
                    />
                  </Form.Item>
                  <Button onClick={() => setIsOpenMoneyListModal(true)}>
                    Дэвсгэрт
                  </Button>
                </div>
              </Form.Item>
              <Form.Item label="Нууц үг" name="ppasword">
                <NewInput type="password" />
              </Form.Item>
              <Form.Item>
                <Button
                  style={{
                    width: "100%",
                  }}
                  type="primary"
                  htmlType="submit"
                >
                  Өдрийн нээлт хийх
                </Button>
              </Form.Item>
            </Space>
          </Form>
        </Col>
      </Row>
      <NewModal
        title=" "
        width={450}
        open={isOpenMoneyListModal}
        onCancel={() => setIsOpenMoneyListModal(false)}
        footer={[
          <Button
            key="submit"
            style={{
              width: "58%",
            }}
            type="primary"
            onClick={() =>
              moneyForm.validateFields().then((values) => {
                setIsBankNote(true);
                form.setFieldsValue({
                  amount: values.moneys.reduce(
                    (total: number, current: IDataPosOpener) => {
                      return total + current.amount;
                    },
                    0
                  ),
                });
                setIsOpenMoneyListModal(false);
              })
            }
          >
            Хадгалах
          </Button>,
          <Button
            key="reset"
            style={{
              width: "20%",
            }}
            onClick={setDefualtValues}
          >
            Цэвэрлэх
          </Button>,
          <Button
            key="back"
            style={{
              width: "20%",
            }}
            onClick={() => setIsOpenMoneyListModal(false)}
          >
            Хаах
          </Button>,
        ]}
        maskClosable={false}
      >
        <Form form={moneyForm}>
          <Form.List name="moneys">
            {(moneys, { add, remove }) => (
              <EditableTable
                data={moneys}
                moneyType={moneyType}
                form={moneyForm}
                add={add}
                remove={remove}
              />
            )}
          </Form.List>
        </Form>
      </NewModal>
    </>
  );
};
export default OpenState;

import {
  NewDatePicker,
  NewInput,
  NewInputNumber,
  NewSelect,
} from "@/components/input";
import NewModal from "@/components/modal";
import { Button, Col, Form, Row, Space } from "antd";
import dayjs from "dayjs";
import { useContext, useEffect, useState } from "react";
import EditableTable from "./editableTable";
import { ReferenceService } from "@/service/reference/reference";
import { IDataReference, IType } from "@/service/reference/entity";
import { IDataPosOpenClose } from "@/service/pos/open-close/entities";
import { OpenCloseService } from "@/service/pos/open-close/service";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import { useRouter } from "next/navigation";
import { NumericFormat } from "react-number-format";
import { IDataPosBankNote } from "@/service/pos/open-close/bank-note/entities";
import { IDataPos, IParamPos } from "@/service/pos/entities";
import { PosService } from "@/service/pos/service";
import { useTypedSelector } from "@/feature/store/reducer";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/feature/store/store";
import { setPosOpenClose } from "@/feature/store/slice/pos-open-close.slice";
import { openNofi } from "@/feature/common";

const OpenState = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [form] = Form.useForm();
  const router = useRouter();
  const [moneyForm] = Form.useForm();
  const today = dayjs(new Date());
  const warehouse = useTypedSelector((state) => state.warehouse);
  const blockContext: BlockView = useContext(BlockContext); // uildeliig blockloh
  const [isOpenMoneyListModal, setIsOpenMoneyListModal] =
    useState<boolean>(false);
  const [moneyType, setMoneyType] = useState<IDataReference[]>([]);
  const [listPos, setListPos] = useState<IDataPos[]>([]);
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
  const onFinish = async (values: IDataPosOpenClose) => {
    blockContext.block();
    await OpenCloseService.get({ isClose: false, posId: values.posId }).then(
      async (response) => {
        if (response.success && response.response.data.length > 0) {
          const { firstName } = response.response.data[0].openerEmployee;
          openNofi("warning", `${firstName}-ажилтан дээр пос нээлттэй байна.`);
          blockContext.unblock();
        } else {
          values.posBankNotes = [...moneyForm.getFieldValue("moneys")];
          await OpenCloseService.postOpen(values)
            .then((response) => {
              if (response.success) {
                dispatch(setPosOpenClose(response.response));
                router.push("/main/dashboard/payments/pos-sales");
              }
            })
            .finally(() => {
              blockContext.unblock();
            });
        }
      }
    );
  };
  const getPos = async (params: IParamPos) => {
    PosService.get(params).then((response) => {
      if (response.success) {
        setListPos(response.response.data);
      }
    });
  };
  useEffect(() => {
    getMoneyTypes(IType.MONEY);
    getPos({ warehouseId: warehouse.id, isAuth: true });
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
            autoCapitalize="off"
            autoComplete="off"
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
                label="Нээх пос"
                name="posId"
                rules={[
                  {
                    required: true,
                    message: "Заавал",
                  },
                ]}
              >
                <NewSelect
                  options={listPos.map((pos) => ({
                    value: pos.id,
                    label: pos.name,
                  }))}
                />
              </Form.Item>
              <Form.Item
                label="Нээлт хийх өдөр"
                name="openerAt"
                rules={[
                  {
                    required: true,
                    message: "Заавал",
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
                  <Form.Item name="openerAmount">
                    <NewInputNumber />
                  </Form.Item>
                  <Button onClick={() => setIsOpenMoneyListModal(true)}>
                    Дэвсгэрт
                  </Button>
                </div>
              </Form.Item>
              <Form.Item label="Нууц үг" name="password">
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
                form.setFieldsValue({
                  openerAmount: values.moneys.reduce(
                    (total: number, current: IDataPosBankNote) => {
                      return total + current.amount;
                    },
                    0
                  ),
                  posBankNotes: values,
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

import { NewDatePicker, NewInput, NewInputNumber } from "@/components/input";
import NewModal from "@/components/modal";
import { Button, Col, Form, Row, Space, Table } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import EditableTable from "./editableTable";
import { ReferenceService } from "@/service/reference/reference";
import { IDataReference, IType } from "@/service/reference/entity";

const OpenState = () => {
  const [form] = Form.useForm();
  const [moneyForm] = Form.useForm();
  const today = dayjs(new Date());
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
        id: type.id,
        count: 0,
        total: 0,
      })),
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
            paddingTop: 150,
          }}
          span={4}
        >
          <Form
            layout="vertical"
            initialValues={{
              date: today,
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
                <Space
                  style={{
                    width: "100%",
                  }}
                  direction="horizontal"
                  size={8}
                >
                  <Form.Item
                    name="startMoney"
                    style={{
                      width: "100%",
                    }}
                  >
                    <NewInputNumber />
                  </Form.Item>
                  <Button onClick={() => setIsOpenMoneyListModal(true)}>
                    Тоолох
                  </Button>
                </Space>
              </Form.Item>
              <Form.Item label="Нууц үг" name="ppasword">
                <NewInput type="password" />
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
                console.log(values);
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

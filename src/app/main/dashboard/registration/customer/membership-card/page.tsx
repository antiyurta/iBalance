"use client";

import {
  Button,
  Col,
  Form,
  Input,
  Popover,
  Row,
  Space,
  Tabs,
  Typography,
} from "antd";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";

import CustomerList from "./customerList";
import DescriptionList from "./descriptionList";
import NewModal from "@/components/modal";
import {
  NewInput,
  NewInputNumber,
  NewSelect,
  NewSwitch,
  NewTextArea,
} from "@/components/input";
import EditableTableCard from "./editableTableCard";
import { IDataConsumer, IParamConsumer } from "@/service/consumer/entities";
import { ConsumerService } from "@/service/consumer/service";
import {
  IInputConsumerMembership,
  IResponseConsumerMembership,
} from "@/service/consumer/membership/entities";
import { ConsumerMembershipService } from "@/service/consumer/membership/service";
import { WarehouseService } from "@/service/reference/warehouse/service";
import { IDataWarehouse } from "@/service/reference/warehouse/entities";
import { MembershipService } from "@/service/reference/membership/service";
import {
  IDataMembership,
  IInputMembership,
} from "@/service/reference/membership/entities";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import dayjs from "dayjs";
import Information from "../information/information";
import CardList from "./cardList";
import { NumericFormat } from "react-number-format";
import { hasUniqueValues } from "@/feature/common";

const { Title } = Typography;
const MembershipCard = () => {
  const [form] = Form.useForm();
  const [formMembership] = Form.useForm();
  const [isReloadList, setIsReloadList] = useState<boolean>(false);
  const [isReloadCardList, setIsReloadCardList] = useState<boolean>(false);
  const blockContext: BlockView = useContext(BlockContext); // uildeliig blockloh
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isEditMembership, setIsEditMembership] = useState<boolean>(false);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [isOpenModalCard, setIsOpenModalCard] = useState<boolean>(false);
  const [isOpenPopOver, setIsOpenPopOver] = useState<boolean>(false);
  const [isSave, setIsSave] = useState<boolean>(false);
  //
  const [consumers, setConsumers] = useState<IDataConsumer[]>([]);
  const [warehouses, setWarehouses] = useState<IDataWarehouse[]>([]);
  const [consumerDictionary, setConsumerDictionary] =
    useState<Map<number, IDataConsumer>>();
  const [memberships, setMemberships] = useState<IDataMembership[]>([]);
  const [membership, setMembership] = useState<IDataMembership>();

  // modal neeh edit uu esvel new uu ??
  const items = [
    {
      label: "Харилцагчийн жагсаалт",
      key: "item-1",
      children: (
        <CustomerList
          onReload={isReloadList}
          onEdit={(row) => openModal(true, row)}
          onDelete={(id) => {
            onDeleteConsumer(id);
          }}
        />
      ),
    },
    {
      label: "Дэлгэрэнгүй жагсаалт",
      key: "item-2",
      children: (
        <DescriptionList
          onReload={isReloadList}
          onEdit={(row) => openModal(true, row)}
        />
      ),
    },
    {
      label: "Карт эрхийн бичгийн жагсаалт",
      key: "item-3",
      children: (
        <CardList
          onReload={isReloadCardList}
          onEdit={(row) => openModalCard(true, row)}
          onDelete={(id) => onDeleteMembership(id)}
        />
      ),
    },
  ];
  //

  const openModal = (state: boolean, consumer?: IDataConsumer) => {
    setIsReloadList(false);
    form.resetFields();
    getMemberships();
    if (state && consumer) {
      const data: IInputConsumerMembership = {
        consumerId: consumer.id,
        cards: consumer.memberships.map((card) => ({
          ...card,
          endAt: dayjs(card.endAt),
          name: card.membership.name,
        })),
      };
      consumerFormField(consumer.id);
      form.setFieldsValue(data);
    }
    setIsEdit(state);
    setIsOpenModal(true);
  };
  const openModalCard = (state: boolean, membership?: IDataMembership) => {
    formMembership.resetFields();
    setIsEditMembership(state);
    if (state && membership) {
      formMembership.setFieldsValue(membership);
      setMembership(membership);
    }
    setIsEdit(state);
    setIsOpenModalCard(true);
    setIsReloadCardList(!isReloadCardList);
  };
  const getConsumers = async (params: IParamConsumer) => {
    await ConsumerService.get(params).then((response) => {
      if (response.success) {
        setConsumers(response.response.data);
      }
    });
  };
  const getWarehouses = async () => {
    await WarehouseService.get({}).then((response) => {
      if (response.success) {
        setWarehouses(response.response.data);
      }
    });
  };
  const getMemberships = async () => {
    const response = await MembershipService.get({ isSale: [false] });
    if (response.success) {
      setMemberships(response.response.data);
    }
  };
  const consumerFormField = (id: number) => {
    const consumer = consumerDictionary?.get(id);
    if (consumer) {
      form.setFieldsValue({
        name: consumer.name,
        lastName: consumer.lastName,
        regno: consumer.regno,
        sectionName: consumer.section?.name,
        phone: consumer.phone,
        isIndividual: consumer.isIndividual,
        isEmployee: consumer.isEmployee,
        isActive: consumer.isActive,
      });
    }
  };
  const onFinish = async (consumerMemberships: IInputConsumerMembership) => {
    blockContext.block();
    if (isEdit) {
      await ConsumerMembershipService.patch(consumerMemberships)
        .then((response) => {
          success(response);
          if (response.success) {
          }
        })
        .finally(() => {
          blockContext.unblock();
        });
    } else {
      await ConsumerMembershipService.post(consumerMemberships)
        .then((response) => {
          success(response);
        })
        .finally(() => {
          blockContext.unblock();
        });
    }
  };
  const success = (response: IResponseConsumerMembership) => {
    if (response.success) {
      setIsOpenModal(false);
      setIsReloadList(!isReloadList);
    }
  };
  const onFinishMembership = async (data: IInputMembership) => {
    if (isEditMembership && membership) {
      await MembershipService.patch(membership.id, data).then((response) => {
        if (response.success) {
          setIsOpenModalCard(false);
          setIsReloadCardList(!isReloadCardList);
        }
      });
    } else {
      await MembershipService.post(data).then((response) => {
        if (response.success) {
          setIsOpenModalCard(false);
          setIsReloadCardList(!isReloadCardList);
        }
      });
    }
  };
  const onDeleteConsumer = async (id: number) => {
    await ConsumerMembershipService.remove(id).then((response) => {
      if (response.success) {
        setIsReloadList(!isReloadList);
      }
    });
  };
  const onDeleteMembership = async (id: number) => {
    await MembershipService.remove(id).then((response) => {
      if (response.success) {
        setIsReloadCardList(!isReloadCardList);
      }
    });
  };
  const onChangeIsSave = (value: boolean) => {
    setIsSave(value);
    if (isSave) {
      formMembership.setFieldsValue({
        isSale: !isSave,
        isBalance: isSave,
      });
    }
  };
  useEffect(() => {
    getConsumers({
      isActive: [true],
    });
    getWarehouses();
  }, []);
  useEffect(() => {
    setConsumerDictionary(
      consumers.reduce((dict, consumer) => {
        dict.set(consumer.id, consumer);
        return dict;
      }, new Map<number, IDataConsumer>())
    );
  }, [consumers]);
  return (
    <div>
      <Row style={{ paddingTop: 12 }} gutter={[12, 24]}>
        <Col md={24} lg={16} xl={19}>
          <Space size={24}>
            <Title level={3}>
              Үндсэн бүртгэл / Харилцагч / Гишүүнчлэлийн бүртгэл
            </Title>
            <Button
              type="primary"
              onClick={() => openModal(false)}
              icon={
                <Image
                  src={"/images/AddIcon.svg"}
                  width={12}
                  height={12}
                  alt="addicon"
                />
              }
            >
              Шинээр бүртгэх
            </Button>
            <Button
              type="primary"
              onClick={() => openModalCard(false)}
              icon={
                <Image
                  src={"/images/AddIcon.svg"}
                  width={12}
                  height={12}
                  alt="addicon"
                />
              }
            >
              Карт, эрхийн бичиг бүртгэл
            </Button>
          </Space>
        </Col>
        <Col md={24} lg={8} xl={5}>
          <Input.Search />
        </Col>
        <Col span={24}>
          <Tabs
            className="lineTop"
            items={items}
            destroyInactiveTabPane={true}
          />
        </Col>
      </Row>
      <NewModal
        width={1100}
        title="Гишүүнчлэлийн бүртгэл"
        open={isOpenModal}
        onCancel={() => {
          setIsOpenModal(false);
        }}
        onOk={() =>
          form.validateFields().then((values) => {
            onFinish(values);
          })
        }
      >
        <Form form={form} layout="vertical">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <div className="inputs-gird-3">
              <Form.Item label="Харилцагчийн код">
                <Space.Compact>
                  <div
                    onClick={() => setIsOpenPopOver(true)}
                    className="extraButton"
                  >
                    <Image
                      src="/icons/clipboardBlack.svg"
                      width={16}
                      height={16}
                      alt="clipboard"
                    />
                  </div>
                  <Form.Item name="consumerId">
                    <NewSelect
                      allowClear
                      showSearch
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        (option?.label ?? "")
                          .toString()
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      options={consumers?.map((consumer) => ({
                        value: consumer.id,
                        label: consumer.code,
                      }))}
                      onClear={() => {
                        form.resetFields([
                          "name",
                          "lastName",
                          "regno",
                          "phone",
                          "sectionName",
                          "isIndividual",
                          "isEmployee",
                          "isActive",
                        ]);
                      }}
                      onSelect={consumerFormField}
                    />
                  </Form.Item>
                </Space.Compact>
              </Form.Item>
              <Form.Item label="Харилцагчийн нэр" name="name">
                <NewInput disabled />
              </Form.Item>
              <Form.Item label="Харилцагчийн овог" name="lastName">
                <NewInput disabled />
              </Form.Item>
              <Form.Item label="Регистр №" name="regno">
                <NewInput disabled />
              </Form.Item>
              <Form.Item label="Утасны дугаар" name="phone">
                <NewInput disabled />
              </Form.Item>
              <Form.Item label="Харилцагчийн бүлэг" name="sectionName">
                <NewInput disabled />
              </Form.Item>
            </div>
            <div className="switches-col">
              <Form.Item
                label="Хувь хүн эсэх"
                valuePropName="checked"
                name="isIndividual"
              >
                <NewSwitch disabled />
              </Form.Item>
              <Form.Item
                label="Ажилтан эсэх"
                valuePropName="checked"
                name="isEmployee"
              >
                <NewSwitch disabled />
              </Form.Item>
              <Form.Item
                label="Идэвхтэй эсэх"
                valuePropName="checked"
                name="isActive"
              >
                <NewSwitch disabled />
              </Form.Item>
            </div>
            <Form.List
              name="cards"
              rules={[
                {
                  validator: async (_, cards) => {
                    if (!cards) {
                      return Promise.reject(
                        new Error("Харилцагчийн картын мэдээллийг оруулна уу!")
                      );
                    }
                    const arr = Array.isArray(cards)
                      ? cards.map((card) => card?.cardno)
                      : [];
                    if (!hasUniqueValues(arr)) {
                      return Promise.reject(
                        new Error("Картын дугаар давхацсан байна.")
                      );
                    }
                  },
                },
              ]}
            >
              {(cards, { add, remove }, { errors }) => (
                <>
                  <EditableTableCard
                    data={cards}
                    memberships={memberships}
                    warehouses={warehouses}
                    form={form}
                    add={add}
                    remove={remove}
                    editMode={false}
                  />
                  <div style={{ color: "#ff4d4f" }}>{errors}</div>
                </>
              )}
            </Form.List>
          </div>
        </Form>
      </NewModal>
      <NewModal
        width={1200}
        open={isOpenPopOver}
        onCancel={() => setIsOpenPopOver(false)}
      >
        <Information
          ComponentType="MIDDLE"
          onClickModal={(row: IDataConsumer) => {
            form.setFieldsValue({
              ...row,
              consumerId: row.id,
              sectionName: row.section.name,
            });
            setIsOpenPopOver(false);
          }}
        />
      </NewModal>
      <NewModal
        width={700}
        title="Картын төрөл"
        open={isOpenModalCard}
        onCancel={() => {
          setIsOpenModalCard(false);
        }}
        onOk={() =>
          formMembership.validateFields().then((values) => {
            onFinishMembership(values);
          })
        }
      >
        <Form
          form={formMembership}
          layout="vertical"
          initialValues={{
            isActive: true,
            isSave: false,
            isPercent: false,
            isSale: false,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div className="inputs-gird-3">
              <Form.Item
                label="Идэвхтэй эсэх"
                name="isActive"
                valuePropName="checked"
              >
                <NewSwitch />
              </Form.Item>
              <Form.Item
                label="Хөнгөлөлт хувиар эсэх"
                name="isPercent"
                valuePropName="checked"
              >
                <NewSwitch />
              </Form.Item>
              <Form.Item
                label="Оноо хуримтлуулдаг эсэх"
                name="isSave"
                valuePropName="checked"
              >
                <NewSwitch onChange={onChangeIsSave} />
              </Form.Item>
              {isSave ? (
                <Form.Item
                  label="Үлдэгдэлтэй эсэх"
                  name="isBalance"
                  valuePropName="checked"
                >
                  <NewSwitch />
                </Form.Item>
              ) : null}
            </div>
            <div className="inputs-gird-3">
              <Form.Item label="Карт, эрхийн бичгийн нэр" name="name">
                <NewInput />
              </Form.Item>
              <Form.Item label="Хөнгөлөлт" shouldUpdate>
                {() =>
                  formMembership.getFieldValue("isPercent") ? (
                    <Form.Item
                      name="discount"
                      rules={[
                        {
                          required: true,
                          message: "Төгрөгийн хөнгөлөлт заавал",
                        },
                      ]}
                    >
                      <NewInputNumber
                        min={1}
                        max={99}
                        style={{
                          width: "100%",
                        }}
                        suffix={"% "}
                      />
                    </Form.Item>
                  ) : (
                    <Form.Item
                      name="discount"
                      rules={[
                        {
                          required: true,
                          message: "Хувийн хөнгөлөлт заавал",
                        },
                      ]}
                    >
                      <NewInputNumber
                        style={{
                          width: "100%",
                        }}
                        suffix={"₮ "}
                        formatter={(value: any) =>
                          `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                      />
                    </Form.Item>
                  )
                }
              </Form.Item>
              <Form.Item label="Онооны дээд хязгаар" shouldUpdate>
                {() => (
                  <Form.Item name="limitDiscount">
                    <NumericFormat
                      thousandSeparator=","
                      decimalScale={2}
                      fixedDecimalScale
                      displayType="input"
                      customInput={NewInputNumber}
                      suffix="₮"
                    />
                  </Form.Item>
                )}
              </Form.Item>
              <Form.Item
                label="Борлуулдаг эсэх"
                name="isSale"
                valuePropName="checked"
              >
                <Form.Item>
                  <NewSwitch disabled={isSave} />
                </Form.Item>
              </Form.Item>
            </div>
            <Form.Item label="Тайлбар" name="description">
              <NewTextArea />
            </Form.Item>
          </div>
        </Form>
      </NewModal>
    </div>
  );
};
export default MembershipCard;

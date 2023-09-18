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
import { NewInput, NewOption, NewSelect, NewSwitch } from "@/components/input";
import EditableTableCard from "./editableTableCard";
import { IDataConsumer, Params } from "@/service/consumer/entities";
import { ConsumerService } from "@/service/consumer/service";
import { IInputConsumerMembership } from "@/service/consumer/membership/entities";
import { ConsumerMembershipService } from "@/service/consumer/membership/service";
import { BranchService } from "@/service/reference/branch/service";
import { IDataBranch } from "@/service/reference/branch/entities";
import { MembershipService } from "@/service/reference/membership/service";
import { IDataMembership } from "@/service/reference/membership/entities";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import { openNofi } from "@/feature/common";
import dayjs from "dayjs";
import Information from "../information/information";

const { Title } = Typography;
const MembershipCard = () => {
  const [form] = Form.useForm();
  const [isReloadList, setIsReloadList] = useState<boolean>(false);
  const blockContext: BlockView = useContext(BlockContext); // uildeliig blockloh
  const [editMode, setIsEditMode] = useState<boolean>(false);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [isOpenModalCard, setIsOpenModalCard] = useState<boolean>(false);
  const [isOpenPopOver, setIsOpenPopOver] = useState<boolean>(false);
  //
  const [consumers, setConsumers] = useState<IDataConsumer[]>([]);
  const [branchs, setBranchs] = useState<IDataBranch[]>([]);
  const [memberships, setMemberships] = useState<IDataMembership[]>([]);
  const [consumerDictionary, setConsumerDictionary] =
    useState<Map<number, IDataConsumer>>();

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
            console.log(id);
          }}
        />
      ),
    },
    {
      label: "Дэлгэрэнгүй жагсаалт",
      key: "item-2",
      children: <DescriptionList />,
    },
  ];
  //

  const openModal = (state: boolean, consumer?: IDataConsumer) => {
    setIsEditMode(state);
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
    setIsOpenModal(true);
    // setSelectedRow(row);
  };
  const getConsumers = async (params: Params) => {
    await ConsumerService.get(params).then((response) => {
      if (response.success) {
        setConsumers(response.response.data);
        setConsumerDictionary(
          consumers.reduce((dict, consumer) => {
            dict.set(consumer.id, consumer);
            return dict;
          }, new Map<number, IDataConsumer>())
        );
        console.table(consumerDictionary);
      }
    });
  };
  const getBranchs = async () => {
    await BranchService.get({}).then((response) => {
      if (response.success) {
        setBranchs(response.response.data);
      }
    });
  };
  const getMemberships = async () => {
    const response = await MembershipService.get({});
    if (response.success) {
      setMemberships(response.response.data);
    }
  };
  const consumerFormField = (id: number) => {
    console.table(consumerDictionary);
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
    await ConsumerMembershipService.post(consumerMemberships)
      .then((response) => {
        if (response.success) {
          openNofi("success", "Амжилттай", "Гишүүнчлэлийн бүртгэл хадгаллаа.");
          setIsOpenModal(false);
        }
      })
      .finally(() => {
        blockContext.unblock();
      });
  };
  useEffect(() => {
    getConsumers({});
    getBranchs();
  }, []);
  return (
    <div>
      <Row style={{ paddingTop: 12 }} gutter={[12, 24]}>
        <Col md={24} lg={16} xl={19}>
          <Space size={24}>
            <Title level={5}>
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
              onClick={() => setIsOpenModalCard(true)}
              icon={
                <Image
                  src={"/images/AddIcon.svg"}
                  width={12}
                  height={12}
                  alt="addicon"
                />
              }
            >
              Картын бүртгэл
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
                  <div className="extraButton">
                    <Image
                      onClick={() => setIsOpenPopOver(true)}
                      src="/icons/clipboardBlack.svg"
                      width={16}
                      height={16}
                      alt="clipboard"
                    />
                  </div>
                  <Form.Item name="consumerId">
                    <NewSelect onSelect={consumerFormField}>
                      {consumers?.map((consumer, index) => {
                        return (
                          <NewOption key={index} value={consumer.id}>
                            {consumer.code}
                          </NewOption>
                        );
                      })}
                    </NewSelect>
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
            <Form.List name="cards">
              {(cards, { add, remove }) => (
                <EditableTableCard
                  data={cards}
                  memberships={memberships}
                  branchs={branchs}
                  form={form}
                  add={add}
                  remove={remove}
                  editMode={false}
                />
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
          ComponentsType="MIDDLE"
          onClickModal={(row: IDataConsumer) => {
            form.setFieldsValue({
              consumerId: row.id,
            });
            setIsOpenPopOver(false);
          }}
        />
      </NewModal>
      <NewModal
        width={700}
        title="Картын бүртгэл"
        open={isOpenModalCard}
        onCancel={() => {
          setIsOpenModalCard(false);
        }}
      >
        {/* <Form.List name="card">
          {(cards, { add, remove }) => (
            <EditableTableCard
              data={cards}
              form={form}
              add={add}
              remove={remove}
              editMode={true}
            />
          )}
        </Form.List> */}
      </NewModal>
    </div>
  );
};
export default MembershipCard;

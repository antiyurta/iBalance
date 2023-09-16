"use client";

import { Button, Col, Form, Input, Row, Space, Tabs, Typography } from "antd";
import Image from "next/image";
import { useState } from "react";

import CustomerList from "./customerList";
import DescriptionList from "./descriptionList";
import NewModal from "@/components/modal";
import { NewInput, NewSelect, NewSwitch } from "@/components/input";
import EditableTableCard from "./editableTableCard";

const { Title } = Typography;

const MembershipCard = () => {
  // modal neeh edit uu esvel new uu ??
  const items = [
    {
      label: "Харилцагчийн жагсаалт",
      key: "item-1",
      children: <CustomerList />,
    },
    {
      label: "Дэлгэрэнгүй жагсаалт",
      key: "item-2",
      children: <DescriptionList />,
    },
  ];
  //
  const [form] = Form.useForm();
  const [editMode, setIsEditMode] = useState<boolean>(false);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [isOpenModalCard, setIsOpenModalCard] = useState<boolean>(false);
  const openModal = (state: boolean, row?: any) => {
    setIsEditMode(state);
    if (!state) {
      form.resetFields();
    } else {
      form.setFieldsValue(row);
    }
    setIsOpenModal(true);
    // setSelectedRow(row);
  };
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
                      //   onClick={() => setIsOpenPopOver(true)}
                      src="/icons/clipboardBlack.svg"
                      width={16}
                      height={16}
                      alt="clipboard"
                    />
                  </div>
                  <Form.Item>
                    <NewSelect />
                  </Form.Item>
                </Space.Compact>
              </Form.Item>
              <Form.Item label="Харилцагчийн нэр">
                <NewInput />
              </Form.Item>
              <Form.Item label="Харилцагчийн овог">
                <NewInput />
              </Form.Item>
              <Form.Item label="Регистр №">
                <NewInput />
              </Form.Item>
              <Form.Item label="Утасны дугаар">
                <NewInput />
              </Form.Item>
              <Form.Item label="Харилцагчийн бүлэг">
                <NewInput />
              </Form.Item>
            </div>
            <div className="switches-col">
              <Form.Item label="Хувь хүн эсэх" valuePropName="checked">
                <NewSwitch />
              </Form.Item>
              <Form.Item label="Ажилтан эсэх" valuePropName="checked">
                <NewSwitch />
              </Form.Item>
              <Form.Item label="Идэвхтэй эсэх" valuePropName="checked">
                <NewSwitch />
              </Form.Item>
            </div>
            {/* <Form.List name="cards">
                
            </Form.List> */}
          </div>
        </Form>
      </NewModal>
      <NewModal
        width={700}
        title="Картын бүртгэл"
        open={isOpenModalCard}
        onCancel={() => {
          setIsOpenModalCard(false);
        }}
      >
        <Form.List name="card">
          {(cards, { add, remove }) => (
            <EditableTableCard
              data={cards}
              form={form}
              add={add}
              remove={remove}
            />
          )}
        </Form.List>
      </NewModal>
    </div>
  );
};
export default MembershipCard;

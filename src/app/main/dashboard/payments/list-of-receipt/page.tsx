"use client";
import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Space,
  Tabs,
  Transfer,
  Typography,
} from "antd";
import React, { useContext, useEffect, useState } from "react";
/** Төлбөрийн жагсаалт*/
import Jurnal from "./Jurnal";
/** Буцаалтын жагсаалт */
import ReturnList from "./ReturnList";
/** Гишүүнчлэлийн картын гүйлгээний жагсаалт */
import ListOfMembershipCardTransactions from "./ListOfMembershipCardTransactions";
/** Бэлгийн картын гүйлгээний жагсаалт */
import ListOfGiftCard from "./ListOfGiftCard";
/** Өдрийн нээлт, хаалтын түүх */
import OpeningClosingHistory from "./OpeningClosingHistory";
import { PlusOutlined, LeftOutlined } from "@ant-design/icons";
import NewModal from "@/components/modal";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import {
  NewDatePicker,
  NewFilterSelect,
  NewInput,
  NewInputNumber,
} from "@/components/input";
import { IDataMembership } from "@/service/reference/membership/entities";
import { MembershipService } from "@/service/reference/membership/service";
import dayjs from "dayjs";
import { useTypedSelector } from "@/feature/store/reducer";
import { openNofi } from "@/feature/common";
import { newTab } from "@/feature/store/slice/tab.slice";
import PageTitle from "@/components/page-title";
type GiftType = "income" | "expense";
const { Title } = Typography;
const ListOfReceipt = () => {
  const dispatch = useDispatch();
  const blockContext: BlockView = useContext(BlockContext);
  const [giftForm] = Form.useForm();
  const warehouse = useTypedSelector((state) => state.warehouse);
  const [memberships, setMemberships] = useState<IDataMembership[]>([]);
  const [isAddAction, setIsAddAction] = useState<boolean>(false);
  const [isGift, setIsGift] = useState<boolean>(false);
  const [giftType, setGiftType] = useState<GiftType>();
  const [balance, setBalance] = useState<number>(0);
  const [selectedMembership, setSelectedMembership] =
    useState<IDataMembership>();
  const items = [
    {
      label: "Төлбөрийн жагсаалт",
      key: "item-1",
      children: <Jurnal />,
    },
    {
      label: "Буцаалтын жагсаалт",
      key: "item-2",
      children: <ReturnList />,
    },
    // {
    //   label: "Гишүүнчлэлийн картын гүйлгээний жагсаалт",
    //   key: "item-3",
    //   children: <ListOfMembershipCardTransactions />,
    // },
    // {
    //   label: "Бэлгийн картын гүйлгээний жагсаалт",
    //   key: "item-4",
    //   children: <ListOfGiftCard />,
    // },
    {
      label: "Өдрийн нээлт, хаалтын түүх",
      key: "item-5",
      children: <OpeningClosingHistory />,
    },
  ];
  const getMemberships = () => {
    MembershipService.get({
      isSale: [true],
    }).then((response) => {
      if (response.success) {
        setMemberships(response.response.data);
      }
    });
  };
  const createGiftCart = async (incomeGift: any) => {
    if (giftType == "expense" && balance == 0) {
      openNofi("warning", "Үлдэгдэл 0 байна.");
    } else {
    }
  };
  const getBalance = async (params: any) => {};
  const getSelectedMembership = async (id: number) => {
    await MembershipService.getById(id).then((response) => {
      if (response.success) {
        setSelectedMembership(response.response);
      }
    });
    await getBalance({
      isAuth: true,
      giftAt: giftForm.getFieldValue("giftAt"),
      membershipId: giftForm.getFieldValue("membershipId"),
    });
  };
  useEffect(() => {
    getMemberships();
  }, []);
  return (
    <>
      <PageTitle>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsAddAction(true)}
        >
          Нэмэлт үйлдүүд
        </Button>
      </PageTitle>
      <Row
        style={{
          paddingTop: 16,
        }}
        gutter={[12, 24]}
      >
        <Col span={24}>
          <Tabs className="lineTop" items={items} destroyOnHidden={true} />
        </Col>
      </Row>
      <NewModal
        title=" "
        width={360}
        open={isAddAction}
        onCancel={() => setIsAddAction(false)}
        footer={false}
      >
        <p
          style={{
            textAlign: "center",
            fontSize: 20,
            fontWeight: 500,
          }}
        >
          Нэмэлт үйлдлүүд
        </p>
        <div className="form-grid-2">
          <div
            onClick={() => {
              dispatch(
                newTab({
                  label: "Гишүүнчлэлийн бүртгэл",
                  key: "/registration/customer/information",
                  closeable: true,
                  breadcrumb: ["Бүртгэл", "Харилцагч", "Бүртгэл"],
                })
              );
              setIsAddAction(false);
            }}
            className="payment-type-box-gray"
          >
            <Image
              src={"/icons/dollar.svg"}
              loading="eager"
              priority={true}
              alt="гишүүнчлэлийн бүртгэл"
              width={24}
              height={24}
            />
            <Title
              level={4}
              style={{
                fontWeight: 700,
                color: "#86909C",
                textAlign: "center",
              }}
            >
              Гишүүнчлэлийн бүртгэл
            </Title>
          </div>
          <div
            onClick={() => {
              dispatch(
                newTab({
                  label: "Агуулахын тайлан",
                  key: "/reports",
                  closeable: false,
                  breadcrumb: ["Тайлан"],
                })
              );
              setIsAddAction(false);
            }}
            className="payment-type-box-gray"
          >
            <Image
              src={"/icons/report.svg"}
              loading="eager"
              priority={true}
              alt="тайлан харах"
              width={24}
              height={24}
            />
            <Title
              level={4}
              style={{
                fontWeight: 700,
                color: "#86909C",
                textAlign: "center",
              }}
            >
              Тайлан харах
            </Title>
          </div>
          <div
            className="payment-type-box-gray"
            onClick={() => {
              setIsAddAction(false);
              setIsGift(true);
              setGiftType("income");
            }}
          >
            <Image
              src={"/icons/gift.svg"}
              loading="eager"
              priority={true}
              alt="Бэлгийн карт орлого авах"
              width={24}
              height={24}
            />
            <Title
              level={4}
              style={{
                fontWeight: 700,
                color: "#86909C",
                textAlign: "center",
              }}
            >
              Бэлгийн карт орлого авах
            </Title>
          </div>
          <div
            className="payment-type-box-gray"
            onClick={() => {
              setIsAddAction(false);
              setIsGift(true);
              setGiftType("expense");
            }}
          >
            <Image
              src={"/icons/gift.svg"}
              loading="eager"
              priority={true}
              alt="Бэлгийн карт олгох"
              width={24}
              height={24}
            />
            <Title
              level={4}
              style={{
                fontWeight: 700,
                color: "#86909C",
                textAlign: "center",
              }}
            >
              Бэлгийн карт олгох
            </Title>
          </div>
          <div className="payment-type-box-gray">
            <Image
              src={"/icons/support.svg"}
              loading="eager"
              priority={true}
              alt="Тусламж"
              width={24}
              height={24}
            />
            <Title
              level={4}
              style={{
                fontWeight: 700,
                color: "#86909C",
                textAlign: "center",
              }}
            >
              Тусламж
            </Title>
          </div>
        </div>
      </NewModal>
      <NewModal
        title={
          giftType == "income"
            ? "Бэлгийн карт орлого авах"
            : "Бэлгийн карт олгох"
        }
        width={550}
        open={isGift}
        onCancel={() => setIsGift(false)}
        footer={false}
      >
        <Form
          form={giftForm}
          layout="vertical"
          onFinish={createGiftCart}
          initialValues={{
            giftAt: dayjs(new Date()),
            warehouseName: warehouse.name,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3,1fr)",
              gap: 12,
            }}
          >
            <Form.Item label="Баримтын дугаар">
              <NewInput disabled />
            </Form.Item>
            <Form.Item label="Байршил" name={"warehouseName"}>
              <NewInput disabled />
            </Form.Item>
            <Form.Item label="Баримтын огноо" name={"giftAt"}>
              <NewDatePicker />
            </Form.Item>
          </div>
          <Form.Item label="Карт" name={"membershipId"}>
            <NewFilterSelect
              onSelect={getSelectedMembership}
              options={memberships.map((membership) => ({
                value: membership.id,
                label: membership.name,
              }))}
            />
          </Form.Item>
          <div style={{ fontSize: 14, fontWeight: 400, padding: 3 }}>
            Худалдах нэгж үнэ: {selectedMembership?.discount}
          </div>
          <div style={{ height: 42, padding: "12, 0, 12, 0", gap: 10 }}>
            <p style={{ fontSize: 16, fontWeight: 500, textAlign: "center" }}>
              Үлдэгдэл: {balance}
            </p>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2,1fr)",
              gap: 12,
            }}
          >
            {giftType == "income" ? (
              <>
                <Form.Item label="Дуусах огноо" name={"endAt"}>
                  <NewDatePicker />
                </Form.Item>
                <Form.Item label={"Орлогод авах тоо ширхэг"} name={"incomeQty"}>
                  <NewInputNumber />
                </Form.Item>
              </>
            ) : (
              <Form.Item label={"Зарлагадах тоо ширхэг"} name={"expenseQty"}>
                <NewInputNumber />
              </Form.Item>
            )}
          </div>
          <div
            style={{
              width: "100%",
              height: 16,
              justifyContent: "space-between",
            }}
          >
            <p style={{ fontWeight: 400, fontSize: 14, color: "#6C757D" }}>
              {giftType == "income" ? "Орлогод авах дүн:" : "Зарлагадах дүн:"}
            </p>
          </div>
          <Space style={{ paddingTop: 24 }}>
            <Button
              icon={<LeftOutlined />}
              style={{ width: 55, height: 55, padding: 12, gap: 10 }}
            />
            <Button
              type="primary"
              htmlType="submit"
              style={{
                width: 444,
                height: 55,
                gap: 12,
                fontSize: 20,
                fontWeight: 500,
              }}
            >
              {giftType == "income" ? "Орлого авах" : "Зарлагадах"}
            </Button>
          </Space>
        </Form>
      </NewModal>
    </>
  );
};
export default ListOfReceipt;

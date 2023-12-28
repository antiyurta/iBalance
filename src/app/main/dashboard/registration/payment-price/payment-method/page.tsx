"use client";
import Image from "next/image";
import { IDataReferencePaymentMethod } from "@/service/reference/payment-method/entities";
import { ReferencePaymentMethodService } from "@/service/reference/payment-method/service";
import { App, Col, Input, Row, Space, Table } from "antd";
import { useEffect, useState } from "react";
import Title from "antd/lib/typography/Title";
import { NewSwitch } from "@/components/input";
import { ColumnsType } from "antd/es/table";
const PaymentMethodPage = () => {
  const { modal } = App.useApp();
  const [data, setData] = useState<IDataReferencePaymentMethod[]>([]);
  const columns: ColumnsType<IDataReferencePaymentMethod> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Зураг",
      dataIndex: "imageUrl",
      key: "imageUrl",
      render: (text) => (
        <Image
          src={`${process.env.NEXT_PUBLIC_IMAGE_PATH}/${text}`}
          width={48}
          height={48}
          alt={text}
        />
      ),
    },
    {
      title: "Төлбөрийн хэлбэр",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Төрөл",
      key: "type",
      dataIndex: "type",
    },
    {
      title: "Идэвхтэй эсэх",
      key: "action",
      render: (_, record) => (
        <NewSwitch
          defaultChecked={record.isActive}
          onChange={(value: boolean) => {
            if (!value) {
              confirm(record.id, value);
            } else {
              onFinish(record.id, value);
            }
          }}
        />
      ),
    },
  ];
  const getData = async () => {
    await ReferencePaymentMethodService.get({}).then((response) => {
      if (response.success) {
        setData(response.response);
      }
    });
  };
  const confirm = (id: number, isActive: boolean) => {
    modal.warning({
      title: "Анхааруулга",
      content: (
        <div>
          <p>Төлбөрийн хэлбэрийг идэвхгүй болгохдоо итгэлтэй байна уу?</p>
        </div>
      ),
      cancelText: "Болих",
      okText: "Тийм",
      closable: true,
      onOk: () => onFinish(id, isActive),
    });
  };
  const onFinish = async (id: number, isActive: boolean) => {
    await ReferencePaymentMethodService.patch(id, {
      id,
      isActive,
    }).then((response) => {
      if (response.success) {
        getData();
      }
    });
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    <Row gutter={[12, 24]}>
      <Col md={24} lg={16} xl={19}>
        <Space size={24}>
          <Title level={3}>
            Үндсэн бүртгэл / Төлбөр, үнэ / Төлбөрийн хэлбэр
          </Title>
        </Space>
      </Col>
      <Col md={24} lg={8} xl={5}>
        <Input.Search />
      </Col>
      <Col md={24} lg={14} xl={24}>
        <Row gutter={[0, 12]}>
          <Col span={24}>
            <Table columns={columns} dataSource={data} rowKey={"id"} />;
          </Col>
        </Row>
      </Col>
    </Row>
  );
};
export default PaymentMethodPage;

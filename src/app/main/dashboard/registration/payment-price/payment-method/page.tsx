"use client";
import Image from "next/image";
import { Meta } from "@/service/entities";
import { IDataReferencePaymentMethod } from "@/service/reference/payment-method/entities";
import { ReferencePaymentMethodService } from "@/service/reference/payment-method/service";
import { Col, Form, Input, Row, Space, Table } from "antd";
import { useEffect, useState } from "react";
import Title from "antd/lib/typography/Title";
import { NewSwitch } from "@/components/input";
import { ColumnsType } from "antd/es/table";
const PaymentMethodPage = () => {
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
          onChange={(value: boolean) =>
            onFinish(record.id, {
              id: record.id,
              imageUrl: record.imageUrl,
              name: record.name,
              type: record.type,
              isActive: value,
              createdBy: record.createdBy,
              updatedBy: record.updatedBy,
              createdAt: record.createdAt,
              updatedAt: record.updatedAt,
              deletedAt: record.deletedAt,
            })
          }
        />
      ),
    },
  ];
  const getData = async () => {
    await ReferencePaymentMethodService.get({}).then((response) => {
      if (response.success) {
        setData(response.response.data);
      }
    });
  };
  const onFinish = async (id: number, value: IDataReferencePaymentMethod) => {
    await ReferencePaymentMethodService.patch(id, value).then((response) => {
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
          <Title level={5}>
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

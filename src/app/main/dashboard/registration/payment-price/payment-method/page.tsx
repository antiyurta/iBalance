"use client";
import Image from "next/image";
import { Meta } from "@/service/entities";
import {
  IDataReferencePaymentMethod,
  PaymentType,
} from "@/service/reference/payment-method/entities";
import { ReferencePaymentMethodService } from "@/service/reference/payment-method/service";
import {
  Badge,
  Col,
  Form,
  Input,
  Row,
  Space,
  Table,
  Tag,
  Upload,
  UploadFile,
} from "antd";
import { useEffect, useState } from "react";
import Title from "antd/lib/typography/Title";
import NewModal from "@/components/modal";
import { NewSwitch } from "@/components/input";
import { ColumnsType } from "antd/es/table";
interface MyUploadFile extends UploadFile {
  response?: {
    message: string;
    response: {
      filename: string;
      id: number;
      mimetype: string;
      path: string;
    };
    success: true;
  };
}
const PaymentMethodPage = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState<IDataReferencePaymentMethod[]>([]);
  const [meta, setMeta] = useState<Meta>({ page: 1, limit: 10 });
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isModal, setIsModal] = useState<boolean>(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<IDataReferencePaymentMethod>();
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
      render: (_, record) => <NewSwitch />,
    },
  ];
  const getData = async () => {
    await ReferencePaymentMethodService.get().then((response) => {
      if (response.success) {
        setData(response.response.data);
        setMeta(response.response.meta);
      }
    });
  };
  const onFinish = async (values: IDataReferencePaymentMethod) => {
    if (isEdit && selectedPaymentMethod) {
      await ReferencePaymentMethodService.patch(
        selectedPaymentMethod.id,
        values
      ).then((response) => {
        if (response.success) {
          getData();
          setIsModal(false);
        }
      });
    }
  };
  const onEdit = (value: IDataReferencePaymentMethod) => {
    setIsEdit(true);
    setSelectedPaymentMethod(value);
    form.setFieldsValue({
      name: value.name,
      type: value.type,
      isActive: value.isActive,
    });
    setIsModal(true);
  };
  const getType = (type?: PaymentType): string => {
    if (type == PaymentType.Cash) return "Бэлэн";
    else if (type == PaymentType.Lend) return "Зээл";
    else if (type == PaymentType.NotCash) return "Бэлэн бус";
    else return "";
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    <div>
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
              <Table columns={columns} dataSource={data} />;
            </Col>
          </Row>
        </Col>
      </Row>
      <NewModal
        title={selectedPaymentMethod?.name}
        open={isModal}
        onCancel={() => setIsModal(false)}
        onOk={() =>
          form.validateFields().then((values) => {
            onFinish(values);
          })
        }
      >
        <Badge.Ribbon text={getType(selectedPaymentMethod?.type)}>
          <Image
            src={"/images/PrintIcon.svg"}
            width={48}
            height={48}
            alt="printIcon"
          />
        </Badge.Ribbon>
        <Form form={form} layout="vertical">
          <Form.Item label="Идэвхтэй эсэх" name="isActive">
            <NewSwitch />
          </Form.Item>
        </Form>
      </NewModal>
    </div>
  );
};
export default PaymentMethodPage;

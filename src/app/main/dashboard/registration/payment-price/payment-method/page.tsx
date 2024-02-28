"use client";
import Image from "next/image";
import { NextPage } from "next";
import { IDataReferencePaymentMethod } from "@/service/reference/payment-method/entities";
import { ReferencePaymentMethodService } from "@/service/reference/payment-method/service";
import { Button, Col, Form, Popconfirm, Row, Table } from "antd";
import { Fragment, useEffect, useState } from "react";
import { ColumnsType } from "antd/es/table";
import PageTitle from "@/components/page-title";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import NewModal from "@/components/modal";
import {
  NewInput,
  NewInputNumber,
  NewSelect,
  NewSwitch,
} from "@/components/input";
import { PaymentMethodIconData, PaymentTypeData } from "@/feature/data";
const PaymentMethodPage: NextPage = () => {
  const icons = PaymentMethodIconData;
  const [form] = Form.useForm<IDataReferencePaymentMethod>();
  const [data, setData] = useState<IDataReferencePaymentMethod[]>([]);
  const [isEditModal, setIsEditModal] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<IDataReferencePaymentMethod>();
  const columns: ColumnsType<IDataReferencePaymentMethod> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Зураг",
      dataIndex: "logo",
      key: "logo",
      render: (value) => {
        return value ? (
          <Image src={value} width={24} height={24} alt={value} />
        ) : (
          ""
        );
      },
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
      render: (value) => {
        const index = PaymentTypeData.findIndex((item) => item.value == value);
        return index != -1 ? PaymentTypeData[index].label : "";
      },
    },
    {
      title: "Үйлдэл",
      key: "action",
      render: (_, record) => (
        <Fragment key={record.id}>
          <Button
            icon={<EditOutlined />}
            shape={"circle"}
            style={{ marginRight: 8 }}
            onClick={() => {
              form.setFieldsValue(record);
              setIsEditModal(true);
              setSelectedRow(record);
            }}
          />
          <Popconfirm
            title="Та итгэлтэй байна уу？"
            okText="Тийм"
            cancelText="Үгүй"
            onConfirm={() => onDelete(record.id)}
          >
            <Button
              danger
              icon={
                <DeleteOutlined
                  style={{
                    color: "red",
                  }}
                />
              }
              shape={"circle"}
            />
          </Popconfirm>
        </Fragment>
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
  const onFinish = async (row: IDataReferencePaymentMethod) => {
    if (selectedRow) {
      await ReferencePaymentMethodService.patch(selectedRow.id, row).then(
        (response) => {
          if (response.success) {
            getData();
            setIsEditModal(false);
            form.resetFields();
            setSelectedRow(undefined);
          }
        }
      );
    } else {
      await ReferencePaymentMethodService.post(row).then((response) => {
        if (response.success) {
          getData();
          setIsEditModal(false);
          form.resetFields();
          setSelectedRow(undefined);
        }
      });
    }
  };
  const onDelete = async (id: number) => {
    await ReferencePaymentMethodService.remove(id);
    getData();
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    <>
      <PageTitle
        onClick={() => {
          setIsEditModal(true);
        }}
      />
      <Row gutter={[12, 24]}>
        <Col md={24} lg={14} xl={24}>
          <Row gutter={[0, 12]}>
            <Col span={24}>
              <Table columns={columns} dataSource={data} rowKey={"id"} />
            </Col>
          </Row>
        </Col>
      </Row>
      <NewModal
        open={isEditModal}
        title="Төлбөрийн хэлбэр"
        onOk={() =>
          form.validateFields().then((value) => {
            onFinish(value);
          })
        }
        onCancel={() => setIsEditModal(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Лого" name="logo">
            <NewSelect
              options={icons.map((item) => ({
                label: (
                  <Image
                    src={item.icon}
                    alt={item.title}
                    width={24}
                    height={24}
                  />
                ),
                value: item.icon,
              }))}
            />
          </Form.Item>
          <Form.Item label="Нэр" name="name">
            <NewInput />
          </Form.Item>
          <Form.Item label="Төрөл" name="type">
            <NewSelect options={PaymentTypeData} />
          </Form.Item>
          <Form.Item label="Хураамж" name="fee">
            <NewInputNumber />
          </Form.Item>
          <Form.Item
            label="Идэвхтэй эсэх"
            name="isActive"
            valuePropName="checked"
          >
            <NewSwitch />
          </Form.Item>
        </Form>
      </NewModal>
    </>
  );
};
export default PaymentMethodPage;

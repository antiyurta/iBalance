"use client";
import Image from "next/image";
import { PlusOutlined } from "@ant-design/icons";
import Filtered from "@/components/filtered";
import { onCloseFilterTag, openNofi } from "@/feature/common";
import { DataIndexType, Meta } from "@/service/entities";
import {
  FilteredColumnsPaymentMethod,
  IDataReferencePaymentMethod,
  IFilterReferencePaymentMethod,
  IParamReferencePaymentMethod,
} from "@/service/reference/payment-method/entities";
import { ReferencePaymentMethodService } from "@/service/reference/payment-method/service";
import { Button, Col, Form, Input, Row, Space, Upload, UploadFile } from "antd";
import { useEffect, useState } from "react";
import { NewTable } from "@/components/table";
import Title from "antd/lib/typography/Title";
import NewModal from "@/components/modal";
import { NewInput, NewSwitch } from "@/components/input";
import { RootState, useTypedSelector } from "@/feature/store/reducer";
import { UploadProps } from "antd/lib";
import { ReferenceService } from "@/service/reference/reference";
import { ColumnType } from "antd/es/table";
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
  const [params, setParams] = useState<IParamReferencePaymentMethod>({});
  const [data, setData] = useState<IDataReferencePaymentMethod[]>([]);
  const [meta, setMeta] = useState<Meta>({ page: 1, limit: 10 });
  const [filters, setFilters] = useState<IFilterReferencePaymentMethod>();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isModal, setIsModal] = useState<boolean>(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<IDataReferencePaymentMethod>();
  const [fileList, setFileList] = useState<MyUploadFile>();
  const [columns, setColumns] = useState<FilteredColumnsPaymentMethod>({
    file: {
      label: "Таних тэмдэг",
      isView: true,
      isFiltered: false,
      dataIndex: ["file", "path"],
      type: DataIndexType.MULTI,
    },
    name: {
      label: "Төлбөрийн хэлбэр",
      isView: true,
      isFiltered: false,
      dataIndex: "name",
      type: DataIndexType.MULTI,
    },
    isLend: {
      label: "Зээл эсэх",
      isView: true,
      isFiltered: false,
      dataIndex: "isLend",
      type: DataIndexType.BOOLEAN,
    },
    updatedAt: {
      label: "Өөрчлөлт хийсэн огноо",
      isView: true,
      isFiltered: false,
      dataIndex: "updatedAt",
      type: DataIndexType.DATE,
    },
    updatedBy: {
      label: "Өөрчлөлт хийсэн хэрэглэгч",
      isView: true,
      isFiltered: false,
      dataIndex: ["updatedUser", "firstName"],
      type: DataIndexType.USER,
    },
  });
  const getData = async (params: IParamReferencePaymentMethod) => {
    await ReferencePaymentMethodService.get(params).then((response) => {
      if (response.success) {
        setData(response.response.data);
        setFilters(response.response.filter);
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
          getData({ page: 1, limit: 10 });
          setIsModal(false);
        }
      });
    } else {
      await ReferencePaymentMethodService.post(values).then((response) => {
        if (response.success) {
          getData({ page: 1, limit: 10 });
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
      isLend: value.isLend,
    });
    setIsModal(true);
  };
  const onDelete = async (value: number) => {
    await ReferencePaymentMethodService.remove(value).then((response) => {
      if (response.success) {
        getData({ page: 1, limit: 10 });
        openNofi('success', 'Төлбөрийн хэлбэр амжилттай устгалаа');
      }
    });
  };
  const {
    login_data: {
      response: { accessToken },
    },
  } = useTypedSelector((state: RootState) => state.core);
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    "x-api-key": `${process.env.NEXT_PUBLIC_API_KEY}`,
  };
  const beforeUpload: UploadProps["beforeUpload"] = (info) => {
    if (fileList) {
      handleRemove(fileList);
    }
  };
  const onChange: UploadProps["onChange"] = (info) => {
    setFileList(info.fileList[0]);
  };
  const handleRemove = async (info: MyUploadFile) => {
    setFileList(undefined);
    if (info.response?.response.id) {
      const id = info.response?.response.id;
      await ReferenceService.removeUploadImage(id).then((response) => {
        if (response.success) {
          openNofi("success", "Устгагдав");
        }
      });
    }
  };
  useEffect(() => {
    getData({ page: 1, limit: 10 });
  }, []);
  return (
    <div>
      <Row gutter={[12, 24]}>
        <Col md={24} lg={16} xl={19}>
          <Space size={24}>
            <Title level={5}>
              Үндсэн бүртгэл / Төлбөр, үнэ / Төлбөрийн хэлбэр
            </Title>
            <Button
              type="primary"
              onClick={() => {
                setIsEdit(false);
                setIsModal(true);
                form.resetFields();
              }}
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
          </Space>
        </Col>
        <Col md={24} lg={8} xl={5}>
          <Input.Search />
        </Col>
        <Col md={24} lg={14} xl={24}>
          <Row gutter={[0, 12]}>
            <Col sm={24}>
              <Space
                style={{
                  width: "100%",
                  justifyContent: "flex-end",
                }}
                size={12}
              >
                <Filtered
                  columns={columns}
                  isActive={(key, state) => {
                    onCloseFilterTag({
                      key: key,
                      state: state,
                      column: columns,
                      onColumn: (column) => setColumns(column),
                      params: params,
                      onParams: (params) => setParams(params),
                    });
                    getData(params);
                  }}
                />
                <Space
                  style={{
                    width: "100%",
                    justifyContent: "flex-end",
                  }}
                  size={12}
                >
                  <Image
                    src={"/images/PrintIcon.svg"}
                    width={24}
                    height={24}
                    alt="printIcon"
                  />
                  <Image
                    src={"/images/UploadIcon.svg"}
                    width={24}
                    height={24}
                    alt="uploadIcon"
                  />
                  <Image
                    src={"/images/DownloadIcon.svg"}
                    width={24}
                    height={24}
                    alt="downloadIcon"
                  />
                </Space>
              </Space>
            </Col>
            <Col span={24}>
              <NewTable
                scroll={{
                  x: 1700,
                }}
                rowKey="id"
                data={data}
                meta={meta}
                columns={columns}
                onChange={getData}
                onColumns={setColumns}
                newParams={params}
                onParams={setParams}
                incomeFilters={filters}
                isEdit
                isDelete
                onEdit={onEdit}
                onDelete={onDelete}
              />
            </Col>
          </Row>
        </Col>
      </Row>
      <NewModal
        title="Төлбөрийн хэлбэр"
        open={isModal}
        onCancel={() => setIsModal(false)}
        onOk={() =>
          form.validateFields().then((values) => {
            onFinish(values);
          })
        }
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Таних тэмдэг" name="fileId">
            <Upload
              maxCount={1}
              headers={headers}
              action={`${process.env.NEXT_PUBLIC_BASEURL}/local-files/fileUpload`}
              listType="picture-card"
              beforeUpload={beforeUpload}
              onChange={onChange}
              onRemove={handleRemove}
            >
              <PlusOutlined
                style={{
                  fontSize: 24,
                  color: "#6c757d",
                }}
              />
            </Upload>
          </Form.Item>
          <Form.Item
            label="Төлбөрийн хэлбэр"
            name="name"
            rules={[
              {
                required: true,
                message: "Төлбөрийн хэлбэр заавал",
              },
            ]}
          >
            <NewInput />
          </Form.Item>
          <Form.Item
            label="Зээл эсэх"
            name="isLend"
            rules={[
              {
                required: true,
                message: "Төлбөрийн хэлбэр заавал",
              },
            ]}
          >
            <NewSwitch />
          </Form.Item>
        </Form>
      </NewModal>
    </div>
  );
};
export default PaymentMethodPage;

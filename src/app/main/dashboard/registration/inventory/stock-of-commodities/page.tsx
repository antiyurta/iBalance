"use client";
import Image from "next/image";
import DetailList from "./detailed";
import {
  Button,
  Col,
  Form,
  InputNumber,
  Row,
  Space,
  Tabs,
  Typography,
} from "antd";
import { useState } from "react";
import { IDataMaterial, MaterialType } from "@/service/material/entities";
import Thumbnail from "./thumbnail";
import { MaterialResourceSizeService } from "@/service/material/resource-size/service";
import NewModal from "@/components/modal";
import { MaterialSelect } from "@/components/material-select";
import { NewInput } from "@/components/input";
import EditableTableResourseSize from "./editableTableResourceSize";
const { Title } = Typography;
const StockOfCommoditiesPage = () => {
  const [form] = Form.useForm();
  const [isReload, setIsReload] = useState<boolean>(false);
  const [isModal, setIsModal] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<IDataMaterial>();
  const items = [
    {
      label: "Бараа материалын жагсаалт",
      key: "item-1",
      children: <Thumbnail onEdit={(row) => openModal(true, row)} />,
    },
    {
      label: "Дэлгэрэнгүй жагсаалт",
      key: "item-2",
      children: <DetailList />,
    },
  ];
  const openModal = (state: boolean, row?: IDataMaterial) => {
    setIsEdit(state);
    if (!state) {
      form.resetFields();
      form.setFieldsValue({ isActive: true });
    } else {
      form.setFieldsValue(row);
    }
    setIsModal(true);
    setSelectedRow(row);
  };
  const onFinish = async (values: IDataMaterial) => {
    if (isEdit && selectedRow) {
      await MaterialResourceSizeService.patch(selectedRow.id, values).then(
        (response) => {
          if (response.success) {
            setIsModal(false);
            setIsReload(!isReload);
          }
        }
      );
    } else {
      await MaterialResourceSizeService.post(values).then((response) => {
        if (response.success) {
          setIsModal(false);
          setIsReload(!isReload);
        }
      });
    }
  };
  return (
    <div>
      <Row style={{ paddingTop: 12 }} gutter={[12, 24]}>
        <Col md={24} lg={16} xl={19}>
          <Space size={24}>
            <Title level={3}>
              Үндсэн бүртгэл / Бараа материал / Зохистой нөөцийн хэмжээ
            </Title>
            <Button
              type="primary"
              onClick={() => {
                openModal(false);
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
        <Col span={24}>
          <Tabs
            className="lineTop"
            items={items}
            destroyInactiveTabPane={true}
          />
        </Col>
      </Row>
      <NewModal
        title="Зохистой нөөцийн хэмжээ"
        open={isModal}
        onCancel={() => setIsModal(false)}
        onOk={() =>
          form.validateFields().then((values) => {
            onFinish(values);
          })
        }
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            isAccount: false,
            isClose: false,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 24,
            }}
          >
            <div className="inputs-gird-3">
              <Form.Item label="Дотоод код">
                <MaterialSelect
                  params={{ types: [MaterialType.Material] }}
                  form={form}
                  rules={[
                    {
                      required: true,
                      message: "Дотоод код",
                    },
                  ]}
                  name="materialId"
                  onClear={() => {
                    form.resetFields([
                      "name",
                      "measurement",
                      "countPackage",
                      "section",
                    ]);
                  }}
                  onSelect={(value) => {
                    form.setFieldsValue({
                      name: value.name,
                      countPackage: value.countPackage,
                      section: { name: value.sectionName },
                      measurement: { name: value.measurementName },
                    });
                  }}
                  materialTypes={[]}
                />
              </Form.Item>
              <Form.Item label="Бараа материалын нэр" name="name">
                <NewInput disabled />
              </Form.Item>
              <Form.Item label="Багцын доторх тоо" name="countPackage">
                <InputNumber disabled />
              </Form.Item>
              <Form.Item label="Хэмжих нэгж" name={["measurement", "name"]}>
                <NewInput disabled />
              </Form.Item>
              <Form.Item
                label="Бараа материалын бүлэг"
                name={["section", "name"]}
              >
                <NewInput disabled />
              </Form.Item>
            </div>
            <Form.List name="resourceSizes">
              {(accounts, { add, remove }) => (
                <EditableTableResourseSize
                  data={accounts}
                  form={form}
                  editMode={isEdit}
                  add={add}
                  remove={remove}
                />
              )}
            </Form.List>
          </div>
        </Form>
      </NewModal>
    </div>
  );
};
export default StockOfCommoditiesPage;

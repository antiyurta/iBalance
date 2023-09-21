import Image from "next/image";
import { Col, Form, Row, Space } from "antd";
import NewCard from "@/components/Card";
import { NewDatePicker, NewInput, NewSelect } from "@/components/input";
import { useState } from "react";
import EditableTable from "./editableTable";

const AddPage = () => {
  const [form] = Form.useForm();
  const [isOpenPopOver, setIsOpenPopOver] = useState<boolean>(false);
  return (
    <Row gutter={[12, 24]}>
      <Col span={24}>
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
            src={"/images/DownloadIcon.svg"}
            width={24}
            height={24}
            alt="downloadIcon"
          />
        </Space>
      </Col>
      <Col span={24}>
        <NewCard>
          <Form form={form} layout="vertical">
            <Row gutter={[12, 12]}>
              <Col md={12} lg={8} xl={4}>
                <Form.Item label="ID" name="id">
                  <NewInput disabled />
                </Form.Item>
              </Col>
              <Col md={12} lg={8} xl={4}>
                <Form.Item label="Тушаалын огноо">
                  <Space.Compact>
                    <div
                      className="extraButton"
                      onClick={() => setIsOpenPopOver(true)}
                    >
                      <Image
                        src="/icons/clipboardBlack.svg"
                        width={16}
                        height={16}
                        alt="clipboard"
                      />
                    </div>
                    <Form.Item name="date">
                      <NewDatePicker
                        style={{
                          width: "100%",
                        }}
                      />
                    </Form.Item>
                  </Space.Compact>
                </Form.Item>
              </Col>
              <Col md={12} lg={8} xl={4}>
                <Form.Item label="Тушаалын дугаар" name="nyunber">
                  <NewInput />
                </Form.Item>
              </Col>
              <Col md={12} lg={8} xl={4}>
                <Form.Item label="Мөрдөж эхлэх огноо">
                  <Space.Compact>
                    <div
                      className="extraButton"
                      onClick={() => setIsOpenPopOver(true)}
                    >
                      <Image
                        src="/icons/clipboardBlack.svg"
                        width={16}
                        height={16}
                        alt="clipboard"
                      />
                    </div>
                    <Form.Item
                      name="date"
                      rules={[
                        {
                          required: true,
                          message: "Заавал",
                        },
                      ]}
                    >
                      <NewDatePicker
                        style={{
                          width: "100%",
                        }}
                      />
                    </Form.Item>
                  </Space.Compact>
                </Form.Item>
              </Col>
              <Col md={12} lg={8} xl={4}>
                <Form.Item label="Мөрдөх төв, салбарын нэр">
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
                    options={[
                      {
                        label: "TEST",
                        value: 1,
                      },
                    ]}
                  />
                </Form.Item>
              </Col>
              <Col md={12} lg={8} xl={4}>
                <Form.Item label="Харилцагчын код, нэр">
                  <Space.Compact>
                    <div
                      className="extraButton"
                      onClick={() => setIsOpenPopOver(true)}
                    >
                      <Image
                        src="/icons/clipboardBlack.svg"
                        width={16}
                        height={16}
                        alt="clipboard"
                      />
                    </div>
                    <Form.Item
                      name="consumerId"
                      rules={[
                        {
                          required: true,
                          message: "Заавал",
                        },
                      ]}
                    >
                      <NewSelect
                        style={{
                          width: "100%",
                        }}
                        allowClear
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          (option?.label ?? "")
                            .toString()
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                        options={[
                          {
                            label: "TEST",
                            value: 1,
                          },
                        ]}
                      />
                    </Form.Item>
                  </Space.Compact>
                </Form.Item>
              </Col>
            </Row>
            <div
              style={{
                marginTop: 24,
                marginBottom: 24,
                width: "100%",
                height: 1,
                background: "#DEE2E6",
              }}
            />
            <Form.List name="dd">
              {(items, { add, remove }) => (
                <EditableTable
                  data={items}
                  form={form}
                  add={add}
                  remove={remove}
                />
              )}
            </Form.List>
          </Form>
        </NewCard>
      </Col>
    </Row>
  );
};
export default AddPage;

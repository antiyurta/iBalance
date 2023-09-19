"use client";
import { SwapOutlined, SignalFilled } from "@ant-design/icons";
import NewDirectoryTree from "@/components/directoryTree";
import {
  NewInput,
  NewOption,
  NewSearch,
  NewSelect,
  NewSwitch,
} from "@/components/input";
import NewModal from "@/components/modal";
import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Popover,
  Row,
  Space,
  Typography,
} from "antd";
import Image from "next/image";
import { useEffect, useState } from "react";
import { IDataMaterialSection } from "@/service/material/section/entities";
import { MaterialSectionService } from "@/service/material/section/service";
import { IDataType } from "@/service/material/type/entities";
import { TypeService } from "@/service/material/type/service";
import InventoriesType from "../inventories-type/inventoriesType";
import InventoriesRegistration from "../inventories-registration/inventoriesRegistration";
// import Information from "../information/information";

const { Title } = Typography;

const InventoriesGroup = () => {
  const [addForm] = Form.useForm();
  const [updateForm] = Form.useForm();
  const [isLeafAdd, setIsLeafAdd] = useState<boolean | undefined>(false);
  const [sections, setSections] = useState<IDataMaterialSection[]>([]);
  const [isOpenTree, setIsOpenTree] = useState<boolean>(true);
  const [isOpenAddModal, setIsOpenAddModal] = useState<boolean>(false);
  const [isOpenChangeModal, setIsOpenChangeModal] = useState<boolean>(false);
  const [isOpenPopOverAdd, setIsOpenPopOverAdd] = useState<boolean>(false);
  const [isOpenPopOverChange, setIsOpenPopOverChange] =
    useState<boolean>(false);
  //
  const [type, setType] = useState<IDataType[]>([]);
  const [isOpenModalType, setIsOpenModalType] = useState<boolean>(false);
  //
  const onFinish = async (values: IDataMaterialSection) => {
    values.isExpand = !values.isExpand;
    setIsOpenTree(false);
    await MaterialSectionService.post(values).then((response) => {
      if (response.success) {
        getMaterialSections();
        setIsOpenAddModal(false);
      }
    });
    setIsOpenTree(true);
  };
  const onFinishAdd = (values: IDataMaterialSection) => {
    if (isLeafAdd) {
      Modal.warning({
        title: "Анхааруулга",
        content: (
          <div>
            <p>
              Уг бүлэгт харилцагч бүртгэлтэй байгаа тул бүртгэлтэй бүх
              харилцагчдыг шинээр үүсгэж буй бүлэг рүү шилжүүлсний дараагаар
              бүлэг үүсгэх боломжтой!
            </p>
            <p>
              {" "}
              Та бүртгэлтэй харилцагчдыг шинээр үүсгэж буй бүлэг рүү
              шилжүүлэхдээ итгэлтэй байна уу?
            </p>
          </div>
        ),
        cancelText: "Болих",
        okText: "Тийм",
        closable: true,
        onOk: () => onFinish(values),
      });
    } else {
      onFinish(values);
    }
  };
  // section awchirah
  const getMaterialSections = async () => {
    await MaterialSectionService.get().then((response) => {
      setSections(response.response.data);
    });
  };
  const getInventoriesType = async () => {
    await TypeService.get().then((response) => {
      setType(response.response.data);
    });
  };
  useEffect(() => {
    getMaterialSections();
  }, []);
  useEffect(() => {
    addForm.setFieldsValue({
      isExpand: isLeafAdd,
    });
  }, [isLeafAdd]);
  return (
    <div>
      <Row style={{ paddingTop: 12 }} gutter={[12, 24]}>
        <Col md={24} lg={16} xl={19}>
          <Space size={24}>
            <Title level={5}>Үндсэн бүртгэл / Бараа материал / Бүлэг</Title>
            <Button
              type="primary"
              onClick={() => {
                setIsOpenAddModal(true);
                addForm.resetFields();
                getInventoriesType();
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
        <Col sm={24}>
          <Space
            style={{
              width: "100%",
              justifyContent: "flex-end",
            }}
            size={12}
          >
            <Button
              type="primary"
              onClick={() => setIsOpenChangeModal(true)}
              icon={
                <Image
                  src={"/images/AddIcon.svg"}
                  width={12}
                  height={12}
                  alt="addicon"
                />
              }
            >
              Харилцагчийн бүлэг өөрчлөх
            </Button>
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
          <NewDirectoryTree
            mode="CONSUMER"
            extra="FULL"
            data={sections}
            isLeaf={true}
            width={"100%"}
          />
        </Col>
      </Row>
      <NewModal
        title="Бараа материалын бүлэг өөрчлөх"
        width={1300}
        open={isOpenChangeModal}
        onCancel={() => setIsOpenChangeModal(false)}
        footer={null}
      >
        <InventoriesRegistration
          ComponentsType="LITTLE"
          onClickModal={(e) => console.log(e)}
        />
      </NewModal>
      <NewModal
        width={310}
        title="Бараа материалын бүлэг"
        open={isOpenAddModal}
        onCancel={() => setIsOpenAddModal(false)}
        onOk={() =>
          addForm.validateFields().then((values) => {
            onFinishAdd(values);
          })
        }
      >
        <Form
          form={addForm}
          layout="vertical"
          initialValues={{
            isExpand: false,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 24,
            }}
          >
            <Form.Item
              label="Бараа материалын бүлэг"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Бараа материалын бүлэг заавал",
                },
              ]}
            >
              <NewInput />
            </Form.Item>
            <Form.Item
              label="Харъяалах бүлэг"
              style={{
                width: "100%",
              }}
            >
              <Space.Compact>
                <div className="extraButton">
                  <Popover
                    placement="bottom"
                    open={isOpenPopOverAdd}
                    onOpenChange={(state) => setIsOpenPopOverAdd(state)}
                    content={
                      <NewDirectoryTree
                        mode="CONSUMER"
                        extra="HALF"
                        data={sections}
                        isLeaf={true}
                        onClick={(key, isLeaf) => {
                          setIsLeafAdd(isLeaf);
                          setIsOpenPopOverAdd(false);
                          addForm.setFieldsValue({
                            sectionId: key,
                          });
                        }}
                      />
                    }
                    trigger={"click"}
                  >
                    <SignalFilled rotate={-90} />
                  </Popover>
                </div>
                <Form.Item
                  style={{
                    width: "100%",
                  }}
                  name="sectionId"
                  rules={[
                    {
                      required: false,
                      message: "Харъяалах бүлэг заавал",
                    },
                  ]}
                >
                  <NewSelect
                    disabled={true}
                    style={{
                      width: "100%",
                    }}
                  >
                    {sections?.map((section: IDataMaterialSection, index) => {
                      return (
                        <NewOption key={index} value={section.id}>
                          {section.name}
                        </NewOption>
                      );
                    })}
                  </NewSelect>
                </Form.Item>
              </Space.Compact>
            </Form.Item>
            <div className="switches-col">
              <Form.Item
                label="Хамгийн сүүлийн бүлэг эсэх"
                name="isExpand"
                valuePropName="checked"
              >
                <NewSwitch />
              </Form.Item>
            </div>
            <div className="switches-col">
              <Form.Item
                label="Борлуулах бараа, үйлчилгээ эсэх"
                name="isExpand"
                valuePropName="checked"
              >
                <NewSwitch />
              </Form.Item>
            </div>
            <Form.Item label="Холбох код">
              <Space.Compact>
                <div className="extraButton">
                  <Image
                    onClick={() => setIsOpenModalType(true)}
                    src="/icons/clipboardBlack.svg"
                    width={16}
                    height={16}
                    alt="clipboard"
                  />
                </div>
                <Form.Item
                  name="materialTypeId"
                  rules={[
                    {
                      required: false,
                      message: "Холбох код",
                    },
                    {
                      pattern: /^\d*(?:\.\d+)?$/,
                      message: "Зөвхөн тоо оруулах",
                    },
                  ]}
                >
                  <NewSelect
                    showSearch
                    filterOption={(input: any, option: { children: any }) => {
                      return (option?.children ?? "").includes(input);
                    }}
                  >
                    {type?.map((type, index) => {
                      return (
                        <NewOption key={index} value={type.id}>
                          {type.name}
                        </NewOption>
                      );
                    })}
                  </NewSelect>
                </Form.Item>
              </Space.Compact>
            </Form.Item>
          </div>
        </Form>
      </NewModal>
      <NewModal
        title=" "
        open={isOpenModalType}
        onCancel={() => setIsOpenModalType(false)}
      >
        <InventoriesType
          ComponentsType="MODAL"
          onClickModal={(row) => {
            addForm.setFieldsValue({
              materialTypeId: row.id,
            });
            setIsOpenModalType(false);
          }}
        />
      </NewModal>
    </div>
  );
};
export default InventoriesGroup;

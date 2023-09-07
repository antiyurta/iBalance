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
  IDataConsumerSection,
  TreeSectionType,
} from "@/service/consumer/section/entities";
import { ConsumerSectionService } from "@/service/consumer/section/service";
import { Form, Modal, Popover, Space } from "antd";
import Image from "next/image";
import { useEffect, useState } from "react";
import Information from "../information/page";

const Group = () => {
  const [addForm] = Form.useForm();
  const [updateForm] = Form.useForm();
  const [isLeafAdd, setIsLeafAdd] = useState<boolean | undefined>(false);
  const [sections, setSections] = useState<IDataConsumerSection[]>([]);
  const [isOpenTree, setIsOpenTree] = useState<boolean>(true);
  const [isOpenAddModal, setIsOpenAddModal] = useState<boolean>(false);
  const [isOpenChangeModal, setIsOpenChangeModal] = useState<boolean>(false);
  const [isOpenPopOverAdd, setIsOpenPopOverAdd] = useState<boolean>(false);
  const [isOpenPopOverChange, setIsOpenPopOverChange] =
    useState<boolean>(false);
  //
  const onFinish = async (values: IDataConsumerSection) => {
    values.type = TreeSectionType.Consumer;
    values.isExpand = !values.isExpand;
    setIsOpenTree(false);
    await ConsumerSectionService.post(values).then((response) => {
      if (response.success) {
        getConsumerSection(TreeSectionType.Consumer);
        setIsOpenAddModal(false);
      }
    });
    setIsOpenTree(true);
  };
  const onFinishAdd = (values: IDataConsumerSection) => {
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
  const getConsumerSection = async (type: TreeSectionType) => {
    await ConsumerSectionService.get(type).then((response) => {
      setSections(response.response);
    });
  };
  useEffect(() => {
    getConsumerSection(TreeSectionType.Consumer);
  }, []);
  useEffect(() => {
    console.log(isLeafAdd);
    addForm.setFieldsValue({
      isExpand: isLeafAdd,
    });
  }, [isLeafAdd]);
  return (
    <div>
      <div className="information">
        <div className="header">
          <div className="left">
            <p>Үндсэн бүртгэл / Харилцагч / Бүлэг</p>
            <button
              className="app-button"
              onClick={() => {
                setIsOpenAddModal(true);
                addForm.resetFields();
              }}
            >
              <Image
                src={"/images/AddIcon.svg"}
                width={12}
                height={12}
                alt="addicon"
              />
              Шинээр бүртгэх
            </button>
          </div>
          <div className="right">
            <NewSearch
              prefix={
                <Image
                  src={"/images/SearchIcon.svg"}
                  width={12}
                  height={12}
                  alt="searchIcon"
                />
              }
              allowClear={true}
              onSearch={(values: string) => console.log(values)}
            />
          </div>
        </div>
        <div className="second-header">
          <button
            className="app-button"
            onClick={() => setIsOpenChangeModal(true)}
          >
            <Image
              src={"/images/AddIcon.svg"}
              width={12}
              height={12}
              alt="addicon"
            />
            Харилцагчийн бүлэг өөрчлөх
          </button>
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
        </div>
        <div className="body">
          <NewDirectoryTree
            isLeaf={true}
            type={TreeSectionType.Consumer}
            width={"100%"}
            open={isOpenTree}
          />
        </div>
      </div>
      <NewModal
        title="Харилцагчийн бүлэг өөрчлөх"
        width={1300}
        open={isOpenChangeModal}
        onCancel={() => setIsOpenChangeModal(false)}
        footer={null}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 24,
          }}
        >
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 24,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 24,
              }}
            >
              <Form
                form={updateForm}
                style={{
                  width: "100%",
                }}
              >
                <Space.Compact>
                  <div
                    className="extraButton"
                    style={{
                      display: "flex",
                      height: 38,
                      alignItems: "center",
                      placeContent: "center",
                    }}
                  >
                    <Popover
                      placement="bottom"
                      open={isOpenPopOverChange}
                      onOpenChange={(state) => setIsOpenPopOverChange(state)}
                      content={
                        <NewDirectoryTree
                          isLeaf={false}
                          type={TreeSectionType.Consumer}
                          open={true}
                          onClick={(key, isLeaf) => {
                            if (isLeaf) {
                              setIsOpenPopOverChange(false);
                              updateForm.setFieldsValue({
                                sectionId: key,
                              });
                            }
                          }}
                        />
                      }
                      trigger={"click"}
                    >
                      <SignalFilled rotate={-90} />
                    </Popover>
                  </div>
                  <Form.Item
                    name="sectionId"
                    rules={[
                      {
                        required: true,
                        message: "Харилцагчийн бүлэг заавал",
                      },
                    ]}
                  >
                    <NewSelect
                      className="ant-selecto-38px"
                      disabled={true}
                      style={{
                        width: "100%",
                      }}
                    >
                      {sections?.map((section: IDataConsumerSection, index) => {
                        return (
                          <NewOption key={index} value={section.id}>
                            {section.name}
                          </NewOption>
                        );
                      })}
                    </NewSelect>
                  </Form.Item>
                </Space.Compact>
              </Form>
              <button
                className="app-button"
                onClick={() => setIsOpenChangeModal(true)}
              >
                <SwapOutlined />
                Шилжүүлэх
              </button>
            </div>
            <Information
              ComponentsType="LITTLE"
              onClickModal={(e) => console.log(e)}
            />
          </div>
        </div>
      </NewModal>
      <NewModal
        width={400}
        title="Харилцагчийн бүлэг"
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
              label="Харилцагчийн бүлэг"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Харилцагчийн бүлэг заавал",
                },
              ]}
            >
              <NewInput />
            </Form.Item>
            <Form.Item
              label="Харилцагчийн бүлэг"
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
                        isLeaf={true}
                        type={TreeSectionType.Consumer}
                        open={true}
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
                      required: true,
                      message: "Харилцагчийн бүлэг заавал",
                    },
                  ]}
                >
                  <NewSelect
                    disabled={true}
                    style={{
                      width: "100%",
                    }}
                  >
                    {sections?.map((section: IDataConsumerSection, index) => {
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
          </div>
        </Form>
      </NewModal>
    </div>
  );
};
export default Group;

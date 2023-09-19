"use client";
import { SignalFilled } from "@ant-design/icons";
import NewDirectoryTree from "@/components/directoryTree";
import { NewInput, NewOption, NewSelect, NewSwitch } from "@/components/input";
import NewModal from "@/components/modal";
import {
  IDataTreeSection,
  TreeSectionType,
} from "@/service/reference/tree-section/entities";
import { TreeSectionService } from "@/service/reference/tree-section/service";
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
import { useContext, useEffect, useState } from "react";
import Information from "../information/information";
import { openNofi } from "@/feature/common";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import { ConsumerService } from "@/service/consumer/service";
import { DataNode } from "antd/es/tree";

const { Title } = Typography;

const Group = () => {
  const [addForm] = Form.useForm();
  const blockContext: BlockView = useContext(BlockContext); // uildeliig blockloh
  const [editMode, setEditMode] = useState<boolean>(false);
  const [isHaveChild, setIsHaveChild] = useState<boolean>(false);
  const [selectedGroupId, setSelectedGroupId] = useState<number>();
  const [isLeafAdd, setIsLeafAdd] = useState<boolean | undefined>(false);
  const [sections, setSections] = useState<IDataTreeSection[]>([]);
  const [isOpenAddModal, setIsOpenAddModal] = useState<boolean>(false);
  const [isOpenPopOverAdd, setIsOpenPopOverAdd] = useState<boolean>(false);
  const [isOpenChangeModal, setIsOpenChangeModal] = useState<boolean>(false);
  const onFinish = async (values: IDataTreeSection) => {
    values.type = TreeSectionType.Consumer;
    values.isExpand = !values.isExpand;
    if (editMode) {
      await TreeSectionService.patch(selectedGroupId, values).then(
        (response) => {
          if (response.success) {
            getConsumerSection(TreeSectionType.Consumer);
            setIsOpenAddModal(false);
          }
        }
      );
    } else {
      await TreeSectionService.post(values).then((response) => {
        if (response.success) {
          getConsumerSection(TreeSectionType.Consumer);
          setIsOpenAddModal(false);
        }
      });
    }
  };
  const onFinishAdd = (values: IDataTreeSection) => {
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
  const onDelete = async (id: number) => {
    blockContext.block();
    await TreeSectionService.getById(id)
      .then((response) => {
        if (response.response.sections.length > 0) {
          Modal.error({
            maskClosable: true,
            title: "Алдаа",
            content: (
              <>
                <p>
                  Харилцагч бүртгэгдсэн тул &ldquo;{response.response.name}
                  &ldquo; бүлгийг устгах боломжгүй байна.
                </p>
              </>
            ),
            footer: null,
          });
        } else {
          Modal.info({
            maskClosable: true,
            title: "Устгах",
            content: "Та бүртгэлийг устгахдаа итгэлтэй байна уу ?",
            onOk: async () => {
              await TreeSectionService.remove(id)
                .then((response) => {
                  if (response.success) {
                    openNofi("success", "Амжилттай", "Амжилттай устгагдлаа");
                    getConsumerSection(TreeSectionType.Consumer);
                  }
                })
                .finally(() => {
                  return;
                });
            },
          });
        }
      })
      .finally(() => {
        blockContext.unblock();
      });
  };
  //
  const checkEdit = (row: {
    title: string;
    key: number;
    parentId: number;
    isLeaf: boolean;
    children: any[];
  }) => {
    console.log("row", row);
    if (row.isLeaf) {
      checkSectionInConsumer(row.key);
    } else {
      checkTreeIn(row.key);
    }
    setSelectedGroupId(row.key);
    addForm.setFieldsValue({
      name: row.title,
      sectionId: row.parentId,
      isExpand: row.isLeaf,
    });
    setEditMode(true);
    setIsOpenAddModal(true);
  };
  // etssin bulgetg ym bga eseh
  const checkSectionInConsumer = async (sectionId: number) => {
    await ConsumerService.get({ sectionId: [sectionId] }).then((response) => {
      if (response.response.data.length > 0) {
        setIsHaveChild(true);
      } else {
        setIsHaveChild(false);
      }
    });
  };
  // treed ym bga eseh
  const checkTreeIn = async (sectionId: number) => {
    await TreeSectionService.getByFilter({
      sectionId: sectionId,
      type: TreeSectionType.Consumer,
    }).then((response) => {
      if (response.response.length > 0) {
        setIsHaveChild(true);
      } else {
        setIsHaveChild(false);
      }
    });
  };
  // section awchirah
  const getConsumerSection = async (type: TreeSectionType) => {
    blockContext.block();
    await TreeSectionService.get(type)
      .then((response) => {
        setSections(response.response);
      })
      .finally(() => {
        blockContext.unblock();
      });
  };
  useEffect(() => {
    getConsumerSection(TreeSectionType.Consumer);
  }, []);
  useEffect(() => {
    addForm.setFieldsValue({
      isExpand: isLeafAdd,
    });
  }, [isLeafAdd]);
  return (
    <div>
      <Row gutter={[12, 24]}>
        <Col span={24}>
          <Space size={24}>
            <Title level={5}>Үндсэн бүртгэл / Харилцагч / Бүлэг</Title>
            <Button
              type="primary"
              onClick={() => {
                setEditMode(false);
                setIsOpenAddModal(true);
                addForm.resetFields();
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
        <Col sm={24}>
          <Space
            style={{
              width: "100%",
              height: 39,
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
        <Col sm={24}>
          {sections.length > 0 ? (
            <NewDirectoryTree
              mode="CONSUMER"
              extra="FULL"
              data={sections}
              isLeaf={true}
              width={"100%"}
              onEdit={checkEdit}
              onDelete={(id) => {
                onDelete(id);
              }}
            />
          ) : null}
        </Col>
      </Row>
      <NewModal
        title="Харилцагчийн бүлэг өөрчлөх"
        width={1300}
        open={isOpenChangeModal}
        onCancel={() => setIsOpenChangeModal(false)}
        footer={null}
      >
        <Information
          ComponentsType="LITTLE"
          onClickModal={(e) => {
            setIsOpenChangeModal(e);
          }}
        />
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
        maskClosable={false}
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
              label="Харилцагчийн бүлэг нэр"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Харилцагчийн бүлэг нэр заавал",
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
                          if (!editMode) {
                            setIsLeafAdd(isLeaf);
                          }
                          setIsOpenPopOverAdd(false);
                          const section = sections.find(
                            (e) => e.id === selectedGroupId
                          );
                          if (section?.id === key) {
                            Modal.error({
                              title: "Алдаа",
                              content: (
                                <>
                                  <p>
                                    {section.name} бүлэгт байгаа тул боломжгүй
                                  </p>
                                </>
                              ),
                            });
                          } else {
                            addForm.setFieldsValue({
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
                  style={{
                    width: "100%",
                  }}
                  name="sectionId"
                  // rules={[
                  //   {
                  //     required: addForm.getFieldValue("isExpand"),
                  //     message: "Харилцагчийн бүлэг заавал",
                  //   },
                  // ]}
                >
                  <NewSelect
                    disabled={true}
                    style={{
                      width: "100%",
                    }}
                  >
                    {sections?.map((section: IDataTreeSection, index) => {
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
                <NewSwitch disabled={isHaveChild} />
              </Form.Item>
            </div>
          </div>
        </Form>
      </NewModal>
    </div>
  );
};
export default Group;

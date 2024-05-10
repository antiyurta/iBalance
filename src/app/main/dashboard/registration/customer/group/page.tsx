"use client";
import NewDirectoryTree from "@/components/tree";
import { NewInput, NewSwitch } from "@/components/input";
import NewModal from "@/components/modal";
import {
  IDataTreeSection,
  TreeSectionType,
} from "@/service/reference/tree-section/entities";
import { TreeSectionService } from "@/service/reference/tree-section/service";
import { App, Button, Col, Form, Row, Space } from "antd";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import Information from "../information/information";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import { ConsumerService } from "@/service/consumer/service";
import Export from "@/components/Export";
import PageTitle from "@/components/page-title";
import NewTreeSelect from "@/components/tree/tree-select";
const Group = () => {
  const { modal } = App.useApp();
  const [addForm] = Form.useForm();
  const blockContext: BlockView = useContext(BlockContext); // uildeliig blockloh
  const [editMode, setEditMode] = useState<boolean>(false);
  const [isHaveChild, setIsHaveChild] = useState<boolean>(false);
  const [selectedGroupId, setSelectedGroupId] = useState<number>();
  const [selectedSectionId, setSelectedSectionId] = useState<number>();
  const [sections, setSections] = useState<IDataTreeSection[]>([]);
  const [isOpenAddModal, setIsOpenAddModal] = useState<boolean>(false);
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
    setIsHaveChild(false);
  };
  const onFinishAdd = (values: IDataTreeSection) => {
    if (values.sectionId != selectedSectionId && isHaveChild) {
      modal.warning({
        title: "Анхааруулга",
        content: (
          <div>
            <p>
              Уг бүлэгт харилцагч бүртгэлтэй байгаа тул бүртгэлтэй бүх
              харилцагчдыг шинээр үүсгэж буй бүлэг рүү шилжүүлсний дараагаар
              бүлэг үүсгэх боломжтой!
            </p>
            <p>
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
          modal.error({
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
          modal.info({
            maskClosable: true,
            title: "Устгах",
            content: "Та бүртгэлийг устгахдаа итгэлтэй байна уу ?",
            onOk: async () => {
              await TreeSectionService.remove(id)
                .then((response) => {
                  if (response.success) {
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
  const checkEdit = (row: IDataTreeSection) => {
    if (!row.isExpand) {
      checkSectionInConsumer(row.id);
    } else {
      checkTreeIn(row.id);
    }
    setSelectedGroupId(row.id);
    setSelectedSectionId(row.sectionId);
    addForm.setFieldsValue({
      name: row.name,
      sectionId: row.sectionId,
      isExpand: !row.isExpand,
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
  return (
    <div>
      <PageTitle
        onClick={() => {
          setEditMode(false);
          setSelectedGroupId(undefined);
          setIsOpenAddModal(true);
          addForm.resetFields();
        }}
      />
      <Row
        style={{
          paddingTop: 16,
        }}
        gutter={[12, 24]}
      >
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
            <Export docName="TESt" />
          </Space>
        </Col>
        <Col sm={24}>
          <NewDirectoryTree
            data={sections}
            onEdit={checkEdit}
            onDelete={onDelete}
          />
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
          ComponentType="LITTLE"
          onClickModal={(e) => {
            setIsOpenChangeModal(e);
          }}
        />
      </NewModal>
      <NewModal
        width={400}
        title="Харилцагчийн бүлэг"
        open={isOpenAddModal}
        onCancel={() => {
          setIsOpenAddModal(false);
          setIsHaveChild(false);
        }}
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
              name={"sectionId"}
            >
              <NewTreeSelect
                sections={sections}
                onChange={(value) => addForm.setFieldValue("sectionId", value)}
              />
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

import NewDirectoryTree from "@/components/tree";
import { NewInput, NewSwitch } from "@/components/input";
import NewModal from "@/components/modal";
import {
  IDataTreeSection,
  TreeSectionType,
} from "@/service/reference/tree-section/entities";
import { TreeSectionService } from "@/service/reference/tree-section/service";
import { App, Button, Col, Form, Input, Row, Space, Typography } from "antd";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { WarehouseService } from "@/service/reference/warehouse/service";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import StoragiesRegistration from "./StoragiesRegistration";
import NewTreeSelect from "@/components/tree/tree-select";
const { Title } = Typography;
export const StoragiesGroup = () => {
  const [form] = Form.useForm();
  const { modal } = App.useApp();
  const blockContext: BlockView = useContext(BlockContext);
  const [sections, setSections] = useState<IDataTreeSection[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<number>();
  const [selectedSectionId, setSelectedSectionId] = useState<number>();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isModal, setIsModal] = useState<boolean>(false);
  const [isHaveChild, setIsHaveChild] = useState<boolean>(false);
  const [isOpenChangeModal, setIsOpenChangeModal] = useState<boolean>(false);
  const [sectionLength, setSectionLength] = useState<number>(0);
  const getSections = async (type: TreeSectionType) => {
    await TreeSectionService.get(type).then((response) => {
      if (response.success) {
        setSections(response.response);
        setSectionLength(response.response.length);
      }
    });
  };
  const checkSectionInWarehouse = async (sectionId: number) => {
    await WarehouseService.get({ sectionId: sectionId }).then((response) => {
      if (response.response.data.length > 0) {
        setIsHaveChild(true);
      } else {
        setIsHaveChild(false);
      }
    });
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
  const onFinish = async (values: IDataTreeSection) => {
    values.isExpand = !values.isExpand;
    values.type = TreeSectionType.Warehouse;
    if (isEdit) {
      await TreeSectionService.patch(selectedGroupId, values).then(
        (response) => {
          if (response.success) {
            getSections(TreeSectionType.Warehouse);
            setIsModal(false);
          }
        }
      );
    } else {
      await TreeSectionService.post(values).then((response) => {
        if (response.success) {
          getSections(TreeSectionType.Warehouse);
          setIsModal(false);
        }
      });
    }
    setIsHaveChild(false);
  };
  const checkTreeIn = async (sectionId: number) => {
    await TreeSectionService.getByFilter({
      sectionId: sectionId,
    }).then((response) => {
      if (response.response.length > 0) {
        setIsHaveChild(true);
      } else {
        setIsHaveChild(false);
      }
    });
  };
  const checkEdit = (row: IDataTreeSection) => {
    if (!row.isExpand) {
      checkSectionInWarehouse(row.id);
    } else {
      checkTreeIn(row.id);
    }
    setSelectedGroupId(row.id);
    setSelectedSectionId(row.sectionId);
    console.log(row.id);
    form.setFieldsValue({
      name: row.name,
      sectionId: row.sectionId,
      isExpand: !row.isExpand,
    });
    setIsEdit(true);
    setIsModal(true);
  };
  const onDelete = async (id: number) => {
    blockContext.block();
    await TreeSectionService.getById(id)
      .then((response) => {
        if (response.response.sections?.length > 0) {
          modal.error({
            maskClosable: true,
            title: "Алдаа",
            content: (
              <>
                <p>
                  Байршил бүртгэгдсэн тул &ldquo;{response.response.name}
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
              await TreeSectionService.remove(id).then((response) => {
                if (response.success) {
                  getSections(TreeSectionType.Warehouse);
                }
              });
            },
          });
        }
        console.log(response);
      })
      .finally(() => {
        blockContext.unblock();
      });
  };
  useEffect(() => {
    getSections(TreeSectionType.Warehouse);
  }, []);
  return (
    <div>
      <Row style={{ paddingTop: 12 }} gutter={[12, 24]}>
        <Col md={24} lg={16} xl={19}>
          <Space size={24}>
            <Title level={3}>Үндсэн бүртгэл / Байршил / Бүлэг</Title>
            <Button
              type="primary"
              onClick={() => {
                setIsEdit(false);
                setSelectedGroupId(undefined);
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
              onClick={() => {
                setIsOpenChangeModal(true);
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
              Агуулахын бүлэг өөрчлөх
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
            data={sections}
            onEdit={checkEdit}
            onDelete={onDelete}
          />
        </Col>
      </Row>
      <NewModal
        width={310}
        title="Байршилын бүлэг"
        open={isModal}
        onCancel={() => setIsModal(false)}
        onOk={() =>
          form.validateFields().then((values) => {
            onFinishAdd(values);
          })
        }
      >
        <Form
          form={form}
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
              label="Байршилын бүлэг"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Байршилын бүлэг заавал",
                },
              ]}
            >
              <NewInput />
            </Form.Item>
            <Form.Item
              label="Харъяалах бүлэг"
              // rules={[{ required: true, message: "Харьяалах бүлэг заавал" }]}
              name="sectionId"
            >
              <NewTreeSelect
                sections={sections}
                onChange={(value: string) =>
                  form.setFieldValue("sectionId", value)
                }
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
      <NewModal
        title="Байршлын бүлэг өөрчлөх"
        width={1300}
        open={isOpenChangeModal}
        onCancel={() => setIsOpenChangeModal(false)}
        footer={null}
      >
        <StoragiesRegistration
          ComponentType="LITTLE"
          onClickModal={(row) => {
            setIsOpenChangeModal(row);
          }}
        />
      </NewModal>
    </div>
  );
};

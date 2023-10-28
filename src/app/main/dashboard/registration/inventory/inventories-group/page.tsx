"use client";
import { SignalFilled, PlusOutlined } from "@ant-design/icons";
import NewDirectoryTree from "@/components/directoryTree";
import { NewInput, NewSelect, NewSwitch } from "@/components/input";
import NewModal from "@/components/modal";
import {
  App,
  Button,
  Col,
  Form,
  Input,
  Popover,
  Row,
  Space,
  Typography,
  Upload,
} from "antd";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { IDataMaterialSection } from "@/service/material/section/entities";
import { MaterialSectionService } from "@/service/material/section/service";
import { IDataType } from "@/service/material/type/entities";
import { TypeService } from "@/service/material/type/service";
import InventoriesType from "../inventories-type/inventoriesType";
import InventoriesRegistration from "../inventories-registration/inventoriesRegistration";
import { RootState, useTypedSelector } from "@/feature/store/reducer";
import { ReferenceService } from "@/service/reference/reference";
import { openNofi } from "@/feature/common";
import type { UploadProps } from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import { MaterialService } from "@/service/material/service";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";

const { Title } = Typography;

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

const InventoriesGroup = () => {
  const { modal } = App.useApp();
  const [addForm] = Form.useForm();
  const isExpand = Form.useWatch("isExpand", addForm);
  const {
    login_data: {
      response: { accessToken },
    },
  } = useTypedSelector((state: RootState) => state.core);
  const blockContext: BlockView = useContext(BlockContext); // uildeliig blockloh
  const [sections, setSections] = useState<IDataMaterialSection[]>([]);
  const [isOpenAddModal, setIsOpenAddModal] = useState<boolean>(false);
  const [isOpenChangeModal, setIsOpenChangeModal] = useState<boolean>(false);
  const [isOpenPopOverAdd, setIsOpenPopOverAdd] = useState<boolean>(false);
  const [type, setType] = useState<IDataType[]>([]);
  const [isOpenModalType, setIsOpenModalType] = useState<boolean>(false);
  const [fileList, setFileList] = useState<MyUploadFile>();
  //
  const [isHaveChild, setIsHaveChild] = useState<boolean>(false);
  const [selectedGroupId, setSelectedGroupId] = useState<number>();
  const [selectedSectionId, setSelectedSectionId] = useState<number>();
  const [editMode, setEditMode] = useState<boolean>(false);
  //
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
  const onFinish = async (values: IDataMaterialSection) => {
    values.isExpand = !values.isExpand;
    values.fileId = fileList?.response?.response.id;
    if (editMode) {
      await MaterialSectionService.patch(selectedGroupId, values).then(
        (response) => {
          if (response.success) {
            getMaterialSections();
            setIsOpenAddModal(false);
          }
        }
      );
    } else {
      await MaterialSectionService.post(values).then((response) => {
        if (response.success) {
          getMaterialSections();
          setIsOpenAddModal(false);
        }
      });
    }
    setIsHaveChild(false);
  };
  const onFinishAdd = (values: IDataMaterialSection) => {
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
  const checkSectionInMaterial = async (sectionId: number) => {
    await MaterialService.get({ materialSectionId: [sectionId] }).then(
      (response) => {
        if (response.response.data.length > 0) {
          setIsHaveChild(true);
        } else {
          setIsHaveChild(false);
        }
      }
    );
  };
  const checkTreeIn = async (sectionId: number) => {
    await MaterialSectionService.get({
      sectionId: [sectionId],
    }).then((response) => {
      if (response.response.data.length > 0) {
        setIsHaveChild(true);
      } else {
        setIsHaveChild(false);
      }
    });
  };
  const checkEdit = (row: IDataMaterialSection) => {
    if (!row.isExpand) {
      checkSectionInMaterial(row.id);
    } else {
      checkTreeIn(row.id);
    }
    setSelectedGroupId(row.id);
    setSelectedSectionId(row.sectionId);
    console.log(row.id);
    addForm.setFieldsValue({
      name: row.name,
      sectionId: row.sectionId,
      isExpand: !row.isExpand,
      isSale: row.isSale,
      materialTypeId: row.materialTypeId,
    });
    setEditMode(true);
    setIsOpenAddModal(true);
  };
  // section awchirah
  const getMaterialSections = async () => {
    await MaterialSectionService.get({}).then((response) => {
      setSections(response.response.data);
    });
  };
  const getInventoriesType = async () => {
    await TypeService.get().then((response) => {
      setType(response.response.data);
    });
  };

  const onDelete = async (id: number) => {
    blockContext.block();
    await MaterialSectionService.getById(id)
      .then((response) => {
        if (response.response.sections?.length > 0) {
          modal.error({
            maskClosable: true,
            title: "Алдаа",
            content: (
              <>
                <p>
                  Бараа материал бүртгэгдсэн тул &ldquo;{response.response.name}
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
              await MaterialSectionService.remove(id)
                .then((response) => {
                  if (response.success) {
                    openNofi("success", "Амжилттай устгагдлаа");
                    getMaterialSections();
                  }
                })
                .finally(() => {
                  return;
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
    getMaterialSections();
    getInventoriesType();
  }, []);
  return (
    <div>
      <Row style={{ paddingTop: 12 }} gutter={[12, 24]}>
        <Col md={24} lg={16} xl={19}>
          <Space size={24}>
            <Title level={3}>Үндсэн бүртгэл / Бараа материал / Бүлэг</Title>
            <Button
              type="primary"
              onClick={() => {
                setEditMode(false);
                setSelectedGroupId(undefined);
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
            extra="FULL"
            data={sections}
            isLeaf={true}
            onEdit={checkEdit}
            onDelete={onDelete}
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
          ComponentType="LITTLE"
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
                        extra="HALF"
                        data={sections}
                        isLeaf={true}
                        onClick={(keys, isLeaf) => {
                          checkSectionInMaterial(keys[0]);
                          addForm.setFieldsValue({
                            sectionId: keys![0],
                            isExpand: editMode
                              ? addForm.getFieldValue("isExpand")
                              : !isLeaf,
                          });
                          setIsOpenPopOverAdd(false);
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
                    options={sections?.map((section: IDataMaterialSection) => ({
                      label: section.name,
                      value: section.id,
                    }))}
                  />
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
            {isExpand ? (
              <>
                <div className="switches-col">
                  <Form.Item
                    label="Борлуулах бараа, үйлчилгээ эсэх"
                    name="isSale"
                    valuePropName="checked"
                  >
                    <NewSwitch />
                  </Form.Item>
                </div>
                <Form.Item label="Бараа материалын дансын код холбох">
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
                          message: "Бараа материалын дансын код холбох заавал",
                        },
                        {
                          pattern: /^\d*(?:\.\d+)?$/,
                          message: "Зөвхөн тоо оруулах",
                        },
                      ]}
                    >
                      <NewSelect
                        allowClear
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, label) =>
                          (label?.label ?? "")
                            .toString()
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                        options={type?.map((type) => ({
                          label: type.accountNo + " - " + type.name,
                          value: type.id,
                        }))}
                      />
                    </Form.Item>
                  </Space.Compact>
                </Form.Item>
                <Form.Item label="Зураг оруулах" valuePropName="fileList">
                  <Upload
                    maxCount={1}
                    headers={headers}
                    action={`${process.env.NEXT_PUBLIC_BASEURL}/local-files/fileUpload`}
                    fileList={fileList ? [fileList] : []}
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
              </>
            ) : null}
          </div>
        </Form>
      </NewModal>
      <NewModal
        title=" "
        open={isOpenModalType}
        onCancel={() => setIsOpenModalType(false)}
      >
        <InventoriesType
          ComponentType="MODAL"
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

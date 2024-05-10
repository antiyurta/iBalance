import { SignalFilled, PlusOutlined } from "@ant-design/icons";
import NewDirectoryTree from "@/components/tree";
import { NewInput, NewSelect, NewSwitch } from "@/components/input";
import NewModal from "@/components/modal";
import {
  App,
  Button,
  Col,
  Form,
  Popover,
  Row,
  Space,
  Typography,
  Upload,
} from "antd";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import {
  IDataMaterialSection,
  IParamMaterialSection,
} from "@/service/material/section/entities";
import { MaterialSectionService } from "@/service/material/section/service";
import { IDataMaterialAccount } from "@/service/material/account/entities";
import { MaterialAccountService } from "@/service/material/account/service";
import InventoriesType from "../inventories-type/inventoriesType";
import InventoriesRegistration from "../inventories-registration/inventoriesRegistration";
import { RootState, useTypedSelector } from "@/feature/store/reducer";
import { ReferenceService } from "@/service/reference/reference";
import type { UploadProps } from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import { MaterialService } from "@/service/material/service";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import { MaterialType } from "@/service/material/entities";
import { getFile } from "@/feature/common";
import PageTitle from "@/components/page-title";

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
interface IProps {
  type: MaterialType;
}
const InventoriesGroup = (props: IProps) => {
  const { type } = props;
  const { modal } = App.useApp();
  const [addForm] = Form.useForm<IDataMaterialSection>();
  const isExpand = Form.useWatch("isExpand", addForm);
  const {
    login_data: {
      response: { accessToken },
    },
  } = useTypedSelector((state: RootState) => state.core);
  const blockContext: BlockView = useContext(BlockContext); // uildeliig blockloh
  const [params, setParams] = useState<IParamMaterialSection>({
    materialType: type,
  });
  const [sections, setSections] = useState<IDataMaterialSection[]>([]);
  const [isOpenAddModal, setIsOpenAddModal] = useState<boolean>(false);
  const [isOpenChangeModal, setIsOpenChangeModal] = useState<boolean>(false);
  const [isOpenPopOverAdd, setIsOpenPopOverAdd] = useState<boolean>(false);
  const [accounts, setAccounts] = useState<IDataMaterialAccount[]>([]);
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
        }
      });
    }
  };
  const onFinish = async (values: IDataMaterialSection) => {
    values.isExpand = !values.isExpand;
    if (fileList?.response?.response.id) {
      values.fileId = fileList?.response?.response.id;
    }
    values.type = type;
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
      materialType: type,
      sectionId: [sectionId],
    }).then((response) => {
      if (response.response.length > 0) {
        setIsHaveChild(true);
      } else {
        setIsHaveChild(false);
      }
    });
  };
  const checkEdit = async (row: IDataMaterialSection) => {
    if (!row.isExpand) {
      checkSectionInMaterial(row.id);
    } else {
      checkTreeIn(row.id);
    }
    setFileList(undefined);
    setSelectedGroupId(row.id);
    setSelectedSectionId(row.sectionId);
    addForm.setFieldsValue({
      name: row.name,
      sectionId: row.sectionId,
      isExpand: !row.isExpand,
      isSale: row.isSale,
      materialAccountId: row.materialAccountId,
    });
    if (row.fileId) {
      const blobImage = await getFile(row.fileId);
      setFileList({
        uid: row.id.toString(),
        name: row.fileId.toString(),
        status: "done",
        url: blobImage,
        response: {
          message: "success",
          response: {
            id: row.id,
            filename: "image",
            mimetype: "asdas",
            path: "sadsad",
          },
          success: true,
        },
      });
    }
    setEditMode(true);
    setIsOpenAddModal(true);
  };
  // section awchirah
  const getMaterialSections = async () => {
    await MaterialSectionService.get(params).then((response) => {
      setSections(response.response);
    });
  };
  const getInventoriesType = async () => {
    await MaterialAccountService.get().then((response) => {
      setAccounts(response.response.data);
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
                  Барааны бүлэг бүртгэгдсэн тул &ldquo;{response.response.name}
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
      <PageTitle
        onClick={() => {
          setEditMode(false);
          setSelectedGroupId(undefined);
          setIsOpenAddModal(true);
          addForm.resetFields();
        }}
      />
      <Row style={{ paddingTop: 12 }} gutter={[12, 24]}>
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
              Барааны бүлэг өөрчлөх
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
        title="Бараа материалын бүлэг өөрчлөх"
        width={1300}
        open={isOpenChangeModal}
        onCancel={() => setIsOpenChangeModal(false)}
        footer={null}
      >
        <InventoriesRegistration
          ComponentType="LITTLE"
          onClickModal={(e) => setIsOpenChangeModal(e)}
          materialType={type}
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
                    content={<NewDirectoryTree data={sections} />}
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
                <Form.Item label="Холбох дансны код">
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
                      name="materialAccountId"
                      rules={[
                        {
                          required: true,
                          message: "Холбох дансны код заавал",
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
                        options={accounts?.map((account) => ({
                          label: account.accountNo + " - " + account.name,
                          value: account.id,
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
              materialAccountId: row.id,
            });
            setIsOpenModalType(false);
          }}
        />
      </NewModal>
    </div>
  );
};
export default InventoriesGroup;

"use client";

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
import Image from "next/image";
import { IDataBalance } from "@/service/material/balance/entities";
import { useEffect, useState } from "react";
import Thumbnail from "./thumbnail";
import Detailed from "./detailed";
import NewModal from "@/components/modal";
import { balanceService } from "@/service/material/balance/service";
import {
  IDataUnitOfMeasure,
  IParamUnitOfMeasure,
} from "@/service/material/unitOfMeasure/entities";
import { UnitOfMeasureService } from "@/service/material/unitOfMeasure/service";
import {
  IDataMaterialSection,
  IParamMaterialSection,
} from "@/service/material/section/entities";
import { MaterialSectionService } from "@/service/material/section/service";
import EditableTableBalance from "./editableTable";
import {
  IDataStorage,
  IParamsStorage,
} from "@/service/material/storage/entities";
import { StorageSerivce } from "@/service/material/storage/service";
import { NewInput, NewSelect } from "@/components/input";
import InventoriesRegistration from "../inventories-registration/inventoriesRegistration";
import { IDataMaterial, IParamMaterial } from "@/service/material/entities";
import { MaterialService } from "@/service/material/service";

const { Title } = Typography;
const BeginningBalancePage = () => {
  const [form] = Form.useForm();
  const [isReloadList, setIsReloadList] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [isOpenPopOver, setIsOpenPopOver] = useState<boolean>(false);
  const [measumerments, setMeasurements] = useState<IDataUnitOfMeasure[]>([]);
  const [materialSections, setMaterialSections] = useState<
    IDataMaterialSection[]
  >([]);
  const [materials, setMaterials] = useState<IDataMaterial[]>([]);
  const [storages, setStorages] = useState<IDataStorage[]>([]);
  const [materialDictionary, setMaterialDictionary] =
    useState<Map<number, IDataMaterial>>();
  const [selectedRow, setSelectedRow] = useState<IDataBalance>();
  const items = [
    {
      label: "Бараа материалын жагсаалт",
      key: "item-1",
      children: (
        <Thumbnail
          onReload={isReloadList}
          onEdit={(row) => openModal(true, row)}
          onDelete={(id: number) => {
            throw new Error("Function not implemented.");
          }}
        />
      ),
    },
    {
      label: "Дэлгэрэнгүй жагсаалт",
      key: "item-2",
      children: <Detailed />,
    },
  ];
  // START get data
  const getMeasurements = async (param: IParamUnitOfMeasure) => {
    await UnitOfMeasureService.get(param).then((response) => {
      if (response.success) {
        setMeasurements(response.response.data);
      }
    });
  };
  const getMaterialSections = async (param: IParamMaterialSection) => {
    await MaterialSectionService.get(param).then((response) => {
      if (response.success) {
        setMaterialSections(response.response.data);
      }
    });
  };
  const getStorages = async (param: IParamsStorage) => {
    await StorageSerivce.get(param).then((response) => {
      if (response.success) {
        setStorages(response.response.data);
      }
    });
  };
  const getMaterials = async (param: IParamMaterial) => {
    await MaterialService.get(param).then((response) => {
      if (response.success) {
        setMaterials(response.response.data);
      }
    });
  };
  useEffect(() => {
    getMeasurements({});
    getMaterialSections({});
    getStorages({});
    getMaterials({});
  }, []);

  // END get data
  const materialFormField = (id: number) => {
    const material = materialDictionary?.get(id);
    if (material) {
      form.setFieldsValue({
        name: material.name,
        measurementId: material.measurementId,
        materialSectionId: material.materialSectionId,
        countPackage: material.countPackage,
      });
    }
  };
  useEffect(() => {
    setMaterialDictionary(
      materials.reduce((dict, material) => {
        dict.set(material.id, material);
        return dict;
      }, new Map<number, IDataMaterial>())
    );
  }, [materials]);
  const openModal = (state: boolean, row?: IDataBalance) => {
    setIsReloadList(false);
    setEditMode(state);
    form.resetFields();
    if (state && row) {
      setSelectedRow(row);
      form.resetFields();
      form.setFieldsValue(row);
      materialFormField(row.materialId);
    }
    setIsOpenModal(true);
  };
  const onFinish = async (values: IDataBalance) => {
    if (editMode && selectedRow) {
      await balanceService.patch(selectedRow.id, values).then((response) => {
        if (response.success) {
          setIsOpenModal(false);
          setIsReloadList(true);
        }
      });
    } else {
      await balanceService.post(values).then((response) => {
        if (response.success) {
          setIsOpenModal(false);
          setIsReloadList(true);
        }
      });
    }
  };
  return (
    <div>
      <Row gutter={[12, 24]}>
        <Col md={24} lg={16} xl={19}>
          <Space size={24}>
            <Title level={5}>
              Үндсэн бүртгэл / Бараа материал / Эхний үлдэгдэл
            </Title>
            <Button
              type="primary"
              onClick={() => openModal(false)}
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
        title="Барааны эхний үлдэгдэл"
        open={isOpenModal}
        onCancel={() => setIsOpenModal(false)}
        onOk={() =>
          form.validateFields().then((values) => {
            onFinish(values);
          })
        }
        width={560}
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
            <div className="inputs-gird-2">
              <Form.Item label="Дотоод код">
                <Space.Compact>
                  <div className="extraButton">
                    <Image
                      onClick={() => setIsOpenPopOver(true)}
                      src="/icons/clipboardBlack.svg"
                      width={16}
                      height={16}
                      alt="clipboard"
                    />
                  </div>
                  <Form.Item
                    name="materialId"
                    rules={[
                      {
                        required: true,
                        message: "Дотоод код",
                      },
                      {
                        pattern: /^\d*(?:\.\d+)?$/,
                        message: "Зөвхөн тоо оруулах",
                      },
                    ]}
                  >
                    <NewSelect
                      onSelect={materialFormField}
                      options={materials?.map((material) => ({
                        label: material.code,
                        value: material.id,
                      }))}
                    />
                  </Form.Item>
                </Space.Compact>
              </Form.Item>
              <Form.Item label="Бараа материалын нэр" name="name">
                <NewInput disabled />
              </Form.Item>
              <Form.Item label="Хэмжих нэгж" name="measurementId">
                <NewSelect
                  disabled
                  options={measumerments?.map((measumerment, index) => ({
                    label: measumerment.name,
                    value: measumerment.id,
                  }))}
                />
              </Form.Item>
              <Form.Item
                label="Бараа материалын бүлэг"
                name="materialSectionId"
              >
                <NewSelect
                  disabled
                  options={materialSections?.map((section, index) => ({
                    label: section.name,
                    value: section.id,
                  }))}
                />
              </Form.Item>
              <Form.Item label="Багцын доторх тоо" name="countPackage">
                <InputNumber disabled />
              </Form.Item>
              <Form.Item label="Эхний үлдэгдэл" name="quantity">
                <InputNumber disabled />
              </Form.Item>
            </div>
            <Form.List name="materialStorageBalances">
              {(accounts, { add, remove }) => (
                <EditableTableBalance
                  data={accounts}
                  form={form}
                  editMode={editMode}
                  add={add}
                  remove={remove}
                  storages={storages}
                />
              )}
            </Form.List>
          </div>
        </Form>
      </NewModal>
      <NewModal
        title=" "
        width={1200}
        open={isOpenPopOver}
        onCancel={() => setIsOpenPopOver(false)}
        footer={null}
      >
        <InventoriesRegistration
          ComponentType="MIDDLE"
          onClickModal={(row: IDataMaterial) => {
            console.log(row);
            // form.setFieldsValue({
            // consumerId: row.id,
            // });
            // setIsOpenPopOver(false);
          }}
        />
      </NewModal>
    </div>
  );
};
export default BeginningBalancePage;

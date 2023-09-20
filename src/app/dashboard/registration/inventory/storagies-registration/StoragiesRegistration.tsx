import ColumnSettings from "@/components/columnSettings";
import NewDirectoryTree from "@/components/directoryTree";
import Filtered from "@/components/filtered";
import { NewInputNumber, NewOption, NewSelect } from "@/components/input";
import NewModal from "@/components/modal";
import { NewTable } from "@/components/table";
import { findIndexInColumnSettings, onCloseFilterTag } from "@/feature/common";
import {
  ComponentType,
  DataIndexType,
  FilteredColumns,
  IFilters,
  Meta,
} from "@/service/entities";
import { IParamsStorage } from "@/service/material/storage/entities";
import { StorageSerivce } from "@/service/material/storage/service";
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
  Popover,
  Row,
  Space,
  Typography,
} from "antd";
import Image from "next/image";
import { useEffect, useState } from "react";
import { SignalFilled } from "@ant-design/icons";

interface IProps {
  ComponentType: ComponentType;
}

const { Title } = Typography;

const StoragiesRegistration = (props: IProps) => {
  const { ComponentType } = props;
  const [form] = Form.useForm();
  const [sections, setSections] = useState<IDataTreeSection[]>([]);
  const [newParams, setNewParams] = useState<IParamsStorage>({});
  const [data, setData] = useState<any[]>([]);
  const [meta, setMeta] = useState<Meta>({ page: 1, limit: 10 });
  const [filters, setFilters] = useState<IFilters>();
  const [editMode, setIsEditMode] = useState<boolean>(false);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [isOpenPopOver, setIsOpenPopOver] = useState<boolean>(false);
  const [columns, setColumns] = useState<FilteredColumns>({
    code: {
      label: "Харилцагчийн код",
      isView: true,
      isFiltered: false,
      dataIndex: "code",
      type: DataIndexType.MULTI,
    },
  });
  const openModal = (state: boolean, row?: any) => {
    setIsEditMode(state);
    form.resetFields();
    if (state && row) {
      //   const data: IInputConsumerMembership = {
      //     consumerId: consumer.id,
      //     cards: consumer.memberships.map((card) => ({
      //       ...card,
      //       endAt: dayjs(card.endAt),
      //       name: card.membership.name,
      //     })),
      //   };
      //   consumerFormField(consumer.id);
      form.setFieldsValue(data);
    }
    setIsOpenModal(true);
  };
  const getData = async (params: IParamsStorage) => {
    await StorageSerivce.get(params).then((response) => {
      if (response.success) {
        setData(response.response.data);
        setMeta(response.response.meta);
        setFilters(response.response.filter);
      }
    });
  };
  const getSections = async (type: TreeSectionType) => {
    await TreeSectionService.get(type).then((response) => {
      if (response.success) {
        setSections(response.response);
      }
    });
  };
  const onDelete = (id: number) => {};
  useEffect(() => {
    getData({ page: 1, limit: 10 });
    getSections(TreeSectionType.Storage);
  }, []);
  return (
    <div>
      <Row style={{ paddingTop: 12 }} gutter={[12, 24]}>
        {ComponentType === "FULL" ? (
          <>
            <Col md={24} lg={16} xl={19}>
              <Space size={24}>
                <Title level={5}>
                  Үндсэн бүртгэл / Бараа материал / Байршлын бүртгэл
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
            <Col md={24} lg={8} xl={5}>
              <Input.Search />
            </Col>
          </>
        ) : null}
        <Col md={24} lg={10} xl={6}>
          <NewDirectoryTree
            mode="STORAGE"
            extra="HALF"
            data={sections}
            isLeaf={true}
            onClick={(key) => {
              //   getData({ page: 1, limit: 10, sectionId: [`${key}`] });
            }}
          />
        </Col>
        <Col md={24} lg={14} xl={18}>
          <Row gutter={[0, 12]}>
            <Col sm={24}>
              <Space
                style={{
                  width: "100%",
                  justifyContent: "flex-end",
                }}
                size={12}
              >
                <Filtered
                  columns={columns}
                  isActive={(key, state) => {
                    onCloseFilterTag({
                      key: key,
                      state: state,
                      column: columns,
                      onColumn: (columns) => setColumns(columns),
                      params: newParams,
                      onParams: (params) => setNewParams(params),
                    });
                    getData(newParams);
                  }}
                />
                <Space
                  style={{
                    width: "100%",
                    justifyContent: "flex-end",
                  }}
                  size={12}
                >
                  <ColumnSettings
                    columns={columns}
                    columnIndexes={(arg1, arg2) =>
                      findIndexInColumnSettings({
                        newRowIndexes: arg1,
                        unSelectedRow: arg2,
                        columns: columns,
                        onColumns: (columns) => setColumns(columns),
                        params: newParams,
                        onParams: (params) => setNewParams(params),
                        getData: (params) => getData(params),
                      })
                    }
                  />
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
              </Space>
            </Col>
            <Col span={24}>
              <NewTable
                scroll={{
                  x: 1700,
                }}
                rowKey="id"
                data={data}
                meta={meta}
                columns={columns}
                onChange={(params) => getData(params)}
                onColumns={(columns) => setColumns(columns)}
                newParams={newParams}
                onParams={(params) => setNewParams(params)}
                incomeFilters={filters}
                onEdit={(row) => openModal(true, row)}
                onDelete={(id) => onDelete(id)}
              />
            </Col>
          </Row>
        </Col>
      </Row>
      <NewModal
        width={290}
        title="Байршлын бүртгэл"
        open={isOpenModal}
        onCancel={() => setIsOpenModal(false)}
      >
        <Form form={form} layout="vertical">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <Form.Item label="Байршлын код" name="code">
              <NewInputNumber />
            </Form.Item>
            <Form.Item label="Байршлын код" name="code">
              <NewInputNumber />
            </Form.Item>
            <Form.Item label="Харилцагчийн код">
              <Space.Compact>
                <div className="extraButton">
                  <Popover
                    placement="bottom"
                    open={isOpenPopOver}
                    onOpenChange={(state) => setIsOpenPopOver(state)}
                    content={
                      <NewDirectoryTree
                        mode={"STORAGE"}
                        data={sections}
                        extra="HALF"
                        isLeaf={true}
                        onClick={(key, isLeaf) => {
                          if (isLeaf) {
                            setIsOpenPopOver(false);
                            form.setFieldsValue({
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
                <Form.Item name="sectionId">
                  <NewSelect>
                    {sections?.map((section, index) => {
                      return (
                        <NewOption
                          style={{
                            display: section.isExpand ? "none" : "block",
                          }}
                          key={index}
                          value={section.id}
                        >
                          {section.name}
                        </NewOption>
                      );
                    })}
                  </NewSelect>
                </Form.Item>
                <div
                  style={{
                    marginLeft: 4,
                  }}
                  className="app-button-square"
                  //   onClick={() => setIsOpenModalBrand(true)}
                >
                  <Image
                    src={"/icons/plusGray.svg"}
                    height={18}
                    width={18}
                    alt="plsu"
                  />
                </div>
              </Space.Compact>
            </Form.Item>
          </div>
        </Form>
      </NewModal>
    </div>
  );
};
export default StoragiesRegistration;

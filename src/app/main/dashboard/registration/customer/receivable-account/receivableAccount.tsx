import ColumnSettings from "@/components/columnSettings";
import Filtered from "@/components/table/filtered";
import { NewInput } from "@/components/input";
import {
  findIndexInColumnSettings,
  getParam,
  onCloseFilterTag,
} from "@/feature/common";
import {
  ComponentType,
  DataIndexType,
  FilteredColumns,
  Meta,
} from "@/service/entities";
import {
  IDataReferenceAccount,
  IFilterReferenceAccount,
  IParamReferenceAccount,
} from "@/service/reference/account/entities";
import { referenceAccountService } from "@/service/reference/account/service";
import { Button, Col, Form, Input, Row, Space, Typography } from "antd";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import NewModal from "@/components/modal";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import { NewTable } from "@/components/table";
import { useTypedSelector } from "@/feature/store/reducer";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/feature/store/store";
import { newPane } from "@/feature/store/slice/param.slice";

interface IProps {
  ComponentType: ComponentType;
  onClickModal?: (row: IDataReferenceAccount) => void;
}

const { Title } = Typography;
const key = "customer/receivable-account";
const ReceivableAccount = (props: IProps) => {
  const { ComponentType = "FULL", onClickModal } = props;
  const [form] = Form.useForm();
  const blockContext: BlockView = useContext(BlockContext); // uildeliig blockloh
  const [data, setData] = useState<IDataReferenceAccount[]>([]);
  const [meta, setMeta] = useState<Meta>({ page: 1, limit: 10 });
  const [filters, setFilters] = useState<IFilterReferenceAccount>();
  const [editMode, setEditMode] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<IDataReferenceAccount>();
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const { items } = useTypedSelector((state) => state.pane);
  const param = getParam(items, key);
  const dispatch = useDispatch<AppDispatch>();
  const [columns, setColumns] = useState<FilteredColumns>({
    code: {
      label: "Дансны код",
      isView: true,
      isFiltered: false,
      dataIndex: ["code"],
      type: DataIndexType.MULTI,
    },
    name: {
      label: "Дансны нэр",
      isView: true,
      isFiltered: false,
      dataIndex: ["name"],
      type: DataIndexType.MULTI,
    },
    updatedAt: {
      label: "Өөрчлөлт хийсэн огноо",
      isView: ComponentType === "FULL" ? true : false,
      isFiltered: false,
      dataIndex: ["updatedAt"],
      type: DataIndexType.DATE,
    },
    updatedBy: {
      label: "Өөрчлөлт хийсэн хэрэглэгч",
      isView: ComponentType === "FULL" ? true : false,
      isFiltered: false,
      dataIndex: ["updatedUser", "firstName"],
      type: DataIndexType.USER,
    },
  });
  // data awcihrah
  const getData = async () => {
    blockContext.block();
    const params: IParamReferenceAccount = { ...param };
    await referenceAccountService
      .get(params)
      .then((response) => {
        if (response.success) {
          setData(response.response.data);
          setMeta(response.response.meta);
          setFilters(response.response.filter);
        }
      })
      .finally(() => {
        blockContext.unblock();
      });
  };
  // data post hiih
  const onFinish = async (values: IDataReferenceAccount) => {
    if (editMode && selectedRow) {
      await referenceAccountService
        .patch(selectedRow.id, values)
        .then((response) => {
          if (response.success) {
            setSelectedRow(response.response.data);
            setIsOpenModal(false);
            getData();
          }
        });
    } else {
      await referenceAccountService.post(values).then((response) => {
        if (response.success) {
          getData();
          setIsOpenModal(false);
        }
      });
    }
  };
  const onDelete = async (id: number) => {
    blockContext.block();
    await referenceAccountService
      .remove(id)
      .then((response) => {
        if (response.success) {
          setSelectedRow(undefined);
          getData();
        }
      })
      .finally(() => {
        blockContext.unblock();
      });
  };
  useEffect(() => {
    dispatch(newPane({ key, param: {} }));
  }, []);
  useEffect(() => {
    getData();
  }, [param]);
  return (
    <div>
      <Row gutter={[12, 24]}>
        {ComponentType === "FULL" ? (
          <>
            <Col md={24} lg={16} xl={19}>
              <Space size={24}>
                <Title level={3}>
                  Үндсэн бүртгэл / Харилцагч / Авлага дансны бүртгэл
                </Title>
                <Button
                  type="primary"
                  onClick={() => {
                    form.resetFields();
                    setEditMode(false);
                    setIsOpenModal(true);
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
          </>
        ) : null}
        <Col sm={24}>
          <Space
            style={{
              width: "100%",
              justifyContent: "flex-end",
            }}
            size={12}
          >
            <Filtered columns={columns} />
            {ComponentType === "FULL" ? (
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
                  src={"/images/UploadIcon.svg"}
                  width={24}
                  height={24}
                  alt="uploadIcon"
                />
                <Image
                  src={"/images/DownloadIcon.svg"}
                  width={24}
                  height={24}
                  alt="downloadIcon"
                />
              </Space>
            ) : null}
          </Space>
        </Col>
        <Col span={24}>
          <NewTable
            scroll={{
              x: ComponentType === "FULL" ? 500 : 400,
            }}
            rowKey="id"
            doubleClick={true}
            onDClick={(value) => {
              if (ComponentType === "MIDDLE") {
                onClickModal?.(value);
              }
            }}
            data={data}
            meta={meta}
            columns={columns}
            onColumns={(columns) => setColumns(columns)}
            incomeFilters={filters}
            isEdit={true}
            onEdit={(row) => {
              setEditMode(true);
              form.setFieldsValue(row);
              setSelectedRow(row);
              setIsOpenModal(true);
            }}
            isDelete={true}
            onDelete={(id) => onDelete(id)}
          />
        </Col>
      </Row>
      <NewModal
        title={editMode ? "Авлагын данс засах" : "Авлагын данс бүртгэл"}
        open={isOpenModal}
        onCancel={() => setIsOpenModal(false)}
        onOk={() =>
          form.validateFields().then((values) => {
            onFinish(values);
          })
        }
      >
        <Form form={form} layout="vertical">
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Form.Item
              label="Дансны код"
              name="code"
              rules={[
                {
                  required: true,
                  message: "Заавал",
                },
              ]}
            >
              <NewInput
                style={{
                  width: 225,
                }}
              />
            </Form.Item>
            <Form.Item
              label="Дансны нэр"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Заавал",
                },
              ]}
            >
              <NewInput
                style={{
                  width: 225,
                }}
              />
            </Form.Item>
          </div>
        </Form>
      </NewModal>
    </div>
  );
};
export default ReceivableAccount;

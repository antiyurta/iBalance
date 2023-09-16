import ColumnSettings from "@/components/columnSettings";
import Filtered from "@/components/filtered";
import { NewInput } from "@/components/input";
import {
  findIndexInColumnSettings,
  onCloseFilterTag,
  unDuplicate,
} from "@/feature/common";
import {
  DataIndexType,
  FilteredColumns,
  IFilters,
  Meta,
} from "@/service/entities";
import {
  IDataReceivableAccount,
  Params,
} from "@/service/receivable-account/entities";
import { ReceivableAccountService } from "@/service/receivable-account/service";
import { Button, Col, Form, Input, Row, Space, Typography } from "antd";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import NewModal from "@/components/modal";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import { NewTable } from "@/components/table";

interface IProps {
  ComponentsType: string;
  onClickModal?: (row: IDataReceivableAccount) => void;
}

const { Title } = Typography;

const ReceivableAccount = (props: IProps) => {
  const { ComponentsType = "FULL", onClickModal } = props;
  const [form] = Form.useForm();
  const blockContext: BlockView = useContext(BlockContext); // uildeliig blockloh
  const [data, setData] = useState<IDataReceivableAccount[]>([]);
  const [meta, setMeta] = useState<Meta>({ page: 1, limit: 10 });
  const [filters, setFilters] = useState<IFilters>();
  const [editMode, setEditMode] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<IDataReceivableAccount>();
  const [newParams, setNewParams] = useState<Params>({});
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [isOpenActionPopover, setIsOpenActionPopover] =
    useState<boolean>(false);
  const [columns, setColumns] = useState<FilteredColumns>({
    code: {
      label: "Дансны код",
      isView: true,
      isFiltered: false,
      dataIndex: "code",
      type: DataIndexType.MULTI,
    },
    name: {
      label: "Дансны нэр",
      isView: true,
      isFiltered: false,
      dataIndex: "name",
      type: DataIndexType.MULTI,
    },
    updatedAt: {
      label: "Өөрчлөлт хийсэн огноо",
      isView: ComponentsType === "FULL" ? true : false,
      isFiltered: false,
      dataIndex: "updatedAt",
      type: DataIndexType.DATE,
    },
    updatedBy: {
      label: "Өөрчлөлт хийсэн хэрэглэгч",
      isView: ComponentsType === "FULL" ? true : false,
      isFiltered: false,
      dataIndex: ["updatedUser", "firstName"],
      type: DataIndexType.USER,
    },
  });
  // data awcihrah
  const getReceivableAccounts = async (params: Params) => {
    blockContext.block();
    var prm: Params = {
      page: params.page || newParams.page,
      limit: params.limit || newParams.limit,
      orderParam: params.orderParam || newParams.orderParam,
      order: params.order || newParams.order,
      code: params.code || newParams.code,
      name: params.name || newParams.name,
      updatedAt: params.updatedAt || newParams.updatedAt,
      updatedBy: params.updatedBy || newParams.updatedBy,
      queries: newParams.queries,
    };
    if (params.queries?.length) {
      const incomeParam = params.queries[0].param;
      prm.queries = [...unDuplicate(incomeParam, newParams), ...params.queries];
    }
    if (params.code) {
      prm.queries = [...unDuplicate("code", newParams)];
    }
    if (params.name) {
      prm.queries = [...unDuplicate("name", newParams)];
    }
    if (params.updatedAt) {
      prm.queries = [...unDuplicate("updatedAt", newParams)];
    }
    if (params.updatedBy) {
      prm.queries = [...unDuplicate("updatedBy", newParams)];
    }
    setNewParams(prm);
    await ReceivableAccountService.get(prm)
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
  const onFinish = async (values: IDataReceivableAccount) => {
    if (editMode) {
      await ReceivableAccountService.patch(selectedRow?.id, values).then(
        (response) => {
          if (response.success) {
            setSelectedRow(response.response);
            setIsOpenModal(false);
            getReceivableAccounts({ page: 1, limit: 10 });
          }
        }
      );
    } else {
      await ReceivableAccountService.post(values).then((response) => {
        if (response.success) {
          getReceivableAccounts(newParams);
          setIsOpenModal(false);
        }
      });
    }
  };
  const onDelete = async (id: number) => {
    blockContext.block();
    await ReceivableAccountService.remove(id).then((response) => {
      if (response.success) {
        setSelectedRow(undefined);
        getReceivableAccounts({ page: 1, limit: 10 });
      }
    });
    blockContext.unblock();
  };
  useEffect(() => {
    getReceivableAccounts({ page: 1, limit: 10 });
  }, []);
  return (
    <div>
      <Row gutter={[12, 24]}>
        <Col md={24} lg={16} xl={19}>
          <Space size={24}>
            {ComponentsType === "FULL" ? (
              <Title level={5}>
                Үндсэн бүртгэл / Харилцагч / Авлага дансны бүртгэл
              </Title>
            ) : (
              <Title>Авлагын дансны бүртгэл</Title>
            )}
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
                getReceivableAccounts(newParams);
              }}
            />
            {ComponentsType === "FULL" ? (
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
                      getData: (params) => getReceivableAccounts(params),
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
              x: ComponentsType === "FULL" ? 500 : 400,
            }}
            rowKey="id"
            doubleClick={true}
            onDClick={(value) => {
              if (ComponentsType === "MIDDLE") {
                onClickModal?.(value);
              }
            }}
            data={data}
            meta={meta}
            columns={columns}
            onChange={(params) => getReceivableAccounts(params)}
            onColumns={(columns) => setColumns(columns)}
            newParams={newParams}
            onParams={(params) => setNewParams(params)}
            incomeFilters={filters}
            onEdit={(row) => {
              setEditMode(true);
              form.setFieldsValue(row);
              setSelectedRow(row);
              setIsOpenModal(true);
            }}
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

import ColumnSettings from "@/components/columnSettings";
import NewDirectoryTree from "@/components/tree";
import Filtered from "@/components/table/filtered";
import { NewTable } from "@/components/table";
import {
  findIndexInColumnSettings,
  getParam,
  onCloseFilterTag,
} from "@/feature/common";
import {
  IDataTreeSection,
  TreeSectionType,
} from "@/service/reference/tree-section/entities";
import { DataIndexType, Meta } from "@/service/entities";
import { Col, Row, Space } from "antd";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ConsumerService } from "@/service/consumer/service";
import {
  FilteredColumnsConsumer,
  IDataConsumer,
  IFilterConsumer,
  IParamConsumer,
} from "@/service/consumer/entities";
import { TreeSectionService } from "@/service/reference/tree-section/service";
import NewModal from "@/components/modal";
import { useTypedSelector } from "@/feature/store/reducer";
import { AppDispatch } from "@/feature/store/store";
import { useDispatch } from "react-redux";
import { changeParam, newPane } from "@/feature/store/slice/param.slice";

interface IProps {
  onReload: boolean;
  onEdit: (row: IDataConsumer) => void;
  onDelete: (id: number) => void;
}
const key = "membership-card/customer-list";
const CustomerList = (props: IProps) => {
  const { onReload, onEdit, onDelete } = props;
  const [sections, setSections] = useState<IDataTreeSection[]>([]);
  const [data, setData] = useState<IDataConsumer[]>([]);
  const [meta, setMeta] = useState<Meta>({ page: 1, limit: 10 });
  const [filters, setFilters] = useState<IFilterConsumer>();
  const { items } = useTypedSelector((state) => state.pane);
  const param = getParam(items, key);
  const dispatch = useDispatch<AppDispatch>();
  const [columns, setColumns] = useState<FilteredColumnsConsumer>({
    code: {
      label: "Харилцагчийн код",
      isView: true,
      isFiltered: false,
      dataIndex: ["code"],
      type: DataIndexType.MULTI,
    },
    isIndividual: {
      label: "Хувь хүн эсэх",
      isView: true,
      isFiltered: false,
      dataIndex: ["isIndividual"],
      type: DataIndexType.BOOLEAN,
    },
    isEmployee: {
      label: "Ажилтан эсэх",
      isView: true,
      isFiltered: false,
      dataIndex: ["isEmployee"],
      type: DataIndexType.BOOLEAN,
    },
    lastName: {
      label: "Харилцагчийн овог",
      isView: true,
      isFiltered: false,
      dataIndex: ["lastName"],
      type: DataIndexType.MULTI,
    },
    name: {
      label: "Харилцагчийн нэр",
      isView: true,
      isFiltered: false,
      dataIndex: ["name"],
      type: DataIndexType.MULTI,
    },
    sectionName: {
      label: "Харилцагчийн бүлэг",
      isView: true,
      isFiltered: false,
      dataIndex: ["section", "name"],
      type: DataIndexType.STRING_SECTION,
    },
    regno: {
      label: "Регистр №",
      isView: true,
      isFiltered: false,
      dataIndex: ["regno"],
      type: DataIndexType.MULTI,
    },
    phone: {
      label: "Утасны дугаар",
      isView: true,
      isFiltered: false,
      dataIndex: ["phone"],
      type: DataIndexType.MULTI,
    },
    address: {
      label: "Хаяг",
      isView: true,
      isFiltered: false,
      dataIndex: ["address"],
      type: DataIndexType.MULTI,
    },
    bank: {
      label: "Банкны нэр",
      isView: true,
      isFiltered: false,
      dataIndex: ["bank", "name"],
      type: DataIndexType.MULTI,
    },
    bankAccountNo: {
      label: "Дансны дугаар",
      isView: true,
      isFiltered: false,
      dataIndex: ["bankAccountNo"],
      type: DataIndexType.MULTI,
    },
    email: {
      label: "И-мэйл хаяг",
      isView: false,
      isFiltered: false,
      dataIndex: ["email"],
      type: DataIndexType.MULTI,
    },
    isActive: {
      label: "Төлөв",
      isView: true,
      isFiltered: false,
      dataIndex: ["isActive"],
      type: DataIndexType.BOOLEAN,
    },
    createdAt: {
      label: "Карт нээсэн огноо",
      isView: true,
      isFiltered: false,
      dataIndex: ["createdAt"],
      type: DataIndexType.DATE,
    },
    updatedAt: {
      label: "Өөрчлөлт хийсэн огноо",
      isView: false,
      isFiltered: false,
      dataIndex: ["updatedAt"],
      type: DataIndexType.DATE,
    },
    updatedBy: {
      label: "Өөрчлөлт хийсэн хэрэглэгч",
      isView: true,
      isFiltered: false,
      dataIndex: ["updatedUser", "firstName"],
      type: DataIndexType.USER,
    },
  });
  const [isUploadModal, setIsUploadModal] = useState<boolean>(false);
  //
  const getData = async () => {
    const params: IParamConsumer = { ...param, isMembership: true };
    await ConsumerService.get(params).then((response) => {
      if (response.success) {
        setData(response.response.data);
        setMeta(response.response.meta);
        setFilters(response.response.filter);
      }
    });
  };
  const getTreeSections = async () => {
    await TreeSectionService.get(TreeSectionType.Consumer).then((response) => {
      if (response.success) {
        setSections(response.response);
      }
    });
  };
  useEffect(() => {
    dispatch(newPane({ key, param: {} }));
    getTreeSections();
  }, []);

  useEffect(() => {
    getData();
  }, [param, onReload]);

  return (
    <div>
      <Row gutter={[12, 24]}>
        <Col md={24} lg={10} xl={6}>
          <NewDirectoryTree
            data={sections}
            onClick={(sectionNames) => {
              dispatch(
                changeParam({
                  ...param,
                  filters: [
                    {
                      dataIndex: ["section", "name"],
                      operator: "IN",
                      filter: sectionNames,
                    },
                  ],
                })
              );
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
                <Filtered columns={columns} />
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
                        onColumns: setColumns,
                      })
                    }
                    defaultColumns={columns}
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
                    onClick={() => setIsUploadModal(true)}
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
                onColumns={setColumns}
                incomeFilters={filters}
                isEdit={true}
                onEdit={(row) => onEdit(row)}
                isDelete={true}
                onDelete={(id) => onDelete(id)}
              />
            </Col>
          </Row>
        </Col>
      </Row>
      <NewModal
        title="Файл оруулах"
        open={isUploadModal}
        onCancel={() => setIsUploadModal(false)}
      >
        {/* <UploadExcelFile url="localfile" /> */}
      </NewModal>
    </div>
  );
};
export default CustomerList;

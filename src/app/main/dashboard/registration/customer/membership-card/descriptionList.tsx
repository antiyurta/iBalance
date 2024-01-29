import ColumnSettings from "@/components/columnSettings";
import Filtered from "@/components/filtered";
import { NewTable } from "@/components/table";
import { findIndexInColumnSettings, onCloseFilterTag } from "@/feature/common";
import { DataIndexType, Meta } from "@/service/entities";
import {
  FilteredColumnsConsumerMembership,
  IDataConsumerMembership,
  IFilterConsumerMembership,
  IParamConsumerMembership,
} from "@/service/consumer/membership/entities";
import { ConsumerMembershipService } from "@/service/consumer/membership/service";
import { Col, Row, Space } from "antd";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { IDataConsumer } from "@/service/consumer/entities";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import { ConsumerService } from "@/service/consumer/service";

interface IProps {
  onReload: boolean;
  onEdit: (row: IDataConsumer) => void;
}

const DescriptionList = (props: IProps) => {
  const { onReload, onEdit } = props;
  const blockContext: BlockView = useContext(BlockContext);
  const [newParams, setNewParams] = useState<IParamConsumerMembership>({});
  const [data, setData] = useState<IDataConsumerMembership[]>([]);
  const [meta, setMeta] = useState<Meta>({ page: 1, limit: 10 });
  const [filters, setFilters] = useState<IFilterConsumerMembership>();
  const [columns, setColumns] = useState<FilteredColumnsConsumerMembership>({
    consumerCode: {
      label: "Харилцагчийн код",
      isView: true,
      isFiltered: false,
      dataIndex: ["consumer", "code"],
      type: DataIndexType.MULTI,
    },
    consumerIsIndividual: {
      label: "Хувь хүн эсэх",
      isView: false,
      isFiltered: false,
      dataIndex: ["consumer", "isIndividual"],
      type: DataIndexType.BOOLEAN,
    },
    consumerIsEmployee: {
      label: "Ажилтан эсэх",
      isView: false,
      isFiltered: false,
      dataIndex: ["consumer", "isEmployee"],
      type: DataIndexType.BOOLEAN,
    },
    consumerLastname: {
      label: "Харилцагчийн овог",
      isView: true,
      isFiltered: false,
      dataIndex: ["consumer", "lastName"],
      type: DataIndexType.MULTI,
    },
    consumerName: {
      label: "Харилцагчийн нэр",
      isView: true,
      isFiltered: false,
      dataIndex: ["consumer", "name"],
      type: DataIndexType.MULTI,
    },
    consumerSectionId: {
      label: "Харилцагчийн бүлэг",
      isView: true,
      isFiltered: false,
      dataIndex: ["consumer", "section", "name"],
      type: DataIndexType.STRING_SECTION,
    },
    consumerRegno: {
      label: "Регистр №",
      isView: false,
      isFiltered: false,
      dataIndex: ["consumer", "regno"],
      type: DataIndexType.MULTI,
    },
    consumerPhone: {
      label: "Утасны дугаар",
      isView: true,
      isFiltered: false,
      dataIndex: ["consumer", "phone"],
      type: DataIndexType.MULTI,
    },
    consumerAddress: {
      label: "Хаяг",
      isView: false,
      isFiltered: false,
      dataIndex: ["consumer", "address"],
      type: DataIndexType.MULTI,
    },
    consumerBank: {
      label: "Банк",
      isView: false,
      isFiltered: false,
      dataIndex: ["consumer", "bank", "name"],
      type: DataIndexType.MULTI,
    },
    consumerBankAccountNo: {
      label: "Дансны дугаар",
      isView: false,
      isFiltered: false,
      dataIndex: ["consumer", "bankAccountNo"],
      type: DataIndexType.MULTI,
    },
    consumerEmail: {
      label: "И-мэйл хаяг",
      isView: false,
      isFiltered: false,
      dataIndex: ["consumer", "email"],
      type: DataIndexType.MULTI,
    },
    consumerIsActive: {
      label: "Төлөв",
      isView: true,
      isFiltered: false,
      dataIndex: ["consumer", "isActive"],
      type: DataIndexType.BOOLEAN,
    },
    cardno: {
      label: "Картын дугаар",
      isView: true,
      isFiltered: false,
      dataIndex: ["cardno"],
      type: DataIndexType.MULTI,
    },
    membershipName: {
      label: "Карт, эрхийн бичгийн нэр",
      isView: true,
      isFiltered: false,
      dataIndex: ["membership", "name"],
      type: DataIndexType.MULTI,
    },
    createdAt: {
      label: "Нээсэн огноо",
      isView: false,
      isFiltered: false,
      dataIndex: ["createdAt"],
      type: DataIndexType.DATE,
    },
    endAt: {
      label: "Дуусах огноо",
      isView: true,
      isFiltered: false,
      dataIndex: ["endAt"],
      type: DataIndexType.DATE,
    },
    branch: {
      label: "Нээлгэсэн салбар",
      isView: true,
      isFiltered: false,
      dataIndex: ["branch", "name"],
      type: DataIndexType.MULTI,
    },
    isClose: {
      label: "Хаасан эсэх",
      isView: false,
      isFiltered: false,
      dataIndex: ["isClose"],
      type: DataIndexType.BOOLEAN,
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
      isView: false,
      isFiltered: false,
      dataIndex: ["updatedUser", "firstName"],
      type: DataIndexType.USER,
    },
  });
  //
  const getData = async (params: IParamConsumerMembership) => {
    await ConsumerMembershipService.get(params).then((response) => {
      if (response.success) {
        setData(response.response.data);
        setMeta(response.response.meta);
        setFilters(response.response.filter);
      }
    });
  };
  const editCommand = async (consumerMembership: IDataConsumerMembership) => {
    blockContext.block();
    await ConsumerService.getById(consumerMembership.consumerId)
      .then((response) => {
        if (response.success) {
          onEdit(response.response);
        }
      })
      .finally(() => {
        blockContext.unblock();
      });
  };
  useEffect(() => {
    getData({ page: 1, limit: 10 });
  }, [onReload]);
  return (
    <div>
      <Row gutter={[12, 24]}>
        <Col md={24} lg={24} xl={24}>
          <Row gutter={[24, 12]}>
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
                onColumns={(columns) => setColumns(columns)}
                incomeFilters={filters}
                isEdit
                onEdit={(row) => editCommand(row)}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};
export default DescriptionList;

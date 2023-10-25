import ColumnSettings from "@/components/columnSettings";
import Filtered from "@/components/filtered";
import { NewTable } from "@/components/table";
import { findIndexInColumnSettings, onCloseFilterTag } from "@/feature/common";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import {
  FilteredColumnsPrice,
  IDataPrice,
  IFilterPrice,
  IParamPrice,
} from "@/service/command/price/entities";
import { MaterialPriceService } from "@/service/command/price/service";
import { DataIndexType, Meta } from "@/service/entities";
import { Col, Row } from "antd";
import { useContext, useEffect, useState } from "react";
import Image from "next/image";
import NewModal from "@/components/modal";
import { MaterialCommandService } from "@/service/command/service";
import { CommandType, IDataCommand } from "@/service/command/entities";
import SavePrice from "../save-price";
import {
  FilteredColumnsDiscount,
  IDataDiscount,
  IFilterDiscount,
  IParamDiscount,
} from "@/service/command/discount/entities";
import { MaterialDiscountService } from "@/service/command/discount/service";
interface IProps {
  type: CommandType;
}
const DiscountList = (props: IProps) => {
  const { type } = props;
  const blockContext: BlockView = useContext(BlockContext);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [data, setData] = useState<IDataDiscount[]>([]);
  const [meta, setMeta] = useState<Meta>({ page: 1, limit: 10 });
  const [filters, setFilters] = useState<IFilterDiscount>();
  const [params, setParams] = useState<IParamDiscount>({});
  const [selectedCommand, setSelectedCommand] = useState<IDataCommand>();
  const [columns, setColumns] = useState<FilteredColumnsDiscount>({
    id: {
      label: "ID",
      isView: true,
      isFiltered: false,
      dataIndex: ["command", "id"],
      type: DataIndexType.STRING,
    },
    commandAt: {
      label: "Тушаалын огноо",
      isView: true,
      isFiltered: false,
      dataIndex: ["command", "commandAt"],
      type: DataIndexType.DATE,
    },
    commandNumbers: {
      label: "Тушаалын дугаар",
      isView: false,
      isFiltered: false,
      dataIndex: ["command", "commandNo"],
      type: DataIndexType.MULTI,
    },
    ruleAt: {
      label: "Мөрдөж эхлэх огноо",
      isView: true,
      isFiltered: false,
      dataIndex: ["command", "ruleAt"],
      type: DataIndexType.DATE,
    },
    branchName: {
      label: "Мөрдөх төв, салбарын нэр",
      isView: true,
      isFiltered: false,
      dataIndex: ["command", "branch", "name"],
      type: DataIndexType.MULTI,
    },
    consumerCode: {
      label: "Харилцагчийн код",
      isView: false,
      isFiltered: false,
      dataIndex: ["command", "consumer", "code"],
      type: DataIndexType.MULTI,
    },
    consumerName: {
      label: "Харилцагчийн нэр",
      isView: true,
      isFiltered: false,
      dataIndex: ["command", "consumer", "name"],
      type: DataIndexType.MULTI,
    },
    materialCode: {
      label: "Дотоод код",
      isView: true,
      isFiltered: false,
      dataIndex: ["material", "code"],
      type: DataIndexType.MULTI,
    },
    materialName: {
      label: "Бараа/Үйлчилгээний нэр",
      isView: true,
      isFiltered: false,
      dataIndex: ["material", "name"],
      type: DataIndexType.MULTI,
    },
    materialSectionName: {
      label: "Бараа/Үйлчилгээний бүлэг",
      isView: false,
      isFiltered: false,
      dataIndex: ["material", "section", "name"],
      type: DataIndexType.MULTI,
    },
    measurementName: {
      label: "Хэмжих нэгж",
      isView: true,
      isFiltered: false,
      dataIndex: ["material", "measurement", "name"],
      type: DataIndexType.MULTI,
    },
    unitAmount: {
      label: "Нэгж үнэ",
      isView: true,
      isFiltered: false,
      dataIndex: "unitAmount",
      type: DataIndexType.MULTI,
    },
    endAt: {
      label: "Хөнгөлөлт дуусах огноо",
      isView: true,
      isFiltered: false,
      dataIndex: "endAt",
      type: DataIndexType.DATE,
    },
    percent: {
      label: "Хөнгөлөлтийн хувь",
      isView: true,
      isFiltered: false,
      dataIndex: "percent",
      type: DataIndexType.MULTI,
    },
    amount: {
      label: "Хөнгөлөлт хассан /Хямдарсан/ үнэ",
      isView: true,
      isFiltered: false,
      dataIndex: "amount",
      type: DataIndexType.MULTI,
    },
    updatedAt: {
      label: "Өөрчлөлт хийсэн огноо",
      isView: false,
      isFiltered: false,
      dataIndex: "updatedAt",
      type: DataIndexType.DATE,
    },
    updatedBy: {
      label: "Өөрчлөлт хийсэн хэрэглэгч",
      isView: false,
      isFiltered: false,
      dataIndex: ["updatedUser", "firstName"],
      type: DataIndexType.USER,
    },
    createdAt: {
      label: "Үүсгэсэн огноо",
      isView: false,
      isFiltered: false,
      dataIndex: "createdAt",
      type: DataIndexType.DATE,
    },
    createdBy: {
      label: "Үүсгэсэн хэрэглэгч",
      isView: true,
      isFiltered: false,
      dataIndex: ["createdUser", "firstName"],
      type: DataIndexType.USER,
    },
  });
  const getData = async (params: IParamDiscount) => {
    blockContext.block();
    await MaterialDiscountService.get(params)
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
  const editCommand = async (price: IDataPrice) => {
    blockContext.block();
    await MaterialCommandService.getById(price.commandId)
      .then((response) => {
        if (response.success) {
          setIsOpenModal(true);
          setSelectedCommand(response.response);
        }
      })
      .finally(() => {
        blockContext.unblock();
      });
  };
  useEffect(() => {
    getData(params);
  }, []);
  return (
    <div>
      <Row gutter={[12, 24]}>
        <Col span={24}>
          <div className="information">
            <div className="second-header">
              <Filtered
                columns={columns}
                isActive={(key, state) => {
                  onCloseFilterTag({
                    key: key,
                    state: state,
                    column: columns,
                    onColumn: setColumns,
                    params: params,
                    onParams: setParams,
                  });
                  getData(params);
                }}
              />
              <div className="extra">
                <ColumnSettings
                  columns={columns}
                  columnIndexes={(arg1, arg2) =>
                    findIndexInColumnSettings({
                      newRowIndexes: arg1,
                      unSelectedRow: arg2,
                      columns,
                      onColumns: setColumns,
                      params,
                      onParams: setParams,
                      getData,
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
              </div>
            </div>
            <NewTable
              scroll={{ x: 1000 }}
              rowKey="id"
              doubleClick={true}
              data={data}
              meta={meta}
              columns={columns}
              onChange={getData}
              onColumns={setColumns}
              newParams={params}
              onParams={setParams}
              incomeFilters={filters}
              isEdit
              onEdit={(row) => editCommand(row)}
            />
          </div>
        </Col>
      </Row>
      <NewModal
        title="Бараа материал үнэ"
        width={1779}
        open={isOpenModal}
        footer={false}
        onCancel={() => setIsOpenModal(false)}
      >
        <SavePrice isEdit selectedCommand={selectedCommand} type={type} />
      </NewModal>
    </div>
  );
};
export default DiscountList;

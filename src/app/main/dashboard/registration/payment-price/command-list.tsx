import ColumnSettings from "@/components/columnSettings";
import Filtered from "@/components/table/filtered";
import { NewTable } from "@/components/table";
import { findIndexInColumnSettings, getParam } from "@/feature/common";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import {
  CommandType,
  FilteredColumnsCommand,
  IDataCommand,
  IFilterCommand,
  IParamCommand,
} from "@/service/command/entities";
import { MaterialCommandService } from "@/service/command/service";
import { DataIndexType, Meta } from "@/service/entities";
import { Col, Row } from "antd";
import { useContext, useEffect, useState } from "react";
import Image from "next/image";
import SavePrice from "./save-price";
import NewModal from "@/components/modal";
import { CommandFilterForm } from "./command-filter-form";
import { useTypedSelector } from "@/feature/store/reducer";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/feature/store/store";
import { newPane } from "@/feature/store/slice/param.slice";
interface IProps {
  type: CommandType;
}
const CommandList = (props: IProps) => {
  const { type } = props;
  const key = `payment-price/command/${type}`;
  const blockContext: BlockView = useContext(BlockContext);
  const { items } = useTypedSelector((state) => state.pane);
  const param = getParam(items, key);
  const dispatch = useDispatch<AppDispatch>();
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [data, setData] = useState<IDataCommand[]>([]);
  const [selectedCommand, setSelectedCommand] = useState<IDataCommand>();
  const [meta, setMeta] = useState<Meta>({ page: 1, limit: 10 });
  const [filters, setFilters] = useState<IFilterCommand>();
  const [isFilterToggle, setIsFilterToggle] = useState<boolean>(false);
  const [columns, setColumns] = useState<FilteredColumnsCommand>({
    id: {
      label: "ID",
      isView: true,
      isFiltered: false,
      dataIndex: ["id"],
      type: DataIndexType.STRING,
    },
    commandAt: {
      label: "Тушаалын огноо",
      isView: true,
      isFiltered: false,
      dataIndex: ["commandAt"],
      type: DataIndexType.DATE,
    },
    commandNo: {
      label: "Тушаалын дугаар",
      isView: true,
      isFiltered: false,
      dataIndex: ["commandNo"],
      type: DataIndexType.MULTI,
    },
    ruleAt: {
      label: "Мөрдөж эхлэх огноо",
      isView: true,
      isFiltered: false,
      dataIndex: ["ruleAt"],
      type: DataIndexType.DATE,
    },
    isAll: {
      label: "Нийтэд мөрдөх",
      isView: true,
      isFiltered: false,
      dataIndex: ["isAll"],
      type: DataIndexType.BOOLEAN,
    },
    warehouseName: {
      label: "Мөрдөх төв, салбарын нэр",
      isView: true,
      isFiltered: false,
      dataIndex: ["warehouse", "name"],
      type: DataIndexType.MULTI,
    },
    consumerCode: {
      label: "Харилцагчийн код",
      isView: false,
      isFiltered: false,
      dataIndex: ["consumer", "code"],
      type: DataIndexType.MULTI,
    },
    consumerName: {
      label: "Харилцагчийн нэр",
      isView: true,
      isFiltered: false,
      dataIndex: ["consumer", "name"],
      type: DataIndexType.MULTI,
    },
    quantity: {
      label: "Баримтын тоо",
      isView: true,
      isFiltered: false,
      dataIndex: ["quantity"],
      type: DataIndexType.MULTI,
    },
    createdAt: {
      label: "Үүсгэсэн огноо",
      isView: true,
      isFiltered: false,
      dataIndex: ["createdAt"],
      type: DataIndexType.DATETIME,
    },
    createdBy: {
      label: "Үүсгэсэн хэрэглэгч",
      isView: true,
      isFiltered: false,
      dataIndex: ["createdUser", "firstName"],
      type: DataIndexType.USER,
    },
    updatedAt: {
      label: "Өөрчлөлт хийсэн огноо",
      isView: true,
      isFiltered: false,
      dataIndex: ["updatedAt"],
      type: DataIndexType.DATETIME,
    },
    updatedBy: {
      label: "Өөрчлөлт хийсэн хэрэглэгч",
      isView: true,
      isFiltered: false,
      dataIndex: ["updatedUser", "firstName"],
      type: DataIndexType.USER,
    },
  });
  const getData = async () => {
    const params: IParamCommand = { ...param, type };
    blockContext.block();
    await MaterialCommandService.get(params)
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
  const onDelete = async (id: number) => {
    await MaterialCommandService.remove(id).then((response) => {
      if (response.success) {
        getData();
      }
    });
  };
  const editCommand = async (id: number) => {
    blockContext.block();
    await MaterialCommandService.getById(id)
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
  const getTitle = (): string => {
    if (type == CommandType.Package) {
      return "Багцын үнэ";
    } else if (type == CommandType.Service) {
      return "Үйлчилгээний үнэ";
    } else if (type == CommandType.Material) {
      return "Бараа материалын үнэ";
    } else if (type == CommandType.Coupon) {
      return "Урамшуулал";
    } else if (type == CommandType.Discount) {
      return "Хөнгөлөлт";
    } else return "Төрөл тодорхойгүй";
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
        <Col span={isFilterToggle ? 20 : 24}>
          <div className="information">
            <div className="second-header">
              <Filtered columns={columns} />
              <div className="extra">
                <ColumnSettings
                  columns={columns}
                  columnIndexes={(arg1, arg2) =>
                    findIndexInColumnSettings({
                      newRowIndexes: arg1,
                      unSelectedRow: arg2,
                      columns,
                      onColumns: setColumns,
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
                <Image
                  onClick={() => setIsFilterToggle(!isFilterToggle)}
                  src={
                    isFilterToggle
                      ? "/images/filterTrue.svg"
                      : "/images/filterFalse.svg"
                  }
                  width={24}
                  height={24}
                  alt="filter"
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
              onColumns={setColumns}
              incomeFilters={filters}
              isEdit
              isDelete
              onEdit={(row) => editCommand(row.id)}
              onDelete={(id) => onDelete(id)}
            />
          </div>
        </Col>
        <Col span={isFilterToggle ? 4 : 0}>
          <CommandFilterForm
            onToggle={() => setIsFilterToggle(!isFilterToggle)}
            getData={getData}
          />
        </Col>
      </Row>
      <NewModal
        title={getTitle()}
        width={1779}
        open={isOpenModal}
        footer={false}
        onCancel={() => setIsOpenModal(false)}
      >
        <SavePrice
          selectedCommand={selectedCommand}
          isEdit
          type={type}
          onSavePriceModal={(state) => setIsOpenModal(state)}
        />
      </NewModal>
    </div>
  );
};
export default CommandList;

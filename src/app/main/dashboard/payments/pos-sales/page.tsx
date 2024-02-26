"use client";
import { Col, Divider, Row } from "antd";
import { NewInput, NewSearch } from "@/components/input";
import { useContext, useEffect, useState } from "react";
import { usePaymentGroupContext } from "@/feature/context/PaymentGroupContext";
import { MaterialType } from "@/service/material/entities";
import { QrcodeOutlined } from "@ant-design/icons";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import InfiniteScroll from "react-infinite-scroll-component";
import { Meta } from "@/service/entities";
import { ViewMaterialService } from "@/service/material/view-material/service";
import { IDataViewMaterial } from "@/service/material/view-material/entities";
import DisplayItem from "./component/DisplayItem";
import { CodeSearch } from "./component/code-search";
import ShoppingCartButton from "./component/tool-header/shopping-cart";
import DisplayTool, { DisplayType } from "./component/tool-header/display-tool";

const PosSales = () => {
  const { value } = usePaymentGroupContext();
  const blockContext: BlockView = useContext(BlockContext);
  const [materials, setMaterials] = useState<IDataViewMaterial[]>([]);
  const [meta, setMeta] = useState<Meta>({
    page: 1,
    limit: 12,
  });
  const [display, setDisplay] = useState<DisplayType>("grid");
  const getMaterials = async (page: number) => {
    blockContext.block();
    await ViewMaterialService.get({
      types: [MaterialType.Material],
      sectionId: value === "all" ? undefined : value,
      moreUnitAmount: 0,
      page: page,
      limit: meta.limit,
    })
      .then((response) => {
        if (page === 1) {
          setMaterials(response.response.data);
        } else {
          setMaterials([...materials, ...response.response.data]);
        }
        setMeta(response.response.meta);
      })
      .finally(() => {
        blockContext.unblock();
      });
  };
  const onSearchMaterial = async (searchValue: string) => {
    blockContext.block();
    await ViewMaterialService.get({
      types: [MaterialType.Material],
      name: searchValue,
      sectionId: value === "all" ? undefined : value,
    })
      .then((response) => {
        setMaterials(response.response.data);
      })
      .finally(() => {
        blockContext.unblock();
      });
  };
  useEffect(() => {
    getMaterials(1);
  }, [value]);
  return (
    <div className="pos-container">
      <div className="tool-container">
        <NewSearch
          size="large"
          placeholder="Бараанаас хайх..."
          prefix={<QrcodeOutlined />}
          allowClear
          onSearch={onSearchMaterial}
        />
        <div className="tool-extra">
          <ShoppingCartButton />
          <DisplayTool display={display} setDisplay={setDisplay} />
        </div>
      </div>
      <InfiniteScroll
        className="goods-container"
        dataLength={materials.length}
        next={() => getMaterials(meta.page ? meta.page + 1 : 1)}
        endMessage={<Divider plain>Энэ бүгд нь өөр байхгүй🤐</Divider>}
        scrollableTarget="scrollableDiv"
        hasMore={meta.hasNextPage ? meta.hasNextPage : false}
        loader={false}
      >
        <div className={`material-${display}`}>
          {materials?.map((material, index) => (
            <DisplayItem key={index} type={display} material={material} />
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
};
export default PosSales;

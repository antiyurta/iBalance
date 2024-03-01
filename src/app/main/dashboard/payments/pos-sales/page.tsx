"use client";
import { Col, Divider, Row } from "antd";
import { NewInput, NewSearch } from "@/components/input";
import { useContext, useEffect, useState } from "react";
import { usePaymentContext } from "@/feature/context/PaymentGroupContext";
import { MaterialType } from "@/service/material/entities";
import { QrcodeOutlined } from "@ant-design/icons";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import InfiniteScroll from "react-infinite-scroll-component";
import { Meta } from "@/service/entities";
import { ViewMaterialService } from "@/service/material/view-material/service";
import { IDataViewMaterial } from "@/service/material/view-material/entities";
import DisplayItem from "./component/DisplayItem";
import ShoppingCartButton from "./component/tool-header/shopping-cart";
import DisplayTool, { DisplayType } from "./component/tool-header/display-tool";
import GoodsContainer from "./component/goods-container";

const PosSales = () => {
  const [display, setDisplay] = useState<DisplayType>("grid");
  const [searchValue, setSearchValue] = useState<string>();
  return (
    <div className="pos-container">
      <div className="tool-container">
        <NewSearch
          size="large"
          placeholder="Бараанаас хайх..."
          prefix={<QrcodeOutlined />}
          allowClear
          onSearch={setSearchValue}
        />
        <div className="tool-extra">
          <ShoppingCartButton />
          <DisplayTool display={display} setDisplay={setDisplay} />
        </div>
      </div>
      <GoodsContainer display={display} searchValue={searchValue} />
    </div>
  );
};
export default PosSales;

"use client";
import { NewSearch } from "@/components/input";
import { useState } from "react";
import { QrcodeOutlined } from "@ant-design/icons";
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

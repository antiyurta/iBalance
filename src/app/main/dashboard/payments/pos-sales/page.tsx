"use client";

import { Button, Col, Divider, Row } from "antd";
import { NewSearch } from "@/components/input";
import { BarsOutlined, AppstoreOutlined } from "@ant-design/icons";
import { useContext, useEffect, useState } from "react";
import { usePaymentGroupContext } from "@/feature/context/PaymentGroupContext";
import { MaterialType } from "@/service/material/entities";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import InfiniteScroll from "react-infinite-scroll-component";
import { Meta } from "@/service/entities";
import { ViewMaterialService } from "@/service/material/view-material/service";
import { IDataViewMaterial } from "@/service/material/view-material/entities";
import DisplayItem from "./component/DisplayItem";
import { CodeSearch } from "./component/code-search";
import Image from "next/image";

export type TypeSegment = "list" | "group";

const PosSales = () => {
  const { value } = usePaymentGroupContext();
  const blockContext: BlockView = useContext(BlockContext);
  const [materials, setMaterials] = useState<IDataViewMaterial[]>([]);
  const [meta, setMeta] = useState<Meta>({
    page: 1,
    limit: 12,
  });
  const [isActiveSegment, setIsActiveSegment] = useState<TypeSegment>("group");
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
        <CodeSearch />
        <div className="tool-extra">
          <Button
            icon={
              <Image
                src={"/icons/pos/shopping-cart.svg"}
                alt=""
                width={24}
                height={24}
              />
            }
          />
          <div className="segment">
            <div
              onClick={() => setIsActiveSegment("list")}
              className={
                isActiveSegment === "list"
                  ? "segment-item-active"
                  : "segment-item"
              }
            >
              <BarsOutlined
                style={{
                  fontSize: 20,
                }}
              />
            </div>
            <div
              onClick={() => setIsActiveSegment("group")}
              className={
                isActiveSegment === "group"
                  ? "segment-item-active"
                  : "segment-item"
              }
            >
              <AppstoreOutlined
                style={{
                  fontSize: 20,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PosSales;

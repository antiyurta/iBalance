"use client";

import { Col, Divider, Row } from "antd";
import { NewSearch } from "@/components/input";
import { BarsOutlined, AppstoreOutlined } from "@ant-design/icons";
import { useContext, useEffect, useState } from "react";
import GroupItem from "./component/GroupItem";
import ListItem from "./component/ListItem";
import { usePaymentGroupContext } from "@/feature/context/PaymentGroupContext";
import { IDataMaterial, MaterialType } from "@/service/material/entities";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import InfiniteScroll from "react-infinite-scroll-component";
import { Meta } from "@/service/entities";
import { MaterialService } from "@/service/material/service";

type TypeSegment = "list" | "group";

const PosSales = () => {
  const { value } = usePaymentGroupContext();
  const blockContext: BlockView = useContext(BlockContext);
  const [materials, setMaterials] = useState<IDataMaterial[]>([]);
  const [meta, setMeta] = useState<Meta>({
    page: 1,
    limit: 10,
  });
  const [isActiveSegment, setIsActiveSegment] = useState<TypeSegment>("group");
  const getMaterials = async (page: number) => {
    await MaterialService.get({
      types: [MaterialType.Material],
      materialSectionId: value === "all" ? undefined : [value],
      page: page,
      limit: meta.limit,
    }).then((response) => {
      if (page === 1) {
        setMaterials(response.response.data);
      } else {
        setMaterials([...materials, ...response.response.data]);
      }
      setMeta(response.response.meta);
    });
  };
  const onSearchMaterial = async (searchValue: string) => {
    blockContext.block();
    await MaterialService.get({
      types: [MaterialType.Material],
      queries: [
        {
          param: "name",
          operator: "CONTAINS",
          value: searchValue,
        },
      ],
      materialSectionId: value === "all" ? undefined : [value],
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
    <Row gutter={[12, 12]}>
      <Col span={24}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <NewSearch
            style={{
              width: 400,
            }}
            placeholder="Бараанаас хайх"
            enterButton
            onSearch={onSearchMaterial}
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
      </Col>
      <Col
        id="scrollableDiv"
        style={{
          width: "100%",
          position: "absolute",
          top: 170,
          height: "calc(100% - 190px)",
          overflow: "auto",
        }}
        span={24}
      >
        <InfiniteScroll
          dataLength={materials.length}
          next={() => getMaterials(meta.page ? meta.page + 1 : 1)}
          endMessage={<Divider plain>Энэ бүгд нь өөр байхгүй🤐</Divider>}
          scrollableTarget="scrollableDiv"
          hasMore={meta.hasNextPage ? meta.hasNextPage : false}
          loader={false}
        >
          <div className={`material-${isActiveSegment}`}>
            {materials?.map((material, index) =>
              isActiveSegment === "group" ? (
                <GroupItem key={index} data={material} />
              ) : (
                <ListItem key={index} data={material} />
              )
            )}
          </div>
        </InfiniteScroll>
      </Col>
    </Row>
  );
};
export default PosSales;
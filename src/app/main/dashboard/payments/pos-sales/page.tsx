"use client";

import { Badge, Col, Row } from "antd";
import { NewInput } from "@/components/input";
import {
  BarsOutlined,
  ShoppingCartOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import GroupItem from "./component/GroupItem";
import ListItem from "./component/ListItem";
import {
  TypeValue,
  usePaymentGroupContext,
} from "@/feature/context/PaymentGroupContext";
import { MaterialService } from "@/service/material/service";
import { IDataMaterial } from "@/service/material/entities";

type TypeSegment = "list" | "group";

const PosSales = () => {
  const { value } = usePaymentGroupContext();
  const [materials, setMaterials] = useState<IDataMaterial[]>([]);
  const [isActiveSegment, setIsActiveSegment] = useState<TypeSegment>("group");
  const getMaterials = async (value: TypeValue) => {
    await MaterialService.get({
      materialSectionId: value === "all" ? undefined : [value],
    }).then((response) => {
      setMaterials(response.response.data);
    });
  };
  useEffect(() => {
    getMaterials(value);
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
          <NewInput
            style={{
              width: 400,
            }}
            placeholder="Бараанаас хайх"
          />
          <div className="segment">
            <div className="segment-item">
              <Badge count={3}>
                <ShoppingCartOutlined
                  style={{
                    fontSize: 20,
                  }}
                />
              </Badge>
            </div>
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
        style={{
          width: "100%",
          position: "absolute",
          top: 170,
          height: "calc(100% - 190px)",
          overflow: "auto",
        }}
        span={24}
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
      </Col>
    </Row>
  );
};
export default PosSales;

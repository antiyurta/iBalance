import Image from "next/image";
import Link from "next/link";
import { Button, Col, Row } from "antd";
import { NewInput } from "@/components/input";
import {
  BarsOutlined,
  ShoppingCartOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import GroupItem from "./component/GroupItem";
import ListItem from "./component/ListItem";

type TypeSegment = "list" | "group";

const PosSales = () => {
  const [isActiveSegment, setIsActiveSegment] = useState<TypeSegment>("group");
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
              <ShoppingCartOutlined
                style={{
                  fontSize: 20,
                }}
              />
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
          {isActiveSegment === "group" ? <GroupItem /> : null}
          {isActiveSegment === "group" ? <GroupItem /> : null}
          {isActiveSegment === "group" ? <GroupItem /> : null}
          {isActiveSegment === "group" ? <GroupItem /> : null}
          {isActiveSegment === "group" ? <GroupItem /> : null}
          {isActiveSegment === "group" ? <GroupItem /> : null}
          {isActiveSegment === "group" ? <GroupItem /> : null}
          {isActiveSegment === "group" ? <GroupItem /> : null}
          {isActiveSegment === "group" ? <GroupItem /> : null}
          {isActiveSegment === "group" ? <GroupItem /> : null}
          {isActiveSegment === "group" ? <GroupItem /> : null}
          {isActiveSegment === "group" ? <GroupItem /> : null}
          {isActiveSegment === "group" ? <GroupItem /> : null}
          {isActiveSegment === "group" ? <GroupItem /> : null}
          {isActiveSegment === "group" ? <GroupItem /> : null}
          {isActiveSegment === "group" ? <GroupItem /> : null}
          {isActiveSegment === "group" ? <GroupItem /> : null}
          {isActiveSegment === "group" ? <GroupItem /> : null}
          {isActiveSegment === "list" ? <ListItem /> : null}
          {isActiveSegment === "list" ? <ListItem /> : null}
          {isActiveSegment === "list" ? <ListItem /> : null}
          {isActiveSegment === "list" ? <ListItem /> : null}
          {isActiveSegment === "list" ? <ListItem /> : null}
          {isActiveSegment === "list" ? <ListItem /> : null}
          {isActiveSegment === "list" ? <ListItem /> : null}
          {isActiveSegment === "list" ? <ListItem /> : null}
          {isActiveSegment === "list" ? <ListItem /> : null}
          {isActiveSegment === "list" ? <ListItem /> : null}
          {isActiveSegment === "list" ? <ListItem /> : null}
          {isActiveSegment === "list" ? <ListItem /> : null}
          {isActiveSegment === "list" ? <ListItem /> : null}
          {isActiveSegment === "list" ? <ListItem /> : null}
          {isActiveSegment === "list" ? <ListItem /> : null}
          {isActiveSegment === "list" ? <ListItem /> : null}
          {isActiveSegment === "list" ? <ListItem /> : null}
          {isActiveSegment === "list" ? <ListItem /> : null}
        </div>
      </Col>
    </Row>
  );
};
export default PosSales;
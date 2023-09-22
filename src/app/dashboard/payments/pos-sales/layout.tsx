"use client";

import { Col, Row } from "antd";
import Groups from "./groups";

import PayController from "./payController";

const PosSalesLayouts = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Row
        style={{
          height: "100%",
        }}
        gutter={[12, 24]}
      >
        <Col sm={24} xl={16}>
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <Groups />
            {children}
          </div>
        </Col>
        <Col sm={24} xl={8}>
          <PayController />
        </Col>
      </Row>
    </>
  );
};
export default PosSalesLayouts;

"use client";

import { Col, Row } from "antd";
import Groups from "./groups";

import PayController from "./payController";
import { PaymentGroupProvider } from "@/feature/context/PaymentGroupContext";
import checkOpener from "@/feature/hoc/checkOpener";

const PosSalesLayouts = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <PaymentGroupProvider>
        <Row
          style={{
            height: "100%",
          }}
          gutter={[12, 24]}
        >
          <Col sm={24} xl={16}>
            <Groups />
            {children}
          </Col>
          <Col sm={24} xl={8}>
            <PayController />
          </Col>
        </Row>
      </PaymentGroupProvider>
    </>
  );
};
export default checkOpener(PosSalesLayouts);

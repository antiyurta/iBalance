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
            <div
              style={{
                width: "100%",
                height: "100%",
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
      </PaymentGroupProvider>
    </>
  );
};
export default checkOpener(PosSalesLayouts);

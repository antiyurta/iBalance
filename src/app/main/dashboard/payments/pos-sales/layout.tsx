"use client";

import { useRouter } from "next/navigation";
import { Col, Row } from "antd";
import Groups from "./groups";

import PayController from "./payController";
import { useContext, useEffect, useState } from "react";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import { OpenerService } from "@/service/pos/opener/service";
import { PaymentGroupProvider } from "@/feature/context/PaymentGroupContext";

type OPEN = "LOADING" | "DONE" | "FAILED";

const PosSalesLayouts = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const blockContext: BlockView = useContext(BlockContext); // uildeliig blockloh
  const [isOpen, setIsOpen] = useState<OPEN>("LOADING");
  const getCheck = async () => {
    blockContext.block();
    OpenerService.getCheckOpen()
      .then((response) => {
        if (response.response) {
          setIsOpen("DONE");
        } else {
          setIsOpen("FAILED");
        }
      })
      .finally(() => {
        blockContext.unblock();
      });
  };
  useEffect(() => {
    getCheck();
  }, []);
  if (isOpen === "DONE") {
    return (
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
    );
  } else if (isOpen === "FAILED") {
    router.push("/main/dashboard/payments/open-close");
  }
  return <p>Redirecting...</p>;
};
export default PosSalesLayouts;

"use client";

import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import { useContext, useEffect, useState } from "react";
import OpenState from "./openState";
import PosSales from "./posSales";

const PosSalesPage = () => {
  const blockContext: BlockView = useContext(BlockContext); // uildeliig blockloh
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const getCheck = async () => {
    // blockContext.block();
  };
  useEffect(() => {
    getCheck();
  }, []);
  if (isOpen) {
    return <PosSales />;
  } else {
    return <OpenState />;
  }
};
export default PosSalesPage;

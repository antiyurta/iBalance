import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BlockContext, BlockView } from "../context/BlockContext";
import { OpenerService } from "@/service/pos/opener/service";

type OPEN = "LOADING" | "DONE" | "FAILED";

export default function checkOpener(Component: React.ComponentType<any>) {
  return function ProtectedRoute({ ...props }: any) {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState<OPEN>("LOADING");
    const blockContext: BlockView = useContext(BlockContext); // uildeliig blockloh
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
    useEffect(() => {
      if (isOpen === "FAILED") {
        router.push("/main/dashboard/payments/open-close");
      }
    }, [isOpen, router]);
    if (isOpen === "DONE") {
      return <Component {...props} />;
    }
  };
}

import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BlockContext, BlockView } from "../context/BlockContext";
import { OpenCloseService } from "@/service/pos/open-close/service";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import { setPosOpenClose } from "../store/slice/pos-open-close.slice";

type OPEN = "LOADING" | "DONE" | "FAILED";

export default function checkOpener(Component: React.ComponentType<any>) {
  return function ProtectedRoute({ ...props }: any) {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const [isOpen, setIsOpen] = useState<OPEN>("LOADING");
    const blockContext: BlockView = useContext(BlockContext); // uildeliig blockloh
    const getCheck = async () => {
      blockContext.block();
      OpenCloseService.get({ isClose: false })
        .then((response) => {
          if (response.response.data.length == 0) {
            setIsOpen("FAILED");
          } else {
            dispatch(setPosOpenClose(response.response.data[0]));
            setIsOpen("DONE");
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

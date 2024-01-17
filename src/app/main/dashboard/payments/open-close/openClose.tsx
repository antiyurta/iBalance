import { useTypedSelector } from "@/feature/store/reducer";
import CloseState from "./close";
import OpenState from "./open";
import { useRouter } from "next/navigation";

type Type = "open" | "close";

interface IProps {
  type: Type;
}

const OpenClose = (props: IProps) => {
  const { type } = props;
  const { posOpenClose } = useTypedSelector((state) => state);
  const router = useRouter();
  if (type === "open") {
    return <OpenState />;
  }
  if (type === "close") {
    return (
      <CloseState
        openCloseId={posOpenClose.id}
        setIsClose={() => { router.push("/main/profile/general"); }}
      />
    );
  }
};
export default OpenClose;

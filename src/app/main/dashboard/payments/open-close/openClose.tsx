import { useTypedSelector } from "@/feature/store/reducer";
import CloseState from "./close";
import OpenState from "./open";

type Type = "open" | "close";

interface IProps {
  type: Type;
}

const OpenClose = (props: IProps) => {
  const { type } = props;
  const { posOpenClose } = useTypedSelector((state) => state);
  if (type === "open") {
    return <OpenState />;
  }
  if (type === "close") {
    return (
      <CloseState
        openCloseId={posOpenClose.id}
        setIsClose={() => {
          throw new Error("Function not implemented.");
        }}
      />
    );
  }
};
export default OpenClose;

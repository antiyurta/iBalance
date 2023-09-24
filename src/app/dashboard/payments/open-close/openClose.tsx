import CloseState from "./close";
import OpenState from "./open";

type Type = "open" | "close";

interface IProps {
  type: Type;
}

const OpenClose = (props: IProps) => {
  const { type } = props;
  if (type === "open") {
    return <OpenState />;
  }
  if (type === "close") {
    return <CloseState />;
  }
};
export default OpenClose;

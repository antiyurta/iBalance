import { Segmented } from "antd";
import { BarsOutlined, AppstoreOutlined } from "@ant-design/icons";
import { Dispatch, SetStateAction } from "react";

export type DisplayType = "list" | "grid";
interface IProps {
  display: DisplayType;
  setDisplay: Dispatch<SetStateAction<DisplayType>>;
}
const DisplayTool: React.FC<IProps> = ({ display = "grid", setDisplay }) => {
  return (
    <>
      <Segmented
        size="large"
        value={display}
        onChange={(value) => setDisplay(value as DisplayType)}
        options={[
          { value: "list", icon: <BarsOutlined /> },
          { value: "grid", icon: <AppstoreOutlined /> },
        ]}
      />
    </>
  );
};
export default DisplayTool;

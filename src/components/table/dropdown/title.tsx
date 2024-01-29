import { CSSProperties } from "react";
interface IProps {
  children: string;
}
const style: CSSProperties = {
  fontSize: 14,
  fontWeight: 500,
  color: "black",
  margin: 0,
};
const DropdownTitle: React.FC<IProps> = ({ children }) => {
  return <p style={style}>{children}</p>;
};
export default DropdownTitle;

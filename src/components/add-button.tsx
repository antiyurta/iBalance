import { Button } from "antd";
import Image from "next/image";

interface IProps {
  hidden?: boolean;
  onClick: () => void;
}
export const AddButton: React.FC<IProps> = ({ hidden, onClick }) => (
  <Button
    hidden={hidden}
    type="primary"
    onClick={() => onClick()}
    icon={
      <Image src={"/images/AddIcon.svg"} width={12} height={12} alt="addicon" />
    }
  >
    Шинээр бүртгэх
  </Button>
);

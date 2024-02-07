import { Tooltip } from "antd";
import Image from "next/image";
import { Dispatch, SetStateAction } from "react";
interface IProps {
  isExpand: boolean;
  setIsExpand: Dispatch<SetStateAction<boolean>>;
}
export const TreeHeader: React.FC<IProps> = ({ isExpand, setIsExpand }) => {
  return (
    <div className="header">
      {isExpand ? (
        <Tooltip title="Бүгдийг хаах">
          <Image
            onClick={() => {
              setIsExpand(false);
            }}
            src={"/images/folder.svg"}
            width={24}
            height={24}
            alt="folder"
          />
        </Tooltip>
      ) : (
        <Tooltip title="Бүгдийг нээх">
          <Image
            onClick={() => {
              setIsExpand(true);
            }}
            src={"/images/openFolder.svg"}
            width={24}
            height={24}
            alt="openfolder"
          />
        </Tooltip>
      )}
      <p>Цэсний жагсаалт</p>
    </div>
  );
};

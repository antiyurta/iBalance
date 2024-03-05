import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { CSSProperties } from "react";
interface IData {
  id: number;
  sectionId: number | null;
  name: string;
  isExpand: boolean;
  sections: IData[];
}
interface IItemProps {
  item: IData;
  onEdit?: (row: IData) => void;
  onDelete?: (id: number) => void;
}
const NewItem: React.FC<IItemProps> = ({ item, onEdit, onDelete }) => (
  <div className="tree-item-container">
    <div className="tree-item">
      <span>{item.name}</span>
    </div>
    <div className="tree-item">
      {onEdit && (
        <EditOutlined
          onClick={() => {
            onEdit?.(item);
          }}
        />
      )}
      {onDelete && <DeleteOutlined onClick={() => onDelete?.(item.id)} />}
    </div>
  </div>
);
export default NewItem;

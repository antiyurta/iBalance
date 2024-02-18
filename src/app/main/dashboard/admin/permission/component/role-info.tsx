import { NewSwitch } from "@/components/input";
import { IDataPermission } from "@/service/permission/entities";
import { IDataRole } from "@/service/permission/role/entities";
import { Table, TableProps } from "antd";

interface IProps {
  role?: IDataRole;
}
const columns: TableProps<IDataPermission>["columns"] = [
  {
    title: "Нэр",
    dataIndex: ["resource", "label"],
    key: "label",
    align: "justify"
  },
  {
    title: "Нэмэх",
    dataIndex: "isAdd",
    key: "isAdd",
    render: (isAdd) => <NewSwitch checked={isAdd}/>,
  },
  {
    title: "Үзэх",
    dataIndex: "isView",
    key: "isView",
    render: (isView) => <NewSwitch checked={isView}/>,
  },
  {
    title: "Засах",
    dataIndex: "isEdit",
    key: "isEdit",
    render: (isEdit) => <NewSwitch checked={isEdit}/>,
  },
  {
    title: "Устгах",
    dataIndex: "isDelete",
    key: "isDelete",
    render: (isDelete) => <NewSwitch checked={isDelete}/>,
  },
];
export const RoleInfo: React.FC<IProps> = ({ role }) => (
  <Table columns={columns} dataSource={role?.permissions} />
);
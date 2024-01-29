import { IDataViewMaterial } from "@/service/material/view-material/entities";
import { Table } from "antd";

interface IProps {
  materials: IDataViewMaterial[];
}
export const IncludedMaterialTable = (props: IProps) => {
  const { materials } = props;
  return (
    <Table
      dataSource={materials}
      columns={[
        {
          title: "Дотоод код",
          dataIndex: "code",
          key: "code",
        },
        {
          title: "Бараа/Үйлчилгээний нэр",
          dataIndex: "name",
          key: "name",
        },
        {
          title: "Хэмжих нэгж",
          dataIndex: "measurementName",
          key: "measurementName",
        },
        {
          title: "Нэгж үнэ",
          dataIndex: "unitAmount",
          key: "unitAmount",
        },
      ]}
    />
  );
};

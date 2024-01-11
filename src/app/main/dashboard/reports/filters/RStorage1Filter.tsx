import { NewFilterSelect, NewSelect } from "@/components/input";
import { Form, Space } from "antd";
import "dayjs/locale/mn";
import { FormInstance } from "antd/lib";
import DateIntervalForm from "@/components/dateIntervalForm";
import { useEffect, useMemo, useState } from "react";
import {
  IDataWarehouse,
  IParamWarehouse,
} from "@/service/reference/warehouse/entities";
import { WarehouseService } from "@/service/reference/warehouse/service";
import { IParamUser, IUser } from "@/service/authentication/entities";
import { authService } from "@/service/authentication/service";
import { TreeSectionSelect } from "@/components/tree-select";
import { TreeSectionType } from "@/service/reference/tree-section/entities";
import InventoriesRegistration from "../../registration/inventory/inventories-registration/inventoriesRegistration";
import { MaterialType } from "@/service/material/entities";
import { MaterialSectionSelect } from "@/components/material-section-select";
import NewModal from "@/components/modal";
import StoragiesRegistration from "../../registration/inventory/storagies-registration/StoragiesRegistration";

interface IProps {
  form: FormInstance;
}

const RStorage1Filter = (props: IProps) => {
  const { form } = props;
  const sectionId = Form.useWatch("sectionId", form);
  const warehouseType = Form.useWatch("warehouseType", form);
  const [users, setUsers] = useState<IUser[]>([]);
  const [userWarehouses, setUserWarehouses] = useState<IDataWarehouse[]>([]);
  const [warehouses, setWarehouses] = useState<IDataWarehouse[]>([]);
  const getWarehouses = (params: IParamWarehouse) => {
    WarehouseService.get(params).then((response) => {
      if (response.success) {
        const warehouses = response.response.data;
        setWarehouses(warehouses);
      }
    });
  };
  const getWarehousesBySectionIds = async (params: IParamWarehouse) => {
    WarehouseService.get(params).then((response) => {
      setWarehouses(response.response.data);
    });
  };
  const getUsers = async (ids: number[]) => {
    authService.getAllUsers({ ids }).then((response) => {
      if (response.success) {
        setUsers(response.response);
      }
    });
  };
  const warehouseOptions = useMemo(() => {
    if (warehouseType == 0) {
      return warehouses?.map((warehouse) => ({
        value: warehouse.id,
        label: warehouse.name,
      }));
    } else {
      return userWarehouses?.map((warehouse) => ({
        value: warehouse.id,
        label: warehouse.name,
      }));
    }
  }, [warehouseType]);
  useEffect(() => {
    getWarehousesBySectionIds({
      sectionIds: sectionId,
    });
  }, [sectionId]);
  useEffect(() => {
    getWarehouses({});
  }, []);
  //
  const [test, setTest] = useState<boolean>(false);
  //
  return (
    <>
      <Space direction="vertical" size={12}>
        <DateIntervalForm
          customStyle={{
            intervalStyle: {
              width: 150,
            },
            dateStyle: undefined,
          }}
          form={form}
          itemname={"interval"}
        />
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            gap: 12,
          }}
        >
          <Form.Item label="Нярав" name="userId">
            <NewFilterSelect
              style={{
                width: 100,
              }}
              onChange={(id: number) => {
                // const filtered = warehouses
                //   .filter((warehouse) => {
                //     if (warehouse.userIds.includes(id)) {
                //       return warehouse;
                //     }
                //   })
                //   .filter(Boolean);
                // setUserWarehouses(filtered ? filtered : []);
              }}
              options={users.map((user) => ({
                value: user.id,
                label: `${user.lastName?.substring(0, 1).toUpperCase()}. ${
                  user.firstName
                }`,
              }))}
            />
          </Form.Item>
          <Space.Compact>
            <Form.Item label=" " name="warehouseType">
              <NewSelect
                options={[
                  {
                    label: "Бүлэг",
                    value: 0,
                  },
                  {
                    label: "Бараа",
                    value: 1,
                  },
                ]}
              />
            </Form.Item>
            <a onClick={() => setTest(true)}>asd</a>
            <Form.Item label="Байршил" name="warehouseId">
              <NewFilterSelect options={warehouseOptions} />
            </Form.Item>
          </Space.Compact>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0,1fr))",
            gap: 12,
            alignItems: "flex-end",
          }}
        >
          <Form.Item label="Нярав" name="userId">
            <NewFilterSelect
              onChange={(id: number) => {
                const filtered = warehouses
                  .filter((warehouse) => {
                    // if (warehouse.userIds.includes(id)) {
                    //   return warehouse;
                    // }
                  })
                  .filter(Boolean);
                setUserWarehouses(filtered ? filtered : []);
              }}
              options={users.map((user) => ({
                value: user.id,
                label: `${user.lastName?.substring(0, 1).toUpperCase()}. ${
                  user.firstName
                }`,
              }))}
            />
          </Form.Item>
          <Space.Compact>
            <Form.Item label=" ">
              <NewSelect
                options={[
                  {
                    label: "Бүлэг",
                  },
                ]}
              />
            </Form.Item>
            <Form.Item label="Байршил" name="warehouseId">
              <NewFilterSelect
                options={userWarehouses?.map((warehouse) => ({
                  value: warehouse.id,
                  label: warehouse.name,
                }))}
              />
            </Form.Item>
          </Space.Compact>
        </div>
      </Space>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0,1fr))",
          gap: 12,
          alignItems: "flex-end",
        }}
      >
        <DateIntervalForm
          customStyle={{
            intervalStyle: undefined,
            dateStyle: undefined,
          }}
          form={form}
          itemname={"interval"}
        />

        <Space.Compact
          style={{
            alignItems: "flex-end",
          }}
        >
          <Form.Item label="Бараа:" name="type">
            <NewSelect
              options={[
                {
                  label: "Бүлэг",
                  value: "section",
                },
                {
                  label: "Бараа",
                  value: "material",
                },
              ]}
            />
          </Form.Item>
        </Space.Compact>
        <Form.Item label="Барааний төрөл">
          <NewSelect
            options={[
              {
                label: "Dag",
                value: 1,
              },
            ]}
          />
        </Form.Item>
        <Form.Item label="Бараа код, нэр">
          <NewSelect
            options={[
              {
                label: "Dag",
                value: 1,
              },
            ]}
          />
        </Form.Item>
        <Form.Item label="Брэнд">
          <NewSelect
            options={[
              {
                label: "Dag",
                value: 1,
              },
            ]}
          />
        </Form.Item>
      </div>
      <NewModal open={test} onCancel={() => setTest(false)}>
        <StoragiesRegistration
          ComponentType="MIDDLE"
          onClickModal={(row) => console.log(row)}
        />
      </NewModal>
    </>
  );
};
export default RStorage1Filter;

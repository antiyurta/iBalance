"use client";
import React, { useContext, useEffect, useState } from "react";
import withAuth from "@/feature/hoc/withAuth";
import { Tabs, TabsProps, Tooltip } from "antd";
import { useRouter } from "next/navigation";
import { RootState, useTypedSelector } from "@/feature/store/reducer";
import { useDispatch, useSelector } from "react-redux";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
//components
import { NewAvatar, NewDatePicker, NewSelect } from "@/components/input";
import Sidebar from "./Sidebar";
import { TabsActions } from "@/feature/core/actions/TabsActions";
import { authService } from "@/service/authentication/service";
import { IUser } from "@/service/authentication/entities";
import { IDataWarehouse } from "@/service/reference/warehouse/entities";
import { PosService } from "@/service/pos/service";
import { getUniqueValues } from "@/feature/common";
import { AppDispatch } from "@/feature/store/store";
import { setWarehouse } from "@/feature/store/slice/warehouse.slice";
import { WarehouseService } from "@/service/reference/warehouse/service";

type TargetKey = React.MouseEvent | React.KeyboardEvent | string;

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const title = useTypedSelector((state: RootState) => state.title);
  const blockContext: BlockView = useContext(BlockContext);
  const { activeKey, tabItems } = useTypedSelector(
    (state: RootState) => state.tabs
  );
  // const warehouses = useTypedSelector((state) => state.warehouses);
  const [tabsItems, setTabsItems] = useState<TabsProps["items"]>([]);
  const [user, setUser] = useState<IUser>();
  const [warehouses, setWarehouses] = useState<IDataWarehouse[]>([]);
  const warehouse = useTypedSelector((state) => state.warehouse);

  const remove = (targetKey: TargetKey) => {
    blockContext.block();
    let newActiveKey = activeKey;
    let lastIndex = -1;
    tabsItems?.forEach((item, i) => {
      if (item.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const newPanes = tabsItems?.filter((item) => item.key !== targetKey);
    if (newPanes?.length && newActiveKey === targetKey) {
      if (lastIndex >= 0) {
        newActiveKey = newPanes[lastIndex].key;
      } else {
        newActiveKey = newPanes[0].key;
      }
    }
    dispatch(TabsActions.removeTab(newPanes || []));
    dispatch(TabsActions.setTabActiveKey(newActiveKey));
    blockContext.unblock();
  };
  const onEdit = (targetKey: TargetKey, action: "add" | "remove") => {
    if (action === "remove") {
      remove(targetKey);
    }
  };
  const onChange = (key: string) => {
    dispatch(TabsActions.setTabActiveKey(key));
  };
  const getWarehouses = async () => {
    await PosService.get({ isAuth: true })
      .then((response) => {
        if (response.success) {
          setWarehouses(getUniqueValues(response.response.data, "warehouse"));
        }
      })
      .finally(() => {
        const warehouse = warehouses.find(
          (warehouse) => warehouse.isActive == true
        );
        if (warehouse) dispatch(setWarehouse(warehouse));
      });
  };
  const selectWarehouse = async (id: number) => {
    await WarehouseService.getById(id).then((response) => {
      if (response.success) {
        dispatch(setWarehouse(response.response));
      }
    })
  };
  useEffect(() => {
    setTabsItems(tabItems);
  }, [tabItems]);
  useEffect(() => {
    if (!activeKey.includes("/main/")) {
      router.push("/main/dashboard" + activeKey);
    } else {
      router.push(activeKey);
    }
  }, [activeKey]);
  useEffect(() => {
    authService.authGet().then((response) => {
      if (response.success) {
        setUser(response.response);
      }
    });
    getWarehouses();
  }, []);
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
      }}
    >
      <Sidebar />
      <div
        style={{
          padding: "0px 24px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          overflow: "auto",
          width: "100%",
          height: "100%",
        }}
      >
        <div className="navbar">
          <div className="left">
            <p>{title.label}</p>
          </div>
          <div className="right">
            <div className="date">
              <p>Тайлант үе:</p>
              <NewDatePicker placeholder="YYYY-MM" />
            </div>
            <div className="nav-profile">
              <NewAvatar size={24} src={"/images/navbar/Image.png"} />
              <p>{user?.firstName}</p>
            </div>
            <div className="dep">
              <NewSelect
                value={warehouse.id}
                options={warehouses.map((warehouse) => ({
                  label: (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: "12px",
                        alignItems: "center",
                      }}
                    >
                      <NewAvatar size={32} />
                      <p
                        style={{
                          margin: "0px",
                        }}
                      >
                        {warehouse.name}
                      </p>
                    </div>
                  ),
                  value: warehouse.id,
                }))}
                onSelect={selectWarehouse}
              ></NewSelect>
            </div>
          </div>
        </div>
        <main
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <Tabs
            activeKey={activeKey}
            hideAdd={true}
            onChange={onChange}
            type="editable-card"
            onEdit={onEdit}
            items={tabsItems}
            tabBarExtraContent={{
              right: (
                <Tooltip
                  placement="bottomLeft"
                  title="Лайтай бавал бусдыг гарга"
                >
                  <button>Таб гаргах</button>
                </Tooltip>
              ),
            }}
          />
          {children}
        </main>
      </div>
    </div>
  );
};
export default withAuth(DashboardLayout);

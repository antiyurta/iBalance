"use client";
import React, { useContext, useEffect, useState } from "react";
import withAuth from "@/feature/hoc/withAuth";
import { Button, Layout, Row, Tabs, TabsProps, Tooltip } from "antd";
import { useRouter } from "next/navigation";
import { RootState, useTypedSelector } from "@/feature/store/reducer";
import { useDispatch, useSelector } from "react-redux";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
//components
import { NewAvatar, NewDatePicker, NewSelect } from "@/components/input";
import Sidebar from "./Sidebar";

import { authService } from "@/service/authentication/service";
import { IUser } from "@/service/authentication/entities";
import { IDataWarehouse } from "@/service/reference/warehouse/entities";
import { PosService } from "@/service/pos/service";
import { getUniqueValues } from "@/feature/common";
import { AppDispatch } from "@/feature/store/store";
import { setWarehouse } from "@/feature/store/slice/warehouse.slice";
import { WarehouseService } from "@/service/reference/warehouse/service";
import {
  changeTabs,
  emptyTabs,
  removeTab,
} from "@/feature/store/slice/tab.slice";

const { Sider, Content } = Layout;

type TargetKey = React.MouseEvent | React.KeyboardEvent | string;

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const tab = useTypedSelector((state: RootState) => state.tabs);
  const currentTab = tab.tabItems.find((item) => item.key == tab.activeKey);
  const blockContext: BlockView = useContext(BlockContext);
  const { activeKey, tabItems } = useTypedSelector(
    (state: RootState) => state.tabs
  );
  const [tabsItems, setTabsItems] = useState<TabsProps["items"]>([]);
  const [warehouses, setWarehouses] = useState<IDataWarehouse[]>([]);
  const [isChildrenCollapse, setChildrenCollapse] = useState<boolean>(false);
  const user = useTypedSelector((state) => state.user);
  const warehouse = useTypedSelector((state) => state.warehouse);

  const onEdit = (targetKey: TargetKey, action: "add" | "remove") => {
    if (action === "remove") {
      dispatch(removeTab(String(targetKey)));
    }
  };
  const onChange = (key: string) => {
    dispatch(
      changeTabs({
        activeKey: key,
        tabItems: tabItems,
      })
    );
  };
  const getWarehouses = async () => {
    await PosService.get({
      isAuth: true,
      filters: [],
    })
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
    });
  };
  useEffect(() => {
    setTabsItems(
      tabItems.map((item) => ({
        key: item.key,
        label: item.label,
        closable: item.closeable,
      }))
    );
  }, [tabItems]);
  useEffect(() => {
    if (!activeKey.includes("/main/")) {
      router.push("/main/dashboard" + activeKey);
    } else {
      router.push(activeKey);
    }
  }, [activeKey]);
  useEffect(() => {
    // authService.authGet().then((response) => {
    //   if (response.success) {
    //     setUser(response.response);
    //   }
    // });
    getWarehouses();
  }, []);
  return (
    <Layout>
      <Sider
        collapsedWidth={80}
        collapsed={isChildrenCollapse}
        width={240}
        theme="light"
        className="second"
      >
        <Sidebar isCollapsed={setChildrenCollapse} />
      </Sider>
      <Content>
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "100vh",
          }}
        >
          <div
            style={{
              overflow: "auto",
              padding: "0px 24px",
              display: "flex",
              flexDirection: "column",
              gap: 12,
              width: "100%",
            }}
          >
            <div className="navbar">
              <div className="left">
                <p>{currentTab?.breadcrumb[0]}</p>
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
                height: "calc(100vh - 64px)",
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
                      title="Нийт табуудыг гаргах"
                    >
                      <Button type="link" onClick={() => dispatch(emptyTabs())}>
                        Таб гаргах
                      </Button>
                    </Tooltip>
                  ),
                }}
              />
              {children}
            </main>
          </div>
        </div>
      </Content>
    </Layout>
  );
};
export default withAuth(DashboardLayout);

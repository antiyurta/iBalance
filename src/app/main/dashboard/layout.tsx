"use client";
import React, { useContext, useEffect, useState } from "react";
import withAuth from "@/feature/hoc/withAuth";
import { Tabs, TabsProps } from "antd";
import { useRouter } from "next/navigation";
import { RootState, useTypedSelector } from "@/feature/store/reducer";
import { useDispatch } from "react-redux";
import { PathActions } from "@/feature/core/actions/PathAction";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
//components
import { NewAvatar, NewDatePicker, NewSelect } from "@/components/input";
import Sidebar from "./Sidebar";

type TargetKey = React.MouseEvent | React.KeyboardEvent | string;

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const title = useTypedSelector((state: RootState) => state.title);
  const blockContext: BlockView = useContext(BlockContext);
  const { label, path } = useTypedSelector(
    (state: RootState) => state.currentPath
  );
  const [activeKey, setActiveKey] = useState<string>("/main/dashboard");
  const [tabsItems, setTabsItems] = useState<TabsProps["items"]>([
    {
      key: "/main/dashboard",
      label: "Хянах самбар",
      closable: false,
    },
  ]);
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
        dispatch(
          PathActions.setPathData({
            label: newPanes[lastIndex].label,
            path: newActiveKey.split(","),
          })
        );
      } else {
        newActiveKey = newPanes[0].key;
        dispatch(
          PathActions.setPathData({
            label: newPanes[0].label,
            path: newActiveKey.split(","),
          })
        );
      }
    }
    setTabsItems(newPanes);
    setActiveKey(newActiveKey);
    blockContext.unblock();
  };
  const onEdit = (targetKey: TargetKey, action: "add" | "remove") => {
    if (action === "remove") {
      remove(targetKey);
    }
  };
  const onChange = (key: string) => {
    const selectedMenuKeys: string[] = key.split(",");
    if (selectedMenuKeys.length === 0) {
      dispatch(
        PathActions.setPathData({
          label: "Хянах самбар",
          path: ["/main/dashboard"],
        })
      );
    } else {
      dispatch(
        PathActions.setPathData({
          label: tabsItems?.find((e) => e.key === key)?.label?.toString(),
          path: key.split(","),
        })
      );
    }
  };
  useEffect(() => {
    blockContext.block();
    if (!tabsItems?.find((item) => item.key === path.toString())) {
      setTabsItems((tabsItems: TabsProps["items"]) => {
        if (tabsItems != undefined) {
          return [
            ...tabsItems,
            {
              key: path.toString(),
              label: label,
            },
          ];
        }
      });
    }
    if (path.length > 1) {
      router.push("/main/dashboard" + path.join(""));
    } else {
      router.push(path.join(""));
    }
    setTimeout(() => {
      setActiveKey(path.toString());
    }, 100);
    blockContext.unblock();
  }, [path]);

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
              <p>Б.Бадамхатан #0001</p>
            </div>
            <div className="dep">
              <NewSelect
                options={[
                  {
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
                          Салбар-1 УИД
                        </p>
                      </div>
                    ),
                    value: 0,
                  },
                ]}
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
          />
          {children}
        </main>
      </div>
    </div>
  );
};
export default withAuth(DashboardLayout);

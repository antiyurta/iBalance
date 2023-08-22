"use client";
import React, { useContext, useEffect, useState } from "react";
import withAuth from "@/feature/hoc/withAuth";
import RigthSide from "../layout/RightSide";
import { Tabs, TabsProps } from "antd";
import { useRouter } from "next/navigation";
import { RootState, useTypedSelector } from "@/feature/store/reducer";
import { useDispatch } from "react-redux";
import { PathActions } from "@/feature/core/actions/PathAction";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
//components
import {
  NewAvatar,
  NewDatePicker,
  NewOption,
  NewSelect,
} from "@/components/input";

type TargetKey = React.MouseEvent | React.KeyboardEvent | string;

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const blockContext: BlockView = useContext(BlockContext);
  const { label, path } = useTypedSelector(
    (state: RootState) => state.currentPath
  );
  const [activeKey, setActiveKey] = useState<string>("/dashboard");
  const [tabsItems, setTabsItems] = useState<TabsProps["items"]>([
    {
      key: "/dashboard",
      label: "Хянах самбар",
      children: children,
      closable: false,
    },
  ]);
  const remove = (targetKey: TargetKey) => {
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
  };
  const onEdit = (targetKey: TargetKey, action: "add" | "remove") => {
    if (action === "remove") {
      remove(targetKey);
    }
  };
  const onChange = (key: string) => {
    console.log("key", key);
    const selectedMenuKeys: string[] = key.split(",");
    if (selectedMenuKeys.length === 0) {
      dispatch(
        PathActions.setPathData({
          label: "Хянах самбар",
          path: ["/dashboard"],
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
    // setTimeout(() => {
    //   console.log("===>");
    // }, 10000);

    if (!tabsItems?.find((item) => item.key === path.toString())) {
      setTabsItems((tabsItems: TabsProps["items"]) => {
        if (tabsItems != undefined) {
          return [
            ...tabsItems,
            {
              key: path.toString(),
              label: label,
              children: children,
            },
          ];
        }
      });
    }
    setActiveKey(path.toString());
    if (path.length > 1) {
      router.push("/dashboard" + path.join(""));
    } else {
      router.push(path.join(""));
    }
    blockContext.unblock();
  }, [path]);
  useEffect(() => {
    blockContext.block();
    setTimeout(() => {
      blockContext.unblock();
    }, 1000);
  });

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
      }}
    >
      <RigthSide />
      <div
        style={{
          width: "100%",
          padding: "0px 24px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          overflow: "auto",
        }}
      >
        <div className="navbar">
          <div className="left">
            <p>Агуулахын систем</p>
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
              <NewSelect>
                <NewOption value={0}>
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
                </NewOption>
              </NewSelect>
            </div>
          </div>
        </div>
        <main>
          <Tabs
            activeKey={activeKey}
            hideAdd={true}
            onChange={onChange}
            type="editable-card"
            onEdit={onEdit}
            items={tabsItems}
            destroyInactiveTabPane={true}
          />
        </main>
      </div>
    </div>
  );
};
export default withAuth(DashboardLayout);

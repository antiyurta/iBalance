"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface IGeneralMenu {
  id: number;
  to: string;
  iconUrl: string;
}

const Sidebar = () => {
  const pathname = usePathname();
  const [selectedMenu, setSelectedMenu] = useState<Number>(7);
  const menu: IGeneralMenu[] = [
    {
      id: 0,
      to: "/main/dashboard",
      iconUrl: "icon-b",
    },
    {
      id: 1,
      to: "/main/settings",
      iconUrl: "icon-setting",
    },
    {
      id: 2,
      to: "/main/mail",
      iconUrl: "icon-mail",
    },
  ];
  const buttonMenu: IGeneralMenu[] = [
    {
      id: 3,
      to: "/main/messenger",
      iconUrl: "icon-messenger",
    },
    {
      id: 4,
      to: "/main/team",
      iconUrl: "icon-teams",
    },
    {
      id: 5,
      to: "/main/bell",
      iconUrl: "icon-bell",
    },
  ];
  useEffect(() => {
    if (pathname) {
      buttonMenu?.map((menu) => {
        if (pathname.includes(menu.to)) {
          setSelectedMenu(menu.id);
        }
      });
      menu?.map((item) => {
        if (pathname.includes(item.to)) {
          setSelectedMenu(item.id);
        }
      });
      if (pathname.includes("/main/profile/general")) {
        setSelectedMenu(7);
      }
    }
  }, [pathname]);
  return (
    <div className="leftSide">
      <div className="top">
        <Image
          src="/images/VowyOW.tif.svg"
          loading="eager"
          width={48}
          height={32}
          alt="logo"
        />
        <ul>
          {menu.map((item, index) => {
            return (
              <Link
                key={index}
                href={item.to}
                className={selectedMenu === item.id ? "active" : ""}
              >
                <div className="content">
                  <span
                    className={
                      selectedMenu === item.id
                        ? `icon ${item.iconUrl} active`
                        : `icon ${item.iconUrl}`
                    }
                  />
                </div>
              </Link>
            );
          })}
        </ul>
      </div>
      <div className="bottom">
        <ul>
          {buttonMenu.map((item, index) => {
            return (
              <Link
                key={index}
                href={item.to}
                className={selectedMenu === item.id ? "active" : ""}
              >
                <div className="content">
                  <span
                    className={
                      selectedMenu === item.id
                        ? `icon ${item.iconUrl} active`
                        : `icon ${item.iconUrl}`
                    }
                  />
                </div>
              </Link>
            );
          })}
          <Link
            href={"/main/profile/general"}
            className={selectedMenu === 7 ? "active" : ""}
          >
            <div className="content-profile">
              <span
                style={{
                  width: 40,
                  height: 40,
                }}
                className={
                  selectedMenu === 7 ? "icon-profile active" : "icon-profile"
                }
              />
            </div>
          </Link>
        </ul>
      </div>
    </div>
  );
};
export default Sidebar;

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface IGeneralMenu {
  id: number;
  to: string;
  iconUrl: string;
}

const LeftSide = () => {
  const router = useRouter();
  const [selectedMenu, setSelectedMenu] = useState<Number>(7);
  const menu: IGeneralMenu[] = [
    {
      id: 0,
      to: "/dashboard",
      iconUrl: "icon-b",
    },
    {
      id: 1,
      to: "/dashboard",
      iconUrl: "icon-setting",
    },
    {
      id: 2,
      to: "/dashboard",
      iconUrl: "icon-mail",
    },
  ];
  const buttonMenu: IGeneralMenu[] = [
    {
      id: 3,
      to: "/dashboard",
      iconUrl: "icon-messenger",
    },
    {
      id: 4,
      to: "/dashboard",
      iconUrl: "icon-teams",
    },
    {
      id: 5,
      to: "/profile/general",
      iconUrl: "icon-bell",
    },
  ];

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
                onClick={() => setSelectedMenu(item.id)}
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
                onClick={() => setSelectedMenu(item.id)}
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
            href={"/profile/general"}
            className={selectedMenu === 7 ? "active" : ""}
            onClick={() => setSelectedMenu(7)}
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
export default LeftSide;

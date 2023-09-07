"use client";

import CustomerList from "./customerList";
import DescriptionList from "./descriptionList";
import { NewSearch } from "@/components/input";
import { Tabs } from "antd";
import Image from "next/image";
const items = [
  {
    label: "Харилцагчийн жагсаалт",
    key: "item-1",
    children: <CustomerList />,
  },
  {
    label: "Дэлгэрэнгүй жагсаалт",
    key: "item-2",
    children: <DescriptionList />,
  },
];
const BeginningBalance = () => {
  return (
    <div>
      <div className="information">
        <div className="header">
          <div className="left">
            <p>Үндсэн бүртгэл / Харилцагч / Эхний үлдэгдэл</p>
            <button
              className="app-button"
              // onClick={() => openModal(false)}
            >
              <Image
                src={"/images/AddIcon.svg"}
                width={12}
                height={12}
                alt="addicon"
              />
              Эхний үлдэгдэл
            </button>
          </div>
          <div className="right">
            <NewSearch
              prefix={
                <Image
                  src={"/images/SearchIcon.svg"}
                  width={12}
                  height={12}
                  alt="searchIcon"
                />
              }
              allowClear={true}
              onSearch={(values: string) => console.log(values)}
            />
          </div>
        </div>
        <Tabs className="lineTop" items={items} />
      </div>
    </div>
  );
};
export default BeginningBalance;

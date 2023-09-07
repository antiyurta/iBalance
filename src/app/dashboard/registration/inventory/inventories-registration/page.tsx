"use client";

import { NewSearch } from "@/components/input";
import Image from "next/image";

const InventoriesRegistration = () => {
  return (
    <div>
      <div className="information">
        <div className="header">
          <div className="left">
            <p>Үндсэн бүртгэл / Бараа материал / Бүртгэл</p>
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
              Шинээр бүртгэх
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
      </div>
    </div>
  );
};
export default InventoriesRegistration;

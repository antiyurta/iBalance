"use client";

import Image from "next/image";
import { NewInput, NewSearch } from "./input";

const FilterDropDown = () => {
  return (
    <div
      style={{
        display: "flex",
        padding: 16,
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 8,
        borderRadius: 8,
        background: "white",
        boxShadow: "0px 8px 16px 0px rgba(0, 0, 0, 0.15)",
      }}
    >
      <div
        style={{
          display: "flex",
          width: 248,
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 8,
        }}
      >
        <p
          style={{
            fontSize: 14,
            fontWeight: 500,
            color: "black",
            margin: 0,
          }}
        >
          Эрэмбэлэх
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 12,
            alignSelf: "stretch",
            justifyContent: "space-evenly",
          }}
        >
          <button
            className="app-button-regular"
            style={{
              width: "100%",
            }}
          >
            A-Я
          </button>
          <button
            className="app-button-regular"
            style={{
              width: "100%",
            }}
          >
            Я-A
          </button>
        </div>
      </div>
      <div
        style={{
          width: "100%",
          height: 1,
          backgroundColor: "#DEE2E6",
        }}
      />
      <p
        style={{
          fontSize: 14,
          fontWeight: 500,
          color: "black",
          margin: 0,
        }}
      >
        Хайх
      </p>
      <NewInput
        prefix={
          <Image
            src={"/images/SearchIcon.svg"}
            width={12}
            height={12}
            alt="searchIcon"
          />
        }
        placeholder="Хайх үгээ энд бичнэ үү"
      />
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: 20,
          alignSelf: "stretch",
        }}
      >
        <button
          className="app-button-regular"
          style={{
            color: "#198754",
          }}
        >
          Цэрэвлэх
        </button>
        <button
          className="app-button-regular"
          style={{
            color: "white",
            backgroundColor: "#198754",
            border: "1px solid #198754",
          }}
        >
          Хайх
        </button>
      </div>
    </div>
  );
};
export default FilterDropDown;

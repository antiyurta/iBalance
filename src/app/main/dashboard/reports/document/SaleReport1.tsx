import React from "react";
import { Table } from "antd";
import type { TableColumnsType } from "antd";

interface DataType {
  key: React.Key;
  name: string;
  age: number;
  street: string;
  building: string;
  number: number;
  companyAddress: string;
  companyName: string;
  gender: string;
}

const columns: TableColumnsType<DataType> = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    width: 100,
    fixed: "left",
    filters: [
      {
        text: "Joe",
        value: "Joe",
      },
      {
        text: "John",
        value: "John",
      },
    ],
    onFilter: (value, record) => record.name.indexOf(value as string) === 0,
  },
  {
    title: "Other",
    children: [
      {
        title: "Age",
        dataIndex: "age",
        key: "age",
        width: 150,
        sorter: (a, b) => a.age - b.age,
      },
      {
        title: "Address",
        children: [
          {
            title: "Street",
            dataIndex: "street",
            key: "street",
            width: 150,
          },
          {
            title: "Block",
            children: [
              {
                title: "Building",
                dataIndex: "building",
                key: "building",
                width: 100,
              },
              {
                title: "Door No.",
                dataIndex: "number",
                key: "number",
                width: 100,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    title: "Company",
    children: [
      {
        title: "Company Address",
        dataIndex: "companyAddress",
        key: "companyAddress",
        width: 200,
      },
      {
        title: "Company Name",
        dataIndex: "companyName",
        key: "companyName",
      },
    ],
  },
  {
    title: "Gender",
    dataIndex: "gender",
    key: "gender",
    width: 80,
    fixed: "right",
  },
];
const twoDimensionalArray = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

const data: DataType[] = [];
for (let i = 0; i < 100; i++) {
  data.push({
    key: i,
    name: "John Brown",
    age: i + 1,
    street: "Lake Park",
    building: "C",
    number: 2035,
    companyAddress: "Lake Street 42",
    companyName: "SoftLake Co",
    gender: "M",
  });
}

const SaleReport1: React.FC = () => {
  
  return (
    // <Table
    //   columns={columns}
    //   dataSource={data}
    //   bordered
    //   size="middle"
    //   scroll={{ x: "calc(700px + 50%)", y: 240 }}
    // />
    <div className="report-document">
      <div className="report-body">
        <table className="report">
          <thead>
            <tr>
              <td colSpan={4}>ID</td>
              <td colSpan={3}>1</td>
              <td colSpan={3}>2</td>
            </tr>
            <tr>
              <td colSpan={4}>Тушаалын огноо</td>
              <td colSpan={3}>2024-03-01</td>
              <td colSpan={3}>2024-03-02</td>
            </tr>
            <tr>
              <td colSpan={4}>Мөрдөж эхлэх огноо</td>
              <td colSpan={3}>2024-03-01</td>
              <td colSpan={3}>2024-03-02</td>
            </tr>
            <tr>
              <td colSpan={4}>Нийтэд мөрдөх эсэх</td>
              <td colSpan={3}>Тийм</td>
              <td colSpan={3}>Үгүй</td>
            </tr>
            <tr>
              <td colSpan={4}>Мөрдөх төв, салбарын нэр</td>
              <td colSpan={3}>--</td>
              <td colSpan={3}>Салбар-1</td>
            </tr>
            <tr>
              <td colSpan={4}>Харилцагчийн нэр</td>
              <td colSpan={3}>Монгол японы эмнэлэг</td>
              <td colSpan={3}>--</td>
            </tr>
            <tr>
              <td colSpan={4}>Үүсгэсэн огноо</td>
              <td colSpan={3}>2024-03-01</td>
              <td colSpan={3}>2024-03-02</td>
            </tr>
            <tr>
              <td colSpan={4}>Үүсгэсэн хэрэглэгч</td>
              <td colSpan={3}>Ичинхорол</td>
              <td colSpan={3}>Өлзийхутаг</td>
            </tr>
            <tr>
              <td colSpan={4}>Өөрчилсөн огноо</td>
              <td colSpan={3}>2024-03-01</td>
              <td colSpan={3}>2024-03-02</td>
            </tr>
            <tr>
              <td colSpan={4}>Өөрчилсөн хэрэглэгч</td>
              <td colSpan={3}>Өлзийхутаг</td>
              <td colSpan={3}>Ичинхорол</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Дотоод код</td>
              <td>Бараа материал</td>
              <td>Хэмжих нэгж</td>
              <td>Багц доторх тоо</td>
              <td>Нэгж үнэ</td>
              <td>Бөөний үнээрх тоо хэмжээ</td>
              <td>Бөөний нэгжийн үнэ</td>
              <td>Нэгж үнэ</td>
              <td>Бөөний үнээрх тоо хэмжээ</td>
              <td>Бөөний нэгжийн үнэ</td>
            </tr>
            <tr>
              <td>М-001</td>
              <td>Пара</td>
              <td>кг</td>
              <td>3</td>
              <td>3000</td>
              <td>5</td>
              <td>2500</td>
              <td>4500</td>
              <td>4</td>
              <td>4000</td>
            </tr>
          </tbody>
          {twoDimensionalArray.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={`${i}-${j}`}>{cell}</td>
              ))}
            </tr>
          ))}
        </table>
      </div>
    </div>
  );
};

export default SaleReport1;

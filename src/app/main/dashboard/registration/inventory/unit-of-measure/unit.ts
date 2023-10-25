import { MeasurementType } from "@/service/material/unitOfMeasure/entities";

export const units = [
  {
    title: "Хэмжих нэгжийн бүлэг",
    key: "0-0",
    children: [
      {
        title: "Тооны хэмжих нэгж",
        key: MeasurementType.Quantity,
        isLeaf: true,
      },
      {
        title: "Уртын хэмжих нэгж",
        key: MeasurementType.Length,
        isLeaf: true,
      },
      {
        title: "Шингэний хэмжих нэгж",
        key: MeasurementType.Volume,
        isLeaf: true,
      },
      {
        title: "Талбайн хэмжих нэгж",
        key: MeasurementType.Area,
        isLeaf: true,
      },
      {
        title: "Цаг хугацааны хэмжих нэгж",
        key: MeasurementType.Time,
        isLeaf: true,
      },
      {
        title: "Хүндийн хэмжих нэгж",
        key: MeasurementType.Weight,
        isLeaf: true,
      },
    ],
  },
];

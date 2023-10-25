import { MeasurementType } from "@/service/material/unitOfMeasure/entities";
import { IDataUnit } from "./unitOfMeasure";

export const units: IDataUnit[] = [
  {
    id: 1,
    name: "Хэмжих нэгжийн бүлэг",
    sectionId: null,
    isExpand: true,
  },
  {
    id: 2,
    name: "Тооны хэмжих нэгж",
    sectionId: 1,
    isExpand: false,
  },
  {
    id: 3,
    name: "Уртын хэмжих нэгж",
    sectionId: 1,
    isExpand: false,
  },
  {
    id: 4,
    name: "Шингэний хэмжих нэгж",
    sectionId: 1,
    isExpand: false,
  },
  {
    id: 5,
    name: "Талбайн хэмжих нэгж",
    sectionId: 1,
    isExpand: false,
  },
  {
    id: 6,
    name: "Цаг хугацааны хэмжих нэгж",
    sectionId: 1,
    isExpand: false,
  },
  {
    id: 7,
    name: "Хүндийн хэмжих нэгж",
    sectionId: 1,
    isExpand: false,
  },
];

export const unitSwitch = (id: number) => {
  switch (id) {
    case 1:
      return [
        MeasurementType.Area,
        MeasurementType.Length,
        MeasurementType.Quantity,
        MeasurementType.Time,
        MeasurementType.Volume,
        MeasurementType.Weight,
      ];
    case 2:
      return [MeasurementType.Quantity];
    case 3:
      return [MeasurementType.Length];
    case 4:
      return [MeasurementType.Volume];
    case 5:
      return [MeasurementType.Area];
    case 6:
      return [MeasurementType.Time];
    case 7:
      return [MeasurementType.Weight];
    default:
      return;
  }
};

import { MeasurementType } from "@/service/material/unitOfMeasure/entities";
import { IDataUnit } from "./unitOfMeasure";

export const units: IDataUnit[] = [
  {
    id: 1,
    name: "Хэмжих нэгжийн бүлэг",
    sectionId: null,
    isExpand: true,
    sections: [],
  },
  {
    id: 2,
    name: "Тооны хэмжих нэгж",
    sectionId: 1,
    isExpand: false,
    sections: [],
  },
  {
    id: 3,
    name: "Уртын хэмжих нэгж",
    sectionId: 1,
    isExpand: false,
    sections: [],
  },
  {
    id: 4,
    name: "Эзлэхүүн хэмжих нэгж",
    sectionId: 1,
    isExpand: false,
    sections: [],
  },
  {
    id: 5,
    name: "Талбайн хэмжих нэгж",
    sectionId: 1,
    isExpand: false,
    sections: [],
  },
  {
    id: 6,
    name: "Цаг хугацааны хэмжих нэгж",
    sectionId: 1,
    isExpand: false,
    sections: [],
  },
  {
    id: 7,
    name: "Хүндийн хэмжих нэгж",
    sectionId: 1,
    isExpand: false,
    sections: [],
  },
  {
    id: 8,
    name: "Тусгай хэмжих нэгж",
    sectionId: 1,
    isExpand: false,
    sections: [],
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
        MeasurementType.Other,
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
    case 8:
      return [MeasurementType.Other];
    default:
      return;
  }
};

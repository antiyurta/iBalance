import { CSSProperties } from "react";

const style: CSSProperties = { fontSize: "12", fontWeight: 400 };
export const enumTranslation = (value: string) => {
  if (value == "PAID")
    return <div style={{ ...style, color: "#198754" }}>Төлөгдсөн</div>;
  else if (value == "REFUND")
    return <div style={{ ...style, color: "#DC3545" }}>Буцаасан</div>;
  else if (value == "LENDING")
    return <div style={{ ...style, color: "#ffc107" }}>Төлөгдөөгүй</div>;
  else if (value == "ACT_AMORTIZATION")
    return <div style={{ ...style, color: "green" }}>Акт хорогдол</div>;
  else if (value == "CENCUS")
    return <div style={{ ...style, color: "green" }}>Тооллого</div>;
  else if (value == "PURCHASE")
    return (
      <div style={{ ...style, color: "green" }}>Татан авалт/Худалдан авалт</div>
    );
  else if (value == "SALE_RETURN")
    return <div style={{ ...style, color: "green" }}>Буцаалт</div>;
  else if (value == "SALES")
    return <div style={{ ...style, color: "green" }}>Борлуулалт</div>;
  else if (value == "PURCHASE_RETURN")
    return (
      <div style={{ ...style, color: "green" }}>Худалдан авалтын буцаалт</div>
    );
  else if (value == "IN_OPERATION")
    return <div style={{ ...style, color: "green" }}>Үйл ажиллагаанд</div>;
  else if (value == "MOVEMENT_IN_WAREHOUSE")
    return (
      <div style={{ ...style, color: "green" }}>Агуулах доторх хөдөлгөөн</div>
    );
  else if (value == "ITEM_CONVERSION")
    return <div style={{ ...style, color: "green" }}>Барааны хөрвүүлэг</div>;
  else if (value == "MIXTURE")
    return <div style={{ ...style, color: "green" }}>Хольц</div>;
  else if (value == "POS")
    return <div style={{ ...style, color: "green" }}>Посын борлуулалт</div>;
  else if (value == "POS_SALE_RETURN")
    return <div style={{ ...style, color: "green" }}>Пос буцаалт</div>;
  else if (value == "BOOKING_SALE")
    return <div style={{ ...style, color: "green" }}>Захиалгын борлуулалт</div>;
  else if (value == "AREA")
    return <div style={{ ...style, color: "green" }}>Талбайн хэмжих нэгж</div>;
  else if (value == "LENGTH")
    return <div style={{ ...style, color: "green" }}>Уртын хэмжих нэгж</div>;
  else if (value == "Quantity")
    return <div style={{ ...style, color: "green" }}>Тооны хэмжих нэгж</div>;
  else if (value == "TIME")
    return <div style={{ ...style, color: "green" }}>Цаг хугацааны хэмжих нэгж</div>;
  else if (value == "VOLUME")
    return <div style={{ ...style, color: "green" }}>Эзлэхүүн хэмжих нэгж</div>;
  else if (value == "WEIGTH")
    return <div style={{ ...style, color: "green" }}>Хүндийн хэмжих нэгж</div>;
  else if (value == "OTHER")
    return <div style={{ ...style, color: "green" }}>Тусгай хэмжих нэгж</div>;
  else if (value == "EMPLOYEE")
    return <div style={{ ...style, color: "green" }}>Ажилтан</div>;
  else if (value == "TREASURE")
    return <div style={{ ...style, color: "green" }}>Нягтлан</div>;
  else if (value == "CASHIER")
    return <div style={{ ...style, color: "green" }}>Кассчин</div>;
  else
    return <div style={{ ...style, color: "green" }}>{value}</div>;
};

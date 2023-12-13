import { CSSProperties } from "react";

const style: CSSProperties = { fontSize: "12", fontWeight: 400 };
export const enumTranslation = (value: string) => {
  if (value == "PAID")
    return (
      <div
        style={{
          ...style,
          color: "var(--green-500, #198754)",
        }}
      >
        Төлөгдсөн
      </div>
    );
  else if (value == "REFUND")
    return (
      <div
        style={{
          ...style,
          color: "var(--theme-danger, #DC3545)",
        }}
      >
        Буцаасан
      </div>
    );
  else if (value == "LENDING")
    return (
      <div
        style={{
          ...style,
          color: "var(--theme-warning, #FFC107)",
        }}
      >
        Төлөгдөөгүй
      </div>
    );
};

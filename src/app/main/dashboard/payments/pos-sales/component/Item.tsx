import Image from "next/image";

const Item = () => {
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 8,
          justifyContent: "space-between",
        }}
      >
        <Image src="/images/vera.png" width={50} height={50} alt="dd" />
        <div
          style={{
            height: "100%",
            width: 1,
            background: "#DEE2E6",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <div>1</div>
          <div>1</div>
          <div>1</div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <p>0.00%</p>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 3,
          }}
        >
          <button>-</button>
          <button>2</button>
          <button>+</button>
        </div>
      </div>
    </div>
  );
};
export default Item;

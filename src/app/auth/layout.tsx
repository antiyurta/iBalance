import Image from "next/image";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="basis-layout">
      <div className="navbar">
        <Image
          src={"/images/iBalance.png"}
          loading="eager"
          priority={true}
          alt="textLogo"
          width={275}
          height={42}
        />
      </div>
      <p className="hellomsg">
        Байгууллагын нөөцийн удирдлагын системд тавтай морил
      </p>
      <div className="body">{children}</div>
    </div>
  );
};
export default layout;

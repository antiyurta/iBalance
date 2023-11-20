import Image from "next/image";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="basis-layout">
      <div className="navbar">
        <Image
          src={"/images/iBALANCE.png"}
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
      <div className="footer">
        {/* <div className="bottom">
          <div className="box">
            <Image
              src={"/icons/facebook.png"}
              loading="eager"
              priority={true}
              alt="facebook"
              width={36}
              height={36}
            />
          </div>
          <div className="box">
            <Image
              src={"/icons/facebook.png"}
              loading="eager"
              priority={true}
              alt="facebook"
              width={36}
              height={36}
            />
          </div>
          <div className="box">
            <Image
              src={"/icons/facebook.png"}
              loading="eager"
              priority={true}
              alt="facebook"
              width={36}
              height={36}
            />
          </div>
        </div> */}
      </div>
    </div>
  );
};
export default layout;

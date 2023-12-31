import Image from "next/image";
import { QRCode } from "antd";
import { IDataDocument } from "@/service/document/entities";
interface IProps {
  posDocument: IDataDocument;
}
const Bill = (props: IProps) => {
  const { posDocument } = props;
  return (
    <div className="bill">
      <div className="bill-header">
        <div className="top">
          <Image
            src={"/images/iBALANCE.png"}
            loading="eager"
            priority={true}
            alt="textLogo"
            width={80}
            height={14}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 5,
            }}
          >
            <Image
              src={"/images/bill/www.svg"}
              loading="eager"
              priority={true}
              alt="user"
              width={12}
              height={12}
            />
            <p>www.iBalance.mn</p>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 5,
            }}
          >
            <Image
              src={"/images/bill/phone.svg"}
              loading="eager"
              priority={true}
              alt="user"
              width={12}
              height={12}
            />
            <p>88889181</p>
          </div>
        </div>
        <div className="bottom">
          <div className="employee">
            <Image
              src={"/images/bill/user.svg"}
              loading="eager"
              priority={true}
              alt="user"
              width={16}
              height={16}
            />
            <p>Ажилтан:</p>
            <p>110206</p>
          </div>
          <div className="pos">
            <Image
              src={"/images/bill/numpad.svg"}
              loading="eager"
              priority={true}
              alt="user"
              width={16}
              height={16}
            />
            <p>Пос:</p>
            <p>177</p>
          </div>
        </div>
      </div>
      <div className="warehouse-info">
        <div className="info">
          <h5>Салбар:</h5>
          <p>Төв салбар</p>
        </div>
        <div className="address">
          <h5>Хаяг:</h5>
          <p>Баянгол наруто</p>
        </div>
        <div className="date">
          <h5>Огноо:</h5>
          <p>2023.10.25 15:44</p>
        </div>
        <div className="ddtd">
          <h5>ДДТД:</h5>
          <p>1230321326546512132465451321564654561</p>
        </div>
      </div>
      <div className="services">
        <table>
          <thead>
            <tr>
              <th>Бараа</th>
              <th>Т/Ш</th>
              <th>Нэгж үнэ</th>
              <th>Үнд/Үнэ</th>
              <th>Нийт</th>
            </tr>
          </thead>
          <tbody>
            {posDocument.transactions?.map((transaction, index) => (
              <tr key={index}>
                <td>{transaction.material?.name}</td>
                <td>{transaction.expenseQty}</td>
                <td>{transaction.unitAmount}</td>
                <td>{transaction.totalAmount}</td>
                <td>{transaction.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="result">
          <div className="items">
            <h4>Нийт үнэ</h4>
            <h4>{posDocument.amount}</h4>
          </div>
          <div className="items">
            <h5>Нийт хөнгөлөлт</h5>
            <h5>{posDocument.discountAmount}</h5>
          </div>
          <div className="items">
            <h4>Хариулт</h4>
            <h4>0</h4>
          </div>
        </div>
      </div>
      <div className="barimt">
        <div>
          <QRCode type="svg" bordered={false} size={100} value="ibalacne" />
        </div>
        <div className="ebarimt-info">
          <p>Сугалааны дугаар</p>
          <p>{posDocument.lottery}</p>
          <p>EBarimt-ын дүн</p>
          <p>{posDocument.payAmount}</p>
        </div>
      </div>
    </div>
  );
};
export default Bill;

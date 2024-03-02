import Image from "next/image";
import { QRCode } from "antd";
import { IDataPosDocument } from "@/service/document/pos-document/entites";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import NewModal from "@/components/modal";
import { PrinterOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/feature/store/store";
import { emptyGoods } from "@/feature/store/slice/point-of-sale/goods.slice";
import { emptyShoppingCart } from "@/feature/store/slice/point-of-sale/shopping-cart.slice";
import { useTypedSelector } from "@/feature/store/reducer";
interface IProps {
  posDocument: IDataPosDocument;
  isBill: boolean;
  setIsBill: Dispatch<SetStateAction<boolean>>;
}
const Bill: React.FC<IProps> = ({ isBill, setIsBill, posDocument }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { employee, hospital } = useTypedSelector((state) => state.user);
  const warehouse = useTypedSelector((state) => state.warehouse);
  const printRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });
  return (
    <NewModal
      width={300}
      title="Баримт"
      open={isBill}
      okText={
        <div style={{ display: "flex", gap: 10 }}>
          <PrinterOutlined />
          Хэвлэх
        </div>
      }
      onOk={() => handlePrint()}
      onCancel={() => {
        setIsBill(false);
        dispatch(emptyGoods());
        dispatch(emptyShoppingCart());
      }}
    >
      <div className="bill" ref={printRef}>
        <div className="bill-header">
          <div className="top">
            <div>
              <p>{hospital?.name}</p>
            </div>
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
              <p>{hospital?.email}</p>
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
              <p>{hospital?.phone}</p>
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
              <p>{employee?.firstName}</p>
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
            <p>{warehouse.name}</p>
          </div>
          <div className="address">
            <h5>Хаяг:</h5>
            <p>{hospital?.address}</p>
          </div>
          <div className="date">
            <h5>Огноо:</h5>
            <p>{posDocument.createdAt}</p>
          </div>
          <div className="ddtd">
            <h5>ДДТД:</h5>
            <p>{posDocument.billId}</p>
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
              {posDocument.document &&
                posDocument.document.transactions?.map((transaction, index) => (
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
              <h4>{posDocument.totalAmount}</h4>
            </div>
            <div className="items">
              <h4>Нийт хөнгөлөлт</h4>
              <h4>{posDocument.membershipPoint}</h4>
            </div>
            <div className="items">
              <h4>Нийт хямдрал</h4>
              <h4>{posDocument.goodsDiscountAmount}</h4>
            </div>
            <div className="items">
              <h4>Дүн</h4>
              <h4>{posDocument.paidAmount}</h4>
            </div>
            {posDocument.invoices?.map((item) => (
              <ul className="items" key={item.id}>
                <li>{item.paymentMethodName}</li>
                <li>{item.incomeAmount}</li>
              </ul>
            ))}
            <div className="items">
              <h4>Хариулт</h4>
              <h4>{posDocument.paidAmount - posDocument.payAmount}</h4>
            </div>
          </div>
        </div>
        <div className="barimt">
          <div>
            <QRCode type="svg" bordered={false} size={100} value={posDocument.qrData} />
          </div>
          <div className="ebarimt-info">
            <p>Сугалааны дугаар</p>
            <p>{posDocument.lottery}</p>
            <p>EBarimt-ын дүн</p>
            <p>{posDocument.payAmount}</p>
            
          </div>
        </div>
        <p>ТАНД БАЯРЛАЛАА</p>
        <p>Та худалдан авсан бараагаа тооцооны хуудсын хамт авч ирээд тухайн өдөртөө буцаах боломжтой</p>
      </div>
    </NewModal>
  );
};
export default Bill;

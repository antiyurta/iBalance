import { Form } from "antd";
import { FormItemType, IOptions } from "./index";
import { NewDatePicker, NewInput, NewSelect } from "@/components/input";
import mnMN from "antd/es/calendar/locale/mn_MN";

interface IProps {
  type: FormItemType;
  options?: IOptions[];
  disabled: boolean;
}

export function formItems(props: IProps) {
  const { type, disabled, options } = props;
  switch (type) {
    case FormItemType.INPUT:
      return <NewInput disabled={disabled} />;
    case FormItemType.SELECT:
      return <NewSelect disabled={disabled} options={options} />;
    case FormItemType.DATE_PICKER:
      return (
        <NewDatePicker
          disabled={disabled}
          style={{
            width: "100%",
          }}
          format={"YYYY-MM-DD"}
          locale={mnMN}
        />
      );
    // case FormItemType.ORDER_ID:
    //   return (
    //     <Form.Item
    //       key={key}
    //       rules={[
    //         {
    //           required: required,
    //           message: "Захиалгын ID заавал",
    //         },
    //       ]}
    //       label="Захиалгын ID"
    //       name={name}
    //     >
    //       <NewInput disabled={disabled} />
    //     </Form.Item>
    //   );
    // case FormItemType.STATUS:
    //   return (
    //     <Form.Item
    //       key={key}
    //       rules={[
    //         {
    //           required: required,
    //           message: "Баримтын төлөв заавал",
    //         },
    //       ]}
    //       label="Баримтын төлөв"
    //       name={name}
    //     >
    //       <NewSelect
    //         disabled={disabled}
    //         options={[
    //           {
    //             value: 0,
    //             label: (
    //               <span
    //                 style={{
    //                   color: "red",
    //                 }}
    //               >
    //                 dsada
    //               </span>
    //             ),
    //           },
    //         ]}
    //       />
    //     </Form.Item>
    //   );
    // case FormItemType.SALE_DATE:
    //   return (
    //     <Form.Item
    //       key={key}
    //       rules={[
    //         {
    //           required: required,
    //           message: "Захилга өгсөн огноо заавал",
    //         },
    //       ]}
    //       label="Захилга өгсөн огноо"
    //       name={name}
    //     >
    //       <NewDatePicker
    //         style={{
    //           width: "100%",
    //         }}
    //         format={"YYYY-MM-DD"}
    //         locale={mnMN}
    //       />
    //     </Form.Item>
    //   );
    // case FormItemType.ORDER_CONSUMER:
    //   return (
    //     <Form.Item
    //       key={key}
    //       rules={[
    //         {
    //           required: required,
    //           message: "Захилга өгсөн Хэрэглэгч",
    //         },
    //       ]}
    //       label="Захилга өгсөн Хэрэглэгч"
    //       name={name}
    //     >
    //       <NewInput disabled={disabled} />
    //     </Form.Item>
    //   );
    // case FormItemType.DATE:
    //   return (
    //     <Form.Item
    //       key={key}
    //       rules={[
    //         {
    //           required: required,
    //           message: "Oгноо Хэрэглэгч",
    //         },
    //       ]}
    //       label="Oгноо"
    //       name={name}
    //     >
    //       <NewDatePicker
    //         disabled={disabled}
    //         style={{
    //           width: "100%",
    //         }}
    //         format={"YYYY-MM-DD"}
    //         locale={mnMN}
    //       />
    //     </Form.Item>
    //   );
    // case FormItemType.LOCATION_INCOME:
    //   return (
    //     <Form.Item
    //       key={key}
    //       rules={[
    //         {
    //           required: required,
    //           message: "Орлогын байршил",
    //         },
    //       ]}
    //       label="Орлогын байршил"
    //       name={name}
    //     >
    //       <NewSelect
    //         disabled={disabled}
    //         options={[
    //           {
    //             value: 0,
    //             label: "test",
    //           },
    //         ]}
    //       />
    //     </Form.Item>
    //   );
    // case FormItemType.LOCATION_EXPAND:
    //   return (
    //     <Form.Item
    //       key={key}
    //       rules={[
    //         {
    //           required: required,
    //           message: "Зарлагын байршил",
    //         },
    //       ]}
    //       label="Зарлагын байршил"
    //       name={name}
    //     >
    //       <NewSelect
    //         disabled={disabled}
    //         options={[
    //           {
    //             value: 0,
    //             label: "test",
    //           },
    //         ]}
    //       />
    //     </Form.Item>
    //   );
    // case FormItemType.NAME:
    //   return (
    //     <Form.Item
    //       key={key}
    //       rules={[
    //         {
    //           required: required,
    //           message: "Харилцагчийн нэр",
    //         },
    //       ]}
    //       label="Харилцагчийн нэр"
    //       name={name}
    //     >
    //       <NewSelect
    //         disabled={disabled}
    //         options={[
    //           {
    //             value: 0,
    //             label: "test",
    //           },
    //         ]}
    //       />
    //     </Form.Item>
    //   );
    // case FormItemType.PAYMENT_TYPE:
    //   return (
    //     <Form.Item
    //       key={key}
    //       rules={[
    //         {
    //           required: required,
    //           message: "Төлбөрийн хэлбэр",
    //         },
    //       ]}
    //       label="Төлбөрийн хэлбэр"
    //       name={name}
    //     >
    //       <NewSelect
    //         disabled={disabled}
    //         options={[
    //           {
    //             value: 0,
    //             label: "test",
    //           },
    //         ]}
    //       />
    //     </Form.Item>
    //   );
    // case FormItemType.TOTAL:
    //   return (
    //     <Form.Item
    //       key={key}
    //       rules={[
    //         {
    //           required: required,
    //           message: "Нийт дүн заавал",
    //         },
    //       ]}
    //       label="Нийт дүн"
    //       name={name}
    //     >
    //       <NewInput disabled={disabled} />
    //     </Form.Item>
    //   );
    // case FormItemType.DISCOUNT:
    //   return (
    //     <Form.Item
    //       key={key}
    //       rules={[
    //         {
    //           required: required,
    //           message: "Бараа үйлчилгээний хөнгөлөлт заавал",
    //         },
    //       ]}
    //       label="Бараа үйлчилгээний хөнгөлөлт"
    //       name={name}
    //     >
    //       <NewInput disabled={disabled} />
    //     </Form.Item>
    //   );
    // case FormItemType.DISCOUNT_CONSUMER:
    //   return (
    //     <Form.Item
    //       key={key}
    //       rules={[
    //         {
    //           required: required,
    //           message: "Харилцагчийн хөнгөлөлт заавал",
    //         },
    //       ]}
    //       label="Харилцагчийн хөнгөлөлт"
    //       name={name}
    //     >
    //       <NewInput disabled={disabled} />
    //     </Form.Item>
    //   );
    // case FormItemType.PAID_AMOUNT:
    //   return (
    //     <Form.Item
    //       key={key}
    //       rules={[
    //         {
    //           required: required,
    //           message: "Төлөх дүн заавал",
    //         },
    //       ]}
    //       label="Төлөх дүн"
    //       name={name}
    //     >
    //       <NewInput disabled={disabled} />
    //     </Form.Item>
    //   );
    // case FormItemType.AMOUNT_DISCOUNT:
    // return (
    //   <Form.Item
    //     key={key}
    //     rules={[
    //       {
    //         required: required,
    //         message: "Бараа материалын үнийн хөнгөлөлт заавал",
    //       },
    //     ]}
    //     label="Бараа материалын үнийн хөнгөлөлт"
    //     name={name}
    //   >
    //     <NewInput disabled={disabled} />
    //   </Form.Item>
    // );
    default:
      return;
  }
}

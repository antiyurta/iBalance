import { NewInputNumber } from "@/components/input";
import { IDataReference } from "@/service/reference/entity";
import { Form, FormListFieldData, Table } from "antd";
import { FormInstance } from "antd/lib";
import { NumericFormat } from "react-number-format";

interface IProps {
  data: FormListFieldData[];
  moneyType: IDataReference[] | undefined;
  form: FormInstance;
  add: () => void;
  remove: (index: number) => void;
}

const { Column } = Table;

interface DummyProps {
  readonly value?: any;
}

const EditableTable = (props: IProps) => {
  const { data, moneyType, form, add, remove } = props;
  const onChange = (quantity: number, index: number) => {
    if (moneyType) {
      const value = moneyType[index].name;
      form.setFieldsValue({
        ["moneys"]: {
          [index]: {
            amount: Number(value) * quantity,
          },
        },
      });
    }
  };

  const DummyForSelect = (props: DummyProps) => {
    if (props.value && moneyType) {
      return (
        <NumericFormat
          value={moneyType?.find((type) => type.id === props.value)?.name}
          thousandSeparator=","
          fixedDecimalScale
          displayType="text"
        />
      );
    }
  };
  const Dummy = (props: DummyProps) => {
    return (
      <NumericFormat
        value={props.value}
        thousandSeparator=","
        decimalScale={2}
        fixedDecimalScale
        displayType="text"
      />
    );
  };
  return (
    <div>
      <Table
        dataSource={data}
        pagination={false}
        summary={(pageData) => {
          let counts: number = 0;
          let totals: number = 0;
          pageData.forEach(({ name }) => {
            counts =
              counts + Number(form.getFieldValue(["moneys", name, "quantity"]));
            totals =
              totals + Number(form.getFieldValue(["moneys", name, "amount"]));
          });
          return (
            <>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0}>-</Table.Summary.Cell>
                <Table.Summary.Cell index={1}>{counts}</Table.Summary.Cell>
                <Table.Summary.Cell index={2}>
                  <NumericFormat
                    value={totals}
                    thousandSeparator=","
                    decimalScale={2}
                    fixedDecimalScale
                    displayType="text"
                  />
                </Table.Summary.Cell>
              </Table.Summary.Row>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={3}>
                  <div
                    style={{
                      width: "100%",
                      padding: "12px 24px",
                    }}
                  >
                    <span
                      style={{
                        color: "#6c757d",
                        fontSize: 14,
                        fontWeight: 700,
                        lineHeight: "15px",
                      }}
                    >
                      Нийт дүн:
                      <NumericFormat
                        value={totals}
                        thousandSeparator=","
                        decimalScale={2}
                        fixedDecimalScale
                        displayType="text"
                      />
                      ₮
                    </span>
                  </div>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </>
          );
        }}
      >
        <Column
          title="Дэвсгэрт"
          render={(text, row, index) => {
            return (
              <Form.Item noStyle name={[index, "sectionMoneyId"]}>
                <DummyForSelect />
              </Form.Item>
            );
          }}
        />
        <Column
          title="Тоо"
          render={(text, row, index) => (
            <Form.Item name={[index, "quantity"]}>
              <NewInputNumber
                min={0}
                onChange={(e) => onChange(e as number, index)}
              />
            </Form.Item>
          )}
        />
        <Column
          title="Бэлэн дүн"
          render={(text, row, index) => {
            return (
              <Form.Item noStyle name={[index, "amount"]}>
                <Dummy />
              </Form.Item>
            );
          }}
        />
      </Table>
    </div>
  );
};
export default EditableTable;

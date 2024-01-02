import { NewCheckbox, NewInput } from "@/components/input";
import { Column } from "@/components/table";
import { IDataRole } from "@/service/permission/role/entities";
import { Form, Table } from "antd";
import { FormInstance } from "antd/lib";
import { useEffect } from "react";
interface IProps {
  form: FormInstance<IDataRole>;
}
export const PermissionList = (props: IProps) => {
  const { form } = props;
  const selectAllPermission = (isValue: boolean, index: number) => {
    form.setFieldValue(["permissions", index, "isAdd"], isValue);
    form.setFieldValue(["permissions", index, "isView"], isValue);
    form.setFieldValue(["permissions", index, "isEdit"], isValue);
    form.setFieldValue(["permissions", index, "isDelete"], isValue);
  };
  useEffect(() => {
    console.log("is is working ==>");
    form.setFieldsValue({
      permissions: [
        {
          roleId: 1,
          role: {},
          userId: 1,
          url: "Hello",
          isAdd: false,
          isView: false,
          isEdit: false,
          isDelete: false,
        },
      ],
    });
  }, [form]);
  return (
    <Form.List name="permissions">
      {(fields) => (
        <Table dataSource={fields}>
          <Column
            dataIndex={"url"}
            title="Цэс"
            render={(_, __, index) => (
              <>
                <Form.Item name={[index, "url"]}>
                  <NewInput
                    disabled
                    suffix={
                      <NewCheckbox
                        onChange={(e) =>
                          selectAllPermission(e.target.checked, index)
                        }
                      />
                    }
                  />
                </Form.Item>
              </>
            )}
          />
          <Column
            dataIndex={"isAdd"}
            title="Нэмэх"
            render={(_, __, index) => (
              <Form.Item name={[index, "isAdd"]} valuePropName="checked">
                <NewCheckbox />
              </Form.Item>
            )}
          />
          <Column
            dataIndex={"isView"}
            title="Харах"
            render={(_, __, index) => (
              <Form.Item name={[index, "isView"]} valuePropName="checked">
                <NewCheckbox />
              </Form.Item>
            )}
          />
          <Column
            dataIndex={"isEdit"}
            title="Засах"
            render={(_, __, index) => (
              <Form.Item name={[index, "isEdit"]} valuePropName="checked">
                <NewCheckbox />
              </Form.Item>
            )}
          />
          <Column
            dataIndex={"isDelete"}
            title="Устгах"
            render={(_, __, index) => (
              <Form.Item name={[index, "isDelete"]} valuePropName="checked">
                <NewCheckbox />
              </Form.Item>
            )}
          />
        </Table>
      )}
    </Form.List>
  );
};

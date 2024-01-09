import { NewCheckbox, NewInput, NewSelect } from "@/components/input";
import { Column } from "@/components/table";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import { IDataPermission, IEmployeePermission } from "@/service/permission/entities";
import { IDataResource } from "@/service/permission/resource/entities";
import { ResourceService } from "@/service/permission/resource/service";
import { IDataRole } from "@/service/permission/role/entities";
import { Form, Table } from "antd";
import { FormInstance } from "antd/lib";
import { useContext, useEffect, useState } from "react";
interface IProps {
  form: FormInstance<IDataRole | IEmployeePermission>;
  isEdit: boolean;
}
export const PermissionList = (props: IProps) => {
  const { form, isEdit } = props;
  const blockContext: BlockView = useContext(BlockContext);
  const [resources, setResources] = useState<IDataResource[]>([]);
  const selectAllPermission = (isValue: boolean, index: number) => {
    form.setFieldValue(["permissions", index, "isAdd"], isValue);
    form.setFieldValue(["permissions", index, "isView"], isValue);
    form.setFieldValue(["permissions", index, "isEdit"], isValue);
    form.setFieldValue(["permissions", index, "isDelete"], isValue);
  };
  const getResource = () => {
    blockContext.block();
    const permissions: IDataPermission[] = [];
    ResourceService.get()
      .then((response) => {
        if (response.success) {
          const { data } = response.response;
          setResources(data);
          data.map((resource) => {
            permissions.push({
              id: undefined,
              roleId: undefined,
              userId: undefined,
              resourceId: resource.id,
              resource: resource,
              isAdd: false,
              isView: false,
              isEdit: false,
              isDelete: false,
            });
          });
          form.setFieldsValue({
            permissions,
          });
        }
      })
      .finally(() => blockContext.unblock());
  };
  useEffect(() => {
    if (!isEdit) getResource();
  }, [form, isEdit]);
  return (
    <Form.List name="permissions">
      {(fields) => (
        <Table dataSource={fields}>
          <Column
            dataIndex={"resourceId"}
            title="Код"
            width={150}
            render={(_, __, index) => (
              <>
                <Form.Item name={[index, "resourceId"]}>
                  <NewInput disabled />
                </Form.Item>
              </>
            )}
          />
          <Column
            dataIndex={"name"}
            title="Цэс"
            render={(_, __, index) => (
              <>
                <Form.Item name={[index, "resource", "name"]}>
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

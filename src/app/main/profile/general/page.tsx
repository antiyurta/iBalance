"use client";

import { NewInput } from "@/components/input";
import { useAuthContext } from "@/feature/context/AuthContext";
import { authService } from "@/service/authentication/service";
import { Button, Col, Form, Row, Typography } from "antd";
import { useContext, useEffect, useState } from "react";
import { FormItemProps } from "antd/lib/form";
import { IChangeProfile } from "@/service/authentication/entities";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";

const { Title } = Typography;

interface EditableFormItemProps extends FormItemProps {
  readonly editing: boolean | undefined;
}

const General = () => {
  const [form] = Form.useForm();
  const { set } = useAuthContext();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const blockContext: BlockView = useContext(BlockContext);

  const getProfile = async () => {
    authService.authGet().then((response) => {
      set(response.response);
      form.setFieldsValue({
        firstName: response.response.firstName,
        lastName: response.response.lastName,
        registerNumber: response.response.employee.registerNumber,
        hospitalName: response.response.hospital.name,
        roleName: response.response.role.name,
        phoneNo: response.response.employee.phoneNo,
        email: response.response.email,
      });
    });
  };
  const FormItem = (props: EditableFormItemProps) => {
    const { editing, ...rest } = props;
    interface InputProps {
      readonly value?: any;
    }

    const InputValue = (props: InputProps) => (
      <div style={{ fontSize: 16, fontWeight: 500, color: "#4E5969" }}>
        {props.value}
      </div>
    );
    return (
      <Form.Item {...rest}>
        {editing ? props.children : <InputValue />}
      </Form.Item>
    );
  };
  const changeProfile = (values: IChangeProfile) => {
    blockContext.block()
    authService.changeProfile(values).then((response) => {
      if (response.success) {
        set(response.response);
      }
    }).finally(() => blockContext.unblock());
  };
  useEffect(() => {
    getProfile();
  }, []);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <Title
        style={{
          fontSize: 16,
          fontWeight: 600,
          color: "#198754",
          padding: "8px 0px",
          borderBottom: "1px solid #E5E6EB",
        }}
      >
        Хувийн мэдээлэл
      </Title>
      <Row>
        <Col span={12}>
          <Form form={form} layout="vertical">
            <div className="form-grid-2">
              <FormItem
                label="Эцэг /эх/-ийн нэр:"
                name="lastName"
                editing={isEdit}
              >
                <NewInput />
              </FormItem>
              <FormItem label="Өөрийн нэр:" name="firstName" editing={isEdit}>
                <NewInput />
              </FormItem>
              <FormItem
                label="Регистерийн дугаар:"
                name="registerNumber"
                editing={false}
              >
                <NewInput />
              </FormItem>
              <FormItem
                label="Албан байгууллага:"
                name="hospitalName"
                editing={false}
              >
                <NewInput />
              </FormItem>
              <FormItem label="Албан тушаал:" name="roleName" editing={false}>
                <NewInput />
              </FormItem>
            </div>
          </Form>
        </Col>
      </Row>
      <Title
        style={{
          fontSize: 16,
          fontWeight: 600,
          color: "#198754",
          padding: "8px 0px",
          borderBottom: "1px solid #E5E6EB",
        }}
      >
        Холбогдох мэдээлэл
      </Title>
      <Row>
        <Col span={12}>
          <Form form={form} layout="vertical">
            <div className="form-grid-2">
              <FormItem label="Гар утас:" name="phoneNo" editing={false}>
                <NewInput />
              </FormItem>
              <FormItem label="Имэйл хаяг:" name="email" editing={false}>
                <NewInput />
              </FormItem>
            </div>
          </Form>
        </Col>
      </Row>
      <Button
        style={{
          width: 400,
        }}
        onClick={() => {
          setIsEdit(!isEdit);
          form.validateFields().then((values) => {
            changeProfile(values);
          });
        }}
      >
        Засах
      </Button>
    </div>
  );
};
export default General;

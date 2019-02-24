import React, { PureComponent } from "react";
import { Form, Input, Spin } from "antd";
import MaskedInput from "react-text-mask";
import { FormComponentProps } from "antd/lib/form/Form";
import { Client } from "../../../models/order";
import "./cart.less";

const FormItem = Form.Item;

interface CmpProps {
  loading: boolean;
  sendOrder: (client: Client | undefined) => void;
}

interface FormValues {
  name: string | undefined;
  phone: string | undefined;
}

class UserData extends PureComponent<CmpProps & FormComponentProps> {
  constructor(props: CmpProps & FormComponentProps) {
    super(props);
  }
  private checkData = (e: React.FormEvent<HTMLInputElement>): void => {
    e.preventDefault();
    this.props.form.validateFields((err: any, values: FormValues) => {
      if (err) return;
      const { name } = values;
      const phone = `+7 ${values.phone}`.replace(/[^\d]/g, "");
      if (!name || !phone) return;
      return this.props.sendOrder({ name, phone });
    });
  };
  render() {
    const { getFieldDecorator, isFieldTouched } = this.props.form;
    const { loading } = this.props;
    return (
      <div className="cart-step-user-data">
        <Form id="order" onSubmit={this.checkData}>
          <Spin spinning={loading}>
            <FormItem label="Имя" hasFeedback={true}>
              {getFieldDecorator("name", {
                validateTrigger: "onBlur",
                rules: [
                  {
                    validator: (rule, value, callback) => {
                      if (!isFieldTouched("name"))
                        return callback("Заполните имя!");
                      if (value.trim() === "")
                        return callback("Заполните имя!");
                      return callback();
                    }
                  }
                ]
              })(<Input placeholder="Имя..." />)}
            </FormItem>
            <FormItem label="Телефон" hasFeedback={true}>
              {getFieldDecorator("phone", {
                validateTrigger: "onBlur",
                rules: [
                  {
                    validator: (rule, value, callback) => {
                      if (!isFieldTouched("phone"))
                        return callback("Заполните телефон!");
                      if (value.trim() === "")
                        return callback("Заполните телефон!");
                      if (value.replace(/[^\d]/g, "").length !== 10)
                        return callback("Телефон заполнен не верно!");
                      return callback();
                    }
                  }
                ]
              })(
                <span className="ant-input-group-wrapper">
                  <span className="ant-input-wrapper ant-input-group">
                    <span className="ant-input-group-addon">+7</span>
                    <MaskedInput
                      className="ant-input"
                      placeholder="(999) 999-99-99"
                      mask={[
                        "(",
                        /[1-9]/,
                        /\d/,
                        /\d/,
                        ")",
                        " ",
                        /\d/,
                        /\d/,
                        /\d/,
                        "-",
                        /\d/,
                        /\d/,
                        "-",
                        /\d/,
                        /\d/
                      ]}
                    />
                  </span>
                </span>
              )}
            </FormItem>
          </Spin>
        </Form>
      </div>
    );
  }
}

export default Form.create()(UserData);

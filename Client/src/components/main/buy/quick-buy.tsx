import React, { PureComponent } from "react";
import { Modal, Form, Input, InputNumber, Spin, Button, message } from "antd";
import { FormComponentProps } from "antd/lib/form/Form";
import MaskedInput from "react-text-mask";
import { ProductCart } from "../../../store/cart/model";
import { addOrder } from "../../../fetch/order";
import "./buy.less";

const FormItem = Form.Item;

interface CmpProps {
  productCart: ProductCart;
}

interface CmpStates {
  loading: boolean;
  visible: boolean;
}

interface FormValue {
  name: string | undefined;
  phone: string | undefined;
  count: number | undefined;
}

class QuickBuy extends PureComponent<CmpProps & FormComponentProps, CmpStates> {
  constructor(props: CmpProps & FormComponentProps) {
    super(props);
    this.state = { loading: false, visible: false };
  }
  isUnmounted: boolean = false;
  componentWillUnmount() {
    this.isUnmounted = true;
  }
  private showModal = (): void => {
    this.setState({ visible: true });
  };
  private handleCancel = (): void => {
    this.setState({ visible: false });
  };
  private handleSubmit = (e: React.FormEvent<HTMLInputElement>): void => {
    e.preventDefault();
    this.props.form.validateFields((err: any, values: FormValue) => {
      if (err) return;
      const { name, count } = values;
      const phone = `+7 ${values.phone}`.replace(/[^\d]/g, "");
      const { name: product, price } = this.props.productCart;
      if (!name || !count || !phone) return;
      const order = {
        client: { name, phone },
        productList: [{ product, price, count }]
      };
      this.setState({ loading: true });
      addOrder(order, msg => {
        if (this.isUnmounted) return;
        this.setState({ loading: false });
        message[msg.type](msg.text);
        if (msg.type !== "success") return;
        return setTimeout(() => {
          this.props.form.resetFields();
          this.setState({ visible: false });
        }, 1200);
      });
    });
  };
  render() {
    const { getFieldDecorator, isFieldTouched } = this.props.form;
    const { name, count, stock } = this.props.productCart;
    const { visible, loading } = this.state;
    const formID = `${Date.now()}/${name}`;
    return (
      <div className="quick-buy">
        <Button type="primary" onClick={this.showModal}>
          Купить в 1 клик
        </Button>
        <Modal
          title={`Купить "${name}" в 1 клик`}
          visible={visible}
          onCancel={this.handleCancel}
          footer={[
            <Button
              form={formID}
              key="submit"
              type="primary"
              htmlType="submit"
              disabled={loading}
            >
              Купить
            </Button>
          ]}
        >
          <Form id={formID} onSubmit={this.handleSubmit}>
            <Spin spinning={this.state.loading}>
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
              <FormItem label="Количество">
                {getFieldDecorator("count", {
                  initialValue: count
                })(<InputNumber min={1} max={stock} />)}
              </FormItem>
            </Spin>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default Form.create()(QuickBuy);

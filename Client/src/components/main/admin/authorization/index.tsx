import React, { PureComponent } from "react";
import { Form, Input, Button, Spin, message } from "antd";
import { connect } from "react-redux";
import { FormComponentProps } from "antd/lib/form/Form";
import { setToken } from "../../../../store/token/actions";
import { Msg } from "../../../../models/msg";
import { User, isUser } from "../../../../store/token/model";
import "./authorization.less";

const FormItem = Form.Item;

interface CmtProps {
  setToken: (userData: User, callback: (msg: Msg) => void) => void;
}

interface CmtStates {
  loading: boolean;
}

class Authorization extends PureComponent<
  CmtProps & FormComponentProps,
  CmtStates
> {
  constructor(props: CmtProps & FormComponentProps) {
    super(props);
    this.state = { loading: false };
  }
  isUnmounted: boolean = false;
  componentWillUnmount() {
    this.isUnmounted = true;
  }
  private handleSubmit = (e: React.FormEvent<HTMLInputElement>): void => {
    e.preventDefault();
    this.props.form.validateFields((err: any, values: any) => {
      if (err) return;
      if (!isUser(values)) return;
      this.setState({ loading: true });
      return this.props.setToken(values, msg => {
        if (this.isUnmounted) return;
        this.setState({ loading: false });
        message[msg.type](msg.text);
      });
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const { loading } = this.state;
    return (
      <div className="admin-authorization">
        <Form onSubmit={this.handleSubmit}>
          <Spin spinning={loading}>
            <FormItem label="Логин" hasFeedback={true}>
              {getFieldDecorator("login", {
                validateTrigger: "onBlur",
                rules: [
                  { required: true, message: "Заполните логин!" },
                  { whitespace: true, message: "Заполните логин!" }
                ]
              })(<Input type="text" />)}
            </FormItem>
            <FormItem label="Пароль" hasFeedback={true}>
              {getFieldDecorator("password", {
                validateTrigger: "onBlur",
                rules: [
                  { required: true, message: "Заполните пароль!" },
                  { whitespace: true, message: "Заполните пароль!" }
                ]
              })(<Input type="password" />)}
            </FormItem>
            <FormItem>
              <Button type="primary" htmlType="submit" disabled={loading}>
                Войти
              </Button>
            </FormItem>
          </Spin>
        </Form>
      </div>
    );
  }
}

const mapDispatchToProps = { setToken };

export default connect(
  null,
  mapDispatchToProps
)(Form.create()(Authorization));

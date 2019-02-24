import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { Form, Input, InputNumber, Button, Drawer, Spin, message } from "antd";
import { FormComponentProps } from "antd/lib/form/Form";
import {
  Product,
  isNewProduct,
  isEditedProduct
} from "../../../../models/product";
import { ServerProducts } from "../../../../models/product";
import CustomUpload from "./custom-upload";
import { addProduct, editProduct } from "../../../../fetch/product";
import { State } from "../../../../store";
import { Token } from "../../../../store/token/model";
import { isString } from "../../../../utils/type-checking";
import "./catalog.less";

const FormItem = Form.Item;
const { TextArea } = Input;

interface CmpProps {
  token: Token;
  categoryID: string | undefined;
  visibleForm: boolean;
  closeForm: () => void;
  addNewProduct: () => void;
  updateProducts: (data: ServerProducts) => void;
  selectedProduct: Product | undefined;
}

interface CmpStates {
  visible: boolean;
  loading: boolean;
  images: string[];
  previewImage: string;
  previewVisible: boolean;
}

class CreateProduct extends PureComponent<
  CmpProps & FormComponentProps,
  CmpStates
> {
  constructor(props: CmpProps & FormComponentProps) {
    super(props);
    this.state = {
      visible: false,
      loading: false,
      images: [],
      previewImage: "",
      previewVisible: false
    };
  }
  componentDidMount() {
    if (this.props.selectedProduct)
      this.setState({ images: this.props.selectedProduct.images });
  }
  componentDidUpdate(prevProps: CmpProps) {
    if (this.props.visibleForm !== prevProps.visibleForm) {
      this.setState({ visible: this.props.visibleForm });
    }
    if (
      this.props.selectedProduct !== prevProps.selectedProduct &&
      this.props.selectedProduct
    ) {
      this.setState({ images: this.props.selectedProduct.images });
    }
  }
  private onClose = (): void => {
    if (!this.state.loading) this.props.closeForm();
  };
  private _addProduct = (values: any, token: Token | null): void => {
    const { categoryID } = this.props;
    if (!isString(categoryID)) return;
    const newProduct = Object.assign(values, { categoryID });
    if (!isNewProduct(newProduct)) return;
    this.setState({ loading: true });
    addProduct(token, newProduct, (msg, data) => {
      this.setState({ loading: false });
      message[msg.type](msg.text);
      if (!data) return;
      return this.props.updateProducts(data);
    });
  };
  private _editProduct = (values: any, token: Token | null): void => {
    const { selectedProduct } = this.props;
    if (!selectedProduct) return;
    const { _id: id } = selectedProduct;
    if (!isString(id)) return;
    const EditedProduct = Object.assign(values, { id });
    if (!isEditedProduct(EditedProduct)) return;
    this.setState({ loading: true });
    editProduct(token, EditedProduct, (msg, data) => {
      this.setState({ loading: false });
      message[msg.type](msg.text);
    });
  };
  private handleSubmit = (e: React.FormEvent<HTMLInputElement>): void => {
    e.preventDefault();
    this.props.form.validateFields(
      (err: any, values: any): void => {
        if (err) return;
        values.count = Number(values.count);
        values.price = Number(values.price);
        const token = this.props.token || null;
        if (!this.props.selectedProduct) return this._addProduct(values, token);
        return this._editProduct(values, token);
      }
    );
  };
  render() {
    const { visible, loading, images } = this.state;
    const { categoryID, selectedProduct, addNewProduct } = this.props;
    const { getFieldDecorator } = this.props.form;
    let initialState = {
      name: "",
      description: "",
      price: 0,
      count: 0
    };
    if (selectedProduct) {
      const { name, description, price, count } = selectedProduct;
      initialState = { name, description, price, count };
    }
    return (
      <div className="create-product">
        {categoryID && (
          <span
            onClick={addNewProduct}
            className="admin-catalog__actions__all-products"
          >
            Добавить товар
          </span>
        )}
        <Drawer
          title="Добавить товар"
          placement="left"
          closable={false}
          onClose={this.onClose}
          visible={visible}
        >
          <Form onSubmit={this.handleSubmit}>
            <Spin spinning={loading}>
              <FormItem label="Наименование" hasFeedback={true}>
                {getFieldDecorator("name", {
                  validateTrigger: "onBlur",
                  initialValue: initialState.name,
                  rules: [
                    { required: true, message: "Заполните наименование!" },
                    { whitespace: true, message: "Заполните наименование!" }
                  ]
                })(<TextArea placeholder="Название..." autosize />)}
              </FormItem>
              <FormItem label="Цена" hasFeedback={true}>
                {getFieldDecorator("price", {
                  validateTrigger: "onBlur",
                  initialValue: initialState.price,
                  rules: [{ required: true, message: "Заполните цену!" }]
                })(
                  <InputNumber
                    className="create-product__input-number"
                    min={0}
                  />
                )}
              </FormItem>
              <FormItem label="Количество" hasFeedback={true}>
                {getFieldDecorator("count", {
                  validateTrigger: "onBlur",
                  initialValue: initialState.count,
                  rules: [{ required: true, message: "Заполните количество!" }]
                })(
                  <InputNumber
                    className="create-product__input-number"
                    min={0}
                  />
                )}
              </FormItem>
              <FormItem label="Описание" hasFeedback={true}>
                {getFieldDecorator("description", {
                  validateTrigger: "onBlur",
                  initialValue: initialState.description
                })(<TextArea placeholder="Описание..." autosize />)}
              </FormItem>
              <FormItem label="Картинки">
                {getFieldDecorator("images", {
                  initialValue: images
                })(<CustomUpload images={images} onChange={() => {}} />)}
              </FormItem>
              <FormItem>
                <Button type="primary" htmlType="submit" disabled={loading}>
                  {selectedProduct ? "Изменить" : "Добавить"}
                </Button>
              </FormItem>
            </Spin>
          </Form>
        </Drawer>
      </div>
    );
  }
}

const mapStateToProps = (state: State) => ({ token: state.token });

export default connect(
  mapStateToProps,
  null
)(Form.create()(CreateProduct));

import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { Tree, Button, Icon, Input, message } from "antd";
import { AntTreeNodeSelectedEvent } from "antd/es/tree";
import { Categories } from "../../../../models/category";
import {
  getCategories,
  removeCategory,
  addCategory,
  editCategory
} from "../../../../fetch/category";
import { Token } from "../../../../store/token/model";
import { State } from "../../../../store/index";
import "./catalog.less";

const TreeNode = Tree.TreeNode;

interface CmpProps {
  selectCategory: (categoryID: string | undefined) => void;
  token: Token;
}

interface CmpStates {
  categories: Categories;
  selectedNode: {
    id: string | undefined;
    name: string | undefined;
  };
  input: string | undefined;
  loading: boolean;
}

class AdminCategories extends PureComponent<CmpProps, CmpStates> {
  constructor(props: CmpProps) {
    super(props);
    this.state = {
      categories: [],
      selectedNode: { id: undefined, name: undefined },
      input: undefined,
      loading: true
    };
  }
  isUnmounted: boolean = false;
  async componentDidMount() {
    await getCategories((msg, categories) => {
      if (this.isUnmounted) return;
      this.setState({ loading: false });
      if (categories) this.setState({ categories });
    });
  }
  componentWillUnmount() {
    this.isUnmounted = true;
  }
  private renderTreeNodes = (data: Categories): JSX.Element[] => {
    return data.map(item => {
      if (item.children) {
        return (
          <TreeNode key={item._id} title={item.name} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item._id} title={item.name} dataRef={item} />;
    });
  };
  private setSelectedNode = (
    id: undefined | string,
    name: undefined | string
  ): void => {
    this.setState({ selectedNode: { id, name } }, () =>
      this.props.selectCategory(id)
    );
  };
  private handleOnChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({ input: e.target.value });
  };
  private handleSelect = (
    selectedKeys: string[],
    info: AntTreeNodeSelectedEvent
  ): void => {
    const { selectedNodes } = info;
    if (!selectedNodes) return;
    if (selectedNodes.length <= 0) return;
    const { id, name } = selectedNodes[0].props.dataRef;
    return this.setSelectedNode(id, name);
  };
  private handleClear = (): void => {
    this.setSelectedNode(undefined, undefined);
  };
  private handleRemove = (): void => {
    const { id } = this.state.selectedNode;
    if (!id) return;
    const token = this.props.token || null;
    this.setState({ loading: true });
    removeCategory(token, { id }, (msg, categories) => {
      if (this.isUnmounted) return;
      this.setState({ loading: false });
      message[msg.type](msg.text);
      if (!categories) return;
      this.props.selectCategory(undefined);
      return this.setState({
        categories,
        input: undefined,
        selectedNode: { id: undefined, name: undefined }
      });
    });
  };
  private handleAdd = (): void => {
    const { input: name } = this.state;
    if (!name) return;
    const { id: parentID } = this.state.selectedNode;
    const token = this.props.token || null;
    this.setState({ loading: true });
    addCategory(token, { name, parentID }, (msg, categories) => {
      if (this.isUnmounted) return;
      this.setState({ loading: false });
      message[msg.type](msg.text);
      if (!categories) return;
      return this.setState({ categories, input: undefined });
    });
  };
  private handleEdit = (): void => {
    const { input: name } = this.state;
    const { id } = this.state.selectedNode;
    if (!name || !id) return;
    const token = this.props.token || null;
    this.setState({ loading: true });
    editCategory(token, { name, id }, (msg, categories) => {
      if (this.isUnmounted) return;
      this.setState({ loading: false });
      message[msg.type](msg.text);
      if (!categories) return;
      return this.setState({
        categories,
        input: undefined,
        selectedNode: { id, name }
      });
    });
  };
  render() {
    const { categories, input, loading, selectedNode } = this.state;
    return (
      <div className="admin-categories">
        <div>
          <Button onClick={this.handleClear} disabled={loading}>
            <Icon type="undo" />
          </Button>
          <p className="admin-categories__selected"> Выбранная категория:</p>
          <p
            className="admin-categories__input ant-input"
            style={{ width: "200px" }}
          >
            {selectedNode.name ? selectedNode.name : "Пусто"}
          </p>
          <Button onClick={this.handleRemove} disabled={loading}>
            <Icon type="delete" />
          </Button>
        </div>
        <div>
          <Input
            type="text"
            style={{ width: "400px" }}
            className="admin-categories__input"
            value={input}
            onChange={this.handleOnChange}
            disabled={loading}
          />
          <Button onClick={this.handleAdd} disabled={loading}>
            <Icon type="plus" />
          </Button>
          {selectedNode.id !== "" && (
            <Button onClick={this.handleEdit} disabled={loading}>
              <Icon type="edit" />
            </Button>
          )}
        </div>
        <Tree onSelect={this.handleSelect} disabled={loading}>
          {this.renderTreeNodes(categories)}
        </Tree>
      </div>
    );
  }
}

const mapStateToProps = (state: State) => ({ token: state.token });

export default connect(
  mapStateToProps,
  null
)(AdminCategories);

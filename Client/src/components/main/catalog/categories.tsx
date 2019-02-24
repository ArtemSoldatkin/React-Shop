import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { Tree } from "antd";
import { AntTreeNodeSelectedEvent, AntTreeNode } from "antd/es/tree";
import { setPath, clearPath } from "../../../store/path/actions";
import { getCategories } from "../../../fetch/category";
import { Path } from "../../../store/path/model";
import { Categories, Category } from "../../../models/category";
import { isString } from "../../../utils/type-checking";
import "./catalog.less";

const TreeNode = Tree.TreeNode;

interface CmpProps {
  setPath: (path: Path) => void;
  clearPath: () => void;
}
interface CmpStates {
  categories: Categories;
}

class CatalogCategories extends PureComponent<CmpProps, CmpStates> {
  constructor(props: CmpProps) {
    super(props);
    this.state = {
      categories: []
    };
  }
  isUnmounted: boolean = false;
  async componentDidMount() {
    await getCategories((msg, data) => {
      if (this.isUnmounted) return;
      if (!data) return;
      return this.setState({ categories: data });
    });
  }
  componentWillUnmount() {
    this.isUnmounted = true;
  }
  private renderTreeNodes = (data: Categories): JSX.Element[] => {
    return data.map(item => {
      if (item.children) {
        return (
          <TreeNode
            title={`${item.name} (${item.products.length})`}
            key={item._id}
            dataRef={item}
          >
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return (
        <TreeNode
          title={`${item.name} (${item.products.length})`}
          key={item._id}
          dataRef={item}
        />
      );
    });
  };
  private createPath = (sn: AntTreeNode[]): void => {
    if (sn.length !== 1) return this.props.clearPath();
    const { path: path_, name, _id: id } = sn[0].props.dataRef;
    if (typeof path_ !== "string" || !isString(name) || !isString(id))
      return this.props.clearPath();
    const path = path_.split(",").filter(el => el !== "");
    if (path.length === 0) return this.props.setPath([{ id, name }]);
    let c: Category | undefined = undefined;
    let cs: Categories = this.state.categories;
    let fPath: Path = path
      .map(cid => {
        c = cs.find(c => c._id === cid);
        if (!c) return;
        const { name, _id: id } = c;
        if (c.children) cs = c.children;
        return { id, name };
      })
      .filter(p => p !== undefined) as Path;
    fPath.push({ name, id });
    return this.props.setPath(fPath);
  };
  private selectCategory = (
    selectedKeys: string[],
    e: AntTreeNodeSelectedEvent
  ): void | undefined => {
    const { selectedNodes: sn } = e;
    if (!sn) return;
    if (sn.length === 0) return;
    return this.createPath(sn);
  };
  render() {
    const { categories } = this.state;
    return (
      <div className="catalog-categories">
        <Tree
          onSelect={this.selectCategory}
          className="catalog-categories__tree"
        >
          {this.renderTreeNodes(categories)}
        </Tree>
      </div>
    );
  }
}

const mapDispatchToProps = { setPath, clearPath };

export default connect(
  null,
  mapDispatchToProps
)(CatalogCategories);

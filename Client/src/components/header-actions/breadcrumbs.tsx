import React from "react";
import { Link } from "react-router-dom";
import { Icon } from "antd";
import { connect } from "react-redux";
import { State } from "../../store";
import { setPath, clearPath } from "../../store/path/actions";
import { Path } from "../../store/path/model";
import "./header-actions.less";

interface CmpProps {
  path: Path;
  setPath: (path: Path) => void;
  clearPath: () => void;
}

const Breadcrumbs = React.memo(({ path, setPath, clearPath }: CmpProps) => {
  const editPath = (id: string): void => {
    if (id === "") return clearPath();
    const index = path.findIndex(el => el.id === id);
    if (index !== -1) return setPath(path.slice(0, index + 1));
  };
  const breadCrumbs = path.map((element, index) => {
    let elementName;
    if (index === path.length - 1)
      elementName = (
        <p className="header-actions-breadcrumbs__piece__end">{element.name}</p>
      );
    else
      elementName = (
        <Link
          className="header-actions-breadcrumbs__piece__link"
          onClick={() => editPath(element.id)}
          to="/"
        >
          {element.name}
        </Link>
      );
    return (
      <div
        className="header-actions-breadcrumbs__piece"
        key={`${Date.now()}${element.id}${index}`}
      >
        <p className="header-actions-breadcrumbs__piece__slash">></p>
        {elementName}
      </div>
    );
  });
  return (
    <div className="header-actions-breadcrumbs">
      <Link
        className="header-actions-breadcrumbs__home"
        onClick={clearPath}
        to="/"
      >
        <Icon type="home" /> Домой
      </Link>
      {breadCrumbs}
    </div>
  );
});

const mapStateToProps = (state: State) => ({ path: state.path });

const mapDispatchToProps = { setPath, clearPath };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Breadcrumbs);

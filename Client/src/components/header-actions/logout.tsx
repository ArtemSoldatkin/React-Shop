import React, { memo } from "react";
import { connect } from "react-redux";
import { Icon } from "antd";
import { removeToken } from "../../store/token/actions";
import "./header-actions.less";

interface CmpProps {
  removeToken: () => void;
}

const Logout = memo(({ removeToken }: CmpProps) => (
  <div className="header-actions-logout" onClick={removeToken}>
    <Icon type="export" />
    <p className="header-actions-logout__text">Выйти</p>
  </div>
));

const mapDispatchToProps = { removeToken };

export default connect(
  null,
  mapDispatchToProps
)(Logout);

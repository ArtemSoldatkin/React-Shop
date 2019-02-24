import React, { memo } from "react";
import { Layout, Icon, Tooltip } from "antd";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { clearPath } from "../../store/path/actions";
import "./header.less";

const { Header: AntHeader } = Layout;

interface CmpProps {
  clearPath: () => void;
}

const Header = memo(({ clearPath }: CmpProps) => (
  <AntHeader className="header">
    <Link to="/" className="header__logo" onClick={clearPath}>
      <Tooltip title="На главную" placement="bottom">
        <Icon className="header__logo__icon" type="shopping" />
        <p className="header__logo__text">Магазин</p>
      </Tooltip>
    </Link>
    <a href="tel:+79137075870" className="header__phone">
      <Icon type="phone" className="header__phone__icon" />
      <p className="header__phone__text">+7 (999) 999-99-99</p>
    </a>
  </AntHeader>
));

const mapDispatchToProps = { clearPath };

export default connect(
  null,
  mapDispatchToProps
)(Header);

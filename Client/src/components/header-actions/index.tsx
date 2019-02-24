import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { checkToken } from "../../store/token/actions";
import { State } from "../../store/index";
import { Token } from "../../store/token/model";
import Breadcrumbs from "./breadcrumbs";
import Cart from "./cart";
import Logout from "./logout";
import "./header-actions.less";

interface CmpProps {
  token: Token;
  checkToken: () => void;
}

class HeaderActions extends PureComponent<CmpProps> {
  constructor(props: CmpProps) {
    super(props);
  }
  componentDidMount() {
    this.props.checkToken();
  }
  render() {
    const { token } = this.props;
    return (
      <div className="header-actions">
        <div className="header-actions__breadcrumbs">
          <Breadcrumbs />
        </div>
        <div className="header-actions__cart">
          <Cart />
        </div>
        {token !== null && (
          <div className="header-actions__logout">
            <Logout />
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state: State) => ({ token: state.token });

const mapDispatchToProps = { checkToken };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HeaderActions);

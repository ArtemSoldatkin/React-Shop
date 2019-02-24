import React from "react";
import { Layout, Icon } from "antd";
import "./footer.less";

const { Footer: AntFooter } = Layout;

const Footer = React.memo(() => {
  return (
    <AntFooter className="footer">
      <p className="footer__signature">
        <Icon type="copyright" /> Солдаткин Артём
      </p>
    </AntFooter>
  );
});

export default Footer;

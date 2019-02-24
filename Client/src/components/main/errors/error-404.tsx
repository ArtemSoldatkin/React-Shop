import React, { memo } from "react";
import { Icon } from "antd";
import "./errors.less";

const Error404 = memo(() => (
  <div className="error-404">
    <h1 className="error-404__text">
      Страница не найдена <Icon type="frown" />
    </h1>
  </div>
));

export default Error404;

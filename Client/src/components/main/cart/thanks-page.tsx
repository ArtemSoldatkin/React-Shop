import React from "react";
import { Button, Spin, Icon } from "antd";
import { Client } from "../../../models/order";
import "./cart.less";

interface CmtProps {
  status: boolean;
  sendOrder: (client: Client | undefined) => void;
  loading: boolean;
}

const ThanksPage = React.memo(({ status, sendOrder, loading }: CmtProps) => {
  return (
    <div className="cart-thanks-page">
      <Spin spinning={loading}>
        {status ? (
          <h1 className="cart-thanks-page__text cart-thanks-page__text-success">
            Спасибо за покупку! <Icon type="smile" />
          </h1>
        ) : (
          <div>
            <h1 className="cart-thanks-page__text cart-thanks-page__text-error">
              Запрос не удался <Icon type="frown" />
            </h1>
            <Button onClick={() => sendOrder(undefined)} disabled={loading}>
              <Icon type="reload" />
              Повторить
            </Button>
          </div>
        )}
      </Spin>
    </div>
  );
});

export default ThanksPage;

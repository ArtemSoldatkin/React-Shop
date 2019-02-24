export interface Msg {
  text: string;
  type: "error" | "info" | "success";
}
export const newMsg = (type: boolean, err?: any): Msg => {
  let msg: Msg = { text: "Сервер не отвечает", type: "error" };
  type && (msg = { text: "Успешно", type: "success" });
  if (!type && err.response && err.response.status) {
    switch (err.response.status) {
      case 400:
        return (msg = { text: "Данные заполнены не верно!", type: "error" });
      case 401:
        return (msg = {
          text: "Логин или пароль заполнены не верно!",
          type: "error"
        });
      case 404:
        return (msg = { text: "Записи не найдены", type: "error" });
      case 409:
        return (msg = { text: "Название уже занято", type: "error" });
      case 500:
        return (msg = {
          text: "Проблемы с сервером, попробуйте позже",
          type: "error"
        });
      default:
        return (msg = {
          text: "Проблемы с сервером, попробуйте позже",
          type: "error"
        });
    }
  }
  return msg;
};

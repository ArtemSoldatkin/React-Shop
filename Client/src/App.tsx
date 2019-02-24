import React from "react";
import Header from "./components/header";
import HeaderActions from "./components/header-actions";
import Content from "./components/main";
import Footer from "./components/footer";
import "./App.less";

const App = () => (
  <div className="app">
    <Header />
    <HeaderActions />
    <Content />
    <Footer />
  </div>
);

export default App;

import React from "react";
import Header from "./Header";

const Layout = ({ children }) => (
  <div className="app-shell">
    <Header />
    <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
  </div>
);

export default Layout;

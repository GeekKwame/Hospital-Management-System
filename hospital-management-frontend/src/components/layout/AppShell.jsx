import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import TopBar from "./TopBar.jsx";

const AppShell = () => (
  <div className="app-shell-grid">
    <Sidebar />
    <div className="app-shell-main">
      <TopBar />
      <div className="app-shell-content">
        <Outlet />
      </div>
    </div>
  </div>
);

export default AppShell;


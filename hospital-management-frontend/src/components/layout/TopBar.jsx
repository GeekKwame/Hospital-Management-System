import { useAuth } from "../../contexts/AuthContext.jsx";

const TopBar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="topbar">
      <div>
        <p className="topbar-title">Hospital Management Portal</p>
        <small>Connected to {import.meta.env.VITE_API_URL || "http://localhost:5000/api"}</small>
      </div>
      <div className="topbar-user">
        <span>
          {user?.first_name} {user?.last_name}
        </span>
        <button onClick={logout}>Log out</button>
      </div>
    </header>
  );
};

export default TopBar;


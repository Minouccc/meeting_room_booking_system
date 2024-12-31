import { UserOutlined } from "@ant-design/icons";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "./index.css";

export function Index() {
  const navigate = useNavigate();
  return (
    <div id="index-container">
      <div className="header">
        <h1 onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
          会议室预定系统
        </h1>
        <Link to="/update_info">
          {" "}
          <UserOutlined className="icon" />
        </Link>
      </div>
      <div className="body">
        <Outlet></Outlet>
      </div>
    </div>
  );
}

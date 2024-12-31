import { Outlet } from "react-router-dom";
import { Menu as AntdMenu, MenuProps } from "antd";
import "./index.css";
import { router } from "../../main";

const items: MenuProps["items"] = [
  {
    key: "1",
    label: "信息修改",
  },
  {
    key: "2",
    label: "密码修改",
  },
];

export function ModifyMenu() {
  const handleMenuItemClick = (info: any) => {
    if (info.key === "1") {
      router.navigate("/user/info_modify");
    } else {
      router.navigate("/user/password_modify");
    }
  };
  return (
    <div id="menu-container">
      <div className="menu-area">
        <AntdMenu
          defaultSelectedKeys={
            location.pathname === "/user/info_modify" ? ["1"] : ["2"]
          }
          items={items}
          onClick={handleMenuItemClick}
        />
      </div>
      <div className="content-area">
        <Outlet></Outlet>
      </div>
    </div>
  );
}

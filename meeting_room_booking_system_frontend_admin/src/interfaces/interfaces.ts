import { message } from "antd";
import axios, { AxiosRequestConfig } from "axios";
import { UserInfo } from "../pages/InfoModify";
import { UpdatePassword } from "../pages/PasswordModify";
import { CreateMeetingRoom } from "../pages/MeetingRoomManage/CreateMeetingRoomModal";
import { UpdateMeetingRoom } from "../pages/MeetingRoomManage/UpdateMeetingRoom";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/",
  timeout: 3000,
});

axiosInstance.interceptors.request.use(function (config) {
  const accessToken = localStorage.getItem("access_token");

  if (accessToken) {
    config.headers.authorization = "Bearer " + accessToken;
  }
  return config;
});

interface PendingTask {
  config: AxiosRequestConfig;
  resolve: Function;
}
let refreshing = false;
const queue: PendingTask[] = [];

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (!error.response) {
      return Promise.reject(error);
    }
    let { data, config } = error.response;

    if (refreshing) {
      return new Promise((resolve) => {
        queue.push({
          config,
          resolve,
        });
      });
    }

    if (data.code === 401 && !config.url.includes("/user/refresh")) {
      refreshing = true;

      const res = await refreshToken();

      refreshing = false;

      if (res.status === 200 || res.status === 201) {
        queue.forEach(({ config, resolve }) => {
          resolve(axiosInstance(config));
        });

        return axiosInstance(config);
      } else {
        message.error(res.data);

        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
      }
    } else {
      return error.response;
    }
  }
);

async function refreshToken() {
  const res = await axiosInstance.get("/user/refresh", {
    params: {
      refresh_token: localStorage.getItem("refresh_token"),
    },
  });
  localStorage.setItem("access_token", res.data.access_token || "");
  localStorage.setItem("refresh_token", res.data.refresh_token || "");
  return res;
}

export async function login(username: string, password: string) {
  return await axiosInstance.post("/user/admin/login", {
    username,
    password,
  });
}

export async function userSearch(
  username: string,
  nickName: string,
  email: string,
  pageNo: number,
  pageSize: number
) {
  return await axiosInstance.get("/user/list", {
    params: {
      username,
      nickName,
      email,
      pageNo,
      pageSize,
    },
  });
}

export async function freeze(id: number) {
  return await axiosInstance.get("/user/freeze", {
    params: {
      id,
    },
  });
}

export async function getUserInfo() {
  return await axiosInstance.get("/user/info");
}

export async function updateInfo(data: UserInfo) {
  return await axiosInstance.post("/user/admin/update", data);
}

export async function updateUserInfoCaptcha() {
  return await axiosInstance.get("/user/update/captcha");
}

export async function updatePasswordCaptcha(email: string) {
  return await axiosInstance.get("/user/update_password/captcha", {
    params: {
      address: email,
    },
  });
}

export async function updatePassword(data: UpdatePassword) {
  return await axiosInstance.post("/user/admin/update_password", data);
}

export async function meetingRoomList(
  name: string,
  capacity: number,
  location: string,
  equipment: string,
  pageNo: number,
  pageSize: number
) {
  return await axiosInstance.get("/meeting-room/list", {
    params: {
      name,
      capacity,
      location,
      equipment,
      pageNo,
      pageSize,
    },
  });
}

export async function deleteMeetingRoom(id: number) {
  return await axiosInstance.delete("/meeting-room/" + id);
}

export async function createMeetingRoom(meetingRoom: CreateMeetingRoom) {
  return await axiosInstance.post("/meeting-room/create", meetingRoom);
}

export async function updateMeetingRoom(meetingRoom: UpdateMeetingRoom) {
  return await axiosInstance.put("/meeting-room/update", meetingRoom);
}

export async function findMeetingRoom(id: number) {
  return await axiosInstance.get("/meeting-room/" + id);
}

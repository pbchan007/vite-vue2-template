import axios from "axios";
import Cookies from "js-cookie";
import { MessageBox, Message, Notification } from "element-ui";
import store from "/@/store/index";
import router from "/@/router";

import QS from "qs";
// 引入app实例
import app from "../main";

const baseURL = "/apis";
const timeout = 30000;

export const codeMessage = {
  200: "服务器成功返回请求的数据。",
  201: "新建或修改数据成功。",
  202: "一个请求已经进入后台排队（异步任务）。",
  204: "删除数据成功。",
  400: "发出的请求有错误，服务器没有进行新建或修改数据的操作。",
  401: "您的凭证不正确或已过期,请重新登录", //用户没有权限（令牌、用户名、密码错误）。
  403: "用户得到授权，但是访问是被禁止的。",
  404: "发出的请求针对的是不存在的记录，服务器没有进行操作。",
  406: "请求的格式不可得。",
  410: "请求的资源被永久删除，且不会再得到的。",
  422: "当创建一个对象时，发生一个验证错误。",
  500: "服务器发生错误。",
  502: "网关错误。",
  503: "服务不可用，服务器暂时过载或维护。",
  504: "网关超时。"
};

export const responseHandler = response => {
  const res = response.data;
  console.log("ajax 返回", res);
  if (res.success === true) {
    return res;
  } else if (res.success === false) {
    Message({
      message:
        (typeof res.data === "string" && res.data) ||
        (Object.prototype.toString.call(res.data) === "[object Object]" &&
          ((typeof res.data.message === "string" && res.data.message) ||
            (typeof res.data.msg === "string" &&
              res.data.msg.length < 40 &&
              res.data.msg))) ||
        res.message ||
        "Error",
      type: "error",
      duration: 4 * 1000
    });
    return res;
  }

  // 粗略判断是图片上传返回字符串连接
  if (typeof res === "string" && res.indexOf("http") > -1) {
    return res;
  }

  // todo 粗劣判断是文本流文件
  if (
    response.headers &&
    response.headers["content-disposition"] &&
    response.headers["content-disposition"].indexOf("attachment") > -1
  ) {
    return response;
  }

  return Promise.reject(new Error(res.message || "Error"));
};

let tagTime = Date.now();

export const errorHandler = error => {
  console.log("err", error);
  const errResponse = error.response;

  if (errResponse && errResponse.status) {
    if (errResponse.status === 401) {
      // todo 优化401弹窗多次
      const nowTime = Date.now();
      const TIME_RANG = 1000;

      if (nowTime - tagTime < TIME_RANG) {
        return Promise.reject(error);
      }
      tagTime = nowTime;
      setTimeout(() => {
        store.dispatch("user/logout", "normal").then(res => {
          router.push(`/login?redirect=${app._route.fullPath}`);
        });
      }, 100);
    }

    Notification({
      message: codeMessage[errResponse.status] || errResponse.statusText,
      type: "error",
      title: `请求错误 ${errResponse.status}`,
      duration: 5 * 1000,
      offset: 100
    });
  } else {
    Notification({
      message: error.message,
      type: "error",
      title: "错误",
      duration: 5 * 1000,
      offset: 100
    });
  }
  return Promise.reject(error);
};

const service = axios.create({
  baseURL,
  withCredentials: true,
  timeout,
  transformRequest: [
    (data = {}, headers) => {
      if (
        headers["Content-Type"] &&
        headers["Content-Type"].indexOf("application/json") !== -1
      ) {
        return JSON.stringify(data);
      } else if (
        headers["Content-Type"] &&
        headers["Content-Type"].indexOf("multipart/form-data") !== -1
      ) {
        return data;
      }
      // 默认是 application/x-www-form-urlencoded'
      return QS.stringify(data, { arrayFormat: "brackets" });
    }
  ],
  paramsSerializer: function(params) {
    // 针对get请求
    return QS.stringify(params, { arrayFormat: "brackets" });
  }
});

export const requestBefore = config => {
  config.headers["X-CSRFToken"] = store.getters.token;
  config.headers["Api-Version"] = "1.1";
  return config;
};

service.interceptors.request.use(requestBefore, error => {
  console.log(error);
  return Promise.reject(error);
});

service.interceptors.response.use(responseHandler, errorHandler);

export default service;

export { QS, baseURL, timeout };

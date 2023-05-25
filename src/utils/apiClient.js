import axios from "axios";
import { apiBase } from "../utils/config";
import { CommonConfig } from "../utils/constant";
const instance = axios.create({
  baseURL: apiBase,
  timeout: 60000,
  responseType: "json",
});


var headers = {
  // 'Accept': 'application/json',
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "*",
};

const request = (method, url, data) => {
  return new Promise((resolve, reject) => {
    (() => {
      window.addEventListener("beforeunload", function() {
        CommonConfig.releaseLockShipment();
      });
      if (method === "get") {
        return instance.request({
          url,
          method,
          params: data,
          headers: headers,
        });
      } else {
        return instance.request({
          url,
          method,
          data,
          headers: headers,
        });
      }
    })()
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err.response);
      });
  });
};

export default {
  get: (endpoint, data) => {
    return request("get", endpoint, data);
  },
  post: (endpoint, data) => {
    return request("post", endpoint, data);
  },
  put: (endpoint, data) => {
    return request("put", endpoint, data);
  },
  del: (endpoint, data) => {
    return request("delete", endpoint, data);
  },
};

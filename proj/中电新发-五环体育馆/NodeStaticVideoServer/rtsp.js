const { searchDB } = require("./utils");
const fetch = require("node-fetch");
const path = require("path");
const {
  auth_username,
  auth_password,
  VMS_userLoginURL,
  VMS_userLogoutURL,
  VMS_DeviceGetIPCLinkInfoURL
} = require("./config");
let { token: global_token } = require("./ffmpeg");
// const error_code = {
//   "200": "OK",
//   "401": "权限不足，不能进行操作",
//   "400": "请求的参数不正确或者不能支持操作",
//   "500": "服务器内部错误",
//   "403": "请求的接口不存在，无法完成操作"
// };
const rtsp = {
  getRtspfailed: false,
  async getAPES() {
    try {
      const res = await searchDB("select guid from ape");
      return await res.json();
    } catch (error) {
      console.log(error);
      return [];
    }
  },
  async getTokens() {
    try {
      await rtsp.vmsLogout();
      let basicAuthParams = auth_username + ":" + auth_password;
      basicAuthParams = Buffer.from(basicAuthParams).toString("base64");
      var res = await fetch(VMS_userLoginURL, {
        headers: {
          Authorization: "Basic " + basicAuthParams,
          "Content-Type": "application/json"
        }
      });
      resbody = await res.json();
      if (resbody.returnState.stateCode == 0) {
        global_token = res.headers.get("auth-token");
      } else {
        console.log("getTokens ", resbody);
      }
    } catch (error) {
      console.log(error);
    }
    // return 11;
  },
  async getRtspUrls(ID) {
    try {
      // console.log("global_token ", global_token);
      // let ipRes = await fetch(VMS_DeviceGetIPCLinkInfoURL, {
      //   method: "POST",
      //   body: JSON.stringify({ ipcID: ID }),
      //   headers: {
      //     "auth-token": global_token,
      //     "Content-Type": "application/json"
      //   }
      // });
      // let serverIP = await ipRes.json();
      // console.log("serverIP ", serverIP);
      // const stateCode = serverIP.returnState.stateCode;
      // const errorMsg = serverIP.returnState.errorMsg;
      // if (stateCode == 0) {
      let rtspUrl = path.join(__dirname, `public/test_video/${ID}.mp4`);
      return rtspUrl;
      // } else if (errorMsg.includes("401")) {
      //   //        if (!rtsp.getRtspfailed) {
      //   await rtsp.getTokens();
      //   //rtsp.getRtspfailed = true;
      //   return await rtsp.getRtspUrls(ID);
      // } else {
      //rtsp.getRtspfailed = false;
      // console.log("getRtspUrls ", serverIP.returnState);
      // return "";
      // }
      //      }
    } catch (error) {
      console.log(error);
      return "";
    }
  },
  async vmsLogout() {
    if (!global_token) {
      console.log("global_token is null");
      return;
    }
    try {
      let state = await fetch(VMS_userLogoutURL, {
        method: "POST",
        //body: JSON.stringify({ ipcID: ID }),
        headers: {
          "auth-token": global_token,
          "Content-Type": "application/json"
        }
      });
      state = await state.json();
      console.log("vmsLogout ", global_token, state);
    } catch (error) {
      console.log("vmsLogout ", state);
      console.log(error);
    }
  }
};
module.exports = rtsp;

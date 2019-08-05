const { searchDB } = require("./utils");
const fetch = require("node-fetch");
const {
  auth_username,
  auth_password,
  VMS_userLoginURL,
  VMS_userLogoutURL,
  VMS_DeviceGetIPCLinkInfoURL
} = require("./config");
module.exports = {
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
      let basicAuthParams = auth_username + ":" + auth_password;
      basicAuthParams = Buffer.from(basicAuthParams).toString("base64");
      let res = await fetch(VMS_userLoginURL, {
        headers: {
          Authorization: "Basic " + basicAuthParams,
          "Content-Type": "application/json"
        }
      });
	  //console.log("getToken",res.headers)
      return res.headers.get("auth-token");
    } catch (error) {
      console.log(error);
      return "getToken error";
    }
  },
  async getRtspUrls(token, ID) {
    try {
      let ipRes = await fetch(VMS_DeviceGetIPCLinkInfoURL, {
        method: "POST",
        body: JSON.stringify({ ipcID: ID }),
        headers: {
          "auth-token": token,
          "Content-Type": "application/json"
        }
      });
      let serverIP = await ipRes.json();
	  //console.log(serverIP)
      let rtspUrl =
        "rtsp://" + serverIP.ipcLinkInfo.serverIP + ":10554/guid=" + ID;
      return rtspUrl;
    } catch (error) {
      console.log(error);
      return [];
    }
  },
  async vmsLogout(token) {
    try {
      let state = await fetch(VMS_userLogoutURL, {
        method: "POST",
        //body: JSON.stringify({ ipcID: ID }),
        headers: {
          "auth-token": token,
          "Content-Type": "application/json"
        }
      });
	  console.log("vms logOut")
      console.log(state)
    } catch (error) {
      console.log(error);
    }
  }
};

const { searchDB } = require("./utils");
const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");
const {
  auth_username,
  auth_password,
  VMS_userLoginURL,
  VMS_DeviceGetIPCLinkInfoURL
} = require("./config");
module.exports = {
  async getAPES() {
    // try {
    //   const res = await searchDB("select guid from ape");
    //   return await res.json();
    // } catch (error) {
    //   console.log(error);
    //   return [];
    // }
    try {
      const test_videos = fs
        .readdirSync(path.join(__dirname, `public/test_video`))
        .filter(name => name.includes(".mp4"))
        .map(name => name.split(".")[0]);
      return test_videos;
    } catch (error) {
      console.error(error);
      return [];
    }
    // return [
    //   "43000001001321224018",
    //   "43000001001321224020",
    //   "43000001001321224249",
    //   "43000001001321224243",
    //   "43000001001321224245",
    //   "43000001001321224251",
    //   "43000001001321226071",
    //   "43000001001321226072",
    //   "43000001001321226073",
    //   "43000001001321226074"
    // ];
  },
  async getTokens() {
    // let basicAuthParams = auth_username + ":" + auth_password;
    // basicAuthParams = Buffer.from(basicAuthParams).toString("base64");
    // let res = await fetch(VMS_userLoginURL, {
    //   headers: {
    //     Authorization: "Basic " + basicAuthParams,
    //     "Content-Type": "application/json"
    //   }
    // });
    // return res.headers.get("auth-token");
    return "11111";
  },
  async getRtspUrls(token, ids) {
    let serverIPs = ids.map(ID => {
      // return fetch(VMS_DeviceGetIPCLinkInfoURL, {
      //   method: "POST",
      //   body: JSON.stringify({ ipcID: ID }),
      //   headers: {
      //     "auth-token": token,
      //     "Content-Type": "application/json"
      //   }
      // });
      return path.join(__dirname, `public/test_video/${ID}.mp4`);
    });
    // ipRes = await Promise.all(ips);
    // let serverIPs = ipRes.map(async (r, i) => {
    //   let serverIP = await r.json();
    //   return (
    //     "rtsp://" + serverIP.ipcLinkInfo.serverIP + ":10554/guid=" + ids[i]
    //   );
    // });
    return serverIPs;
  }
};

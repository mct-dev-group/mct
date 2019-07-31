const { searchDB } = require("./utils");
const fetch = require("node-fetch");
const {
  auth_username,
  auth_password,
  VMS_userLoginURL,
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
      return res.headers.get("auth-token");
    } catch (error) {
      console.log(error);
      return "getToken error";
    }
  },
  async getRtspUrls(token, ids) {
    try {
      let ipRes = //ids.map(ID => {
        //return 
		await fetch(VMS_DeviceGetIPCLinkInfoURL, {
          method: "POST",
          body: JSON.stringify({ ipcID: ids }),
          headers: {
            "auth-token": token,
            "Content-Type": "application/json"
          }
        });
      //});
      //ipRes = await Promise.all([ipRes]);
      //ipRes =await ipRes.map(async (r, i) => {
		  //console.log(ipRes)
        let serverIP = await ipRes.json();
		//console.log("serverIP",serverIP,serverIP.ipcLinkInfo.serverIP);
		//serverIP = serverIP.ipcLinkInfo.serverIP;
        //return (
          ipRes = "rtsp://" + serverIP.ipcLinkInfo.serverIP + ":10554/guid=" + ids
        //);
      //});
	  //ipRes = await Promise.all(ipRes);
	  return ipRes;
    } catch (error) {
      console.log(error);
      return [];
    }

  }
};

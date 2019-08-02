module.exports = {
  DBLink: "http://127.0.0.1:8014/sqlservice/v1/executeSql",
  auth_username: "admin",
  auth_password: "admin",
  VMS_userLoginURL: "http://100.85.228.34/VMS2Service.cgi?Cmd=UserLogin",
  VMS_DeviceGetIPCLinkInfoURL:
    "http://100.85.228.34/VMS2Service.cgi?Cmd=DeviceGetIPCLinkInfo",
  command1: ["-rtsp_transport", "tcp", "-i"],
  command2: [
    "-map",
    "0:v",
    "-c",
    "copy",
    "-f",
    "hls",
    "-hls_list_size",
    "3",
    "-hls_time",
    "1",
    "-hls_wrap",
    "5",
    "-hls_flags",
    "omit_endlist"
  ],
  commandStaticFile1: ["-re", "-stream_loop", "-1", "-i"],
  commandStaticFile2: [
    "-c",
    "copy",
    "-map",
    "0:v",
    "-f",
    "hls",
    "-hls_list_size",
    "3",
    "-hls_time",
    "1",
    "-hls_wrap",
    "5",
    "-hls_flags",
    "omit_endlist"
  ]
};

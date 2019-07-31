/**
 * data connection.js
 *
 * date: 2019/03/22
 *
 * auth: zry
 *
 * exp：
 * 1.若为远程连接
 * let conn = new RemoteConnection();
 * conn.http("http://XXXX/XXX",{"xx":"xx",....},"GET",{Authorization:"xxxx.xxx.xxx","JSON"}).then((resolve,reject)=>{......});
 *
 * 2.若为本地连接
 * let conn = new LocalConnection();
 * conn.openDataSource("http://XXXX/XXX/XXX.json");  ---- 若填入数据源路径则从服务器取数据源，若不填则弹出文件选择框，从本地选择数据源文件，必须为json格式文件。
 *                                                        且在页面未关闭前，数据源都可使用，若需切换数据源则再次调用该方法即可。尽量在页面初始化时就取得数据源。
 * let list = conn.getDataByPosition(x1,y1,z1);      ---- 根据x，y，z坐标获得所有点击到的物体集合
 * let item = conn.getDataById("XXXXX");             ---- 根据唯一id查找物体
 * let list = conn.getDataByNameLike(key_word,index,size); ---- 根据名称模糊查找物体集合,返回数量和页数由index和size所决定
 *
 * tips:若代码错误或参数错误会在控制台告知具体原因，且方法会返回false.
 */



/**
 * 远程连接
 * @param url  String ---必须，远程连接的url
 * @param type  String --- 可选，默认为GET连接方式（GET、POST、PUT、DELETE等）
 * @param data  json ---可选，传入参数 eg:{"a1":"xxx","a2":"xxx"....}
 * @param headers json ---可选, eg:{“Authorization”:"******.***.***"}
 * @param dataType  String ---可选，默认为JSON
 * @returns {Promise<any>} ---返回promise对象
 * @constructor
 */
function RemoteConnection(){
    this.http = (url,data,type,headers,dataType)=>{
        this.url = url;
        this.type = type || "GET";
        this.data = data || "";
        this.headers = headers || {};
        this.dataType = dataType || "JSON";
        let that = this;
        return new Promise((resolve,reject)=>{
            $.ajax({
                data: that.data,
                type: that.type,
                dataType: that.dataType,
                contentType: "application/json",
                scriptCharset: "utf-8",
                url: that.url,
                beforeSend: function(xhr){
                    for(let key in that.headers){
                        xhr.setRequestHeader(key, that.headers[key]);
                    }
                },
                error: function (data) {
                    reject(data);
                },
                success: function (result) {
                    resolve (result);
                }
            });
        });
    };
}

/**
 * 本地连接
 * @constructor
 */
function LocalConnection(){
    let that = this;
    /**
     * 打开数据源，包含两种：传入url打开远程服务器上的json文件或由用户选择打开客户端json文件。
     * @param file_url String ---可选,文件所在的路径,若为空则会默认选择用户之前在本地客户端上选择的json格式数据源
     * @returns {Promise<any>}
     * eg: file_url: http://192.168.0.134:8086/datamanage/v1/test.json
     */
    that.openDataSource = (file_url)=>{
        if(file_url){
            //通过传入文件路径获取文件信息
            return new Promise((resolve,reject)=>{
                $.ajax({
                    data: "",
                    type: "GET",
                    dataType:"JSON",
                    contentType: "application/json",
                    scriptCharset: "utf-8",
                    url: file_url,
                    error: function (error) {
                        if(typeof error.responseText === "string")
                            error.responseText = JSON.parse(error.responseText);
                        localDB.set("fileData",error.responseText);
                        resolve(true);
                    },
                    success: function (result) {
                        if(!result || typeof result === "string"){
                            console.error("Wrong url or data found,please check again.");
                            resolve(false);
                        }else{
                            localDB.set("fileData",result);
                            resolve(true);
                        }
                    }
                });
            });
        }else {
            //通过用户选择本地文件形式获取文件信息
            return new Promise((resolve,reject)=>{
                resolve(getClientFileData());
            });
        }
    };
    //根据唯一id获得物体
    that.getDataById = (id)=>{
        let data = localDB.get("fileData");
        if(!data){
            console.error("No file data can be found,please use function openDataSource(file_url) to open one data source.");
            return false;
        }else{
            if(typeof data === "string") data = JSON.parse(data);
            if(data[id]) return data[id];
            return null;
        }
    };
    /**
     * 根据名称模糊匹配所有相关的物体,根据index和size返回指定数量的集合
     * @param key_word ---名称匹配关键字
     * @param index  --- 当前页数
     * @param size  --- 每页数量
     * @returns {*}
     */
    that.getDataByNameLike = (key_word,index,size) =>{
        let data = localDB.get("fileData");
        if(!data){
            console.error("No file data can be found,please use function openDataSource(file_url) to open one data source.");
            return false;
        }else{
            if(typeof data === "string") data = JSON.parse(data);
            let resultList = [];
            for(let key in data){
                if(data[key].name &&  data[key].name.indexOf(key_word) > -1){
                    resultList.push(data[key]);
                }
            }
            return {size:resultList.length,list: resultList.splice((index - 1) * size, size)};
        }
    };
    //根据x、y、z坐标获得点击到的所有物体集合
    that.getDataByPosition = (x,y,z)=>{
        if(!util.checkNumber(x) || !util.checkNumber(y) || !util.checkNumber(z)){
            console.error("one or more params x、y、z are illegal.");
            return false;
        }
        x = parseFloat(x);
        y = parseFloat(y);
        z = parseFloat(z);
        let clickPoint = {"x":x,"y":y,"z":z};
        let data = localDB.get("fileData");
        if(!data){
            console.error("No file data can be found,please use function openDataSource(file_url) to open one data source.");
            return false;
        }else{
            if(typeof data === "string") data = JSON.parse(data);
            let resultList = [];
            for(let key in data){
                //存有点的list，集合中的每一个子集合表示一个面，其中第一个子集合表示最外层的面，其余子集合表示洞
                let contourList = [];
                let minX = 999999999;
                let maxX = -999999999;
                let minY = 999999999;
                let maxY = -999999999;
                if(!data[key].contourList){
                    let contours = data[key].contour;
                    contours =	contours.substring(contours.indexOf("(")+3);
                    contours = contours.split("(");
                    //取最大最小的x、y坐标，然后进行粗略判断

                    for (let i = 0; i < contours.length; i++) {
                        let tempList = [];
                        let tempArr = contours[i].replaceAll("\\)","");
                        tempArr = contours[i].replaceAll("\\(","");
                        tempArr = tempArr.split(",");
                        for (let j = 0; j < tempArr.length; j++) {
                            let point = tempArr[j].split(" ");
                            tempList.push({"x":point[0],"y":point[1],"z":point[2]});
                            if(parseFloat(point[0]) < minX){
                                minX = parseFloat(point[0]);
                            }else if(parseFloat(point[0]) > maxX){
                                maxX = parseFloat(point[0]);
                            }
                            if(parseFloat(point[1]) < minY){
                                minY = parseFloat(point[1]);
                            }else if(parseFloat(point[1]) > maxY){
                                maxY = parseFloat(point[1]);
                            }
                        }
                        contourList.push(tempList);
                    }
                    data[key]["minX"] = minX;
                    data[key]["maxX"] = maxX;
                    data[key]["minY"] = minY;
                    data[key]["maxY"] = maxY;
                    data[key]["contourList"] = contourList;
                }else{
                    contourList = data[key]["contourList"];
                    minX = data[key]["minX"];
                    maxX = data[key]["maxX"];
                    minY = data[key]["minY"];
                    maxY = data[key]["maxY"];
                }


                //若点坐标超过了最大、最小xy范围，则必定不在该多边形内部
                if(x > maxX || x < minX || y > maxY || y < minY){
                    continue;
                }
                let breakSign = false;
                //若点坐标在洞内部，则不在多边形内部
                for (let i = 1; i < contourList.length; i++) {
                    if(insidePolygon(clickPoint,contourList[i])){
                        breakSign = true;
                        break;
                    }
                }
                if(breakSign) continue;
                //若在多边形内部，则添加到结果集合中
                if(contourList.length > 0 && insidePolygon(clickPoint,contourList[0])){
                    if(data[key]["minZ"] && data[key]["maxZ"]){
                        if( parseFloat(z)> parseFloat(data[key]["minZ"]) && parseFloat(z)< parseFloat(data[key]["maxZ"])){
                            resultList.push(data[key]);
                        }
                    }else{
                        resultList.push(data[key]);
                    }
                }
            }

            localDB.set("fileData",data);
            return resultList;
        }
    };
}

/**
 * 让用户从本地客户端上选择json格式数据源
 */
function getClientFileData(){
    let div = document.createElement("div");
    div.innerHTML = '<div><input type="file" id="_importLocalFile" style="display: none;"></div>';
    document.getElementById("bt_container").appendChild(div);
    document.getElementById("_importLocalFile").click();
    $(document).on("change","#_importLocalFile",(data)=>{
        let file = data.target.files[0];
        if (!file) {
            console.error("couldn't find the file data.");
            return false;
        }
        let fileReader = new FileReader();
        fileReader.readAsText(file);
        fileReader.onload = function (e) {
            let json = e.target.result;
            if(typeof json === "string") {
                try {
                    json = JSON.parse(json);
                }catch (e) {
                    bt_PlugManager.$message.error("文件数据格式错误，应为json格式数据，请检查后重试。");
                    return false;
                }
            }
            localDB.set("fileData",json);
            return true;
        };
        $("#_importLocalFile").val("");
    });
}

/**
 * 判断点是否在几何图形内
 * @param testPoint
 * @param points
 * @return
 */
function insidePolygon(testPoint, points) {
    let x = parseFloat(testPoint.x), y = parseFloat(testPoint.y);
    let inside = false;
    for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
        let xi = parseFloat(points[i].x), yi = parseFloat(points[i].y);
        let xj = parseFloat(points[j].x), yj = parseFloat(points[j].y);

        let intersect = ((yi > y) !== (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect)
            inside = !inside;
    }

    return inside;
}
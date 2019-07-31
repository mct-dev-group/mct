let plug_monitoringList = new Plug();
plug_monitoringList.js_name = 'plug_monitoringList';
plug_monitoringList.plug_icon="ali-icon-shexiangji";
plug_monitoringList.plug_name = '监控列表';


//插件激活
plug_monitoringList.plug_activate = function(){
    initMonitoringContainer.monitoringContainerVue.activeName="1"
    if($("#monitoringBox").is(":hidden")){
        $("#monitoringBox").show();
        $("li[data-type=3]").addClass("sideNav-isActive");
        initMonitoringContainer.setIcon();
    }
};

//插件关闭
plug_monitoringList.plug_deactivate = function () {
    if(!$("#monitoringBox").is(":hidden")){
        $("#monitoringBox").hide();
        $("li[data-type=3]").removeClass("sideNav-isActive");
        initMonitoringContainer.removeIcon();
    }
};


bt_PlugManager.insert_plug(plug_monitoringList);

let bt_monitoringList={    
    monitoringListVue:null,
    icons:[],    
};
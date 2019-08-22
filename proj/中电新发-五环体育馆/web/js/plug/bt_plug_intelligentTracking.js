let plug_intelligentTracking = new Plug();
plug_intelligentTracking.js_name = 'plug_intelligentTracking';
plug_intelligentTracking.plug_icon="ali-icon-yunyingguanli";
plug_intelligentTracking.plug_name = '实时监控';
plug_intelligentTracking.plug_commandOnly = true;


//插件激活
plug_intelligentTracking.plug_activate = function(){
    initMonitoringContainer.monitoringContainerVue.activeName="0";
    if($("#monitoringBox").is(":hidden")){
        $("#monitoringBox").show();
        $("li[data-type=3]").addClass("sideNav-isActive");
        initMonitoringContainer.activate(0);
        initMonitoringContainer.setIcon();
    }
};

//插件关闭
plug_intelligentTracking.plug_deactivate = function () {
    if(!$("#monitoringBox").is(":hidden")){
        $("#monitoringBox").hide();
        $("li[data-type=3]").removeClass("sideNav-isActive");
        initMonitoringContainer.deactivate(0);
        initMonitoringContainer.removeIcon();
    }
};


bt_PlugManager.insert_plug(plug_intelligentTracking);


$(function () {

    bt_PlugManager.$notify({
        title: '说明',
        message: '<div id="float_div_container"><div id="float_div_content"></div><div id="float_div_footer"><div id="float_div_footer_page"><input type="button" value="hide" id="float_div_hidden" class="float_div_btn"><span id="float_div_footer_page_index"></span></div><input type="button" value="next" class="float_div_btn float_div_btn_next" /><input type="button" value="prev" class="float_div_btn float_div_btn_prev" /></div></div>',
        dangerouslyUseHTMLString: true,
        customClass: 'float_div',
        showClose:false,
        duration: 0
    });

    localDB.set("float_div_index", 0);

    localDB.set("float_div_content_list", float_div_content_list);
    localDB.set("float_div_action_list", float_div_action_list);
    localDB.set("float_div_action_cancel_list", float_div_action_cancel_list);

    var contentList = localDB.get("float_div_content_list");
    var actionList = localDB.get("float_div_action_list");
    $("#float_div_content").html(contentList[0]);
    $("#float_div_footer_page_index").html("1/" + contentList.length);
    actionList[0]();
    //设置footer宽度与父DIV相同
    $("#float_div_footer").css("width",$(".float_div").width()-5);

    //点击上一页
    $(document).on('click', '.float_div_btn_prev', function () {
        let index = localDB.get("float_div_index");
        if (index === 0) return;
        let contentList = localDB.get("float_div_content_list");
        let actionList = localDB.get("float_div_action_list");
        let cancelActionList = localDB.get("float_div_action_cancel_list");
        $("#float_div_content").html(contentList[index - 1]);
        localDB.set("float_div_index", index - 1);
        if (cancelActionList[index]) cancelActionList[index]();
        if (actionList[index - 1]) actionList[index - 1]();
        $("#float_div_footer_page_index").html(index + "/" + contentList.length);
    });

    //点击下一页
    $(document).on('click', '.float_div_btn_next', function () {
        let index = localDB.get("float_div_index");
        let contentList = localDB.get("float_div_content_list");
        if (index === contentList.length-1) return;
        let actionList = localDB.get("float_div_action_list");
        let cancelActionList = localDB.get("float_div_action_cancel_list");
        $("#float_div_content").html(contentList[index + 1]);
        localDB.set("float_div_index", index + 1);
        if (cancelActionList[index]) cancelActionList[index]();
        if (actionList[index + 1]) actionList[index + 1]();
        $("#float_div_footer_page_index").html((index + 2) + "/" + contentList.length);
    });

    //设置div浮动
    $(document).on('mouseenter','.float_div',function(){
        let w = $(window).width()-$(".float_div").width()-57;
        $(".float_div").animate({
            left: w+"px"
        },200);
    });

    $(document).on('click','#float_div_hidden',function(){
        let w = $(window).width()-5;
        $(".float_div").animate({
            left: w+"px"
        },200);
    });

    $(window).resize(()=>{
        $("#float_div_footer").width($(".float_div").width());
        $("#float_div_container").width($(".float_div").width());
        $("#float_div_content").width($(".float_div").width());
    });
});

function IntroObj(contentList,actionList,cancelActionList){
    float_div_content_list = contentList;
    float_div_action_list = actionList;
    float_div_action_cancel_list = cancelActionList;
}


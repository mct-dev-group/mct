let plug_activity = new Plug();

plug_activity.js_name = "plug_activity";
plug_activity.plug_name = "重点活动";
plug_activity.plug_icon = "ali-icon-guizeyinqing";

plug_activity.plug_activate = function() {
  bt_activity.active();
};

plug_activity.plug_deactivate = function() {
  bt_activity.deactivate();
};

plug_activity.plug_commands = [];

plug_activity.command_activate = function(command_id) {
  bt_activity.inter && clearInterval(bt_activity.inter);
  bt_activity.inter && bt_activity.removeAllPOI();
  bt_activity.inter = null;
  $("#keyActivity")[0] && $("#keyActivity")[0].remove();
  bt_activity.getData(command_id);
};

let bt_activity = {
  keyActivity: [],
  vueIns: null,
  count: [],
  crrAct: {},
  inter: null,
  active: function() {},
  deactivate: function() {
    $("#keyActivity")[0] ? ($("#keyActivity")[0].style.display = "none") : null;
    bt_activity.inter && bt_activity.removeAllPOI();
  },
  getData: function(id) {
    bt_activity.count = [];
    bt_activity.getPolice(id);
    bt_activity.getPlan(id);
    bt_activity.getDepartment(id);
    bt_activity.getPerson(id);
    bt_activity.getPlace(id);
    bt_activity.inter = setInterval(() => {
      bt_activity.getPolicePosition(id);
    }, 10000);
  },
  searchFormDB: function(cb, sql) {
    fetch(`http://`+window.location.hostname+`:8014/sqlservice/v1/executeSql?sql=${sql}`, {
      header: {
        "Access-Control-Allow-Origin": "*"
      }
    })
      .then(response => response.json())
      .then(cb);
  },
  getKeyActivity: function() {
    return bt_activity.searchFormDB(
      bt_activity.addCommand,
      `SELECT as_key_activity.id,as_key_activity.name FROM as_key_activity`
    );
  },
  addCommand: function(data) {
    plug_activity.plug_commands = data.map((a, i) => {
      return new Command(a.name, a.id, false, true);
    });
    bt_PlugManager.insert_plug(plug_activity);
    // console.log(plug_activity.plug_commands);
  },
  addPolicePOI: function() {
    bt_activity.crrAct.police.map(p => {
      const id = p.police_id;
      const name = p.police_name;
      const { x, y } = LL2Geo(p.longitude, p.latitude);
      bt_Plug_Annotation.setAnnotation(
        id,
        x,
        y,
        50,
        -8,
        -16,
        `<div class='tag police' onclick="bt_activity.vueIns.handleItemClick(this)" id=${id} style=' background:url(image/公安.png); background-position:center left; background-repeat: no-repeat; height:16px;line-height:10px;'><span style='margin-left:16px; font-size:9px; white-space: nowrap;'>${name}</span></div>`
      );
    });
  },
  addDepartmentPOI: function() {
    bt_activity.crrAct.department.map(p => {
      const id = p.department_id;
      const name = p.department_name;
      const { x, y } = LL2Geo(p.longitude, p.latitude);
      bt_Plug_Annotation.setAnnotation(
        id,
        x,
        y,
        50,
        -8,
        -16,
        `<div class='tag department' onclick="bt_activity.vueIns.handleItemClick(this)" id=${id} style=' background:url(image/重点单位.png); background-position:center left; background-repeat: no-repeat; height:16px;line-height:10px;'><span style='margin-left:16px; font-size:9px; white-space: nowrap;'>${name}</span></div>`
      );
    });
  },
  addPlacePOI: function() {
    bt_activity.crrAct.place.map(p => {
      const id = p.place_id;
      const name = p.place_name;
      const { x, y } = LL2Geo(p.longitude, p.latitude);
      bt_Plug_Annotation.setAnnotation(
        id,
        x,
        y,
        50,
        -8,
        -16,
        `<div class='tag place' onclick="bt_activity.vueIns.handleItemClick(this)" id=${id} style='background:url(image/重点部位.png); background-position:center left; background-repeat: no-repeat; height:16px;line-height:10px;'><span style='margin-left:16px; font-size:9px; white-space: nowrap;'>${name}</span></div>`
      );
    });
  },
  removeAllPOI: function() {
    bt_activity.crrAct.place.map(a =>
      bt_Plug_Annotation.removeAnnotation(a.place_id)
    );
    bt_activity.crrAct.department.map(a =>
      bt_Plug_Annotation.removeAnnotation(a.department_id)
    );
    bt_activity.crrAct.police.map(a =>
      bt_Plug_Annotation.removeAnnotation(a.police_id)
    );
  },
  hidePOI: function(className) {
    bt_activity.crrAct[className].map(a =>
      $("#" + a[className + "_id"]).hide()
    );
  },
  showPOI: function(className) {
    bt_activity.crrAct[className].map(a =>
      $("#" + a[className + "_id"]).show()
    );
  },
  getPolice: function(id) {
    let sql = `select
    A.name as activity_name,
    A.id as activity_id,

		AP.name as police_name,
    AP.id as police_id,
		case AP.gender when 1 then '男' when 2 then '女' end as police_gender,
    AP.age as police_age,
    AP.police_org as police_org,
    AP.police_assistant as police_assistant,
    AP.contact_information as police_contact,
    AP.longitude,
    AP.latitude,
    divi.divi_name,
		adivi.adivi_name,
		org.org_name,
		lead.lead_name,
    AP.census_register_address as police_census_register_address

    from as_key_activity A left join as_key_activity_police as KAP on A.id = KAP.activity_id LEFT JOIN as_auth_police as AP on KAP.police_id = AP.id left join (select e.id as id,d.name as divi_name,e.census_register_division_id as division_id from as_auth_police e,bd_divisions d where e.census_register_division_id=d.code) as divi on AP.id = divi.id left join (select e.id as id,d.name as adivi_name,e.current_address_division_id as division_id from as_auth_police e,bd_divisions d where e.current_address_division_id=d.code) as adivi on AP.id = adivi.id left join (select e.id as id,d.name as org_name from as_auth_police e,as_auth_organization d where e.police_org=d.id) as org on AP.id = org.id left join (select e.id as id,d.name as lead_name from as_auth_police e,as_auth_police d where e.lead_id=d.id) as lead on AP.id = lead.id`;

    sql += id ? ` where A.id = '${id}' ` : "";
    bt_activity.searchFormDB(data => {
      bt_activity.allPolice = data;
      bt_activity.count.push(1);
      bt_activity.crrAct.police = data;
      !$("#keyActivity")[0] &&
        bt_activity.count.length == 5 &&
        bt_activity.initVue();
      // console.log(data);
    }, sql);
  },
  getPolicePosition: function(id) {
    let sql = `select
    AP.longitude,
    AP.latitude

    from as_key_activity A left join as_key_activity_police as KAP on A.id = KAP.activity_id LEFT JOIN as_auth_police as AP on KAP.police_id = AP.id left join (select e.id as id,d.name as divi_name,e.census_register_division_id as division_id from as_auth_police e,bd_divisions d where e.census_register_division_id=d.code) as divi on AP.id = divi.id left join (select e.id as id,d.name as adivi_name,e.current_address_division_id as division_id from as_auth_police e,bd_divisions d where e.current_address_division_id=d.code) as adivi on AP.id = adivi.id left join (select e.id as id,d.name as org_name from as_auth_police e,as_auth_organization d where e.police_org=d.id) as org on AP.id = org.id left join (select e.id as id,d.name as lead_name from as_auth_police e,as_auth_police d where e.lead_id=d.id) as lead on AP.id = lead.id`;

    sql += id ? ` where A.id = '${id}' ` : "";
    bt_activity.searchFormDB(data => {
      bt_activity.crrAct.police.longitude = data.longitude;
      bt_activity.crrAct.police.latitude = data.latitude;
    }, sql);
  },
  getPlan: function(id) {
    let sql = `
    select
    A.name as activity_name,
    A.id as activity_id,
    BCP.id as plan_id,
    BCP.html_path as html_path,
    BCP.key_words as plan_key_words,
    BCP.plan_content as plan_content,
    case BCP.plan_type when 1 then '自然灾害' when 2 then '事故灾难' when 3 then '公共卫生' when 4 then '社会安全' end as plan_type from as_key_activity A left join as_key_activity_counter_plan as ACP on A.id = ACP.activity_id LEFT JOIN as_base_counter_plan as BCP on ACP.plan_id = BCP.id`;
    sql += id ? ` where A.id = '${id}' ` : "";
    bt_activity.searchFormDB(data => {
      bt_activity.allPlan = data;
      bt_activity.count.push(1);
      bt_activity.crrAct.plan = data;
      !$("#keyActivity")[0] &&
        bt_activity.count.length == 5 &&
        bt_activity.initVue();
      // console.log(data);
    }, sql);
  },
  getDepartment: function(id) {
    let sql = `select
    A.name as activity_name,
    A.id as activity_id,

    KD.name as department_name,
    KD.id as department_id,
    KD.administration_department as administration_department,
    KD.legal_person_name as department_legal_person_name,
    KD.address as department_address,
    KD.division_id as department_division_id,
    KD.longitude,
    KD.latitude,
    org.org_name,
    divi.divi_name

    from as_key_activity A left join as_key_activity_department as KAD on A.id = KAD.activity_id LEFT JOIN as_key_department as KD on KAD.key_department_id = KD.id left join (select e.id as id,d.name as divi_name,e.division_id as division_id from as_key_department e,bd_divisions d where e.division_id=d.code) as divi on KD.id = divi.id left join (select e.id as id,d.name as org_name from as_key_department e,as_auth_organization d where e.administration_department=d.id) as org on KD.id = org.id`;
    sql += id ? ` where A.id = '${id}' ` : "";
    bt_activity.searchFormDB(data => {
      bt_activity.allDepartment = data;
      bt_activity.count.push(1);
      bt_activity.crrAct.department = data;
      !$("#keyActivity")[0] &&
        bt_activity.count.length == 5 &&
        bt_activity.initVue();
      // console.log(data);
    }, sql);
  },
  getPerson: function(id) {
    let sql = `select
    A.name as activity_name,
    A.id as activity_id,

    KPS.name as person_name,
    KPS.id as person_id,
    case KPS.gender when 1 then '男' when 2 then '女' end as person_gender,
    case KPS.educational_status when 1 then '在逃人员' when 2 then '涉毒人员' when 3 then '涉稳人员' when 4 then '涉恐人员' when 5 then '重点上访人员' when 6 then '肇事肇祸精神病人员' when 7 then '重大刑事犯罪前科人员' end as person_category,
    case KPS.category when 1 then '研究生' when 2 then '博士生' when 3 then '本科' when 4 then '大专' when 5 then '中专' when 6 then '高中' when 7 then '其他' end as person_educational_status,
    KPS.nation as person_nation,
    KPS.height as person_height,
    KPS.job as person_job,
    KPS.contact_information as person_contact_information,
    KPS.police_id as person_police_id,
    case KPS.grade when 1 then '一级' when 2 then '二级' when 3 then '三级' when 4 then '四级' when 5 then '五级' end as person_grade,
    lead.police_name,
    org.org_name,
    divi.divi_name,
		adivi.adivi_name,
    KPS.image_url as person_image_url

    from as_key_activity A left join as_key_activity_person as KAPS on A.id = KAPS.activity_id LEFT JOIN as_key_person as KPS on KAPS.key_person_id = KPS.id left join (select e.id as id,d.name as police_name from as_key_person e,as_auth_police d where e.police_id=d.id) as lead on KPS.id = lead.id left join (select e.id as id,d.name as org_name from as_key_person e,as_auth_organization d where e.administration_department=d.id) as org on KPS.id = org.id 		left join (select e.id as id,d.name as divi_name,e.census_register_division_id as division_id from as_key_person e,bd_divisions d where e.census_register_division_id=d.code) as divi on KPS.id = divi.id left join (select e.id as id,d.name as adivi_name,e.current_address_division_id as division_id from as_key_person e,bd_divisions d where e.current_address_division_id=d.code) as adivi on KPS.id = adivi.id
`;
    sql += id ? ` where A.id = '${id}' ` : "";
    bt_activity.searchFormDB(data => {
      bt_activity.allPerson = data;
      bt_activity.count.push(1);
      bt_activity.crrAct.person = data;
      !$("#keyActivity")[0] &&
        bt_activity.count.length == 5 &&
        bt_activity.initVue();
      // console.log(data);
    }, sql);
  },
  getPlace: function(id) {
    let sql = `select
    A.name as activity_name,
    A.id as activity_id,

    KP.name as place_name,
    KP.id as place_id,
    KP.administration_department as place_administration_department,
    KP.legal_person_name as place_legal_person_name,
    KP.longitude,
    KP.latitude,
    divi.divi_name,
    KP.address as place_address

    from as_key_activity A left join as_key_activity_place as KAPC on A.id = KAPC.activity_id LEFT JOIN as_key_place as KP on KAPC.key_place_id = KP.id left join (select e.id as id,d.name as divi_name,e.division_id as division_id from as_key_place e,bd_divisions d where e.division_id=d.code) as divi on KP.id = divi.id
    `;
    sql += id ? ` where A.id = '${id}' ` : "";
    bt_activity.searchFormDB(data => {
      bt_activity.allPlace = data;
      bt_activity.count.push(1);
      bt_activity.crrAct.place = data;
      !$("#keyActivity")[0] &&
        bt_activity.count.length == 5 &&
        bt_activity.initVue();
      // console.log(data);
    }, sql);
  },
  initVue: function() {
    $("body").append(`<div id="keyActivity" class="bt_ui_element">
    <el-tabs type="border-card" class="box-card" @tab-click="showPOI">
    <el-tab-pane label="全部" >
      <el-form label-position="left" label-width="80px">
        <el-form-item label="预案" style='margin-bottom: 0px;font-size:14px;'>
        <el-tag v-for="plan in crrAct.plan" class='plan' :key="plan.plan_id" :id="plan.plan_id" type="danger" @click.native="handleItemClick">
          {{plan.plan_key_words}}
        </el-tag>
        </el-form-item>
        <el-form-item label="警员"  style='margin-bottom: 0px;font-size:14px;'>
          <el-tag v-for="(police,i) in crrAct.police" class='police' :key="police.police_id" :id="police.police_id" type="" :disable-transitions="true"  @click.native="handleItemClick">
            {{police.police_name}}
          </el-tag>
        </el-form-item>
        <el-form-item label="重点单位" style='margin-bottom: 0px;font-size:14px;'>
        <el-tag v-for="department in crrAct.department" class='department' :key="department.department_id" :id="department.department_id" type="warning" @click.native="handleItemClick">
          {{department.department_name}}
        </el-tag>
        </el-form-item>
        <el-form-item label="重点人员" style='margin-bottom: 0px;font-size:14px;'>
        <el-tag v-for="person in crrAct.person" class='person' :key="person.person_id" :id="person.person_id" type="danger" @click.native="handleItemClick">
          {{person.person_name}}
        </el-tag>
        </el-form-item>
        <el-form-item label="重点部位" style='margin-bottom: 0px;font-size:14px;' @click="handleItemClick">
        <el-tag v-for="place in crrAct.place" class='place' :key="place.place_id" :id="place.place_id" type="danger" @click.native="handleItemClick">
          {{place.place_name}}
        </el-tag>
      </el-form-item>
    </el-form>
    </el-tab-pane>
    <el-tab-pane label="预案">
    <el-card :class="key.plan_id" :key="key.plan_id" v-for="(key,i) in crrAct.plan">
      <div slot="header" class="clearfix">
        <span>{{key.plan_key_words}}</span>
      </div>
      <div class="detail" v-on:click="handleItemClick">
        {{'预案类型: ' + key.plan_type }}
      </div>
      <div class="detail">
        {{'预案内容: ' + key.plan_content }}
      </div>
      <div class="detail">
        <a :href="key.html_path" target="_blank">查看文档</a>
      </div>
    </el-card>
    </el-tab-pane>
    <el-tab-pane label="警员" >
    <el-card :class="key.police_id" :key="key.police_id"  v-for="(key,i) in crrAct.police">
    <div slot="header" class="clearfix">
      <span>{{key.police_name}}</span>
    </div>
    <div class="detail">
      {{'警号: ' + key.police_assistant }}
    </div>
    <div class="detail">
      {{'姓别: ' + key.police_gender }}
    </div>
    <div class="detail">
      {{'年龄: ' + key.police_age }}
    </div>
    <div class="detail">
      {{'户籍地址: ' + key.divi_name + key.adivi_name }}
    </div>
    <div class="detail">
      {{'联系方式: ' + key.police_contact }}
    </div>
    <div class="detail">
      {{'所属单位: ' + key.org_name }}
    </div>
    <div class="detail">
      {{'直属领导: ' + key.lead_name }}
    </div>
    </el-card>
    </el-tab-pane>
    <el-tab-pane label="重点单位">
      <el-card :class="key.department_id" :key="key.department_id" v-for="(key,i) in crrAct.department">
      <div slot="header" class="clearfix">
        <span>{{key.department_name}}</span>
      </div>
      <div class="detail">
        {{'所在区域: ' + key.divi_name }}
      </div>
      <div class="detail">
        {{'管辖单位: ' + key.org_name }}
      </div>
      <div class="detail">
        {{'单位法人姓名: ' + key.department_legal_person_name }}
      </div>
      <div class="detail">
        {{'地址: ' + key.department_address }}
      </div>
    </el-card>
    </el-tab-pane>
    <el-tab-pane label="重点人员">
    <el-card :class="key.person_id" :key="key.person_id" v-for="(key,i) in crrAct.person">
    <div slot="header" class="clearfix">
      <span>{{key.person_name}}</span>
    </div>
    <div  class="detail">
      {{'性别: ' + key.person_gender }}
    </div>
    <div  class="detail">
      {{'人员类别: ' + key.person_category }}
    </div>
    <div  class="detail">
      {{'民族: ' + key.person_nation }}
    </div>
    <div  class="detail">
      {{'身高: ' + key.person_height }}
    </div>
    <div  class="detail">
      {{'职业: ' + key.person_job }}
    </div>
    <div  class="detail">
      {{'文化程度: ' + key.person_educational_status }}
    </div>
    <div class="detail">
    {{'户籍地址: ' + key.divi_name + key.adivi_name }}
  </div>
    <div  class="detail">
      {{'人员等级: ' + key.person_grade }}
    </div>
    <div  class="detail">
      {{'联系方式: ' + key.person_contact_information }}
    </div>
    <div  class="detail">
      {{'责任民警: ' + key.police_name }}
    </div>
    <div  class="detail">
      {{'管辖单位: ' + key.org_name }}
    </div>
    </el-card>
    </el-tab-pane>
    <el-tab-pane label="重点部位">
    <el-card :class="key.place_id" :key="key.place_id" v-for="(key,i) in crrAct.place">
    <div slot="header" class="clearfix">
      <span>{{key.place_name}}</span>
    </div>
    <div  class="detail">
      {{'部位法人姓名: ' + key.place_legal_person_name }}
    </div>
    <div class="detail">
    {{'所在区域: ' + key.divi_name }}
  </div>
    <div  class="detail">
      {{'地址: ' + key.place_address }}
    </div>
    </el-card>
    </el-tab-pane>
    </el-tabs>
    </div>`);
    bt_activity.vueIns = new Vue({
      el: "#keyActivity",
      data: {
        // activeName: plug_activity.plug_commands[0].command_id,
        command_id: 0,
        activitys: [],
        allActivity: bt_activity.allActivity,
        allPolice: bt_activity.allPolice,
        allPlan: bt_activity.allPlan,
        allPlace: bt_activity.allPlace,
        allPerson: bt_activity.allPerson,
        allDepartment: bt_activity.allDepartment,
        lastCamId: null,
        crrAct: bt_activity.crrAct
      },
      beforeUpdate: function() {
        // bt_activity.updateCommand();
      },
      methods: {
        handleItemClick(e) {
          const className = e.target ? e.target.className : e.className;
          const id = e.target ? e.target.id : e.id;
          const scrollTo = id => {
            setTimeout(() => {
              $(".el-tabs__content").scrollTop(
                document.getElementsByClassName(id)[0].offsetTop
              );
            }, 100);
          };
          if (className.includes("plan")) {
            $("#tab-1").click();
            scrollTo(id);
          }
          if (className.includes("police")) {
            $("#tab-2").click();
            scrollTo(id);
          }
          if (className.includes("department")) {
            $("#tab-3").click();
            scrollTo(id);
          }
          if (className.includes("person")) {
            $("#tab-4").click();
            scrollTo(id);
          }
          if (className.includes("place")) {
            $("#tab-5").click();
            scrollTo(id);
          }
        },
        showPOI(e) {
          const id = e.$el.id;
          if (id == "pane-2") {
            bt_activity.hidePOI("department");
            bt_activity.hidePOI("place");
            bt_activity.showPOI("police");
            return;
          }
          if (id == "pane-3") {
            bt_activity.showPOI("department");
            bt_activity.hidePOI("place");
            bt_activity.hidePOI("police");
            return;
          }
          if (id == "pane-5") {
            bt_activity.showPOI("place");
            bt_activity.hidePOI("department");
            bt_activity.hidePOI("police");
            return;
          }
          if (id == "pane-0") {
            bt_activity.showPOI("place");
            bt_activity.showPOI("department");
            bt_activity.showPOI("police");
            return;
          }
          bt_activity.hidePOI("place");
          bt_activity.hidePOI("department");
          bt_activity.hidePOI("police");
        }
      },
      computed: {
        allActivityId: function() {
          return plug_activity.plug_commands.map(a => [
            a.command_name,
            a.command_id
          ]);
        },
        activity: function() {}
      }
    });
    $("#keyActivity")[0].style.display = "block";
    // bt_activity.removeAllPOI();
    bt_activity.addPolicePOI();
    bt_activity.addPlacePOI();
    bt_activity.addDepartmentPOI();
  }
};
$(function() {
  $("head").append(
    `
    <style>
    #keyActivity {
      position: absolute;
      display:none;
      top: 100px;
      right: 100px;
      width: 600px;
    }
    .box-card {
      color:#111;
    }
    .activityList{
      margin-bottom: 18px;
      font-size: 14px;
    }
    .actItem {
      padding: 0px 8px;
      cursor:pointer;
      color: #0095e7;
    }
    .el-card{
      margin:4px;
    }
    #keyActivity .el-tabs__content{
      max-height:60vh;
      overflow-y:scroll !important;
    }
    .detail{
      padding:5px;
    }
    </style>`
  );
});
bt_activity.getKeyActivity();
// $('.el-tabs__content').scrollTop($('#573d4b77-a79e-422a-b26a-5f42945370f5').offset().top);

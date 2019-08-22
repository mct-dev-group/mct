let plug_activity = new Plug();

plug_activity.js_name = "plug_activity";
plug_activity.plug_name = "重点活动";
plug_activity.plug_icon = "ali-icon-guizeyinqing";

plug_activity.plug_activate = function() {
  $("head").append(
    `
    <style>
    #ActivityVue {
      display:none;
    }
    #keyActivity {
      position: absolute;
      bottom: 20px;
      left: 190px;
	    z-index:200;
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
      height:220px;
      overflow-y:auto !important;
    }
    .detail{
      padding:5px;
    }
    .police_image, .person_image{
      max-width:225;
      float: right;
    }
    div#keyActivity .tContainer-header-btn{
      padding-left:0;
    }
    div#keyActivity div.tContainer{
      position:static;
    }
    #keyActivity div.tContainer-content{
      height:253px;
    }
    div#keyActivity .el-tag {
      background: linear-gradient(#629bca, #123c5d);
      padding:0 16px;
      margin-right:10px;
      border: 0px !important;
      border-radius: 16px;
      color:#fff;
      height: 27px;
      line-height: 27px;
    }
    div#keyActivity .el-form-item__label{
      text-align: center;
      background: linear-gradient(#ffffff, #c8c7c7);
      border: 0px !important;
      border-radius: 16px;
      color: #2e6f9a;
      padding:0!important;
      margin-right:17px;
      line-height:27px;
    }
    div#keyActivity .el-form-item:not(:last-child){
      padding-bottom:12px;
    }
    div#keyActivity .el-form-item__content {
      line-height: 0px !important;
    }
    div#keyActivity .el-form--label-left .el-form-item__label {
      text-align: center !important;
    }
    div#keyActivity .el-tabs__item{
      border-left-color: #dcdfe6;
      height: 34px !important;
      line-height: 34px !important;
      padding: 0 5px !important;
    }
    div#keyActivity .el-input__inner{
      height: 30px !important;
    }
    div#keyActivity .el-button--small{
      padding: 0px 10px !important;
    }
    </style>`
  );
  bt_activity.appendVueBody();
  $(function() {
    bt_activity.active();
  });

  $("li[data-type=2]").addClass("sideNav-isActive");
  $("#ActivityVue")[0].style.display = "block";
};

plug_activity.plug_deactivate = function() {
  $("#ActivityVue")[0] && $("#ActivityVue")[0].remove();
  bt_activity.deactivate();
  $("li[data-type=2]").removeClass("sideNav-isActive");
};

plug_activity.plug_commands = [];

plug_activity.command_activate = function(command_id) {
  localStorage.setItem("activity_command_id", command_id);
  const command_name = plug_activity.plug_commands.filter(
    a => a.command_id == command_id
  )[0].command_name;
  bt_activity.vueIns
    ? (bt_activity.vueIns.value = command_name)
    : (bt_activity.commandSelected = command_name);
  localStorage.setItem("activity_command_name", command_name);
  bt_activity.inter && clearInterval(bt_activity.inter);
  bt_activity.inter && bt_activity.removeAllPOI();
  bt_activity.inter = null;
  bt_activity.getData(command_id);
};

let bt_activity = {
  keyActivity: [],
  vueIns: null,
  count: [],
  commandSelected: "",
  crrAct: {},
  inter: null,
  active: function() {
    if (localStorage.getItem("activity_command_id")) {
      const command_name = localStorage.getItem("activity_command_name");
      bt_activity.commandSelected = command_name;
      plug_activity.command_activate(
        localStorage.getItem("activity_command_id")
      );
    }
  },
  deactivate: function() {
    $("#ActivityVue")[0] ? ($("#ActivityVue")[0].style.display = "none") : null;
    bt_activity.vueIns = null;
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
      //警员位置轮询
      bt_activity.getPolicePosition(id);
    }, 10000);
  },
  searchFormDB: function(cb, sql) {
    fetch(
      `http://${
        window.location.hostname
      }:8014/sqlservice/v1/executeSql?sql=${sql}`,
      {
        header: {
          "Access-Control-Allow-Origin": "*"
        }
      }
    )
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
    // bt_activity.commandSelect = plug_activity.plug_commands;
    bt_PlugManager.insert_plug(plug_activity);
    plug_activity.plug_activate();

    // console.log(plug_activity.plug_commands);
  },
  addPolicePOI: function() {
    bt_activity.crrAct.police.map(p => {
      const id = p.id;
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
      const id = p.id;
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
      const id = p.id;
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
      bt_Plug_Annotation.removeAnnotation(a.id)
    );
    bt_activity.crrAct.department.map(a =>
      bt_Plug_Annotation.removeAnnotation(a.id)
    );
    bt_activity.crrAct.police.map(a =>
      bt_Plug_Annotation.removeAnnotation(a.id)
    );
  },
  hidePOI: function(className) {
    bt_activity.crrAct[className].map(a => $("#" + a["id"]).hide());
  },
  showPOI: function(className) {
    bt_activity.crrAct[className].map(a => $("#" + a["id"]).show());
  },
  getPolice: function(id) {
    let sql = `select
    A.name as activity_name,
    A.id as activity_id,

		AP.name as police_name,
    AP.id as id,
    AP.head_portrait as police_head_portrait,
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
      bt_activity.crrAct.policeCount = data.length > 1;
      //!$("#keyActivity")[0] &&
      // if (bt_activity.count.length == 5) {
      //   bt_activity.vueIns || bt_activity.initVue();
      //   $("#keyActivity")[0].style.display = "block";
      // }
      bt_activity.initVue();
      console.log(data);
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
    BCP.id as id,
    BCP.html_path as html_path,
    BCP.key_words as plan_key_words,
    BCP.plan_content as plan_content,
    case BCP.plan_type when 1 then '自然灾害' when 2 then '事故灾难' when 3 then '公共卫生' when 4 then '社会安全' end as plan_type from as_key_activity A left join as_key_activity_counter_plan as ACP on A.id = ACP.activity_id LEFT JOIN as_base_counter_plan as BCP on ACP.plan_id = BCP.id`;
    sql += id ? ` where A.id = '${id}' ` : "";
    bt_activity.searchFormDB(data => {
      bt_activity.allPlan = data;
      bt_activity.count.push(1);
      bt_activity.crrAct.plan = data;
      bt_activity.crrAct.planCount = data.length > 1;
      //!$("#keyActivity")[0] &&
      // if (bt_activity.count.length == 5) {
      //   bt_activity.vueIns || bt_activity.initVue();
      //   $("#keyActivity")[0].style.display = "block";
      // }
      bt_activity.initVue();
      console.log(data);
    }, sql);
  },
  getDepartment: function(id) {
    let sql = `select
    A.name as activity_name,
    A.id as activity_id,

    KD.name as department_name,
    KD.id as id,
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
      bt_activity.crrAct.departmentCount = data.length > 1;
      //!$("#keyActivity")[0] &&
      // if (bt_activity.count.length == 5) {
      //   bt_activity.vueIns || bt_activity.initVue();
      //   $("#keyActivity")[0].style.display = "block";
      // }
      bt_activity.initVue();
      // console.log(data);
    }, sql);
  },
  getPerson: function(id) {
    let sql = `select
    A.name as activity_name,
    A.id as activity_id,

    KPS.name as person_name,
    KPS.image_url as person_image_url,
    KPS.id as id,
    case KPS.gender when 1 then '男' when 2 then '女' end as person_gender,
    case KPS.educational_status when 1 then '在逃人员' when 2 then '涉毒人员' when 3 then '涉稳人员' when 4 then '涉恐人员' when 5 then '重点上访人员' when 6 then '肇事肇祸精神病人员' when 7 then '重大刑事犯罪前科人员' end as person_category,
    case KPS.category when 1 then '研究生' when 2 then '博士生' when 3 then '本科' when 4 then '大专' when 5 then '中专' when 6 then '高中' when 7 then '其他' end as person_educational_status,
    nation.description as person_nation,
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

    from as_key_activity A left join as_key_activity_person as KAPS on A.id = KAPS.activity_id LEFT JOIN as_key_person as KPS on KAPS.key_person_id = KPS.id left join nation as nation on nation.nationId = KPS.nation left join (select e.id as id,d.name as police_name from as_key_person e,as_auth_police d where e.police_id=d.id) as lead on KPS.id = lead.id left join (select e.id as id,d.name as org_name from as_key_person e,as_auth_organization d where e.administration_department=d.id) as org on KPS.id = org.id 		left join (select e.id as id,d.name as divi_name,e.census_register_division_id as division_id from as_key_person e,bd_divisions d where e.census_register_division_id=d.code) as divi on KPS.id = divi.id left join (select e.id as id,d.name as adivi_name,e.current_address_division_id as division_id from as_key_person e,bd_divisions d where e.current_address_division_id=d.code) as adivi on KPS.id = adivi.id
`;
    sql += id ? ` where A.id = '${id}' ` : "";
    bt_activity.searchFormDB(data => {
      bt_activity.allPerson = data;
      bt_activity.count.push(1);
      bt_activity.crrAct.person = data;
      bt_activity.crrAct.personCount = data.length > 1;
      //!$("#keyActivity")[0] &&
      // if (bt_activity.count.length == 5) {
      //   bt_activity.vueIns || bt_activity.initVue();
      //   $("#keyActivity")[0].style.display = "block";
      // }
      bt_activity.initVue();
      console.log("person", data);
    }, sql);
  },
  getPlace: function(id) {
    let sql = `select
    A.name as activity_name,
    A.id as activity_id,

    KP.name as place_name,
    KP.id as id,
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
      bt_activity.crrAct.placeCount = data.length > 1;
      //!$("#keyActivity")[0] &&
      // if (bt_activity.count.length == 5) {
      //   bt_activity.vueIns || bt_activity.initVue();
      //   $("#keyActivity")[0].style.display = "block";
      // }
      // bt_activity.vueIns ||
      bt_activity.initVue();
    }, sql);
  },

  // {/* <el-table-column
  //   prop="plan_content"
  //   label="预案内容"
  //   width="280"
  //   show-overflow-tooltip>
  // </el-table-column> */}

  appendVueBody: function() {
    $("body").append(`<div id="ActivityVue">
    <div id="keyActivity">
     <div class="tContainer">
      <div class="tContainer-header">
       <div class="tContainer-header-icon bgImage-activity"></div>
       <div class="tContainer-header-title">
        重点活动
       </div>
       <div class="tContainer-header-btn">
        <el-select v-model="value" placeholder="请选择" @change="commandActivate">
         <el-option v-for="item in command" :key="item.command_id" :label="item.command_name" :value="item.command_id">
         </el-option>
        </el-select>
       </div>
      </div>
      <div class="tContainer-content">
       <el-tabs type="border-card" class="box-card" @tab-click="showPOI" stretch="" v-cloak="">
        <el-tab-pane label="全部">
         <el-form label-position="left" label-width="80px">
          <el-form-item label="预案" style="margin-bottom: 0px;font-size:14px;">
           <el-tag class="plan" v-show="crrAct.plan[0].id" :id="crrAct.plan[0].id" type="danger" @click.native="handleItemClick">
             {{crrAct.plan[0].plan_key_words}}
           </el-tag>
           <el-tag v-show="planCount" class="plan" :id="crrAct.plan[0].id" @click.native="handleItemClick">
             ......
           </el-tag>
          </el-form-item>
          <el-form-item label="警员" style="margin-bottom: 0px;font-size:14px;">
           <el-tag class="police" v-show="crrAct.police[0].id" :id="crrAct.police[0].id" @click.native="handleItemClick">
             {{crrAct.police[0].police_name}}
           </el-tag>
           <el-tag v-show="policeCount" class="police" :id="crrAct.police[0].id" @click.native="handleItemClick">
             ......
           </el-tag>
          </el-form-item>
          <el-form-item label="重点单位" style="margin-bottom: 0px;font-size:14px;">
           <el-tag class="department" v-show="crrAct.department[0].id" :id="crrAct.department[0].id" @click.native="handleItemClick">
             {{crrAct.department[0].department_name}}
           </el-tag>
           <el-tag v-show="departmentCount" class="department" :id="crrAct.department[0].id" @click.native="handleItemClick">
             ......
           </el-tag>
          </el-form-item>
          <el-form-item label="重点人员" style="margin-bottom: 0px;font-size:14px;">
           <el-tag class="person" v-show="crrAct.person[0].id" :id="crrAct.person[0].id" @click.native="handleItemClick">
             {{crrAct.person[0].person_name}}
           </el-tag>
           <el-tag v-show="personCount" class="person" :id="crrAct.person[0].id" @click.native="handleItemClick">
             ......
           </el-tag>
          </el-form-item>
          <el-form-item label="重点部位" style="margin-bottom: 0px;font-size:14px;" @click="handleItemClick">
           <el-tag class="place" v-show="crrAct.place[0].id" :id="crrAct.place[0].id" @click.native="handleItemClick">
             {{crrAct.place[0].place_name}}
           </el-tag>
           <el-tag v-show="placeCount" class="place" :id="crrAct.place[0].id" @click.native="handleItemClick">
             ......
           </el-tag>
          </el-form-item>
         </el-form>
        </el-tab-pane>
        <el-tab-pane label="预案">
         <el-table size="small" :data="crrAct.plan" style="width: 100%" :row-class-name="tableRowClassName">
          <el-table-column align="center" show-overflow-tooltip="" prop="plan_key_words" label="关键字" width="80">
          </el-table-column>
          <el-table-column align="center" show-overflow-tooltip="" prop="plan_type" label="预案类型" width="180">
          </el-table-column>
          <el-table-column align="center" show-overflow-tooltip="" prop="html_path" label="文档" width="100">
           <template slot-scope="scope" size="mini">
            <el-button @click="openLink(scope.row)" type="text" size="small">
             查看
            </el-button>
           </template>
          </el-table-column>
         </el-table>
        </el-tab-pane>
        <el-tab-pane label="警员">
         <template>
          <el-table size="small" :data="crrAct.police" style="width: 100%" :row-class-name="tableRowClassName" @row-click="showPoliceDetail">
           <el-table-column align="center" show-overflow-tooltip="" prop="police_name" label="姓名" width="80">
           </el-table-column>
           <el-table-column align="center" show-overflow-tooltip="" prop="police_gender" label="性别" width="80">
           </el-table-column>
           <el-table-column align="center" show-overflow-tooltip="" prop="police_age" label="年龄" width="80">
           </el-table-column>
           <el-table-column align="center" show-overflow-tooltip="" prop="org_name" label="单位">
           </el-table-column>
          </el-table>
         </template>
        </el-tab-pane>
        <el-tab-pane label="重点单位">
         <template>
          <el-table size="small" :data="crrAct.department" style="width: 100%" :row-class-name="tableRowClassName" @row-click="showDepartmentDetail">
           <el-table-column align="center" show-overflow-tooltip="" prop="department_name" label="名称" width="120">
           </el-table-column>
           <el-table-column align="center" show-overflow-tooltip="" prop="divi_name" label="所在区域" width="120">
           </el-table-column>
           <el-table-column align="center" show-overflow-tooltip="" prop="org_name" label="管辖单位">
           </el-table-column>
          </el-table>
         </template>
        </el-tab-pane>
        <el-tab-pane label="重点人员">
         <template>
          <el-table size="small" :data="crrAct.person" style="width: 100%" :row-class-name="tableRowClassName" @row-click="showPersonDetail">
           <el-table-column align="center" show-overflow-tooltip="" prop="person_name" label="名称" width="120">
           </el-table-column>
           <el-table-column align="center" show-overflow-tooltip="" prop="person_gender" label="性别" width="80">
           </el-table-column>
           <el-table-column align="center" show-overflow-tooltip="" prop="person_category" label="类别">
           </el-table-column>
          </el-table>
         </template>
        </el-tab-pane>
        <el-tab-pane label="重点部位">
         <template>
          <el-table :data="crrAct.place" style="width: 100%" size="small" :row-class-name="tableRowClassName" @row-click="showPlaceDetail">
           <el-table-column prop="place_name" label="名称" align="center" show-overflow-tooltip="" width="120">
           </el-table-column>
           <el-table-column prop="divi_name" label="所在区域" align="center" show-overflow-tooltip="" width="120">
           </el-table-column>
           <el-table-column prop="place_address" align="center" show-overflow-tooltip="" label="地址">
           </el-table-column>
          </el-table>
         </template>
        </el-tab-pane>
       </el-tabs>
      </div>
     </div>
    </div>
    <el-dialog title="警员信息" :visible.sync="dialogPoliceVisible" width="600px" v-cloak="">
     <div v-if="crrData.police_head_portrait">
      <img :src="crrData.police_head_portrait" class="police_image" />
     </div>
     <div v-else="">
      <img src="./image/公安big.png" class="police_image" />
     </div>
     <div class="detail">
       {{'姓名: ' + crrData.police_name }}
     </div>
     <div class="detail">
       {{'警号: ' + crrData.police_assistant }}
     </div>
     <div class="detail">
       {{'姓别: ' + crrData.police_gender }}
     </div>
     <div class="detail">
       {{'年龄: ' + crrData.police_age }}
     </div>
     <div class="detail">
       {{'户籍地址: ' + crrData.divi_name }}
     </div>
     <div class="detail">
       {{'联系方式: ' + crrData.police_contact }}
     </div>
     <div class="detail">
       {{'所属单位: ' + crrData.org_name }}
     </div>
     <div class="detail">
       {{'直属领导: ' + crrData.lead_name }}
     </div>
    </el-dialog>
    <el-dialog title="重点单位信息" :visible.sync="dialogDepartmentVisible" width="600px" v-cloak="">
     <div class="detail">
       {{'单位名称: ' + crrData.department_name }}
     </div>
     <div class="detail">
       {{'所在区域: ' + crrData.divi_name }}
     </div>
     <div class="detail">
       {{'管辖单位: ' + crrData.org_name }}
     </div>
     <div class="detail">
       {{'单位法人姓名: ' + crrData.department_legal_person_name }}
     </div>
     <div class="detail">
       {{'地址: ' + crrData.department_address }}
     </div>
    </el-dialog>
    <el-dialog title="重点人员信息" :visible.sync="dialogPersonVisible" width="600px" v-cloak="">
     <div v-if="crrData.person_image_url">
      <img :src="crrData.person_image_url" class="person_image" />
     </div>
     <div v-else="">
      <img src="./image/person_img.jpg" class="person_image" />
     </div>
     <div class="detail">
       {{'姓名: ' + crrData.person_name }}
     </div>
     <div class="detail">
       {{'性别: ' + crrData.person_gender }}
     </div>
     <div class="detail">
       {{'人员类别: ' + crrData.person_category }}
     </div>
     <div class="detail">
       {{'民族: ' + crrData.person_nation }}
     </div>
     <div class="detail">
       {{'身高: ' + crrData.person_height }}
     </div>
     <div class="detail">
       {{'职业: ' + crrData.person_job }}
     </div>
     <div class="detail">
       {{'文化程度: ' + crrData.person_educational_status }}
     </div>
     <div class="detail">
       {{'户籍地址: ' + crrData.divi_name }}
     </div>
     <div class="detail">
       {{'人员等级: ' + crrData.person_grade }}
     </div>
     <div class="detail">
       {{'联系方式: ' + crrData.person_contact_information }}
     </div>
     <div class="detail">
       {{'责任民警: ' + crrData.police_name }}
     </div>
     <div class="detail">
       {{'管辖单位: ' + crrData.org_name }}
     </div>
    </el-dialog>
    <el-dialog title="重点部位信息" :visible.sync="dialogPlaceVisible" width="600px" v-cloak="">
     <div class="detail">
       {{'部位名称: ' + crrData.place_name }}
     </div>
     <div class="detail">
       {{'部位法人姓名: ' + crrData.place_legal_person_name }}
     </div>
     <div class="detail">
       {{'所在区域: ' + crrData.divi_name }}
     </div>
     <div class="detail">
       {{'地址: ' + crrData.place_address }}
     </div>
    </el-dialog>
   </div>`);
  },

  initVue: function() {
    if (bt_activity.count.length != 5 || bt_activity.vueIns) {
      bt_activity.addPolicePOI();
      bt_activity.addPlacePOI();
      bt_activity.addDepartmentPOI();
      return;
    }
    bt_activity.vueIns = new Vue({
      el: "#ActivityVue",
      data: {
        command_id: 0,
        crrAct: bt_activity.crrAct,
        crrData: bt_activity.crrAct,
        command: plug_activity.plug_commands,
        dialogPoliceVisible: false,
        dialogPersonVisible: false,
        dialogDepartmentVisible: false,
        dialogPlaceVisible: false,
        value: bt_activity.commandSelected,
        planCount: bt_activity.crrAct.planCount,
        policeCount: bt_activity.crrAct.policeCount,
        departmentCount: bt_activity.crrAct.departmentCount,
        personCount: bt_activity.crrAct.personCount,
        placeCount: bt_activity.crrAct.place
      },
      beforeUpdate: function() {
        // bt_activity.updateCommand();
      },
      methods: {
        commandActivate(id) {
          plug_activity.command_activate(id);
        },
        handleItemClick(e) {
          const className = e.target ? e.target.className : e.className;
          const id = e.target ? e.target.id : e.id;
          const scrollTo = id => {
            setTimeout(() => {
              $("#keyActivity .el-tabs__content").scrollTop(
                document.getElementsByClassName(id)[0].offsetTop
              );
            }, 100);
          };
          if (className.includes("plan")) {
            $("#keyActivity #tab-1")[0].click();
            scrollTo(id);
          }
          if (className.includes("police")) {
            $("#keyActivity #tab-2")[0].click();
            scrollTo(id);
          }
          if (className.includes("department")) {
            $("#keyActivity #tab-3")[0].click();
            scrollTo(id);
          }
          if (className.includes("person")) {
            $("#keyActivity #tab-4")[0].click();
            scrollTo(id);
          }
          if (className.includes("place")) {
            $("#keyActivity #tab-5")[0].click();
            scrollTo(id);
          }
        },
        openLink(row) {
          window.open(row.html_path, "_blank");
        },
        tableRowClassName({ row, rowIndex }) {
          return row.id;
        },
        flyTo() {
          const { x, y } = LL2Geo(
            this.crrData.longitude,
            this.crrData.latitude
          );
          bt_Util.executeScript(
            `Render\\CameraControl\\FlyTo ${x} ${y} 300 ${x} ${y} 50;`
          );
        },
        showPoliceDetail() {
          this.crrData = this.crrAct.police.filter(
            p => arguments[0].id == p.id
          )[0];
          this.flyTo();
          this.dialogPoliceVisible = true;
        },
        showPlaceDetail() {
          this.crrData = this.crrAct.place.filter(
            p => arguments[0].id == p.id
          )[0];
          this.flyTo();
          this.dialogPlaceVisible = true;
        },
        showDepartmentDetail() {
          this.crrData = this.crrAct.department.filter(
            p => arguments[0].id == p.id
          )[0];
          this.flyTo();
          this.dialogDepartmentVisible = true;
        },
        showPersonDetail() {
          this.crrData = this.crrAct.person.filter(
            p => arguments[0].id == p.id
          )[0];
          this.dialogPersonVisible = true;
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
  }
};
bt_activity.getKeyActivity();

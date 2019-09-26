<template>
  <div class="leftTreeContainer">
    <el-input placeholder="请输入村名,乡名或图斑名" size="mini" v-model="searchText">
      <i slot="prefix" class="el-input__icon el-icon-search"></i>
    </el-input>
    <div class="treeContainer">
      <el-tree
        ref='tree'
        :data='treeData'
        :props="props"
        node-key="geomId"
        :default-expanded-keys="defArr"
        :filter-node-method="filterNode"
        accordion
         highlight-current
        @node-contextmenu='handleContextmenu'
        >
      </el-tree>
    </div>

    <el-card v-show='showMenu' id='menuCotainer' >
      <ul>
        <li v-for='item in menu' :key='item.id' @mousedown.left="menuMousedown(item.id)">
          <i :class='item.icon' aria-hidden="true"></i>{{item.content}}
        </li>
      </ul>
    </el-card>
    <tabs
      v-show='showTabs'
      ref='tabs'
      :activeTab='activeTab' 
      :dataForTabs='dataForTabs' 
      @update:showTabs='showTabs=false' 
      @update:activeTab='activeTab="0"'      
    />
  </div>
</template>

<script>
import turf from 'turf';
import { getCurrentAreaInfo } from '@/api/api';
import tabs from '@/components/ui/tabs.vue';
import {get} from '@/utils/fetch';
import func from '../../../vue-temp/vue-editor-bridge';

const menu=[
  {
    id:'1',
    icon:'fa fa-bar-chart',
    content:'统计信息'
  },
  {
    id:'2',
    icon:'fa fa-file',
    content:'附件查看'
  },
  {
    id:'3',
    icon:'el-icon-upload',
    content:'附件上传'
  },
  {
    id:'4',
    icon:'fa fa-list',
    content:'查看详情'
  }
];

export default {
  name: 'leftTree',
  data () {
    return {
      defArr:[0],
      searchText:'',
      showTabs:false,
      activeTab:'',
      dataForTabs:{},
      menu:[],
      treeData:[{
          label: "一级 1",
          children: []
      }],
      props: {
        children: "children",
        label: "label"
      },
      // 高亮颜色
      lightColor: '#189e08',
    }
  },
  watch: {
    searchText(val) {
      this.$refs.tree.filter(val);
    },
    '$store.state.dbClickedLayer'(){
          this.defArr = [this.$store.state.dbClickedLayer];
          this.treeData = [...this.treeData]
          this.$refs.tree.setCurrentKey(this.$store.state.dbClickedLayer);
          this.$forceUpdate();
    }
  },
  computed:{
    showMenu(){
      return this.$store.state.showMenu;
    }
  },
  components:{
    tabs
  },
  methods:{
    handleContextmenu(evt,data,node){      
      if(!data.from_table) return;
      this.getCurrentAreaInfo(data);
      this.$store.commit('setShowMenu', true);
      // this.showTabs=false;

      this.$refs.tabs.closeTabsBox();
      const menuDom=document.getElementById('menuCotainer');
      menuDom.style.left=evt.clientX+'px';
      menuDom.style.top=evt.clientY+'px';

      this.dataForTabs={
        title:data.label,
        gid:data.gid
      };
      switch(data.from_table){
        case 'county' :
        case 'country' :
        case 'village' :
          this.menu=menu.slice();
          this.dataForTabs.showType=1;
          break;
        case  'plan' :
          this.menu=menu.slice(1);
          this.dataForTabs.showType=2;
          break;
        case 'spot' :
          this.menu=[menu[3]];
          this.dataForTabs.showType=3;
          break;
        
      }
      // let arr=[];
      // getNode(data);
      // console.log(arr);
      // function getNode(data){
      //   const children=data.children;
      //   if(children){
      //     children.forEach(child=>{
      //       getNode(child);
      //     })
      //   }else{
      //     arr.push(data);
      //   }
      // }
    },
    
    menuMousedown(id){
      this.showTabs=true;
      this.activeTab=id;
    },    
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    getCurrentAreaInfo (obj) {
      if (obj.from_table && obj.from_table != 'county') {
        const parmas = {
          id: obj.id,
          table: obj.from_table
        }
        getCurrentAreaInfo(parmas).then( result => {
          if (result.code && result.code == 1 && result.data && result.data.length > 0) { // 查询成功
            const center = turf.center(result.data[0].geom);
            // bt_Util.executeScript('Render\\CameraControl\\FlyTo2 '+ll.x+' '+ll.y+' 0;');
					  bt_Util.executeScript(`Render\\CameraControl\\FlyTo ${center.geometry.coordinates[0]} ${center.geometry.coordinates[1]} 30000 ${center.geometry.coordinates[0]} ${center.geometry.coordinates[1]} 5000;`);
            this.setLight(result.data[0].geom);

            this.dataForTabs.details=result.data[0];
          }
        }).catch( error => {
          console.log(error);
        })
      } else {
        this.setLight();
      }
    },
    setLight (geojson) {
      if (geojson) {
        let allPointArr = []
        let allPoint = ''
        let len = 0
        const coordinates = geojson.coordinates;

        for (let i = 0; i < coordinates.length; i++ ) {
          for (let j = 0; j < coordinates[i].length; j++) {
            // 轮廓线点数
            len += coordinates[i][j].length
            for (let k = 0; k < coordinates[i][j].length; k++) {
              allPointArr.push(coordinates[i][j][k][0])
              allPointArr.push(coordinates[i][j][k][1])
            }
          }
        }

        allPoint = allPointArr.join(' ');
        //执行单体化高亮命令
        let str = `Render\\RenderDataContex\\SetOsgAttribBox -10 9999 ${this.lightColor} ${len} ${allPoint};`
        bt_Util.executeScript(str);
      } else {
        bt_Util.executeScript("Render\\RenderDataContex\\SetOsgAttribBox 0;");
      }

    }
  },
  mounted(){
    const th=this;
    document.body.addEventListener('mousedown',function(evt){
      th.$store.commit('setShowMenu', false);
    },true);
    document.body.addEventListener('contextmenu',function(evt){
      evt.preventDefault();
    },true);
    $.ajax({
      type: "GET",
      crossDomain: true,
      url: config.server + "attachs/getTree",
      success: data => {
        //计算目录树
        th.treeData = makeTree(diffQLGH(data.data));
      }
    });
    function diffQLGH(data) {
      const QLGH = [];
      const dupChaeck = [];
      data.forEach(a => {
        a.geomId = a.from_table+'.'+a.id;
        if (a.from_table == "spot" || a.from_table == "plan") {
          const qg = {
            parent: a.parent,
            label: a.from_table == "spot" ? "潜力图斑" : "规划图斑",
            gid: a.parent + "-" + a.from_table
          };
          if (!dupChaeck.includes(qg.gid)) {
            dupChaeck.push(qg.gid);
            QLGH.push(qg);
          }
          a.parent = qg.gid;
        }
      });
      return [...data, ...QLGH];
    }
    function makeTree(data) {
      let tree = [];
      let hasNoChild = data.filter(a => {
        if (data.filter(b => b.parent == a.gid).length) {
          tree.push(a);
          return false;
        } else {
          return true;
        }
      });
      if (hasNoChild.length == data.length) return data;
      hasNoChild.map(nc => {
        tree.map(d => {
          if (nc.parent == d.gid) {
            d.children = d.children ? d.children : [];
            d.children.push(nc);
          }
        });
      });
      return makeTree(tree);
    }
  }
}
</script>

<style lang="scss" scoped>
.leftTreeContainer{
  position: fixed;
  top:64px;
  left:10px;
  z-index: 11;
  // background: rgba(14, 24, 33, 0.6);
  background-color: #fff;
  width: 200px;
  height: 500px;
  padding:8px;
  border-radius: 10px;


  .treeContainer{
    height: 450px;
    margin-top: 5px;
    // padding-right: 2px;
    overflow-y: auto;

  }

  // /deep/.el-tree-node__content:hover{
  //   background-color: #636667 !important;
  // }
  .el-card{
    position: fixed;
    width:180px;
  }
  .el-card ul{
    list-style: none;
    padding: 0;
  }
  .el-card ul>li{
    margin-bottom: 8px;
    padding:3px;
    padding-left: 4px;
    cursor: pointer;
  }
  .el-card ul>li:hover{
     background-color: #f5f7fa;
  }
  .el-card ul>li:last-child{
    margin-bottom:0;
  }
  .el-card ul>li>i{
    width: 20px;
    height: 20px;
    font-size: 18px;
    margin-right: 12px;
  }
}


</style>
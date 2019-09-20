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
        node-key="nodeId"
        :default-expanded-keys="[1]"
        accordion
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
    <tabs v-show='showTabs' :activeTab='activeTab' @update:showTabs='showTabs=false'/>
  </div>
</template>

<script>
import tabs from '@/components/ui/tabs.vue';
export default {
  name: 'leftTree',
  data () {
    return {
      searchText:'',
      showTabs:true,
      activeTab:'',
      menu:[
        {
          id:1,
          icon:'fa fa-file',
          content:'统计'
        },
        {
          id:2,
          icon:'fa fa-bar-chart',
          content:'附件查看'
        },
        {
          id:3,
          icon:'el-icon-edit',
          content:'修改图斑状态'
        }
      ],
      treeData:[
        {
          nodeId:1,
          title:'1县',
          children:[
            {title:'1村',children:[
              {title:'1乡',children:[
                {title:'潜力图斑',children:[
                  {title:'101'},
                  {title:'102'}
                ]},
                {title:'规划图斑',children:[
                  {title:'101'},
                  {title:'102'}
                ]}
              ]}
              ]
            },
            {title:'2村',children:[{title:'加载中'}],},
            {title:'3村',children:[{title:'加载中'}],},
            {title:'4村',children:[{title:'加载中'}]},
            {title:'5村',children:[{title:'加载中'}],},
            {title:'6村',children:[{title:'加载中'}],},
            {title:'7村',children:[{title:'加载中'}],},
            {title:'8村',children:[{title:'加载中'}],},
            {title:'9村',children:[{title:'加载中'}],},
            {title:'10村',children:[{title:'加载中'}]},
            {title:'11村',children:[{title:'加载中'}]},
            {title:'12村',children:[{title:'加载中'}]},
            {title:'13村',children:[{title:'加载中'}]},
            {title:'14村',children:[{title:'加载中'}]},
            {title:'15村',children:[{title:'加载中'}]},            
          ]
        }        								
      ],
      props: {
        label: 'title',
        children: 'children',
      },
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
    handleContextmenu(evt,data,node,tree){
      // if()
      this.$store.commit('setShowMenu', true);
      const menuDom=document.getElementById('menuCotainer');
      menuDom.style.left=evt.clientX+'px';
      menuDom.style.top=evt.clientY+'px';
           
      switch(node.level){
        case 1 :
        case 2 :
        case 3 :
          this.menu=[
            {
              id:'1',
              icon:'fa fa-bar-chart',
              content:'统计'
            },
            {
              id:'2',
              icon:'fa fa-file',
              content:'附件查看'
            }
          ];
          break;
        case 5 :
          this.menu=[
            {
              id:'2',
              icon:'fa fa-file',
              content:'附件查看'
            },
            {
              id:'3',
              icon:'el-icon-edit',
              content:'修改图斑状态'
            }
          ];
          break;
      }      
    },
    menuMousedown(id){      
      this.showTabs=true;
      this.activeTab=id;
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
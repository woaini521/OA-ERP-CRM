<template>
  <div class="app">
    <div class="app-header">
      <div class="title">
        <img src="@/assets/kovi_logo.png">
      </div>
      <i style="margin-left:10px;" class="el-icon-refresh" @click="shuaxin"></i>
      <i style="margin-left:15px;" class="el-icon-goods"></i>
      <div class="info_geren">
        <i class="el-icon-s-custom" style="float: left;font-size: 30px;margin-top: 13px;"></i>
        <el-dropdown trigger="click">
          <span class="el-dropdown-link">
            {{name}}
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>消息中心</el-dropdown-item>
            <el-dropdown-item @click.native="personal">设置</el-dropdown-item>
            <el-dropdown-item @click.native="tuichu" divided>退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div class="app-content">
      <div class="app-nav" :style="{height:this.menuHeight +'px'}">
        <app-nav></app-nav>
      </div>
      <div class="app-wrap">
        <!-- 此处放置el-tabs代码 -->
        <div class="template-tabs">
          <el-tabs
            v-model="activeIndex"
            type="card"
            closable
            @tab-click="tabClick"
            v-if="options.length"
            @tab-remove="tabRemove"
          >
            <el-tab-pane
              :key="item.name"
              v-for="item in options"
              :label="item.name"
              :name="item.route"
            >
            </el-tab-pane>
          </el-tabs>
        </div>
        <div class="content-wrap" :style="{height:this.fullHeight +'px'}">
          <transition name="fade-transform" mode="out-in">
            <keep-alive>
              <router-view/>
            </keep-alive>
          </transition>
        </div>
      </div>
    </div>

    <el-dialog title="设置" :visible.sync="dialogPersonal" width="850px">
      <el-form :model="dialogPersonalForm" style="float: left;">
          <el-form-item label="姓名" label-width="100px">
            <el-input v-model="dialogPersonalForm.name" :disabled="true" style="width:217px;"></el-input>
          </el-form-item>
          <el-form-item label="手机" label-width="100px">
            <el-input v-model="dialogPersonalForm.phone" :disabled="true" style="width:217px;"></el-input>
          </el-form-item>
          <el-form-item label="工作手机" label-width="100px">
            <el-input v-model="dialogPersonalForm.Gphone" :disabled="true" style="width:217px;"></el-input>
          </el-form-item>
          <el-form-item label="密码" label-width="100px">
            <el-input v-model="dialogPersonalForm.pwd" style="width:217px;"></el-input>
          </el-form-item>
          <el-form-item label="绑定二维码" label-width="100px">
            <erweima :link="link"></erweima>
          </el-form-item> 
          <el-form-item label=" " label-width="100px">
              <el-button type="primary" @click="addInfo">保存</el-button>
          </el-form-item>
      </el-form>
      
      <div style="float: left;margin-left:30px;">
        <el-table :data="tabledata" > 
          <el-table-column label="已经绑定微信号" prop="openid" width="300px"></el-table-column>
          <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="danger" size="mini" @click="dele(scope.row)">删除</el-button>
              </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import AppNav from "@/components/common/AppNav";
import erweima from "@/components/erweima";
import {mapGetters,mapActions} from 'vuex';
import { error } from 'util';

export default {
  components: {
    AppNav,erweima
  },
  data(){
    return{
      fullHeight:document.documentElement.clientHeight-120,
      menuHeight:document.documentElement.clientHeight-65,
      name:'',
      link:'',
      dialogPersonal:false,
      dialogPersonalForm:{
        user_id:'',
        name:'',
        phone:'',
        Gphone:'',
        pwd:'',
        src:'',
        status:'',
      },
      tabledata:[],
    }
  },
  computed: {
    jian() {
      return this.$route.path
    },
  },
  mounted() {
   const that = this;
   window.onresize = () => {
    return (() => {
     window.fullHeight = document.documentElement.clientHeight;
     window.menuHeight = document.documentElement.clientHeight
     that.fullHeight = window.fullHeight-120
     that.menuHeight = window.menuHeight-65
    })()
   }
  },
  methods: {
    ...mapActions("Tabs", ['triggerAddTabs', 'triggerSetActiveIndex','triggerDeleteTabs',]),
    // tab切换时，动态的切换路由
    tabClick() {
       let path = this.activeIndex;
      //用户详情页的时候，对应了二级路由，需要拼接添加第二级路由
      if (this.activeIndex === this.UserInfo) {
        path = this.activeIndex + "/" + this.options.id;
        this.$router.push({ path: path });
      }
      this.$router.push({ path: path });
    },
    tabRemove(targetName) {
      // 首页不可删除
      if (targetName == "/sy") {
        return;
      }
      // 删除
      this.triggerDeleteTabs(targetName);

      if (this.activeIndex === targetName) {
        // 设置当前激活的路由
        if (this.options && this.options.length >= 1) {
          this.triggerSetActiveIndex(this.options[this.options.length - 1].route);
          this.$router.push({ path: this.activeIndex });
        } else {
          this.$router.push({ path: "/" });
        }
      }
    },
    tuichu() {
      this.axios.get('/Index/exitdo').then(res =>{
        this.$router.push({ path: "/Login" });
        var storage = window.localStorage;
        storage.clear();
      })
    },
    shuaxin(){
      window.location.reload(); 
    },
    personal(){
      this.axios.get('/oa.User/user_set').then(res => {
        this.dialogPersonal = true;
        this.dialogPersonalForm.name = res.data.name;
        this.dialogPersonalForm.phone = res.data.phone;
        this.dialogPersonalForm.Gphone = res.data.work_phone;
        this.dialogPersonalForm.user_id =  res.data.user_id,
        this.link = res.data.ewm;
        this.tabledata = res.data.openid_list
      })  
    },
    addInfo(){
      this.axios.post('/oa.User/user_set',{
        user_id:this.dialogPersonalForm.user_id,
        pwd:this.dialogPersonalForm.pwd,
      }).then(res => {
        if(res.data.code == 2000){
           this.$message({
                message: res.data.msg,
                type: 'success'
            });
            this.personal();
        }else{
          this.$message({
                message: res.data.msg,
                type: 'error'
            });
        }
      })
    },
    // 删除已绑定微信
    dele(a){
      this.axios.post('/oa.User/openid_delete',{
        id:a.id
      }).then(res => {
        if(res.data.code == 2000){
           this.$message({
                message: res.data.msg,
                type: 'success'
            }); 
            this.axios.get('/oa.User/user_set').then(res => {
              this.tabledata = res.data.openid_list
            })
        }else{
          this.$message({
                message: res.data.msg,
                type: 'error'
            });
        }
          
      })
    }

  },
  computed: {
    ...mapGetters("Tabs",{
      options:'renderOptions',
      renderActiveIndex:'renderActiveIndex',
    }),
    ...mapGetters("customerList",{
      UserInfo:'renderUserInfo'
    }),
    activeIndex: {
      get() {
        return this.renderActiveIndex;
      },
      set(val) {
        //console.log(val);
        this.$store.dispatch("Tabs/triggerSetActiveIndex", val);
      }
    }
  },
  created(){
    const that = this;
    this.name = JSON.parse(localStorage.getItem('name'));
    window.onresize = () => {
      return (() => {
        window.fullHeight = document.documentElement.clientHeight;
        window.menuHeight = document.documentElement.clientHeight
        that.fullHeight = window.fullHeight
        that.menuHeight = window.menuHeight
      })()
    }
  },
  watch: {
    $route(to) {
      let flag = false;
      for (let option of this.options) {
        if (option.name === to.name) {
          flag = true;
          let ins = to.path;
          this.triggerSetActiveIndex(ins);
          break;
        }
      }
      if (!flag) {
        let ins = {
          route:to.path,
          name: to.name
        }
         let ins1 =to.path;
         this.triggerAddTabs(ins);
         this.triggerSetActiveIndex(ins1);
      }
    },
    fullHeight (val) {
     if(!this.timer) {
      this.fullHeight = val
      this.timer = true
      let that = this
      setTimeout(function (){
       that.timer = false
      },400)
     }
    }
  }
}
</script>

<style lang="less">
html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
}
.app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
  // display: flex;
  // flex-flow: column;
  overflow: hidden;
  .app-header {
    color: #fff;
    // flex: 0 0 60px;
    background: #324057;
    height: 60px;
    line-height: 60px;
    overflow: hidden;
    .title {
      font-size: 24px;
      float: left;
      text-align: center;
      img{
        width: 160px;
        margin-top: 15px;
        margin-left: 10px;
      }
    }
    .info_geren {
      float: right;
      overflow: hidden;
      margin-right: 5px;
      
      .el-dropdown-link {
        cursor: pointer;
      }
      div {
        float: left;
        color: #fff;
      }
    }
  }
  .app-content {
    // flex: 1;
    // display: flex;
    flex-flow: row;
    .app-nav {
      // flex: 0 0 0;
      float: left;
      background-color: #324057;
    }
    .app-wrap {
      // flex: 1;
      padding: 5px 5px;
      overflow: auto;
      .content-wrap {
        
        border: 1px solid #d1dbe5;
        overflow-y: scroll;
        border-top: none;
        padding: 0 20px;
        .template-wrap {
          
          text-align: center;
        }
      }
      .el-tabs--border-card > .el-tabs__content {
        padding: 0px;
      }
      .el-tabs__header {
        margin-bottom: 0px;
      }
    }
  }
}
.el-dialog{
  overflow: hidden;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.28s;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}

/* fade-transform */
.fade-transform-leave-active,
.fade-transform-enter-active {
  transition: all .5s;
}

.fade-transform-enter {
  opacity: 0;
  transform: translateX(-30px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

</style>

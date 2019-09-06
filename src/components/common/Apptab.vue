<template>
  <div class="app">
      <el-container>
        <el-header class="headeer" @touchmove.prevent>
          <img style="width: 180px;margin-top:10px;float: left;" src="@/assets/kovi_logo.png">
          <i style="margin-left:10px;float: left;line-height:60px;color:#FFF;" class="el-icon-refresh" @click="shuaxin"></i>
          <i style="margin-left:5px;float: left;line-height:60px;color:#FFF;" class="el-icon-goods"></i>
          <div class="info_geren">
            <i class="el-icon-s-custom" style="float: left;font-size: 30px;margin-top: 13px;color:#FFF;"></i>
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
        </el-header>
        <el-container>
          <el-aside width='200' @touchmove.prevent>
            <AppNav :style="{height:this.menuHeight +'px'}"></AppNav>
          </el-aside>
          <el-container>
            <el-header class="head_tab">
                <div class="template-tabs" style="width:100%;">
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
            </el-header>
            <el-main style="padding-top:0px;">
                <div class="content-wrap" :style="{height:this.fullHeight-60+'px'}">
                  <transition name="fade-transform" mode="out-in">
                    <keep-alive>
                      <router-view/>
                    </keep-alive>
                  </transition>
                </div>
            </el-main>
            <!-- <el-footer>Footer</el-footer> -->
          </el-container>
        </el-container>
      </el-container>
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


export default {
  components: {
    AppNav,erweima
  },
  data(){
    return{
      fullHeight:document.documentElement.clientHeight-120,
      menuHeight:document.documentElement.clientHeight-60,
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
      if(this.dialogPersonalForm.pwd == ''){
        this.$message({
            message:'请输入你的新密码',
            type: 'error'
        });
      }else{
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
      }
      
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
.app{
      font-family: "Avenir", Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      height: 100%;
      // display: flex;
      // flex-flow: column;
      overflow: hidden;
      .headeer{
        background-color: #324057;
        line-height: 60px;
        padding-left: 10px;
        padding-right: 10px;
          .info_geren {
              float: right;
              overflow: hidden;
              .el-dropdown-link {
                cursor: pointer;
              }
              div {
                float: left;
                color: #fff;
              }
            }
      }
      
      .el-aside {
        background-color: #324057;
        color: #333;
        overflow: hidden;
        .el-menu-vertical-demo:not(.el-menu--collapse) {
          width: 200px;
          min-height: 400px;
        }
      }
      .head_tab{
        padding: 0;
        margin-top: 5px;
        padding-left: 5px;
        height: 40px;

      }
      .el-main {
        background-color: #FFF;
        color: #333;
        padding: 0;
        padding: 10px;
      }
      
      body > .el-container {
        margin-bottom: 40px;
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
}
</style>

<template>
  <div class="box">
    <!-- <el-row type="flex" justify="center"> -->
      <el-form :model="reForm" label-width="60px" class="from">
        <label>KOVI后台系统</label>
        <el-form-item label="账号">
          <el-input v-model="reForm.input1" clearable></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="reForm.input2" show-password></el-input>
        </el-form-item>
        <el-button class="dl" type="primary" icon="el-icon-upload" @click="handleLogin">登录</el-button>
      </el-form>
    <!-- </el-row> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      reForm: {
        input1: "",
        input2: ""
      },
      name: "GT",
      psd: "GTT"
    };
  },
  methods: {
    handleLogin() {
      if (this.reForm.input1 == "") {
        this.open("用户名不为空","error");
      } else if (this.reForm.input2 == "") {
        this.open("密码为空","error");
      } else {
       this.axios.post("/Index/checklogin",{
         phone:this.reForm.input1,
         pwd:this.reForm.input2
        }).then(res => {
          if(res.data.code == "2000"){
            this.$cookies.set("token", "11");
            this.$router.push({ path: "/" });
            this.menus = res.data.menu;
            localStorage.setItem('Arr',JSON.stringify(res.data.menu))
            localStorage.setItem('name',JSON.stringify(res.data.name))
            localStorage.setItem('Group',JSON.stringify(res.data.group_id))
            this.open(res.data.msg,"success");
          } else {
            this.open(res.data.msg,"error");
          }      
        })
      }
    },
    open(a,b) {
      this.$message({
        message: a,
        type: b,
        center: true
      });
    },
  },
  created:function(){
     let _this = this;
     document.onkeydown = function(e) {
        let key = window.event.keyCode;
        if (key == 13) {
              _this.handleLogin();
            }
        };
  },
  beforeDestroy() {
    document.onkeydown = function(e) {
      var key = window.event.keyCode
      if (key === 13) {

      }
    }
  }

};
</script>
<style scoped>
.box{
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;
}
.from {
  padding: 10px 10px 100px 10px;
  text-align: center;
}
label {
  text-align: center;
  font-size: 28px;
  font-weight: bolder;
}
.el-form-item__label {
  text-align: center !important;
}
.el-form-item {
  margin-bottom: 0;
  margin-top: 28px;
}
.el-button {
  width: 100%;
  margin-top: 40px !important;
}
</style>

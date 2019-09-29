<template>
  <div class="box">
    <el-form :model="dialogForm">
      <el-form-item label="人员" label-width="90px">
        <el-select v-model="dialogForm.value" filterable clearable placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.user_id"
            :label="item.name"
            :value="item.user_id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="操作" label-width="90px">
        <el-radio v-model="dialogForm.radio" label="1">加分</el-radio>
        <el-radio v-model="dialogForm.radio" label="2">减分</el-radio>
      </el-form-item>
      <el-form-item label="内容" label-width="90px">
        <el-input v-model="dialogForm.content"></el-input>
      </el-form-item>
      <el-form-item label="上传图片" label-width="90px">
        <div class="contract">
          <div class="contractInner">
            <div class="contractInnerLeft">
              <el-upload
                class="avatar-uploader"
                accept="image/jpeg, image/gif, image/png, image/bmp"
                action="111"
                :show-file-list="false"
                :http-request="upLoad"
                :before-upload="beforeAvatarUpload"
              >
                <i class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </div>
            <div class="img" v-show="imageUrlstate">
              <div class="imginner" v-for="(item,index) in imageUrl" :key="item.src">
                <img :src="item.src" class="avatar" />
                <div class="avatars">
                  <i
                    @click="deletesImg(index)"
                    style="font-size: 30px;margin-top: 75px;margin-left: 75px;color:#FFF;"
                    class="el-icon-delete"
                  ></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-form-item>
      <el-form-item label=" " label-width="90px">
        <el-button @click="comfile">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  data() {
    return {
        options: [
                {
                    value: '选项1',
                    label: '黄金糕'
                }, {
                    value: '选项2',
                    label: '双皮奶'
                }, {
                    value: '选项3',
                    label: '蚵仔煎'
                }, {
                    value: '选项4',
                    label: '龙须面'
                }, {
                    value: '选项5',
                    label: '北京烤鸭'
                }
            ],
        dialogForm:{
                value: '',
                radio:'',
                content:'',
        },
        user_id:'',
        imageUrl:[],
        imageUrlstate:false,
    };
  },
  methods: {
    ...mapActions("Tabs", ["triggerDeleteTabs"]),
    gettableData(){
            this.axios.get('/oa.Days/reward_select').then(res => {
                this.options = res.data.user_list;
                this.user_id = res.data.user_id;
            })
        },
    // 提交数据
    comfile() {
      let img = [];
      for (let i = 0; i < this.imageUrl.length; i++) {
        img.push(this.imageUrl[i].src);
      }
      if (
        this.dialogForm.value == "" ||
        this.dialogForm.content == "" ||
        this.dialogForm.radio == ""
      ) {
        this.$message({
          message: "填写完整",
          type: "error"
        });
      } else {
        this.axios
          .post("/oa.Days/reward_add", {
            apply_user: this.user_id,
            target_user: this.dialogForm.value,
            content: this.dialogForm.content,
            plus_minus: this.dialogForm.radio,
            img: img
          })
          .then(res => {
            if (res.data.code === 2000) {
              this.$message({
                message: res.data.msg,
                type: "success"
              });
              this.triggerDeleteTabs(this.$route.path);
              this.$router.push({ path: "/oa/Days/reward_select" });
            } else {
              this.$message({
                message: res.data.msg,
                type: "error"
              });
            }
          });
      }
    },
    // 图片删除
    deletesImg(b) {
      this.imageUrl.splice(b, 1);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg" || file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传图片必须是JPG/PNG格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    upLoad(file) {
      const formData = new FormData();
      formData.append("file", file.file);
      this.axios
        .post(`/File/reward_img`, formData)
        .then(res => res.data)
        .then(data => {
          if (data.code === 2000) {
            let a = { src: data.src };
            this.imageUrl.push(a);
            this.imageUrlstate = true;
          }else{
            this.$message.error(data.msg);  
          }
        });
    },
  },
  activated(){
      this.gettableData();
  }
};
</script>

<style lang="less" scoped>

.contract{
  overflow: hidden;
  .contractInner{
    overflow: hidden;
    .contractInnerLeft{
      float: left;
    }
  }
}
.avatar-uploader,.el-upload {
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
     border: 1px dashed #CCC !important;
  }
  .avatar-uploader,.el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .img{
    float: left;
    overflow: hidden;
    .imginner{
      float: left;
      width: 178px;
      height: 178px;
      margin-left: 10px;
      border-radius: 5px;
      position: relative;
      .avatar {
        width: 178px;
        height: 178px;
      }
      
      .avatars {
        width: 178px;
        height: 178px;
        background: rgba(102, 102, 102, 0.4);
        position: absolute;
        top: 0;
        display: none;
      }
    }
    .imginner:hover .avatars{display:block;cursor: pointer;}  
  }
</style>
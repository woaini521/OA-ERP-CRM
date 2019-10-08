<template>
    <div class="box">
        <el-button @click="Fqbtn">发起</el-button>
        <el-table :data="tableData">
            <el-table-column label="奖惩人" prop="target_name" width="100"></el-table-column>
            <el-table-column label="发起人" prop="apply_name" width="100"></el-table-column>
            <el-table-column label="内容" prop="content"></el-table-column>
            <el-table-column label="图片" prop="" width="130">
                <template slot-scope="scope">
                    <div class="demo-image__preview" v-if="scope.row.img.length != 0">
                        <el-image 
                            style="width: 100px; height: 30px"
                            :src="scope.row.img[0]" 
                            :preview-src-list="scope.row.img">
                        </el-image>
                    </div>
                    <span v-else>无</span>
                </template>
            </el-table-column>
            <el-table-column label="类型"  width="100">
                <template slot-scope="scope">
                    <span>{{ scope.row.type.type_text }}</span>
                </template>
            </el-table-column>
            <el-table-column label="分数" prop="score"  width="100"></el-table-column>
            <el-table-column label="时间" prop="add_time"  width="150"></el-table-column>
            <el-table-column label="操作" width="100" v-if="Group">
              <template slot-scope="scope">
                <el-button type="danger" size="mini" @click="shan(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
        </el-table>
        <el-pagination
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-size="per_page"
                layout="total, prev, pager, next"
                :total="total">
        </el-pagination>
    </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
    data(){
        return {
            tableData:[],
            currentPage:0,//当前页
            total:0,//总数
            per_page:0,//每页多少条
            last_page:0,//总页数
            Group:false,
        }
    },
    methods:{
        ...mapActions("customerList", ["triggerReplaceId"]),
        ...mapActions("Tabs", ["triggerAddTabs", "triggerSetActiveIndex"]),
        gettableData(){
            this.axios.get('/oa.Days/reward_select').then(res => {
                this.tableData = res.data.data.data;
                this.currentPage = res.data.data.current_page;
                this.total = res.data.data.total;
                this.per_page = res.data.data.per_page;
                this.last_page = res.data.data.last_page;
            })
        },
        
        Fqbtn(){
          this.$router.push({ path:'/oa/Days/faqi'});
          let ins1 = {
            route: `/oa/Days/faqi`,
            name: "激励发起",
          };
          let ins2 = `/oa/Days/faqi`;
          this.triggerAddTabs(ins1);
          this.triggerSetActiveIndex(ins2);    
        },
        handleCurrentChange(val) {
           this.axios.post('/oa.Days/reward_select',{
               page:val,
           }).then(res => {
                this.tableData = res.data.data.data;
                this.currentPage = res.data.data.current_page;
                this.total = res.data.data.total;
                this.per_page = res.data.data.per_page;
                this.last_page = res.data.data.last_page;
            }) 
        },
        // 删除
        shan(a){
          this.axios.post('/oa.Days/reward_delete',{
            id:a
          }).then(res => {
            if(res.data.code == 2000){
              this.$message({
                type: 'success',
                message: res.data.msg
              });
              this.gettableData();
            }else{
              this.$message({
                type: 'error',
                message: res.data.msg
              });
            }
          })
        }
        
    },
    activated(){
        let Group = JSON.parse(localStorage.getItem('Group'));
        this.Group = Group.includes(6);
        this.gettableData();
    },
}
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

<template>
    <div class="box">
        <div>
            <label>筛选：</label>
            <el-date-picker v-model="time" value-format="timestamp" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
            <el-button style="margin-left:20px;">搜索</el-button>
        </div>
        <el-table :data="tableData">
            <el-table-column label="发起人" prop="apply_name"></el-table-column>
            <el-table-column label="金额" prop="money"></el-table-column>
            <el-table-column label="备注" prop="remark"></el-table-column>
            <el-table-column label="状态">
                <template slot-scope="scope">
                    <span>{{ scope.row.status.status_text }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="danger" size="mini" v-if="scope.row.status.status == 1" @click="shenhe(scope.row)">审核</el-button>
                    <el-button type="danger" size="mini" v-if="scope.row.status.status == 2" @click="Cshenhe(scope.row)">审核</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="block" style="margin-top: 10px;">
            <el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-size="per_page" layout="total, prev, pager, next" :total="total"></el-pagination>
        </div>

        <el-dialog title="出纳付款信息" :visible.sync="dialogInfo">
            <div class="contract">
                <div class="contractInner">
                    <div class="contractInnerLeft" v-show="show">
                        <el-upload
                            class="avatar-uploader"
                            accept="image/jpeg,image/gif,image/png,image/bmp"
                            action="123"
                            :show-file-list="false"
                            :http-request="upLoad"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload">
                            <i class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </div>
                    <div class="img" v-show="imageUrlstate">
                        <div class="imginner" v-for="item in imageUrl" :key="item.src">
                            <img :src="item.src" class="avatar">
                            <div class="avatars">
                                <i @click="deletesImg(item.src)" v-show="show" style="font-size: 30px;margin-top: 75px;margin-left: 75px;color:#FFF" class="el-icon-delete" ></i>
                                <i @click="big(item.src)" v-show="!show" style="font-size: 30px;margin-top: 75px;margin-left: 75px;color:#FFF" class="el-icon-zoom-in" ></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogInfo = false">取 消</el-button>
                <el-button type="primary" @click="add">确 定</el-button>
             </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data(){
        return{
            time:'',
            tableData:[],
            currentPage: 0, //当前页
            total: 0, //总数
            per_page: 0, //每页多少条
            last_page: 0, //总页数
            ID:'',
            dialogInfo:false,
            imageUrlstate:false,
            imageUrl:[],
            show:true,
            dialogVisibleImg:false,
            dialogImageUrl:'',
        }
    },
    methods:{
        // 分页
        handleCurrentChange(val){
            let a,b;
            if(this.time == null){
                a = '';
                b = '';
            }else{
                a = this.time[0]/1000;
                b = this.time[1]/1000;
            }
            this.axios.post('/Finance/stuff_finance_select',{
                page:val,
                start_time:a,
                end_time:b
            }).then(res => {
                this.tableData = res.data.data.data;
                this.currentPage = res.data.data.current_page;
                this.total = res.data.data.total;
                this.per_page = res.data.data.per_page;
                this.last_page = res.data.data.last_page;
            })
        },
        seach(){
            let a,b;
            if(this.time == null){
                a = '';
                b = '';
            }else{
                a = this.time[0]/1000;
                b = this.time[1]/1000;
            }
            this.axios.post('/Finance/stuff_finance_select',{
                start_time:a,
                end_time:b
            }).then(res => {
                this.tableData = res.data.data.data;
                this.currentPage = res.data.data.current_page;
                this.total = res.data.data.total;
                this.per_page = res.data.data.per_page;
                this.last_page = res.data.data.last_page;
            })
        },
        gettableData(){
            this.axios.get('/Finance/stuff_finance_select').then(res => {
                this.tableData = res.data.data.data;
                this.currentPage = res.data.data.current_page;
                this.total = res.data.data.total;
                this.per_page = res.data.data.per_page;
                this.last_page = res.data.data.last_page;
                this.ID = res.data.user_id;
            })
        },
        shenhe(a){
            this.axios.post('/Finance/stuff_finance_verify',{
                id:a.id,
                user_id:this.ID,
            }).then(res => {
                if(res.data.code == 2000){
                    this.open(res.data.msg,'success');
                    this.gettableData();
                }else{
                    this.open(res.data.msg,'error');
                }
            })
        }, 
        Cshenhe(a){
            this.dialogInfo = true; 
        },
        handleAvatarSuccess() {
            this.getimgUrl(0);
        },
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isJPG) {
            this.$message.error('上传图片必须是JPG/PNG格式!');
            }
            if (!isLt2M) {
            this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        },
        upLoad(file){
            const voucherData = new FormData()
            voucherData.append('file',file.file)
            voucherData.append('id',this.ID)
            voucherData.append('class','temporary_file')
            voucherData.append('data_table','supplier_money')
            this.axios.post(`/File/file_add`,voucherData).then(res => res.data)
            .then(data => {
                if(data.code === 2000){
                  let a = {src:data.src}
                  this.imageUrl.push(a);
                  this.imageUrlstate=true;
                }
            })  
        },
        // 获取合同图片
        getimgUrl(a){
            this.axios.post('/File/file_select',{
              data_table:'supplier_money',
              class:'temporary_file',
              id:a,
            }).then(res => {
                if(res.data != null){
                  this.imageUrlstate = true;
                  this.imageUrl = res.data;
                }  
            })
        },
        deletesImg(a){ 
            this.axios.post('/File/file_delete',{
                class:'temporary_file',
                src:a
            }).then(res => {
                if(res.data.code == 2000){
                    this.$message({
                        message: res.data.msg,
                        type: 'success'
                    });
                    this.getimgUrl(this.ID)
                }else{
                    this.$message({
                        message: res.data.msg,
                        type: 'error'
                    });
                    
                } 
            })
        },
        add(){
            this.axios.post('/Finance/finance_supplier_money_status',{
                id:this.ID,
                src:this.imageUrl
            }).then(res => {
                if(res.data.code == 2000){
                    this.gettableData();
                    this.$message({
                        message: res.data.msg,
                        type: 'success'
                    });
                    this.voucher = false;
                }else{
                    this.$message({
                        message: res.data.msg,
                        type: 'error'
                    });
                }
            })
        }, 
        open(a,b){
            this.$message({
                message: a,
                type: b
            });
        },     
    },
    created(){
        this.gettableData();
    }
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
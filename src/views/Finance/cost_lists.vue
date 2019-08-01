<template>
    <div class="box">
        <el-button @click="add" style="margin-top:20px;">新增</el-button>
        <el-table :data="tableData">
            <el-table-column label="金额" prop="money"></el-table-column>
            <el-table-column label="内容" prop="remarks"></el-table-column>
            <el-table-column label="审核人" prop="user_id"></el-table-column>
            <el-table-column label="状态" prop="status">
                <template slot-scope="scope">
                    <span v-if="scope.row.status == -2">等待巴长审核</span>
                    <span v-if="scope.row.status == -1">等待领导审核</span>
                    <span v-if="scope.row.status == 0">等待财务审核</span>
                    <span v-if="scope.row.status == 1">等待出纳付款</span>
                    <span v-if="scope.row.status == 2">结束</span>
                </template>
            </el-table-column>
            <el-table-column label="类型" prop="type">
                <template slot-scope="scope">
                    <span>{{scope.row.type == 1 ? '入账' : '出账'}}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="210px">
                <template slot-scope="scope">
                    <el-button size="mini"  v-if="scope.row.status < -1" type="primary" @click="update(scope.row)">修改</el-button>
                    <el-button size="mini" v-if="scope.row.status < 1" type="danger" @click="deletes(scope.row)">删除</el-button>
                    <el-button size="mini" v-if="scope.row.status < 3" type="success" @click="examine(scope.row)">审核</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="block" style="margin-top: 10px;">
            <el-pagination
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-size="per_page"
            layout="total, prev, pager, next"
            :total="total">
            </el-pagination>
        </div> 

        <el-dialog title="新增和修改" :visible.sync="dialogVisible">
            <el-form :model="Form">
                <el-form-item label="类型" label-width="90px">
                    <el-radio v-model="Form.type" label="1">入帐</el-radio>
                    <el-radio v-model="Form.type" label="2">出账</el-radio>
                </el-form-item>
                <el-form-item label="金额" label-width="90px">
                    <el-input v-model="Form.money" style="width:217px"></el-input>
                </el-form-item>
                <el-form-item label="内容" label-width="90px">
                    <el-input v-model="Form.remarks" type="textarea" style="width:217px"></el-input>
                </el-form-item>
                <el-form-item label="上传报销单">
                    <div class="contract">
                        <div class="contractInner">
                            <div class="contractInnerLeft">
                                <el-upload
                                    class="avatar-uploader"
                                    accept="image/jpeg,image/gif,image/png,image/bmp"
                                    action="/File/cost_file"
                                    :show-file-list="false"
                                    :on-success="handleAvatarSuccess"
                                    :before-upload="beforeAvatarUpload">
                                    <i class="el-icon-plus avatar-uploader-icon"></i>
                                </el-upload>
                            </div>
                            <div class="img" v-show="imageUrlstate">
                                <div class="imginner" v-for="item in imageUrl" :key="item.src">
                                    <img :src="item.src" class="avatar">
                                    <div class="avatars">
                                    <i @click="deletesImg(item.src)" style="font-size: 30px;margin-top: 75px;margin-left: 75px;color:#FFF;" class="el-icon-delete" ></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-form-item>
                <el-form-item label="" label-width="90px">
                    <el-button @click="comfirm">提交</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

        <el-dialog title="审核" :visible.sync="Auditor">
            <p style="font-size:18px;font-weight:bold;margin-bottom:10px;">类型：{{ AuditorForm.type == 1 ? '入账' : '出账' }}</p>
            <p style="font-size:18px;font-weight:bold;margin-bottom:10px;">金额：{{ AuditorForm.money }}￥</p>
            <p style="font-size:18px;font-weight:bold;margin-bottom:10px;">申请人：{{ AuditorForm.user }}</p>
            <p style="font-size:18px;font-weight:bold;margin-bottom:10px;">内容：{{ AuditorForm.content }}</p>
            <div class="img">
                <div class="imginner" v-for="item in imageUrl" :key="item.src">
                    <img :src="item.src" class="avatar">
                    <div class="avatars">
                        <i @click="big(item.src)" style="font-size: 30px;margin-top: 75px;margin-left: 75px;color:#FFF;" class="el-icon-zoom-in" ></i>
                    </div>
                </div>
            </div>
            <el-button @click="shenhe" style="margin-top:20px;">审核通过</el-button>
        </el-dialog>

        <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
    </div>
</template>

<script>
export default {
    data(){
        return {
            tableData:[],
            currentPage:0,//当前页
            total:0,//总数
            per_page:0,//每页多少条
            last_page:0,//总页数    
            dialogVisible:false,
            Form:{
              type:'',
              money :'',
              remarks:'',
              id:'',
            },
            imageUrl:[],
            imageUrlstate:false,
            // 审核
            ID:'',
            Auditor:false,
            dialogVisible:false,
            dialogImageUrl:'',
            AuditorForm:{
                type:'',
                money:'',
                user:'',
                content:''
            }
        }
    },
    methods:{
        //获取数据
        gettableData(){
            this.axios.get('/Finance/cost_lists').then(res => {
                this.tableData = res.data.data;
                this.currentPage = res.data.current_page;
                this.total = res.data.total;
                this.per_page = res.data.per_page;
                this.last_page = res.data.last_page;
            })
        },
        // 分页 
        handleCurrentChange(val) {
            const loading = this.$loading({
            lock: true,
            text: '拼命加载中',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
            });
            this.axios.post('/Finance/cost_lists',{
                page:val,
            }).then(res => {
                this.tableData = res.data.data;
                this.currentPage = res.data.current_page;
                this.total = res.data.total;
                this.per_page = res.data.per_page;
                this.last_page = res.data.last_page;
                loading.close();
            })  
        },
        // 新增按钮
        add(){
            this.dialogVisible = true;
            this.Form.money = '';
            this.Form.remarks = '';
            this.Form.type = '';
            this.Form.id = '';
        },
        // 修改按钮
        update(a){
            this.dialogVisible = true;
            this.Form.money = a.money;
            this.Form.remarks = a.remarks;
            this.Form.type = String(a.type);  
            this.Form.id = a.id;
            this.getimgUrl(a.id)
        },
        // 删除按钮
        deletes(a){ 
            this.axios.post('/Finance/cost_delete',{
                    id:a.id
                }).then(res => {
                    if(res.data.code == 2000){
                        this.open(res.data.msg,'success');
                        this.dialogVisible = false;
                        this.gettableData();
                    }else{
                        this.open(res.data.msg,'error');
                    } 
                })
        },
        // 审核按钮
        examine(a){
            this.Auditor = true;
            this.ID = a.id;
            this.getimgUrl(a.id);
            this.AuditorForm.type = a.type;
            this.AuditorForm.money = a.money;
            this.AuditorForm.user = a.user_name;
            this.AuditorForm.content = a.remarks;


        },
        // 放大
        big(a){
            this.dialogVisible=true;
            this.dialogImageUrl=a;
        },
        // 提交数据
        comfirm(){
            if(this.Form.id == ''){
                this.axios.post('/Finance/cost_add',{
                    money:this.Form.money,
                    remarks:this.Form.remarks,
                    type:this.Form.type,
                    src:this.imageUrl
                }).then(res => {
                    if(res.data.code == 2000){
                        this.open(res.data.msg,'success');
                        this.dialogVisible = false;
                        this.gettableData();
                    }else{
                        this.open(res.data.msg,'error');
                    } 
                })
            }else{
                this.axios.post('/Finance/cost_update',{
                    money:this.Form.money,
                    remarks:this.Form.remarks,
                    type:this.Form.type,
                    id:this.Form.id,
                    src:this.imageUrl
                }).then(res => {
                    if(res.data.code == 2000){
                        this.open(res.data.msg,'success');
                        this.dialogVisible = false;
                        this.gettableData();
                    }else{
                        this.open(res.data.msg,'error');
                    } 
                })
            }  
        },
        deletesImg(a){ 
            this.axios.post('/Finance/cost_delete',{
                id:a.id,
            }).then(res => {
                if(res.data.code == 2000){
                    this.open(res.data.msg,'success');
                    this.dialogVisible = false;
                    this.gettableData();
                }else{
                    this.open(res.data.msg,'error');
                } 
            })
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
        // 获取合同图片
        getimgUrl(a){
            this.axios.post('/File/file_select',{
              data_table:'cost',
              class:'temporary_file ',
              id:a,
            }).then(res => {
                if(res.data != null){
                  this.imageUrlstate = true;
                  this.imageUrl = res.data;
                }  
            })
        },
        shenhe(){
            this.axios.post('/Finance/cost_status',{
                id:this.ID,
            }).then(res => {
                if(res.data.code == 2000){
                    this.open(res.data.msg,'success');
                    this.dialogVisible = false;
                    this.gettableData();
                }else{
                    this.open(res.data.msg,'error');
                } 
            })
        },
        
        // 公用弹窗
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


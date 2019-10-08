<template>
    <div class="box">
        <el-button @click="add">新增</el-button>
        <el-date-picker v-model="time" type="daterange" value-format="timestamp" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="margin-left:30px"></el-date-picker>
        <el-select v-model="type_" clearable placeholder="类型"  style="width:100px;margin-left:20px;">
            <el-option label="入帐" value="1"></el-option>
            <el-option label="出账" value="2"></el-option>
        </el-select>
        <el-input v-model="user_name" style="width:100px;margin-left:20px;" placeholder="业务员"></el-input>
        <el-input v-model="dep_title" style="width:100px;margin-left:20px;" placeholder="部门"></el-input>
        <el-input v-model="class_" style="width:100px;margin-left:20px;" placeholder="类别"></el-input>
        <el-button @click="seach" style="margin-left:20px">搜索</el-button>

        <el-table :data="tableData" show-summary>
            <el-table-column label="时间" prop="add_time" width="160"></el-table-column>
            <el-table-column label="类型" width="80">
                <template slot-scope="scope">
                    <span>{{scope.row.type == 1 ? '入账' : '出账'}}</span>
                </template>
            </el-table-column>
            <el-table-column label="入账金额" prop="r_money"  width="80"></el-table-column>
            <el-table-column label="出账金额" prop="c_money"  width="80"></el-table-column>
            <el-table-column label="内容" prop="remarks"></el-table-column>
            <el-table-column label="申请人" width="150">
                <template slot-scope="scope">
                    <span>{{scope.row.dep_title}}/{{scope.row.user_name}}</span>
                </template>
            </el-table-column>
            <el-table-column label="状态" width="120">
                <template slot-scope="scope">
                    <template v-if="scope.row.status_txt == null">
                        <span v-if="scope.row.status == -3">等待财务审核</span>
                        <span v-if="scope.row.status == -2">等待巴长审核</span>
                        <span v-if="scope.row.status == -1">等待领导审核</span>
                        <span v-if="scope.row.status == 0">等待财务审核</span>
                        <span v-if="scope.row.status == 1">等待出纳付款</span>
                        <span v-if="scope.row.status == 2">结束</span>
                    </template>
                    <template v-else>
                        <span style="color:red">拒绝:{{scope.row.status_txt}}</span>
                    </template>
                    
                </template>
            </el-table-column>
            <el-table-column label="操作" width="220">
                <template slot-scope="scope">
                        <el-button size="mini"  v-if="scope.row.status < -2" type="primary" @click="update(scope.row)">修改</el-button>
                        <el-button size="mini" v-if="scope.row.status < -1" type="danger" @click="deletes(scope.row)">删除</el-button>
                        <el-button size="mini" v-if="scope.row.status < 2" type="success" @click="examine(scope.row)">审核</el-button>
                </template> 
            </el-table-column>
        </el-table>
        

        <el-dialog title="新增和修改" :visible.sync="dialogVisible">
            <el-form :model="Form">
                <el-form-item label="类型" label-width="90px">
                    <el-radio v-model="Form.type" label="1">入帐</el-radio>
                    <el-radio v-model="Form.type" label="2">出账</el-radio>
                </el-form-item>
                <el-form-item label="类别" label-width="90px">
                    <!-- <el-input v-model="Form.class" style="width:217px"></el-input> -->
                    <el-select v-model="Form.class" clearable filterable placeholder="类型" allow-create default-first-option  style="width:217px;">
                        <el-option v-for="item in options" :key="item.label" :label="item.label" :value="item.value"></el-option>
                    </el-select>
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

        <el-dialog title="审核" :visible.sync="Auditor" width="70%" style="overflow: hidden;">
            <div style="float: left;width:50%">
                <p style="font-size:18px;font-weight:bold;margin-bottom:10px;">类型：{{ AuditorForm.type == 1 ? '入账' : '出账' }}</p>
                <p style="font-size:18px;font-weight:bold;margin-bottom:10px;">金额：{{ AuditorForm.money }}￥</p>
                <p style="font-size:18px;font-weight:bold;margin-bottom:10px;">申请人：{{ AuditorForm.user }}</p>
                <p style="font-size:18px;font-weight:bold;margin-bottom:10px;">内容：{{ AuditorForm.content }}</p>
            </div>
            <el-input v-if="chuna1 == false" type="textarea" v-model="remarks" placeholder="拒绝备注" style="width:70%"></el-input>
            <chuna v-if="chuna1" @func="jiezi" :a="dddd" style="float: left;width:50%"></chuna>
            <div style="clear:both"></div>
            <div class="img" v-if="chuna">
                <div class="imginner" v-for="item in imageUrl" :key="item.src">
                    <img :src="item.src" class="avatar">
                    <div class="avatars">
                        <i @click="big(item.src)" style="font-size: 30px;margin-top: 75px;margin-left: 75px;color:#FFF;" class="el-icon-zoom-in" ></i>
                    </div>
                </div>
            </div>
            <div class="contract" v-if="chuna1">
                        <div class="contractInner">
                            <div class="contractInnerLeft">
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
                                    <i @click="deletesImg(item.src)" style="font-size: 30px;margin-top: 75px;margin-left: 40px;color:#FFF;float: left;" class="el-icon-delete" ></i>
                                    <i @click="big(item.src)" style="font-size: 30px;margin-top: 75px;color:#FFF;float: right;margin-right:40px" class="el-icon-zoom-in" ></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>



            <el-button @click="shenhe" style="margin-top:20px;">审核通过</el-button>
            <el-button @click="jujue" style="margin-top:20px;" v-if="chuna1 == false">审核拒绝</el-button>
        </el-dialog>

        <el-dialog :visible.sync="dialogVisibleImg">
            <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
    </div>
</template>

<script>
import chuna from "@/components/chuna";
export default {
    components:{
       chuna, 
    },
    data(){
        return {
            time:null,
            starttime:'',
            type_:'',
            class_:'',
            user_name:'',
            dep_title:'',
            tableData:[], 
            dialogVisible:false,
            Form:{
              type:'',
              class:'',
              money :'',
              remarks:'',
              id:'',
            },
            options:[
                        {   
                            value: '销售费用办公费',
                            label: '销售费用办公费',
                        },
                        {
                            value: '销售费用业务招待费',
                            label: '销售费用业务招待费',
                        },
                        {
                            value: '销售费用差旅费',
                            label: '销售费用差旅费',
                        },
                        {
                            value: '销售费用通讯费',
                            label: '销售费用通讯费',
                        },
                        {
                            
                            value: '销售费用福利费',
                            label: '销售费用福利费',
                        },
                        {
                            
                            value: '销售费用招标费用',
                            label: '销售费用招标费用',
                        },
                        {
                            
                            value: '销售费用销售费用',
                            label: '销售费用销售费用',
                        },
                        {
                            
                            value: '销售费用公积金',
                            label: '销售费用公积金',
                        },
                        {
                            value: '销售费用社保费',
                            label: '销售费用社保费',
                        },
                        {
                            value: '销售费用售后费',
                            label: '销售费用售后费',
                        },
                        {
                            value: '销售费用工资',
                            label: '销售费用工资',
                        },
                        {
                            value: '销售费用餐费',
                            label: '销售费用餐费',
                        },
                        {
                            value: '销售费用激励费',
                            label: '销售费用激励费',
                        },
                        {
                            value: '销售费用快递费',
                            label: '销售费用快递费',
                        },
                        {
                            value: '销售费用运费',
                            label: '销售费用运费',
                        },
                        {
                            value: '销售费用节日客养费',
                            label: '销售费用节日客养费',
                        },
                        {
                            value: '销售费用全勤奖',
                            label: '销售费用全勤奖',
                        },
                        {
                            value: '销售费用生日礼金',
                            label: '销售费用生日礼金',
                        },
                        {
                            value: '销售费用年终奖',
                            label: '销售费用年终奖',
                        },
                  
                        {
                            value: '管理费用办公费',
                            label: '管理费用办公费',
                        },
                        {
                            value: '管理费用房租',
                            label: '管理费用房租',
                        },
                        {
                            value: '管理费用物业管理费',
                            label: '管理费用物业管理费',
                        },
                        {
                            value: '管理费用水电费',
                            label: '管理费用水电费',
                        },
                        {
                            value: '管理费用业务招待费',
                            label: '管理费用业务招待费',
                        },
                        {
                            value: '管理费用差旅费',
                            label: '管理费用差旅费',
                        },
                        {
                            value: '管理费用通讯费',
                            label: '管理费用通讯费',
                        },

                        {
                            value: '管理费用福利费',
                            label: '管理费用福利费',
                        },
                        {
                            value: '管理费用招聘费',
                            label: '管理费用招聘费',
                        },
                        {
                            value: '管理费用版权费',
                            label: '管理费用版权费',
                        },
                        {
                            value: '管理费用汽车费用',
                            label: '管理费用汽车费用',
                        },
                        {
                            value: '管理费用公积金',
                            label: '管理费用公积金',
                        },
                        {
                            value: '管理费用管理咨询费',
                            label: '管理费用管理咨询费',
                        },
                        {
                            value: '管理费用培训费',
                            label: '管理费用培训费',
                        },
                        {
                            value: '管理费用样品费',
                            label: '管理费用样品费',
                        },
                        {
                            value: '管理费用卫生费',
                            label: '管理费用卫生费',
                        },
                        {
                            value: '管理费用律师费',
                            label: '管理费用律师费',
                        },
                        {
                            value: '管理费用服务器费用',
                            label: '管理费用服务器费用',
                        },
                        {
                            value: '管理费用激励费',
                            label: '管理费用激励费',
                        },
                        {
                            value: '管理费用工资',
                            label: '管理费用工资',
                        },
                        {
                            value: '管理费用全勤奖',
                            label: '管理费用全勤奖',
                        },
                        {
                            value: '管理费用餐费',
                            label: '管理费用餐费',
                        },
                        {
                            value: '管理费用快递费',
                            label: '管理费用快递费',
                        },
                        {
                            value: '管理费用生日礼金',
                            label: '管理费用生日礼金',
                        },
                        {
                            value: '管理费用外联费',
                            label: '管理费用外联费',
                        },
                        {
                            value: '管理费用年终奖',
                            label: '管理费用年终奖',
                        },
                        {
                            value: '管理费用社保费',
                            label: '管理费用社保费',
                        },
                        {
                            value: '管理费用短信服务费',
                            label: '管理费用短信服务费',
                        },
                        {
                            value: '管理费用利息',
                            label: '管理费用利息',
                        },
                        {
                            value: '管理费用手续费',
                            label: '管理费用手续费',
                        },
                        {
                            value: '物流费',
                            label: '物流费',
                        },
                        {
                            value: '退款',
                            label: '退款',
                        },
                        {
                            value: '其他',
                            label: '其他',
                        },
            ],
            // 图片上传
            imgId:0,
            imageUrl:[],
            imageUrlstate:false,
            // 审核
            remarks:'',
            ID:'',
            Auditor:false,
            dialogVisibleImg:false,
            dialogImageUrl:'',
            AuditorForm:{
                type:'',
                money:'',
                user:'',
                content:''
            },
            chuna:true,
            chuna1:false,
            Cstatus:'',
            zichuan:[],
            dddd:'',
        }
    },
    methods:{
        //获取数据
        gettableData(a){
            this.axios.post('/Finance/cost_lists',{
                start_time:this.starttime,
                end_time:this.starttime
            }).then(res => {
                this.tableData = res.data.cost
            })
        },
        seach(){
            let a,b;
            if(this.time == null){
                a='';
                b='';
            }else{
                a=this.time[0]/1000;
                b=this.time[1]/1000;
            }
             this.axios.post('/Finance/cost_lists',{
                  start_time:a,
                  end_time:b,
                  class:this.class_,
                  type:this.type_,
                  user_name:this.user_name,
                  dep_title:this.dep_title,
             }).then(res => {
                this.tableData = res.data.cost
            }) 
        },
        // 新增按钮
        add(){
            this.dialogVisible = true;
            this.Form.money = '';
            this.Form.remarks = '';
            this.Form.type = '';
            this.Form.id = '';
            this.imgId = 0;
            this.getimgUrl(0,0,'add')
        },
        // 修改按钮
        update(a){
            this.dialogVisible = true;
            this.Form.money = a.money;
            this.Form.remarks = a.remarks;
            this.Form.type = String(a.type);  
            this.Form.id = a.id;
            this.imgId = a.id;
            this.getimgUrl(a.id,0,'add')
        },
        // 删除按钮
        deletes(a){ 
            this.axios.post('/Finance/cost_delete',{
                    id:a.id
                }).then(res => {
                    if(res.data.code == 2000){
                        this.open(res.data.msg,'success');
                        this.dialogVisible = false;
                        this.gettableData(starttime);
                    }else{
                        this.open(res.data.msg,'error');
                    } 
                })
        },
        // 审核按钮
        examine(a){
            this.Auditor = true;
            this.ID = a.id;
            // this.getimgUrl(a.id);
            this.AuditorForm.type = a.type;
            this.AuditorForm.money = a.money;
            this.AuditorForm.user = a.user_name;
            this.AuditorForm.content = a.remarks;
            if(a.status == 1){
                this.chuna=false;
                this.chuna1=true;
                this.Cstatus = a.status;
                this.getimgUrl(a.id,0,'add');
            }else{
                this.Cstatus = '';
                this.getimgUrl(a.id,1,'chakan');
            }
            this.dddd = a.id;
        },
        // 放大
        big(a){
            this.dialogVisibleImg=true;
            this.dialogImageUrl=a;
        },
        // 提交数据
        comfirm(){
            let src = [];
            for(let z = 0; z<this.imageUrl.length;z++){
                src.push(this.imageUrl[z].src);
            }
            if(this.Form.id == ''){
                if(this.Form.type == ''){
                   this.open('类型必须选','error');     
                }else{
                    this.axios.post('/Finance/cost_add',{
                        money:this.Form.money,
                        remarks:this.Form.remarks,
                        type:this.Form.type,
                        class:this.Form.class,
                        src:src
                    }).then(res => {
                        if(res.data.code == 2000){
                            this.open(res.data.msg,'success');
                            this.dialogVisible = false;
                            this.gettableData(this.starttime);
                        }else{
                            this.open(res.data.msg,'error');
                        } 
                    })
                }
            }else{
                if(this.Form.type == ''){
                   this.open('类型必须选','error');     
                }else{
                    this.axios.post('/Finance/cost_update',{
                        money:this.Form.money,
                        remarks:this.Form.remarks,
                        type:this.Form.type,
                        class:this.Form.class,
                        id:this.Form.id,
                        src:src
                    }).then(res => {
                        if(res.data.code == 2000){
                            this.open(res.data.msg,'success');
                            this.dialogVisible = false;
                            this.gettableData(this.starttime);
                        }else{
                            this.open(res.data.msg,'error');
                        } 
                    })
                }
                
            }  
        },

        // 新增费用 上传图片
        // 删除图片
        deletesImg(a){ 
            this.axios.post('/File/file_delete',{
                class:'temporary_file',
                src:a
            }).then(res => {
                if(res.data.code == 2000){
                    this.open(res.data.msg,'success');
                    this.getimgUrl(this.imgId,0,'add')
                }else{
                    this.open(res.data.msg,'error');
                    
                } 
            })
        },
        handleAvatarSuccess() {
            this.getimgUrl(0,0,'add');
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
            const formData = new FormData()
            formData.append('file',file.file)
            formData.append('id',this.imgId)
            formData.append('class','temporary_file')
            formData.append('data_table','cost')
            this.axios.post(`/File/file_add`,formData).then(res => res.data)
            .then(data => {
                if(data.code === 2000){
                  let a = {src:data.src}
                  this.imageUrl.push(a);
                  this.imageUrlstate=true;
                }
            })  
        },
        // 获取合同图片
        getimgUrl(a,b,c){
            this.axios.post('/File/file_select',{
              data_table:'cost',
              class:'temporary_file',
              control:c,
              id:a,
              status:b
            }).then(res => {
                if(res.data != null){
                  this.imageUrlstate = true;
                  this.imageUrl = res.data;
                }  
            })
        },
        // 审核提交
        shenhe(){
            if(this.Cstatus == 1){
                if(this.zichuan.length == 0){
                     this.open('选择付款账号','error');
                }else{
                    let img = [];
                    for(let i =0;i<this.imageUrl.length;i++){
                        img.push(this.imageUrl[i].src)
                    }
                    this.axios.post('/Finance/cost_status',{
                        id:this.ID,
                        src:img,
                        paye:this.zichuan,
                    }).then(res => {
                        if(res.data.code == 2000){
                            this.open(res.data.msg,'success');
                            this.gettableData(this.starttime);
                            this.Auditor = false;
                            
                        }else{
                            this.open(res.data.msg,'error');
                        } 
                    })
                }
            }else{
                this.axios.post('/Finance/cost_status',{
                    id:this.ID,
                }).then(res => {
                    if(res.data.code == 2000){
                        this.open(res.data.msg,'success');
                        this.gettableData(this.starttime);
                        this.Auditor = false;
                    }else{
                        this.open(res.data.msg,'error');
                    } 
                })
            }
        },
        jujue(){
            if(this.remark == ''){
                this.open('填写拒绝理由','error');
            }else{
                this.axios.post('/Finance/cost_status',{
                    id:this.ID,
                    status_txt:this.remarks,
                    action:'jj'
                }).then(res => {
                    if(res.data.code == 2000){
                        this.open(res.data.msg,'success');
                        this.gettableData(this.starttime);
                        this.Auditor = false;   
                    }else{
                        this.open(res.data.msg,'error');
                    } 
                }) 
            } 
        },
        // 接收值
        jiezi(data){
           this.zichuan = data;
           console.log(data); 
        },
        
        // 公用弹窗
        open(a,b){
            this.$message({
            message: a,
            type: b
            });
        },
        // 默认时间
        change(t){
            if(t<10){
                return "0"+t;
            }else{
                return t;
            }
        },
        getTimestamp (mytime){
            let dateTmp = mytime.replace(/-/g,'/')
            return Date.parse(dateTmp)
        },
    },
    created(){
        let d=new Date();
        let year=d.getFullYear();
        let month=this.change(d.getMonth()+1);
        let day=this.change(d.getDate());
        let starttime1 = year+'-'+month+'-'+day;
        this.starttime = this.getTimestamp(starttime1)/1000
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


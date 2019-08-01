<template>
    <div class="box">
         <div class="head_box">
            <label>筛选：</label>
             <el-select v-model="channel" placeholder="请选择渠道">
                <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.lable"
                :value="item.value">
                </el-option>
            </el-select>
            <el-select v-model="company" placeholder="请选择公司" style="margin-left:15px;">
                <el-option
                v-for="item in options1"
                :key="item.value"
                :label="item.lable"
                :value="item.value">
                </el-option>
            </el-select>
             <el-date-picker
                v-model="time1"
                type="date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                placeholder="开始时间"
                style="margin-left:15px;">
            </el-date-picker>
            <el-date-picker
                v-model="time2"
                type="date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                placeholder="结束时间"
                style="margin-left:15px;">
            </el-date-picker>
            <el-button type="primary" @click="seach"  style="margin-left:20px;">搜索</el-button>
            <el-button type="primary" @click="add"  style="margin-left:20px;">增加</el-button>
        </div>
        <div class="content_box">
            <el-table :data="tableData">
                <el-table-column label="汇款时间" prop="payment_time" width="100px">
                    <template slot-scope="scope">
                        {{ scope.row.payment_time.substr(0,10) }}
                    </template>
                </el-table-column>
                <el-table-column label="接收账号" width="280px">
                    <template slot-scope="scope">
                        <span>{{scope.row.receiving_name}}:{{scope.row.receiving_account}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="汇款公司" prop="company_name"></el-table-column>
                <el-table-column label="业务员" prop="confirm_user_name"></el-table-column>
                <el-table-column label="金额" prop="payment_amount"></el-table-column>
                <el-table-column label="备注" prop="remarks"></el-table-column>
                <el-table-column label="录入人" prop="user_name"></el-table-column>
                <el-table-column label="操作" width="150px">
                    <template slot-scope="scope">
                        <el-button type="primary" v-if="scope.row.status == 0" size="mini" @click="edit(scope.row)">修改</el-button>
                        <el-button type="warning" v-if="scope.row.status == 0" size="mini" @click="deteles(scope.row)">删除</el-button>
                        <span v-if="scope.row.status !== 0">不可操作</span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="block" style="margin-top: 10px;">
            <el-pagination
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-size="per_page"
                layout="total, prev, pager, next"
                :total="total">
            </el-pagination>
        </div>

        <el-dialog title="录入款项信息" :visible.sync="dialogInfo">
            <el-form :model="InfoForm" ref="InfoForm" inline>
                <el-form-item label="公司" label-width="90px" prop="company">
                    <el-select v-model="InfoForm.company" filterable placeholder="请选择公司" style="width:217px;">
                        <el-option
                        v-for="item in optionsCompany"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="绑定业务员" label-width="90px" prop="confirm_user_id">
                    <el-select placeholder="请选择" filterable  style="width:217px;"  v-model="InfoForm.confirm_user_id">
                        <el-option label="空" :value="zero"></el-option>
                        <el-option
                        v-for="item in user"
                        :key="item.user_id"
                        :label="item.name"
                        :value="item.user_id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="渠道" label-width="90px" prop="source">
                    <el-radio v-model="InfoForm.source" label="1">微信</el-radio>
                    <el-radio v-model="InfoForm.source" label="2">支付宝</el-radio>
                    <el-radio v-model="InfoForm.source" label="3">银行卡</el-radio>
                </el-form-item>
                <el-form-item label="接收账号" label-width="90px" prop="payee_id">
                    <el-select placeholder="请选择接收账号" v-model="InfoForm.payee_id" style="width:217px;">
                        <el-option
                        v-for="item in optionsK"
                        :key="item.id"
                        :label="item.receiving_name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="汇款日期" label-width="90px" prop="payment_time">
                    <el-date-picker
                        v-model="InfoForm.payment_time"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="请选择汇款日期"
                        style="width:217px;">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="金额" label-width="90px" prop="payment_amount">
                    <el-input v-model="InfoForm.payment_amount"  style="width:217px;"></el-input>
                </el-form-item>
                <br>
                <el-form-item label="备注" label-width="90px" prop="company">
                    <el-input type="textarea" style="width:434px;" v-model="InfoForm.remarks"></el-input>
                </el-form-item>
                <br>
                <el-form-item label="上传图片" label-width="90px">
                    <el-upload
                        class="avatar-uploader"
                        action="/File/receivables_file"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload">
                        <img v-if="InfoForm.imageUrl" :src="InfoForm.imageUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogInfo = false">取 消</el-button>
                <el-button type="primary" @click="addSend">提 交</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    

    data(){
        return{
            channel:'',
            company:'',
            time1:'',
            time2:'',
            options:[
                {
                    value:'1',
                    lable:'微信'
                },
                {
                    value:'2',
                    lable:'支付宝'
                },
                {
                    value:'3',
                    lable:'银行卡'
                }
            ],
            options1:[
                {
                    value:'1',
                    lable:'微信'
                },
                {
                    value:'2',
                    lable:'支付宝'
                },
                {
                    value:'3',
                    lable:'银行卡'
                }
            ],
            zero:0,
            tableData:[],// 数据
            optionsPayee:[], // 付款账号
            user:[],// kovi 员工
            optionsK:[], // kovi 账户
            optionsCompany:[], // 付款公司
            dialogInfo:false, // 添加弹窗
            InfoForm:{
                company:'',
                remarks:'',
                imageUrl:'',
                source:'',
                confirm_user_id: '',
                payee_id:'',
                payment_time: '',
                payment_amount : '',
                id:'',
            },// 弹窗表单   
            currentPage:0,//当前页
            total:0,//总数
            per_page:0,//每页多少条
            last_page:0,//总页数
           
        }
    },
    methods:{
        // 搜索按钮
        seach(){

        },
        change(t){
                if(t<10){
                    return "0"+t;
                }else{
                    return t;
                }
        },
        // 添加按钮
        add(){
            this.dialogInfo = true; 
            this.InfoForm.company='';
            this.InfoForm.remarks='';
            this.InfoForm.imageUrl='';
            this.InfoForm.source='';
            this.InfoForm.confirm_user_id= '';
            this.InfoForm.payee_id='';
            
            this.InfoForm.payment_amount = '';
            this.InfoForm.id='';

            let d=new Date();
            let year=d.getFullYear();
            let month=this.change(d.getMonth()+1);
            let day=this.change(d.getDate());
            
            this.InfoForm.payment_time = year+'-'+month+'-'+day;
        },
        // 删除
        deteles(a){
            this.axios.post('/Finance/finance_receivables_delete',{
             id:a.id
            }).then(res => {
                 if(res.data.code == 2000){
                    this.gettable();
                    this.open(res.data.msg,'success');
                }else{
                    this.open(res.data.msg,'error');
                }
            })  
        },

        // 修改按钮
        edit(a){
            this.dialogInfo = true;   
            this.InfoForm.company = a.company_id;
            this.InfoForm.remarks = a.remarks;
            this.InfoForm.imageUrl = a.img;
            this.InfoForm.source = a.source;
            this.InfoForm.confirm_user_id = a.confirm_user_id;
            this.InfoForm.payee_id = a.payee_id;
            this.InfoForm.payment_time = a.payment_time;
            this.InfoForm.payment_amount = a.payment_amount;
            this.InfoForm.id = a.id;
        },
        // 提交信息
        addSend(){
            if(this.InfoForm.id  ==  ''){
                if(this.InfoForm.source == '' || this.InfoForm.payment_amount == '' || this.InfoForm.payee_id ==''){
                    this.open('填写渠道 接收账号 金额！！！','error')
                }else{
                    this.axios.post('/Finance/finance_receivables_add',{
                        source:this.InfoForm.source,
                        confirm_user_id:this.InfoForm.confirm_user_id,  
                        payee_id:this.InfoForm.payee_id, 
                        payment_time:this.InfoForm.payment_time,
                        payment_amount:this.InfoForm.payment_amount,
                        img:this.InfoForm.imageUrl,
                        remarks:this.InfoForm.remarks,
                        company_id:this.InfoForm.company,
                    }).then(res => {
                        if(res.data.code == 2000){
                            this.gettable();
                            this.dialogInfo = false;
                            this.open(res.data.msg,'success');
                        }else{
                            this.open(res.data.msg,'error');
                        }
                    })
                }      
            }else{
                this.axios.post('/Finance/finance_receivables_update',{
                    source:this.InfoForm.source,
                    confirm_user_id:this.InfoForm.confirm_user_id,  
                    payee_id:this.InfoForm.payee_id, 
                    payment_time:this.InfoForm.payment_time,
                    payment_amount:this.InfoForm.payment_amount,
                    img:this.InfoForm.imageUrl,
                    remarks:this.InfoForm.remarks,
                    company_id:this.InfoForm.company,
                    id:this.InfoForm.id,
                }).then(res => {
                    if(res.data.code == 2000){
                        this.gettable();
                        this.dialogInfo = false;
                        this.open(res.data.msg,'success');
                    }else{
                        this.open(res.data.msg,'error');
                    }
                })
            }
            
        },
        // 获取列表数据
        gettable(){
            this.axios.get('/Finance/finance_receivables_lists').then(res => {
                this.optionsCompany = res.data.company;
                this.optionsK = res.data.payee;
                this.user = res.data.user;
                this.tableData = res.data.receivables.data;
                this.currentPage = res.data.receivables.current_page;
                this.total = res.data.receivables.total;
                this.per_page = res.data.receivables.per_page;
                this.last_page = res.data.receivables.last_page;
            })
        },

        // 分页切换
        handleCurrentChange(val) {
            const loading = this.$loading({
                lock: true,
                text: '拼命加载中',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            this.axios.post('/Finance/finance_receivables_lists',{
                page:val,
            }).then(res => {
                this.tableData = res.data.receivables.data;
                this.currentPage = res.data.receivables.current_page;
                loading.close();
            })  
        },
       
        // 上传图片
        handleAvatarSuccess(res, file) {
            this.InfoForm.imageUrl = res.src;
        },
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        },
        // 弹窗
        open(a,b){
            this.$message({
                showClose: true,
                message: a,
                type: b
            });
        }
    },
    created(){
        this.gettable();
    },
    watch:{
        $route(to){
            this.gettable();
        }
    }
}
</script>

<style lang="less" scoped>
.content_box{
    margin-top: 20px;
}
.avatar-uploader,.el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
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
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>

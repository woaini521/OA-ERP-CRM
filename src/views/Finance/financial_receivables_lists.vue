<template>
    <div class="box">
         <div class="head_box">
            <label>筛选：</label>
            <el-date-picker v-model="time1" type="daterange" range-separator="至" start-placeholder="开始日期" value-format="timestamp" end-placeholder="结束日期">
            </el-date-picker>
            
            <el-select v-model="status" placeholder="请选择状态" style="margin-left:15px;width:130px">
                <el-option
                v-for="item in optionsStatus"
                :key="item.id"
                :label="item.status_txt"
                :value="item.status">
                </el-option>
            </el-select>
            <el-input v-model="name" placeholder="人员" style="margin-left:15px;width:130px"></el-input>
            <el-input v-model="dep" placeholder="部门" style="margin-left:15px;width:130px"></el-input>
            <el-input v-model="money" placeholder="金额" style="margin-left:15px;width:130px"></el-input>
            <el-button @click="seach"  style="margin-left:20px;">搜索</el-button>
            <el-button type="primary" @click="add"  style="margin-left:20px;">增加</el-button>
        </div>
        <div class="content_box">
            <el-table :data="tableData" show-summary>
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-table :data="props.row.receivables_customer_order">
                            <el-table-column label="订单编号" prop="customer_order_id"></el-table-column>
                            <el-table-column label="认款时间" prop="add_time"></el-table-column>
                            <el-table-column label="客户" prop="customer_name"></el-table-column>
                            <el-table-column label="认款金额" prop="money"></el-table-column>
                            <el-table-column label="销售金额" prop="total_price"></el-table-column>
                            <el-table-column label="已认款金额" prop="receivables_amount"></el-table-column>
                            <el-table-column label="销售员" prop="customer_name">
                                <template slot-scope="scope">
                                    <span>{{scope.row.dep_title}}/{{scope.row.user_name}}</span>
                                </template>
                            </el-table-column>
                        </el-table>
                    </template>
                </el-table-column>
                <el-table-column type="index" width="55"></el-table-column>
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
                <el-table-column label="汇款公司">
                    <template slot-scope="scope">
                        <span>{{ scope.row.company_name }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="业务员">
                    <template slot-scope="scope">
                        <span>{{scope.row.dep_title}}/{{scope.row.confirm_user_name}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="金额" prop="payment_amount" sortable></el-table-column>
                <el-table-column label="备注" prop="remarks"></el-table-column>
                <el-table-column label="录入人" prop="user_name"></el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                          <span v-if="scope.row.status == 0">待认款</span>  
                          <span v-if="scope.row.status == 3">认款中</span>  
                          <span v-if="scope.row.status == 5">认款完</span>  
                          <span v-if="scope.row.status == 9">完成</span>  
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="150px">
                    <template slot-scope="scope">
                        <el-button type="primary" v-if="scope.row.status <= 3" size="mini" @click="edit(scope.row)">修改</el-button>
                        <el-button type="warning" v-if="scope.row.status == 0" size="mini" @click="deteles(scope.row)">删除</el-button>
                        <el-button type="danger" v-if="scope.row.status == 5 || scope.row.status == 3" size="mini" @click="xiaoK(scope.row)">消款</el-button>
                    </template>
                </el-table-column>
            </el-table>
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

        <el-dialog title="消款" :visible.sync="dialogXiaoK">
            <el-dialog
            width="30%"
            title="二次消款"
            :visible.sync="dialogXiaoKEr"
            append-to-body>
                <el-form :model="dialogXiaoKErForm">
                    <el-form-item label="订单编号" label-width="90px">
                        <el-input v-model="dialogXiaoKErForm.bian"></el-input>
                    </el-form-item>
                    <el-form-item label="备注" label-width="90px">
                        <el-input type="textarea" v-model="dialogXiaoKErForm.remarks"></el-input>
                    </el-form-item>
                    <el-form-item label=" " label-width="90px">
                        <el-button @click="XiaoKEr">确认</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
            <p>汇款时间：{{ dialogXiaoKInfo.payment_time }}</p>
            <p>接收账号：{{dialogXiaoKInfo.receiving_name}}:{{dialogXiaoKInfo.receiving_account}}</p>
            <p>汇款公司：{{dialogXiaoKInfo.company_name}}</p>
            <p>汇款金额：{{dialogXiaoKInfo.payment_amount}}</p>
            <p>业务员： {{dialogXiaoKInfo.dep_title}}/{{dialogXiaoKInfo.confirm_user_name}}</p>
            <p>备注：{{dialogXiaoKInfo.remarks}}</p>
            <div slot="footer" class="dialog-footer">
                <el-button @click="XiaoKyi">确认消款</el-button>
                <el-button type="primary" @click="dialogXiaoKEr = true">二次消款</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    

    data(){
        return{
            channel:'',
            status:'',
            time1:null,
            name:'',
            dep:'',
            money:'',
            starttime:'',
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
            optionsStatus:[],
            // 消款
            dialogXiaoKId:'',
            dialogXiaoK:false,
            dialogXiaoKInfo:'',
            dialogXiaoKEr:false,
            dialogXiaoKErForm:{
                bian:'',
                remarks:'',
            }
        }
    },
    methods:{
        // 搜索按钮
        seach(){
            let a,b;
            if(this.time1 == null){
                a='';
                b='';
            }else{
                a=this.time1[0]/1000;
                b=this.time1[1]/1000; 
            }
            this.axios.post('/Finance/finance_receivables_lists',{
                start_time:a,
                end_time:b,
                status:this.status,
                confirm_user_name:this.name,
                dep_title:this.dep,
                payment_amount:this.money,
            }).then(res => {
                this.optionsCompany = res.data.company;
                this.optionsK = res.data.payee;
                this.user = res.data.user;
                this.tableData = res.data.receivables
            })
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
            this.axios.post('/Finance/finance_receivables_lists',{
                start_time:this.starttime,
                end_time:this.starttime,
            }).then(res => {
                this.optionsCompany = res.data.company;
                this.optionsK = res.data.payee;
                this.user = res.data.user;
                this.tableData = res.data.receivables
                this.optionsStatus = res.data.receivables_status
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
        // 消款
        xiaoK(a){
            this.dialogXiaoKInfo = a;
            this.dialogXiaoKId = a.id;
            this.dialogXiaoK = true;
        },
        XiaoKyi(){
            this.axios.post('/Finance/finance_receivables_status',{
             id:this.dialogXiaoKId
            }).then(res => {
                 if(res.data.code == 2000){
                    this.gettable();
                    this.open(res.data.msg,'success');
                    this.dialogXiaoK = false;
                }else{
                    this.open(res.data.msg,'error');
                }
            })  
        },
        XiaoKEr(){
            if(this.dialogXiaoKErForm.bian == ''){
                this.open('填写订单编号','error')
            }else{
                this.axios.post('/Finance/finance_receivables_status',{
                    id:this.dialogXiaoKId,
                    customer_order_id:this.dialogXiaoKErForm.bian,
                    remarks:this.dialogXiaoKErForm.remarks
                }).then(res => {
                    if(res.data.code == 2000){
                        this.gettable();
                        this.open(res.data.msg,'success');
                        this.dialogXiaoKEr = false;
                        this.dialogXiaoK = false;
                        this.dialogXiaoKErForm.bian = '';   
                        this.dialogXiaoKErForm.remarks = '';  
                    }else{
                        this.open(res.data.msg,'error');
                    }
                })
            } 
        },
        // 弹窗
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

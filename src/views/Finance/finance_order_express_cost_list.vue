<template>
    <div class="box">
        <div class="head_box">
            <el-select v-model="kuan" style="width:105px;">
                <el-option label="下单时间" value="1"></el-option>
                <el-option label="审核时间" value="2"></el-option>
            </el-select>
            <el-date-picker v-model="time" type="daterange" value-format="timestamp" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="margin-left:10px"></el-date-picker>
            <el-input placeholder="订单编号" v-model="seach_order" style="width:120px;margin-left:10px"></el-input>
            <el-input placeholder="客户姓名" v-model="seach_name" style="width:120px;margin-left:10px"></el-input>
            <el-input placeholder="快递名称" v-model="seach" style="width:120px;margin-left:10px"></el-input>
            <el-button type="primary" @click="seachName"  style="margin-left:20px;">搜索</el-button>
            <el-button type="primary" @click="hebing" v-if="Group == true" style="margin-left:20px;">合并支付</el-button>
            <br>
            <el-select v-model="type_" clearable placeholder="类型"  style="width:130px;margin-top:10px;">
                <el-option label="等待财务审核" value="0"></el-option>
                <el-option label="等待财务付款" value="1"></el-option>
                <el-option label="审核通过" value="2"></el-option>
            </el-select>
            <el-select v-model="action_user_name" clearable placeholder="审核人"  style="width:130px;margin-left:10px;">
                <el-option v-for="item in auditor_group" :key="item.add_time" :label="item.user_name" :value="item.user_name"></el-option>
            </el-select>
            
        </div>

        <div class="content_box">
            <el-table :data="tabledata" ref="multipleTable" show-summary tooltip-effect="dark" @selection-change="handleSelectionChange">
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <el-table :data="scope.row.advance_charge">
                            <el-table-column label="提交时间" width="160px">
                                <template slot-scope="scope">
                                    <span>{{ scope.row.order_dep_title}}/{{ scope.row.order_user_name}}</span><br>
                                    <span>{{ scope.row.add_time}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="编号" width="70px">
                                <template slot-scope="scope">
                                    <span>{{scope.row.customer_order_id}}</span>
                                </template>
                            </el-table-column> 
                            <el-table-column label="类型" width="50px">
                                <template slot-scope="scope">
                                    <span v-if="scope.row.class == 0">订单</span>
                                    <span v-if="scope.row.class == 1">运费</span>
                                    <span v-if="scope.row.class == 2">版费</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="供应商">
                                <template slot-scope="scope">
                                    <span>{{scope.row.supplier_name}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="结算方式" width="80px">
                                <template slot-scope="scope">
                                    <span>{{ scope.row.settlement == 0 ? '现结' : '月结'}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="金额" prop="prepayment"></el-table-column>
                            
                            <el-table-column label="税" prop="invoice"  width="70px">
                                <template slot-scope="scope">
                                    <span v-if="scope.row.invoice == 0">不含税</span>
                                    <span v-if="scope.row.invoice == 1">含税</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="采购" prop="user_name" width="80px"></el-table-column>
                            <el-table-column label="状态" width="120px">
                                <template slot-scope="scope">
                                    <span>{{ stata[scope.row.status] }}</span><br>
                                    <el-popover
                                    placement="right"
                                    trigger="click">
                                    <el-table :data="scope.row.auditor">
                                        <el-table-column width="160" property="add_time" label="日期"></el-table-column>
                                        <el-table-column width="160" property="remarks" label="状态"></el-table-column>
                                        <el-table-column width="100" property="user_name" label="审核人"></el-table-column>
                                    </el-table>
                                    <el-button slot="reference" type="text">查看</el-button>
                                    </el-popover>
                                </template>
                            </el-table-column>
                            <el-table-column label="备注">
                                <template slot-scope="scope">
                                    <span>{{scope.row.remarks}}</span>
                                </template>
                            </el-table-column>
                        </el-table>
                    </template>
                </el-table-column>
                <el-table-column label="编号"  width="70">
                    <template slot-scope="scope">
                        <span>{{ scope.row.customer_order_id }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="时间" prop="sales_time" width="100"></el-table-column>
                <el-table-column label="客户" prop="customer_name" width="70"></el-table-column>
                <el-table-column label="物流公司" width="130">
                     <template slot-scope="scope">
                        <span>{{ scope.row.express_name }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="结算" width="60">
                     <template slot-scope="scope">
                        <span>{{status2[scope.row.type]}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="付款" width="60">
                    <template slot-scope="scope">
                        <span>{{status1[scope.row.payment_method]}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="收款账户">
                    <template slot-scope="scope">
                        <span>{{ scope.row.payment_account }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="金额" prop="prepayment"  width="80"></el-table-column>
                <el-table-column label="业务员" prop="user_name" width="70"></el-table-column>
                <el-table-column label="状态" width="105">
                   <template slot-scope="scope">
                        <span>{{ stata[scope.row.status] }}</span><br>
                        <el-popover
                        placement="right"
                        trigger="click">
                        <el-table :data="scope.row.auditor">
                            <el-table-column width="160" property="add_time" label="日期"></el-table-column>
                            <el-table-column width="160" property="remarks" label="状态"></el-table-column>
                            <el-table-column width="100" property="user_name" label="审核人"></el-table-column>
                        </el-table>
                        <el-button slot="reference" type="text">查看</el-button>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column label="备注">
                    <template slot-scope="scope">
                        <span>{{ scope.row.remarks }}</span>
                    </template>
                </el-table-column>
                <el-table-column width="50" align="right" label="合并" v-if="Group == true"></el-table-column>
                <el-table-column type="selection" width="55"  label="合并" align="left" v-if="Group == true"></el-table-column>
                <el-table-column label="操作" width="170">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.status == 0" type="primary" size="small" @click="FinanceSee(scope.row)">查看</el-button>
                        <el-button v-else-if="scope.row.status == 1" type="primary" size="small" @click="CashierSee(scope.row)">查看</el-button>
                        <el-button v-if="scope.row.status == 2" type="text" size="small">已打款</el-button>
                        <el-button type="info" size="small" @click="OderSee(scope.row)">查看订单</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 财务审核 -->
        <el-dialog title="财务审核" :visible.sync="examine">
            <p style="font-size: 20px;color:#000">
                <span>收款人：</span><span>{{ receiving_name }}</span>
                <span style="margin-left:30px;">收款账号：</span><span>{{ receiving_account }}</span>
            </p>
            <p style="font-size: 20px;color:#000;margin-top:5px;"><span>预付款金额：</span><span>{{ prepayment }}￥</span></p>
            <p v-if="file.length > 0">有{{ file.length }}张图，点击查看</p>
            <div class="demo-image__preview" v-if="file.length > 0">
                <el-image 
                    style="width: 100px; height: 100px"
                    :src="file[0]" 
                    :preview-src-list="file">
                </el-image>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="examine = false">取 消</el-button>
                <el-button type="primary" @click="Submission">审核通过</el-button>
            </div>
        </el-dialog>
        <!-- 出纳审核 -->
        <el-dialog title="财务审核" :visible.sync="Cashierexamine">
            <p style="font-size: 20px;color:#000">
                <span>收款人：</span><span>{{ receiving_name }}</span>
                <span style="margin-left:30px;">收款账号：</span><span>{{ receiving_account }}</span>
            </p>
            <p style="font-size: 20px;color:#000;margin-top:5px;"><span>预付款金额：</span><span>{{ prepayment }}￥</span></p>
            <chuna @func="jiezi" :a="dddd"></chuna>
            <div class="contract">
                <label>上传打款凭证</label>
                <div class="contractInner">
                    <div class="contractInnerLeft">
                    <el-upload
                        class="avatar-uploader"
                        accept="image/jpeg,image/gif,image/png,image/bmp"
                        action="/file/customer_order_express_cost_file"
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
                        <i @click="deleteimg(item.src)" style="font-size: 30px;margin-top: 75px;margin-left: 75px;color:#FFF;" class="el-icon-delete" ></i>
                        </div>
                    </div>
                    </div>
                </div>
            </div>

            <div slot="footer" class="dialog-footer">
                <el-button @click="Cashierexamine = false">取 消</el-button>
                <el-button type="primary" @click="CashierSubmission">提 交</el-button>
            </div>
        </el-dialog>

        <!-- 出纳合并支付 -->
        <el-dialog title="财务审核" :visible.sync="Hebingdialog">
            <div v-for="item in multipleSelection" :key="item.id">
                <p style="font-size: 20px;color:#000">
                    <span>收款人：</span><span>{{ item.receiving_name }}</span>
                    <span style="margin-left:30px;">收款账号：</span><span>{{ item.receiving_account }}</span>
                </p>
                <p style="font-size: 20px;color:#000;margin-top:5px;"><span>预付款金额：</span><span>{{ item.prepayment }}￥</span></p>
            </div>
            
            <chuna @func="jiezi" :a="dddd"></chuna>
            <div class="contract">
                <label>上传打款凭证</label>
                <div class="contractInner">
                    <div class="contractInnerLeft">
                    <el-upload
                        class="avatar-uploader"
                        accept="image/jpeg,image/gif,image/png,image/bmp"
                        action="/file/customer_order_express_cost_file"
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
                        <i @click="deleteimg(item.src)" style="font-size: 30px;margin-top: 75px;margin-left: 75px;color:#FFF;" class="el-icon-delete" ></i>
                        </div>
                    </div>
                    </div>
                </div>
            </div>

            <div slot="footer" class="dialog-footer">
                <el-button @click="Hebingdialog = false">取 消</el-button>
                <el-button type="primary" @click="comfileHebing">提 交</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { mapActions } from "vuex";
import chuna from "@/components/chuna";
export default {
    components:{
       chuna, 
    },
    data(){
        return{
          seach:'', // 筛选
          seach_order:'',
          seach_name:'',
          type_:'',
          time:null,
          starttime:'',
          action_user_name:'',
          kuan:'1',
          stata:['等待财务审核','等待出纳审核','审核通过'],  
          status1:['无','微信','支付宝','银行卡'],
          status2:['自费','整体结算','月结'],
          auditor_group:[],
          tabledata:[], // 预付款数据  
          
          examine:false, // 财务审核弹窗
          Cashierexamine:false, // 财务审核弹窗
          id:'',
          receiving_name:'', //收款人   
          receiving_account:'', // 收款账号
          prepayment:'', // 金额
          file:[],
          // 合同图片存储
          imageUrl:[],
          imageUrlstate:false,
          zichuan:[],
          dddd:'',
          // hebingzhifu
          Hebingdialog:false,
          multipleSelection:[],
          Group:false,  
        }  
    },
    methods:{
        // vuex tab显示
        ...mapActions("customerList", ["triggerReplaceId"]),
        ...mapActions("Tabs", ["triggerAddTabs", "triggerSetActiveIndex"]),
        // 搜索查询
        seachName(){
            let a,b;
            if(this.time == null){
                a='';
                b='';
            }else{
                a=this.time[0]/1000;
                b=this.time[1]/1000;
            }
            this.axios.post('/Finance/finance_order_express_cost_list',{
                action_time:this.kuan,
                supplier_name:this.seach,
                customer_order_id:this.seach_order,
                customer_name:this.seach_name,
                start_time:a,
                end_time:b,
                status:this.type_,
                action_user_name:this.action_user_name,
            }).then(res => {
                this.tabledata = res.data.express_cost;
            })
        },
        OderSee(a){
            this.triggerReplaceId(a.id);
            this.$router.push({ path: `/Finance/auditDetails/${a.customer_order_id}`,params:{userId:a.customer_order_id}});
            let ins1 = {
                route: `/Finance/auditDetails/${a.customer_order_id}`,
                name: "订单审核详情",
                id: a.customer_order_id
            };
            let ins2 = `/Finance/auditDetails/${a.customer_order_id}`;
            this.triggerAddTabs(ins1);
            this.triggerSetActiveIndex(ins2);
        },
        // 获取列表数据
        gettabledata(){
            this.axios.post('/Finance/finance_order_express_cost_list',{
                start_time:this.starttime,
                end_time:this.starttime,
                action_time:this.kuan,
            }).then(res => {
                this.tabledata = res.data.express_cost;
                this.auditor_group = res.data.auditor_group;
            })
        },
        

        // 财务审核按钮
        FinanceSee(a){
            this.examine = true;
            this.id = a.id;
            this.receiving_name = a.express_name;
            this.receiving_account = a.payment_account;
            this.prepayment = a.prepayment;
            let img = [];
            for (let i = 0; i < a.file.length; i++) {
                img.push(a.file[i].src);
            }
            this.file = img;
        },
        // 财务审核提交
        Submission(){
            this.axios.post('/Finance/finance_order_express_cost_status',{
                id:this.id,
            }).then(res => {
                if(res.data.code == 2000){
                    this.open(res.data.msg,'success');
                    this.examine = false;
                    if(this.time.length == 0){
                            this.gettabledata()
                        }else{
                            this.seachName();
                        }
                }else{
                    this.open(res.data.msg,'error');
                }
            })
        },
        // 出纳审核按钮
        CashierSee(a){
            this.Cashierexamine = true;
            this.id = a.id;
            this.dddd = a.id;
            this.receiving_name = a.express_name;
            this.receiving_account = a.payment_account;
            this.prepayment = a.prepayment; 
            let img = [];
            for (let i = 0; i < a.file.length; i++) {
                img.push(a.file[i].src);
            }
            this.file = img;
            this.getimgUrl(a.id);
        },
        // 合同上传
        handleAvatarSuccess() {
            this.getimgUrl(this.id);
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
            this.axios.get('/crm.Order/customer_order_file_select?id='+a+'&class=customer_order_express_cost').then(res => {
                if(res.data.customer_order_express_cost != null){
                 this.imageUrlstate = true;
                 this.imageUrl = res.data.customer_order_express_cost;
                }  
            })
        },
        // 删除合同数据图片
        deleteimg(a){
            this.axios.post('/file/customer_order_delete',{
            src:a,
            class:'customer_order',
            }).then(res => {
                if(res.data.code == 2000){
                    this.getimgUrl(this.customer_order_id);
                }
            })
        },
         // 接收值
        jiezi(data){
           this.zichuan = data;
        },
        // 出纳提交审核
        CashierSubmission(){
            let src = [];
            for(let i=0;i<this.imageUrl.length;i++){
                let P = this.imageUrl[i].src;
                src.push(P);      
            };
             if(this.zichuan.length == 0){
                     this.open('选择付款账号','error');
                }else{
                    this.axios.post('/Finance/finance_order_express_cost_status',{
                        id:this.id,
                        src:src,
                        paye:this.zichuan,
                    }).then(res => {
                        if(res.data.code == 2000){
                            this.open(res.data.msg,'success');
                            this.Cashierexamine = false;
                            if(this.time.length == 0){
                                this.gettabledata()
                            }else{
                                this.seachName();
                            }
                        }else{
                            this.open(res.data.msg,'error');
                        }
                    })
                }
             
        },
        // 合并支付按钮
        hebing(){
            if(this.multipleSelection.length < 2){
                this.open('选中的节点低于两个或者没有选择','error')
            }else{
                this.Hebingdialog  = true;
            }
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        comfileHebing(){
            let src = [];
            let id = [];
            for(let i=0;i<this.imageUrl.length;i++){
                let P = this.imageUrl[i].src;
                src.push(P);      
            };
            for(let i=0;i<this.multipleSelection.length;i++){
                id.push(this.multipleSelection[i].id)
            };
            if(this.zichuan.length == 0){
                this.open('选择付款账号','error');
            }else{
                this.axios.post('/Finance/finance_order_express_cost_payment',{
                    id:id.join(),
                    src:src,
                    paye:this.zichuan,
                }).then(res => {
                    if(res.data.code == 2000){
                        this.open(res.data.msg,'success');
                        this.Hebingdialog = false;
                        if(this.time.length == 0){
                            this.gettabledata()
                        }else{
                            this.seachName();
                        }
                    }else{
                        this.open(res.data.msg,'error');
                    }
                })
            }
        },

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
        let Group = JSON.parse(localStorage.getItem('Group'));
        this.Group = Group.includes(9);
        console.log(this.Group)
        let d=new Date();
        let year=d.getFullYear();
        let month=this.change(d.getMonth()+1);
        let day=this.change(d.getDate());
        let starttime1 = year+'-'+month+'-'+day;
        this.starttime = this.getTimestamp(starttime1)/1000
        this.gettabledata();
    },
    // watch:{
    //     $route(to){
    //         this.gettabledata();
    //     }
    // }
}
</script>

<style lang="less" scoped>
.avatar-uploader,.el-upload {
    width: 178px;
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

.contract{
    margin-top: 20px;
    border:1px solid #CCC;
    padding: 20px 10px;
    overflow: hidden;
    margin-bottom: 10px;
    .contractInner{
        margin-top: 20px;
        overflow: hidden;
        .contractInnerLeft{
        float: left;
        margin-left: 20px;
        }
    }
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

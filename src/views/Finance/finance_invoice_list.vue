<template>
    <div class="box">
        <div class="head_box">
            <label>筛选：</label>
            <el-date-picker v-model="time" type="daterange" value-format="timestamp" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
            <el-input placeholder="抬头" v-model="seach" style="width:100px;margin-left:10px"></el-input>
            <el-input placeholder="业务员" v-model="user" style="width:100px;margin-left:10px"></el-input>
            <el-input placeholder="部门" v-model="dep" style="width:100px;margin-left:10px"></el-input>
            <el-input placeholder="开票单位" v-model="dan" style="width:160px;margin-left:10px"></el-input>
            <el-input placeholder="发票编号" v-model="bian" style="width:160px;margin-left:10px"></el-input>
            
            <el-button type="primary" @click="seachName"  style="margin-left:20px;">搜索</el-button>
        </div>
        <div class="content_box">
                <el-table :data="tableData" show-summary>
                    <el-table-column type="expand">
                        <template slot-scope="props">
                            <el-form label-position="left" inline class="demo-table-expand">
                                <el-form-item label="备注" label-width="90px">
                                    <span>{{ props.row.remarks }}</span>
                                </el-form-item>
                                <el-form-item label="发票编号" label-width="90px">
                                    <span>{{ props.row.invoice_number }}</span>
                                </el-form-item>
                                <el-form-item label="开票单位" label-width="90px">
                                    <span>{{ props.row.invoice_enterprise }}</span>
                                </el-form-item>
                                <el-form-item label="财务备注" label-width="90px">
                                    <span>{{ props.row.invoice_remarks }}</span>
                                </el-form-item>
                                <el-form-item label="开户行" label-width="90px">
                                    <span>{{ props.row.opening_bank }}</span>
                                </el-form-item>
                                <el-form-item label="地址" label-width="90px">
                                    <span>{{ props.row.address }}</span>
                                </el-form-item>
                            </el-form>
                            <el-table :data="props.row.invoice_customer_order">
                                <el-table-column label="客户" prop="customer_name"></el-table-column>
                                <el-table-column label="总销售额" prop="total_price"></el-table-column>
                                <el-table-column label="开票金额" prop="money"></el-table-column>
                                <el-table-column label="操作">
                                    <template slot-scope="scope">
                                        <el-button type="text" size="mini" @click="see(scope.row)">查看</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </template>
                    </el-table-column>
                    <el-table-column type="index" width="50"></el-table-column>
                    <el-table-column label="类型" width="60px">
                        <template slot-scope="scope">
                            <span v-if="scope.row.type == 0">增票</span>
                            <span v-if="scope.row.type == 1">普票</span>
                            <span v-if="scope.row.type == 2">收据</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="发票抬头" prop="rise"></el-table-column>
                    <el-table-column label="票号" width="170px">
                        <template slot-scope="scope">
                            <span>{{ scope.row.tax_number }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="税点">
                        <template slot-scope="scope">
                            <span>{{ scope.row.tax_point }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="金额" prop="money"></el-table-column>
                    <el-table-column label="时间" prop="invoice_add_time" width="100px"></el-table-column>
                    <el-table-column label="开票人" prop="user_name">
                        <template slot-scope="scope">
                            <span>{{ scope.row.dep_title }}/{{ scope.row.user_name }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="状态">
                        <template slot-scope="scope">
                            <span v-if="scope.row.status == 0">
                                待开票
                            </span>
                            <span v-if="scope.row.status == 3">
                                已开票
                            </span>
                            <span v-if="scope.row.status == 5">
                                运费待审核
                            </span>
                            <span v-if="scope.row.status >= 9 && scope.row.status < 99">
                                已审核
                            </span>
                            <span v-if="scope.row.status == 99">
                                已作废
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                            <template slot-scope="scope">
                                <template v-if="scope.row.status == 0">
                                    <el-button type="primary" size="mini" @click="Audit1(scope.row)">审核开票</el-button>
                                    <br>
                                </template>
                                <el-button type="primary" size="mini" style="margin-top:5px;" @click="express(scope.row)">快递审核</el-button>
                                <template v-if="scope.row.status != 0">
                                    <br>
                                    <el-button type="danger" size="mini" style="margin-top:5px;" @click="deteles(scope.row)">开票作废</el-button>
                                </template>
                                
                            </template>
                    </el-table-column>
                </el-table>
                <el-dialog title="开票信息" :visible.sync="dialogAudit">
                    <el-form :model="dialogAuditForm">
                        <el-form-item label="发票编号" label-width="90px">
                            <el-input v-model="dialogAuditForm.invoice_number" style="width:300px"></el-input><span style="margin-left:10px">数量</span><el-input v-model="dialogAuditForm.invoice_num" style="width:50px"></el-input>
                        </el-form-item>
                        <el-form-item label="开票单位" label-width="90px">
                            <el-input v-model="dialogAuditForm.invoice_enterprise" style="width:300px"></el-input>
                        </el-form-item>
                        <el-form-item label="备注" label-width="90px">
                            <el-input  type="textarea" v-model="dialogAuditForm.invoice_remarks" style="width:400px"></el-input>
                        </el-form-item>
                        <el-form-item label=" " label-width="90px">
                            <el-button type="primary" @click="Audit">审核通过</el-button>
                        </el-form-item>
                    </el-form>
                </el-dialog>
                <el-dialog title="快递审核" :visible.sync="dialogSend" width="60%">
                     <el-table :data="SendData">
                            <el-table-column label="快递公司" prop="express_name"></el-table-column>
                            <el-table-column label="快递编号" prop="numbers"></el-table-column>
                            <el-table-column label="快递费用" prop="money"></el-table-column>
                            <el-table-column label="快递时间" prop="add_time"></el-table-column>
                            <el-table-column label="操作">
                                <template slot-scope="scope">
                                    <el-button type="primary" @click="examine(scope.row)" size="small">审 核</el-button>
                                </template>
                            </el-table-column>
                     </el-table>
                </el-dialog>
        </div>
    </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
    data(){
        return{
            seach:'',
            user:'',
            dep:'',
            dan:'',
            bian:'',
            time:null,
            starttime:'',
            tableData:[], // 发票信息
            dialogSend:false, //快递审核
            SendData:[],
            id:'',
            dialogAudit:false,
            dialogAuditForm:{
                id:'',
                invoice_number:'',
                invoice_num:'1',
                invoice_remarks:'',
                invoice_remarks:'',
            }
        }
    },
    methods:{
        // vuex tab显示
        ...mapActions("customerList", ["triggerReplaceId"]),
        ...mapActions("Tabs", ["triggerAddTabs", "triggerSetActiveIndex"]),
        // 搜索
        seachName(){
            let a,b;
            if(this.time == null){
                a='';
                b='';
            }else{
                a=this.time[0]/1000;
                b=this.time[1]/1000;
            }
            this.axios.post('/Finance/finance_invoice_list',{
                rise:this.seach,
                start_time:a,
                end_time:b,
                user_name:this.user,
                dep_title:this.dep,
                invoice_enterprise:this.dan,
                invoice_number:this.bian,
            }).then(res => {
                this.tableData = res.data.invoice;
            })
        },
        gettableData(){
            this.axios.post('/Finance/finance_invoice_list',{
                start_time:this.starttime,
                end_time:this.starttime
            }).then(res => {
                this.tableData = res.data.invoice;
            })
        },
        
        // 审核开票3
        Audit1(a){
            this.dialogAudit = true;
            this.dialogAuditForm.id = a.id;
            this.dialogAuditForm.invoice_number = '';
            this.dialogAuditForm.invoice_num = '1';
            this.dialogAuditForm.invoice_remarks = '';
        },
        Audit(){
            if(this.dialogAuditForm.id == '' || this.dialogAuditForm.invoice_number == '' ){
                this.open('填写完整','error');
            }else{
                this.axios.post('/Finance/finance_invoice_status',this.dialogAuditForm).then(res => {
                    if(res.data.code == 2000){
                        this.open(res.data.msg,'success');
                        this.gettableData();
                        this.dialogAudit = false;
                    }else{
                        this.open(res.data.msg,'error');
                    }
                })
            }
            
        },
        // 快递审核按钮
        express(a){
            
            this.id = a.id; 
            this.axios.get('/Finance/finance_invoice_express_select?id='+a.id).then(res => {
                this.SendData = res.data;
             })
             this.dialogSend = true;
          // alert(a.id)   
        },
        // 提交审核
        examine(a){
             this.axios.post('/Finance/finance_invoice_express_status',{
                 id:a.id
             }).then(res => {
                if(res.data.code == 2000){
                    this.open(res.data.msg,'success');
                    this.dialogSend = false;
                    this.id = '';
                }else{
                    this.open(res.data.msg,'error');
                }   
             })
            
        },
        deteles(a){
            this.$confirm('此操作将永久作废该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.axios.post('/Finance/finance_invoice_delete',{
                    id:a.id
                }).then(res => {
                    if(res.data.code == 2000){
                        this.open(res.data.msg,'success');
                        if(this.time == null){
                            this.gettableData()
                        }else{
                            this.seachName();
                        }
                        this.dialogSend = false;
                    }else{
                        this.open(res.data.msg,'error');
                    }   
                })

            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消作废'
                });          
            });
        },
        see(a){
            this.triggerReplaceId(a.customer_order_id);
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
    },
}
</script>


<template>
    <div class="box">
        <div>
            <label>筛选：</label>
            <el-input placeholder="名称" v-model="seach" style="width:217px;margin-left:10px"></el-input>
            <el-button type="primary" @click="seachName"  style="margin-left:20px;">搜索</el-button>
            <el-button type="primary" @click="add"  style="margin-left:20px;">添加发票</el-button>
        </div>

        <div class="content_box">
            <el-table :data="tableData">
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-form label-position="left" inline class="demo-table-expand">
                            <el-form-item label="备注" label-width="90px">
                                <span>{{ props.row.remarks }}</span>
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
                <el-table-column label="类型" width="60px">
                    <template slot-scope="scope">
                        <span v-if="scope.row.type == 0">增票</span>
                        <span v-if="scope.row.type == 1">普票</span>
                        <span v-if="scope.row.type == 2">收据</span>
                    </template>
                </el-table-column>
                <el-table-column label="发票抬头" prop="rise"></el-table-column>
                <el-table-column label="票号" prop="tax_number"></el-table-column>
                <el-table-column label="金额" prop="money" width="100"></el-table-column>
                <el-table-column label="税点" prop="tax_point" width="80"></el-table-column>
                <el-table-column label="税金" prop="tax_amount" width="100"></el-table-column>
                <!-- <el-table-column label="品类" prop="category"></el-table-column> -->
                <el-table-column label="开票人" prop="user_name">
                    <template slot-scope="scope">
                        <span>{{ scope.row.dep_title }}/{{ scope.row.user_name }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="状态" width="80">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status == 0">
                            待开票
                        </span>
                        <span v-if="scope.row.status == 3">
                            已开票
                        </span>
                        <span v-if="scope.row.status == 5">
                            待审核
                        </span>
                        <span v-if="scope.row.status >= 9">
                            已审核
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="150px">
                    <template slot-scope="scope">
                        <el-button type="danger" v-if="scope.row.status == 0" size="mini" @click="edit(scope.row)">删除</el-button>
                        <el-button type="text" v-if="scope.row.status == 99">已作废</el-button>
                        <el-button type="primary" v-if="scope.row.status != 99" size="mini" @click="Send(scope.row)">快递</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog title="发票信息" :visible.sync="dialogInvoice" width="80%">
            <div class="overflow: hidden;width:60%">
                <el-form :model="InvoiceForm" inline  style="float: left;">
                    <el-form-item label="开票抬头" label-width="90px">
                        <el-select v-model="InvoiceForm.rise" filterable allow-create default-first-option @change="risechange" placeholder="请选择开票抬头" style="width:200%;">
                            <el-option v-for="item in ops" :key="item.id" :label="item.rise" :value="item.rise"></el-option>
                        </el-select>
                    </el-form-item>
                    <br>
                    <el-form-item label="发票税号" label-width="90px">
                        <el-input v-model="InvoiceForm.tax_number" style="width:317px;"></el-input>
                    </el-form-item>
                    <br>
                    <el-form-item label="地址、电话" label-width="90px" class="aa">
                        <el-input v-model="InvoiceForm.address" style="width:220%;"></el-input>
                    </el-form-item>
                     <br>
                    <el-form-item label="开户行" label-width="90px" class="aa">
                        <el-input v-model="InvoiceForm.opening_bank"  style="width:220%;"></el-input>
                    </el-form-item>   
                    <br>
                    <el-form-item label="发票类型" label-width="80px">
                        <!-- <el-input v-model="InvoiceForm.type" style="width:120px;"></el-input> -->
                        <el-radio v-model="InvoiceForm.type" label="0">增票</el-radio>
                        <el-radio v-model="InvoiceForm.type" label="1">普票</el-radio>
                        <el-radio v-model="InvoiceForm.type" label="2">收据</el-radio>
                    </el-form-item>
                    <br>
                    <el-form-item label="发票金额" label-width="80px">
                        <el-input v-model="InvoiceForm.money" disabled style="width:120px;"></el-input>
                    </el-form-item>
                    <el-form-item label="发票税率" label-width="80px">
                        <el-input v-model="InvoiceForm.tax_point" placeholder="0.00" style="width:120px;"  @change="suan"></el-input>
                    </el-form-item>
                    <el-form-item label="发票税额" label-width="80px">
                        <el-input v-model="InvoiceForm.tax_amount" disabled style="width:120px;"></el-input>
                    </el-form-item>
                    <br>
                    <el-form-item label="备注" label-width="80px">
                        <el-input type="textarea" v-model="InvoiceForm.remarks" style="width:200%;"></el-input>
                    </el-form-item>
                </el-form>
                <el-table :data="F_data" style="float: left;width:40%">
                    <el-table-column label="客户名称" prop="customer_name"></el-table-column>
                    <el-table-column label="订单金额">
                            <template slot-scope="scope">
                                <span>{{ Number(scope.row.total_price) + Number(scope.row.repair_invoice) + Number(scope.row.repair_freight)}}</span>
                            </template>
                        </el-table-column>
                    <el-table-column label="开票金额" prop="invoice_amount">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.invoice_amount"  @change="suan"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button size="mini" @click="shanchu(scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div style="clear:both"></div>
            <div style="text-align: right;">
                <el-button @click="dialogInvoice = false">取 消</el-button>
                <el-button type="primary" @click="addInvoice">提 交</el-button>
            </div>
            <label>产品信息</label>  
            <div class="box_product" style="margin-top:10px">
                <el-input v-model="f_name" style="width:150px;margin-left:10px;" placeholder="客户"></el-input>
                <el-input v-model="f_phone" style="width:150px;margin-left:10px" placeholder="电话"></el-input>
                <el-input v-model="f_money" style="width:150px;margin-left:10px" placeholder="金额"></el-input>
                <el-button @click="f_seach()" style="margin-left:10px">搜索</el-button>
                <el-table  :data="tableProduct" tooltip-effect="dark">
                    <el-table-column label="客户名称" prop="customer_name"></el-table-column>
                    <el-table-column label="客户电话" prop="customer_working_phone"></el-table-column>
                    <el-table-column label="销售时间" prop="sales_time"></el-table-column>
                    <el-table-column label="订单金额" prop="total_price"></el-table-column>
                    <el-table-column label="已开票金额" prop="invoice_amount"></el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button @click="tianjia(scope.row)" size="mini">开发票</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="block" style="margin-top: 10px;float: left;">
                    <el-pagination
                        @current-change="handleCurrentChange1"
                        :current-page="currentPage1"
                        :page-size="per_page1"
                        layout="total, prev, pager, next"
                        :total="total1">
                    </el-pagination>
                </div>
            </div>
        </el-dialog>

        <el-dialog title="快递" :visible.sync="dialogSend" width="60%">
            <el-form :model="SendForm" ref="SendForm">
                <el-form-item label="快递公司" label-width="90px" prop="company">
                    <el-select v-model="SendForm.company" placeholder="请选择"  style="width:317px">
                        <el-option
                        v-for="item in options"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="快递编号" label-width="90px" prop="numbers">
                    <el-input v-model="SendForm.numbers" style="width:317px"></el-input>
                </el-form-item>
                <el-form-item label="快递费用" label-width="90px" prop="money">
                    <el-input v-model="SendForm.money"  style="width:317px"></el-input>
                </el-form-item>
            </el-form>
            <el-table :data="tableExpres">
                <el-table-column label="快递公司" prop="express_name"></el-table-column>
                <el-table-column label="快递编号" prop="numbers"></el-table-column>
                <el-table-column label="快递费用" prop="money"></el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status == 5">
                            运费待审核
                        </span>
                        <span v-if="scope.row.status >= 9">
                            已审核
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary"  v-if="scope.row.status == 0" @click="editExpres(scope.row)" size="mini">修改</el-button>
                        <el-button type="danger"  v-if="scope.row.status == 0" @click="deleteExpres(scope.row)" size="mini">删除</el-button>
                        <span  v-if="scope.row.status != 0">无法操作</span>
                    </template>
                </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogSend = false">取 消</el-button>
                <el-button type="primary" @click="addSend">提 交</el-button>
            </div>
        </el-dialog>

        <div class="block" style="margin-top: 10px;">
                <el-pagination
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-size="per_page"
                layout="total, prev, pager, next"
                :total="total">
                </el-pagination>
        </div>
    </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
    data(){
        return{
           seach:'',
           tableData:[], // 发票信息
           currentPage1:0,//当前页
           total1:0,//总数
           per_page1:0,//每页多少条
           last_page1:0,//总页数
           dialogInvoice:false,//发票信息弹窗
           InvoiceForm:{
              rise:'', 
              tax_number:'',
              category:'',
              type:'',
              money:'',
              tax_point:'0.00',
              tax_amount:'',
              opening_bank:'',
              address:'',
              remarks:'',
              id:'',
           },
           tableProduct:[], // 产品 数据
           checkboxGroup:[], // 勾选产品
            currentPage:0,//当前页
            total:0,//总数
            per_page:0,//每页多少条
            last_page:0,//总页数
            dialogSend:false,
            SendForm:{
                money:'',
                company:'',
                numbers:'',
                invoice_id:'',
                id:'',
            },
            options:[],// 快递
            tableExpres:[],//快递shuju
            ops:[],
            f_name:'',
            f_phone:'',
            f_money:'',
            F_data:[],//选中发票信息
        }
    },
    methods:{
        // vuex tab显示
        ...mapActions("customerList", ["triggerReplaceId"]),
        ...mapActions("Tabs", ["triggerAddTabs", "triggerSetActiveIndex"]),
        // 搜索
        seachName(){
            this.axios.post('/crm.Order/invoice_list',{
                rise:this.seach,
            }).then(res => {
                this.tabledata = res.data.invoice.data;
                this.currentPage = res.data.invoice.current_page;
                this.total = res.data.invoice.total;
                this.per_page = res.data.invoice.per_page;
                this.last_page = res.data.invoice.last_page;
            })
        },
        // 添加发票
        add(){
            this.InvoiceForm.id = '';
            this.InvoiceForm.rise='';
            this.InvoiceForm.tax_number='';
            this.InvoiceForm.category='';
            this.InvoiceForm.type='';
            this.InvoiceForm.money='';
            this.InvoiceForm.address='';
            this.InvoiceForm.opening_bank='';
            this.InvoiceForm.tax_point ='';
            this.InvoiceForm.remarks = '';
            this.F_data = [];
            this.dialogInvoice = true;
        },
        // 获取发票信息
        gettableData(){
            this.axios.get('/crm.Order/invoice_list').then(res => {
                this.tableData = res.data.invoice.data;
                
                this.ops = res.data.invoice_information;
                this.currentPage = res.data.invoice.current_page;
                this.total = res.data.invoice.total;
                this.per_page = res.data.invoice.per_page;
                this.last_page = res.data.invoice.last_page;

                this.tableProduct = res.data.order.data;
                this.currentPage1 = res.data.order.current_page;
                this.total1 = res.data.order.total;
                this.per_page1 = res.data.order.per_page;
                this.last_page1 = res.data.order.last_page;
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
            this.axios.post('/crm.Order/invoice_list',{
                page:val,
            }).then(res => {
                this.tableData = res.data.invoice.data;
                this.currentPage = res.data.invoice.current_page;
                loading.close();
            })  
        },
        getRowKeys(row) {
            return row.id;
        },
        // 提交发票
        addInvoice(){
            let nihao = [];
            if(this.F_data.length !== 0){
                for(let z = 0;z<this.F_data.length;z++){
                    let customer_order_id = this.F_data[z].id;
                    let invoice_amount =  this.F_data[z].invoice_amount;

                   // console.log(productShu);
                    let productShuju = {
                        customer_order_id:customer_order_id,
                        invoice_amount:invoice_amount,
                    } 
                    nihao.push(productShuju);
                }

                if(this.InvoiceForm.id == ''){
                    if(this.InvoiceForm.rise == '' || this.InvoiceForm.tax_number == '' ||this.InvoiceForm.type=='' || this.InvoiceForm.money == '' || this.InvoiceForm.opening_bank == '' || this.InvoiceForm.address == ''){
                        this.open('填写完整','error');
                    }else{
                        this.axios.post('/crm.Order/invoice_add',{
                            rise:this.InvoiceForm.rise, 
                            tax_number:this.InvoiceForm.tax_number, 
                            type:this.InvoiceForm.type, 
                            money:this.InvoiceForm.money,
                            tax_point:this.InvoiceForm.tax_point,
                            tax_amount:this.InvoiceForm.tax_amount,
                            opening_bank:this.InvoiceForm.opening_bank,
                            address:this.InvoiceForm.address,
                            remarks:this.InvoiceForm.remarks,
                            order:nihao,
                        }).then(res => {
                            if(res.data.code == 2000){
                                this.checkboxGroup = [];
                                nihao = [];
                                this.open(res.data.msg,'success');
                                this.dialogInvoice = false;
                                this.gettableData();
                            }else{
                                this.open(res.data.msg,'error');
                            }
                        })   
                    }
                    
                }  
            }else{
                this.open('勾选产品','error');
            }   
        },
        // 修改
        edit(a){
            this.axios.post('/crm.Order/invoice_delete',{
               id:a.id
           }).then(res => {
               if(res.data.code == 2000){
                    this.open(res.data.msg,'success');
                    this.gettableData();
                }else{
                    this.open(res.data.msg,'error');
                }
           })
        },
        // 快递
        Send(a){
            this.SendForm.id = '';
            this.SendForm.invoice_id = a.id;
            this.SendForm.company = '';
            this.SendForm.money= '';
            this.SendForm.numbers= '';
            this.dialogSend = true;
            this.axios.get('/crm.Order/invoice_list').then(res => {
                this.options = res.data.express;
            })
            this.axios.get('/crm.Order/invoice_express_update?id='+a.id).then(res => {
                this.tableExpres = res.data;
            });
        },
        // 快递提交
        addSend(){
            if(this.SendForm.id == ''){
                if(this.SendForm.company != '' && this.SendForm.money != '' && this.SendForm.numbers != ''){
                    this.axios.post('/crm.Order/invoice_express_add',{
                        express_id:this.SendForm.company,
                        money:this.SendForm.money,
                        numbers:this.SendForm.numbers,
                        invoice_id:this.SendForm.invoice_id
                    }).then(res => {
                        if(res.data.code == 2000){
                                this.axios.get('/crm.Order/invoice_express_update?id='+this.SendForm.invoice_id).then(res => {
                                    this.tableExpres = res.data;
                                });
                                this.open(res.data.msg,'success');
                                this.$refs['SendForm'].resetFields(); 
                            }else{
                                this.open(res.data.msg,'error');
                            }    
                    })    
                }else{
                    this.open('填写完整','error');
                }
            }else{
                if(this.SendForm.company != '' && this.SendForm.money != '' && this.SendForm.numbers != ''){
                    this.axios.post('/crm.Order/invoice_express_update',{
                    express_id:this.SendForm.company,
                    money:this.SendForm.money,
                    numbers:this.SendForm.numbers,
                    invoice_id:this.SendForm.invoice_id,
                    id:this.SendForm.id,
                }).then(res => {
                    if(res.data.code == 2000){
                            this.axios.get('/crm.Order/invoice_express_update?id='+this.SendForm.invoice_id).then(res => {
                                this.tableExpres = res.data;
                            });
                            this.open(res.data.msg,'success');
                            this.$refs['SendForm'].resetFields(); 
                        }else{
                            this.open(res.data.msg,'error');
                        }    
                    })
                }else{
                    this.open('填写完整','error'); 
                }
               
            }
           
        },
        // 修改快递
        editExpres(a){
           this.SendForm.company = a.express_id;
           this.SendForm.money= a.money;
           this.SendForm.numbers= a.numbers;
           this.SendForm.invoice_id = a.invoice_id;
           this.SendForm.id = a.id;
        },
        //删除快递
        deleteExpres(a){
           this.axios.post('/crm.Order/invoice_express_delete',{
                id:a.id,
            }).then(res => {
                if(res.data.code == 2000){
                        this.axios.get('/crm.Order/invoice_express_update?id='+a.invoice_id).then(res => {
                            this.tableExpres = res.data;
                        });
                        this.open(res.data.msg,'success');  
                    }else{
                        this.open(res.data.msg,'error');
                    }  
            }) 
        },

        handleCurrentChange1(val){
            let a = this.multipleSelection;
            this.axios.post('/crm.Order/invoice_list',{
                page:val,
                name:this.f_name,
                phone:this.f_phone,
                money:this.f_money,
            }).then(res => {
                this.tableProduct = res.data.order.data;
                this.currentPage1 = res.data.order.current_page;
                this.total1 = res.data.order.total;
                this.per_page1 = res.data.order.per_page;
                this.last_page1 = res.data.order.last_page;
                this.multipleSelection = a;
            })
        },
        f_seach(val){
            this.axios.post('/crm.Order/invoice_list',{
                name:this.f_name,
                phone:this.f_phone,
                money:this.f_money,
            }).then(res => {
                this.tableProduct = res.data.order.data;
                this.currentPage1 = res.data.order.current_page;
                this.total1 = res.data.order.total;
                this.per_page1 = res.data.order.per_page;
                this.last_page1 = res.data.order.last_page;
            })
        },
        suan(){
            let shu = 0;
            for(let z =0; z<this.F_data.length;z++){
                let zz = this.F_data[z]
                console.log(zz.invoice_amount)
                shu +=  Number(zz.invoice_amount)
            }
            this.InvoiceForm.money = shu  
            this.InvoiceForm.tax_amount = (Number(this.InvoiceForm.tax_point) *shu).toFixed(3);
        },
        
        tianjia(a){
           this.F_data.push(a);
           this.F_data = this.unique(this.F_data);
           this.suan();
        },
        risechange(a){
            console.log(a);
            this.ops.filter(item => {
                if(item.rise == a){
                   this.InvoiceForm.opening_bank = item.opening_bank; 
                   this.InvoiceForm.tax_number = item.tax_number; 
                   this.InvoiceForm.address = item.address;   
                }
            })

        },
        shanchu(a){
            let index = 0;
            for (let option of this.F_data) {
                if (option.id === a.id) {
                    break;
                }
                index++;
            }
            this.F_data.splice(index, 1);
            this.suan();
        },
        see(a){
            this.triggerReplaceId(a.customer_order_id);
            this.$router.push({ path: `/crm/Order/seeOrder/${a.customer_order_id}`,params:{userId:a.customer_order_id}});
            let ins1 = {
                route: `/crm/Order/seeOrder/${a.customer_order_id}`,
                name: "查看订单",
                id: a.customer_order_id
            };
            let ins2 = `/crm/Order/seeOrder/${a.customer_order_id}`;
            this.triggerAddTabs(ins1);
            this.triggerSetActiveIndex(ins2);
        },
        unique(arr) {
            const res = new Map();
            return arr.filter((arr) => !res.has(arr.id) && res.set(arr.id))
        },
        open(a,b){
            this.$message({
                message: a,
                type: b
            });
        },

    },
    activated(){
        this.gettableData();
    },
    // watch:{
    //     $route(to){
    //        this.gettableData();
    //     }
    // }
}
</script>

<style lang="less" scoped>
.box{
    min-width: 890px;
    .box_product{
        overflow: hidden;
        .product_inner{
            width: 550px;
            float: left;
            margin-left: 40px;
            border:1px solid #CCC;
            padding: 20px;
            margin-top: 20px;
        }
    }
    .aa{
        .el-form-item__content{
            width: 80%;
        }
    }
}

</style>


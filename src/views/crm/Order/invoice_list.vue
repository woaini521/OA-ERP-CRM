<template>
    <div class="box">
        <div class="head_box">
            <label>筛选：</label>
            <el-input placeholder="名称" v-model="seach" style="width:217px;margin-left:10px"></el-input>
            <el-button type="primary" @click="seachName"  style="margin-left:20px;">搜索</el-button>
            <el-button type="primary" @click="add"  style="margin-left:20px;">添加发票</el-button>
        </div>

        <div class="content_box">
            <el-table :data="tableData">
                <el-table-column label="类型" prop="type"></el-table-column>
                <el-table-column label="发票抬头" prop="rise"></el-table-column>
                <el-table-column label="票号" prop="tax_number"></el-table-column>
                <el-table-column label="金额" prop="money"></el-table-column>
                <el-table-column label="品类" prop="category"></el-table-column>
                <el-table-column label="状态">
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
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="danger" v-if="scope.row.status == 0" size="mini" @click="edit(scope.row)">删除</el-button>
                        <el-button type="primary" size="mini" @click="Send(scope.row)">快递</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog title="发票信息" :visible.sync="dialogInvoice">
            <el-form :model="InvoiceForm" inline="">
                <el-form-item label="开票抬头" label-width="90px">
                    <el-input v-model="InvoiceForm.rise" style="width:317px;"></el-input>
                </el-form-item>
                <br>
                <el-form-item label="发票税号" label-width="90px">
                     <el-input v-model="InvoiceForm.tax_number" style="width:317px;"></el-input>
                </el-form-item>
                <br>
                <el-form-item label="品类" label-width="80px">
                     <el-input v-model="InvoiceForm.category" style="width:120px;"></el-input>
                </el-form-item>
                <el-form-item label="发票类型" label-width="80px">
                     <el-input v-model="InvoiceForm.type" style="width:120px;"></el-input>
                </el-form-item>
                <el-form-item label="发票金额" label-width="80px">
                     <el-input v-model="InvoiceForm.money" style="width:120px;"></el-input>
                </el-form-item>
            </el-form>
            <label>产品信息</label>  
            <div class="box_product">
                <div class="product_inner" v-for="item in tableProduct" :key="item.id">
                        <p style="padding-bottom:10px;">
                            <span>客户名称：{{item.customer_name}} </span>
                            <span>客户电话：{{item.customer_working_phone}}</span>
                            <span>总销售额：{{item.total_price}} </span>
                        </p>
                    <el-checkbox-group v-model="checkboxGroup">
                            <el-checkbox :label="item">选择</el-checkbox>
                            
                            <el-table :data="item.product_sku">
                                    <el-table-column  label="订单产品" >
                                        <template slot-scope="scope">
                                            <span>{{scope.row.class_name}}{{scope.row.sku_name}}</span>
                                        </template> 
                                    </el-table-column>
                                    <el-table-column prop="total_price" label="销售金额" ></el-table-column>  
                                    <el-table-column  label="认款金额" >
                                        <template slot-scope="scope">
                                            <!-- <span>{{scope.row.total_price}}</span> -->
                                            <el-input v-model="scope.row.money" :placeholder="scope.row.total_price"></el-input>
                                        </template>    
                                    </el-table-column>
                            </el-table> 
                    </el-checkbox-group>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogInvoice = false">取 消</el-button>
                <el-button type="primary" @click="addInvoice">提 交</el-button>
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
                        <span v-if="scope.row.status == 0">
                            待开票
                        </span>
                        <span v-if="scope.row.status == 3">
                            已开票
                        </span>
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
export default {
    data(){
        return{
           seach:'',
           tableData:[], // 发票信息
           dialogInvoice:false,//发票信息弹窗
           InvoiceForm:{
              rise:'', 
              tax_number:'',
              category:'',
              type:'',
              money:'',
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
            tableExpres:[]//快递shuju

        }
    },
    methods:{
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
            this.dialogInvoice = true;
        },
        // 获取发票信息
        gettableData(){
            this.axios.get('/crm.Order/invoice_list').then(res => {
                this.tableData = res.data.invoice.data;
                this.tableProduct = res.data.order;
                this.currentPage = res.data.invoice.current_page;
                this.total = res.data.invoice.total;
                this.per_page = res.data.invoice.per_page;
                this.last_page = res.data.invoice.last_page;
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
        // 提交发票
        addInvoice(){
            let nihao = [];
            if(this.checkboxGroup.length !== 0){
                for(let z = 0;z<this.checkboxGroup.length;z++){
                    let checkboxGroupSku = this.checkboxGroup[z];
                    let checkboxGroupSkuProduct =  checkboxGroupSku.product_sku;
                    let productShu =[];
                    for(let y = 0; y < checkboxGroupSkuProduct.length; y++){
                            let productSkuShu = {
                                customer_order_product_sku_id:checkboxGroupSkuProduct[y].id,
                                money:checkboxGroupSkuProduct[y].money
                            }
                            productShu.push(productSkuShu);
                    } 
                   // console.log(productShu);
                    let productShuju = {
                        customer_order_id:checkboxGroupSku.id,
                        product_sku:productShu,
                    } 
                    nihao.push(productShuju);
                }

                if(this.InvoiceForm.id == ''){
                    this.axios.post('/crm.Order/invoice_add',{
                        rise:this.InvoiceForm.rise, 
                        tax_number:this.InvoiceForm.tax_number, 
                        category:this.InvoiceForm.category, 
                        type:this.InvoiceForm.type, 
                        money:this.InvoiceForm.money,
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

        open(a,b){
            this.$message({
                message: a,
                type: b
            });
        },

    },
    created(){
        this.gettableData();
    },
    watch:{
        $route(to){
           this.gettableData();
        }
    }
}
</script>

<style lang="less" scoped>
.box_product{
        padding-bottom: 40px;
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
</style>


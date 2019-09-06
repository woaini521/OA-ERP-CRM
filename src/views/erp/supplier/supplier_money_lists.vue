<template>
    <div class="box">
        <div>
            <label>筛选：</label>
            <el-input v-model="name" style="width:217px"></el-input>
            <el-button type="primary" style="margin-left:40px;" @click="seach">搜索</el-button>
        </div>
        <el-table :data="tableData" class="oo">
            <el-table-column type="expand">
                <template slot-scope="props">
                    <el-form label-position="left" inline class="demo-table-expand">
                        <el-form-item label="收款名称" label-width="90px">
                            <span>{{ props.row.receiving_name }}</span>
                        </el-form-item>
                        <el-form-item label="收款账号" label-width="90px">
                            <span>{{ props.row.receiving_account }}</span>
                        </el-form-item>
                        <el-form-item label="开户行" label-width="90px">
                            <span>{{ props.row.opening_bank }}</span>
                        </el-form-item>
                        <el-form-item label="备注" label-width="90px">
                            <span>{{ props.row.remarks }}</span>
                        </el-form-item>
                        <el-form-item label="提交时间" label-width="90px">
                            <span>{{ props.row.add_time }}</span>
                        </el-form-item>
                    </el-form>
                </template>
            </el-table-column>
            <el-table-column label="备货未结算" prop="product_stockup_supplier_money">
                <template slot-scope="scope">
                    <el-button type="text" v-if="scope.row.status < 2" @click="jiner(scope.row,'product_stockup_supplier_money')">{{scope.row.product_stockup_supplier_money}}</el-button>
                    <span  v-if="scope.row.status >= 2">{{scope.row.product_stockup_supplier_money}}</span>
                </template>
            </el-table-column>
            <el-table-column label="订单" prop="purchase_product_money">
                <template slot-scope="scope">
                    <el-button type="text" v-if="scope.row.status < 2" @click="jiner(scope.row,'purchase_product_money')">{{scope.row.purchase_product_money}}</el-button>
                    <span  v-if="scope.row.status >= 2">{{scope.row.purchase_product_money}}</span>
                </template>
            </el-table-column>
            <el-table-column label="产生的售后" prop="supplier_after_sales_money">
                <template slot-scope="scope">
                    <el-button type="text" v-if="scope.row.status < 2" @click="jiner(scope.row,'supplier_after_sales_money')">{{scope.row.supplier_after_sales_money}}</el-button>
                    <span  v-if="scope.row.status >= 2">{{scope.row.supplier_after_sales_money}}</span>
                </template>
            </el-table-column>
            <el-table-column label="运费未结算" prop="express_cost_prepayment">
                <template slot-scope="scope">
                    <el-button type="text" v-if="scope.row.status < 2" @click="jiner(scope.row,'express_cost_prepayment')">{{scope.row.express_cost_prepayment}}</el-button>
                    <span  v-if="scope.row.status >= 2">{{scope.row.express_cost_prepayment}}</span>
                </template>
            </el-table-column>
            <el-table-column label="状态" prop="status">
                <template slot-scope="scope">
                    <span v-if="scope.row.status == 0">已提交</span>
                    <span v-if="scope.row.status == 1">财务已审核</span>
                    <span v-if="scope.row.status == 2">出纳已打款</span>
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

        <!-- 添加供应商结算款项明细 -->
        <el-dialog title="供应商款项明细" :visible.sync="dialogMingxi" width="60%">
            <el-table :data="mingxi" show-summary>
                <el-table-column label="添加时间">
                    <template slot-scope="scope">
                        <span>{{scope.row.add_time}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="订单客户">
                    <template slot-scope="scope">
                        <span>{{scope.row.company_name}}/{{scope.row.customer_name}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="金额" prop="money"></el-table-column>
                <el-table-column label="销售员">
                    <template slot-scope="scope">
                        <span>{{scope.row.dep_title}}/{{scope.row.user_name}}</span>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data(){
        return {
            name:'',  // 搜索
            tableData:[],//表格数据
            currentPage:0,//当前页
            total:0,//总数
            per_page:0,//每页多少条
            last_page:0,//总页数
            dialogMingxi:false,
            mingxi:[],
        }
    },
    methods:{
        gettableData(){
            this.axios.get('/erp.supplier/supplier_money_lists').then(res => {
                this.tableData = res.data.supplier_payee.data;
                this.currentPage = res.data.supplier_payee.current_page;
                this.total = res.data.supplier_payee.total;
                this.per_page = res.data.supplier_payee.per_page;
                this.last_page = res.data.supplier_payee.last_page;
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
            this.axios.post('/erp.supplier/supplier_money_lists',{
                page:val,
                name:this.name
            }).then(res => {
                this.tableData = res.data.supplier_payee.data;
                this.currentPage = res.data.supplier_payee.current_page;
                this.total = res.data.supplier_payee.total;
                this.per_page = res.data.supplier_payee.per_page;
                this.last_page = res.data.supplier_payee.last_page;
                loading.close();
            })  
        },
        seach(){
            this.axios.post('/erp.supplier/supplier_money_lists',{
                name:this.name
            }).then(res => {
                this.tableData = res.data.supplier_payee.data;
                this.currentPage = res.data.supplier_payee.current_page;
                this.total = res.data.supplier_payee.total;
                this.per_page = res.data.supplier_payee.per_page;
                this.last_page = res.data.supplier_payee.last_page;
            })  
        },
        jiner(a,b){
            this.axios.get('/erp.supplier/supplier_money_select?start_time='+a.start_time+'&end_time='+a.end_time+'&id='+a.supplier_id+'&action='+b).then(res => {
                this.mingxi = res.data.express_cost
                this.dialogMingxi = true;
            })
        },
    },
    created(){
        this.gettableData();
    }
}
</script>

<style lang="less">
.box{
    .oo{
        .demo-table-expand {
            font-size: 0;
        }
        .demo-table-expand label {
            width: 90px;
            color: #99a9bf;
        }
        .demo-table-expand .el-form-item {
            margin-right: 0;
            margin-bottom: 0;
        }
    }
}
</style>
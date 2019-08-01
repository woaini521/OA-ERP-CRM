<template>
    <div class="box">
        <div class="head_box">
            <label>筛选：</label>
            <el-input v-model="seach" style="width:217px"></el-input>
            <el-button type="primary" style="margin-left:40px;">搜索</el-button>
        </div>
        <div class="content_box">
            <el-table :data="tableData">
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <el-table :data="scope.row.product_stock" v-if="scope.row.product_stock != null">
                            <el-table-column label="供应商" prop="supplier_name"></el-table-column>
                            <el-table-column label="数量" prop="number"></el-table-column>
                            <el-table-column label="单价" prop="purchase_price"></el-table-column>
                            <el-table-column label="仓库类型" prop="type">
                                 <template slot-scope="scopes">
                                    <span v-if="scopes.row.type == 0">本地储存</span>
                                    <span v-if="scopes.row.type == 1">外部储存</span>
                                 </template>
                            </el-table-column> 
                            <el-table-column label="状态">
                                <template slot-scope="scopes">
                                    <span v-if="scopes.row.status == 0">已提交</span>
                                    <span v-if="scopes.row.status == 1">财务已审核</span>
                                    <span v-if="scopes.row.status == 2">出纳已付款</span>
                                </template>
                            </el-table-column> 
                            <el-table-column label="操作">
                                <template slot-scope="scope">
                                    <el-button type="primary" v-if="scope.row.status == 0" size="mini" @click="updata(scope.row)">更新</el-button>
                                    <el-button type="danger" v-if="scope.row.status == 0" size="mini" @click="deteles(scope.row)">删除</el-button>
                                    <span v-if="scope.row.status > 0">无法操作</span>
                                </template>
                            </el-table-column>     
                        </el-table>
                        <h4 v-else>暂无采购信息</h4>
                    </template>
                </el-table-column>
                <el-table-column label="产品名称">
                    <template slot-scope="scope">
                        <span>{{ scope.row.name}}{{ scope.row.class_name}}</span>
                    </template>
                </el-table-column>
                 <el-table-column label="数量" prop="number"></el-table-column>
                  <el-table-column label="状态">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status == 0">提交</span>
                        <span v-if="scope.row.status == 3">审核完等待采购</span>
                        <span v-if="scope.row.status == 5">采购完毕</span>
                        <span v-if="scope.row.status == 6">等待出纳付款</span>
                        <span v-if="scope.row.status == 9">完成</span>
                    </template>
                </el-table-column>
                <el-table-column label="录入人" prop="user_name"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.status < 5" type="primary" size="small" @click="purchase(scope.row)">采购</el-button>
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


        <el-dialog title="备货" :visible.sync="dialogPurchase" width="50%">
            <el-form :model="dialogPurchaseForm">
                <el-form-item label="供应商" label-width="90px">
                    <el-select v-model="dialogPurchaseForm.supplier_id" placeholder="请选择"  style="width:300px">
                        <el-option
                        v-for="item in supplier"
                        :key="item.supplier_id"
                        :label="item.supplier_name"
                        :value="item.supplier_id">
                            <span style="float: left">{{ item.supplier_name }}</span>
                            <span style="float: right; color: #8492a6; font-size: 13px">采购量{{ item.number }}---单价{{ item.selling_price }}</span>
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="储存类型" label-width="90px">
                    <el-radio v-model="dialogPurchaseForm.type" label="0">本地储存</el-radio>
                    <el-radio v-model="dialogPurchaseForm.type" label="1">外部储存</el-radio>
                </el-form-item>
                <el-form-item label="结算方式" label-width="90px">
                    <el-radio v-model="dialogPurchaseForm.settlement " label="0">现结算</el-radio>
                    <el-radio v-model="dialogPurchaseForm.settlement " label="1">后结算</el-radio>
                </el-form-item>
                <el-form-item label="数量" label-width="90px">
                    <el-input style="width:300px" v-model="dialogPurchaseForm.number"></el-input>
                </el-form-item>
                <el-form-item label="单价" label-width="90px">
                    <el-input style="width:300px" v-model="dialogPurchaseForm.purchase_price"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogPurchase = false">取 消</el-button>
                <el-button type="primary" @click="addPurchase">确 定</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
export default {
    data(){
        return{
            seach:'',//搜索
            tableData:[], // table 数据
            currentPage:'',//当前页
            total:'',//总数
            per_page:'',//每页多少条
            last_page:'',//总页数
            supplier:[], // 供应商数据
            dialogPurchase:false,//采购弹窗
            dialogPurchaseForm:{//采购表单
              product_stock_id:'',  //  备货流程id
              product_sku_id:'',  // 产品id
              number:'',// 数量
              supplier_id:'', // 供应商id
              purchase_price:'',  // 单价
              type:'', // 仓库类型
              settlement:'', // 结算方式
              id:'',
            }
        }
    },
    methods:{
        // 获取数据
        gettableData(){
            this.axios.get('/erp.Purchase/purchase_product_stockup_supplier_lists').then(res => {
                this.tableData = res.data.product_stock.data;
                this.currentPage = res.data.product_stock.current_page;
                this.total = res.data.product_stock.total;
                this.per_page = res.data.product_stock.per_page;
                this.last_page = res.data.product_stock.last_page;
            })
        },
        // fenye
        handleCurrentChange(val) {
            const loading = this.$loading({
                lock: true,
                text: '拼命加载中',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            this.axios.post('/erp.Purchase/purchase_product_stockup_supplier_lists',{
                page:val,
            }).then(res => {
                this.tableData = res.data.product_stock.data;
                this.currentPage = res.data.product_stock.current_page;
                loading.close();
            
            })  
        },
        // 获取 供应商 数据
        getsupplier(a){
            this.axios.get('/erp.Purchase/purchase_product_stockup_supplier_add?product_sku_id='+a).then(res => {
                this.supplier = res.data.product_supplier;
            })
        },
        // 采购按钮
        purchase(a){
              this.getsupplier(a.product_sku_id);
              this.dialogPurchase = true;
              this.dialogPurchaseForm.product_stock_id = a.id;  
              this.dialogPurchaseForm.product_sku_id = a.product_sku_id;  
              this.dialogPurchaseForm.number = ''; 
              this.dialogPurchaseForm.supplier_id = ''; 
              this.dialogPurchaseForm.purchase_price = ''; 
              this.dialogPurchaseForm.id = '';
              this.dialogPurchaseForm.type = '';
              this.dialogPurchaseForm.settlement = '0';
        },
        //更新按钮 
        updata(a){
              this.getsupplier(a.product_sku_id);
              this.dialogPurchase = true;
              this.dialogPurchaseForm.product_stock_id = a.product_stock_id;  
              this.dialogPurchaseForm.product_sku_id = a.product_sku_id;  
              this.dialogPurchaseForm.number = a.number; 
              this.dialogPurchaseForm.supplier_id = a.supplier_id; 
              this.dialogPurchaseForm.purchase_price = a.purchase_price; 
              this.dialogPurchaseForm.id = a.id;
              this.dialogPurchaseForm.type = String(a.type);
              this.dialogPurchaseForm.settlement = String(a.settlement);
        },
        // 提交 添加  更新  数据
        addPurchase(){
            if(this.dialogPurchaseForm.id == ''){
                this.axios.post('/erp.Purchase/purchase_product_stockup_supplier_add',{
                    product_stock_id:this.dialogPurchaseForm.product_stock_id,
                    product_sku_id:this.dialogPurchaseForm.product_sku_id,
                    number:this.dialogPurchaseForm.number,
                    supplier_id:this.dialogPurchaseForm.supplier_id,
                    purchase_price:this.dialogPurchaseForm.purchase_price,
                    money:`${this.dialogPurchaseForm.number * this.dialogPurchaseForm.purchase_price}`,
                    type:this.dialogPurchaseForm.type,
                    settlement:this.dialogPurchaseForm.settlement,
                }).then(res => {
                    if(res.data.code == 2000){
                        this.open(res.data.msg,'success');
                        this.gettableData();
                        this.dialogPurchase = false;
                    }else{
                        this.open(res.data.msg,'error');
                    } 
                })
            }else{
               this.axios.post('/erp.Purchase/purchase_product_stockup_supplier_update',{
                    product_stock_id:this.dialogPurchaseForm.product_stock_id,
                    product_sku_id:this.dialogPurchaseForm.product_sku_id,
                    number:this.dialogPurchaseForm.number,
                    supplier_id:this.dialogPurchaseForm.supplier_id,
                    purchase_price:this.dialogPurchaseForm.purchase_price,
                    money:`${this.dialogPurchaseForm.number * this.dialogPurchaseForm.purchase_price}`,
                    type:this.dialogPurchaseForm.type,
                    settlement:this.dialogPurchaseForm.settlement,
                    id:this.dialogPurchaseForm.id,
                }).then(res => {
                    if(res.data.code == 2000){
                        this.open(res.data.msg,'success');
                        this.gettableData();
                        this.dialogPurchase = false;
                    }else{
                        this.open(res.data.msg,'error');
                    } 
                }) 
            }
        },
        
        //删除按钮
        deteles(a){
           this.axios.post('/erp.Purchase/purchase_product_stockup_supplier_delete',{
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
.box{
    .head_box{
        margin-top: 20px;
    }
}
</style>

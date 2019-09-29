<template>
    <div class="box">
        <div class="head_box">
            <label>筛选：</label>
            <el-input v-model="name" style="width:217px"></el-input>
            <el-button type="primary" style="margin-left:40px;" @click="seach">搜索</el-button>
        </div>
        <div class="content_box">
            <el-table :data="tableData">
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <el-table :data="scope.row.product_stock" v-if="scope.row.product_stock != null">
                            <el-table-column label="供应商" prop="supplier_name"></el-table-column>
                            <el-table-column label="数量" prop="number"></el-table-column>
                            <el-table-column label="单价" prop="purchase_price"></el-table-column>
                            <el-table-column label="运费" prop="freight_price"></el-table-column>
                            <el-table-column label="总金额" prop="money"></el-table-column>
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
                            <el-table-column label="操作" width="210">
                                <template slot-scope="scope">
                                    <el-button type="primary" v-if="scope.row.status == 0" size="mini" @click="updata(scope.row)">更新</el-button>
                                    <el-button type="danger" v-if="scope.row.status == 0" size="mini" @click="deteles(scope.row)">删除</el-button>
                                    <el-button type="danger" v-if="scope.row.status == 0" size="mini" @click="Printing(scope.row)">打印</el-button>
                                </template>
                            </el-table-column>     
                        </el-table>
                        <h4 v-else>暂无采购信息</h4>
                    </template>
                </el-table-column>
                <el-table-column label="产品名称">
                    <template slot-scope="scope">
                        <span>{{ scope.row.name }}{{ scope.row.class_name }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="数量" prop="number" width="130"></el-table-column>
                <el-table-column label="申请时间" prop="add_time"  width="160"></el-table-column>
                <el-table-column label="状态"  width="130">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status == 0">提交</span>
                        <span v-if="scope.row.status == 3">审核完等待采购</span>
                        <span v-if="scope.row.status == 5">采购完毕</span>
                        <span v-if="scope.row.status == 6">等待出纳付款</span>
                        <span v-if="scope.row.status == 9">完成</span>
                    </template>
                </el-table-column>
                <el-table-column label="录入人" prop="user_name"  width="90"></el-table-column>
                <el-table-column label="操作" width="110">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.status < 5" type="primary" size="mini" @click="purchase(scope.row)">采购</el-button>
                        <span v-else>已采购</span>
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
                <el-form-item label="运费" label-width="90px">
                    <el-input style="width:300px" v-model="dialogPurchaseForm.freight_price"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogPurchase = false">取 消</el-button>
                <el-button type="primary" @click="addPurchase">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="打印备货信息" :visible.sync="dialogPrinting" class="dayin" width="65%">
            <div id="printTestBeihuo">
                <div class="dayin" style="width:100%">
                    <p style="text-align:center;font-size:20px;margin-bottom:10px">备货订单</p>
                    <template v-if="PrintingArr.length >0">
                        <p>备货编号:{{PrintingArr[0].id}} <span style="margin-left:50px">申请日期:{{PrintingArr[0].add_time}}</span><span style="margin-left:50px">打印日期:{{time}}</span></p>
                    
                        <p><span>供应商名称：{{PrintingArr[0].supplier_name}}</span><span style="margin-left:30px">供应商地址：{{PrintingArr[0].province}}{{PrintingArr[0].city}}{{PrintingArr[0].county}}</span> <span style="margin-left:30px;">付款方式:</span></p>
                  
                        <el-table :data="PrintingArr" class="dada" :header-cell-style="{color:'#000'}" show-summary>
                            <el-table-column label="产品" prop="sku_id"></el-table-column>
                            <el-table-column label="名称">
                                <template slot-scope="scope">
                                    <span>{{ scope.row.class_name }}{{ scope.row.name }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="数量" prop="number"></el-table-column>
                            <el-table-column label="单价" prop="purchase_price"></el-table-column>
                            <el-table-column label="运费" prop="freight_price"></el-table-column>
                            <el-table-column label="总金额" prop="money"></el-table-column>
                            <el-table-column label="采购" prop="purchase_name" width="80px"></el-table-column>
                            <el-table-column label="备注">
                                <template slot-scope="scope">
                                    <span>{{scope.row.remarks}}</span>
                                </template>
                            </el-table-column>
                        </el-table>
                    </template>
                    <!--  <template v-if="fixedAddress.length>0">
                      <p>备注： {{fixedAddress[0].remarks}}</p>
                    </template>
                    <div style="margin-top:20px">
                        <p v-for="item in tableData" :key="item.id">开户行：{{item.opening_bank}} <span style="margin-left:10px">收款人：</span> {{item.receiving_name}}<span style="margin-left:10px">收款账号：</span>{{item.receiving_account}} </p>
                    </div>   -->

                    <p style="margin-top:10px"><span>采购主管：</span><span style="margin-left:25%">部门经理：</span><span style="margin-left:25%">财务：</span></p>
                </div>
            </div>
            <el-button type="primary" v-print="'#printTestBeihuo'" style="float: right;margin-top:20px;margin-bottom:20px">确 定</el-button>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data(){
        return{
            name:'',//搜索
            tableData:[], // table 数据
            currentPage:0,//当前页
            total:0,//总数
            per_page:0,//每页多少条
            last_page:0,//总页数
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
                freight_price:'',
                id:'',
            },
            //打印
            dialogPrinting:false,
            PrintingArr:[],
            time:'',

        }
    },
    methods:{
        seach(){
            this.axios.post('/erp.Purchase/purchase_product_stockup_supplier_lists',{
                name:this.name,
            }).then(res => {
                this.tableData = res.data.product_stock.data;
                this.currentPage = res.data.product_stock.current_page;
                this.total = res.data.product_stock.total;
                this.per_page = res.data.product_stock.per_page;
                this.last_page = res.data.product_stock.last_page;
            })
        },
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
                    freight_price:this.dialogPurchaseForm.freight_price,
                    money:`${ Number(this.dialogPurchaseForm.number) * Number(this.dialogPurchaseForm.purchase_price) + Number(this.dialogPurchaseForm.freight_price)}`,
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
                    freight_price:this.dialogPurchaseForm.freight_price,
                    money:`${ Number(this.dialogPurchaseForm.number) * Number(this.dialogPurchaseForm.purchase_price) + Number(this.dialogPurchaseForm.freight_price)}`,
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
        //打印按钮
        Printing(a){
            console.log(a)
            this.PrintingArr = []
            this.PrintingArr.push(a);
            let d=new Date();
            let year=d.getFullYear();
            let month=this.change(d.getMonth()+1);
            let day=this.change(d.getDate());
            let hour=this.change(d.getHours());
            let minute=this.change(d.getMinutes());
            let second=this.change(d.getSeconds());
            this.time = year+'-'+month+'-'+day+' '+hour+':'+minute+':'+second;
            this.dialogPrinting = true;
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

</style>

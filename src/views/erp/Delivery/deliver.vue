<template>
    <div class="box">
        <div class="head_box_man">
           <el-table :data="shuju">
               <el-table-column label="产品" prop="name"></el-table-column>
               <el-table-column label="数量" prop="number"></el-table-column>
               <el-table-column label="收货人" prop="address_name"></el-table-column>
               <el-table-column label="收货人号码" prop="address_phone"></el-table-column>
               <el-table-column label="收货地址" width="450px">
                   <template slot-scope="scope">
                       <span>{{scope.row.address_province}}{{scope.row.address_city}}{{scope.row.address_county}}{{scope.row.address_address}}</span>
                   </template>
               </el-table-column>
           </el-table>
        </div>
        <div class="content_box_wuliu">
            <el-button type="primary" @click="openWuliu">添加物流信息</el-button>
            <el-table :data="tableDataWuliu">
                <el-table-column label="物流公司" prop="express_name"></el-table-column>
                <el-table-column label="快递单号" prop="express_numbers"></el-table-column>
                <el-table-column label="快递联系方式" prop="express_phone"></el-table-column>
                <el-table-column label="备注" prop="remarks"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" @click="Feiyong(scope.row)">费用</el-button>
                        <el-button type="warning" size="mini" @click="edit(scope.row)">修改</el-button>
                        <el-button type="danger" size="mini" @click="deletes(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <div class="content_box_feiyong">
            <label>费用</label>
            <el-table :data="tableDataFeiyong">
                <el-table-column label="物流公司" prop="express_name"></el-table-column>
                <el-table-column label="费用" prop="prepayment"></el-table-column>
                <el-table-column label="付款方式">
                    <template slot-scope="scope">
                        <span>{{status1[scope.row.payment_method]}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="付款账户" prop="payment_account"></el-table-column>
                <el-table-column label="结算方式">
                    <template slot-scope="scope">
                        <span>{{status2[scope.row.type]}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <span>{{status3[scope.row.status]}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="修改">
                    <template slot-scope="scope">
                        <el-button type="warning" v-if="scope.row.status == 0" size="small" @click="editFeiyong(scope.row)">修改</el-button>
                         <el-button type="warning" v-else size="small" @click="editFeiyong(scope.row)" disabled>修改</el-button>   
                        <el-button type="danger" size="small" v-if="scope.row.status == 0" @click="deletesFeiyong(scope.row)">删除</el-button>
                        <el-button type="danger" size="small" v-else @click="deletesFeiyong(scope.row)" disabled>删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <!-- 物流弹窗 -->
        <el-dialog title="物流" :visible.sync="dialogWuliu">
            <el-form :model="dialogWuliuForm" ref="dialogWuliuForm">
                <el-form-item label="物流公司" label-width="100px" prop="value">
                    <el-select v-model="dialogWuliuForm.value" clearable placeholder="请选择" style="width:317px">
                        <el-option
                        v-for="item in options"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="快递编号" label-width="100px" prop="CourierNumber">
                    <el-input v-model="dialogWuliuForm.CourierNumber" style="width:317px"></el-input>
                </el-form-item>
                <el-form-item label="快递联系方式" label-width="100px" prop="CourierNumber">
                    <el-input v-model="dialogWuliuForm.phone" style="width:317px"></el-input>
                </el-form-item>
                <el-form-item label="备注" label-width="100px" prop="remark">
                    <el-input type="textarea" v-model="dialogWuliuForm.remark" style="width:317px;"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogWuliu = false">取 消</el-button>
                <el-button type="primary" @click="addWuliu">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 费用弹窗 -->
        <el-dialog title="费用" :visible.sync="dialogFeiyong">
            <el-form :model="dialogFeiyongForm">
                <el-form-item label="付款方式" label-width="90px">
                    <el-radio v-model="dialogFeiyongForm.payment" label="0">无</el-radio>
                    <el-radio v-model="dialogFeiyongForm.payment" label="1">微信</el-radio>
                    <el-radio v-model="dialogFeiyongForm.payment" label="2">支付宝</el-radio>
                    <el-radio v-model="dialogFeiyongForm.payment" label="3">银行卡</el-radio>
                </el-form-item>
                <el-form-item label="付款账号" label-width="90px">
                    <el-input v-model="dialogFeiyongForm.payment_account" style="width:317px;"></el-input>
                </el-form-item>
                <el-form-item label="类型" label-width="90px">
                    <el-radio v-model="dialogFeiyongForm.type" label="0">自费</el-radio>
                    <el-radio v-model="dialogFeiyongForm.type" label="1">整体结算</el-radio>
                    <el-radio v-model="dialogFeiyongForm.type" label="2">月结算</el-radio>
                </el-form-item>
                <el-form-item label="费用" label-width="90px">
                    <el-input v-model="dialogFeiyongForm.money" style="width:317px;"></el-input>
                </el-form-item>
                <el-form-item label="备注" label-width="90px">
                    <el-input type="textarea" v-model="dialogFeiyongForm.remark" style="width:317px;"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFeiyong = false">取 消</el-button>
                <el-button type="primary" @click="addFeiyong">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data(){
        return{
            shuju:'',//头数据
            tableData:[],//物流表格数据
            feiyongform:{
                value:''
            },// 费用表单
            options: [],// 物流公司列表
            dialogWuliu:false,//物流弹窗
            dialogWuliuForm:{
                value:'',
                CourierNumber:'',
                number:'',
                phone:'',
                id:'',
                remark:''
            },
            dialogFeiyong:false, // 费用弹窗
            dialogFeiyongForm:{
                money:'',
                remark:'',
                payment:'',
                payment_account:'',
                type:'',
                express_id:'',
                customer_order_id:'',
                id:'',
            },
            tableDataWuliu:[], // 物流信息数据
            tableDataFeiyong:[], // 费用信息数据
            status1:['无','微信','支付宝','银行卡'],
            status2:['自费','整体结算','月结'],
            status3:['等待财务审核','等待出纳审核','审核通过'],
        }
    },
    methods:{
        getshuju(){
            this.axios.get('/erp.Delivery/delivery_order_find?supplier_id='+this.$route.params.supplier_id+'&customer_order_id='+this.$route.params.customer_order_id+'&customer_order_purchase_id='+this.$route.params.customer_order_purchase_id).then(res => {
                this.shuju = res.data.purchase_product;
                this.options = res.data.express;
                this.tableDataWuliu = res.data.order_express;
                this.tableDataFeiyong = res.data.order_express_cost;
            })
        },
        // 打开添加物流信息弹窗
        openWuliu(){
            let sj = '';
            for(let i = 0; i<this.shuju.length;i++){
                sj += `${this.shuju[i].sku_name}${this.shuju[i].name}:\n`
            }
            this.dialogWuliu = true;
            this.dialogWuliuForm.value = '';
            this.dialogWuliuForm.CourierNumber = '';
            this.dialogWuliuForm.phone = '';
            this.dialogWuliuForm.id = '';
            this.dialogWuliuForm.remark = sj;
        },
        // 提交物流信息
        addWuliu(){
            if(this.dialogWuliuForm.id == ''){
                this.axios.post('/erp.Delivery/delivery_order_express_add',{
                customer_order_id:this.$route.params.customer_order_id,
                supplier_id:this.$route.params.supplier_id,
                customer_order_purchase_id:this.$route.params.customer_order_purchase_id,
                express_id:this.dialogWuliuForm.value,
                express_numbers:this.dialogWuliuForm.CourierNumber,
                express_phone:this.dialogWuliuForm.phone,
                remarks:this.dialogWuliuForm.remark,
                }).then(res => {
                    if(res.data.code == 2000){
                        this.open(res.data.msg,'success');
                        this.$refs['dialogWuliuForm'].resetFields();
                        this.getshuju();
                        this.dialogWuliu = false;
                    }else{
                        this.open(res.data.msg,'error');
                    }
                }).catch(res =>{
                    this.open('请联系管理员','error');   
                })
            }else{
                this.axios.post('/erp.Delivery/delivery_order_express_update',{
                   customer_order_id:this.$route.params.customer_order_id,
                   supplier_id:this.$route.params.supplier_id,
                   customer_order_purchase_id:this.$route.params.customer_order_purchase_id,
                   express_id:this.dialogWuliuForm.value,
                   express_numbers:this.dialogWuliuForm.CourierNumber,
                   express_phone:this.dialogWuliuForm.phone,
                   remarks:this.dialogWuliuForm.remark, 
                   id:this.dialogWuliuForm.id,
                }).then(res => {
                    if(res.data.code == 2000){
                        this.open(res.data.msg,'success');
                        this.$refs['dialogWuliuForm'].resetFields();
                        this.getshuju();
                        this.dialogWuliu = false;
                    }else{
                        this.open(res.data.msg,'error');
                    }
                })
            }
            
            
        },
        // 物流费用按钮
        Feiyong(a){
            this.dialogFeiyong = true;
            this.dialogFeiyongForm.money = '';
            this.dialogFeiyongForm.remark = '';
            this.dialogFeiyongForm.payment = '';
            this.dialogFeiyongForm.payment_account = '';
            this.dialogFeiyongForm.id = '';
            this.dialogFeiyongForm.type = '';
            this.dialogFeiyongForm.express_id = a.id;
            this.dialogFeiyongForm.customer_order_id = a.customer_order_id;
        },
        // 物流 修改按钮
        edit(a){
            this.dialogWuliuForm.value = a.express_id;
            this.dialogWuliuForm.CourierNumber = a.express_numbers;
            this.dialogWuliuForm.phone = a.express_phone;
            this.dialogWuliuForm.id = a.id;
            this.dialogWuliuForm.remark = a.remarks;
            this.dialogWuliu = true;
        },
        // 物流 删除按钮
        deletes(a){
            this.axios.post('/erp.Delivery/delivery_order_express_delete',{
                id:a.id
            }).then(res => {
                if(res.data.code == 2000){
                    this.open(res.data.msg,'success');
                    this.getshuju();
                }else{
                    this.open(res.data.msg,'error'); 
                }
            })
        },
        // 费用提交
        addFeiyong(){
            if(this.dialogFeiyongForm.id == ''){
                this.axios.post('/erp.Delivery/delivery_order_express_cost_add',{
                customer_order_id:this.dialogFeiyongForm.customer_order_id,
                customer_order_express_id:this.dialogFeiyongForm.express_id,
                payment_method:this.dialogFeiyongForm.payment,
                payment_account:this.dialogFeiyongForm.payment_account,
                type:this.dialogFeiyongForm.type,
                prepayment:this.dialogFeiyongForm.money,
                remarks:this.dialogFeiyongForm.remark
                }).then(res => {
                    if(res.data.code == 2000){
                        this.open(res.data.msg,'success');
                        this.getshuju();
                        this.dialogFeiyong = false;
                    }else{
                        this.open(res.data.msg,'error'); 
                    }
                })
            }else{
                this.axios.post('/erp.Delivery/delivery_order_express_cost_update',{
                id:this.dialogFeiyongForm.id,
                payment_method:this.dialogFeiyongForm.payment,
                payment_account:this.dialogFeiyongForm.payment_account,
                type:this.dialogFeiyongForm.type,
                prepayment:this.dialogFeiyongForm.money,
                remarks:this.dialogFeiyongForm.remark,
                }).then(res => {
                    if(res.data.code == 2000){
                        this.open(res.data.msg,'success');
                        this.getshuju();
                        this.dialogFeiyong = false;
                    }else{
                        this.open(res.data.msg,'error'); 
                    }
                })   
            }
            
        },
        // 费用修改按钮
        editFeiyong(a){
            this.dialogFeiyong = true;
            this.dialogFeiyongForm.money = a.prepayment;
            this.dialogFeiyongForm.remark = a.remarks;
            this.dialogFeiyongForm.payment = String(a.payment_method);
            this.dialogFeiyongForm.payment_account = a.payment_account;
            this.dialogFeiyongForm.id = a.id;
            this.dialogFeiyongForm.type = String(a.type);
            this.dialogFeiyongForm.express_id = '';
            this.dialogFeiyongForm.customer_order_id = '';
        },
        // 费用删除
        deletesFeiyong(a){
            this.axios.post('/erp.Delivery/delivery_order_express_cost_delete',{
                id:a.id
            }).then(res => {
                if(res.data.code == 2000){
                    this.open(res.data.msg,'success');
                    this.getshuju();
                }else{
                    this.open(res.data.msg,'error'); 
                }
            })
        },
         // 公用弹窗
        open(a,b){
            this.$message({
                message: a,
                type: b
            });
        },
    },
    created(){
        this.getshuju();
    },
    watch:{
        $route(to){
            if(!this.$route.params.supplier_id){

            }else{
                this.getshuju();
            }
        }
    }
}
</script>

<style lang="less" scoped>
.head_box_man{
    margin-top: 10px;
}
.content_box_wuliu,.content_box_feiyong{
    margin-top: 20px;
    border: 1px solid #CCC;
    padding: 20px;
}
</style>

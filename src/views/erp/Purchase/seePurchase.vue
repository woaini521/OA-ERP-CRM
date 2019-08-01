<template>
    <div class="box">
        <div class="head_box_man">
                <h3>
                    <span>客户姓名：</span><span>{{name}}</span> 
                    <span style="margin-left: 40px;">客户电话：</span><span>{{phone}}</span> 
                    <span style="margin-left: 40px;">销售日期：</span><span>{{time}}</span>
                    <span style="margin-left: 40px;">销售员：</span><span>{{user}}</span> 
                </h3>
            </div>
        <div class="head_box_table">
                <el-table :data="headBoxTable">
                    <el-table-column prop="id" label="产品编号" ></el-table-column>
                    <el-table-column label="产品名称" width="350px">
                        <template slot-scope="scope">
                            <span>{{scope.row.name}}{{scope.row.sku_name}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="unit" label="单位" ></el-table-column>
                    <el-table-column prop="cost_price" label="成本价" ></el-table-column>
                    <el-table-column prop="selling_price" label="销售单价" ></el-table-column>
                    <el-table-column prop="number" label="数量" ></el-table-column>
                    <el-table-column label="销售总价" >
                        <template slot-scope="scope">
                            <span>{{scope.row.selling_price * scope.row.number}}</span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        <div class="head_box_address">
                <div class="generatedAddressInner" v-for="item in fixedAddress" :key="item.id">
                    <div class="generatedAddressInnerLeft">
                        <div  class="generatedAddressInnerLeft1">
                            <p>
                                <span>收货人：{{item.name}}</span>
                                <span style="margin-left:20px;">收货电话：{{item.phone}}</span> <span style="margin-left:60px;">{{item.type}}</span>
                            </p>
                            <p style="margin-top:10px">
                                <span>{{item.province}}</span>
                                <span style="margin-left:20px;">{{item.city}}</span>
                                <span style="margin-left:20px;">{{item.county}}</span>
                                <span style="margin-left:20px;">{{item.address}}</span>
                            </p>
                            <p style="margin-top:10px">发货清单：
                                <span style="meflt:argin-10px;" v-for="pcu in item.product" :key="pcu.pid">{{pcu.name}}{{pcu.sku_name}}---数量：{{pcu.number}}</span>
                            </p>
                            <p style="margin-top:10px;">备注信息：{{ item.remarks }}</p>
                        </div>
                        <template v-if="item.purchase">
                            <div  class="generatedAddressInnerLeft2">
                                <h4>已配货信息：</h4>
                                <div v-for="fu in item.purchase" :key="fu.id" style="margin-top:5px;">
                                    <p>
                                        <span>付款方式：</span><span>{{ fu.payment == 1 ? '物流现付' : '物流到付'}}</span>
                                        <span style="margin-left:10px">物流方式：</span><span>{{ state[fu.delivery] }}</span>
                                        <span style="margin-left:10px">运费：</span><span>{{ fu.freight_price }}</span>
                                        <span style="margin-left:10px">备注：</span><span>{{ fu.remarks }}</span>
                                    </p>
                                    <el-table :data="fu.product">
                                        <el-table-column label="产品">
                                            <template slot-scope="scope">
                                                <span>{{ scope.row.name }}{{ scope.row.sku_name }}</span>
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="供应商" prop="supplier_name"></el-table-column>
                                        <el-table-column label="数量" prop="number"></el-table-column>
                                        <el-table-column label="成本价(每个)" prop="purchase_price"></el-table-column>
                                    </el-table>
                                </div>
                            </div>
                        </template>
                    </div>
                </div>       
            </div>
        <div class="head_box_payment">
            <label>货款支出</label>
            <el-form ref="formpayment" :model="formpayment" inline style="margin-top:10px;">
                   <el-form-item prop="value">
                    <el-select v-model="formpayment.value" placeholder="供应商" style="width:400px;">
                       <el-option v-for="item in Supplierformpayment" :key="item.supplier_payee_id" :label="`${item.supplier_name}${item.receiving_name}${item.receiving_account}${item.name}${item.sku_name}`" :value="item.supplier_payee_id">
                           <span style="float: left;font-size: 20px">{{ item.supplier_name }}</span>
                           <span style="float: left;font-size: 16px;margin-left:10px;margin-right:10px;">{{ item.receiving_name }}:{{ item.receiving_account }}</span> 
                           <span style="float: right; color: #8492a6; font-size: 13px">{{ item.name }}{{ item.sku_name }}</span>         
                       </el-option>
                    </el-select>    
                   </el-form-item>  
                   <el-form-item prop="qian">
                       <el-input placeholder="费用" style="width:120px;" v-model="formpayment.qian"></el-input>
                   </el-form-item>
                   <el-form-item prop="remark">
                       <el-input placeholder="备注" style="width:340px;"  v-model="formpayment.remark"></el-input>
                   </el-form-item>
                   <el-form-item>
                       <el-button type="primary" @click="Addpayment">添加</el-button>
                   </el-form-item>
            </el-form>
                <el-table :data="tablePayment">
                    <el-table-column prop="id" label="订单"></el-table-column>
                    <el-table-column prop="supplier_name" label="供应商"></el-table-column>
                    <el-table-column prop="receiving_name" label="收款人"></el-table-column>
                    <el-table-column prop="receiving_name" label="收款账号"></el-table-column>
                    <el-table-column label="金额" prop="prepayment"></el-table-column>
                    <el-table-column label="状态" prop="status">
                        <template slot-scope="scope">
                            <span v-if="scope.row.status == 0">等待财务审核</span>
                            <span v-if="scope.row.status == 1">等待出纳打款</span>
                            <span v-if="scope.row.status == 2">审核通过</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button v-if="scope.row.status == 0" type="primary" size="small" @click="edits(scope.row)">修改</el-button>
                            <el-button v-if="scope.row.status == 0" type="danger" size="small" @click="deletes(scope.row)">删除</el-button>   

                            <el-button v-if="scope.row.status > 0" type="primary" size="small" @click="edits(scope.row)" disabled>修改</el-button>
                            <el-button v-if="scope.row.status > 0" type="danger" size="small" @click="deletes(scope.row)" disabled>删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            
            <!-- 货款支出修改 -->
        <el-dialog title="货款支出修改" :visible.sync="paymentModify">
            <el-form :model="formpaymentedit">
                <el-form-item label-width="120px;" label="供应商" prop="value">
                    <el-select v-model="formpaymentedit.value" placeholder="供应商" style="width:400px;">
                       <el-option v-for="item in Supplierformpayment" :key="item.supplier_payee_id" :label="`${item.supplier_name}${item.receiving_name}${item.receiving_account}${item.name}${item.sku_name}`" :value="item.supplier_payee_id">
                           <span style="float: left;font-size: 20px">{{ item.supplier_name }}</span>
                           <span style="float: left;font-size: 16px;margin-left:10px;margin-right:10px;">{{ item.receiving_name }}:{{ item.receiving_account }}</span> 
                           <span style="float: right; color: #8492a6; font-size: 13px">{{ item.name }}{{ item.sku_name }}</span>         
                       </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="qian" label-width="120px;" label="费用">
                    <el-input style="width:120px;" v-model="formpaymentedit.qian"></el-input>
                </el-form-item>
                <el-form-item prop="remark" label-width="120px;" label="备注">
                    <el-input style="width:340px;"  v-model="formpaymentedit.remark" ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="paymentModify = false">取 消</el-button>
                <el-button type="primary" @click="updatapayment">确 定</el-button>
            </div> 
        </el-dialog>
    </div>
</template>

<script>
import {mapActions} from 'vuex';

export default {
    data(){
        return{
            // 销售信息
            name:'',
            phone:'',
            time:'',
            user:'',
            headBoxTable:[],// 数据表格
            state:['','上门','上楼','自提'],     
            // 地址配货信息
            fixedAddress:[
                {
                    id:0,
                    name:'GT',
                    phone:'110',
                    type:'送货上门',
                    province:'湖南省',
                    city:'长沙市',
                    county:'芙蓉区',
                    address:'2号',
                    product:[
                        {
                           name:'笔', 
                           pid:1,
                           sku_name:'bai',
                           number:'300',
                        }
                    ],
                    remarks:'易燃易爆，小心'
                }
            ], 
            dialogFormProduct:false, // 配货弹窗
            Distribution:{
                id:'',
                payment:'',
                delivery:'',
                freight_price:'',
                remarks:'',
                transfer:false, // 中专地址选择
                purchase_price:'',
                customer_order_address_id:'',
            }, // 弹窗配货form
            Supplier:[], // 供应商
            tableData:[
                {
                    name:'beizi',
                    number:100,
                    cost:'2.00',
                    value:'1'
                },
                {
                    name:'beizi',
                    number:100,
                    cost:'2.00',
                    value:'1'
                },
                {
                    name:'beizi',
                    number:100,
                    cost:'2.00',
                    value:'1'
                }
            ],
            multipleSelection: [],
            headModify:false, // 配货信息头部修改

       
            headModifyform:{  // 配货信息头部修改表单

            }, 



            formpayment:{
                value:'',
                qian:'',
                remark:'',
            },
            formpaymentedit:{
                value:'',
                qian:'',
                remark:'',
                id:'',
            },
            
            Supplierformpayment:[], // 预付款供应商
            tablePayment:[], // 预付款列表
            paymentModify:false,
        }
    },
    methods:{
      
        handleSelectionChange(val) {
            this.multipleSelection = val;
           // console.log(this.multipleSelection);
        },
        
        // 获取表格
        getheadBoxTable(){
            this.axios.get('/erp.Purchase/purchase_order_product_sku_select?id='+this.$route.params.id).then(res => {
                this.headBoxTable = res.data.product_sku;
            })
        },
        getkehu(){
            this.axios.get('/erp.Purchase/purchase_customer_order_update?id='+this.$route.params.id).then(res => {
                this.name = res.data.customer_name;
                this.phone = res.data.customer_working_phone;
                this.time = res.data.sales_time;
                this.user = res.data.user_name;
            })
        },

        // 获取地址
         getfixedAddress(){
            this.axios.get('/erp.Purchase/purchase_order_address_product_select?id='+this.$route.params.id).then(res => {
                this.fixedAddress = res.data.address;
            })
        },
       
        



        // 获取预付款供应商
        getSupplierformpayment(){
            this.axios.get('/erp.purchase/purchase_order_supplier_payee_select?id='+this.$route.params.id).then(res => {
                this.Supplierformpayment = res.data;
            })
        },

        
        // 获取供应商预付款列表
        gettablePayment(){
            this.axios.get('/erp.Purchase/purchase_order_supplier_advance_select?id='+this.$route.params.id).then(res => {
                this.tablePayment = res.data.advance_charge;
            })
        },
      

         Addpayment(){
            if(this.formpayment.value == "" || this.formpayment.qian == "" || this.formpayment.remark == ""){
                this.open('填写完整，在进行申请','error');
            }else{
                this.axios.post('/erp.Purchase/purchase_order_advance_charge_add',{
                    customer_order_id:this.$route.params.id,
                    supplier_payee_id:this.formpayment.value,
                    prepayment:this.formpayment.qian,
                    remarks:this.formpayment.remark,
                }).then(res => {
                    if(res.data.code == 2000){
                        this.open(res.data.msg,'success');
                        this.$refs['formpayment'].resetFields(); 
                        this.gettablePayment();
                    }else{
                       this.open(res.data.msg,'error'); 
                    }
                })
            }
        },
        //修改供应商预付款
        edits(a){
            this.paymentModify = true;
            this.formpaymentedit.value = a.supplier_payee_id;
            this.formpaymentedit.qian = a.prepayment;
            this.formpaymentedit.remark = a.remarks;
            this.formpaymentedit.id = a.id;
        },
        // 提交预付款修改
        updatapayment(){
            this.axios.post('/erp.Purchase/purchase_order_advance_charge_update',{
                customer_order_id:this.$route.params.id,
                supplier_payee_id:this.formpaymentedit.value,
                prepayment:this.formpaymentedit.qian,
                remarks:this.formpaymentedit.remark, 
                id:this.formpaymentedit.id
            }).then(res => {
                if(res.data.code == 2000){
                    this.open(res.data.msg,'success');
                    this.gettablePayment();
                    this.paymentModify = false;
                    this.$refs['formpaymentedit'].resetFields(); 
                    
                }else{
                    this.open(res.data.msg,'error'); 
                }
            })
        },
        // 删除供应商预付款
        deletes(a){
            this.axios.post('/erp.Purchase/purchase_order_advance_charge_delete',{
                id:a.id,
            }).then(res => {
                if(res.data.code == 2000){
                    this.open(res.data.msg,'success');
                    this.gettablePayment();
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
            this.getheadBoxTable();
            // this.getkehu();
            this.getfixedAddress();
            this.gettablePayment();
            this.getSupplierformpayment(); 
    },
    watch:{
        $route(to){
            if(!this.$route.params.id){
            
            }else{
                this.getheadBoxTable();
                this.getkehu();
                this.getfixedAddress();
                this.gettablePayment();
                this.getSupplierformpayment();                     
            }   
        }  
    } 
}
</script>

<style lang="less" scoped>
.box{
    min-width: 1250px;
    .head_box_man{
        color: #303133;
    }
    .head_box_table{
        margin-top: 10px;
    }
    .head_box_address{
        margin-top: 10px;
        .generatedAddressInner{
            border: 1px solid #CCC;
            overflow: hidden;
            padding: 20px;
            margin-top: 10px;
            .generatedAddressInnerLeft{
                overflow: hidden;;
                
                .generatedAddressInnerLeft1{
                    float: left;
                    width: 600px;
                }
                .generatedAddressInnerLeft2{
                    float: left;
                    width: 600px;
                }
            }
        }
    }
    .head_box_payment{
        border: 1px solid #CCC;
        margin-top: 20px;
        padding: 20px;    
    }
    
}
.abc li{
        height: 70px;
    }
</style>


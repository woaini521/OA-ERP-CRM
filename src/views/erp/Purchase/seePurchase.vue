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
                    <el-table-column label="销售总价"  prop="total_price"></el-table-column>
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
                                        <el-table-column label="合计">
                                            <template slot-scope="scope">
                                                <span>{{ (scope.row.number*scope.row.purchase_price).toFixed(4) }}</span>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </div>
                            </div>
                        </template>
                    </div>
                </div>       
            </div>
        <div class="head_box_payment">
            <label>费用支出</label>
            <el-form ref="formpayment" :model="formpayment" inline style="margin-top:10px;">
                <el-form-item label="仓库">
                    <el-radio v-model="formpayment.type" label="1">本地仓库</el-radio>
                    <el-radio v-model="formpayment.type" label="2">供应商</el-radio>
                </el-form-item>
                <el-form-item label="结算方式" style="margin-left: 80px;">
                    <el-radio v-model="formpayment.settlement" label="0">现结</el-radio>
                    <el-radio v-model="formpayment.settlement" label="1">月结</el-radio>
                </el-form-item>
                <el-form-item label="费用类型" label-width="90px"  style="margin-left: 80px;">
                    <el-radio v-model="formpayment.class" label="0">订单</el-radio>
                    <el-radio v-model="formpayment.class" label="1">运费</el-radio>
                    <el-radio v-model="formpayment.class" label="2">版费</el-radio>
                </el-form-item>
                <br>
                <el-form-item prop="value">
                        <el-select v-model="formpayment.value" placeholder="供应商" style="width:400px;">
                            <el-option v-for="item in Supplierformpayment" :key="item.supplier_payee_id" :label="`${item.supplier_name}${item.receiving_name}${item.receiving_account}${item.name}${item.sku_name}`" :value="`${item.id},${item.supplier_payee_id},${item.product_sku_id}`">
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

                <el-table :data="tablePayment" class="tablePayment">
                    <el-table-column type="expand">
                        <template slot-scope="props">
                            <el-form label-position="left" class="demo-table-expand">
                                <el-form-item label="产品名称" label-width="90px">
                                    <span>{{ props.row.name }}</span>
                                </el-form-item>
                                <el-form-item label="开户行" label-width="90px">
                                    <span>{{ props.row.opening_bank }}</span>
                                </el-form-item>
                                <el-form-item label="备注" label-width="90px">
                                    <span>{{ props.row.remarks }}</span>
                                </el-form-item>
                            </el-form>
                        </template>
                    </el-table-column>
                    <el-table-column prop="id" label="订单" width="50px"></el-table-column>
                    <el-table-column prop="supplier_name" label="供应商" width="200px"></el-table-column>
                    <el-table-column prop="receiving_name" label="收款人" width="180px"></el-table-column>
                    <el-table-column label="结算方式" width="90px">
                        <template slot-scope="scope">
                            <span>{{ scope.row.settlement == 1 ?'月结':'现结' }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="发货"  width="90px">
                        <template slot-scope="scope">
                            <span>{{ scope.row.type == 1 ?'本地仓库':'供应商' }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="费用类型" prop="class">
                            <template slot-scope="scope">
                            <span v-if="scope.row.class == 0">订单</span>
                            <span v-if="scope.row.class == 1">运费</span>
                            <span v-if="scope.row.class == 2">版费</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="金额" prop="prepayment"></el-table-column>
                    <el-table-column label="状态">
                        <template slot-scope="scope">
                            <span v-if="scope.row.status == -1">等待巴长审核</span>
                            <span v-if="scope.row.status == 0">等待财务审核</span>
                            <span v-if="scope.row.status == 1">等待出纳打款</span>
                            <span v-if="scope.row.status == 2">审核通过</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="240px">
                        <template slot-scope="scope">
                            <el-button v-if="scope.row.status == -1" type="danger" size="small" @click="shenhe(scope.row)">巴长审核</el-button>
                            <el-button v-if="scope.row.status == -1" type="primary" size="small" @click="edits(scope.row)">修改</el-button>
                            <el-button v-if="scope.row.status == -1" type="danger" size="small" @click="deletes(scope.row)">删除</el-button> 
                            <template v-if="scope.row.settlement == 0">
                                <el-button v-if="scope.row.status > 0" type="primary" size="small" @click="edits(scope.row)" disabled>修改</el-button>
                                <el-button v-if="scope.row.status > 0" type="danger" size="small" @click="deletes(scope.row)" disabled>删除</el-button>
                            </template>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <el-button @click="danimei" style="margin-top:10px">打印信息</el-button>
            <!-- 货款支出修改 -->
        <el-dialog title="货款支出修改" :visible.sync="paymentModify">
            <el-form :model="formpaymentedit">
                <el-form-item label="仓库" label-width="90px">
                    <el-radio v-model="formpaymentedit.type" label="1">本地仓库</el-radio>
                    <el-radio v-model="formpaymentedit.type" label="2">供应商</el-radio>
                </el-form-item>
                <el-form-item label="结算方式" label-width="90px">
                    <el-radio v-model="formpaymentedit.settlement" label="0">现结</el-radio>
                    <el-radio v-model="formpaymentedit.settlement" label="1">月结</el-radio>
                </el-form-item>
                <el-form-item label="费用类型" label-width="90px">
                    <el-radio v-model="formpaymentedit.class" label="0">订单</el-radio>
                    <el-radio v-model="formpaymentedit.class" label="1">运费</el-radio>
                    <el-radio v-model="formpaymentedit.class" label="2">产品含税</el-radio>
                </el-form-item>
                <el-form-item  label-width="90px" label="供应商" prop="value">
                    <el-select v-model="formpaymentedit.value" placeholder="供应商" style="width:400px;">
                       <el-option v-for="item in Supplierformpayment" :key="item.supplier_payee_id" :label="`${item.supplier_name}${item.receiving_name}${item.receiving_account}${item.name}${item.sku_name}`" :value="`${item.id},${item.supplier_payee_id},${item.product_sku_id}`">
                           <span style="float: left;font-size: 20px">{{ item.supplier_name }}</span>
                           <span style="float: left;font-size: 16px;margin-left:10px;margin-right:10px;">{{ item.receiving_name }}:{{ item.receiving_account }}</span> 
                           <span style="float: right; color: #8492a6; font-size: 13px">{{ item.name }}{{ item.sku_name }}</span>         
                       </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="qian"  label-width="90px" label="费用">
                    <el-input style="width:120px;" v-model="formpaymentedit.qian"></el-input>
                </el-form-item>
                <el-form-item prop="remark"  label-width="90px" label="备注">
                    <el-input style="width:340px;"  v-model="formpaymentedit.remark" ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="paymentModify = false">取 消</el-button>
                <el-button type="primary" @click="updatapayment">确 定</el-button>
            </div> 
        </el-dialog>

        <el-dialog title="打印订单信息" :visible.sync="dialogPrinting" class="dayin" width="65%">
            <div v-for="(item,index) in Dayin" :key="index" :id="`printTest${index}`" @click="da=true">
                <div class="dayin" style="width:100%">
                    <p style="text-align:center;font-size:20px;margin-bottom:10px">采购订单</p>
                    <p>订单编号:{{item.advance_charge[0].customer_order_id}} <span style="margin-left:50px">订单日期:{{item.advance_charge[0].add_time}}</span><span style="margin-left:50px">打印日期:{{time}}</span></p>
                    <p>供应商编号：12131321 <span style="margin-left:50px">供应商名称：{{item.supplier_name}}</span></p>
                    <p>联系人：{{item.supplier_user_name}} <span style="margin-left:30px">联系电话：{{item.supplier_user_phone}}</span><span style="margin-left:30px">供应商地址：{{item.province}}{{item.city}}{{item.county}}{{item.address}} </span></p>

                    <el-table :data="item.advance_charge" class="dada" :header-cell-style="{color:'#000'}" show-summary>
                        <el-table-column label="产品编号" width="100">
                            <template slot-scope="scope">
                                <span>{{ scope.row.product_sku_id }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="产品名称" width="250px">
                            <template slot-scope="scope">
                                <span>{{scope.row.name}}{{scope.row.dy_name}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="单位" width="50px">
                             <template slot-scope="scope">
                                <span>{{scope.row.dy_unit}}</span>
                            </template>
                        </el-table-column>
                        <!-- <el-table-column label="采购单价" >
                            <template slot-scope="scope">
                                <span>{{ (Number(scope.row.prepayment) / Number(scope.row.dy_number)).toFixed(4) }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="数量" >
                            <template slot-scope="scope">
                                <span>{{scope.row.dy_number}}</span>
                            </template>
                        </el-table-column> -->
                        <el-table-column label="采购总价" prop="prepayment"></el-table-column>
                        <el-table-column label="采购" prop="user_name" width="80px"></el-table-column>
                        <el-table-column label="备注">
                            <template slot-scope="scope">
                                <span>{{scope.row.remarks}}</span>
                            </template>
                        </el-table-column>
                        
                    </el-table>
                    <p>备注： {{item.remarks}}</p>
                    <div style="margin-top:20px">
                        <p>开户行：{{item.opening_bank}} <span style="margin-left:10px">收款人：</span> {{item.receiving_name}}<span style="margin-left:10px">收款账号：</span>{{item.receiving_account}} </p>
                    </div>
                    <el-table :data="headBoxTable"  class="dada" style="margin-top:10px">
                        <el-table-column prop="id" label="产品编号" ></el-table-column>
                        <el-table-column label="产品名称" width="300px">
                            <template slot-scope="scope">
                                <span>{{scope.row.name}}{{scope.row.sku_name}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="unit" label="单位" ></el-table-column>
                        <el-table-column prop="selling_price" label="销售单价" ></el-table-column>
                        <el-table-column prop="number" label="数量" ></el-table-column>
                        <el-table-column label="销售总价"  prop="total_price"></el-table-column>
                    </el-table>

                    <p style="margin-top:10px"><span>采购主管：</span><span style="margin-left:25%">部门经理：</span><span style="margin-left:25%">财务：</span></p>
                </div>
                <el-button type="primary" v-show="da" @click="da = false" v-print="`#printTest${index}`" style="float: right;margin-top:20px;margin-bottom:20px">确 定</el-button>
                <div style="clear:both"></div>
            </div>
         
      </el-dialog>
    </div>
</template>

<script>
import {mapActions} from 'vuex';

export default {
    data(){
        return{
            da:true,
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
                settlement:'',
                class:'',
                type:'',
                qian:'',
                remark:'',
            },
            formpaymentedit:{
                value:'',
                qian:'',
                class:'',
                remark:'',
                settlement:'',
                type:'',
                id:'',
            },
            
            Supplierformpayment:[], // 预付款供应商
            tablePayment:[], // 预付款列表
            paymentModify:false,

            // 打印
            Dayin:[],
            dialogPrinting:false, 
            time:'',
            P_data:[],
            ren:'',
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
                this.Dayin = res.data.supplier;
            })
        },
      

         Addpayment(){
            if(this.formpayment.value == "" || this.formpayment.value == null || this.formpayment.qian == "" || this.formpayment.type == "" || this.formpayment.settlement == "" || this.formpayment.class == ""){
                this.open('填写完整，在进行申请','error');
            }else{
                this.axios.post('/erp.Purchase/purchase_order_advance_charge_add',{
                    customer_order_id:this.$route.params.id,
                    customer_order_product_sku_id:this.formpayment.value,
                    prepayment:this.formpayment.qian,
                    remarks:this.formpayment.remark,
                    type:this.formpayment.type,
                    settlement:this.formpayment.settlement,
                    class:this.formpayment.class,
                }).then(res => {
                    if(res.data.code == 2000){
                        this.open(res.data.msg,'success');
                        this.formpayment.type = '';
                        this.formpayment.settlement = '';
                        this.formpayment.class = '';
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
            this.formpaymentedit.value = `${a.customer_order_product_sku_id},${a.supplier_payee_id},${a.product_sku_id}`;
            this.formpaymentedit.qian = a.prepayment;
            this.formpaymentedit.remark = a.remarks;
            this.formpaymentedit.id = a.id;
            this.formpaymentedit.type = String(a.type);
            this.formpaymentedit.settlement = String(a.settlement);
            this.formpaymentedit.class = String(a.class);
        },
        // 提交预付款修改
        updatapayment(){
            this.axios.post('/erp.Purchase/purchase_order_advance_charge_update',{
                customer_order_id:this.$route.params.id,
                customer_order_product_sku_id:this.formpaymentedit.value,
                prepayment:this.formpaymentedit.qian,
                remarks:this.formpaymentedit.remark, 
                id:this.formpaymentedit.id,
                type:this.formpaymentedit.type,
                settlement:this.formpaymentedit.settlement,
                class:this.formpaymentedit.class,
            }).then(res => {
                if(res.data.code == 2000){
                    this.open(res.data.msg,'success');
                    this.gettablePayment();
                    this.formpaymentedit.type = '';
                    this.formpaymentedit.settlement = '';
                    this.formpaymentedit.class = '';
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
        // 巴长审核
        shenhe(a){
            this.axios.post('/erp.Purchase/purchase_order_advance_charge_status',{
                id:a.id,
                customer_order_id:a.customer_order_id
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
        danimei(){
            this.dialogPrinting = true; 
            this.ren = JSON.parse(localStorage.getItem('name'));
        },
      
    },
    // created(){
    //         this.getheadBoxTable();
    //         // this.getkehu();
    //         this.getfixedAddress();
    //         this.gettablePayment();
    //         this.getSupplierformpayment(); 
    // },
    activated(){
       
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
</script>

<style lang="less">
.box{
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
                    width: 48%;
                }
                .generatedAddressInnerLeft2{
                    float: left;
                    width: 48%;
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
.dayin{
  color: #000 !important;
  .dada{
    color: #000 !important;
    th>.cell{
      color: #000 !important;
    }
  }
  .dada td,.dada th{
    padding-top: 0px !important;
    padding-bottom: 0px !important;
}
  .cell{
      color: #000;
  }
}
.tablePayment{
    .demo-table-expand {
        font-size: 0;
    }
    .demo-table-expand label {
        color: #99a9bf;
    }
    .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
    }
}
</style>


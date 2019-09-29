<template>
    <div class="box" @click="show = true">
        <div class="head_box_man">
                <h3>
                    <span>客户姓名：</span><span>{{name}}</span> 
                    <span style="margin-left: 40px;">销售日期：</span><span>{{time}}</span>
                    <span style="margin-left: 40px;">销售员：</span><span>{{user}}</span> 
                </h3>
                <h3 style="margin-top:10px">备注:{{beizhu}}</h3>
            </div>
        <div class="head_box_table">
                <el-table :data="headBoxTable">
                    <el-table-column prop="id" label="产品编号" ></el-table-column>
                    <el-table-column label="产品名称" width="350">
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
        <el-button v-show="tong == 1" @click="tongbu" style="margin-top:10px">一建同步</el-button>
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
                                <span style="meflt:argin-10px;" v-for="pcu in item.product" :key="pcu.id">{{pcu.name}}{{pcu.sku_name}}---数量：{{pcu.number}}</span>
                            </p>
                            <p style="margin-top:10px">
                                <span>付款方式:{{ item.payment == 1 ? '到付' : '现付'}}</span>
                                <span style="margin-left:20px;">物流方式:{{ state[item.delivery] }}</span>
                            </p>
                            <p style="margin-top:10px;">备注信息：{{ item.remarks }}</p>
                            <el-button type="primary" style="margin-top:20px;" @click="Purchase(item)" v-show="show">采购设置</el-button>
                        </div>
                        <template v-if="item.purchase">
                            <div  class="generatedAddressInnerLeft2">
                                <h4>已配货信息：</h4>
                                <div v-for="fu in item.purchase" :key="fu.id" style="margin-top:5px;">
                                    <p>
                                        <span style="margin-left:10px">备注：</span><span>{{ fu.remarks }}</span>
                                        <el-button style="margin-right:10px;float: right;" size="mini" type="danger" @click="deleteDistributionhead(fu)" v-show="show">删除</el-button>
                                        <el-button style="margin-right:10px;float: right;" size="mini" type="primary" @click="editDistributionHead(fu)" v-show="show">修改</el-button>
                                    </p>
                                    <el-table :data="fu.product">
                                        <el-table-column label="产品">
                                            <template slot-scope="scope">
                                                <span>{{ scope.row.name }}{{ scope.row.sku_name }}</span>
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="供应商" prop="supplier_name"></el-table-column>
                                        <el-table-column label="数量" prop="number"></el-table-column>
                                        <el-table-column label="运费" prop="freight_price"></el-table-column>
                                        <el-table-column label="成本价(每个)" prop="purchase_price"></el-table-column>
                                    </el-table>
                                </div>
                            </div>
                        </template>
                    </div>
                </div>       
            </div>
        <el-button style="margin-top:20px;margin-bottom:20px;" :disabled="this.fixedAddress.length == 0" type="primary" @click="Confirm" v-show="show">确认提交</el-button>
       
        <!-- 采购设置form弹出 -->
        <el-dialog title="采购配货" :visible.sync="dialogFormProduct" width="70%">
            <el-form :model="Distribution" ref="Distribution" inline>
                <!-- <el-form-item label="运费" label-width="90px" prop="freight_price">
                    <el-input v-model="Distribution.freight_price" placeholder="费用,默认0不需要走财务审核" style="width:300px;"></el-input>
                </el-form-item>
                <br> -->
                <el-form-item label="备注" label-width="90px" prop="remarks">
                    <el-input v-model="Distribution.remarks"  style="width:400px;"></el-input>
                </el-form-item>
                <el-checkbox v-model="Distribution.transfer">中转单</el-checkbox><span>自动新增地址到湖南可为</span>
            </el-form>
            <div class="product">
                  <el-table 
                    ref="multipleTable"
                    :data="tableData"
                    tooltip-effect="dark"
                    style="width: 100%"
                    @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55"></el-table-column> 
                    <el-table-column label="产品">
                        <template slot-scope="scope">
                            <span>{{scope.row.name}}{{scope.row.sku_name}}</span>
                        </template>
                    </el-table-column>  
                    <el-table-column label="是否含票">
                        <template slot-scope="scope">
                            <el-radio v-model="scope.row.invoice" label="1">含票</el-radio>
                            <el-radio v-model="scope.row.invoice" label="0">不含票</el-radio>
                        </template>
                    </el-table-column>
                    <el-table-column label="数量">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.number" placeholder="数量" style="width:80%"></el-input>
                        </template>
                    </el-table-column> 
                    <el-table-column label="成本">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.cost_price" placeholder="成本" style="width:80%"></el-input>
                        </template>
                    </el-table-column> 
                    <el-table-column label="发货">
                        <template slot-scope="scope">
                            <el-radio v-model="scope.row.delivery" label="1">厂发</el-radio>
                            <el-radio v-model="scope.row.delivery" label="2">仓库发</el-radio>
                        </template>
                    </el-table-column>
                    <el-table-column label="供应商" width="250">
                        <template slot-scope="scope">
                            <el-select v-model="scope.row.supplier_id"  placeholder="请选择" popper-class="abc">
                                <el-option v-for="item in scope.row.supplier" :key="item.id" :label="`${item.supplier_name}--库存${ item.inventory_number }`" :value="item.supplier_id">
                                    <span style="float: left">{{ item.supplier_name }}</span>
                                    <span v-if="item.inventory_number != 0" style="float: right;color: #8492a6;font-size: 13px;">库存{{ item.inventory_number }}</span>
                                    <br>
                                    <span style="float: left;width:100%;color: #8492a6;font-size: 13px;">采购数量为{{item.number}}---{{ item.cost_price }}￥</span>
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>   
                  </el-table>
            </div>

            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel()">取 消</el-button>
                <el-button type="primary" @click="DistributionAdd">确 定</el-button>
            </div>    
        </el-dialog>

        <!-- 采购信息修改 -->
        <el-dialog title="采购信息修改" :visible.sync="headModify" width="70%">
            <el-form :model="Distribution" ref="Distribution" inline>
                <!-- <el-form-item label="运费" label-width="90px" prop="freight_price">
                    <el-input v-model="Distribution.freight_price" placeholder="费用,默认0不需要走财务审核" style="width:300px;"></el-input>
                </el-form-item>
                <br> -->
                <el-form-item label="备注" label-width="90px" prop="remarks">
                    <el-input v-model="Distribution.remarks"  style="width:400px;"></el-input>
                </el-form-item>
                <el-checkbox v-model="Distribution.transfer">中转单</el-checkbox><span>自动新增地址到湖南可为</span>
            </el-form>
            <div class="product">
                  <el-table 
                    ref="multipleTable"
                    :data="tableData"
                    tooltip-effect="dark"
                    style="width: 100%">
                    <el-table-column label="产品">
                        <template slot-scope="scope">
                            <span>{{scope.row.name}}{{scope.row.sku_name}}</span>
                        </template>
                    </el-table-column> 
                    <el-table-column label="是否含票">
                        <template slot-scope="scope">
                           <el-radio v-model="scope.row.invoice" :label="piao.a">含票</el-radio>
                           <el-radio v-model="scope.row.invoice" :label="piao.b">不含票</el-radio>
                        </template>
                    </el-table-column>
                    <el-table-column label="数量">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.number" placeholder="数量" style="width:80%"></el-input>
                        </template>
                    </el-table-column> 
                    <el-table-column label="成本">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.purchase_price" placeholder="成本" style="width:80%"></el-input>
                        </template>
                    </el-table-column> 
                    <el-table-column label="发货">
                        <template slot-scope="scope">
                            <el-radio v-model="scope.row.delivery" :label="huo.a">厂发</el-radio>
                            <el-radio v-model="scope.row.delivery" :label="huo.b">仓库发</el-radio>
                        </template>
                    </el-table-column>
                    <el-table-column label="供应商">
                        <template slot-scope="scope">
                            <el-select v-model="scope.row.supplier_id"  placeholder="请选择" popper-class="abc" style="width:80%" >
                                <el-option v-for="item in scope.row.supplier" :key="item.id" :label="`${item.supplier_name}--库存${ item.inventory_number }`" :value="item.supplier_id">
                                    <span style="float: left;">{{ item.supplier_name }}</span>
                                    <span v-if="item.inventory_number != 0" style="float: right;color: #8492a6;font-size: 13px;">库存{{ item.inventory_number }}</span>
                                    <br>
                                    <span style="float: left;width:100%;color: #8492a6;font-size: 13px;">采购数量为{{item.number}}---{{ item.cost_price }}￥</span>
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>   
                </el-table>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelheadModify()">取 消</el-button>
                <el-button type="primary" @click="updataHead">确 定</el-button>
            </div> 
        </el-dialog>
    </div>
</template>

<script>
import {mapActions} from 'vuex';
import { setTimeout } from 'timers';

export default {
    data(){
        return{
            show:true,
            // 销售信息
            name:'',
            phone:'',
            time:'',
            user:'',
            beizhu:'',
            headBoxTable:[],// 数据表格
            state:['','到楼下','上楼','自提'],     
            // 地址配货信息
            tong:'', // 控制一键同步
            fixedAddress:[], 
            dialogFormProduct:false, // 配货弹窗
            Distribution:{
                id:'',
                payment:'',
                delivery:'',
                remarks:'',
                transfer:false, // 中专地址选择
                purchase_price:'',
                customer_order_address_id:'',
            }, // 弹窗配货form
            Supplier:[], // 供应商
            tableData:[],
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
            piao:{
                a:0,
                b:1,
            },
            huo:{
                a:1,
                b:2,
            }
        }
    },
    methods:{
        ...mapActions("Tabs", ['triggerDeleteTabs']),
        keep(a){
            alert(a);
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
           // console.log(this.multipleSelection);
        },
        Purchase(a){
            this.dialogFormProduct = true;
            this.tableData = a.product;
            this.Distribution.id = a.id; 
            this.Distribution.payment = '';
            this.Distribution.delivery = '';
            this.Distribution.remarks = '';
            this.Distribution.transfer = false;    
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
                this.beizhu = res.data.remarks;
            })
        },

        // 获取地址
         getfixedAddress(){
            this.axios.get('/erp.Purchase/purchase_order_address_product_select?id='+this.$route.params.id).then(res => {
                this.fixedAddress = res.data.address;
                if(res.data.address[0].purchase.length == 0){
                    this.tong = 0;
                }else{
                    this.tong = 1
                }
            })
        },
        tongbu(){
           this.axios.get('/erp.Purchase/purchase_order_address_product_one_click_sync?id='+this.$route.params.id).then(res => {
               if(res.data.code == 2000){
                    this.getfixedAddress();
                    this.tong = 0  
                }else{
                    this.open(res.data.msg,'error');
                }
               
            }) 
        },
        // 取消配货信息
        cancel(){
            this.$refs['Distribution'].resetFields();
            this.$refs.multipleTable.clearSelection();  
            //this.getfixedAddress();
            this.dialogFormProduct = false;
        },
        // 提交配货信息
        DistributionAdd(){
            let check;
            let productArr = [];
            if(this.Distribution.transfer == true){
                check = 1;
            }else{
                check = 0; 
            };
            if(this.multipleSelection.length == 0){
                this.open('勾选产品','error');
            }else{
                for(let i = 0; i<this.multipleSelection.length;i++){
                    let P;
                    if(this.multipleSelection[i].delivery == undefined){
                         P = {
                            customer_order_product_sku_id:this.multipleSelection[i].customer_order_product_sku_id,
                            invoice:this.multipleSelection[i].invoice,
                            number:this.multipleSelection[i].number,
                            supplier_id:this.multipleSelection[i].supplier_id,
                            purchase_price:this.multipleSelection[i].cost_price, 
                            delivery:this.multipleSelection[i].delivery, 
                        };
                    }else{
                         P = {
                            customer_order_product_sku_id:this.multipleSelection[i].customer_order_product_sku_id,
                            invoice:this.multipleSelection[i].invoice,
                            number:this.multipleSelection[i].number,
                            supplier_id:this.multipleSelection[i].supplier_id,
                            purchase_price:this.multipleSelection[i].cost_price, 
                            delivery:this.multipleSelection[i].delivery,
                        };
                    }
                    productArr.push(P);
                   // console.log(productArr)
                };
                if(productArr[0].supplier_id == " " || productArr[0].supplier_id == undefined){
                    this.open('选择供应商','error');
                }else if(productArr[0].invoice == " " || productArr[0].invoice == undefined){
                    this.open('选择是否含票','error');
                }else{
                    this.axios.post('/erp.Purchase/purchase_order_purchase_add',{
                    customer_order_id:this.$route.params.id,
                    customer_order_address_id:this.Distribution.id,
                    payment:this.Distribution.payment,
                    delivery:this.Distribution.delivery,
                    // freight_price:this.Distribution.freight_price,
                    remarks:this.Distribution.remarks,
                    transfer:check, // 中专地址选择   
                    product:productArr,
                  }).then(res => {
                      if(res.data.code == 2000){
                          this.open(res.data.msg,'success');
                           this.$refs['Distribution'].resetFields();
                           this.$refs.multipleTable.clearSelection();
                           this.getSupplierformpayment(); // 提交配货信息后 才进行预付款
                           this.dialogFormProduct = false;
                           this.getfixedAddress();
                      }else{
                          this.open(res.data.msg,'error');
                          this.$refs.multipleTable.clearSelection();
                      }
                  })
                }
                
            };        
        },

        // 修改配货信息头部
        editDistributionHead(a){
            this.axios.get('/erp.purchase/purchase_order_purchase_update?id='+a.id).then(res => {
                let check;
                let productArr = [];
                if(res.data.transfer === 1){
                    check = true;
                }else{
                    check = false; 
                };
                this.headModify = true;
                this.tableData =  res.data.product;
                this.Distribution.delivery = String(res.data.delivery);
                this.Distribution.remarks = res.data.remarks;
                this.Distribution.transfer = check; 
                this.Distribution.id = res.data.id;
                this.Distribution.customer_order_address_id = res.data.customer_order_address_id;
            })   
        },
         // 取消提交修改配货信息
        cancelheadModify(){
           this.$refs['Distribution'].resetFields();  
           this.headModify = false;   
        },
        // 提交修改配货信息
        updataHead(){
            let check,y;
            let productArr = [];
            let shuju = this.tableData;
            if(this.Distribution.transfer === true){
               check = 1;
            }else{
               check = 0; 
            }
            for(let i = 0; i<shuju.length;i++){
                    let P = {
                        customer_order_product_sku_id:shuju[i].customer_order_product_sku_id,
                        invoice:shuju[i].invoice,
                        number:shuju[i].number,
                        supplier_id:shuju[i].supplier_id,
                        purchase_price:shuju[i].purchase_price,
                        id:shuju[i].id,
                        delivery:shuju[i].delivery,
                    };
                    productArr.push(P);
                };
            this.axios.post('/erp.purchase/purchase_order_purchase_update',{
                id:this.Distribution.id,
                customer_order_address_id:this.Distribution.customer_order_address_id,
                customer_order_id:this.$route.params.id,
                payment:this.Distribution.payment,
                delivery:this.Distribution.delivery,

                remarks:this.Distribution.remarks,
                transfer:check,
                product:productArr,
            }).then(res => {
               if(res.data.code == 2000){
                    this.open(res.data.msg,'success');
                    this.$refs['Distribution'].resetFields();   
                    this.getfixedAddress();  //更新   
                    this.headModify = false;    
                }else{
                    this.open(res.data.msg,'error');
                }
          })  
        },
        // 删除配货信息
        deleteDistributionhead(a){
            this.axios.post('/erp.purchase/purchase_order_purchase_delete',{
                id:a.id
            }).then(res => {
                if(res.data.code == 2000){
                    this.open(res.data.msg,'success');
                    this.getfixedAddress();  //更新   
                    this.headModify = false;   
                }else{
                    this.open(res.data.msg,'error');
                }
            })
        },

        // 获取预付款供应商
        getSupplierformpayment(){
            this.axios.get('/erp.purchase/purchase_order_supplier_payee_select?id='+this.$route.params.id).then(res => {
                this.Supplierformpayment = res.data;
            })
        },

        // 提交供应商预付款
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

        // 提交采购
        Confirm(){
         this.axios.post('/erp.Purchase/purchase_customer_order_update',{
                id:this.$route.params.id,
                data_table:'purchase',
            }).then(res => {
                if(res.data.code == 2000){
                   this.triggerDeleteTabs(this.$route.query.path);
                   this.open(res.data.msg,'success');
                   this.$router.push({ path: `/erp/Purchase/seePurchase/${this.$route.params.id}` });
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
        // exhibition(){
        //     this.show = false;
        //     setTimeout(function () {
        //         this.show = true;
        //     }, 1000);

        // }

    },
    created(){
        //console.log(this.$route.params);
            this.getheadBoxTable();
            this.getkehu();
            this.getfixedAddress();
            this.getSupplierformpayment(); 
            // window.onafterprint= this.onafterprint;
    },
    watch:{
        
        $route(to){
            if(!this.$route.params.id){
            
            }else{
                this.getheadBoxTable();
                this.getkehu();
                this.getfixedAddress();
                this.getSupplierformpayment();
            }
            
        }  
    } 
}
</script>

<style lang="less" scoped>
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
                overflow: hidden;
                .generatedAddressInnerLeft1{
                    float: left;
                    width: 50%;
                }
                .generatedAddressInnerLeft2{
                    float: left;
                    width: 50%;
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


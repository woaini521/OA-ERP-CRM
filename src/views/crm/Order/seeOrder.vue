<!-- 模板组件，用于模拟不同路由下的组件显示 -->
<template>
  <div class="box">  
    <div class="head_box">
       <el-select
          v-model="state4"
          filterable
          remote
          reserve-keyword
          placeholder="请输入公司关键词"
          :remote-method="remoteMethod"
          :loading="loading"
          disabled
          @change="kehuName">
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>

        <el-select v-model="kehuValue" disabled filterable placeholder="请选择客户名称" style="margin-left:10px;">
        <el-option
          v-for="item in listKuhuName"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>

        <div class="riqi">
          <div class="xiaohou">
            <span>销售日期</span>
            <el-date-picker
              v-model="starttime"
              disabled
              type="date"
              placeholder="选择日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              style="margin-left:20px;">
            </el-date-picker>
          </div>
          <div class="fahuo">
            <span>收货日期</span>
            <el-date-picker
              v-model="endtime"
              disabled
              type="date"
              placeholder="选择日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              style="margin-left:20px;">
            </el-date-picker>
          </div>
          
        </div>
        <div class="danxuan">
          <div class="danxuan1">
            <el-radio v-model="radio" label="1" disabled>商品</el-radio>
            <el-radio v-model="radio" label="2" disabled>农产品</el-radio>
            <el-radio v-model="radio" label="3" disabled>服务</el-radio>
          </div>
          <div class="danxuan1" style="margin-top: 20px;">
            <el-radio v-model="class_id" label="1" disabled>传统</el-radio>
            <el-radio v-model="class_id" label="2" disabled>线上</el-radio>
            <el-radio v-model="class_id" label="3" disabled>京东</el-radio>
            <el-radio v-model="class_id" label="4" disabled>国美</el-radio>
            <el-radio v-model="class_id" label="5" disabled>负数订单</el-radio>
          </div>
          <br>
          <p>补开票费用:{{repair_invoice}} <span style="margin-left:30px">补运费费用:</span> {{repair_freight}}</p>
          <p>备注：{{ remarks }}</p>
          <br>
          <div class="danxuan2">
            <h4>发票信息:<span>{{invoice_name}}{{invoice_type}}{{invoice_tax}}%</span></h4>
          </div>
        </div>  
        <div class="lirun">
          <span>总销售额:{{ totalprice }}</span>  
          <span style="margin-left:30px;">产品成本:{{ totalcostprice }}</span>
          <span style="margin-left:30px;">销售提成:{{ userprice }}</span>  
          <span style="margin-left:30px;">额外提成:{{ commissionprice }}</span>
          <span style="margin-left:30px;">物流费用:{{ logisticsprice }}</span>   
          <span style="margin-left:30px;">额外费用:{{ extraprice }}</span>
          <span style="margin-left:30px;">开票费用:{{ invoiceprice }}</span>
          <span style="margin-left:30px;">售后费用:{{ aftersalesprice }}</span>
          <br>
          <span style="margin-top:15px;color:#F56C6C;">利润:{{ Number(totalprice) - Number(totalcostprice) - Number(userprice) - Number(logisticsprice) - Number(extraprice) - Number(invoiceprice) - Number(aftersalesprice) | toFixed(3)}}</span> 
        </div>  
    </div>
      <div class="content_box_product">
        <el-table :data="tableData" show-summary style="width: 100%;margin-top:20px">
          <el-table-column  label="图片" width="100">
              <template slot-scope="scope">
                 <img style="width: 90px; height: 90px" :src="scope.row.src">
              </template>
          </el-table-column>
          <el-table-column  prop="name" label="产品名称" width="300px">
              <template slot-scope="scope">
                <span>{{scope.row.name}}{{scope.row.sku_name}}</span>
              </template>
          </el-table-column>
          <el-table-column  label="单位">
            <template  slot-scope="scope">
              <span>{{ scope.row.unit}}</span>
            </template>
          </el-table-column>
          <el-table-column label="数量">
            <template  slot-scope="scope">
              <span>{{ scope.row.number}}</span>
            </template>
          </el-table-column>
          <el-table-column label="成本">
            <template  slot-scope="scope">
              <span>{{ scope.row.cost_price}}</span>
            </template>
          </el-table-column>
          <el-table-column label="单价">
            <template  slot-scope="scope">
              <span>{{ scope.row.selling_price}}</span>
            </template>
          </el-table-column>
          <el-table-column label="总价" prop="total_price"></el-table-column>
          <el-table-column  label="业务提成" v-if="class_id != 5">
            <template slot-scope="scope">
              <el-popover
                  placement="right"
                  width="400"
                  trigger="click">
                  <el-table :data="scope.row.commission" >
                    <el-table-column property="user_name" label="业务员"></el-table-column>
                    <el-table-column property="ratio" label="提成系数"></el-table-column>
                    <el-table-column label="总提成">
                      <template slot-scope="scope1">
                        <span> 
                          ￥{{ (scope.row.selling_price * scope.row.number - scope.row.cost_price * scope.row.number) * scope1.row.ratio | toFixed(3)}} 
                          </span>
                      </template>
                    </el-table-column>
                  </el-table>
                  <el-button slot="reference" type="text" size="mini">查看</el-button>
                </el-popover>
            </template>
          </el-table-column>
          <el-table-column label="总提成" >
            <template  slot-scope="scope">
              <span>{{ scope.row.user_price}}</span>
            </template>
          </el-table-column>
          <el-table-column label="预计利润">
            <template slot-scope="scope">
              <span>{{(Number(scope.row.selling_price)-Number(scope.row.cost_price))*scope.row.number - Number(scope.row.user_price) | toFixed(3)}}</span>
            </template>
          </el-table-column>
          <el-table-column label="备注">
            <template  slot-scope="scope">
              <span>{{ scope.row.remarks}}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="generatedAddress" v-if="class_id != 5">
        <label>地址配货信息</label>
        <hr>
          <div class="generatedAddressInner" v-for="item in fixedAddress" :key="item.id">
            <div class="generatedAddressInnerLeft">
              <p>
                <span>收货人：{{item.name}}</span>
                <span style="margin-left:20px;">收货电话：{{item.phone}}</span> 
                <span style="margin-left:60px;">付款方式:{{ item.payment == 1 ? '到付' : '现付'}}</span>
                <span v-if="item.delivery==1" style="margin-left:20px;">物流方式:上门</span> 
                <span v-if="item.delivery==2" style="margin-left:20px;">物流方式:上楼</span> 
                <span v-if="item.delivery==3" style="margin-left:20px;">物流方式:自提</span>
              </p>
              <p style="margin-top:10px">
                <span>{{item.province}}</span>
                <span style="margin-left:20px;">{{item.city}}</span>
                <span style="margin-left:20px;">{{item.county}}</span>
                <span style="margin-left:20px;">{{item.address}}</span>
              </p>
              <p style="margin-top:10px">发货清单：
                <span style="margin-left:10px;" v-for="pcu in item.product" :key="pcu.pid">{{pcu.name}}{{pcu.sku_name}}---数量：{{pcu.number}}</span>
              </p>
            </div> 
            <div class="caigou">
              
              <label>配货物流信息</label>
              <hr>
                <template v-if="item.purchase != undefined">
                  <div class="caigouInnerbox" v-for="er in item.purchase" :key="er.id">
                      <el-table :data="er.product" style="margin-bottom:10px;">
                            <el-table-column label="产品" width="400px">
                                <template slot-scope="scope">
                                  <span>{{ scope.row.name }}{{ scope.row.sku_name }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="供应商" prop="supplier_name"></el-table-column>
                            <el-table-column label="数量" prop="number"></el-table-column>
                            <el-table-column label="成本价(每个)" prop="purchase_price"></el-table-column>
                            <el-table-column label="操作">
                              <template slot-scope="scope">
                                <el-button type="danger" v-if="item.status < 90" size="mini" @click="shouhou(scope.row)">售后</el-button>
                              </template>
                            </el-table-column>
                      </el-table>    
                      <div v-for="san in er.product" :key="san.id">
                        <template v-if="san.supplier_after_sales == null">
                          <h4>无售后信息</h4>
                        </template> 
                        <template v-else>
                            <label>售后信息</label>
                            <el-table :data="san.supplier_after_sales">
                              <el-table-column label="添加时间" prop="add_time"></el-table-column>
                              <el-table-column label="金额" prop="money"></el-table-column>
                              <el-table-column label="数量" prop="number"></el-table-column>
                              <el-table-column label="备注" prop="remarks"></el-table-column>
                              <el-table-column label="操作">
                                <template slot-scope="scope">
                                    <el-button type="danger" v-if="scope.row.status == 0" size="mini" @click="delete_sh(scope.row)">删除</el-button>
                                    <el-button type="danger" v-if="scope.row.status == 1" size="mini" @click="confirm_sh(scope.row)">完成</el-button>
                                    <span  v-if="scope.row.status == 2">已完成</span>
                                </template>
                              </el-table-column>
                            </el-table>
                        </template> 

                        <el-table :data="san.express" border style="margin-top:10px;">
                          <el-table-column label="物流公司" prop="express_name"></el-table-column>
                          <el-table-column label="物流电话" prop="express_phone"></el-table-column>
                          <el-table-column label="数量" prop="express_numbers"></el-table-column>
                          <el-table-column label="备注" prop="remarks"></el-table-column>
                          <el-table-column label="状态">
                            <template slot-scope="scope">
                                <span>{{ scope.row.status == 1 ? '已收货' : '运输中' }}</span>
                            </template>   
                          </el-table-column>
                          <el-table-column label="操作">
                            <template slot-scope="scope">
                              <el-button type="text" @click="seewuliu(scope.row)" size="mini">查看</el-button>
                            </template>
                          </el-table-column>
                        </el-table>
                      </div>
                  </div>
                </template>
            </div>
          </div>       
      </div>

      <div class="contract"  v-if="class_id != 5">
          <label>合同</label>
          <div class="contractInner">
            <div class="img">
              <div class="imginner" v-for="item in imageUrl" :key="item.src">
                <img :src="item.src" class="avatar">
                <div class="avatars">
                  <i style="font-size: 30px;margin-top: 75px;margin-left: 75px;color:#FFF;" class="el-icon-delete" ></i>
                </div>
              </div>
            </div>
          </div>
      </div>

      <div class="contract"  v-if="class_id != 5" v-show="img1 == true">
          <label>预付款凭证</label>
          <div class="contractInner">
            <div class="img">
              <div class="imginner" v-for="item in imageUrl1" :key="item.src">
                <img :src="item.src" class="avatar">
                <div class="avatars">
                  <i style="font-size: 30px;margin-top: 75px;margin-left: 75px;color:#FFF;" class="el-icon-delete" ></i>
                </div>
              </div>
            </div>
          </div>
      </div>
      


      <el-dialog title="物流信息" :visible.sync="dialogwuliu">
          <el-timeline reverse="false">
              <el-timeline-item
              v-for="(er, index) in express_tracking"
              :key="index"
              :timestamp="er.tracking_time">
                  {{er.tracking_txt}}   {{er.user_name}}
              </el-timeline-item>
          </el-timeline>
      </el-dialog>


      <el-dialog title="售后" :visible.sync="dialogshouhou">
          <el-form :model="formShouhou" ref="formShouhou">
            <el-form-item label="类型" label-width="90px" prop="type">
              <el-checkbox-group v-model="formShouhou.type">
                    <el-checkbox label="1" name="type">补货</el-checkbox>
                    <el-checkbox label="2" name="type">换货</el-checkbox>
                    <el-checkbox label="3" name="type">退货</el-checkbox>
                    <el-checkbox label="4" name="type">退单</el-checkbox>
                    <el-checkbox label="5" name="type">其他</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="费用" label-width="90px" prop="money">
               <el-input v-model="formShouhou.money" placeholder="可以为负数" style="width:217px;"></el-input>
            </el-form-item>
            <el-form-item label="数量" label-width="90px" prop="number">
               <el-input v-model="formShouhou.number" style="width:217px;"></el-input>
            </el-form-item>
            <el-form-item label="备注" label-width="90px" prop="remarks">
               <el-input type="textarea" v-model="formShouhou.remarks" style="width:217px;"></el-input>
            </el-form-item>
            <el-form-item label="" label-width="90px" >
              <el-button @click="addShouhou">提交</el-button>
            </el-form-item>
          </el-form>
      </el-dialog>

      <el-dialog title="完成售后" :visible.sync="dialogconfirm">
          <h3>确认售后已结束 确定订单产生费用</h3>
          <el-form :model="confirmForm" style="margin-top:20px;">
            <el-form-item label="费用" label-width="100px">
              <el-input v-model="confirmForm.money" style="width:217px;"></el-input>
            </el-form-item>
            <el-form-item label=""  label-width="100px">
              <el-button type="primary" @click="addconfirm">确认提交</el-button>
            </el-form-item>
          </el-form>
      </el-dialog>

    </div>
</template>

<script>
import { appendFileSync } from 'fs';
  export default {
    data () {
      return {
        // 客户公司数据
        options: [],
        //  提交第一次数据  获取id值
        state4: '',
        kehuValue:'',
        starttime:'',
        endtime:'',
        radio:'',
        class_id:'',
        repair_invoice:'',
        repair_freight:'',
        // 发票信息  
        invoice_name: '',
        invoice_tax:  '' ,          
        invoice_type:'',
        remarks:'',// 备注信息

        listKuhuName:[],
        totalprice:0, // 总销售额
        totalcostprice:0, // 产品成本
        userprice:0, //销售提成
        commissionprice:0, // 额外提成
        logisticsprice:0, // 物流费用
        extraprice:0, // 额外费用
        invoiceprice:0, // 开票费用
        aftersalesprice:0, // 售后费用

        customer_order_id:'',//订单id
        tableData:[],


       
        fixedAddress:[],
       
        distributeProduct1:[],

        addressProduct:[],
      
        loading: false,

        wuliuList:[], // 物流列表
        dialogwuliu:false, // 物流弹窗
        express_tracking:[], // 物流详细信息
        dialogconfirm:false,
        confirmForm:{
          money:'',
          id:'',
        },
        // 合同图片存储
        imageUrl:[],
        imageUrlType:[],
        imageUrl1:[], //预付款凭证
        img1:false,

        dialogshouhou:false, // 售后按钮
        formShouhou:{
          type:[],
          number:'',
          money:'',
          remarks:'',
          //固定获取数据
          customer_order_id:'',
          customer_order_purchase_product_id:'',
          supplier_id:'',
          product_sku_id:'',
        }
      };
    },
    methods:{
      // 公司搜索
      remoteMethod(query) {
        if (query !== '') {
          this.loading = true;
          setTimeout(() => {
            this.loading = false;
            this.options = this.list.filter(item => {
              return item.name.toLowerCase()
                .indexOf(query.toLowerCase()) > -1;
            });
          }, 200);
        } else {
          this.options = [];
        }
      },
      // 客户匹配
      kehuName:function(value){
        //console.log(value);
        let self = this;
        self.axios.post('/crm.Customer/customer_select',{
            company_id:value
        }).then(res =>{
          //console.log(res.data);
          if(res.data.customer.length == 0){
            self.kehuValue = '';
          }
          self.listKuhuName = res.data.customer;
          
          //console.log(self.listKuhuName);
        })
      },

      // 获取生成的产品订单
      gettableData(a){
        this.axios.get('/crm.Order/customer_order_product_sku_select?customer_order_id='+a).then(res => {
          this.tableData = res.data.product_sku;
        })
      },

      // 已经生成的地址和配货信息操作
      getfixedAddress(a){
        this.axios.get('/crm.Order/order_find?customer_order_id='+a).then(res => {
          this.fixedAddress = res.data.address;
        })
      },
        
    // 查看物流信息
    seewuliu(a){
      this.axios.get('/crm.Order/order_express_find?customer_order_express_id='+a.id).then(res => {

        this.express_tracking = res.data;
      });
      this.dialogwuliu = true;
    },
    // 获取物流列表
    seewuliuList(a){
      this.axios.get('/crm.Order/order_express_select?customer_order_id='+a).then(res => {
        this.wuliuList = res.data.express;
      })
    },
    // 售后按钮
    shouhou(a){
      this.formShouhou.customer_order_id = a.customer_order_id;
      this.formShouhou.customer_order_purchase_product_id = a.id;
      this.formShouhou.supplier_id = a.supplier_id;
      this.formShouhou.product_sku_id = a.product_sku_id
      this.formShouhou.type = [];
      this.formShouhou.number = '';
      this.formShouhou.money = '';
      this.formShouhou.remarks = '';
      this.dialogshouhou = true;
    }, 
    // 提交售后
    addShouhou(){
      this.axios.post('/crm.Order/order_supplier_after_sales_add',{
        type:this.formShouhou.type,
        customer_order_id:this.formShouhou.customer_order_id,
        customer_order_purchase_product_id:this.formShouhou.customer_order_purchase_product_id,
        supplier_id:this.formShouhou.supplier_id,
        product_sku_id:this.formShouhou.product_sku_id,
        number:this.formShouhou.number,
        money:this.formShouhou.money,
        remarks:this.formShouhou.remarks,
      }).then(res => {
        if(res.data.code == 2000){
            this.getcaogao();
            this.open(res.data.msg,'success');
        }else{
            this.open(res.data.msg,'error');
        }
      })
    },
    // 删除售后
    delete_sh(a){
      this.axios.post('/crm.Order/order_supplier_after_sales_delete',{
        id:a.id
      }).then(res => {
        if(res.data.code == 2000){
            this.getcaogao();
            this.open(res.data.msg,'success');
        }else{
            this.open(res.data.msg,'error');
        }
      })
    },

    // 售后完成按钮
    confirm_sh(a){
      this.dialogconfirm = true;
      this.confirmForm.id = a.id;
      this.confirmForm.money = a.money;
    },  

    addconfirm(){
      this.axios.post('/crm.Order/order_supplier_after_sales_update',{
        id:this.confirmForm.id,
        money:this.confirmForm.money,
      }).then(res => {
          if(res.data.code == 2000){
              this.dialogconfirm = false;
              this.getcaogao();
              this.open(res.data.msg,'success');
          }else{
              this.open(res.data.msg,'error');
          }
      })
    },

    // 获取合同图片
    getimgUrl(a){
        this.axios.get('/crm.Order/customer_order_file_select?id='+a).then(res => {
          if(res.data != null){
            this.imageUrlstate = true;
            this.imageUrl = res.data.customer_order;
            if(res.data.customer_order_advance_charge !== undefined){
              this.img1 = true;
              this.imageUrl1 = res.data.customer_order_advance_charge;
            }
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
    getcaogao(){
        this.axios.get('/crm.Order/order_update?id='+this.$route.params.id+'&param=chakan').then(res => {
          if(res.data != null){
            this.$nextTick(function (){
              this.gettableData(res.data.id);
              this.getfixedAddress(res.data.id);
              this.seewuliuList(res.data.id);
              this.getimgUrl(res.data.id);
              this.state4 = res.data.company_name;
              this.kehuName(res.data.company_id);
              this.kehuValue = res.data.customer_id;
              this.starttime = res.data.sales_time;
              this.endtime = res.data.delivery_time;
              this.class_id = String(res.data.class_id);
              this.radio = String(res.data.type_id);
              this.remarks = res.data.remarks;
              this.repair_invoice =res.data.repair_invoice;
              this.repair_freight =res.data.repair_freight;

              this.totalprice= res.data.total_price;
              this.totalcostprice= res.data.total_cost_price; 
              this.userprice= res.data.user_price; 
              this.commissionprice = res.data.commission_price; 
              this.logisticsprice= res.data.logistics_price; 
              this.extraprice= res.data.extra_price;
              this.invoiceprice= res.data.invoice_price; 
              this.aftersalesprice= res.data.after_sales_price;
              
              this.invoice_name=  res.data.invoice_name;
              this.invoice_tax=  res.data.invoice_tax;
              this.invoice_type=  res.data.invoice_type;
            })
            
          }
        })
      }
    }, 
    created(){
        this.getcaogao();
    },
    watch:{
      $route (to) {
        this.getcaogao();
      }
    }
  }
</script>
<style scoped lang="less">
.head_box{
  border: 1px solid #CCC;
  padding: 20px 10px;
  min-width: 1150px;
  .riqi{
    overflow: hidden;
    float: right;
    margin-right: 30px;
    .xiaohou{
      float: left;
    }
    .fahuo{
      margin-left: 20px;
      float: left;
    }
  }
  .danxuan{
    margin-top: 20px;
    overflow: hidden;
    .danxuan1{
      width: 300px;
    }
    .danxuan2{
      h4{
        padding-bottom: 10px;
      }
      .el-radio{
        margin-right: 10px !important;
      }
    }
  }
}

.content_box_product{
  margin-top: 20px;
  border:1px solid #CCC;
  padding: 20px 10px;
  
}
.addr {
    font-size: 10px !important;
    color: #b4b4b4 !important;
}
.my-autocomplete {
  li {
    line-height: normal;
    padding: 7px;
    .name {
      text-overflow: ellipsis;
      overflow: hidden;
    }  
    .highlighted .addr {
      color: #ddd;
    }
  }
}
.tb-edit .el-input {
    display: none
}
.tb-edit .current-row .el-input {
    display: block
}
.tb-edit .current-row .el-input+span {
    display: none
}
.content_box_address{
  margin-top: 20px;
  border:1px solid #CCC;
  padding: 20px 10px;
  overflow: hidden;
  .content_box_address_left{
    width: 620px;
    float: left;
    .content_box_address_head{
      margin-bottom: 20px;
    }
  }
  .content_box_address_right{
    float: left;
    width: 500px;
    overflow: hidden;
    margin-left: 10px;
    .content_box_address_right_inner{
      overflow: hidden;
      width:200px;
      float: left;
      margin-top: 10px;
      margin-left: 10px;
    }
  }
}
.ChoiceAddressInner{
  overflow: hidden;
  border:1px solid #CCC;
  border-radius: 10px;
  padding: 10px 5px;
  margin-top: 10px;
  .ChoiceAddressInnerLeft{
    float: left;
    width: 70%;
  }
  .ChoiceAddressInnerRight{
    float: left;
    margin-top: 5px;
  }
}
.generatedAddress{
  margin-top: 20px;
  border:1px solid #CCC;
  padding: 20px 10px;
  overflow: hidden;
  margin-bottom: 10px;
  hr{
    margin-top: 10px;
  }
  .generatedAddressInner{
    overflow: hidden;
    margin-top: 20px;
    padding-bottom: 20px;
    border-bottom: 1px dashed #CCC;
    .generatedAddressInnerLeft{
      width: 100%;
    }
  }
}
.caigou{
  margin-top: 20px;
  border:1px solid #CCC;
  padding: 20px 10px;
  overflow: hidden;
  margin-bottom: 20px;
  hr{
    margin-top: 10px;
  }
  .caigouInnerbox{
    border-bottom:  1px dashed #CCC;
    padding-bottom: 20px;
    margin-left: 20px;
  }
}
.contract{
  margin-top: 20px;
  border:1px solid #CCC;
  padding: 20px 10px;
  overflow: hidden;
  .contractInner{
    margin-top: 20px;
    overflow: hidden;
    .contractInnerLeft{
      float: left;
      margin-left: 20px;
    }
  }
}

  .img{
    overflow: hidden;
    .imginner{
      float: left;
      width: 178px;
      height: 178px;
      margin-left: 10px;
      border-radius: 5px;
      position: relative;
      .avatar {
        width: 178px;
        height: 178px;
      }
      
      .avatars {
        width: 178px;
        height: 178px;
        background: rgba(102, 102, 102, 0.4);
        position: absolute;
        top: 0;
        display: none;
      }
    }
  }
  
</style>

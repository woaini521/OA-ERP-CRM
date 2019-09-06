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
            <span>发货日期</span>
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
          <div class="danxuan1" style="float: left;">
            <el-radio v-model="radio" label="1" disabled>商品</el-radio>
            <el-radio v-model="radio" label="2" disabled>农产品</el-radio>
            <el-radio v-model="radio" label="3" disabled>服务</el-radio>
          </div>
          <div class="danxuan1" style="margin-left: 100px;float: left;">
            <el-radio v-model="class_id" label="1" disabled>传统</el-radio>
            <el-radio v-model="class_id" label="2" disabled>线上</el-radio>
            <el-radio v-model="class_id" label="3" disabled>京东</el-radio>
          </div>
          <div class="danxuan2" style="margin-top:20px;">
            <p>备注：{{ remarks }}</p>
            <p style="margin-top:10px;font-size:bold"> <span>补开票费用:{{repair_invoice}}</span>  <span style="margin-left:30px">补运费费用: {{repair_freight}}</span></p>
            <h4 style="margin-top:10px;">发票信息:<span>{{invoice_name}}{{invoice_type}}{{invoice_tax}}%</span></h4>
          </div>
        </div>  
        <div class="lirun">
          <span>总销售额:{{total_price}}</span>  
          <span style="margin-left:30px;">产品成本:{{total_cost_price}}</span>
          <span style="margin-left:30px;">总提成:{{user_price}}</span>  
          <span style="margin-left:30px;">物流费用:{{logistics_price}}</span>   
          <span style="margin-left:30px;">额外费用:{{extra_price}}</span>
          <span style="margin-left:30px;">利润:{{ (Number(total_price) - Number(total_cost_price) - Number(user_price) - Number(logistics_price) -Number(extra_price)).toFixed(3) }}</span> 
        </div>  
          
    </div>
      <div class="content_box_product">
        <el-table :data="tableData" style="width: 100%;margin-top:20px">
          <el-table-column  prop="name"  label="产品名称">
              <template slot-scope="scope">
                <span>{{scope.row.name}}{{scope.row.sku_name}}</span>
              </template>
          </el-table-column>
          <el-table-column  prop="unit"  label="单位"></el-table-column>
          <el-table-column prop="number" label="数量"></el-table-column>
          <el-table-column  prop="cost_price"  label="成本"></el-table-column>
          <el-table-column prop="selling_price" label="单价"></el-table-column>
          <el-table-column label="总价" prop="total_price"></el-table-column>
          <el-table-column  label="业务提成" width="150">
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
                          ￥{{ (scope.row.selling_price * scope.row.number - scope.row.cost_price * scope.row.number) * scope1.row.ratio |toFixed(3)}} 
                          </span>
                      </template>
                    </el-table-column>
                  </el-table>
                  <el-button slot="reference" type="text" size="mini">查看</el-button>
                </el-popover>
            </template>
          </el-table-column>
          <el-table-column prop="user_price" label="总提成">
            <template slot-scope="scope">
              <span>￥{{ (Number(scope.row.total_price) - Number(scope.row.total_cost_price)).toFixed(3) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="预计利润">
            <template slot-scope="scope">
                <span>{{ (Number(scope.row.total_price) - Number(scope.row.total_cost_price) - Number(scope.row.user_price).toFixed(4)) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="remarks"  label="备注"></el-table-column>
        </el-table>
      </div>

      <div class="generatedAddress">
        <label>地址配货信息</label>
        <hr>
        <template v-if="fixedAddress.length>0">
          <div class="generatedAddressInner" v-for="item in fixedAddress" :key="item.id">
            <div class="generatedAddressInnerLeft">
              <p>
                <span>收货人：{{item.name}}</span>
                <span style="margin-left:20px;">收货电话：{{item.phone}}</span> <span style="margin-left:60px;">{{item.type}}</span>
                <span style="margin-left:60px;">付款方式:{{ item.payment == 1 ? '到付' : '现付'}}</span>
                <span v-if="item.delivery==1" style="margin-left:20px;">物流方式:到楼下</span> 
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
              <deliver :shuju="item.purchase_product" :tableDataWuliu="item.order_express" :tableDataFeiyong="item.order_express_cost" xian='0'></deliver>
            </div>
          </div>   
        </template>    
      </div>


      <div class="contract">
          <label>合同</label>
          <div class="contractInner">
            <div class="img">
              <div class="imginner" v-for="item in imageUrl" :key="item.src">
                <img :src="item.src" class="avatar">
                <div class="avatars">
                  <i @click="big(item.src)" style="font-size: 30px;margin-top: 75px;margin-left: 75px;color:#FFF;" class="el-icon-zoom-in" ></i>
                </div>
              </div>
            </div>
          </div>
      </div>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>

      <el-dialog :visible.sync="dialogRefuse" title="审核拒绝">
         <el-form :model="dialogRefuseForm">
           <el-form-item label-width="90px" label="拒绝理由">
             <el-input type="textarea" v-model="dialogRefuseForm.remark" style="width:300px"></el-input>
           </el-form-item>
           <el-form-item label-width="90px" label="">
             <el-button type="primary" @click="RefuseBtn">提交</el-button>
           </el-form-item>
         </el-form>
      </el-dialog>
      <!-- 审核 -->
      <el-button v-show="statusa == 1" type="primary" style="margin-bottom:20px;" @click="confirm">审核通过</el-button>
      <el-button v-show="statusa == 1" type="danger" style="margin-bottom:20px;" @click="refuse">审核拒绝</el-button>
      <el-button v-show="statusa > 1" type="primary" style="margin-bottom:20px;" @click="dayin">打印信息</el-button>
      <el-button v-show="statusa >= 15" type="text">已打印信息</el-button>

      <el-dialog title="打印订单信息" :visible.sync="dialogPrinting" class="dayin">
            <div id="printTest1">
                <div class="dayin" style="width:100%"  v-for="(item,index) in P_data" :key="index">
                    <p style="text-align:center;font-size:20px;">发货明细</p>
                    <p style="margin-top:10px">客户编号: <span style="margin-right:20px">{{item.customer_id}}</span>客户姓名: <span style="margin-right:20px">{{item.customer_name}}</span>客户电话: <span style="margin-right:20px">{{item.customer_working_phone}}</span>票据类型: <span>{{item.invoice_name}}{{item.invoice_type}}</span></p>
                    <template v-if="item.address.length>0">
                      <p v-if="item.address.length>0">收货人：<span style="margin-right:20px">{{item.address[0].name}}</span> 收货人号码：{{item.address[0].phone}}</p>
                      <p  v-if="item.address.length>0">收货地址: <span style="margin-right:20px">{{item.address[0].province}}{{item.address[0].city}}{{item.address[0].county}}{{item.address[0].address}}</span></p><p>物流方式: <span>
                      <span v-if="item.address[0].delivery == 1">到楼下</span><span v-if="item.address[0].delivery == 2">上楼</span><span v-if="item.address[0].delivery == 3">自提</span></span> <span style="margin-left:20px">地址个数：{{item.address.length}}</span> <span style="margin-left:20px">运费：{{item.repair_freight}}</span></p>
                    </template>
                    <el-table width="100%" :data="item.product_sku" class="dada" :header-cell-style="{color:'#000'}">
                        <el-table-column label="订单编号" prop="customer_order_id" width="80px"></el-table-column>
                        <el-table-column label="产品名称" prop="name"></el-table-column>
                        <el-table-column label="单位" prop="unit"></el-table-column>
                        <el-table-column label="数量" prop="number"></el-table-column>
                        <el-table-column label="价格" prop="selling_price"></el-table-column>
                        <el-table-column label="参与人">
                          <template slot-scope="scope">
                            <span v-for="items in scope.row.commission" :key="items.id"> {{items.user_name}} 提成{{items.profit}}</span>
                          </template>
                        </el-table-column>
                        <el-table-column label="仓库" prop="supplier_name"></el-table-column>
                    </el-table>
                    <p style="margin-top:10px">总销售额:{{item.total_price}}</p>
                    <p style="margin-top:10px">销售日期:{{item.sales_time}}</p>
                    <p>打印日期:{{time}}</p>
                    <el-divider></el-divider>
                    <p>{{item.remarks}}</p>
                    <p style="text-align:right;margin-right:30%">销售：{{item.user_name}}  制单：{{ren}}</p>
                </div>
                
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogPrinting = false">取 消</el-button>
                <el-button type="primary" @click="dadan" v-print="'#printTest1'">确 定</el-button>
            </div>
      </el-dialog>

    </div>
</template>

<script>
import { appendFileSync } from 'fs';
import {mapActions} from 'vuex';
import deliver from "@/views/erp/Delivery/deliver";
  export default {
    components:{
      deliver,
    },
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
        piao:'',
        class_id:'',  
        repair_invoice:'',
        repair_freight:'',
        // 发票信息  
        invoice_name: '',
        invoice_tax:  '' ,          
        invoice_type:'',
        remarks:'',


        listKuhuName:[],
        total_price:'', // 总销售额
        total_cost_price:'', // 产品成本
        user_price:'', //总提成
        logistics_price:'', // 物流费用
        extra_price:'', // 额外费用
        customer_order_id:'',//订单id

        tableData:[],
       
        fixedAddress:[],
       
        distributeProduct1:[],

        addressProduct:[],
      
        loading: false,

        // 合同图片存储
        imageUrl:[],
        imageUrlType:[],
        dialogVisible:false,
        dialogImageUrl:'',

        statusa:'', // 判断审核按钮 是否开启

        dialogRefuse:false, //审核拒绝弹窗
        dialogRefuseForm:{
          remark:''
        },// 拒绝备注

        // 打印
        dialogPrinting:false, 
        time:'',
        P_data:[],
        ren:'',
      };
    },
    methods:{
       ...mapActions("Tabs", ['triggerDeleteTabs']),
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
        
      // 获取合同图片
      getimgUrl(a){
        this.axios.get('/crm.Order/customer_order_file_select?id='+a+'&class=customer_order&action=finance').then(res => {
          if(res.data !== null){
            this.imageUrlstate = true;
            this.imageUrl = res.data.customer_order;
          }else{
            this.imageUrlstate = false;
            this.imageUrl = [];
          }
        })
      },
      
     
      getcaogao(){
        this.P_data = [];
        this.axios.get('/Finance/finance_order_audit_find?id='+this.$route.params.id).then(res => {
          if(res.data != null){
            // this.gettableData(res.data.id);
            // this.getfixedAddress(res.data.id);
            this.state4 = res.data.company_name;
            this.kehuName(res.data.company_id);
            this.kehuValue = res.data.customer_id;
            this.starttime = res.data.sales_time;
            this.endtime = res.data.delivery_time;
            this.piao = String(res.data.invoice_type);
            this.radio = String(res.data.type_id);
            this.class_id = String(res.data.class_id);
            this.repair_invoice =res.data.repair_invoice;
            this.repair_freight =res.data.repair_freight;
            this.remarks = res.data.remarks;
            this.statusa = res.data.status;
            this.total_price= res.data.total_price;
            this.total_cost_price= res.data.total_cost_price; 
            this.user_price= res.data.user_price; 
            this.logistics_price= res.data.logistics_price; 
            this.extra_price= res.data.extra_price;
            
            this.invoice_name=  res.data.invoice_name;
            this.invoice_tax=  res.data.invoice_tax;
            this.invoice_type=  res.data.invoice_type;
            
            // 获取生成的产品订单
            this.tableData = res.data.product_sku;
            // 已经生成的地址和配货信息操作
            this.fixedAddress = res.data.address;

            this.P_data.push(res.data);
          }
        })
      },
      dadan(){
        this.axios.post('/Finance/finance_order_audit_dadan',{
          id:this.$route.params.id,
          status:this.statusa,
        })
      },
      big(a){
          this.dialogVisible=true;
          this.dialogImageUrl=a;
      },
      // 审核
      confirm(){
          this.axios.post('/Finance/finance_order_audit_adopt',{
              id:this.$route.params.id,
          }).then(res => {
              if(res.data.code == 2000){
                  this.open(res.data.msg,'success');
                  this.triggerDeleteTabs(this.$route.params.name);
                  this.$router.push({ path: "/Finance/finance_order_audit_list" });
              }else{
                 this.open(res.data.msg,'error'); 
              }
          })
      },
      // 拒绝弹窗
      refuse(){
          this.dialogRefuse = true;
          this.dialogRefuseForm.remark = '';
      },
      // 确认提交 拒绝理由
      RefuseBtn(){
        if(this.dialogRefuseForm.remark == ''){
          this.open('请填写了拒绝原因','error')
        }else{
          this.axios.post('/Finance/finance_order_audit_adopt',{
              id:this.$route.params.id,
              status:'9',
              status_txt:this.dialogRefuseForm.remark
          }).then(res => {
              if(res.data.code == 2000){
                  this.open(res.data.msg,'success');
                  this.dialogRefuse = false;
                  this.triggerDeleteTabs(this.$route.params.name);
                  this.$router.push({ path: "/Finance/finance_order_audit_list" });
              }else{
                 this.open(res.data.msg,'error'); 
              }
          })
        }
        
      },
      // 默认时间
        change(t){
            if(t<10){
                return "0"+t;
            }else{
                return t;
            }
        },
      dayin(){
            this.ren = JSON.parse(localStorage.getItem('name'));
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
    }, 
    created(){
        this.getcaogao();
        this.getimgUrl(this.$route.params.id);
    },
    watch:{
      $route (to) {
        if(this.$route.params.id != undefined){
             this.getcaogao(); 
             this.getimgUrl(this.$route.params.id);
        }else{
         
        } 
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
      margin-top: 20px;
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
  }
}
.contract{
  margin-top: 20px;
  border:1px solid #CCC;
  padding: 20px 10px;
  overflow: hidden;
  margin-bottom: 10px;
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
    .imginner:hover .avatars{display:block;cursor: pointer;}  
  }

.dayin{
  color: #000 !important;
  .dada{
    color: #000 !important;
    th>.cell{
      color: #000 !important;
    }
  }
}

  
</style>

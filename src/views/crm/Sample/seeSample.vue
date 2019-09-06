<!-- 模板组件，用于模拟不同路由下的组件显示 -->
<template>
  <div class="box">
    <div class="beizhu" style="overflow: hidden;">
            <span style="float: left;line-height: 40px;margin-right: 10px;">备注</span>
            <el-input style="float: left;width:95%" v-model="remarks"></el-input>
          </div>
      <div class="content_box_product">
        <el-table :data="tableData" style="width: 100%;margin-top:20px">
          <el-table-column  label="图片" width="100">
              <template slot-scope="scope">
                 <img style="width: 90px; height: 90px" :src="scope.row.src">
              </template>
          </el-table-column>
          <el-table-column label="产品名称" width="350">
              <template slot-scope="scope">
                <span>{{scope.row.name}}{{scope.row.sku_name}}</span>
              </template>
          </el-table-column>
          <el-table-column  prop="unit"  label="单位"></el-table-column>
          <el-table-column  label="数量">
            <template slot-scope="scope">
               <span>{{scope.row.number}}</span> 
            </template>
          </el-table-column>
          <el-table-column  prop="cost_price"  label="成本"  ></el-table-column>
          <el-table-column label="总价" >
            <template slot-scope="scope">
             <span>{{ Number(scope.row.cost_price) * Number(scope.row.number) | keepTowNum}}</span>
            </template>
          </el-table-column>
          <el-table-column label="备注">
            <template slot-scope="scope">
              <span>{{scope.row.remarks}}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="generatedAddress">
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
            <div class="generatedAddressInnerRight">
                <el-button type="primary" v-if="zt >= 30" @click="addWuliu(item)">添加物流信息</el-button>
            </div>
            <el-table :data="item.express">
                <el-table-column label="物流名称" prop="express_name"></el-table-column>
                <el-table-column label="物流编号" prop="express_numbers"></el-table-column>
                <el-table-column label="费用" prop="express_price"></el-table-column>
                <el-table-column label="备注" prop="remarks"></el-table-column>
                <el-table-column label="添加时间" prop="add_time"></el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status == 0">未签收</span>
                        <span v-if="scope.row.status == 6">已签收</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="210px">
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary" @click="updata(scope.row)">修改</el-button>
                        <el-button size="mini" type="info" @click="see(scope.row)">查看</el-button>
                        <el-button size="mini" type="danger" @click="deteles(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>   
          </div>       
      </div>

      <el-dialog :visible.sync="wuliu" title="物流信息添加">
          <el-form :model="wuliuForm">
              <el-form-item label="物流名称" label-width="90px">
                  <el-select v-model="wuliuForm.express_id" placeholder="请选择">
                   <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="物流编号" label-width="90px">
                  <el-input v-model="wuliuForm.express_numbers" style="width:217px"></el-input>
              </el-form-item>
              <el-form-item label="联系方式" label-width="90px">
                  <el-input v-model="wuliuForm.express_phone" style="width:217px"></el-input>
              </el-form-item>
              <el-form-item label="费用" label-width="90px">
                  <el-input v-model="wuliuForm.express_price" style="width:217px"></el-input>
              </el-form-item>
              <el-form-item label="备注" label-width="90px">
                  <el-input type="textarea" v-model="wuliuForm.remarks" style="width:217px"></el-input>
              </el-form-item>
              <el-form-item label="" label-width="90px">
                  <el-button @click="addInfo">提交</el-button>
              </el-form-item>
          </el-form>
      </el-dialog>
      <el-dialog :visible.sync="wuliuInfo" title="物流信息">
            <el-timeline reverse="false">
                <el-timeline-item
                    v-for="(er, index) in express"
                    :key="index"
                    :timestamp="er.time">
                    {{ er.context }}
                </el-timeline-item>
            </el-timeline>
      </el-dialog>
  </div>
</template>

<script>
import {mapActions} from 'vuex';
  export default {
    data () {
      return {
        remarks:'',// 备注 
        zt:'',// 状态
        // 订单产品数据
        tableData:[],
        fixedAddress:[],
        wuliu:false,
        wuliuForm:{
            id:'',
            customer_sample_id:'',
            customer_sample_customer_id:'',
            express_id:'',
            express_numbers:'',
            express_price:'',
            express_phone:'',
            remarks:'',
        },
        options:[],
        wuliuInfo:false,
        express:[],
      };
    },
    filters:{
      keepTowNum:function(value){
        value = Number(value);
        return value.toFixed(2)
      }
    },
    methods:{
        ...mapActions("Tabs", ['triggerDeleteTabs']),
        // 获取生成的产品订单
        gettableData(a){
            this.axios.get('/crm.Sample/customer_sample_product_sku_select?customer_sample_id='+a).then(res => {
                this.tableData = res.data.product_sku;
            })
        },
        // 已经生成的地址和配货信息操作
        getfixedAddress(a){
            this.axios.get('/crm.Sample/customer_sample_customer_select?customer_sample_id='+a).then(res => {
                this.fixedAddress = res.data.customer;
                this.options = res.data.express;
            })
        },
        // 添加物流信息
        addWuliu(a){
            this.wuliu = true;
            this.wuliuForm.customer_sample_id = a.customer_sample_id;
            this.wuliuForm.customer_sample_customer_id = a.id;
            this.wuliuForm.express_id = '';
            this.wuliuForm.express_numbers = '';
            this.wuliuForm.express_price = '';
            this.wuliuForm.express_phone = '';
            this.wuliuForm.remarks = '';
            this.wuliuForm.id = '';
        },
        // 修改按钮
        updata(a){
            this.wuliuForm.customer_sample_id = a.customer_sample_id;
            this.wuliuForm.customer_sample_customer_id = a.customer_sample_customer_id;
            this.wuliuForm.express_id = a.express_id;
            this.wuliuForm.express_numbers = a.express_numbers;
            this.wuliuForm.express_price = a.express_price;
            this.wuliuForm.express_phone = a.express_phone;
            this.wuliuForm.remarks = a.remarks;
            this.wuliuForm.id = a.id;
            this.wuliu = true;
        },
        addInfo(){
            // 提交新增
            if(this.wuliuForm.id == ''){
                this.axios.post('/crm.Sample/sample_express_add',{
                    customer_sample_id:this.wuliuForm.customer_sample_id,
                    customer_sample_customer_id:this.wuliuForm.customer_sample_customer_id,
                    express_id:this.wuliuForm.express_id,
                    express_numbers:this.wuliuForm.express_numbers,
                    express_price:this.wuliuForm.express_price,
                    express_phone:this.wuliuForm.express_phone,
                    remarks:this.wuliuForm.remarks,
                }).then(res => {
                    if(res.data.code == 2000){
                        this.open(res.data.msg,'success');
                        this.getfixedAddress(this.$route.params.id);
                        this.wuliu = false;
                    }else{
                        this.open(res.data.msg,'error');
                    }
                })
            }else{
                 // 提交修改
                this.axios.post('/crm.Sample/sample_express_update',{
                    customer_sample_id:this.wuliuForm.customer_sample_id,
                    customer_sample_customer_id:this.wuliuForm.customer_sample_customer_id,
                    express_id:this.wuliuForm.express_id,
                    express_numbers:this.wuliuForm.express_numbers,
                    express_price:this.wuliuForm.express_price,
                    express_phone:this.wuliuForm.express_phone,
                    remarks:this.wuliuForm.remarks,
                    id:this.wuliuForm.id,
                }).then(res => {
                    if(res.data.code == 2000){
                        this.open(res.data.msg,'success');
                        this.getfixedAddress(this.$route.params.id);
                        this.wuliu = false;
                    }else{
                        this.open(res.data.msg,'error');
                    }
                })
            }
            
        },
        // 查看
        see(a){
           this.axios.post('/crm.Sample/sample_express_synchronization',{
               customer_sample_id:a.customer_sample_id, 
               customer_sample_express_id:a.id,
               name:a.express_name,
               number:a.express_numbers,
               customer_sample_customer_id:a.customer_sample_customer_id,
           }).then(res => {
                if(res.data.code == 2000){
                    this.open(res.data.msg,'success');
                    this.express = res.data.express_tracking;
                    this.wuliuInfo = true;
                }else{
                    this.open(res.data.msg,'error');
                }
           })
        },
        // 删除
        deteles(a){
            this.axios.post('/crm.Sample/sample_express_delete',{
                id:a.id
            }).then(res => {
               if(res.data.code == 2000){
                    this.open(res.data.msg,'success');
                    this.getfixedAddress(this.$route.params.id);
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
        // 订单草稿箱
        getcaogao(){
            this.axios.get('/crm.Sample/sample_update?id='+this.$route.params.id+'&param=chakan').then(res => {
                if(res.data.order === undefined){ 
                    this.remarks = res.data.remarks;
                    this.zt = res.data.status;
                    this.gettableData(res.data.id);
                    this.getfixedAddress(res.data.id);
                }
            })
        },
    },
    created(){
      if(this.$route.params.id){
            this.getcaogao();
          }
    },
    watch:{
      $route(to){
          if(this.$route.params.id){
                this.getcaogao();
          }
        
      }
    }
  }
</script>
<style scoped lang="less">
.head_box{
  margin-top: 20px;
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
      float: left;
      width: 65%;
    }
    .generatedAddressInnerRight{
      float: left;
      width: 30%;
    }
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
.avatar-uploader,.el-upload {
   
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
     border: 1px dashed #CCC !important;
  }
  .avatar-uploader,.el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
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
  
</style>

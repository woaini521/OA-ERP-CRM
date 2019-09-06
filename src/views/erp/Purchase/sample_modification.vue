<!-- 模板组件，用于模拟不同路由下的组件显示 -->
<template>
  <div class="box">
    <div class="beizhu" style="overflow: hidden;margin-top:20px;">
            <span style="float: left;line-height: 40px;margin-right: 10px;font-weight:bold">备注:{{remarks}}</span>
          </div>
      <div class="content_box_product">
        <el-table :data="tableData" style="width: 100%;margin-top:20px">
          <el-table-column  label="图片" width="100">
              <template slot-scope="scope">
                 <img style="width: 90px; height: 90px" :src="scope.row.src">
              </template>
          </el-table-column>
          <el-table-column label="产品名称">
              <template slot-scope="scope">
                <span>{{scope.row.name}}{{scope.row.sku_name}}</span>
              </template>
          </el-table-column>
          <el-table-column label="单位" prop="unit"></el-table-column>
          <el-table-column label="数量" prop="number"></el-table-column>
          <el-table-column label="成本" prop="cost_price"></el-table-column>
          <el-table-column label="付款" prop="payment">
              <template slot-scope="scope">
                <span v-if="scope.row.payment == 0">仓库发</span>
                <span v-if="scope.row.payment == 1">付款,供应商发</span>
              </template>
          </el-table-column>
          <el-table-column label="供应商">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" :content="scope.row.supplier_name" placement="top">
                <el-button type="text">查看</el-button>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="付款账号">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" :content="`${scope.row.receiving_name}:${scope.row.receiving_account}`" placement="top">
                <el-button type="text">查看</el-button>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="备注" prop="remarks">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" :content="scope.row.remarks" placement="top">
                <el-button type="text">查看</el-button>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
                <template v-if="scope.row.payment == 1">
                  <span v-if="scope.row.status == 0">等待财务审核</span>
                  <span v-if="scope.row.status == 1">等待出纳审核</span>
                  <span v-if="scope.row.status > 1">审核通过</span>
                </template>
              </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="warning" size="mini" v-show="(scope.row.payment == 1 && status <= 20) || (scope.row.payment == 0 && status <= 40)" @click="Editors(scope.row)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-dialog title="提示" :visible.sync="dialogEdit" width="50%">
          <el-form :model="dialogEditForm">
              <el-form-item label="成本" label-width="90px">
                  <el-input v-model="dialogEditForm.cost_price" style="width:217px"></el-input>
              </el-form-item>
              <el-form-item label="付款" label-width="90px">
                  <el-radio v-model="dialogEditForm.payment" label="0">仓库发</el-radio>
                  <el-radio v-model="dialogEditForm.payment" label="1">付款供应商</el-radio>
              </el-form-item>
              <el-form-item label="供应商" label-width="90px">
                  <el-select v-model="dialogEditForm.supplier_id" @change="HQsupplierPayee" placeholder="请选择">
                    <el-option v-for="item in supplier" :key="item.supplier_id" :label="item.supplier_name" :value="item.supplier_id">
                    </el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label="付款账号" label-width="90px">
                  <el-select :disabled="dialogEditForm.payment == 0?true:false" v-model="dialogEditForm.supplier_payee_id" placeholder="请选择">
                    <el-option v-for="item in supplierPayee" :key="item.id" :label="item.receiving_name" :value="item.id">
                    </el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label="备注" label-width="90px">
                  <el-input v-model="dialogEditForm.remarks"></el-input>
              </el-form-item>
              <el-form-item label="" label-width="90px">
                  <el-button @click="tijiao">提交</el-button>
              </el-form-item>
          </el-form>
      </el-dialog>

      <div class="generatedAddress">
        <label>地址配货信息</label>
        <hr>
          <div class="generatedAddressInner" v-for="item in fixedAddress" :key="item.id">
            <div class="generatedAddressInnerLeft">
              <p>
                <span>收货人：{{item.name}}</span>
                <span style="margin-left:20px;">收货电话：{{ item.phone }}</span> 
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
          </div>       
      </div>

      <!-- 提交数据 页面清空 -->
      <el-button type="primary" style="margin-bottom:20px;" v-show="status <= 10" @click="confirm">确认提交</el-button>
  </div>
</template>

<script>
import {mapActions} from 'vuex';
  export default {
    data () {
      return {
        remarks:'',// 备注 
        tableData:[],
        dialogEdit:false,//弹窗
        dialogEditForm:{
           id:'',
           cost_price:'',
           payment:'',
           supplier_id:'',
           supplier_payee_id:'',
           remarks:'',
        },//弹窗表单
        fixedAddress:[],
        supplier:[],//供应商
        supplierPayee:[],// 付款账号
        status:0,
      };
    },
    methods:{
      ...mapActions("Tabs", ['triggerDeleteTabs']),
      // Editors 编辑按钮
      Editors(a){
        this.dialogEdit = true;
        this.dialogEditForm.id = a.id;
        this.dialogEditForm.payment = String(a.payment);
        this.dialogEditForm.cost_price = a.cost_price;
        this.dialogEditForm.supplier_id = a.supplier_id;
        this.dialogEditForm.supplier_payee_id = a.supplier_payee_id;
        this.dialogEditForm.remarks = a.remarks;
        this.supplier = a.supplier;
        this.HQsupplierPayee(a.supplier_id);
      },
      HQsupplierPayee(value){
          this.supplier.filter(item => {
              if(item.supplier_id == value){
                this.supplierPayee = item.supplier_payee;
              }
          })
      },
      // 提交
      tijiao(){
          this.axios.post('/erp.Purchase/purchase_sample_product_sku_update',{
            id:this.dialogEditForm.id,
            customer_sample_id:this.$route.params.id,
            payment:this.dialogEditForm.payment,
            cost_price:  this.dialogEditForm.cost_price,
            supplier_id: this.dialogEditForm.supplier_id,
            supplier_payee_id: this.dialogEditForm.supplier_payee_id,
            remarks: this.dialogEditForm.remarks,   
          }).then(res => {
              if(res.data.code == 2000){
                this.open(res.data.msg,'success');
                this.dialogEdit = false;
                this.getcaogao();
              }else{
                this.open(res.data.msg,'error');
              }
          })
      },
      // 确认提交订单数据 清空页面
      confirm(){
          this.axios.post('/erp.Purchase/purchase_sample_update',{
            id:this.$route.params.id
          }).then(res => {
            if(res.data.code == 2000){
              this.open(res.data.msg,'success')
              this.triggerDeleteTabs(this.$route.path);
              this.$router.push({ path: "/erp/Purchase/purchase_sample_lists" });
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
        this.axios.get('/erp.Purchase/purchase_sample_find?id='+this.$route.params.id).then(res => {
            this.remarks = res.data.sample.remarks;
            this.tableData = res.data.product_sku;
            this.fixedAddress = res.data.customer;
            this.status = res.data.sample.status;
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

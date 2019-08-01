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
                <span v-if="scope.row.payment == 0">不用付款</span>
                <span v-if="scope.row.payment == 1">付款</span>
              </template>
          </el-table-column>
          <el-table-column label="供应商" prop="supplier_name"></el-table-column>
          <el-table-column label="付款账号" width="200">
            <template slot-scope="scope">
              <span>{{scope.row.receiving_name}}:{{scope.row.receiving_account}}</span>
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
                <span v-if="scope.row.status == 0">默认</span>
                <span v-if="scope.row.status == 3">等待付款</span>
                <span v-if="scope.row.status == 6">付款完成</span>
                <span v-if="scope.row.status == 9">完成</span>
              </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
                <el-button type="primary" size="mini" v-if="scope.row.status == 0" @click="confirm(scope.row)">财务审核</el-button>
                <el-button type="primary" size="mini" v-if="scope.row.status == 1" @click="confirmCN(scope.row)">出纳审核</el-button>
                <el-button type="text" size="mini" v-if="scope.row.status > 1">审核通过</el-button>
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
          </div>       
      </div>
      <el-dialog title="出纳审核" :visible.sync="Cashierexamine">
            <p style="font-size: 20px;color:#000">{{ gongyingshang }}</p>
            <p style="font-size: 20px;color:#000">{{ gongyingshangZH }}</p>
            <p style="font-size: 20px;color:#000;margin-top:5px;"><span>金额：</span><span>{{ qian }}￥</span></p>
            <div class="contract">
                <label>上传打款凭证</label>
                <div class="contractInner">
                    <div class="contractInnerLeft">
                    <el-upload
                        class="avatar-uploader"
                        accept="image/jpeg,image/gif,image/png,image/bmp"
                        action="/File/customer_sample_product_sku_file"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload">
                        <i class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                    </div>
                    <div class="img" v-show="imageUrlstate">
                    <div class="imginner" v-for="item in imageUrl" :key="item.src">
                        <img :src="item.src" class="avatar">
                        <div class="avatars">
                        <i @click="deleteimg(item.src)" style="font-size: 30px;margin-top: 75px;margin-left: 75px;color:#FFF;" class="el-icon-delete" ></i>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="Cashierexamine = false">取 消</el-button>
                <el-button type="primary" @click="CashierSubmission">提 交</el-button>
            </div>
        </el-dialog>  
  </div>
</template>

<script>
import {mapActions} from 'vuex';
  export default {
    data () {
      return {
        remarks:'',// 备注 
        tableData:[],
        fixedAddress:[],
        supplier:[],//供应商
        supplierPayee:[],// 付款账号


        gongyingshang:'',
        gongyingshangZH:'',
        qian:'',
        Cashierexamine:false, // 财务审核弹窗
        // 合同图片存储
        id:'',
        imageUrl:[],
        imageUrlstate:false,
      };
    },
    methods:{
      ...mapActions("Tabs", ['triggerDeleteTabs']),
      // 确认提交订单数据 清空页面
      confirm(a){
          this.axios.post('/Finance/finance_customer_sample_status',{
            id:a.id
          }).then(res => {
            if(res.data.code == 2000){
              this.open(res.data.msg,'success')
              this.triggerDeleteTabs(this.$route.path);
              this.$router.push({ path: "/erp/Purchase/finance_customer_sample_lists" });
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
        this.axios.get('/Finance/finance_customer_sample_find?id='+this.$route.params.id).then(res => {
            this.remarks = res.data.sample.remarks;
            this.tableData = res.data.product_sku;
            this.fixedAddress = res.data.customer;
        })
      },
      confirmCN(a){
        this.id = a.id;
        this.Cashierexamine = true;
        this.gongyingshang = a.supplier_name;
        this.gongyingshangZH = `${a.receiving_name}:${a.receiving_account}`;
        this.qian = Number(a.number) *  Number(a.cost_price);
        this.getimgUrl(a);
      },

      handleAvatarSuccess() {
            this.getimgUrl(this.id);
      },
      beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isJPG) {
            this.$message.error('上传图片必须是JPG/PNG格式!');
            }
            if (!isLt2M) {
            this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        },
        // 获取合同图片
       getimgUrl(a){
            this.axios.post('/File/file_select',{
              data_table:'customer_sample_product_sku',
              class:'temporary_file ',
              id:a.id,
            }).then(res => {
                if(res.data != null){
                 this.imageUrlstate = true;
                 this.imageUrl = res.data;
                }  
            })
        },
        // 删除合同数据图片
      deleteimg(a){
            this.axios.post('/file/customer_order_delete',{
            src:a,
            class:'temporary_file ',
            // class:'customer_order',
            // data_table:'customer_sample_product_sku',
            }).then(res => {
                if(res.data.code == 2000){
                    this.open(res.data.msg,'success');  
                    this.getimgUrl(this.id);
                }else{
                    this.open(res.data.msg,'error');
                }
            })
        },
        CashierSubmission(){
            let src = [];
            for(let i=0;i<this.imageUrl.length;i++){
                let P = this.imageUrl[i].src;
                src.push(P);      
            };
             this.axios.post('/Finance/finance_customer_sample_status',{
                id:this.id,
                src:src
            }).then(res => {
                if(res.data.code == 2000){
                  this.open(res.data.msg,'success')
                  this.Cashierexamine = false;
                  this.triggerDeleteTabs(this.$route.path);
                  this.$router.push({ path: "/erp/Purchase/finance_customer_sample_lists" });
                }else{
                    this.open(res.data.msg,'error');
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

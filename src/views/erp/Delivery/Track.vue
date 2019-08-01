<template>
  <div class="box">
    <div class="head_box">
      <el-table :data="expressinformation">
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
    <template v-if="tableData.length !== 0">
    <div class="content_box">
            <div class="inner" v-for="item in tableData" :key="item.id">
                <span>物流信息</span>
                <el-button style="margin-left:30px;" type="primary" size="small" @click="add(item.id,item.customer_order_id)">追加记录</el-button>
                <el-button style="margin-left:30px;" type="primary" size="small" @click="synchro(item.id,item.customer_order_id,item.express_name,item.express_numbers)">同步记录</el-button>
                <h3 style="margin-top: 10px;">
                    <span >物流支付方式：少时诵诗书</span>
                    <span  style="margin-left: 40px;">快递公司：{{item.express_name}}</span>
                    <span  style="margin-left: 40px;">快递编号：{{item.express_numbers}}</span>
                    <span  style="margin-left: 40px;">快递电话：{{item.express_phone}}</span>
                </h3>    
                <br>
                <template v-if="item.express_tracking !== null">
                    <el-timeline reverse="false">
                        <el-timeline-item
                        v-for="(er, index) in item.express_tracking"
                        :key="index"
                        :timestamp="er.tracking_time">
                        {{er.tracking_txt}}   {{er.user_name}}
                        </el-timeline-item>
                    </el-timeline>
                </template>
            </div> 
    </div>
    </template>
    <template v-else>
        <h3 style="text-align: center;color: rgb(122,122,122);margin-top: 40px;">暂无物流信息</h3>
    </template>
    <el-dialog title="物流信息追加记录" :visible.sync="dialogzhuijia">
        <div class="append_box">
            <LogisticsInformation :expressid="expressid" :orderid="orderid" v-on:chuan="getchildmsg"></LogisticsInformation>
        </div>
    </el-dialog>
  </div>
</template>

<script>
import LogisticsInformation from '@/components/express/LogisticsInformation.vue';
export default {
  data() {
    return {
        expressinformation:[],
        tableData:[],
        expressid:'',
        orderid:'',
        dialogzhuijia:false,
    };
  },
  components:{LogisticsInformation},
  methods: {
      add(a,b){ 
          this.expressid = a;
          this.orderid = b;
          this.dialogzhuijia = true;
      },
      // 获取数据
      gettableData(){
          this.axios.get('/erp.Delivery/delivery_order_express_find?supplier_id='+this.$route.params.supplier_id+'&customer_order_id='+this.$route.params.customer_order_id+'&customer_order_purchase_id='+this.$route.params.customer_order_purchase_id).then(res => {
              this.expressinformation = res.data.purchase_product;
              this.tableData = res.data.express;
          })
      },
      synchro(a,b,c,d){
            this.axios.post('/erp.Delivery/delivery_order_express_synchronization',{
              customer_order_id:b, 
              customer_order_express_id:a,
              name:c,
              number:d
            }).then(res => {
                 if(res.data.code  ==  2000){
                     this.gettableData();
                     this.open(res.data.msg,'success');
                 }else{
                     this.open(res.data.msg,'error');
                 }
                    
            })
      },
      // 接收子组件
      getchildmsg(data){
          if(data == 1){
               this.dialogzhuijia = false;
               this.gettableData();
          }   
      },
       open(a,b){
            this.$message({
                message: a,
                type: b
            });
        },
  },
  created() {
      this.gettableData();
  },
  watch:{
      $route(to){
          if(!this.$route.params.supplier_id){

          }else{
              this.gettableData();
          }
      }
  }
};
</script>

<style lang="less" scoped>
.head_box{
    margin-top: 10px;
}
.content_box{
    margin-top: 10px;
    padding: 10px 20px 20px 20px;
    border:1px solid #CCC;
    .inner{
        border-bottom: 1px dashed #CCC;
        padding-bottom: 20px;
        padding-top: 10px;
        p{
            margin-top: 10px;
            
        }
    }
}
.append_box{
    .append_box_head{
        margin-bottom: 10px;
    }
}

</style>

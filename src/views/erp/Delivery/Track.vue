<template>
  <div class="box">
    <div class="content_box">
            <div class="inner" v-for="item in tableData" :key="item.id">
                <el-button style="margin-left:30px;" type="primary" size="small" @click="add(item.id,item.customer_order_id)">追加记录</el-button>
                <el-button style="margin-left:30px;" type="primary" size="small" @click="synchro(item.id,item.customer_order_id,item.express_name,item.express_numbers)">同步记录</el-button>
                <h3 style="margin-top: 10px;">
                    <span  style="margin-left: 40px;">快递公司：{{item.express_name}}</span>
                    <span  style="margin-left: 40px;">快递编号：{{item.express_numbers}}</span>
                    <span  style="margin-left: 40px;">快递电话：{{item.express_phone}}</span>
                </h3>    
                <br>
                <template v-if="item.express_tracking !== null">
                    <el-timeline :reverse='a'>
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
        tableData:[],
        expressid:'',
        orderid:'',
        dialogzhuijia:false,
        a:false,
    };
  },
  components:{LogisticsInformation},
  props:['order_express_id'],
  methods: {
      add(a,b){ 
          this.expressid = a;
          this.orderid = b;
          this.dialogzhuijia = true;
      },
      // 获取数据
      gettableData(){
          this.axios.get('/erp.Delivery/delivery_order_express_find?order_express_id='+this.order_express_id).then(res => {
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
  created(){
      this.gettableData();
  },
  watch:{
      order_express_id(newValue, oldValue){
          this.gettableData();
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

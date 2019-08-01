<template>
    <div class="LogisticsInformation">
        <el-form :model="appendForm" ref="appendForm">    
            <!-- <el-form-item label="追加时间" label-width="90px" prop="time">
                <el-date-picker
                v-model="appendForm.time"
                type="datetime"
                placeholder="选择日期"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                style="margin-left:20px;">
                </el-date-picker>
            </el-form-item> -->
            <el-form-item label="跟踪信息" label-width="90px" prop="info">
                <el-input type="textarea" style="width:317px;" v-model="appendForm.info"></el-input>
            </el-form-item>
            <el-form-item label="是否到货" label-width="90px" prop="arrival">
                <el-radio v-model="appendForm.arrival" label="0">未到货</el-radio>
                <el-radio v-model="appendForm.arrival" label="1">已到货处理</el-radio>
            </el-form-item>
            <el-button type="primary" @click="add(expressid,orderid)">提 交</el-button>
        </el-form>
    </div>
</template>

<script>
export default {
    name: 'LogisticsInformation',
    data(){
        return{
            appendForm:{
                type:'',
                info:'',
                arrival:'',
            }, 
        }
    },
    props:['expressid','orderid'],
    methods:{
        add(a,b){  
          this.axios.post('/erp.Delivery/delivery_order_express_tracking_add',{
            customer_order_id:b,
            customer_order_express_id:a,
            tracking_txt:this.appendForm.info,
            status:this.appendForm.arrival, 
          }).then(res => {
              if(res.data.code == 2000){
                   this.$refs['appendForm'].resetFields();
                   this.$emit('chuan','1');
                   this.open(res.data.msg,'success');
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
    }
}
</script>

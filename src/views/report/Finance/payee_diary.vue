<template>
  <div class="box">
      <div>
          <label>筛选:</label>
            <el-date-picker v-model="time" value-format="timestamp" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>
            <el-button @click="seach" style="margin-left:20px">搜索</el-button>
      </div>
      <el-table :data="tableData" show-summary>
          <el-table-column label="名称" prop="receiving_name"></el-table-column>
          <el-table-column label="账号">
              <template slot-scope="scope">
                  <span>{{ scope.row.receiving_account }}</span>
              </template>
          </el-table-column>
          <el-table-column label="样品费用支出" prop="样品费用支出"></el-table-column>
          <el-table-column label="订单销入款" prop="订单销入款"></el-table-column>
          <el-table-column label="订单销售款录入" prop="订单销售款录入"></el-table-column>
          <el-table-column label="订单销售款删除" prop="订单销售款删除"></el-table-column>
          <el-table-column label="费用开支出账" prop="费用开支出账"></el-table-column>
          <el-table-column label="费用开支入账" prop="费用开支入账"></el-table-column>
          <el-table-column label="供应商审核" prop="供应商审核"></el-table-column>
          <el-table-column label="供应商结算" prop="供应商结算"></el-table-column>
          <el-table-column label="合计">
              <template slot-scope="scope">
                  <span>{{ Number(scope.row.样品费用支出 != undefined ? scope.row.样品费用支出 : 0 ) +  Number(scope.row.订单销入款 != undefined ? scope.row.订单销入款 : 0) +  Number(scope.row.订单销售款录入 != undefined ? scope.row.订单销售款录入 : 0) +  Number(scope.row.费用开支出账 != undefined ? scope.row.费用开支出账 : 0) +  Number(scope.row.费用开支入账 != undefined ? scope.row.费用开支入账 : 0) +  Number(scope.row.供应商审核 != undefined ? scope.row.供应商审核 : 0)  +  Number(scope.row.供应商结算 != undefined ? scope.row.供应商结算 : 0)  }}</span>
              </template>
          </el-table-column>

          
      </el-table>
  </div>
</template>

<script>
export default {
    data(){
        return{
            time:null,
            start_time:'',
            tableData:[],
        }
    },
    methods:{
        gettableData(){
            this.axios.post('/report.Finance/payee_diary',{
                start_time:this.start_time,
                end_time:this.start_time,
            }).then(res => {
                this.tableData = res.data.payee;
            })
        },
        seach(){
            let a,b ;
            if(this.time == null){
                a='';
                b='';
            }else{
                a=this.time[0]/1000;
                b=this.time[1]/1000;
            }   
            this.axios.post('/report.Finance/payee_diary',{
                start_time:a,
                end_time:b,
            }).then(res => {
                this.tableData = res.data.payee;
            })
        },
         // 默认时间
        change(t){
            if(t<10){
                return "0"+t;
            }else{
                return t; 
            }
        },
        getTimestamp (mytime){
            let dateTmp = mytime.replace(/-/g,'/')
            return Date.parse(dateTmp)
        },
    },
    created(){
        let d=new Date();
        let year=d.getFullYear();
        let month=this.change(d.getMonth()+1);
        let day=this.change(d.getDate());
        let shi = year+'-'+month+'-'+day;
        this.start_time = this.getTimestamp(shi)/1000;
        this.gettableData();
    }
}
</script>

<style lang="less" scoped>

</style>
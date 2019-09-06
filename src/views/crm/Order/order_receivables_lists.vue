<!-- 模板组件，用于模拟不同路由下的组件显示 -->
<template>
    <div class="box">
        <div>
            <label>筛选：</label>
            <el-date-picker v-model="time" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd"></el-date-picker>
            <el-input style="margin-left: 20px;width:100px" v-model="money" placeholder="金额"></el-input>
            <el-select v-model="value" clearable style="margin-left: 20px;width:150px" placeholder="请选择公司">
                <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.name"
                :value="item.id">
                </el-option>
            </el-select>
            <el-select v-model="value1"  style="margin-left: 20px;width:100px;" placeholder="状态">
                <el-option label="待认款" value="0"></el-option>
                <el-option label="认款中" value="5"></el-option>
                <el-option label="已认款" value="9"></el-option>
            </el-select>
            <el-input style="margin-left: 20px;width:100px" v-model="name" placeholder="姓名"></el-input>
            <el-input style="margin-left: 20px;width:100px" v-model="bumen" placeholder="部门"></el-input>
            <el-button type="primary" style="margin-left:20px;" @click="seach">搜索</el-button>
            <br>
            <p style="margin-top:10px;margin-bottom:10px">已认款额：{{ todaymoney }}</p>
        </div>
      <div class="box_content">
        <el-table :data="tableData" style="width: 100%;" show-summary>
          <el-table-column label="汇款时间" width="160px">
              <template slot-scope="scope">
                  <span>{{scope.row.payment_time}}</span>
              </template>
          </el-table-column>
          <el-table-column label="渠道"  width="80px">
              <template slot-scope="scope">
                  <span>{{status[scope.row.source]}}</span>
              </template>
          </el-table-column>  
          <el-table-column label="接收帐号" >
                <template slot-scope="scope">
                    <span>{{scope.row.receiving_name}}:{{scope.row.receiving_account}}</span>
                </template>
          </el-table-column>
          <el-table-column prop="payment_amount" label="金额"></el-table-column>
          <el-table-column label="备注">
              <template slot-scope="scope">
                  <span>{{scope.row.remarks}}</span>
              </template>
          </el-table-column>
          <el-table-column prop="user_name" label="录入人" width="80px"></el-table-column>
          <el-table-column label="状态" width="80px">
              <template  slot-scope="scope">
                <span v-if="scope.row.status == 0">认款中</span>  
                <span v-if="scope.row.status == 5">已认款</span> 
           </template>
          </el-table-column>
          <el-table-column prop="confirm_user_name" label="认款人">
              <template slot-scope="scope">
                  <span>{{ scope.row.dep_title }}/{{ scope.row.confirm_user_name }}</span>
              </template>
          </el-table-column>
          <el-table-column label="操作" width="100px">
            <template slot-scope="scope">
                <el-button v-if="scope.row.status < 5" type="primary" @click="renkuan(scope.row)" plain size="small">认款</el-button>  
                <el-button v-if="scope.row.status >= 5" type="primary" @click="seekuan(scope.row)" plain size="small">查看认款</el-button> 
           </template>
          </el-table-column>
        </el-table>
      </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";

  export default {
    data () {
      return {
          status:['','微信','支付宝','银行卡'],
          time:null,
          starttime:'',
          money:'',
          value:'',
          value1:'',
          name:'',
          bumen:'',
          options:[],
          tableData:[],
          todaymoney:'',
      };
    },
    methods:{
        // vuex tab显示
        ...mapActions("customerList", ["triggerReplaceId"]),
        ...mapActions("Tabs", ["triggerAddTabs", "triggerSetActiveIndex"]),
        renkuan(a){
            //alert(a.id);
            this.triggerReplaceId(a.id);
            this.$router.push({ path: `/crm/Order/order_receivables_lists_details/${a.id}`,params:{userId:a.id,name:`/crm/Order/order_receivables_lists_details/${a.id}`}});
            let ins1 = {
                route: `/crm/Order/order_receivables_lists_details/${a.id}`,
                name: "认款详情",
                id: a.id
            };
            let ins2 = `/crm/Order/order_receivables_lists_details/${a.id}`;
            this.triggerAddTabs(ins1);
            this.triggerSetActiveIndex(ins2);
        },
        // 查看
        seekuan(a){
          this.triggerReplaceId(a.id);
            this.$router.push({ path: `/crm/Order/order_receivables_see/${a.id}`,params:{userId:a.id,name:`/crm/Order/order_receivables_see/${a.id}`}});
            let ins1 = {
                route: `/crm/Order/order_receivables_see/${a.id}`,
                name: "查看认款详情",
                id: a.id
            };
            let ins2 = `/crm/Order/order_receivables_see/${a.id}`;
            this.triggerAddTabs(ins1);
            this.triggerSetActiveIndex(ins2);
        },
        gettableData(){
            this.axios.post('/crm.Order/order_receivables_lists',{
                start_time:this.starttime,
                end_time:this.starttime
            }).then(res => {
                this.options = res.data.company;
                this.tableData = res.data.receivables;
                if(res.data.receivables_customer_order_money != null){
                    this.todaymoney = res.data.receivables_customer_order_money.money;
                }else{
                    this.todaymoney = '0'
                }
            })
        },
        seach(){
           let a,b;
           if(this.time == null){
               a='';
               b='';
           }else{
               a=this.time[0];
               b=this.time[1]
           }
           this.axios.post('/crm.Order/order_receivables_lists',{
                money:this.money,
                start_time:a,
                end_time:b,
                company_id:this.value,
                status:this.value1,
                dep_title:this.bumen,
                confirm_user_name:this.name,
            }).then(res => {
                this.tableData = res.data.receivables;
                if(res.data.receivables_customer_order_money != null){
                    this.todaymoney = res.data.receivables_customer_order_money.money;
                }else{
                    this.todaymoney = '0'
                }
            })  
        },
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
        this.starttime = year+'-'+month+'-'+day;
        this.gettableData();
    },
  }
</script>
<style scoped lang="less">
</style>

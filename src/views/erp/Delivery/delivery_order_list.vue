<template>
    <div class="box">
        <div class="box_head">
            <label>筛选：</label>
            <el-date-picker v-model="time" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
            <el-select v-model="value" filterable clearable placeholder="请选择" style="width:180px;margin-left: 20px">
                <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
            </el-select>
            <el-input v-model="value1" clearable style="width:217px;margin-left: 20px" placeholder="请输入业务员"></el-input>
            <el-select v-model="statu" filterable clearable placeholder="请选择" style="width:120px;margin-left:20px">
                <el-option label="全部" value="">
                </el-option>
                <el-option label="等待发货" value="0">
                </el-option>   
                <el-option label="已经发货" value="3">
                </el-option>  
                <el-option label="发货完成" value="6">
                </el-option> 
            </el-select>
            <el-button style="margin-left: 20px" type="primary" @click="seach">搜索</el-button>
            <br>
            <el-input v-model="value2" clearable style="width:217px;margin-left: 48px" placeholder="请输入客户"></el-input>
            
            
            <el-input v-model="value3" clearable style="width:217px;margin-left: 20px;margin-top: 10px;" placeholder="请输入部门"></el-input>
            <el-input v-model="value4" clearable style="width:217px;margin-left: 20px;margin-top: 10px;" placeholder="请输入地址"></el-input>
            <el-input v-model="value5" clearable style="width:217px;margin-left: 20px;margin-top: 10px;" placeholder="请输入收货人姓名"></el-input>

        </div>
        <div class="box_content">
            <el-table :data="tableData" show-summary>
                <el-table-column label="订单编号" prop="id" width="80px"></el-table-column>
                <el-table-column label="业务员" width="150px">
                    <template slot-scope="scope">
                        <span>{{scope.row.dep_title}}  {{scope.row.user_name}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="客户姓名" prop="customer_name"></el-table-column>
                <el-table-column label="销售员" prop="user_name"></el-table-column>
                <el-table-column label="销售日期"  prop="sales_time"></el-table-column>
                <el-table-column label="收货日期" prop="delivery_time"></el-table-column>
                <el-table-column prop="total_price" label="总销售额"></el-table-column>
                <el-table-column prop="logistics_price" label="运费"></el-table-column>
                <el-table-column prop="total_cost_price" label="总成本"></el-table-column>
                <el-table-column label="状态" width="120px">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status == 0">草稿</span>
                        <span v-if="scope.row.status == 1">已提交订单</span>
                        <el-tooltip
                        v-if="scope.row.status == 9"
                        class="item"
                        effect="dark"
                        :content="scope.row.status_txt"
                        placement="top-start"
                        >
                        <span style="color:#409EFF">审核拒绝</span>
                        </el-tooltip>
                        <span v-if="scope.row.status == 10">财务通过</span>
                        <span v-if="scope.row.status == 15">已打印</span>
                        <span v-if="scope.row.status == 20">采购完成</span>
                        <span v-if="scope.row.status == 30">预付款处理</span>
                        <span v-if="scope.row.status == 40">等待发货</span>
                        <span v-if="scope.row.status == 50">全部收到货等开票</span>
                        <span v-if="scope.row.status == 60">开过票</span>
                        <span v-if="scope.row.status == 70">认过款项</span>
                        <span v-if="scope.row.status == 90">结束</span>
                        <span v-if="scope.row.status == 999">作废</span>
                        <br>
                        <span v-if="scope.row.status != 9" style="color:red;">{{scope.row.status_txt}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="info" size="small" @click="see(scope.row)">查看订单</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div> 
    </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
    data(){
        return{
            // 筛选
            time:null,
            start_time:'',
            value:'',
            value1:'',
            value2:'',
            value3:'',
            value4:'',
            value5:'',
            statu:'',
            options: [], 
            // 数据
            tableData:[],
            state:['','上门','上楼','自提'], 
        }
    },
    methods:{
        // vuex tab显示
        ...mapActions("customerList", ["triggerReplaceId"]),
        ...mapActions("Tabs", ["triggerAddTabs", "triggerSetActiveIndex"]),
        // 获取table数据
        gettableData(){
            this.axios.post('/erp.Delivery/delivery_order_list',{
                start_time:this.start_time,
                end_time:this.start_time,
            }).then(res => {
                this.options = res.data.company;
                this.tableData = res.data.order;
            })
        },
        
        //筛选
        seach(){
            let a,b ;
            if(this.time == null){
                a='';
                b='';
            }else{
                a=this.time[0];
                b=this.time[1];
            }   
            const loading = this.$loading({
                lock: true,
                text: '拼命加载中',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            this.axios.post('/erp.Delivery/delivery_order_list',{
                company_id:this.value,
                user_name:this.value1,
                customer_name:this.value2,
                status:this.statu,
                dep_name:this.value3,
                address:this.value4,
                address_name:this.value5,
                start_time:a,
                end_time:b,
            }).then(res => {
                this.tableData = res.data.order;
                loading.close();
            })  
        },
       
        see(a){
            this.triggerReplaceId(a.id);
            this.$router.push({ path: `/erp/Delivery/see_deliver/${a.id}`
            });
            let ins1 = {
                route: `/erp/Delivery/see_deliver/${a.id}`,
                name: "发货信息",
            };
            let ins2 = `/erp/Delivery/see_deliver/${a.id}`;
            this.triggerAddTabs(ins1);
            this.triggerSetActiveIndex(ins2);
        },


        // 公用弹窗
        open(a,b){
            this.$message({
                message: a,
                type: b
            });
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
        this.start_time = year+'-'+month+'-'+day;
        this.gettableData();
    },
    // watch:{
    //     $route(to){
    //        this.gettableData();
    //     }
    // }
}
</script>

<style lang="less" scoped>
.box {
  min-width: 890px;
  .box_head {
    margin-top: 10px;
  }
}
</style>


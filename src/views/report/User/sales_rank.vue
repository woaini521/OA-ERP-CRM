<template>
    <div class="box">
        <div class="head_box">
            <label>选择日期：</label>
            <el-date-picker v-model="times"  type="daterange" range-separator="至" value-format="timestamp" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
            <el-button style="margin-left:20px" @click="confirm">确定</el-button>
        </div>
        <el-table :data="tableData" class="aaaaa" border show-summary style="width: 100%;margin-top:20px;">
            <el-table-column type="index" width="50" label="排名"></el-table-column>
            <el-table-column prop="dep_title" label="部门"></el-table-column>
            <el-table-column prop="user_name" label="姓名"></el-table-column>
            <el-table-column prop="total_price"  label="总销售额" sortable></el-table-column>
            <el-table-column prop="total_cost_price"  label="总成本" sortable></el-table-column>
            <el-table-column prop="user_price"  label="业务提成" sortable></el-table-column>
            <el-table-column prop="logistics_price" label="物流价格" sortable ></el-table-column>
            <el-table-column prop="after_sales_price" label="售后费用" sortable ></el-table-column>
            <el-table-column prop="invoice_price" label="开票费用" sortable ></el-table-column>
            <el-table-column prop="commission_price" label="额外提成" sortable ></el-table-column>
        </el-table>
    </div>
</template>

<script>
export default {
    filters:{
        
    },
    data(){
        return{
            tableData: [], // 表格数据
            times:null,
        }
    },
    methods:{
        getTableData(){
            this.axios.get('/report.User/sales_rank').then(res => {
                this.tableData = res.data.order
            })
        },
        confirm(){
            if(this.times!=null){
                 this.axios.post('/report.User/sales_rank',{
                    start_time:this.times[0]/1000,
                    end_time:this.times[1]/1000
                }).then(res => {
                    this.tableData = res.data.order
                })
            }else{
                this.axios.post('/report.User/sales_rank',{
                    start_time:'',
                    end_time:''
                }).then(res => {
                    this.tableData = res.data.order
                })
            }
           
        },
    },
    created(){
        this.getTableData();   
    }
}
</script>

<style lang="less" >
.aaaaa td,.aaaaa th{
    padding-top: 0px !important;
    padding-bottom: 0px !important;
}
</style>


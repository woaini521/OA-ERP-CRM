<template>
    <div class="box">
        <el-date-picker v-model="time" type="daterange" value-format="timestamp" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
        <el-button @click="seach" style="margin-left:20px">搜索</el-button>
        <el-table :data="data" show-summary>
            <el-table-column label="产品" prop="name" width="400px"></el-table-column>
            <el-table-column label="单位" prop="unit"></el-table-column>
            <el-table-column label="总销售量" prop="number" sortable></el-table-column>
            <el-table-column label="总销售额" prop="purchase_price" sortable></el-table-column>
            <el-table-column label="平均单价">
                <template slot-scope="scope">
                    <span>{{ (Number(scope.row.purchase_price) / Number(scope.row.number)).toFixed(2)}}</span>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
export default {
    data(){
        return {
            data:[],
            time:null,
            starttime:'',
        }
    },
    methods:{
        getData(){
            this.axios.post('/report.Purchase/product_sales',{
                start_time:this.starttime,
                end_time:this.starttime
            }).then(res => {
                this.data = res.data
            })
        },
        seach(){
            if(this.time!=null){
                 this.axios.post('/report.Purchase/product_sales',{
                     start_time:this.time[0]/1000,
                     end_time:this.time[1]/1000,
                 }).then(res => {
                     this.data = res.data
                 })
            }else{
                this.axios.post('/report.Purchase/product_sales',{
                     start_time:'',
                     end_time:'',
                 }).then(res => {
                     this.data = res.data
                 })
            }
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
        let starttime1 = year+'-'+month+'-'+day;
        this.starttime = this.getTimestamp(starttime1)/1000;
        this.getData();
    }
}
</script>


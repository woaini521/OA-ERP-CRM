<template>
    <div class="box">
        <el-date-picker v-model="time" type="daterange" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
        <el-input v-model="name" placeholder="产品名称" style="width:217px;margin-left:10px"></el-input>
        <el-input v-model="dep" placeholder="部门名称" style="width:130px;margin-left:10px"></el-input>
        <el-input v-model="user" placeholder="销售员" style="width:130px;margin-left:10px"></el-input>
        <el-button @click="seach"  style="margin-left:20px">搜索</el-button>
        <el-table :data="data" show-summary>
            <el-table-column label="产品" prop="name" width="350px"></el-table-column>
            <el-table-column label="图片">
                <template slot-scope="scope">
                    <el-image style="width: 60px; height: 40px" :src="scope.row.src" @click="big(scope.row.src)" fit='cover'></el-image>
                </template>
            </el-table-column>
            <el-table-column label="单位" prop="unit"></el-table-column>
            <el-table-column label="销售量" prop="number" sortable></el-table-column>
            <el-table-column label="销售额" prop="selling_price" sortable></el-table-column>
            <el-table-column label="销售单价">
                <template slot-scope="scope">
                    <span>{{ (Number(scope.row.selling_price) / Number(scope.row.number)).toFixed(2)}}</span>
                </template>
            </el-table-column>
            <el-table-column label="人员" width="150">
                <template slot-scope="scope">
                    <span>{{ scope.row.dep_title}}/{{ scope.row.user_name}}</span>
                </template>
            </el-table-column>
            <el-table-column label="采购量" prop="purchase_number" sortable></el-table-column>
            <el-table-column label="采购额" prop="purchase_money" sortable></el-table-column>
            <el-table-column label="采购单价">
                <template slot-scope="scope">
                    <span>{{ (Number(scope.row.purchase_money) / Number(scope.row.purchase_number)).toFixed(2)}}</span>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog :visible.sync="srcList">
            <el-image style="width:100%" :src="img" fit='contain'></el-image>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data(){
        return {
            data:[],
            time:null,
            starttime:'',
            name:'',
            dep:'',
            user:'',
            srcList:false,
            img:'',
        }
        
    },
    methods:{
        getData(){
            this.axios.post('/report.Purchase/product_order_sales',{
                start_time:this.starttime,
                end_time:this.starttime
            }).then(res => {
                this.data = res.data
            })
        },
        seach(){
            if(this.time!=null){
                 this.axios.post('/report.Purchase/product_order_sales',{
                     start_time:this.time[0],
                     end_time:this.time[1],
                     name:this.name,
                     dep_title:this.dep,
                     user_name:this.user,
                 }).then(res => {
                     this.data = res.data
                 })
            }else{
                this.axios.post('/report.Purchase/product_order_sales',{
                     start_time:'',
                     end_time:'',
                     name:this.name,
                     dep_title:this.dep,
                     user_name:this.user,
                 }).then(res => {
                     this.data = res.data
                 })
            }
        },
        big(a){
           // alert(1);
           // this.srcList = [];
           this.img = a;
            this.srcList=true
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
        this.starttime = year+'-'+month+'-'+day;
        //this.starttime = this.getTimestamp(starttime1)/1000;
        this.getData();
    }
}
</script>


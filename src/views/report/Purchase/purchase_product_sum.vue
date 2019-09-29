<template>
  <div class="box">
        <div>
            <label>筛选：</label>
            <el-date-picker v-model="time" type="daterange" value-format="timestamp" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
            <el-input v-model="name" style="width:217px;margin-left:10px" placeholder="产品名称"></el-input>
            <el-button @click="seach" style="margin-left:20px">搜索</el-button>
        </div>
        <el-table :data="tableData" show-summary>
            <el-table-column label="产品" prop="name"></el-table-column>
            <el-table-column label="时间" prop="add_time" sortable width="155"></el-table-column>
            <el-table-column label="数量" prop="number" sortable width="90"></el-table-column>
            <el-table-column label="单价" width="90">
                <template slot-scope="scope">
                    <span>{{ (Number(scope.row.price)/Number(scope.row.number)).toFixed(4) }}</span>
                </template>
            </el-table-column>
            <el-table-column label="单位" width="60px">
                <template slot-scope="scope">
                    <span>{{ scope.row.unit }}</span>
                </template>
            </el-table-column>
            <el-table-column label="总价" prop="price" sortable width="110"></el-table-column>
            <el-table-column label="供应商" prop="supplier_name"></el-table-column>
            <el-table-column label="采购" prop="purchase_user_name"  width="80"></el-table-column>
        </el-table>
  </div>
</template>

<script>

export default {
    data(){
        return{
            time:null,
            starttime:'',
            name:'',
            tableData:[],
        }
    },
    methods:{
        seach(){
            let a,b;
            if(this.time == null){
                a = '';
                b = '';
            }else{
                a = this.time[0]/1000;
                b = this.time[1]/1000;
            }
            this.axios.post('/report.Purchase/purchase_product_sum',{
                start_time:a,
                end_time:b,
                name:this.name,
            }).then(res => {
                this.tableData = res.data.purchase_product
            }) 
        },
        gettableData(){
            this.axios.post('/report.Purchase/purchase_product_sum',{
                start_time:this.starttime,
                end_time:this.starttime
            }).then(res => {
                this.tableData = res.data.purchase_product
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
        let starttime1 = year+'-'+month+'-'+day;
        this.starttime = this.getTimestamp(starttime1)/1000;
        this.gettableData();
    }
}
</script>

<style>

</style>
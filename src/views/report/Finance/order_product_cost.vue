<template>
  <div class="box">
        <div>
            <label>筛选:</label>
            <el-date-picker v-model="time" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>
            <el-input v-model="name" placeholder="部门" style="width:100px;margin-left:20px"></el-input>
            <el-select v-model="class_" clearable placeholder="类型" style="width:100px;margin-left:10px">
                <el-option label="传统" value="1"></el-option>
                <el-option label="线上" value="2"></el-option>
                <el-option label="京东" value="3"></el-option>
            </el-select>
            <el-input v-model="user_name" placeholder="业务员" style="width:100px;margin-left:20px"></el-input>
            <el-button @click="seach" style="margin-left:20px">搜索</el-button>
            <el-button @click="dao" style="margin-left:20px">导出数据</el-button>
        </div>
        <el-table :data="tableData" show-summary>
            <el-table-column label="部门" prop="dep_title"></el-table-column>
            <el-table-column label="销售员" prop="user_name"  width="80px"></el-table-column>
            <el-table-column label="销售日期" prop="customer_order_sales_time" width="110px"></el-table-column>
            <el-table-column label="订单编号" width="50px">
                <template slot-scope="scope">
                    <span>{{ scope.row.customer_order_id }}</span>
                </template>
            </el-table-column>
            <el-table-column label="销售类型" width="80px">
                <template slot-scope="scope">
                    <span v-if="scope.row.customer_order_class_id == 1">传统</span>
                    <span v-if="scope.row.customer_order_class_id == 2">线上</span>
                    <span v-if="scope.row.customer_order_class_id == 3">京东</span>
                </template>
            </el-table-column>
            <el-table-column label="产品名称" prop="name"></el-table-column>
            <el-table-column label="单位"  width="50px">
                <template slot-scope="scope">
                    <span>{{ scope.row.unit }}</span>
                </template>
            </el-table-column>
            <el-table-column label="数量">
                <template slot-scope="scope">
                    <span>{{ scope.row.number }}</span>
                </template>
            </el-table-column>
            <el-table-column label="销售单价">
                <template slot-scope="scope">
                    <span>{{ scope.row.selling_price }}</span>
                </template>
            </el-table-column>
            <el-table-column label="销售金额" prop="total_price"></el-table-column>
            <el-table-column label="采购单价">
                <template slot-scope="scope">
                    <span>{{ (Number(scope.row.purchase_money) / Number(scope.row.number)).toFixed(4) }}</span>
                </template>
            </el-table-column>
            <el-table-column label="采购金额" prop="purchase_money"></el-table-column>
            <el-table-column label="单个毛利">
                <template slot-scope="scope">
                    <span>{{ (Number(scope.row.selling_price) - Number(scope.row.purchase_money) / Number(scope.row.number)).toFixed(4) }}</span>
                </template>
            </el-table-column>
            <el-table-column label="提成">
                <template slot-scope="scope">
                    <span>{{ (Number(scope.row.commission_price) + Number(scope.row.user_price)).toFixed(3) }}</span>
                </template>
            </el-table-column>
            <el-table-column label="发票" width="50px" prop="customer_order_invoice_type"></el-table-column>
        </el-table>
  </div>
</template>

<script>
export default {
    data(){
        return {
            time:null,
            start_time:'',
            name:'',
            class_:'',
            user_name:'',
            tableData:[],
        }
    },
    methods:{
        seach(){
            let a,b ;
            if(this.time == null){
                a='';
                b='';
            }else{
                a=this.time[0];
                b=this.time[1];
            }   
            this.axios.post('/report.Finance/order_product_cost',{
                start_time:a,
                end_time:b,
                dep_title:this.name,
                user_name:this.user_name,
                class_id:this.class_,
            }).then(res => {
                this.tableData = res.data.customer_order_product_sku;
            })   
        },
        gettableData(){
            this.axios.post('/report.Finance/order_product_cost',{
                start_time:this.start_time,
                end_time:this.start_time,
            }).then(res => {
                this.tableData = res.data.customer_order_product_sku;
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
        dao(){
            require.ensure([], () => {
                const {export_json_to_excel} = require('@/assets/vendor/Export2Excel');
                let tHeader = ['部门','销售员','销售日期','订单编号','销售类型','产品名称','单位','销售数量','销售单价','销售金额','采购单价','采购金额','单个毛利','提成','发票'];
                let filterVal = ['dep_title','user_name', 'customer_order_sales_time','customer_order_id','lei','name','unit','number','selling_price','total_price','caigou_price','purchase_money','maoli','ticheng','customer_order_invoice_type'];
                for(let i =0;i<this.tableData.length;i++){
                    this.tableData[i]['caigou_price'] = (Number(this.tableData[i].purchase_money) / Number(this.tableData[i].number)).toFixed(4);
                    this.tableData[i]['maoli'] = (Number(this.tableData[i].selling_price)-Number(this.tableData[i].purchase_money) / Number(this.tableData[i].number)).toFixed(4);
                    this.tableData[i]['ticheng'] = (Number(this.tableData[i].commission_price) + Number(this.tableData[i].user_price)).toFixed(4);
                    if(this.tableData[i].customer_order_class_id == 1){
                        this.tableData[i]['lei'] = '传统'
                    }else if(this.tableData[i].customer_order_class_id == 2) {
                        this.tableData[i]['lei'] = '线上'
                    }else if(this.tableData[i].customer_order_class_id == 3) {
                        this.tableData[i]['lei'] = '京东'
                    }
                }
                const list = this.tableData;
                const data = this.formatJson(filterVal, list);
                export_json_to_excel(tHeader, data, '数据');
            })
        },
        formatJson(filterVal, jsonData) {
            return jsonData.map(v => filterVal.map(j => v[j]))
        },
    },
    created(){
        let d=new Date();
        let year=d.getFullYear();
        let month=this.change(d.getMonth()+1);
        let day=this.change(d.getDate());
        this.shi = year+'-'+month+'-'+day;
        this.start_time = year+'-'+month+'-'+day;
        this.gettableData();
    }
}
</script>

<style>

</style>
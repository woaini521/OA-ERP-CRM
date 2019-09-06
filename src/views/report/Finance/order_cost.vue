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
            <el-table-column type="expand">
                <template slot-scope="props">
                    <el-table :data="props.row.product_sku">
                        <el-table-column label="产品名称">
                            <template slot-scope="scope">
                                <span>{{ scope.row.name }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="单位" prop="unit"></el-table-column>
                        <el-table-column label="数量" prop="number"></el-table-column>
                        <el-table-column label="采购单价" prop="purchase_money">
                            <template slot-scope="scope">
                                <span>{{ (Number(scope.row.purchase_money)/scope.row.number).toFixed(4) }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="采购总价" prop="purchase_money"></el-table-column>
                    </el-table>
                </template>
            </el-table-column>
            <el-table-column label="订单编号" width="80px">
                <template slot-scope="scope">
                    <span>{{ scope.row.id }}</span>
                </template>
            </el-table-column>
            <el-table-column label="销售类型" width="80px">
                <template slot-scope="scope">
                    <span v-if="scope.row.class_id == 1">传统</span>
                    <span v-if="scope.row.class_id == 2">线上</span>
                    <span v-if="scope.row.class_id == 3">京东</span>
                </template>
            </el-table-column>
            <el-table-column label="部门" prop="dep_title"></el-table-column>
            <el-table-column label="销售员" prop="user_name"></el-table-column>
            <el-table-column label="销售日期" prop="sales_time"></el-table-column>
            <el-table-column label="运费" prop="logistics_price"></el-table-column>
            <el-table-column label="销售金额" prop="total_price"></el-table-column>
            <el-table-column label="成本金额" prop="total_cost_price"></el-table-column>
            <el-table-column label="补运费" prop="repair_freight"></el-table-column>
            <el-table-column label="补发票" prop="repair_invoice"></el-table-column>
            <el-table-column label="提成">
                <template slot-scope="scope">
                    <span>{{ (Number(scope.row.commission_price) + Number(scope.row.user_price)).toFixed(3) }}</span>
                </template>
            </el-table-column>
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
            this.axios.post('/report.Finance/order_cost',{
                start_time:a,
                end_time:b,
                dep_title:this.name,
                user_name:this.user_name,
                class_id:this.class_,
            }).then(res => {
                this.tableData = res.data.customer_order;
            })   
        },
        gettableData(){
            this.axios.post('/report.Finance/order_cost',{
                start_time:this.start_time,
                end_time:this.start_time,
            }).then(res => {
                this.tableData = res.data.customer_order;
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
                let tHeader = ['订单编号','销售类型','部门','销售员','销售日期','运费','销售金额','采购金额','补运费','补开票','提成'];
                let filterVal = ['id','lei','dep_title','user_name', 'sales_time','logistics_price','total_price','total_cost_price','repair_freight','repair_invoice','ticheng'];
                for(let i =0;i<this.tableData.length;i++){
                    this.tableData[i]['ticheng'] = (Number(this.tableData[i].commission_price) + Number(this.tableData[i].user_price)).toFixed(4);
                    if(this.tableData[i].class_id == 1){
                        this.tableData[i]['lei'] = '传统'
                    }else if(this.tableData[i].class_id == 2) {
                        this.tableData[i]['lei'] = '线上'
                    }else if(this.tableData[i].class_id == 3) {
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
        this.start_time = year+'-'+month+'-'+day;
        this.gettableData();
    }
}
</script>

<style>

</style>
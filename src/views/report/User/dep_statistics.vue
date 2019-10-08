<script>
export default {
    data(){
        return{
            tableData: [], // 表格数据
            times:null,
            value:'',
            start_time:'',
            tableHeader:[
                {
                   props:"dep_title" ,
                   label:"部门" 
                },
                {
                   props:"count" ,
                   label:"订单数" 
                },
                {
                   props:"total_price" ,
                   label:"总销售额" 
                },
                {
                   props:"total_cost_price" ,
                   label:"总成本" 
                },
                {
                   props:"logistics_price" ,
                   label:"物流费" 
                },
                {
                   props:"payment_amount" ,
                   label:"回款费" 
                },
                {
                   props:"wh_receivables_amount" ,
                   label:"未回款" 
                },
                {
                   props:"invoice_money" ,
                   label:"开票费" 
                },
            ]
        }
    },
    methods:{
        getTableData(){
            this.axios.post('/report.User/dep_statistics',{
                start_time:this.start_time,
                end_time:this.start_time,  
            }).then(res => {
                this.tableData = res.data.order
            })
        },
        confirm(){
            if(this.times!=null){
                 this.axios.post('/report.User/dep_statistics',{
                    start_time:this.times[0],
                    end_time:this.times[1],
                    class_id:this.value
                }).then(res => {
                    this.tableData = res.data.order
                })
            }else{
                this.axios.post('/report.User/dep_statistics',{
                    start_time:'',
                    end_time:'',
                    class_id:this.value
                }).then(res => {
                    this.tableData = res.data.order
                })
            }
        },
        input(e){
          this.times = e;
        },
        select(e){
            this.value = e;
        },
        tableColumn(h,col){
            const slotScope = {
                scopedSlots:{
                    default(scope){
                        return scope.row[col.props]
                    }
                }
            }
            let a = false;
            if(col.label == '部门' || col.label == '姓名'){
                
            }else{
              a = true;  
            }
            return(<el-table-column prop={col.props} label={col.label} {...slotScope} sortable={a}></el-table-column>)
        },
        // 默认时间
        change(t){
            if(t<10){
                return "0"+t;
            }else{
                return t;
            }
        },
    },
    render(){
        return (
            <div class="box">
                <div class="head_box">
                    <label>选择日期：</label>
                    <el-date-picker value={this.times} onInput={this.input}  type="daterange" range-separator="至" value-format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                    <el-select value={this.value} onInput={this.select} placeholder="类型" clearable style="width:100px;margin-left:20px;">
                        <el-option label="传统" value="1"></el-option>
                        <el-option label="线上" value="2"></el-option>
                        <el-option label="京东" value="3"></el-option>
                        <el-option label="国美" value="4"></el-option>
                        <el-option label="负数" value="5"></el-option>
                    </el-select>
                    <el-button style="margin-left:20px" onClick={this.confirm}>确定</el-button>
                </div>
                <el-table data={this.tableData} border show-summary style="width: 100%;margin-top:20px;">
                    <el-table-column type="index" width="50" label="排名"></el-table-column>
                    {this.tableHeader.map(item => {
                        return this.tableColumn(h,item)
                    })}  
                </el-table>
            </div>
        )
    },
    created(){
        let d=new Date();
        let year=d.getFullYear();
        let month=this.change(d.getMonth()+1);
        let day=this.change(d.getDate());
        this.start_time = year+'-'+month+'-'+day;
        this.getTableData();   
    }
}
</script>

<style lang="less" >

</style>


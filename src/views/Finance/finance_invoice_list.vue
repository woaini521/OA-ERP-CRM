<template>
    <div class="box">
        <div class="head_box">
            <label>筛选：</label>
            <el-input placeholder="名称" v-model="seach" style="width:217px;margin-left:10px"></el-input>
            <el-button type="primary" @click="seachName"  style="margin-left:20px;">搜索</el-button>
        </div>
        <div class="content_box">
                <el-table :data="tableData">
                <el-table-column label="类型" prop="type"></el-table-column>
                <el-table-column label="发票抬头" prop="rise"></el-table-column>
                <el-table-column label="票号" prop="tax_number"></el-table-column>
                <el-table-column label="金额" prop="money"></el-table-column>
                <el-table-column label="品类" prop="category"></el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status == 0">
                            待开票
                        </span>
                        <span v-if="scope.row.status == 3">
                            已开票
                        </span>
                        <span v-if="scope.row.status == 5">
                            运费待审核
                        </span>
                        <span v-if="scope.row.status >= 9">
                            已审核
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button type="primary" v-if="scope.row.status < 9" size="mini" @click="Audit(scope.row)">审核开票</el-button>
                            <br>
                            <el-button type="primary" size="mini" style="margin-top:5px;" @click="express(scope.row)">快递审核</el-button>
                        </template>
                    </el-table-column>
                </el-table>

                 <el-dialog title="快递审核" :visible.sync="dialogSend" width="60%">
                     <el-table :data="SendData">
                            <el-table-column label="快递公司" prop="express_name"></el-table-column>
                            <el-table-column label="快递编号" prop="numbers"></el-table-column>
                            <el-table-column label="快递费用" prop="money"></el-table-column>
                            <el-table-column label="快递时间" prop="add_time"></el-table-column>
                            <el-table-column label="操作">
                                <template slot-scope="scope">
                                    <el-button type="primary" @click="examine(scope.row)" size="small">审 核</el-button>
                                </template>
                            </el-table-column>
                     </el-table>
                 </el-dialog>
        </div>
        <div class="block" style="margin-top: 10px;">
                <el-pagination
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-size="per_page"
                layout="total, prev, pager, next"
                :total="total">
                </el-pagination>
            </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            seach:'',
            tableData:[], // 发票信息
            currentPage:0,//当前页
            total:0,//总数
            per_page:0,//每页多少条
            last_page:0,//总页数
            dialogSend:false, //快递审核
            SendData:[],
            id:'',
        }
    },
    methods:{
        // 搜索
        seachName(){
            this.axios.post('/Finance/finance_invoice_list',{
                rise:this.seach,
            }).then(res => {
                this.tabledata = res.data.invoice.data;
                this.currentPage = res.data.invoice.current_page;
                this.total = res.data.invoice.total;
                this.per_page = res.data.invoice.per_page;
                this.last_page = res.data.invoice.last_page;
            })
        },
        gettableData(){
            this.axios.get('/Finance/finance_invoice_list').then(res => {
                this.tableData = res.data.invoice.data;
                this.currentPage = res.data.invoice.current_page;
                this.total = res.data.invoice.total;
                this.per_page = res.data.invoice.per_page;
                this.last_page = res.data.invoice.last_page;
            })
        },
        // 分页切换
        handleCurrentChange(val) {
            const loading = this.$loading({
                lock: true,
                text: '拼命加载中',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            this.axios.post('/Finance/finance_invoice_list',{
                page:val,
            }).then(res => {
                this.tableData = res.data.invoice.data;
                this.currentPage = res.data.invoice.current_page;
                loading.close();
            })  
        },
        // 审核开票3
        Audit(a){
            this.axios.post('/Finance/finance_invoice_status',{
                id:a.id
            }).then(res => {
                 if(res.data.code == 2000){
                    this.open(res.data.msg,'success');
                    this.gettableData();
                }else{
                    this.open(res.data.msg,'error');
                }
            })
        },
        // 快递审核按钮
        express(a){
            
            this.id = a.id; 
            this.axios.get('/Finance/finance_invoice_express_select?id='+a.id).then(res => {
                this.SendData = res.data;
             })
             this.dialogSend = true;
          // alert(a.id)   
        },
        // 提交审核
        examine(a){
             this.axios.post('/Finance/finance_invoice_express_status',{
                 id:a.id
             }).then(res => {
                if(res.data.code == 2000){
                    this.open(res.data.msg,'success');
                    this.dialogSend = false;
                    this.id = '';
                }else{
                    this.open(res.data.msg,'error');
                }   
             })
            
        },
        open(a,b){
            this.$message({
                message: a,
                type: b
            });
        },
    },
    created(){
        this.gettableData();
    },
    watch:{
        $route(to){
          this.gettableData();
        }
    }
}
</script>


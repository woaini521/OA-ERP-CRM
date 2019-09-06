<template>
    <div class="box">
        <div class="head_box">
            <label>筛选：</label>
            <el-input v-model="seach" style="width:217px"></el-input>
            <el-button style="margin-left:20px">确认</el-button>
        </div>
        <el-table :data="tableData" style="margin-top:20px">
            <el-table-column label="寄送客户数" prop="customer_count"></el-table-column>
            <el-table-column label="寄送样品数" prop="product_sku_count"></el-table-column>
            <el-table-column label="寄出日期" prop="add_time" width="160"></el-table-column>
            <el-table-column label="备注" prop="remarks"></el-table-column>
            <el-table-column label="业务员" prop="user_name"></el-table-column>
            <el-table-column label="状态">
                <template slot-scope="scope">
                    <span v-if="scope.row.status == 0">草稿</span>
                    <span v-if="scope.row.status == 1">等待巴长审核</span>
                    <span v-if="scope.row.status == 5">等待采购配货</span>
                    <span v-if="scope.row.status == 10">采购设置完毕</span>
                    <span v-if="scope.row.status == 15">等待财务审核</span>
                    <span v-if="scope.row.status == 20">等待出纳付款</span>
                    <span v-if="scope.row.status == 25">等待仓库拿货</span>
                    <span v-if="scope.row.status == 30">等待厂家发货</span>
                    <span v-if="scope.row.status == 40">已经发货</span>
                    <span v-if="scope.row.status == 50">已经签收</span>
                    <span v-if="scope.row.status == 90">结束</span>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="updata(scope.row)">{{scope.row.status>10 ? '查看' :'修改' }}</el-button>
                </template>
            </el-table-column>
        </el-table>
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
import { mapActions } from "vuex";
export default {
    data(){
        return{
            seach:'',//搜索
            tableData:[],// 表格数据
            currentPage:0,//当前页
            total:0,//总数
            per_page:0,//每页多少条
            last_page:0,//总页数    
        }
    },

    methods:{
        // vuex tab显示
        ...mapActions("customerList", ["triggerReplaceId"]),
        ...mapActions("Tabs", ["triggerAddTabs", "triggerSetActiveIndex"]),

        gettableData(){
            this.axios.get('/erp.Purchase/purchase_sample_lists').then(res => {
                this.tableData = res.data.sample.data;
                this.currentPage = res.data.sample.current_page;
                this.total = res.data.sample.total;
                this.per_page = res.data.sample.per_page;
                this.last_page = res.data.sample.last_page;
            })
        },
        // 分页 
        handleCurrentChange(val) {
            const loading = this.$loading({
            lock: true,
            text: '拼命加载中',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
            });
            this.axios.post('/erp.Purchase/purchase_sample_lists',{
                page:val,
                company_id:this.value,
                user_name:this.value1,
                customer_name:this.value2,
            }).then(res => {
                this.tableData = res.data.sample.data;
                this.currentPage = res.data.sample.current_page;
                this.total = res.data.sample.total;
                this.per_page = res.data.sample.per_page;
                this.last_page = res.data.sample.last_page;
                loading.close();
            })  
        },
        // 修改
        updata(a){
            this.triggerReplaceId(a.id);
            this.$router.push({ path: `/erp/Purchase/sample_modification/${a.id}`,params:{
                    userId:a.id,
                    name:`/erp/Purchase/sample_modification/${a.id}`,
                }
            });
            let ins1 = {
                route: `/erp/Purchase/sample_modification/${a.id}`,
                name: "样品采购修改",
            };
            let ins2 = `/erp/Purchase/sample_modification/${a.id}`;
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
    },
    created(){
        this.gettableData();
    }
}
</script>


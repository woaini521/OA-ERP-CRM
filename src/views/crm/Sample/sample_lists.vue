<template>
    <div class="box">
        <div>
            <label>筛选：</label>
            <el-input v-model="seach" placeholder="业务员" style="width:217px"></el-input>
            <el-button style="margin-left:20px" @click="comfile">确认</el-button>
        </div>
        <el-table :data="tableData" style="margin-top:20px">
            <el-table-column label="寄送客户数" prop="customer_count"></el-table-column>
            <el-table-column label="寄送样品数" prop="product_sku_count"></el-table-column>
            <el-table-column label="寄出日期" prop="add_time" width="160"></el-table-column>
            <el-table-column label="备注" prop="remarks"></el-table-column>
            <el-table-column label="业务员" prop="user_name"></el-table-column>
            <el-table-column label="状态" prop="status">
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
            <el-table-column label="操作" width="280">
                <template slot-scope="scope">
                    <el-button type="success" v-if="scope.row.status == 1" size="mini" @click="shenhe(scope.row)">审核</el-button>
                    <el-button type="primary" size="mini" v-if="scope.row.status <= 1" @click="updata(scope.row)">修改</el-button>
                    <el-button type="info" v-if="scope.row.status != 0" size="mini" @click="see(scope.row)">查看</el-button>
                    <el-button type="danger" size="mini" v-if="scope.row.status <= 25" @click="deletes(scope.row)">删除</el-button>
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
            this.axios.get('/crm.Sample/sample_lists').then(res => {
                this.tableData = res.data.sample.data;
                this.currentPage = res.data.sample.current_page;
                this.total = res.data.sample.total;
                this.per_page = res.data.sample.per_page;
                this.last_page = res.data.sample.last_page;
            })
        },
        comfile(){
            this.axios.post('/crm.Sample/sample_lists',{
               user_name:this.seach,
            }).then(res => {
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
            this.axios.post('/crm.Sample/sample_lists',{
                page:val,

                user_name:this.seach,

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
            this.$router.push({ path: `/crm/Sample/updata_sample/${a.id}`,params:{
                    userId:a.id,
                    name:`/crm/Sample/updata_sample/${a.id}`,
                }
            });
            let ins1 = {
                route: `/crm/Sample/updata_sample/${a.id}`,
                name: "样品修改",
            };
            let ins2 = `/crm/Sample/updata_sample/${a.id}`;
            this.triggerAddTabs(ins1);
            this.triggerSetActiveIndex(ins2);
        },
        //删除
        deletes(a){
            this.axios.post('/crm.Sample/sample_delete',{
                id:a.id
            }).then(res => {
                if(res.data.code == 2000){
                    this.gettableData();
                    this.open(res.data.msg,'success')
                }else{
                    this.open(res.data.msg,'error')
                }
            })
        },
        shenhe(a){
           this.axios.post('/crm.Sample/sample_status',{
                id:a.id
            }).then(res => {
                if(res.data.code == 2000){
                    this.gettableData();
                    this.open(res.data.msg,'success')
                }else{
                    this.open(res.data.msg,'error')
                }
            }) 
        },
        see(a){
            this.triggerReplaceId(a.id);
            this.$router.push({ path: `/crm/Sample/seeSample/${a.id}`,params:{
                    userId:a.id,
                    name:`/crm/Sample/seeSample/${a.id}`,
                }
            });
            let ins1 = {
                route: `/crm/Sample/seeSample/${a.id}`,
                name: "样品查看",
            };
            let ins2 = `/crm/Sample/seeSample/${a.id}`;
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
    activated(){
        this.gettableData();
    }
}
</script>


<template>
    <div class="box">
        <div>
            <label>筛选：</label>
            <el-input v-model="seach" style="width:217px"></el-input>
            <el-button type="primary" style="margin-left:40px;">搜索</el-button>
        </div>
        <div class="content_box">
            <el-table :data="tableData">
                <el-table-column label="产品名称">
                    <template slot-scope="scope">
                        <span>{{ scope.row.name}}{{ scope.row.class_name}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="数量" prop="number"></el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status == 0">提交</span>
                        <span v-if="scope.row.status == 3">审核完等待采购</span>
                        <span v-if="scope.row.status == 5">采购完毕</span>
                        <span v-if="scope.row.status == 6">等待财务审核</span>
                        <span v-if="scope.row.status == 9">完成</span>
                    </template>
                </el-table-column>
                <el-table-column label="录入人" prop="user_name"></el-table-column>
                <el-table-column label="添加时间" prop="add_time"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary"  v-if="scope.row.status == 0" size="small" @click="verify(scope.row)">审核</el-button>
                        <el-button type="danger"  v-if="scope.row.status == 0" size="small" @click="deteles(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
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
    data () {
        return {
            seach:'', // 搜索
            tableData:[], // table 数据
             //分页器
            currentPage:0,//当前页
            total:0,//总数
            per_page:0,//每页多少条
            last_page:0//总页数
        }
    },
    methods:{
        // 获取数据
        gettableData(){
            this.axios.get('/erp.Product/product_product_stock_lists').then(res => {
                this.tableData = res.data.product_stock.data;
                this.currentPage = res.data.product_stock.current_page;
                this.total = res.data.product_stock.total;
                this.per_page = res.data.product_stock.per_page;
                this.last_page = res.data.product_stock.last_page;
            })
        },
        // 分页器
        handleCurrentChange(val) {
            const loading = this.$loading({
                lock: true,
                text: '拼命加载中',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            this.axios.post('/erp.Product/product_product_stock_lists',{
                page:val,
            }).then(res => {
                this.tableData = res.data.product_stock.data;
                this.currentPage = res.data.product_stock.current_page;
                loading.close();
            
            })  
        },
        // 删除
        deteles(a){
            this.axios.post('/erp.Product/product_product_stock_delete',{
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
        // 审核
        verify(a){
           this.axios.post('/erp.Product/product_product_stock_status',{
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

<style lang="less" scoped>

</style>

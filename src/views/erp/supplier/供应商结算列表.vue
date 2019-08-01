<template>
    <div class="box">
        <div class="head_box">
            <label>筛选：</label>
            <el-input v-model="seach" style="width:217px"></el-input>
            <el-button type="primary" style="margin-left:40px;">搜索</el-button>
        </div>
        <el-table :data="tableData">
            <el-table-column label="供应商" prop=""></el-table-column>
            <el-table-column label="结算方式" prop=""></el-table-column>
            <el-table-column label="金额" prop=""></el-table-column>
            <el-table-column label="结算时间" prop=""></el-table-column>
            <el-table-column label="状态" prop=""></el-table-column>
            <el-table-column label="操作"></el-table-column>
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
export default {
    data(){
        return {
           seach:'',  // 搜索
           tableData:[],//表格数据
           currentPage:'',//当前页
            total:'',//总数
            per_page:'',//每页多少条
            last_page:'',//总页数
        }
    },
    methods:{
        gettableData(){

        },
         // fenye
        handleCurrentChange(val) {
            const loading = this.$loading({
                lock: true,
                text: '拼命加载中',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            this.axios.post('',{
                page:val,
            }).then(res => {
                this.tableData = res.data.product_stock.data;
                this.currentPage = res.data.product_stock.current_page;
                loading.close();
            
            })  
        },
    },
    created(){
        this.gettableData();
    }
}
</script>

<style lang="less" scoped>
.box{
    min-width: 998px;
    .head_box{
        margin-top: 20px;
    }
}
</style>
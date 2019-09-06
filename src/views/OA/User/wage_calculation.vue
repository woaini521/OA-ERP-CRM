<template>
    <div class="box">
        <div>
            <label>筛选：</label>
            <el-date-picker v-model="time" value-format="yyyy-MM" type="month" placeholder="选择月"></el-date-picker>
            <el-button style="margin-left:20px" @click="seach">搜索</el-button>
        </div>
        <el-table :data="tableData">
            <el-table-column label="名称" prop="">
                <template slot-scope="scope">
                    <span>{{ scope.row.dep_title }}/{{ scope.row.name }}</span>
                </template>
            </el-table-column>
            <el-table-column label="基本工资" prop="salary"></el-table-column>
            <el-table-column label="绩效" prop="jixiao"></el-table-column>
            <el-table-column label="实际的基本工资" prop="jiben_money"></el-table-column>
            <el-table-column label="实际绩效工资" prop="ticheng_money"></el-table-column>
            <el-table-column label="请假天数" prop="qj_tianshu"></el-table-column>
            <el-table-column label="请假小时" prop="qj_xiaoshi"></el-table-column>
            <el-table-column label="迟到金额" prop="chidao_money"></el-table-column>
        </el-table>
    </div>
</template>

<script>
export default {
    data(){
        return {
            time:'',
            tableData:[],
        }
    },
    methods:{
        gettableData(){
            this.axios.get('/oa.User/wage_calculation').then(res => {
                this.tableData = res.data.user;
            })
        },
        seach(){
             this.axios.post('/oa.User/wage_calculation',{
                mouth:this.time
             }).then(res => {
                this.tableData = res.data.user;
            })
        }
    },
    created(){
        this.gettableData();
    }
}
</script>

<style lang="less" scoped>

</style>
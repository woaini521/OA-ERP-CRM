<template>
    <div class="box">
        <div class="head_box">
            <label>选择日期：</label>
            <el-date-picker v-model="times"  type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
            <el-button style="margin-left:20px" @click="confirm">确定</el-button>
        </div>
        <el-table :data="tableData" border show-summary style="width: 100%;margin-top:20px;">
            <el-table-column prop="id" label="部门" width="180"></el-table-column>
            <el-table-column prop="name" label="姓名"></el-table-column>
            <el-table-column prop="amount1" sortable label="一级机构"></el-table-column>
            <el-table-column prop="amount2" sortable label="二级机构"></el-table-column>
            <el-table-column prop="amount3" sortable label="三级机构"></el-table-column>
            <el-table-column label="合计" sortable prop="amount4"></el-table-column>
        </el-table>
    </div>
</template>

<script>
export default {
    data(){
        return{
            tableData: [{
                id: '12987122',
                name: '王小虎',
                amount1: '234',
                amount2: '3.2',
                amount3: 10,
                amount4:Number(10)+Number(3.2)+Number(234),
                }, {
                id: '12987123',
                name: '王小虎',
                amount1: '165',
                amount2: '4.43',
                amount3: 12,
                amount4:Number(12)+Number(4.43)+Number(165),
                }, {
                id: '12987124',
                name: '王小虎',
                amount1: '324',
                amount2: '1.9',
                amount3: 9,
                amount4:Number(9)+Number(1.9)+Number(324),
                }, {
                id: '12987125',
                name: '王小虎',
                amount1: '621',
                amount2: '2.2',
                amount3: 17,
                amount4:Number(621)+Number(2.2)+Number(17),
                }, {
                id: '12987126',
                name: '王小虎',
                amount1: '539',
                amount2: '4.1',
                amount3: 15,
                amount4:Number(539)+Number(4.1)+Number(15),
            }], // 表格数据
            times:'',
        }
    },
    methods:{
        getTableData(){
            this.axios.get('/report.User/sales_rank').then(res => {

            })
        },
        confirm(){
            window.location.href = 'https://www.baidu.com'
        }
    },
    created(){
        this.getTableData();   
    }
}
</script>

<style lang="less" scoped>

</style>


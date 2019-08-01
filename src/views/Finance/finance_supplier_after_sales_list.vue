<template>
    <div class="box">
        <p>供应商售后款</p>
        <el-table :data="tableData">
            <el-table-column label="供应商"></el-table-column>
            <el-table-column label="供应商地址"></el-table-column>
            <el-table-column label="款项"></el-table-column>
            <el-table-column label="状态"></el-table-column>
            <el-table-column label="操作"></el-table-column>
        </el-table>
    </div>
</template>

<script>
export default {
    data(){
        return {
            tableData:[],
        }
    },
    methods:{

    },
    created(){
        
    }
}
</script>

<style lang="less" scoped>

</style>



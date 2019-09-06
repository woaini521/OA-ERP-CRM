<template>
    <div class="box" style="padding-bottom:20px;">
        <div class="head_box">
            <label>选择日期：</label>
            <el-date-picker v-model="shijian"  type="daterange" range-separator="至" start-placeholder="开始日期" value-format="timestamp" end-placeholder="结束日期"></el-date-picker>
            <el-button style="margin-left:20px" @click="seach">确定</el-button>
        </div>
        <el-table v-for="item in tableData" :key="item.dep_name" :data="item.count" border show-summary style="width: 650px;margin-top:20px;" class="elTableB">
            <el-table-column :label="item.dep_name"  prop="name"></el-table-column>
            <el-table-column prop="yiji" sortable label="一级机构" width="110px"></el-table-column>
            <el-table-column prop="erji" sortable label="二级机构" width="110px"></el-table-column>
            <el-table-column prop="sanji" sortable label="三级机构" width="110px"></el-table-column>
            <el-table-column prop="siji" sortable label="四级机构" width="110px"></el-table-column>
            <el-table-column prop="user_total" sortable label="合计"></el-table-column>
        </el-table>
    </div>
</template>

<script>
export default {
    data(){
        return{
            tableData: [], // 表格数据
            shijian:null,
        }
    },
    methods:{
        gettableData(){
            this.axios.get('/report.Customer/customer_visit').then(res => {
               this.tableData = res.data; 
            })
        },
        seach(){
            if(this.shijian==null){
                this.axios.post('/report.Customer/customer_visit',{
                    start_time:'',
                    end_time:''
                }).then(res => {
                    this.tableData = res.data; 
                })
            }else{
                this.axios.post('/report.Customer/customer_visit',{
                    start_time:this.shijian[0]/1000,
                    end_time:this.shijian[1]/1000
                }).then(res => {
                    this.tableData = res.data; 
                })
            }
            
        }
    },
    created(){
        this.gettableData();
    }
}
</script>

<style lang="less">
.elTableB td,.elTableB th{
    padding-top: 0px !important;
    padding-bottom: 0px !important;
}

</style>


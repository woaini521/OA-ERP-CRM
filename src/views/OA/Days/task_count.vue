<template>
    <div class="box">
        <div class="box_head">
            <label>筛选：</label>
            <el-date-picker v-model="time" type="daterange" value-format="timestamp" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>
            <el-button type="parimary" @click="seach" style="margin-left:20px">搜索</el-button>
        </div>
        <el-table :data="tableData" show-summary>
            <el-table-column label="姓名" prop="name"></el-table-column>
            <el-table-column label="职位" prop="title">
                <template slot-scope="scope">
                    {{ formatterColumn(scope.row.title) }}
                </template>
            </el-table-column>
            <el-table-column label="类型" prop="task_type_name"></el-table-column>
            <el-table-column label="工作量" prop="work_count" sortable>
                <template slot-scope="scope">
                    <el-button @click="jump(scope.row.task_user)" type="text" size="mini">{{scope.row.work_count}}</el-button>
                </template>
            </el-table-column>
            <el-table-column label="设计时间" prop="work_time1_sum_sheji"></el-table-column>
            <el-table-column label="策划字数" prop="work_time1_sum_cehua"></el-table-column>
            <el-table-column label="设计时间(业绩)" prop="work_time2_sum_sheji"></el-table-column>
            <el-table-column label="策划字数(业绩)" prop="work_time2_sum_cehua"></el-table-column>
            <!-- <el-table-column label="交付量"></el-table-column> -->
        </el-table>
    </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
    data () {
        return {
            time:[],
            tableData:[],
        }
    },
    methods:{
        ...mapActions("customerList", ["triggerReplaceId"]),
        ...mapActions("Tabs", ["triggerAddTabs", "triggerSetActiveIndex"]),
        seach(a){
            if(this.time.length > 0){
                this.axios.post('/oa.Days/task_count',{
                    start_time:this.time[0],
                    end_time:this.time[1],
                }).then(res => {
                    this.tableData = res.data 
                })
            }else{
               this.axios.post('/oa.Days/task_count',{
                    start_time:'',
                    end_time:'',
                }).then(res => {
                    this.tableData = res.data 
                }) 
            }
            
        },
        gettableData(){
            this.axios.get('/oa.Days/task_count').then(res => {
                this.tableData = res.data
            })
        },
        formatterColumn(cellValue) {
            let value = cellValue.join( '、' );
            //console.log(value)
            return value
        },
        jump(a){
            this.$router.push({ name:'任务列表',params: {name: a}});
            let ins1 = {
                route: `/oa/Days/task_select`,
                name: "任务列表",
            };
            let ins2 = `/oa/Days/task_select`;
            this.triggerAddTabs(ins1);
            this.triggerSetActiveIndex(ins2); 
        }
    },
    created(){
        this.gettableData();
    }
}
</script>

<style lang="less" scoped>
    .box_head{
        margin-bottom: 20px;
    }
</style>



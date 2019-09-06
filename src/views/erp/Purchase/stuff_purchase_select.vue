<template>
    <div class="box">
        <div>
            <label>筛选：</label>
            <el-date-picker v-model="time" value-format="timestamp" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
            <el-button style="margin-left:20px" @click="seach">搜索</el-button>
        </div>
        <el-table :data="tableData">
            <el-table-column label="发起人" prop="apply_name"></el-table-column>
            <el-table-column label="金额" prop="money"></el-table-column>
            <el-table-column label="内容" prop="content"></el-table-column>
            <el-table-column label="备注" prop="remark"></el-table-column>
            <el-table-column label="状态">
                <template slot-scope="scope">
                    <span>{{ scope.row.status.status_text }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="danger" size="mini" @click="caigou(scope.row)">采购</el-button>
                    <el-button type="primary" size="mini" @click="update(scope.row)">修改</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="block" style="margin-top: 10px;">
            <el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-size="per_page" layout="total, prev, pager, next" :total="total"></el-pagination>
        </div>

        <el-dialog title="采购信息" :visible.sync="dialogFormVisible">
            <el-form :model="dialogForm">
                <el-form-item label="金额" label-width="90px">
                    <el-input v-model="dialogForm.money" style="width:80%"></el-input>
                </el-form-item>
                <el-form-item label="备注" label-width="90px">
                     <el-input type="textarea" v-model="dialogForm.remark" style="width:80%"></el-input>
                </el-form-item>
                <el-form-item label=" " label-width="90px">
                     <el-button @click="confirm">提交</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>  

        <el-dialog title="采购信息修改" :visible.sync="dialogFormVisible1">
            <el-form :model="dialogForm1">
                <el-form-item label="金额" label-width="90px">
                    <el-input v-model="dialogForm1.money" style="width:80%"></el-input>
                </el-form-item>
                <el-form-item label="备注" label-width="90px">
                     <el-input type="textarea" v-model="dialogForm1.remark" style="width:80%"></el-input>
                </el-form-item>
                <el-form-item label=" " label-width="90px">
                     <el-button @click="confirm1">提交</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>


    </div>
</template>

<script>
export default {
    data(){
        return {
            time:null,
            tableData:[],
            currentPage: 0, //当前页
            total: 0, //总数
            per_page: 0, //每页多少条
            last_page: 0, //总页数
            dialogFormVisible:false,
            dialogForm:{
                money:'',
                remark:'',
                user_id:'',
                id:'',
            },
            ID:'',
            dialogFormVisible1:false,
            dialogForm1:{
                money:'',
                remark:'',
                id:'',
            },
        }
    },
    methods:{
        // 分页
        handleCurrentChange(val){
            let a,b;
            if(this.time == null){
                a = '';
                b = '';
            }else{
                a = this.time[0]/1000;
                b = this.time[1]/1000;
            }
            this.axios.post('/erp.Purchase/stuff_purchase_select',{
                page:val,
                start_time:a,
                end_time:b
            }).then(res => {
                this.tableData = res.data.data.data;
                this.currentPage = res.data.data.current_page;
                this.total = res.data.data.total;
                this.per_page = res.data.data.per_page;
                this.last_page = res.data.data.last_page;
            })
        },
        seach(){
            let a,b;
            if(this.time == null){
                a = '';
                b = '';
            }else{
                a = this.time[0]/1000;
                b = this.time[1]/1000;
            }
            this.axios.post('/erp.Purchase/stuff_purchase_select',{
                start_time:a,
                end_time:b
            }).then(res => {
                this.tableData = res.data.data.data;
                this.currentPage = res.data.data.current_page;
                this.total = res.data.data.total;
                this.per_page = res.data.data.per_page;
                this.last_page = res.data.data.last_page;
            })
        },
        gettableData(){
            this.axios.get('/erp.Purchase/stuff_purchase_select').then(res => {
                this.tableData = res.data.data.data;
                this.currentPage = res.data.data.current_page;
                this.total = res.data.data.total;
                this.per_page = res.data.data.per_page;
                this.last_page = res.data.data.last_page;
                this.ID = res.data.user_id;
            })
        },
        caigou(a){
            this.dialogFormVisible = true;
            this.dialogForm.user_id = this.ID;
            this.dialogForm.id = a.id;
        },
        update(a){
            this.axios.get('/oa.Days/stuff_update?id='+a.id).then(res => {
                if( res.data.xiugai == 1){
                    this.dialogForm1.remark = res.data.remark;
                    this.dialogForm1.money = res.data.money;
                    this.dialogFormVisible1 = true;
                    this.dialogForm1.id = a.id;
                }else{
                   this.open('未填写采购信息','error'); 
                } 
            })
        },
        confirm(){
            this.axios.post('/erp.Purchase/stuff_purchase_verify',this.dialogForm).then(res => {
                if(res.data.code == 2000){
                    this.open(res.data.msg,'success');
                    this.dialogFormVisible = false;
                    this.gettableData();
                }else{
                    this.open(res.data.msg,'error');
                }
            })
        },
        confirm1(){
            this.axios.post('/oa.Days/stuff_update',this.dialogForm1).then(res => {
                if(res.data.code == 2000){
                    this.open(res.data.msg,'success');
                    this.dialogFormVisible1 = false;
                    this.gettabledata();
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
    }
}
</script>

<style lang="less" scoped>

</style>
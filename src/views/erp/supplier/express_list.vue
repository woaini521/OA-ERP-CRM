<template>
    <div>
        <div>
            <label> 筛选：</label>
            <el-input v-model="name" style="width:217px"></el-input>
            <el-button style="margin-left:20px;" @click="seach">搜索</el-button>
            <el-button style="margin-left:20px;" @click="add" type="primary">新增</el-button>
        </div>
        <el-table :data="tableData">
            <el-table-column label="名称" prop="name"></el-table-column>
            <el-table-column label="手机号码" prop="phone"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button @click="update(scope.row)" type="primary" size="mini">修改</el-button>
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
        <el-dialog title="新增修改" :visible.sync="dialogTableVisible">
            <el-form :model="dialogTableVisibleForm">
                <el-form-item label="名称" label-width="90px">
                    <el-input v-model="dialogTableVisibleForm.name" style="width:217px"></el-input>
                </el-form-item>
                <el-form-item label="联系电话" label-width="90px">
                    <el-input v-model="dialogTableVisibleForm.phone" style="width:217px"></el-input>
                </el-form-item>
                <el-form-item label="" label-width="90px">
                    <el-button @click="send">提交</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data () {
        return {
            name:'',
            tableData:[],
            currentPage:0,//当前页
            total:0,//总数
            per_page:0,//每页多少条
            last_page:0,//总页数
            dialogTableVisible:false,
            dialogTableVisibleForm:{
                id:'',
                name:'',
                phone:'',
            }
        }
    },
    methods:{
        gettableData(){
            this.axios.get('/erp.Supplier/express_list').then(res => {
                this.tableData = res.data.express.data;
                this.currentPage = res.data.express.current_page;
                this.total = res.data.express.total;
                this.per_page = res.data.express.per_page;
                this.last_page = res.data.express.last_page;
            })
        },
        handleCurrentChange(val){
            this.axios.post('/erp.Supplier/express_list',{
                page:val,
                name:this.name,
            }).then(res => {
                this.tableData = res.data.express.data;
                this.currentPage = res.data.express.current_page;
                this.total = res.data.express.total;
                this.per_page = res.data.express.per_page;
                this.last_page = res.data.express.last_page;
            })
        },
        seach(){
            this.axios.post('/erp.Supplier/express_list',{
                page:val,
                name:this.name,
            }).then(res => {
                this.tableData = res.data.express.data;
                this.currentPage = res.data.express.current_page;
                this.total = res.data.express.total;
                this.per_page = res.data.express.per_page;
                this.last_page = res.data.express.last_page;
            })
        },
        update(a){
            this.dialogTableVisible = true;
            this.dialogTableVisibleForm.id = a.id;
            this.dialogTableVisibleForm.name = a.name;
            this.dialogTableVisibleForm.phone = a.phone;
        },
        add(){
            this.dialogTableVisible = true;
            this.dialogTableVisibleForm.id = '';
            this.dialogTableVisibleForm.name = '';
            this.dialogTableVisibleForm.phone = '';
        },
        send(){
            if(this.dialogTableVisibleForm.id == ''){
                if(this.dialogTableVisibleForm.name == '' || this.dialogTableVisibleForm.phone == ''){
                    this.open('填写完整','error');    
                }else{
                    this.axios.post('/erp.Supplier/express_add',{
                        name:this.dialogTableVisibleForm.name,
                        phone:this.dialogTableVisibleForm.phone,
                    }).then(res => {
                        if(res.data.code == 2000){
                            this.gettableData();
                            this.dialogTableVisible = false;
                            this.open(res.data.msg,'success');
                        }else{
                            this.open(res.data.msg,'error');
                        }  
                    })
                }
            }else{
                this.axios.post('/erp.Supplier/express_update',{
                        id:this.dialogTableVisibleForm.id,
                        name:this.dialogTableVisibleForm.name,
                        phone:this.dialogTableVisibleForm.phone,
                    }).then(res => {
                        if(res.data.code == 2000){
                            this.gettableData();
                            this.dialogTableVisible = false;
                            this.open(res.data.msg,'success');
                        }else{
                            this.open(res.data.msg,'error');
                        }  
                    })
            }
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
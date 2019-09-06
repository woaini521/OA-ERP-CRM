<template>
    <div>
        <el-button @click="add">发起</el-button>
        <el-table :data="tableData">
            <el-table-column label="时间" prop="add_time"></el-table-column>
            <el-table-column label="内容" prop="content"></el-table-column>
            <el-table-column label="发起人">
                <template slot-scope="scope">
                    <span>{{scope.row.dep_name}}/{{scope.row.apply_name}}</span>
                </template>
            </el-table-column>
            <el-table-column label="状态">
                <template slot-scope="scope">
                    <span>{{scope.row.status.status_text}}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button size="mini" :disabled="scope.row.status.status > 0" type="danger" @click="deteles(scope.row)">删除</el-button>
                    <el-button size="mini" :disabled="scope.row.status.status > 0" type="primary" @click="update(scope.row)">修改</el-button>
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
        <el-dialog title="发起" :visible.sync="dialogVisible">
           <el-form :model="dialogVisibleForm">
               <el-form-item label="内容" label-width="90px">
                   <el-input type="textarea" v-model="dialogVisibleForm.content"></el-input>
               </el-form-item>
               <el-form-item label=" " label-width="90px">
                   <el-button @click="send">提交</el-button>
               </el-form-item>
           </el-form>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return{
            tableData:[],
            dialogVisible:false,
            dialogVisibleForm:{
                content:'',
                id:'',
            },
            currentPage:0,//当前页
            total:0,//总数
            per_page:0,//每页多少条
            last_page:0,//总页数
        }
    },
    methods:{
        add(){
            this.dialogVisible = true;
            this.dialogVisibleForm.id = '';
            this.dialogVisibleForm.content = '';
        },
        send(){
            if(this.dialogVisibleForm.content == ''){
                this.$message({
                    message: '输入内容',
                    type: 'error'
                });
            }else{
                if(this.dialogVisibleForm.content == ''){
                    this.axios.post('/oa.Days/stuff_add',this.dialogVisibleForm).then(res => {
                        if(res.data.code == 2000){
                            this.$message({
                                message: res.data.msg,
                                type: 'success'
                            }); 
                            this.gettableData()
                            this.dialogVisible = false;
                        }else{
                            this.$message({
                                message: res.data.msg,
                                type: 'error'
                            });     
                        }
                    })
                }else{
                    this.axios.post('/oa.Days/stuff_update',this.dialogVisibleForm).then(res => {
                        if(res.data.code == 2000){
                            this.$message({
                                message: res.data.msg,
                                type: 'success'
                            }); 
                            this.gettableData()
                            this.dialogVisible = false;
                        }else{
                            this.$message({
                                message: res.data.msg,
                                type: 'error'
                            });     
                        }
                    })
                }
                
            }
        },
        gettableData(){
            this.axios.get('/oa.Days/stuff_select').then(res => {
                this.tableData = res.data.data.data;
                this.currentPage = res.data.data.current_page;
                this.total = res.data.data.total;
                this.per_page = res.data.data.per_page;
                this.last_page = res.data.data.last_page;
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
            this.axios.post('/erp.Purchase/purchase_sample_lists',{
                page:val,
            }).then(res => {
                this.tableData = res.data.data.data;
                this.currentPage = res.data.data.current_page;
                this.total = res.data.data.total;
                this.per_page = res.data.data.per_page;
                this.last_page = res.data.data.last_page;
                loading.close();
            })  
        },
        deteles(a){
            this.axios.post('/oa.Days/stuff_delete',{
                id:a.id,
            }).then(res => {
                    if(res.data.code == 2000){
                        this.$message({
                            message: res.data.msg,
                            type: 'success'
                        }); 
                        this.gettableData()
                    }else{
                        this.$message({
                            message: res.data.msg,
                            type: 'error'
                        });     
                    }
                })
        },
        update(a){
            this.axios.get('/oa.Days/stuff_update?id='+a.id).then(res => {
                this.dialogVisibleForm.content = res.data.content;
                this.dialogVisibleForm.id = a.id;
                this.dialogVisible = true;
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
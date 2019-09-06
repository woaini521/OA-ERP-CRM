<template>
    <div class="box">
        <div class="head_box">
            <el-button type="primary" @click="addCompany">添加收款账号</el-button> 
        </div>
        <div class="conten_box">
            <el-table :data="tableData" show-summary>
                <el-table-column label="收款账号" prop="receiving_account"></el-table-column>
                <el-table-column label="名称" prop="receiving_title"></el-table-column>
                <el-table-column label="收款人" prop="receiving_name"></el-table-column>
                <el-table-column label="金额" prop="money" sortable></el-table-column>
                <el-table-column label="查看" width="100px">
                    <template slot-scope="scope">
                        <el-button type="text" size="mini" @click="see(scope.row)">查看记录</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="100px">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" @click="edit(scope.row)">修改</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <el-dialog title="添加收款人" :visible.sync="dialogNumber" >
             <el-form :model="formNumbers">
                <el-form-item label="公司" label-width="90px">
                    <el-radio v-model="formNumbers.type" label="1">企业</el-radio>
                    <el-radio v-model="formNumbers.type" label="0">个人</el-radio>
                </el-form-item>
                <el-form-item label="收款名称" label-width="90px">
                     <el-input style="width:317px" v-model="formNumbers.receiving_title"></el-input>
                 </el-form-item>
                 <el-form-item label="收款人" label-width="90px">
                     <el-input style="width:317px" v-model="formNumbers.receiving_name"></el-input>
                 </el-form-item>
                 <el-form-item label="收款账号" label-width="90px">
                     <el-input style="width:317px" v-model="formNumbers.receiving_account"></el-input>
                 </el-form-item>
             </el-form>
             <div slot="footer" class="dialog-footer">
                <el-button @click="dialogNumber = false">取 消</el-button>
                <el-button type="primary" @click="add">确 定</el-button>
             </div>
        </el-dialog>

        <el-dialog title="日志" :visible.sync="dialogDaily" width="60%">
            <el-table :data="Daily">
                <el-table-column label="时间" prop="add_time" width="160"></el-table-column>
                <el-table-column label="内容" prop="content"></el-table-column>
                <el-table-column label="金额" prop="money"></el-table-column>
                <el-table-column label="剩余金额" prop="money_new"></el-table-column>
                <el-table-column label="操作">
                     <template slot-scope="scope">
                        <span>{{ scope.row.data_table }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="录入人">
                    <template slot-scope="scope">
                        <span>{{ scope.row.dep_title }}/{{ scope.row.user_name }}</span>
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
        </el-dialog>
    </div>
</template>

<script>
export default {
    data(){
        return{
            search:'',
            tableData:[],//table 数据
            dialogNumber:false,
            formNumbers:{ // 添加表单
                type:'',
                receiving_name:'',
                receiving_title:'',
                receiving_account:'',
                id:'',
            },
            dialogDaily:false,
            ID:'',
            Daily:[],
            currentPage:0,//当前页
            total:0,//总数
            per_page:0,//每页多少条
            last_page:0,//总页数
        }
    },
    methods:{
        // 获取数据
        gettableData(){
            this.axios.get('/Finance/payee_lists').then(res=>{
                this.tableData = res.data;
            })
        },
        // tijiao 信息
        add(){
            this.dialogNumber = false;
            if(this.formNumbers.id==''){
                this.axios.post('/Finance/payee_add',{
                    type:this.formNumbers.type,
                    receiving_title:this.formNumbers.receiving_title,
                    receiving_name:this.formNumbers.receiving_name,
                    receiving_account:this.formNumbers.receiving_account,
                }).then(res => {
                    if(res.data.code == 2000){
                        this.gettableData();
                        this.open(res.data.msg,'success');
                        this.dialogNumber = false;
                    }else{
                        this.open(res.data.msg,'error');
                    }
                })
            }else{
              this.axios.post('/Finance/payee_update',{
                    type:this.formNumbers.type,
                    receiving_name:this.formNumbers.receiving_name,
                    receiving_title:this.formNumbers.receiving_title,
                    receiving_account:this.formNumbers.receiving_account,
                    id:this.formNumbers.id,
                }).then(res => {
                    if(res.data.code == 2000){
                        this.gettableData();
                        this.open(res.data.msg,'success');
                        this.dialogNumber = false;
                    }else{
                        this.open(res.data.msg,'error');
                    }
                })  
            }
        },
        
         // 添加 按钮
        addCompany(){
            this.dialogNumber = true;  
            this.formNumbers.type='';
            this.formNumbers.receiving_name='';
            this.formNumbers.receiving_title = '';
            this.formNumbers.receiving_account='';
            this.formNumbers.id='';
        },
        //修改按钮
        edit(a){
            this.dialogNumber = true; 
            this.formNumbers.type= String(a.type);
            this.formNumbers.receiving_title=a.receiving_title;
            this.formNumbers.receiving_name=a.receiving_name;
            this.formNumbers.receiving_account=a.receiving_account;
            this.formNumbers.id=a.id;  
        },
        see(a){
            this.ID = a.id
            this.axios.get('/Finance/payee_log_lists?id='+a.id).then(res => {
                this.dialogDaily = true;
                this.Daily = res.data.data;
                this.currentPage = res.data.current_page;
                this.total = res.data.total;
                this.per_page = res.data.per_page;
                this.last_page = res.data.last_page;
            })
        },
        handleCurrentChange(val){
           this.axios.get('/Finance/payee_log_lists?id='+this.ID+'&page='+val).then(res => {
                this.dialogDaily = true;
                this.Daily = res.data.data;
                this.currentPage = res.data.current_page;
                this.total = res.data.total;
                this.per_page = res.data.per_page;
                this.last_page = res.data.last_page;
            }) 
        }
    },
    created(){
        this.gettableData()
    },
    watch:{
        $route(to){
            this.gettableData();
        }
    }
}
</script>

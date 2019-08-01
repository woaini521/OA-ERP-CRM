<template>
    <div class="box">
        <div class="head_box">
            <label>筛选</label>
            <el-input v-model="search" placeholder="请输入内容" style="width:217px;margin-left:10px"></el-input>
            <el-button style="margin-left:20px" type="primary" @click="seach">搜索</el-button>
            <el-button style="margin-left:100px" type="primary" @click="addCompany">添加收款账号</el-button> 
        </div>
        <div class="conten_box">
            <el-table :data="tableData">
                <el-table-column label="收款账号" prop="receiving_account"></el-table-column>
                <el-table-column label="名称" prop="receiving_title"></el-table-column>
                <el-table-column label="收款人" prop="receiving_name"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" @click="edit(scope.row)">修改</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="block" style="margin-top: 10px;">
                <el-pagination
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-size="per_page"
                layout="total, prev, pager, next"
                :total="total">
                </el-pagination>
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
            currentPage:0,//当前页
            total:0,//总数
            per_page:0,//每页多少条
            last_page:0,//总页数
        }
    },
    methods:{
        // 分页切换
        handleCurrentChange(val) {
            const loading = this.$loading({
                lock: true,
                text: '拼命加载中',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            this.axios.post('/Finance/payee_lists',{
                page:val,
            }).then(res => {
                this.tableData = res.data.data;
                this.currentPage = res.data.current_page;
                loading.close();
            })  
        },
        // 获取数据
        gettableData(){
            this.axios.get('/Finance/payee_lists').then(res=>{
                this.tableData = res.data.data;
                this.currentPage = res.data.current_page;
                this.total = res.data.total;
                this.per_page = res.data.per_page;
                this.last_page = res.data.last_page;
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
        //删除按钮
        deteles(){

        },
        //搜索按钮
        seach(){

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

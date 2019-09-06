<template>
    <div class="box">
        <div>
            <label>筛选</label>
            <el-input v-model="search" placeholder="请输入内容" style="width:217px;margin-left:10px"></el-input>
            <el-button style="margin-left:20px" type="primary" @click="seach">搜索</el-button>
            <el-button style="margin-left:100px" type="primary" @click="addCompany">添加付款账号</el-button> 
        </div>
        <div class="conten_box">
            <el-table :data="tableData">
                <el-table-column label="公司" prop="company_id"></el-table-column>
                <el-table-column label="付款账号" prop="payment_account"></el-table-column>
                <el-table-column label="付款人" prop="payment_name"></el-table-column>
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

         <el-dialog title="添加企业付款人" :visible.sync="dialogNumber" >
             <el-form :model="formNumbers">
                <el-form-item label="公司" label-width="90px">
                    <el-radio v-model="formNumbers.type" label="1">企业</el-radio>
                    <el-radio v-model="formNumbers.type" label="0">个人</el-radio>
                </el-form-item>
                <el-form-item label="公司" label-width="90px">
                     <el-select v-model="formNumbers.company_id" filterable placeholder="请选择">
                        <el-option
                        v-for="item in options"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                 </el-form-item>
                 <el-form-item label="付款人" label-width="90px">
                     <el-input style="width:317px" v-model="formNumbers.payment_name"></el-input>
                 </el-form-item>
                 <el-form-item label="付款账号" label-width="90px">
                     <el-input style="width:317px" v-model="formNumbers.payment_account"></el-input>
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
                company_id:'',
                payment_name:'',
                payment_account:'',
                id:'',
            },
            options: [], // 公司数据

            currentPage:'',//当前页
            total:'',//总数
            per_page:'',//每页多少条
            last_page:'',//总页数
        }
    },
    methods:{
        // 获取数据
        gettableData(){
            this.axios.get('/crm.Customer/company_drawee_lists').then(res=>{
                this.tableData = res.data.company_drawee
            })
        },
        // tijiao 信息
        add(){
            this.dialogNumber = false;
            if(this.formNumbers.id==''){
                this.axios.post('/crm.Customer/company_drawee_add',{
                    type:this.formNumbers.type,
                    company_id:this.formNumbers.company_id,
                    payment_name:this.formNumbers.payment_name,
                    payment_account:this.formNumbers.payment_account,
                }).then(res => {
                    if(res.data.code == 2000){
                        this.open(res.data.msg,'success');
                        this.dialogNumber = false;
                        this.gettableData();
                    }else{
                        this.open(res.data.msg,'error');
                    }
                })
            }else{
              this.axios.post('/crm.Customer/company_drawee_update',{
                    type:this.formNumbers.type,
                    company_id:this.formNumbers.company_id,
                    payment_name:this.formNumbers.payment_name,
                    payment_account:this.formNumbers.payment_account,
                    id:this.formNumbers.id,
                }).then(res => {
                    if(res.data.code == 2000){
                        this.open(res.data.msg,'success');
                        this.dialogNumber = false;
                        this.gettableData();
                    }else{
                        this.open(res.data.msg,'error');
                    }
                })  
            }
        },
        // 获取公司
        getoptions(){
            this.axios.get('/crm.Customer/company_list').then(res => {
                this.options = res.data.company;
            })
        },
        // 添加 按钮
        addCompany(){
            this.getoptions();
            this.dialogNumber = true;  
            this.formNumbers.type='';
            this.formNumbers.company_id='';
            this.formNumbers.payment_name='';
            this.formNumbers.payment_account='';
            this.formNumbers.id='';
        },
        //修改按钮
        edit(a){
           this.dialogNumber = true; 
           this.formNumbers.type= String(a.type);
            this.formNumbers.company_id=a.company_id;
            this.formNumbers.payment_name=a.payment_name;
            this.formNumbers.payment_account=a.payment_account;
            this.formNumbers.id=a.id;  
        },
        //删除按钮
        deteles(){

        },
        //搜索按钮
        seach(){

        },
        // 公用弹窗
        open(a,b){
            this.$message({
            message: a,
            type: b
            });
        },
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

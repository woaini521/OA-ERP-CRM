<template>
    <div class="box">
         <div class="head_box">
            <label>筛选：</label>
            <el-input placeholder="名称" v-model="seach" style="width:217px;margin-left:10px"></el-input>
            <el-button type="primary" @click="seachName"  style="margin-left:20px;">搜索</el-button>
            <el-button type="primary" @click="add"  style="margin-left:40px;">新增</el-button>
        </div>

        <div class="content_box">
            <el-table :data="tabledata">
                <el-table-column label="供应商名称" prop="supplier_name" width="300px"></el-table-column>
                <el-table-column label="发票抬头" prop="rise"></el-table-column>
                <el-table-column label="发票税号" prop="tax_number" width="240px"></el-table-column>
                <el-table-column label="品类" prop="category"></el-table-column>
                <el-table-column label="发票类型" prop="type" width="90px"></el-table-column>
                <el-table-column label="金额" prop="money"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" @click="deletes(scope.row)">删除</el-button>
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
        </div>
        <el-dialog title="新增/修改" :visible.sync="dialogAdd">
            <el-form :model="dialogAddForm">
                <el-form-item label="供应商" label-width="90px">
                    <el-select v-model="dialogAddForm.supplier_id" filterable clearable placeholder="请选择" style="width:70%">
                        <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id">
                            <span style="float: left">{{ item.name }}</span>
                            <span style="float: right; color: #8492a6; font-size: 13px">未开票金额{{ item.invoice_money }}</span>
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="抬头" label-width="90px">
                    <el-input v-model="dialogAddForm.rise" style="width:70%"></el-input>
                </el-form-item>
                <el-form-item label="发票税号" label-width="90px">
                    <el-input v-model="dialogAddForm.tax_number" style="width:70%"></el-input>
                </el-form-item>
                <el-form-item label="品类" label-width="90px">
                    <el-input v-model="dialogAddForm.category" style="width:70%"></el-input>
                </el-form-item>
                <el-form-item label="发票类型" label-width="90px">
                    <el-input v-model="dialogAddForm.type" style="width:70%"></el-input>
                </el-form-item>
                <el-form-item label="金额" label-width="90px">
                    <el-input v-model="dialogAddForm.money" @change="jine" style="width:70%"></el-input>
                </el-form-item>
                <el-form-item label="" label-width="90px">
                    <el-button type="primary" @click="confirm">提交</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data(){
        return{
            seach:'',
            tabledata:[],// 表格数据
            currentPage:0,//当前页
            total:0,//总数
            per_page:0,//每页多少条
            last_page:0,//总页数
            options:[],// 供应商数据
            dialogAdd:false, // 新增修改
            dialogAddForm:{  //表单数据
               id:'',
               supplier_id:'',
               rise:'',
               tax_number:'',
               category:'',
               type:'',
               money:'',
            },
        }
    },
    methods:{
        getTabledata(){
            this.axios.get('/Finance/finance_supplier_invoice_lists').then(res => {
                this.tabledata = res.data.supplier_invoice.data;
                this.currentPage = res.data.supplier_invoice.current_page;
                this.total = res.data.supplier_invoice.total;
                this.per_page = res.data.supplier_invoice.per_page;
                this.last_page = res.data.supplier_invoice.last_page;
            })
        },
        // 分页切换
        handleCurrentChange(val) {
            const loading = this.$loading({
                lock: true,
                text: '拼命加载中',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            this.axios.post('/Finance/finance_supplier_invoice_lists',{
                page:val,
            }).then(res => {
                this.tabledata = res.data.supplier_invoice.data;
                this.currentPage = res.data.supplier_invoice.current_page;
                loading.close();
            })  
        },
        // 获取供应商 
        getoptions(){
            this.axios.get('/Finance/finance_supplier_invoice_add').then(res => {
                this.options = res.data.supplier;
            })
        },
        //搜索
        seachName(){
            conlose.log(1);
        },
        // 监听金额
        jine(value){
            console.log(value)
        },
        // 新增
        add(){
          this.getoptions();
          this.dialogAdd = true;
          this.dialogAddForm.id = '';
          this.dialogAddForm.supplier_id = '';
          this.dialogAddForm.rise = '';
          this.dialogAddForm.tax_number = '';
          this.dialogAddForm.category = '';
          this.dialogAddForm.type = '';
          this.dialogAddForm.money = '';
        },
        // 删除
        deletes(a){
            this.axios.post('/Finance/finance_supplier_invoice_delete',{
                id:a.id
            }).then(res => {
                if(res.data.code == 2000){
                    this.getTabledata();
                    this.open(res.data.msg,'success');
                }else{
                    this.open(res.data.msg,'error');
                }
            })
        },
        // 提交
        confirm(){
            this.axios.post('/Finance/finance_supplier_invoice_add',{
                    supplier_id:this.dialogAddForm.supplier_id,
                    rise:this.dialogAddForm.rise,
                    tax_number:this.dialogAddForm.tax_number,
                    category:this.dialogAddForm.category,
                    type:this.dialogAddForm.type,
                    money:this.dialogAddForm.money,   
            }).then(res => {
                if(res.data.code == 2000){
                    this.getTabledata();
                    this.open(res.data.msg,'success');
                    this.dialogAdd = false;
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
        this.getTabledata();
    },
}
</script>

<style lang="less" scoped>

</style>


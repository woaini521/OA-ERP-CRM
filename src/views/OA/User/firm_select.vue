<template>
    <div class="box">
        <el-button type="warning" style="margin-top:10px;" @click="tian">添加</el-button>
        <el-divider direction='horizontal'></el-divider>
        <el-table :data="tableData" style="margin-top:10px;">
            <el-table-column label="名称" prop="name">
                <template slot-scope="scope">
                    <span><span v-for="(n,index) in scope.row.level" :key="index" style="margin-right:10px;">└</span>{{scope.row.name}}</span>
                </template>
            </el-table-column>
            <el-table-column label="地址" prop="address"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="updata(scope.row)">修改</el-button>
                    <el-button type="danger" size="mini" @click="deletes(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

         <el-dialog title="添加修改" :visible.sync="dialogForm">
            <el-form :model="formData">
                <el-form-item label="公司名称" label-width="100px">
                    <el-input placeholder="公司名称" v-model="formData.name" style="width:217px;"></el-input>
                </el-form-item>
                <el-form-item label="公司地址" label-width="100px">
                    <el-input placeholder="公司地址" v-model="formData.address" style="width:217px;"></el-input>
                </el-form-item>
                <el-form-item label="上级部门" label-width="100px">
                     <el-select v-model="formData.value" placeholder="请选择">
                        <el-option value="0" label="顶级"></el-option>
                        <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id" :disabled="item.disabled"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="" label-width="100px">
                    <el-button @click="add">保存</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data(){
        return{
          tableData:[
              {
                  name:'aaa',
                  address:'11111',
                  id:1
              }
          ],
          dialogForm:false,
          formData:{
              name:'',
              address:'',
              value:'1',
              id:'',
          },
          options:[],
        }
    },
    methods:{
        // 获取数据
        gettableData(){
            this.axios.get('/oa.User/firm_select').then(res => {
                this.tableData = res.data.list;
                this.options = res.data.firm_list;
            })
        },
        // 添加
        tian(){
            this.dialogForm = true;
            this.formData.id = '';
            this.formData.name = '';
            this.formData.address = '';
        },
        // 修改
        updata(a){
            this.axios.get('/oa.User/firm_select').then(res => {
                this.options = res.data.firm_list;
                this.dialogForm = true;
                this.formData.id = a.id;
                this.formData.name = a.name;
                this.formData.address = a.address;
                if(a.pid == 0){
                    this.formData.value = '顶级'
                }else{
                    this.formData.value = a.pid;
                }
                this.options.filter(item => {
                    if(item.id == a.id){
                        item.disabled = true;
                    }
                })
            })
            

                      
        },
        // 提交 添加 修改
        add(){
            if(this.formData.id == ''){
                this.axios.post('/oa.User/firm_add',{

                }).then(res => {
                    if(res.data.code == 2000){
                        this.open(res.data.msg,'success');
                        this.gettableData();
                        this.dialogForm = false;
                    }else{
                        this.open(res.data.msg,'error');
                    } 
                })    
            }else{
                this.axios.post('/oa.User/firm_update',{

                }).then(res => {
                    if(res.data.code == 2000){
                        this.open(res.data.msg,'success');
                        this.gettableData();
                        this.dialogForm = false;
                    }else{
                        this.open(res.data.msg,'error');
                    } 
                })
            }  
        },
        // 删除
        deletes(a){

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


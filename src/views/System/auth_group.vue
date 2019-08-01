<!-- 模板组件，用于模拟不同路由下的组件显示 -->
<template>
  <div class="box">
      <el-button type="warning" @click="add" style="margin-top:20px;">添加分组</el-button>
        <el-table :data="tableData" style="width: 100%;margin-top:20px">
          <el-table-column prop="title" label="名称"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button @click="handleClick(scope.row)" type="warning" size="small">修改</el-button>
            </template>
          </el-table-column>
        </el-table>

      <el-dialog title="添加分组" :visible.sync="dialogFormVisible" width="70%">
        <el-form :model="form">
          <el-form-item label="分组名字">
            <el-input v-model="form.name" autocomplete="off" style="width:217px;"></el-input>
          </el-form-item>

          <el-form-item v-for="(item,i) in shuju" :key="item.id">
            <h4>规则--{{item.title}}</h4>
            <template v-if="item.rule == undefined">
              <div v-for="er in item.child" :key="er.id">
                <h5 style="margin-left:10px">规则--{{er.title}}</h5>
                <el-checkbox-group  v-model="form.checkList" >
                  <el-checkbox v-for="items in er.rule" :key="items.id" :label="items.id">{{items.title}}</el-checkbox> 
                </el-checkbox-group>
              </div>
            </template>
            <el-checkbox-group v-else v-model="form.checkList" >
                <el-checkbox v-for="items in shuju[i].rule" :key="items.id" :label="items.id">{{items.title}}</el-checkbox> 
            </el-checkbox-group>
          </el-form-item>

         
          <el-form-item label="是否开启">
            <el-radio v-model="form.radio" label="1">开启</el-radio>
            <el-radio v-model="form.radio" label="2">关闭</el-radio>
          </el-form-item> 

          <el-form-item label="排序">
            <el-input style="width:217px;" v-model="form.rank"></el-input>
          </el-form-item> 
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="tijiao">确 定</el-button>
        </div>
      </el-dialog>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        shuju:'',
        dialogFormVisible:false,
        tableData:[],
        form:{
            id:'',
           name:'',
           checkList:[],
           radio:'1',
           rank:'',
        },      
      };
    },
    methods:{
      add(){
        this.form.name = '';
        this.form.radio ='';
        this.form.rank = '';
        this.form.checkList = [];
        this.form.id = null;
        this.qing();
        this.dialogFormVisible = true;
      },
      handleClick(a){
        this.form.name = a.title;
        this.form.radio =String(a.status);
        this.form.rank = a.rank;
        this.form.id = a.id
        let dataStrArr=a.rules.split(",");  //分割成字符串数组  
        let dataCheckList=[];//保存转换后的整型字符串  
        dataStrArr.forEach(item => {  
            dataCheckList.push(+item);  
        }); 
        this.form.checkList = dataCheckList;
        this.qing(a.id);
        this.dialogFormVisible = true;
      },
      qing(a){
        this.axios.get("/system/auth_group_edit?id="+a).then(res => {
          this.shuju = res.data.node;
          console.log(res.data.node);
        });
      },
      tijiao(){
        this.axios.post('/System/auth_group_edit',{
         id:this.form.id,
         title:this.form.name,
         status:this.form.radio,
         rank:this.form.rank,
         rules:this.form.checkList
        }).then(res => {
          if(res.data.code == "200"){
              this.open();
              this.shu();
              this.dialogFormVisible = false;
            }else{
              this.open1(res.data.msg);
            }
          })
      },
       open(){
        this.$message({
          message: '修改成功',
          type: 'success'
        });
      },
      open1(a){
        this.$message({
          message:a,
          type: 'error'
        });
      },
      shu(){
         this.axios.get("/System/auth_group").then(res => {
        this.tableData = res.data;
        //console.log(res.data);
      });
      }
    },
    created(){
      this.shu();
    },
    watch:{
      $route(to){
        this.shu();
      }
    }
  }
</script>
<style scoped lang="less">
.box{
  min-width: 890px;
}
</style>

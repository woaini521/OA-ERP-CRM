<!-- 模板组件，用于模拟不同路由下的组件显示 -->
<template>
  <div class="box">
    <div>
      <label>筛选</label>
      <el-input v-model="search" placeholder="请输入内容" style="width:217px;margin-left:10px"></el-input>
      <el-button style="margin-left:100px" type="primary" @click="addCompany">添加企业</el-button> 
      <el-button style="float: right;" @click="merge">合并</el-button> 
    </div>
  
    <el-dialog title="添加企业" :visible.sync="dialogFormVisible" width="70%">

      <div class="addqiyeContent">
        <div class="addqiyeLeft">
          <el-form ref="addqiye" :model="addqiye" class="demo-ruleForm" label-width="100px">
            <el-form-item label="公司名称" :inline="true">
              <el-input v-model="addqiye.company" placeholder="请输入公司全称" autocomplete="off" style="width:217px"></el-input>
            </el-form-item>
            <br>
            <el-form-item label="省" prop="sheng">
            <el-select v-model="sheng" @change="choseProvince" placeholder="省级地区"  style="width:217px">
              <el-option v-for="item in province" :key="item.id" :label="item.value" :value="item.id"></el-option>
            </el-select>
          </el-form-item>  

            <el-form-item label="市" prop="shi">
              <el-select v-model="shi" @change="choseCity" placeholder="市级地区"  style="width:217px;">
                <el-option v-for="item in shi1" :key="item.id" :label="item.value" :value="item.id"></el-option>
              </el-select>
            </el-form-item> 
            <el-form-item label="地区" prop="qu">
              <el-select v-model="qu" @change="choseBlock" placeholder="区级地区"  style="width:217px;">
                <el-option v-for="item in qu1" :key="item.id" :label="item.value" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="具体地址" >
                <el-input v-model="addqiye.address" autocomplete="off" style="width:217px;" type="textarea"></el-input>
            </el-form-item>
            <el-form-item label="备注" >
                <el-input v-model="addqiye.remark" autocomplete="off" style="width:217px;" type="textarea"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="addqiyeRight">
          <p>请选择级别</p>
          <p style="margin-top:10px;color:red">当前选择级别是:{{level}}</p>
           <el-tree ref="tree" :data="data" :props="defaultProps" @node-click="handleNodeClick" :highlight-current="true" ></el-tree>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="add">确 定</el-button>
      </div>
    </el-dialog>

    <div class="content_box">
      <el-table :data="qiye.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))" ref="multipleTable" style="width: 100%;margin-bottom: 20px;" row-key="id"  :tree-props="{children: 'child'}" @selection-change="handleSelectionChange">
        <el-table-column prop="name" label="公司名称" width="420"></el-table-column>
        <el-table-column align="center" prop="province" label="省"></el-table-column>  
        <el-table-column align="center" prop="city" label="市"></el-table-column> 
        <el-table-column align="center" prop="county" label="区"></el-table-column> 
        <el-table-column width="50" align="right" label="合并"></el-table-column>
        <el-table-column type="selection" width="55"  label="合并"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope" align="left"> 
            <el-button type="primary" @click="updata(scope.row)" size="small">修改</el-button>
            <el-button type="danger" @click="edit(scope.row)" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
  export default {
    data () {
      return {
        search:"",
        qiye:[],
        multipleSelection: [],
        foldList: [],
        addqiye:{
          id:"",
          company:"",
          sheng:"",
          shi:"",
          qu:"",
          address:"",
          remark:"",
          level:""
        },
        dialogFormVisible:false,
        province:'',
        city:'',
        block:'', 
        sheng: '',
        shi: '',
        shi1: [],
        qu: '',
        qu1: [],
        data: [],
        defaultProps: {
          children:'child',
          label:'name',
        },
        level:'',
        xuanzhong:0,
      }
    },
    methods:{
        // 获取数据
         getData(){
          const loading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          this.axios.get('/crm.Customer/company_list').then(res => {
            this.data = res.data.company;
            this.qiye = res.data.company; 
            loading.close();
          })
        },
        handleSelectionChange(val) {
          this.multipleSelection = val;
         // console.log(this.multipleSelection)
        },
        add(){
          if(this.addqiye.id==""){
            this.axios.post('/crm.Customer/company_add',{
                name:this.addqiye.company,
                province:this.addqiye.sheng,
                city:this.addqiye.shi,
                county:this.addqiye.qu,
                address:this.addqiye.address,
                remarks:this.addqiye.remark,
                pid:this.addqiye.level,
              }).then(res => {
                if(res.data.code == 2000){
                        this.open1(res.data.msg,'success');
                        this.getData();
                        this.$refs['addqiye'].resetFields();
                        this.dialogFormVisible=false;
                    }else{
                        this.open1(res.data.msg,'error');
                    } 
              })
            }else{
              this.axios.post('/crm.Customer/company_update',{
                id:this.addqiye.id,
                name:this.addqiye.company,
                province:this.addqiye.sheng,
                city:this.addqiye.shi,
                county:this.addqiye.qu,
                address:this.addqiye.address,
                remarks:this.addqiye.remark,
                pid:this.addqiye.level,
              }).then(res => {
                //console.log(res);
                //this.qiye.push(this.addqiye);
                if(res.data.code == 2000){
                        this.open1(res.data.msg,'success');
                        this.getData();
                        this.$refs['addqiye'].resetFields();
                        this.dialogFormVisible=false;
                    }else{
                        this.open1(res.data.msg,'error');
                    } 
                
              })
            }
        },
        //合并
        merge(){
          if(this.multipleSelection.length < 2){
            this.open1('选中的节点低于两个或者没有选择','error')
          }else{
            let mergeName = [];
            let mergeId = [];
            let mergeShow = '';
            for(let y =0 ;y<this.multipleSelection.length;y++){
              mergeName.push(this.multipleSelection[y].name)
              mergeId.push(this.multipleSelection[y].id)
              mergeShow += `${this.multipleSelection[y].name}ID为${this.multipleSelection[y].id}，`
            }
            this.$confirm('确定将'+mergeShow+'并且以选择的第一个为主进行合并?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.axios.post('/crm.Customer/company_hebing',{
                id:mergeId
              }).then(res => {
                  if(res.data.code == 2000){
                    this.$message({
                      type: 'success',
                      message: '合并成功!'
                    });
                    this.$refs.multipleTable.clearSelection();
                    this.getData();
                  }else{
                     this.$message({
                      type: 'error',
                      message: res.data.msg
                    }); 
                  }
              }) 
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消合并'
              });          
            });
          }
        },

        // 添加按钮
        addCompany(){
          this.dialogFormVisible = true;
          // this.$refs.dropIndicator.classList([]);
          this.addqiye.company = '';
          this.addqiye.sheng = '';
          this.addqiye.qu = '';
          this.addqiye.remark = '';
          this.addqiye.level = '';
          this.sheng = '';
          this.shi = '';
          this.qu='';
          this.addqiye.id = '';
          this.addqiye.address = '';
          this.xuanzhong = 0;
        },
        handleNodeClick(res) {
          //console.log(res.id);
          this.addqiye.level = res.id;
          //console.log(this.$refs.tree.store)
        },
        open(){
          this.$message.error('请填写完整，否则请取消！');
        },
        open1(a,b){
            this.$message({
                message: a,
                type: b
            });
        },
        updata(a){
         
          this.addqiye.id = a.id;
          this.addqiye.company = a.name;
          this.addqiye.sheng = a.province;
          this.addqiye.shi = a.city;
          this.addqiye.qu = a.county;
          this.sheng = a.province;
          this.shi = a.city;
          this.qu=a.county;
          this.addqiye.address = a.address;
          this.addqiye.remark = a.remarks;
          this.addqiye.level = a.pid;
          this.xuanzhong = a.pid;
          this.level = a.name;
          this.dialogFormVisible = true;
        },
        edit(a){
        // alert(a.id);
          this.axios.post('/crm.Customer/company_delete',{
            id:a.id
          }).then(res =>{
            if (res.data.code == 2000){
              this.open1(res.data.msg,'success');
              this.getData();
            }else{
               this.open1(res.data.msg,'error'); 
            } 
          })
        },
       
        // 加载china地点数据，三级
        getCityData:function(){
          var that = this
          that.axios.get("./api/map.json").then(function(response){
            if (response.status==200) {
              var data = response.data;
              that.province = [];
              that.city = [];
              that.block = [];
              // 省市区数据分类
              for (var item in data) {
                if (item.match(/0000$/)) {//省
                  that.province.push({id: item, value: data[item], children: []});
                } else if (item.match(/00$/)) {//市
                  that.city.push({id: item, value: data[item], children: []});
                } else {//区
                  that.block.push({id: item, value: data[item]});
                }
              }
              // 分类市级
              for (var index in that.province) {
                for (var index1 in that.city) {
                  if (that.province[index].id.slice(0, 2) === that.city[index1].id.slice(0, 2)) {
                    that.province[index].children.push(that.city[index1]);
                  }
                }
              }
              // 分类区级
              for(var item1 in that.city) {
                for(var item2 in that.block) {
                  if (that.block[item2].id.slice(0, 4) === that.city[item1].id.slice(0, 4)) {
                    that.city[item1].children.push(that.block[item2]);
                  }
                }
              }
            }
            else{
             
            }
          })
         
        },
        // 省
        choseProvince:function(e) {
          for (var index2 in this.province) {
            if (e === this.province[index2].id) {
              this.shi1 = this.province[index2].children;
              this.shi = this.province[index2].children[0].value;
              this.qu1 =this.province[index2].children[0].children;
              this.qu = this.province[index2].children[0].children[0].value;
              this.E = this.qu1[0].value;
              this.addqiye.sheng = this.province[index2].value;
              this.addqiye.shi = this.province[index2].children[0].value;
              this.addqiye.qu = this.province[index2].children[0].children[0].value;
             
            }
          }
        },
        // 选市
        choseCity:function(e) {
          for (var index3 in this.city) {
            if (e === this.city[index3].id) {
              
              if(this.city[index3].children.length == 0){
                  this.addqiye.qu = ' ';
                  this.qu = '';
                  this.qu1 = [];
              }else{
                this.qu1 = this.city[index3].children;
                this.qu = this.city[index3].children[0].value;
              }
              this.addqiye.shi = this.city[index3].value;
              //console.log(this.qu1)
            }
          }
        },
        // 选区
        choseBlock:function(e) {
          this.E=e;
          for (var index4 in this.block) {
            if (e === this.block[index4].id) {
              this.addqiye.qu = this.block[index4].value;
              //console.log(this.form.qu)
            }
          }
        },
        resetForm(a) {
          this.$refs[a].resetFields() ; 
          this.shi = '';
          this.qu = '';
          this.sheng = '';
        }
      },
      created(){
          this.getData();
          this.getCityData();
      },
  }
</script>
<style lang="less" scoped>
.box{
  .addqiyeContent{
    overflow: hidden;
    .addqiyeLeft{
      float: left;
    }
    .addqiyeRight{
      float: left;
      margin-left: 40px;
      p{
        margin-top: 50px;

      }
    }
  }
 
}
 .el-tree-node:focus>.el-tree-node__content {
      background-color:#409EFF !important;
      color: #FFF !important;
  }
  .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content{
     background-color:#409EFF !important;
      color: #FFF !important;
  }

.permission_toggleFold{
      vertical-align: middle;
      padding-right :5px;
      font-size: 16px;
      cursor: pointer;}

</style>



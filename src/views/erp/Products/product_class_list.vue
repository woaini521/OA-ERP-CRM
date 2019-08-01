<template>
    <div class="box">
        <div class="head_box">
            <label>筛选</label>
            <el-input v-model="search" placeholder="请输入内容" style="width:217px;margin-left:10px"></el-input>
            <el-button style="margin-left:50px" type="primary" @click="addFenlei">添加产品分类</el-button> 
        </div>

        <div class="content_box">
            <el-table :data="tableData.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))" row-key="id"  style="width: 100%" :row-style="toggleDisplayTr" stripe class="init_table">
                <el-table-column label="分类名" show-overflow-tooltip align="left">
                    <template slot-scope="scope">
                    <p :style="`margin-left: ${scope.row.__level * 20}px;margin-top:0;margin-bottom:0`">
                        <i @click="toggleFoldingStatus(scope.row)"  class="permission_toggleFold" :class="toggleFoldingClass(scope.row)"></i>
                        {{scope.row.name}}</p>
                    </template>
                </el-table-column>
                <el-table-column label="操作"> 
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" @click="updata(scope.row)">修改</el-button>
                        <el-button type="danger" size="mini" @click="edit(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <el-dialog title="添加或修改分类" :visible.sync="dialogFormlei">
            <div class="addFenlei">
                <div class="addFenleiLeft">
                    <el-form v-model="form">
                        <el-form-item label="名字" :label-width="lableWidth">
                            <el-input v-model="form.name"></el-input>
                            
                        </el-form-item>
                        <el-form-item label="排序" :label-width="lableWidth">
                            <el-input v-model="form.rank"></el-input>
                        </el-form-item>
                        
                    </el-form>
                </div>
                <div class="addFenleiRight">
                    <p>请选择类别</p>
                    <p style="margin-top:10px;color:red">当前选择类别是:{{lei}}</p>
                    <el-tree ref="tree" :data="data" :props="defaultProps" @node-click="handleNodeClick" node-key="id" :highlight-current="true" :current-node-key="xuanzhong" :default-expanded-keys ="xuanzhong"></el-tree>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormlei = false">取 消</el-button>
                <el-button type="primary" @click="add">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import Vue from 'vue'
export default {
    data(){
        return {
            search:'',
            tableData:[],
            foldList: [],
            dialogFormlei:false,
            form:{
                id:'',
                pid:'',
                name:'',
                rank:'',  
            },
            lableWidth:'100px',
            lei:'',
            data:[
                {   
                    id:1,
                    name:'sssssdfa',
                    child:[
                       {
                           id:1-1, 
                        name:'222',
                         child:[]
                    }]
                }
                
            ],
            defaultProps: {
                id:'id',
                children: 'child',
                label: 'name'
            },
        }
    },
     computed: {
        foldAllList () {
          return this.tableListData.map(x => x.__identity)
        },
      },
    methods:{
        toggleFoldingStatus (params) {
          console.log(params.child);
          this.foldList.includes(params.__identity) ? this.foldList.splice(this.foldList.indexOf(params.__identity), 1) : this.foldList.push(params.__identity)
        },
        toggleDisplayTr ({row, index}) {
          for (let i = 0; i < this.foldList.length; i++) {
            let item = this.foldList[i]
            // 如果foldList中元素存在于 row.__family中，则该行隐藏。  如果该行的自身标识等于隐藏元素，则代表该元素就是折叠点
            if (row.__family.includes(item) && row.__identity !== item) return 'display:none;'
          }
          return ''
        },

        toggleFoldingClass (params) {
          return params.child == undefined ? 'permission_placeholder' : (this.foldList.indexOf(params.__identity) === -1 ? 'el-icon-plus' : 'el-icon-minus')
        },

        formatConversion (parent, child, index = 0, family = [], elderIdentity = 'x') {
      // children如果长度等于0，则代表已经到了最低层
      // let page = (this.startPage - 1) * 10
      if (child != undefined) {
        child.map((x, i) => {
          // 设置 __level 标志位 用于展示区分层级
          Vue.set(x, '__level', index)
          // 设置 __family 为家族关系 为所有父级，包含本身在内
          Vue.set(x, '__family', [...family, elderIdentity + '_' + i])
          // 本身的唯一标识  可以理解为个人的身份证咯 一定唯一。
          Vue.set(x, '__identity', elderIdentity + '_' + i)
          parent.push(x)
          // 如果仍有子集，则进行递归
          if (x.child != undefined) this.formatConversion(parent, x.child, index + 1, [...family, elderIdentity + '_' + i], elderIdentity + '_' + i)
        })
      } return parent
    },
  

        getDate(){
            this.axios.get('/erp.Product/product_class_list').then(res => {
                //console.log(res);
                this.tableData = this.formatConversion([], res.data.product_class);
                this.data = res.data.product_class; 
            })
        },
        addFenlei(){
            this.dialogFormlei = true;
            this.form.id = '';
            this.form.pid = '';
            this.form.name = '';
            this.form.rank = '';
        },
        updata(a){
          this.dialogFormlei = true;
          this.form.id = a.id;
          this.form.pid = a.pid;
          this.form.name = a.name;
          this.form.rank = a.rank;  
          this.lei = a.name;
        },
        edit(a){
            console.log(a.id);

           this.axios.post('/erp.Product/product_class_delete',{
               id:a.id
           }).then(res => {
               if(res.data.code == 2000){
                    this.open(res.data.msg,'success');
                    this.getDate();
                    this.dialogFormlei = false; 
                }else{
                   this.open(res.data.msg,'error'); 
                }
           })
        },
        handleNodeClick(data) {
        // console.log(data);
            this.form.pid = data.id;
        //console.log(this.$refs.tree.store)
        },
        add(){
            if(this.form.id == ''){
                this.axios.post('/erp.Product/product_class_add',{
                id:this.form.id,
                name:this.form.name,
                rank:this.form.rank,
                pid:this.form.pid,
                }).then(res => {
                    if(res.data.code == 2000){
                        this.open(res.data.msg,'success');
                        this.getDate();
                        this.dialogFormlei = false; 
                    }else{
                    this.open(res.data.msg,'error'); 
                    }
                })
            }else{
                this.axios.post('/erp.Product/product_class_update',{
                id:this.form.id,
                name:this.form.name,
                rank:this.form.rank,
                pid:this.form.pid,
                }).then(res => {
                    if(res.data.code == 2000){
                        this.open(res.data.msg,'success');
                        this.getDate();
                        this.dialogFormlei = false; 
                    }else{
                    this.open(res.data.msg,'error'); 
                    }
                })
            }
            

        },
        open(a,b){
            this.$message({
                message:a,
                type: b
            });
        },
    },
    created(){
        this.$nextTick(()=>{
            this.getDate();
        })
    },
    watch:{
        $route(to){
           this.$nextTick(()=>{
                this.getDate();
            })
        }
    }
}
</script>

<style lang="less" scoped>
.box{
    min-width: 890px;
}
.addFenlei{
    overflow: hidden;
    .addFenleiLeft{
        float: left;
    }
    .addFenleiRight{
        float: left;
        margin-left: 40px;
    }
}
</style>


<!-- 模板组件，用于模拟不同路由下的组件显示 -->
<template>
  <div class="box">
    <div class="headbox">
      <el-button type="warning" @click="addgroup1">添加分组</el-button>
      <el-button type="warning" @click="addrule">添加规则</el-button>
    </div>
    <div class="contentbox">
     
        <div class="contentboxInner" v-for="item in shuju" :key="item.id">
            <div class="contentboxInnerHead">
               <p style="float: left;">{{item.title}} {{item.name}}</p>
               <p style="float: left;">{{item.status == 1 ? '开启中' : '关闭'}}</p>
                  <template v-if="item.child[0]">
                    <template v-if="item.child[0].menu">
                      <el-button type="warning" style="float: left;margin-left:10px;" @click="add(item)">添加规则</el-button>
                    </template>
                    <template v-else>
                     <el-button type="warning" style="float: left;margin-left:10px;" @click="addgroup(item)">添加分组</el-button>
                  </template>
                </template>
                <template v-else>
                    <el-button type="warning" style="float: left;margin-left:10px;" @click="addgroup(item)">添加分组</el-button>
                    <el-button type="warning" style="float: left;margin-left:10px;" @click="add(item)">添加规则</el-button>
                </template>
                  
                
               <el-button type="warning" style="float: left;margin-left:10px;" @click="xiugai_x(item)">修改</el-button>
               <el-button type="danger" @click="edit(item)" style="float: left;margin-left:10px;">删除</el-button>
            </div>

            <div v-if="item.child !== []">
              <div class="contentboxInnerContent" v-for="er in item.child" :key="er.id">
                <div class="contentboxInnerContentInner">
                  <el-card class="box-card" style="overflow:hidden;">
                    <div slot="header" class="clearfix" style="overflow: hidden;">
                      <span>{{ er.title }}</span> <br> <span style="font-size:14px">{{ er.name }}</span>

                      <span v-if="er.menu==undefined" style="margin-left:50px;"></span>
                      <span v-else-if="er.menu==1" style="margin-left:50px;">菜单</span>
                      <span v-else-if="er.menu==2" style="margin-left:50px;">按钮</span>

                      <span style="font-size:13px;">{{ er.status == 1 ? '开启中' : '关闭' }}</span>

                       <div v-if="er.menu==1" style="float:right">
                          <el-button style="margin-left:50px;" type="warning" size="small" @click="xiugai(er)">修改</el-button>
                          <el-button style="" @click="edit(er)" type="danger" size="small">删除</el-button>
                          <el-button  type="warning" size="small" @click="add2(er)">添加按钮</el-button>
                       </div>
                       <div v-else style="float:right">
                          <el-button style="margin-left:50px;" type="warning" size="small" @click="xiugai_x(er)">修改</el-button>
                          <el-button style="" @click="edit(er)" type="danger" size="small">删除</el-button>
                          <el-button  type="warning" size="small" @click="add(er)">添加规则</el-button>
                       </div>
                       <!-- <div v-else style="float:right">
                          <el-button style="margin-left:50px;" type="warning" size="small" @click="xiugai_x(er)">修改</el-button>
                          <el-button style="" @click="edit(er)" type="danger" size="small">删除</el-button>
                          <el-button  type="warning" size="small" @click="addgroup(er)">添加分组</el-button>
                       </div> -->
                    </div>
                    <div v-if="er.child !== null">
                      <div v-for="o in er.child" :key="o.id" class="item">
                          <div class="itemChildA">
                            <span>{{ o.title }} </span> <br><span> {{ o.name }}</span>

                            <span v-if="o.menu==undefined" style="margin-left:50px;"></span>
                            <span v-else-if="o.menu==1" style="margin-left:50px;">菜单</span>
                            <span v-else-if="o.menu==2" style="margin-left:50px;">按钮</span>
                            <span style="font-size:11px;">{{ o.status == 1 ? '开启中' : '关闭' }}</span>
                            
                            <div  v-if="o.menu== 1"  style="float:right">
                                <el-button style="margin-left:58px;" type="warning" size="small" @click="xiugai(o)">修改</el-button>
                                <el-button style=""  @click="edit(o)" type="danger" size="small">删除</el-button>
                                <el-button type="warning" size="small" @click="add2(o)">添加按钮</el-button> 
                            </div>
                            <div v-else  style="float:right">
                              <el-button style="margin-left:58px;" type="warning" size="small" @click="xiugai(o)">修改</el-button>
                              <el-button style=""  @click="edit(o)" type="danger" size="small">删除</el-button>
                            </div>
                          </div>
                          <div v-if="o.child !== null">
                            <div class="itemChildB" v-for="an in o.child" :key="an.id">
                              <span>{{ an.title }} </span> <br><span> {{ an.name }}</span>
                              <span style="margin-left:58px;">{{an.menu == 1 ? '菜单' : '按钮'}}<span style="font-size:11px;">{{ o.status == 1 ? '开启中' : '关闭' }}</span></span>
                              <el-button style="margin-left:58px;" type="warning" size="small" @click="xiugai(an)">修改</el-button>
                              <el-button style=""  @click="edit(an)" type="danger" size="small">删除</el-button>
                            </div>
                          </div>
                          
                      </div>
                    </div>
                  </el-card>
                </div>
              </div>
           </div>
        </div>
   
    </div>

      <el-dialog title="添加或修改规则" :visible.sync="rule">
        <el-form :model="form">
          <el-form-item label="名称" :label-width="formLabelWidth">
              <el-input v-model="form.name"  style="width:60%"></el-input>
          </el-form-item>
          <el-form-item label="标题" :label-width="formLabelWidth">
              <el-input v-model="form.title" style="width:60%"></el-input>
          </el-form-item>
          <el-form-item label="规则" :label-width="formLabelWidth">
              <el-input v-model="form.condition"  style="width:60%"></el-input>
          </el-form-item>
          <el-form-item label="排序" :label-width="formLabelWidth">
              <el-input v-model="form.rank"  style="width:60%"></el-input>
          </el-form-item>
          <el-form-item label="类型" :label-width="formLabelWidth">
              <el-radio v-model="form.menu" :label="form.menu">{{form.menu == 1 ? '菜单' : '按钮'}}</el-radio>
          </el-form-item>
          <!-- <el-form-item label="按钮归属菜单" :label-width="formLabelWidth">
              <el-radio v-model="form.pid" label="0">菜单</el-radio>
          </el-form-item> -->
          <el-form-item label="所有权限" :label-width="formLabelWidth">
              <el-radio v-model="form.auth" label="1">是</el-radio>
              <el-radio v-model="form.auth" label="0">否</el-radio>
          </el-form-item>
          <el-form-item label="是否开启" :label-width="formLabelWidth">
              <el-radio v-model="form.status" label="1">开启</el-radio>
              <el-radio v-model="form.status" label="0">关闭</el-radio>
          </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click="rule = false">取 消</el-button>
          <el-button type="primary" @click="tijiao">确 定</el-button>
        </div>
      </el-dialog>
     <el-dialog title="添加或修改分组" :visible.sync="group">
        <el-form :model="formGroup">
          <el-form-item label="名称" :label-width="formLabelWidth">
              <el-input v-model="formGroup.name"  style="width:60%"></el-input>
          </el-form-item>
          <el-form-item label="标题" :label-width="formLabelWidth">
              <el-input v-model="formGroup.title" style="width:60%"></el-input>
          </el-form-item>
          <el-form-item label="备注" :label-width="formLabelWidth">
              <el-input v-model="formGroup.remark"  style="width:60%"></el-input>
          </el-form-item>
          
          <el-form-item label="是否开启" :label-width="formLabelWidth">
              <el-radio v-model="formGroup.status" label="1">开启</el-radio>
              <el-radio v-model="formGroup.status" label="0">关闭</el-radio>
          </el-form-item>
          <el-form-item label="排序" :label-width="formLabelWidth">
              <el-input v-model="formGroup.rank"  style="width:60%"></el-input>
          </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click="group = false">取 消</el-button>
          <el-button type="primary" @click="btn">确 定</el-button>
        </div>
      </el-dialog>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        shuju:[],
       
        form:{
          id :'',
          node_id:'',
          name:'',
          title:'',
          condition:'',
          rank:'',
          menu:'',
          pid:'',
          auth:'',
          status:''
        },
        formGroup:{
          name:'',
          title:'',
          rank:'',
          status:'',
          remark:'',
          pid:''
        },
        rule:false,
        group:false,
        formLabelWidth: '120px'
      };
    }, 
    methods:{
      xiugai(a){
        this.rule=true,
        console.log(a);
        this.form.id = a.id;
        if(a.node_id == undefined){
           this.form.node_id = a.id;
        }else{
           this.form.node_id = a.node_id;
        }
        this.form.name = a.name;
        this.form.title = a.title;
        this.form.condition = String(a.condition);
        this.form.rank = a.rank ;
        this.form.menu = String(a.menu);
        this.form.pid = String(a.pid);
        this.form.status = String(a.status);
        this.form.auth = String(a.auth);
      },
      edit(a){
        if(a.node_id == undefined){
          this.axios.post('/System/auth_node_delete',{
           id:a.id
         }).then(res => {
            if(res.data.code == "2000"){
              this.open();
              this.qing();
              //this.updatemenus();
              this.rule = false;
            }else{
              this.open1(res.data.msg);
          }
         })
        }else{
           this.axios.post('/System/auth_rule_delete',{
           id:a.id
         }).then(res => {
            if(res.data.code == "2000"){
              this.open();
              this.qing();
              //this.updatemenus();
              this.rule = false;
            }else{
              this.open1(res.data.msg);
          }
         })
        }
      },
      add(a){
        this.rule=true,
        //console.log(a);
        this.form.id = '';
        this.form.node_id = a.id;
        this.form.name = '';
        this.form.title ='';
        this.form.condition = '';
        this.form.rank = '0' ;
        this.form.menu = '1';
        this.form.pid = String(a.id);
        this.form.status = '1';
        this.form.auth = '0';
      },
       add2(a){
        this.rule=true,
        //console.log(a.node_id);
        this.form.id = '';
        this.form.node_id = a.node_id;
        this.form.name = '';
        this.form.title = '';
        this.form.condition = '';
        this.form.rank = '0' ;
        this.form.menu = '2';
        this.form.pid = String(a.id);
        this.form.status = '1';
        this.form.auth = '0';
      },
      tijiao(){
        if(this.form.node_id == undefined){
          this.axios.post('/System/auth_node_edit',{
          id:this.form.id,
          node_id:this.form.node_id,
          name:this.form.name,
          title:this.form.title,
          condition:this.form.condition,
          rank:this.form.rank,
          menu:this.form.menu,
          pid:this.form.pid,
          auth:this.form.auth,
          status:this.form.status
        }).then(res => {
          if(res.data.code == "2000"){
              this.open();
              this.qing();
              //this.updatemenus();
              this.rule = false;
          }else{
            this.open1(res.data.msg);
          }
        })
        }else if(this.form.node_id == this.form.id || this.form.node_id != undefined){
          this.axios.post('/System/auth_rule_edit',{
          id:this.form.id,
          node_id:this.form.node_id,
          name:this.form.name,
          title:this.form.title,
          condition:this.form.condition,
          rank:this.form.rank,
          menu:this.form.menu,
          pid:this.form.pid,
          auth:this.form.auth,
          status:this.form.status
        }).then(res => {
          if(res.data.code == "2000"){
              this.open();
              this.qing();
              //this.updatemenus();
              this.rule = false;
            }else{
              this.open1(res.data.msg);
            }
          })
        }
      },
      xiugai_x(a){
        this.group = true;
        this.formGroup.id = a.id;
        this.formGroup.pid = a.pid;
        this.formGroup.name = a.name;
        this.formGroup.title = a.title;
        this.formGroup.remark = a.remark;
        this.formGroup.rank = String(a.rank);
        this.formGroup.status = String(a.status);
      },
      btn(){
        let a;
        if(this.formGroup.pid == null){
          a = 0;
        }else{
          a = this.formGroup.pid;
        }
        this.axios.post('/System/auth_node_edit',{
         id:this.formGroup.id,
         name: this.formGroup.name ,
         title: this.formGroup.title ,
         remark: this.formGroup.remark ,
         rank: this.formGroup.rank ,
         status: this.formGroup.status ,
         pid:a ,
        }).then(res => {
          if(res.data.code == "2000"){
              this.open();
              this.qing();
              //this.updatemenus();
              this.group = false;

            }else{
              this.open1(res.data.msg);
            }
          })
      },
      updatemenus(){
        this.axios.get('/Index/menu').then(res => {
          let menus = res.data;
          console.log(menus);
        })
      },
      addrule(){
        this.rule=true,
        //console.log(a);
        this.form.id = '';
        this.form.node_id = undefined;
        this.form.name = '';
        this.form.title = '';
        this.form.condition = '';
        this.form.rank = '0' ;
        this.form.menu = '';
        this.form.pid = '';
        this.form.status = '';
        this.form.auth = '';
      },
      addgroup1(){
        this.group = true;
        this.formGroup.name = '';
        this.formGroup.title = '';
        this.formGroup.rank = '';
        this.formGroup.status = ''; 
        this.formGroup.remark = '';
        this.formGroup.pid = '';
      },
      addgroup(a){
        this.group = true;
        this.formGroup.name = '';
        this.formGroup.title = '';
        this.formGroup.rank = '';
        this.formGroup.status = ''; 
        this.formGroup.remark = '';
        this.formGroup.pid = a.id;
      },
      qing(){
          this.axios.get("/System/auth_rule").then(res => {
          this.shuju = res.data.node;
          //console.log(this.shuju);
        });
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
    },
    created(){
      this.$nextTick(()=>{
         this.qing();
      })
      //this.qing();
    },
     watch:{
      $route(to){
        this.$nextTick(()=>{
          this.qing();
        })
      }
    }
  }
</script>
<style scoped lang="less">
  .box{
    .contentbox{
      margin-top: 10px;
      .contentboxInner{
        border:1px solid #CCC;
        padding: 10px 20px;
        margin-top: 10px;
        overflow: hidden;
        .contentboxInnerHead{
          overflow: hidden;
          padding-bottom: 10px;
          border-bottom: 1px solid #CCC;
          p{
            line-height: 40px;
          }
          p:nth-child(2){
            margin-left: 50%;
            
          }
        }
        .contentboxInnerContent{
          float: left;
          margin-left: 1%;
          width: 49%;
          margin-top: 10px;
          overflow: hidden;
          .contentboxInnerContentInner{
            overflow: hidden;
            .item{
              font-size: 15px;
              margin-bottom: 18px;
              border:1px solid #CCC;
              padding: 10px;
              overflow: hidden;
              .itemChildB{
                border-top: 1px dashed #CCC;
                padding: 10px 10px;
                overflow: hidden;
              }
              .itemChildA{
                padding-bottom: 10px;
                overflow: hidden;
              }
            }
          }
        }
      }
    }
  }
</style>

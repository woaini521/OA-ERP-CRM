<!-- 模板组件，用于模拟不同路由下的组件显示 -->
<template>
  <div class="box">
    <div class="tou">
      <el-button type="primary" style="margin-right:20px;" @click="add">添加供应商</el-button>
      <label>现有供应商:</label>
      <span>{{total}}</span>
    </div>
    <div class="head_box">
      <label>筛选：</label>
        <el-input placeholder="名称" v-model="schanPing" style="width:150px;margin-left:10px"></el-input>
        <!-- <el-date-picker v-model="starttimes" type="date" placeholder="开始日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width:150px;margin-left:10px"></el-date-picker>
        <el-date-picker v-model="endtimes" type="date" placeholder="结束日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width:150px;margin-left:10px"></el-date-picker> -->
        <el-button type="primary"  style="margin-left:20px;" @click="seach">搜索</el-button>
    </div>
    <div class="content_box">
      <el-table :data="tableData">
        <el-table-column prop="type" label="仓库类型" width="100px">
          <template slot-scope="scope">
            <span>{{scope.row.type == '1' ? '本地仓库':'供应商'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="province" label="省" width="100px">
          <!-- <template slot-scope="scope">
            <span>{{ scope.row.province }}{{ scope.row.city }}{{ scope.row.county }}</span>
          </template> -->
        </el-table-column>
        <el-table-column prop="city" label="市" width="100px"></el-table-column>
        <el-table-column prop="county" label="区" width="100px"></el-table-column>
        <el-table-column prop="address" label="具体地址"></el-table-column>
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column label="操作" width="220px">
          <template slot-scope="scope">
            <el-button @click.native="modify(scope.row)" type="primary" size="mini">更新</el-button>
            <el-button @click.native="account(scope.row)" type="danger" size="mini">账号</el-button>
            <el-button @click.native="contact(scope.row)" type="success" size="mini">联系人</el-button>
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

    <!-- 添加供应商收款账号 -->
     <el-dialog title="添加和更新供应商" :visible.sync="dialogAccount">
       <el-form :model="formAccount">
          <el-form-item label="类型" label-width="90px">
            <el-radio v-model="formAccount.type" label="1">企业</el-radio>
            <el-radio v-model="formAccount.type" label="2">个人</el-radio>
          </el-form-item>
          <el-form-item label="收款人" label-width="90px">
            <el-input v-model="formAccount.receiving_name"></el-input>
          </el-form-item>
          <el-form-item label="收款账号" label-width="90px">
            <el-input v-model="formAccount.receiving_account"></el-input>
          </el-form-item>
          <el-form-item label="" label-width="90px">
            <el-button type="primary" @click="addAccount">提交</el-button>
          </el-form-item>
       </el-form>

       <el-table :data="AccountData">
         <el-table-column label="类型" prop="type"></el-table-column>
         <el-table-column label="收款人" prop="receiving_name" ></el-table-column>
         <el-table-column label="收款账号" prop="receiving_account" width="300px"></el-table-column>
         <el-table-column label="操作" width="150px">
           <template slot-scope="scope">
             <el-button type="primary" size="mini" @click="editAccount(scope.row)">修改</el-button>
             <el-button type="danger" size="mini" @click="staticAccount(scope.row)">禁用</el-button>
           </template>
         </el-table-column>
       </el-table>
       <div class="block" style="margin-top: 10px;">
        <el-pagination
          @current-change="handleCurrentChange1"
          :current-page="currentPage1"
          :page-size="per_page1"
          layout="total, prev, pager, next"
          :total="total1">
        </el-pagination>
      </div>
     </el-dialog>
    <!-- 添加供应商联系人 -->
     <el-dialog title="添加和更新供应商" :visible.sync="dialogContact">
       <el-form :model="formContact">
          <el-form-item label="职位" label-width="90px">
            <el-input v-model="formContact.position"></el-input>
          </el-form-item>
          <el-form-item label="姓名" label-width="90px">
            <el-input v-model="formContact.name"></el-input>
          </el-form-item>
          <el-form-item label="电话" label-width="90px">
            <el-input v-model="formContact.phone"></el-input>
          </el-form-item>
          <el-form-item label="" label-width="90px">
            <el-button type="primary" @click="addContact">提交</el-button>
          </el-form-item>
       </el-form>

       <el-table :data="ContactData">
         <el-table-column label="职位" prop="position"></el-table-column>
         <el-table-column label="姓名" prop="name" ></el-table-column>
         <el-table-column label="电话" prop="phone"></el-table-column>
         <el-table-column label="操作" width="150px">
           <template slot-scope="scope">
             <el-button type="primary" size="mini" @click="editContact(scope.row)">修改</el-button>
             <el-button type="danger" size="mini" @click="staticContact(scope.row)">删除</el-button>
           </template>
         </el-table-column>
       </el-table>
       <div class="block" style="margin-top: 10px;">
        <el-pagination
          @current-change="handleCurrentChange2"
          :current-page="currentPage2"
          :page-size="per_page2"
          layout="total, prev, pager, next"
          :total="total2">
        </el-pagination>
      </div>
     </el-dialog>

    <!-- 添加和更新供应商 -->
      <el-dialog title="添加和更新供应商" :visible.sync="AddModification" width="70%">
        <el-form :model="formAddModification" :inline="true">
          <el-form-item label="仓库" label-width="90px">
            <el-radio v-model="formAddModification.type" label="1">本地仓库</el-radio>
            <el-radio v-model="formAddModification.type" label="2">供应商</el-radio>
          </el-form-item>
          <br>
          <el-form-item label="省" label-width="90px">
            <el-select v-model="sheng" @change="choseProvince" placeholder="省级地区"  style="width:217px">
              <el-option v-for="item in province" :key="item.id" :label="item.value" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="市" label-width="90px">
            <el-select v-model="shi" @change="choseCity" placeholder="市级地区"  style="width:217px;">
                <el-option v-for="item in shi1" :key="item.id" :label="item.value" :value="item.id"></el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="地区" label-width="90px">
            <el-select v-model="qu" @change="choseBlock" placeholder="区级地区"  style="width:217px;">
                <el-option v-for="item in qu1" :key="item.id" :label="item.value" :value="item.id"></el-option>
              </el-select>
          </el-form-item>
          <br>
          <el-form-item label="名称" label-width="90px">
            <el-input style="width:217px" v-model="formAddModification.name" placeholder="请输入名称"></el-input>
          </el-form-item>
          <br>
          <el-form-item label="具体地址" label-width="90px">
            <el-input type="textarea" style="width:500px" v-model="formAddModification.address" placeholder="请输入具体地址"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="AddModification = false">取 消</el-button>
          <el-button type="primary" @click="updata">确 定</el-button>
        </div>
      </el-dialog>
      
  </div>
</template>

<script>
  export default {
    data () {
      return {
        region:"",
        schanPing:"",
        starttimes:"",
        endtimes:"",
        currentPage:0,//当前页
        total:0,//总数
        per_page:0,//每页多少条
        last_page:0,//总页数
        options:[],
        tableData:[],
        // 供应商收款账号
        AddModification:false,
        formAddModification:{
          id:'',
          type:'',
          province:'',
          city:'',
          county:'',
          name:'', 
          address:'',          
          contacts:'',
          phone:'',
        },
        dialogAccount:false,
        formAccount:{
          id:'',
          supplier_id:'',
          type:'',
          receiving_name:'',
          receiving_account:'',
        },
        AccountData:[],
        currentPage1:0,//当前页
        total1:0,//总数
        per_page1:0,//每页多少条
        last_page1:0,//总页数
        // 供应商联系人
        ID:'',
        dialogContact:false,
        formContact:{
          supplier_id:'',
          name:'',
          position:'',
          phone:'',
        },
        ContactData:[],
        currentPage2:0,//当前页
        total2:0,//总数
        per_page2:0,//每页多少条
        last_page2:0,//总页数


       
        province:'',
        city:'',
        block:'', 
        sheng: '',
        shi: '',
        shi1: [],
        qu: '',
        qu1: [],
      };
    },
    methods:{
      // 添加按钮
      add(){
        // alert("1123");
        this.formAddModification.id = '';
        this.formAddModification.type = '';
        this.formAddModification.province = '';
        this.sheng = '';
        this.formAddModification.city = '';
        this.shi = '';
        this.formAddModification.county = '';
        this.qu = '';
        this.formAddModification.name = '';
        this.formAddModification.contacts = '';
        this.formAddModification.phone = '';
        this.formAddModification.address = '';
        this.AddModification = true;
      },
      // 联系人按钮
      contact(a){
        this.dialogContact = true;
        this.formContact.supplier_id = a.id;
        this.ID = a.id;
        this.getContactData(a.id);
      },
      // 获取联系人数据
      getContactData(a){
        this.axios.get('/erp.supplier/supplier_user_lists?id='+a).then(res => {
          this.ContactData = res.data.supplier_payee.data;
          this.currentPage2 = res.data.supplier_payee.current_page;
          this.total2 = res.data.supplier_payee.total;
          this.per_page2 = res.data.supplier_payee.per_page;
          this.last_page2 = res.data.supplier_payee.last_page;
        })
      },
      // 联系人 提交按钮
      addContact(){
        if(this.formContact.id == ''){
        // 添加联系人
          this.axios.post('/erp.supplier/supplier_user_add',{
            supplier_id:this.formContact.supplier_id,
            name:this.formContact.name,
            phone:this.formContact.phone,
            position:this.formContact.position,
          }).then(res => {
            if(res.data.code == 2000){
                this.open(res.data.msg,'success');
                this.getContactData(this.ID);
              }else{
                this.open(res.data.msg,'error');
              }
          })
        }else{
          this.axios.post('/erp.supplier/supplier_user_update',{
            id:this.formContact.id,
            supplier_id:this.formContact.supplier_id,
            name:this.formContact.name,
            phone:this.formContact.phone,
            position:this.formContact.position,
          }).then(res => {
            if(res.data.code == 2000){
                this.open(res.data.msg,'success');
                this.getContactData(this.ID);
              }else{
                this.open(res.data.msg,'error');
              }
          })
        }
      },
      // 添加联系人 分页
      handleCurrentChange2(val){
         this.axios.post('/erp.supplier/supplier_list',{
              page:val,
            }).then(res => {
              this.AccountData = res.data.supplier_payee.data;
              this.currentPage2 = res.data.supplier_payee.current_page;
              this.total2 = res.data.supplier_payee.total;
              this.per_page2 = res.data.supplier_payee.per_page;
              this.last_page2 = res.data.supplier_payee.last_page;
          })
      },
      // 联系人 修改
      editContact(a){
          this.formContact.id = a.id;
          this.formContact.supplier_id = a.supplier_id;
          this.formContact.name = a.name;
          this.formContact.phone = a.phone;
          this.formContact.position = a.position;
      },
      // 联系人 删除
      staticContact(a){
        this.axios.post('/erp.supplier/supplier_user_delete',{
          id:a.id
        }).then(res => {
          if(res.data.code == 2000){
              this.open(res.data.msg,'success');
              this.getContactData(this.ID);
            }else{
              this.open(res.data.msg,'error');
            }
        })
      },
      // 更新按钮
      modify(a){
        let atype;
        if(a.type == 1){
          atype = "1"
        }else{
          atype = "2"
        }
        this.AddModification = true;
        this.formAddModification.id = a.id;
        this.formAddModification.type = atype;
        this.formAddModification.province = a.province;
        this.formAddModification.city = a.city;
        this.formAddModification.county = a.county;
        this.sheng = a.province;
        this.shi = a.city;
        this.qu = a.county;
        this.formAddModification.address = a.address;
        this.formAddModification.name = a.name;
        this.formAddModification.contacts = a.contacts;
        this.formAddModification.phone = a.phone;
      },
      // 账号按钮
      account(a){
        this.dialogAccount = true;
        this.formAccount.supplier_id = a.id;
        this.axios.get('/erp.supplier/supplier_payee_lists?id='+a.id).then(res => {
          this.AccountData = res.data.supplier_payee.data;
          this.currentPage1 = res.data.supplier_payee.current_page;
          this.total1 = res.data.supplier_payee.total;
          this.per_page1 = res.data.supplier_payee.per_page;
          this.last_page1 = res.data.supplier_payee.last_page;
        })
      },
      // 添加收款账号
      addAccount(){
        if(this.formAccount.id == ''){
          this.axios.post('/erp.supplier/supplier_payee_add',{
            supplier_id:this.formAccount.supplier_id,
            type:this.formAccount.type,
            receiving_name:this.formAccount.receiving_name,
            receiving_account:this.formAccount.receiving_account,
          }).then(res => {
            if(res.data.code == 2000){
                this.open(res.data.msg,'success');
                this.axios.get('/erp.supplier/supplier_payee_lists?id='+this.formAccount.supplier_id).then(res => {
                  this.AccountData = res.data.supplier_payee.data;
                  this.currentPage1 = res.data.supplier_payee.current_page;
                  this.total1 = res.data.supplier_payee.total;
                  this.per_page1 = res.data.supplier_payee.per_page;
                  this.last_page1 = res.data.supplier_payee.last_page;
                });
                this.formAccount.type = '';
                this.formAccount.receiving_name = '';
                this.formAccount.receiving_account = '';
              }else{
                this.open(res.data.msg,'error');
              }
          })
        }else{
          this.axios.post('/erp.supplier/supplier_payee_update',{
            supplier_id:this.formAccount.supplier_id,
            type:this.formAccount.type,
            receiving_name:this.formAccount.receiving_name,
            receiving_account:this.formAccount.receiving_account,
            id:this.formAccount.id
          }).then(res => {
            if(res.data.code == 2000){
                this.open(res.data.msg,'success');
                this.axios.get('/erp.supplier/supplier_payee_lists?id='+this.formAccount.supplier_id).then(res => {
                  this.AccountData = res.data.supplier_payee.data;
                  this.currentPage1 = res.data.supplier_payee.current_page;
                  this.total1 = res.data.supplier_payee.total;
                  this.per_page1 = res.data.supplier_payee.per_page;
                  this.last_page1 = res.data.supplier_payee.last_page;
                });
                this.formAccount.type = '';
                this.formAccount.receiving_name = '';
                this.formAccount.receiving_account = '';
                this.formAccount.id = '';
              }else{
                this.open(res.data.msg,'error');
              }
          })
        }
        
      },
      // 修改账号
      editAccount(a){
        this.formAccount.id = a.id;
        this.formAccount.type = String(a.type);
        this.formAccount.receiving_name = a.receiving_name;
        this.formAccount.receiving_account = a.receiving_account;
      },
      // 禁用账号
      staticAccount(a){
        this.axios.post('/erp.supplier/supplier_payee_status',{
          id:a.id
        }).then(res => {
            if(res.data.code == 2000){
                this.open(res.data.msg,'success');
                this.axios.get('/erp.supplier/supplier_payee_lists?id='+this.formAccount.supplier_id).then(res => {
                  this.AccountData = res.data.supplier_payee.data;
                  this.currentPage1 = res.data.supplier_payee.current_page;
                  this.total1 = res.data.supplier_payee.total;
                  this.per_page1 = res.data.supplier_payee.per_page;
                  this.last_page1 = res.data.supplier_payee.last_page;
                });  
            }else{
                this.open(res.data.msg,'error');
            }
        })
      },

      // 账号分页 
      handleCurrentChange1(val) {
           this.axios.post('/erp.supplier/supplier_list',{
              page:val,
            }).then(res => {
            this.AccountData = res.data.supplier_payee.data;
            this.currentPage1 = res.data.supplier_payee.current_page;
            this.total1 = res.data.supplier_payee.total;
            this.per_page1 = res.data.supplier_payee.per_page;
            this.last_page1 = res.data.supplier_payee.last_page;
          })  
      },
      // 这是添加或修改供应商数据
      updata(){
        if(this.formAddModification.id == ''){
           this.axios.post('/erp.supplier/supplier_add',{
             id:this.formAddModification.id,
             type:this.formAddModification.type,
             name:this.formAddModification.name,
             province:this.formAddModification.province,
             city:this.formAddModification.city,
             county:this.formAddModification.county,
             address:this.formAddModification.address,
          }).then(res => {
            if(res.data.code == 2000){
              this.open(res.data.msg,'success');
              this.getData();
              this.AddModification = false;
            }else{
              this.open(res.data.msg,'error');
            }
          })
        }else{
          this.axios.post('/erp.supplier/supplier_update',{
             id:this.formAddModification.id,
             type:this.formAddModification.type,
             name:this.formAddModification.name,
             province:this.formAddModification.province,
             city:this.formAddModification.city,
             county:this.formAddModification.county,
             address:this.formAddModification.address,
          }).then(res => {
            if(res.data.code == 2000){
              this.open(res.data.msg,'success');
              this.getData();
              this.AddModification = false;
            }else{
              this.open(res.data.msg,'error');
            }
          })
        }
        
      },

      // 获取仓库数据
      getData(){
        this.axios.get('/erp.supplier/supplier_list').then(res => {
          this.tableData = res.data.supplier.data;
          this.currentPage = res.data.supplier.current_page;
          this.total = res.data.supplier.total;
          this.per_page = res.data.supplier.per_page;
          this.last_page = res.data.supplier.last_page;
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
          this.axios.post('/erp.supplier/supplier_list',{
              page:val,
              name:this.schanPing,
            }).then(res => {
              this.tableData = res.data.supplier.data;
              this.currentPage = res.data.supplier.current_page;
              this.total = res.data.supplier.total;
              this.per_page = res.data.supplier.per_page;
              this.last_page = res.data.supplier.last_page;
              loading.close();
            //console.log(this.customerListInfo)
          })  
      },
      // 搜索数据
      seach(){
        const loading = this.$loading({
            lock: true,
            text: '拼命加载中',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          this.axios.post('/erp.supplier/supplier_list',{
              name:this.schanPing,
            }).then(res => {
              this.tableData = res.data.supplier.data;
              this.currentPage = res.data.supplier.current_page;
              this.total = res.data.supplier.total;
              this.per_page = res.data.supplier.per_page;
              this.last_page = res.data.supplier.last_page;
              loading.close();
             //console.log(this.customerListInfo)
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
              //console.log(response.status)
            }
          })
          // .catch(function(error){console.log(typeof+ error)})
        },
        // 省
        choseProvince:function(e) {
          for (var index2 in this.province) {
            if (e === this.province[index2].id) {
              // console.log(this.province[index2].id)//你选择的省级编码
              //console.log(this.province[index2].value)//省级编码 对应的汉字 
              this.shi1 = this.province[index2].children;
              this.shi = this.province[index2].children[0].value;
              this.qu1 =this.province[index2].children[0].children;
              this.qu = this.province[index2].children[0].children[0].value;
              this.E = this.qu1[0].value;
              this.formAddModification.province = this.province[index2].value;
              this.formAddModification.city = this.province[index2].children[0].value;
              this.formAddModification.county = this.province[index2].children[0].children[0].value;
              //console.log(this.form.sheng);
              //console.log(this.form.shi);
              //console.log(this.form.qu);
            }
          }
        },
        // 选市
        choseCity:function(e) {
          for (var index3 in this.city) {
            if (e === this.city[index3].id) {
              this.qu1 = this.city[index3].children;
              this.qu = this.city[index3].children[0].value;
              this.E = this.qu1[0].id;
              this.formAddModification.city = this.city[index3].value;;
              //console.log(this.form.shi)
            }
          }
        },
        // 选区
        choseBlock:function(e) {
          this.E=e;
          for (var index4 in this.block) {
            if (e === this.block[index4].id) {
              this.formAddModification.county = this.block[index4].value;
              //console.log(this.form.qu)
            }
          }
        },
        open(a,b){
            this.$message({
                message: a,
                type: b
            });
        },
        
    },
    created(){
      this.getCityData();
      this.getData();
    },
    watch:{
        $route(to){
          this.getCityData();
          this.getData();
        }
    }

  }
</script>
<style scoped lang="less">
  .box{
    min-width: 1030px;
    .tou{
      margin-top: 20px;
      span{
        width: 150px;
        display: inline-block;
      }
    }
    .head_box{
      margin-top: 20px;
    }
    .content_box{
      margin-top:10px;
      
    }

    .head_SettlementBox{
      span{
        display: inline-block;
        width: 150px;
        margin-right: 10px;
      }
    }
    .content_SettlementBox{
      margin-top: 20px;
    }
  }
</style>

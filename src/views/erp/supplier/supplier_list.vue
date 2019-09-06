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
        <!-- <el-table-column prop="address" label="具体地址"></el-table-column> -->
        <el-table-column prop="name" label="名称" width="350px"></el-table-column>
        <el-table-column prop="money_wjs" label="未结清">
          <template slot-scope="scope">
            <span>{{ Number(scope.row.purchase_product_money_wjs) -Number(scope.row.supplier_after_sales_money_wjs)  + Number(scope.row.product_stockup_supplier_money_wjs) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="money_js" label="已结清">
          <template slot-scope="scope">
            <span>{{ Number(scope.row.purchase_product_money_js) - Number(scope.row.supplier_after_sales_money_js)  + Number(scope.row.product_stockup_supplier_money_js) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="290px">
          <template slot-scope="scope">
            <el-button @click.native="modify(scope.row)" type="primary" size="mini">更新</el-button>
            <el-button @click.native="account(scope.row)" type="danger" size="mini">账号</el-button>
            <el-button @click.native="settlement(scope.row)" type="warning" size="mini">结算</el-button>
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
     <el-dialog title="添加供应商收款账号" :visible.sync="dialogAccount" width="70%">
       <el-form :model="formAccount">
          <el-form-item label="类型" label-width="90px">
            <el-radio v-model="formAccount.type" label="1">企业</el-radio>
            <el-radio v-model="formAccount.type" label="2">个人</el-radio>
          </el-form-item>
          <el-form-item label="开户行" label-width="90px">
            <el-input v-model="formAccount.opening_bank" style="width:50%"></el-input>
          </el-form-item>
          <el-form-item label="收款名称" label-width="90px">
            <el-input v-model="formAccount.receiving_name" style="width:50%"></el-input>
          </el-form-item>
          <el-form-item label="收款账号" label-width="90px">
            <el-input v-model="formAccount.receiving_account" style="width:50%"></el-input>
          </el-form-item>
          <el-form-item label="" label-width="90px">
            <el-button type="primary" @click="addAccount">提交</el-button>
          </el-form-item>
       </el-form>
       <el-table :data="AccountData">
         <el-table-column label="类型" prop="type"></el-table-column>
         <el-table-column label="收款名称" prop="receiving_name" ></el-table-column>
         <el-table-column label="开户行" prop="opening_bank"></el-table-column>
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
     <el-dialog title="添加和更新供应商联系人" :visible.sync="dialogContact">
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
          <el-form-item label="结算方式" label-width="90px" style="margin-left: 80px;">
            <el-radio v-model="formAddModification.settlement" label="0">现结</el-radio>
            <el-radio v-model="formAddModification.settlement" label="1">月结</el-radio>
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
      
     <!-- 添加供应商结算 -->
     <el-dialog title="结算" :visible.sync="dialogSettlement" width="70%">
       <el-form :model="settlementForm">
         <el-form-item label="时间" label-width="90px">
           <el-date-picker v-model="settlementForm.time" type="daterange" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="changeTime">
            </el-date-picker>
         </el-form-item>
         <el-form-item label="金额" label-width="90px">
           <p>运费未结算：<span @click="chakan(1)" style="color:#409EFF">{{settlementForm.express_cost_prepayment}}</span>元，备货未结算：<span  @click="chakan(2)" style="color:#409EFF">{{settlementForm.product_stockup_supplier_money}}</span>元，订单金额：<span  @click="chakan(3)" style="color:#409EFF">{{settlementForm.purchase_product_money}}</span>元，供应商产生的售后：<span  @click="chakan(4)" style="color:#409EFF">{{settlementForm.supplier_after_sales_money}}</span>元，<span>总共{{settlementForm.money}}元</span></p>
         </el-form-item>
         <el-form-item label="收款账号" label-width="90px">
            <el-select v-model="settlementForm.account" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="`${item.receiving_name}:${item.receiving_account}`"
                :value="item.id">
                <span style="float: left; color: #8492a6;">{{ item.receiving_name }}:</span>
                <span style="float: left;">{{ item.receiving_account }}</span>
              </el-option>
              
            </el-select>
         </el-form-item>
         <el-form-item label="备注" label-width="90px">
           <el-input type="textarea" v-model="settlementForm.remarks" style="width:300px"></el-input>
         </el-form-item>
         <el-form-item label="" label-width="90px">
           <el-button @click="sendSet">提交</el-button>
         </el-form-item>
       </el-form>
       <el-table :data="settlementData">
         <el-table-column label="时间" prop="add_time" width="160px"></el-table-column>
         <el-table-column label="备货未结算" prop="product_stockup_supplier_money"></el-table-column>
         <el-table-column label="订单" prop="purchase_product_money"></el-table-column>
         <el-table-column label="产生的售后" prop="supplier_after_sales_money"></el-table-column>
         <el-table-column label="运费未结算" prop="express_cost_prepayment"></el-table-column>
         <el-table-column label="备注" prop="remarks">
           <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" :content="scope.row.remarks" placement="top">
                <el-button type="text">查看</el-button>
              </el-tooltip>
           </template>
         </el-table-column>
         <el-table-column label="状态" prop="status">
           <template slot-scope="scope">
             <span v-if="scope.row.status == 0">已提交</span>
             <span v-if="scope.row.status == 1">财务已审核</span>
             <span v-if="scope.row.status == 2">出纳已打款</span>
           </template>
         </el-table-column>
         <el-table-column label="操作">
           <template slot-scope="scope">
             <el-button v-show="scope.row.status<2" @click="setdetele(scope.row)" type="danger" size="mini">删除</el-button>
           </template>
         </el-table-column>
       </el-table>
       <div class="block" style="margin-top: 10px;">
        <el-pagination
          @current-change="handleCurrentChange3"
          :current-page="currentPage3"
          :page-size="per_page3"
          layout="total, prev, pager, next"
          :total="total3">
        </el-pagination>
      </div>
     </el-dialog>
      <!-- 添加供应商结算款项明细 -->
     <el-dialog title="添加供应商结算款项明细" :visible.sync="dialogMingxi" width="60%">
       <el-table :data="mingxi" show-summary>
         <el-table-column label="添加时间">
           <template slot-scope="scope">
             <span>{{scope.row.add_time}}</span>
           </template>
         </el-table-column>
         <el-table-column label="订单客户">
           <template slot-scope="scope">
             <span>{{scope.row.company_name}}/{{scope.row.customer_name}}</span>
           </template>
         </el-table-column>
         <el-table-column label="金额" prop="money"></el-table-column>
         <el-table-column label="销售员">
            <template slot-scope="scope">
             <span>{{scope.row.dep_title}}/{{scope.row.user_name}}</span>
           </template>
         </el-table-column>
       </el-table>
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
        page:'',
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
          settlement:'0',
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
          opening_bank:'',
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

        // 结算
        dialogSettlement:false,
        settlementForm:{
          id:'',
          time:[],
          money:'',
          account:'',
          remarks:'',
          express_cost_prepayment:'',
          product_stockup_supplier_money:'',
          purchase_product_money :'',
          supplier_after_sales_money:'',
        }, // 表单
        settlementData:[], // 表格
        currentPage3:0,//当前页
        total3:0,//总数
        per_page3:0,//每页多少条
        last_page3:0,//总页数
        dialogMingxi:false,// 明细
        mingxi:[],


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
      // chankan
      chakan(a){
        let b;
        if(a == 1){
          b='express_cost_prepayment'
        }else if (a == 2){
           b='product_stockup_supplier_money'
        }else if (a == 3){
           b='purchase_product_money'
        }else if (a == 4){
           b='supplier_after_sales_money'
        }
        this.axios.get('/erp.supplier/supplier_money_select?start_time='+this.settlementForm.time[0]+'&end_time='+this.settlementForm.time[1]+'&id='+this.settlementForm.id +'&action='+b).then(res => {
          this.mingxi = res.data.express_cost
          this.dialogMingxi = true;
        })
      },
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
        this.formAddModification.settlement = String(a.settlement);
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
            opening_bank:this.formAccount.opening_bank
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
            opening_bank:this.formAccount.opening_bank,
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
             settlement:this.formAddModification.settlement,
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
             settlement:this.formAddModification.settlement,
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
      // 结算按钮
      settlement(a){
        this.dialogSettlement = true;
        this.settlementForm.id = a.id;
        this.settlementForm.time = [];
        this.getSettlementData(a.id);
      },
      // 选择时间获取金额
      changeTime(val){
        if(val == null){
          this.axios.get('/erp.supplier/supplier_money_add?start_time=0&end_time=0&id='+this.settlementForm.id).then(res => {
              this.settlementForm.money = 0;
              this.settlementForm.express_cost_prepayment_wjs = 0;
              this.settlementForm.product_stockup_supplier_money_wjs = 0;
              this.settlementForm.money_wjs = 0;
              this.settlementForm.supplier_after_sales_money_wjs = 0;
          })
        }else{
          this.axios.get('/erp.supplier/supplier_money_add?start_time='+val[0]+'&end_time='+val[1]+'&id='+this.settlementForm.id).then(res => {
            this.options = res.data.supplier_payee;

            this.settlementForm.money = Number(res.data.express_cost.express_cost_prepayment_wjs) + Number(res.data.product_stockup_supplier.product_stockup_supplier_money_wjs)+ Number(res.data.purchase_product.money_wjs)- Number(res.data.supplier_after_sales.supplier_after_sales_money_wjs); 

            this.settlementForm.express_cost_prepayment = res.data.express_cost.express_cost_prepayment_wjs;

            this.settlementForm.product_stockup_supplier_money = res.data.product_stockup_supplier.product_stockup_supplier_money_wjs;

            this.settlementForm.purchase_product_money = res.data.purchase_product.money_wjs;

            this.settlementForm.supplier_after_sales_money = res.data.supplier_after_sales.supplier_after_sales_money_wjs;
          })
        }
      },
      // 提交结算数据
      sendSet(){
        this.axios.post('/erp.supplier/supplier_money_add',{
            supplier_id:this.settlementForm.id,
            start_time:this.settlementForm.time[0],
            end_time:this.settlementForm.time[1],
            express_cost_prepayment:this.settlementForm.express_cost_prepayment,
            product_stockup_supplier_money:this.settlementForm.product_stockup_supplier_money,
            supplier_payee_id:this.settlementForm.account,
            purchase_product_money :this.settlementForm.purchase_product_money ,
            supplier_after_sales_money:this.settlementForm.supplier_after_sales_money,
            money:this.settlementForm.money,
            remarks:`${this.settlementForm.time[0]}至${this.settlementForm.time[1]}结算费用：${this.settlementForm.money}，${this.settlementForm.remarks}`
        }).then(res => {
            if(res.data.code == 2000){
              this.open(res.data.msg,'success');
              this.getSettlementData(this.settlementForm.id);
            }else{
              this.open(res.data.msg,'error');
            }
        })
      },


      // 获取结算table数据
      getSettlementData(a){
        this.axios.get('/erp.supplier/supplier_money_lists?id='+a).then(res => {
            this.settlementData = res.data.supplier_payee.data;
            this.currentPage3 = res.data.supplier_payee.current_page;
            this.total3 = res.data.supplier_payee.total;
            this.per_page3 = res.data.supplier_payee.per_page;
            this.last_page3 = res.data.supplier_payee.last_page;
        })
      },
      // 结算table数据分页
      handleCurrentChange3(val){
        this.axios.post('/erp.supplier/supplier_money_lists',{
          page:val,
          id:this.settlementForm.id,
        }).then(res => {
            this.settlementData = res.data.supplier_payee.data;
            this.currentPage3 = res.data.supplier_payee.current_page;
            this.total3 = res.data.supplier_payee.total;
            this.per_page3 = res.data.supplier_payee.per_page;
            this.last_page3 = res.data.supplier_payee.last_page;
        })
      },
       // 结算table数据删除
      setdetele(a){
        this.axios.post('/erp.supplier/supplier_money_delete',{
          id:a.id
        }).then(res => {
            if(res.data.code == 2000){
              this.open(res.data.msg,'success');
              this.getSettlementData(this.settlementForm.id);
            }else{
              this.open(res.data.msg,'error');
            }
        })
      },


      // 获取仓库数据
      getData(){
        this.axios.post('/erp.supplier/supplier_list',{
            page:this.page,
            name:this.schanPing,
        }).then(res => {
          this.tableData = res.data.supplier.data;
          this.currentPage = res.data.supplier.current_page;
          this.total = res.data.supplier.total;
          this.per_page = res.data.supplier.per_page;
          this.last_page = res.data.supplier.last_page;
        })
      },
      // 分页 
      handleCurrentChange(val) {
          this.page = val;
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
              this.shi1 = this.province[index2].children;
              this.shi = this.province[index2].children[0].value;
              this.qu1 =this.province[index2].children[0].children;
              this.qu = this.province[index2].children[0].children[0].value;
              this.E = this.qu1[0].value;
              this.formAddModification.province = this.province[index2].value;
              this.formAddModification.city = this.province[index2].children[0].value;
              this.formAddModification.county = this.province[index2].children[0].children[0].value;
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
    activated(){
        this.getCityData();
        this.getData();
    }

  }
</script>
<style scoped lang="less">
  .box{
    .tou{
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

<!-- 模板组件，用于模拟不同路由下的组件显示 -->
<template>
  <div class="box">
    <div class="head_box">
        <label>筛选：</label>
        <el-select v-model="value" placeholder="请选择" style="width:120px">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <el-input placeholder="名称" v-model="schanPing" style="width:150px;margin-left:10px"></el-input>
        <el-input placeholder="最低价" v-model="maxPrice" style="width:100px;margin-left:10px"></el-input>
        <el-input placeholder="最高价" v-model="minPrice" style="width:100px;margin-left:10px"></el-input>
        <el-button type="primary"  style="margin-left:20px;">搜索</el-button>
    </div>

    <div class="content_box">
      <el-table :data="tableData">  
          <el-table-column label="样品">
              <template slot-scope="scope">
                  <img style="width:100px;" :src="scope.row.src">
              </template>
          </el-table-column>
        <el-table-column prop="name" label="产品">
            <template slot-scope="scope">
                <span>{{ scope.row.name }}{{ scope.row.sku_name }}</span>
            </template>
        </el-table-column>
        <el-table-column prop="supplier_name" label="供应商"></el-table-column>
        <el-table-column prop="number" label="库存"></el-table-column>
        
        <el-table-column label="起订量">
            <template slot-scope="scope">
                <span>{{ scope.row.starting_quantity }}{{ scope.row.unit }}</span>
            </template>
        </el-table-column>
        <el-table-column prop="cost_price" label="成本价"></el-table-column>
        <el-table-column prop="selling_price" label="销售价"></el-table-column> 
        <el-table-column label="定制LOGO">
            <template slot-scope="scope">
                <span v-if="scope.row.logo == 1">是</span>
                <span v-if="scope.row.logo == 0">否</span>
            </template>
        </el-table-column> 
        <el-table-column label="操作" width="190px">
            <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="capzuo(scope.row)">操作</el-button>
                <el-button type="primary" size="mini" @click="cha(scope.row)">库存记录</el-button>
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

     <el-dialog title="添加库存" :visible.sync="addDetails" width="50%">
      <el-form :model="addDetailsData">
        <el-form-item label="供应商" label-width="90px">
          <p style="font-weight:bold">{{addDetailsData.supplier_name}}</p>
        </el-form-item>
        <el-form-item label="加减库存" label-width="90px">
          <el-switch
            style="display: block;margin-top: 8px;"
            v-model="addDetailsData.value2"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="增加"
            inactive-text="减少">
          </el-switch>
        </el-form-item>
        <el-form-item label="数量" label-width="90px">
          <el-input style="width:300px" v-model="addDetailsData.number"></el-input>
        </el-form-item>
        <el-form-item label="备注" label-width="90px">
          <el-input type="textarea" style="width:300px" v-model="addDetailsData.content"></el-input>
          </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
          <el-button @click="addDetails = false">取 消</el-button>
          <el-button type="primary" @click="addKucun">确 定</el-button>
        </div>
    </el-dialog> 

    <el-dialog title="库存记录" :visible.sync="dialogKC" width="50%">
      <el-table :data="KC">
           <el-table-column label="时间" width="155px" prop="add_time"></el-table-column>
           <el-table-column label="类型" prop="content"></el-table-column>
           <el-table-column label="供应商" prop="supplier_name"></el-table-column>
           <el-table-column label="数量" prop="number"></el-table-column>
           <el-table-column label="剩余库存" prop="number_new"></el-table-column>
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
  </div>
</template>

<script>
import { mapActions } from "vuex";
  export default {
    data () {
      return {
        value:"",
        schanPing:"",
        maxPrice:"",
        minPrice:"",
        options:[
          {
            value: "",
            label: "全部"
          },
          {
            value: "刀具",
            label: "刀具"
          },
          {
            value: "手册",
            label: "手册"
          },
          {
            value: "毛巾",
            label: "毛巾"
          },
          {
            value: "中国太平",
            label: "中国太平"
          },
        ],
        tableData:[
        ],
        details:false,
        detailsData:{
          number:'',
          id:'',
        },
        options_supplier:[],
        addDetails:false,
        addDetailsData:{
          number:'',
          id:'',
          supplier_id:'',
          supplier_name:'',
          content:'',
          value2:true,
        },
        //分页器
        currentPage:0,//当前页
        total:0,//总数
        per_page:0,//每页多少条
        last_page:0,//总页数

        dialogKC:false,
        product_sku_id:'',
        KC:[],
        currentPage1:0,//当前页
        total1:0,//总数
        per_page1:0,//每页多少条
        last_page1:0,//总页数
      };
    },
    methods:{
      ...mapActions("customerList", ["triggerReplaceId"]),
      ...mapActions("Tabs", ["triggerAddTabs", "triggerSetActiveIndex"]),
      // 分页器
      handleCurrentChange(val) {
        const loading = this.$loading({
          lock: true,
          text: '拼命加载中',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        this.axios.post('/erp.Product/product_inventory_lists',{
            page:val,
          }).then(res => {
          this.tableData = res.data.product.data;
          this.currentPage = res.data.product.current_page;
          loading.close();
          //console.log(this.customerListInfo)
        })  
      },

      getData(){
        // const loading = this.$loading({
        //   lock: true,
        //   text: '拼命加载中',
        //   spinner: 'el-icon-loading',
        //   background: 'rgba(0, 0, 0, 0.7)'
        // });
        this.axios.get('/erp.Product/product_inventory_lists').then(res => {
          this.currentPage = res.data.product.current_page;
          this.total = res.data.product.total;
          this.per_page = res.data.product.per_page;
          this.last_page = res.data.product.last_page;
          this.tableData = res.data.product.data;
          //loading.close();
        })
      },
      // 库存
      capzuo(a){
        this.addDetails = true;
        this.addDetailsData.id = a.product_sku_id;
        this.addDetailsData.number = '';
        this.addDetailsData.supplier_name = a.supplier_name;
        this.addDetailsData.supplier_id = a.supplier_id;
      },
      addKucun(){
        if(this.addDetailsData.number != ''){
          let b;
          if(this.addDetailsData.value2 == true){
            b = 'inc'
          }else{
            b = 'dec'
          }
          this.axios.post('/erp.Product/product_supplier_inventory_add',{
            supplier_id:this.addDetailsData.supplier_id,
            product_sku_id:this.addDetailsData.id,
            number:this.addDetailsData.number,
            content:this.addDetailsData.content,
            param:b,
          }).then(res => {
              if(res.data.code == 2000){
                    this.open(res.data.msg,'success');
                    this.addDetails = false;
                    this.getData();
                }else{
                    this.open(res.data.msg,'error');
                } 
          })
        }else{
           this.open('填写备货数量','error');
        }
      },
      cha(a){
        this.dialogKC = true;
        this.product_sku_id = a.product_sku_id,
        this.axios.post('/erp.Product/product_inventory_log_lists',{
            product_sku_id:a.product_sku_id,
        }).then(res => {
            this.currentPage1 = res.data.log.current_page;
            this.total1 = res.data.log.total;
            this.per_page1 = res.data.log.per_page;
            this.last_page1 = res.data.log.last_page;
            this.KC = res.data.log.data;
        })
      },
      handleCurrentChange1(val){
          this.axios.post('/erp.Product/product_inventory_log_lists',{
            product_sku_id:this.product_sku_id,
            page:val
        }).then(res => {
            this.currentPage1 = res.data.log.current_page;
            this.total1 = res.data.log.total;
            this.per_page1 = res.data.log.per_page;
            this.last_page1 = res.data.log.last_page;
            this.KC = res.data.log.data;
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
      this.$nextTick(() => {
        this.getData();
      })
    },
    watch:{
      $route(to){
         this.$nextTick(() => {
          this.getData();
        })
      }
    }
  }
</script>
<style lang="less">
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand>label {
    color: #99a9bf;
    margin-top: 15px !important;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 100%;
    
  }
</style>

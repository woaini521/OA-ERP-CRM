<!-- 模板组件，用于模拟不同路由下的组件显示 -->
<template>
  <div class="box">
    <div class="head_box">
        <label>筛选：</label>
        <el-input placeholder="名称" v-model="schanPing" style="width:217px;margin-left:10px"></el-input>
        <el-button type="primary"  style="margin-left:20px;" @click="seach">搜索</el-button>
    </div>

    <div class="content_box">
      <el-table :data="tableData">
        <el-table-column type="expand">
           <template slot-scope="scope">
              <el-form label-position="left" inline="true" class="demo-table-expand"  v-if="scope.row.sku != null">
                  <el-form-item label-position="left" inline class="demo-table-expand" v-for="(item,index) in scope.row.sku" :key="item.id" :label="index+1" style="overflow: hidden;margin-top:10px;width:1100px;">
                    <img style="width:70px;height:70px;float: left;" :src="item.src">
                    <p style="float: left;margin-top:15px;margin-left:10px;">
                      <span>{{ item.sku_name }}</span>
                      <span style="margin-left:10px;">成本价：{{ item.cost_price }}</span>
                      <span style="margin-left:10px;">销售价：{{ item.selling_price }}</span>
                      <span style="margin-left:10px;">起订量：{{ item.starting_quantity }}{{ item.unit }}</span>
                      <span style="margin-left:10px;">货期：{{ item.maximum_delivery }}--{{ item.slowest_delivery }}</span>
                      <span style="margin-left:10px;">{{ item.firm_id == '是'?'不可定制公司专版':'可定制公司专版' }}</span>
                      <span style="margin-left:10px;">{{ item.logo == '是'?'不可定制logo':'可定制logo' }}</span>
                      <span style="margin-left:10px;">添加时间:{{ item.add_time }}</span>
                    </p>
                    <el-button type="primary" size="mini" style="margin-top: 20px;margin-left:20px;" @click="beihuo(item.id)">备货</el-button>
                    <el-button type="danger" size="mini" @click="kucun(item.id)">添加库存</el-button>
                  </el-form-item>
              </el-form>
              <el-form v-else>
                <el-form-item label-position="left" inline class="demo-table-expand">
                  <span>暂无附加产品</span>
                </el-form-item>
              </el-form>
            </template>
        </el-table-column>
        <el-table-column prop="name" label="产品"></el-table-column>
        <el-table-column prop="class_name" label="类别"></el-table-column>
        <el-table-column prop="supplier" label="供应商数"></el-table-column>
        <el-table-column label="修改">
          <template slot-scope="scope">
            <el-button type="primary" @click="Edit(scope.row)" size="small">修改</el-button>
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


   <el-dialog title="备货" :visible.sync="details" width="50%">
     <el-form :model="detailsData">
       <el-form-item label="数量" label-width="90px">
         <el-input style="width:300px" v-model="detailsData.number"></el-input>
       </el-form-item>
     </el-form>
     <div slot="footer" class="dialog-footer">
        <el-button @click="details = false">取 消</el-button>
        <el-button type="primary" @click="addBeihuo">确 定</el-button>
      </div>
   </el-dialog>


   <el-dialog title="添加库存" :visible.sync="addDetails" width="50%">
     <el-form :model="addDetailsData">
       <el-form-item label="供应商" label-width="90px">
         <el-select v-model="addDetailsData.supplier_id" placeholder="请选择" style="width:300px">
          <el-option v-for="item in options_supplier" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
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
          content:''
        },
        //分页器
        currentPage:'',//当前页
        total:'',//总数
        per_page:'',//每页多少条
        last_page:''//总页数
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
        this.axios.post('/erp.Product/product_list',{
            page:val,
            name:this.schanPing,
          }).then(res => {
          this.tableData = res.data.product.data;
          this.currentPage = res.data.product.current_page;
          this.total = res.data.product.total;
          this.per_page = res.data.product.per_page;
          this.last_page = res.data.product.last_page;
          loading.close();
          //console.log(this.customerListInfo)
        })  
      },
      // 搜索
      seach(){
         const loading = this.$loading({
          lock: true,
          text: '拼命加载中',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        this.axios.post('/erp.Product/product_list',{
            name:this.schanPing,
          }).then(res => {
          this.tableData = res.data.product.data;
          this.currentPage = res.data.product.current_page;
          this.total = res.data.product.total;
          this.per_page = res.data.product.per_page;
          this.last_page = res.data.product.last_page;
          loading.close();
          //console.log(this.customerListInfo)
        }) 
      },
      // 修改信息
      Edit(a){
          this.triggerReplaceId(a.id);
          this.$router.push({ path:`/erp/Product/product_update/${a.id}`, params:{id:a.id}});
          let ins1 = {
            route: `/erp/Product/product_update/${a.id}`,
            name: "修改产品",
            id:a.id
          };
          let ins2 = `/erp/Product/product_update/${a.id}`;
          this.triggerAddTabs(ins1);
          this.triggerSetActiveIndex(ins2);
        },
      getData(){
        this.axios.get('/erp.Product/product_list').then(res => {
          this.tableData = res.data.product.data;
          this.currentPage = res.data.product.current_page;
          this.total = res.data.product.total;
          this.per_page = res.data.product.per_page;
          this.last_page = res.data.product.last_page;
          // loading.close();
        })
      },

      // 备货按钮
      beihuo(a){
        this.details = true;
        this.detailsData.id = a;
        this.detailsData.number = '';
      },
      // 提交备货
      addBeihuo(){
        if(this.detailsData.number != ''){
          this.axios.post('/erp.Product/product_product_stock_add',{
            product_sku_id:this.detailsData.id,
            number:this.detailsData.number
          }).then(res => {
            if(res.data.code == 2000){
                    this.open(res.data.msg,'success');
                    this.details = false;
                }else{
                    this.open(res.data.msg,'error');
                } 
          })
        }else{
           this.open('填写备货数量','error');
        }
      },
      // 库存
      kucun(a){
        this.addDetails = true;
        this.addDetailsData.id = a;
        this.addDetailsData.number = '';
        this.axios.get('/erp.Product/product_supplier_inventory_add').then(res => {
          this.options_supplier =  res.data.supplier
        })
      },
      addKucun(){
        if(this.addDetailsData.number != ''){
          this.axios.post('/erp.Product/product_supplier_inventory_add',{
            supplier_id:this.addDetailsData.supplier_id,
            product_sku_id:this.addDetailsData.id,
            number:this.addDetailsData.number,
            content:this.addDetailsData.content,
            param:'inc',
          }).then(res => {
            if(res.data.code == 2000){
                    this.open(res.data.msg,'success');
                    this.addDetails = false;
                }else{
                    this.open(res.data.msg,'error');
                } 
          })
        }else{
           this.open('填写备货数量','error');
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
  .box{
    min-width: 890px;
    .head_box{
      margin-top:20px;
    }
  }
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

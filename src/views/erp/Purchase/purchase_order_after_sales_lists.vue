<template>
  <div class="box">
    <div class="box_head">
      <label>筛选：</label>
      <el-input v-model="seash" style="width:217px"></el-input>
      <el-button type="primary" style="margin-left:30px;">搜索</el-button>
     
    
    </div>
    <div class="box_content">
      <el-table :data="tableData" style="width: 100%;">
          <el-table-column label="订单编号" prop="customer_order_id"></el-table-column>
          <el-table-column label="产品图片" width="100px">
            <template slot-scope="scope">
               <img style="width:90px" :src="scope.row.src" alt="">
            </template>
          </el-table-column>
          <el-table-column label="产品" width="300px">
            <template slot-scope="scope">
               <span>{{ scope.row.name}}{{ scope.row.class_name}}{{ scope.row.sku_name}}</span>
               <br>
               <p style="text-align:center">{{ scope.row.number}}{{ scope.row.unit}}</p>
            </template>
          </el-table-column>
          <el-table-column label="金额" prop="money"></el-table-column>
          <el-table-column label="供应商" prop="supplier_name"></el-table-column>
          <el-table-column label="供应商费用" prop="supplier_money"></el-table-column>
          <el-table-column label="备注" prop="remarks"></el-table-column>
          <el-table-column label="提交人" prop="after_sales_user_name"></el-table-column>
          <el-table-column label="业务员" prop="order_user_name"></el-table-column>
          <el-table-column label="操作">
              <template slot-scope="scope">
                  <el-button type="primary" v-if="scope.row.status != 2" @click="sh(scope.row)" size="small">处理</el-button>
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

    <el-dialog title="售后详情" :visible.sync="dialogSH">
      <h4>确认售后金额（是扣钱还是增加金额）</h4>
      <img :src="dialogSHForm.src" style="width:100px;float: right;margin-right: 40px">
      <h4 style="width:500px;margin-top:10px;">供应商名称：{{dialogSHForm.supplier_name}}</h4>
      <h4 style="width:500px;margin-top:10px;">供应商地址：{{dialogSHForm.address}}</h4>
      <h4 style="width:500px;margin-top:10px;">产品名称：{{dialogSHForm.name}}  产品数量：{{dialogSHForm.number}} </h4>
      <h4 style="width:500px;margin-top:10px;">金额：{{dialogSHForm.money}}</h4>
      <h4 style="width:500px;margin-top:10px;">备注：{{dialogSHForm.remarks}}</h4>
      
      <el-form :model="dialogSHForm" style="margin-top:20px;">
        <el-form-item label="金额">
          <el-input v-model="dialogSHForm.supplier_money" placeholder="请输入金额" style="width:217px"></el-input>
        </el-form-item>  
      </el-form>
      
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogSH = false">取 消</el-button>
        <el-button type="primary" @click="addSH">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
        tableData:[],
        page:'1',
        currentPage:'',//当前页
        total:'',//总数
        per_page:'',//每页多少条
        last_page:'',//总页数
        dialogSH:false,
        dialogSHForm:{
          supplier_name:'',
          supplier_money:'',
          id:'',
          address:'',
          src:'',
          name:'',
          number:'',
          money:'',
          remarks:'',
        },
    };
  },
  methods: {
      gettableData(){
          this.axios.get('/erp.Purchase/purchase_order_after_sales_lists').then(res => {
                this.tableData = res.data.after_sales.data;
                this.currentPage = res.data.after_sales.current_page;
                this.total = res.data.after_sales.total;
                this.per_page = res.data.after_sales.per_page;
                this.last_page = res.data.after_sales.last_page;
          })
      },
      //产品库分页
      handleCurrentChange(val) {
        this.page = val;
        const loading = this.$loading({
          lock: true,
          text: '拼命加载中',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        this.axios.post('/erp.Purchase/purchase_order_after_sales_lists',{
            page:val,
          }).then(res => {
          this.tableData = res.data.after_sales.data;
          this.currentPage = res.data.after_sales.current_page;
          loading.close();
        })  
      },
      sh(a){
        this.dialogSH = true;
        this.dialogSHForm.supplier_money = a.supplier_money;
        this.dialogSHForm.supplier_name = a.supplier_name;
        this.dialogSHForm.id = a.id;
        this.dialogSHForm.address = `${a.province}${a.city}${a.county}`;
        this.dialogSHForm.src = a.src;
        this.dialogSHForm.name = `${a.name}${a.class_name}${a.sku_name}`;
        this.dialogSHForm.money = a.money;
        this.dialogSHForm.number = a.number;
        this.dialogSHForm.remarks = a.remarks;
      },
      addSH(){
        this.axios.post('/erp.Purchase/purchase_order_after_sales_update',{
          id:this.dialogSHForm.id,
          supplier_money:this.dialogSHForm.supplier_money
        }).then(res => {
            if(res.data.code == 2000){
                    this.handleCurrentChange(this.page);
                    this.dialogSH = false;
                    this.open(res.data.msg,'success');
                }else{
                    this.open(res.data.msg,'error');
                }
        })
      },
      // 公用弹窗
        open(a,b){
            this.$message({
                message: a,
                type: b
            });
        },
  },
  created() {
     this.gettableData(); 
  },
  watch:{
      $route(to){
          this.gettableData(); 
      }
  }
};
</script>

<style lang="less" scoped>
.box_head{
    margin-top: 20px;
     
}
</style>


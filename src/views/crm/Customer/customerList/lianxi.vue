<template>
  <div class="box">
    <el-button style="margin-left:10px;margin-top:20px" type="primary" @click="addRecord">添加记录</el-button>       
    <el-table :data="tableData">
      <el-table-column prop="add_time" label="时间">
      </el-table-column>
      <el-table-column label="类型">
        <template slot-scope="scope">
            <span>{{scope.row.type.type_text}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="content" label="内容">
      </el-table-column>
      <el-table-column label="操作" width="150px">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="update(scope.row)">修改</el-button>
          <el-button type="danger" v-if="dete(scope.row.add_time)" size="mini" @click="deletes(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block" style="margin-top: 10px;">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="per_page"
        layout="total, prev, pager, next"
        :total="total">
      </el-pagination>
    </div>

    <el-dialog title="添加记录" :visible.sync="dialogRecord">
      <el-form :model="dialogRecordForm">
          <el-form-item label="类型" label-width="90px">
              <el-select v-model="dialogRecordForm.type" placeholder="请选择" style="width:300px;">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="内容" label-width="90px">
            <el-input type="textarea" v-model="dialogRecordForm.content" style="width:300px;"></el-input>
          </el-form-item>
          <el-form-item label="" label-width="90px">
            <el-button type="primary" @click="confirm">提交</el-button>
          </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        search:'', // 搜索
        tableData:[], // 表格
        dialogRecord:false, // 弹窗
        dialogRecordForm:{ // 表单
          type:'',
          content:'',
          customer_id:'',
          id:'',
        },
        options:[
          {
            label:'催款',
            value:1
          },
          {
            label:'客户回访',
            value:2
          },
          {
            label:'售后服务',
            value:3
          },
          {
            label:'新品推荐',
            value:4
          },
          {
            label:'意向跟踪',
            value:5
          },
        ],
        currentPage:0,//当前页
        total:0,//总数
        per_page:0,//每页多少条
        last_page:0,//总页数
        today:'',//今天的日期
      };
    },
    methods:{
      // 获取数据
      getTabledata(){
        this.axios.get('/crm.Customer/customer_record?customer_id='+this.$route.params.id).then(res => {
            this.tableData = res.data.customer.data;
            this.currentPage = res.data.customer.current_page;
            this.total = res.data.customer.total;
            this.per_page = res.data.customer.per_page;
            this.last_page = res.data.customer.last_page;
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
        this.axios.post('/crm.Customer/customer_record',{
            page:val,
          }).then(res => {
          this.customerListInfo = res.data.customer.data;
          this.currentPage = res.data.customer.current_page;
          loading.close();
          //console.log(this.customerListInfo)
        })  
      },
      // 新增按钮
      addRecord(){
        this.dialogRecordForm.type = '';
        this.dialogRecordForm.content = '';
        this.dialogRecordForm.id = '';
        this.dialogRecord = true;
      },
      // 提交
      confirm(){
        if(this.dialogRecordForm.id == ''){
          // 添加
          this.axios.post('/crm.Customer/customer_record_add',{
            customer_id:this.$route.params.id,
            type:this.dialogRecordForm.type,
            content:this.dialogRecordForm.content,
          }).then(res => {
            if(res.data.code == 2000){
              this.open(res.data.msg,'success');
              this.getTabledata();
              this.dialogRecord = false;
            }else{
              this.open(res.data.msg,'error');
            }
          })
        }else{
          //修改
          this.axios.post('/crm.Customer/customer_record_update',{
            customer_id:this.$route.params.id,
            id:this.dialogRecordForm.id,
            type:this.dialogRecordForm.type,
            content:this.dialogRecordForm.content,
          }).then(res => {
            if(res.data.code == 2000){
              this.open(res.data.msg,'success');
              this.getTabledata();
              this.dialogRecord = false;
            }else{
              this.open(res.data.msg,'error');
            }
          })
        }
        
      },
      // 修改按钮
      update(a){
        this.dialogRecordForm.type = a.type.type;
        this.dialogRecordForm.content = a.content;
        this.dialogRecordForm.id = a.id;
        this.dialogRecord = true;
        console.log()
      },
      // 删除按钮
      deletes(a){
         this.axios.post('/crm.Customer/customer_record_detele',{
            id:a.id,
          }).then(res => {
            if(res.data.code == 2000){
              this.open(res.data.msg,'success');
              this.getTabledata();
              this.dialogRecord = false;
            }else{
              this.open(res.data.msg,'error');
            }
          })
      },
      dete(a){
        var result;
        let gu =  a.substring(0,10);
        let guq = gu.replace('-','');
        let guqu = guq.replace('-','');
        let xz = this.today;
        
       // console.log(gu)
       // console.log(guqu)
        if(Number(xz) == Number(guqu)){
         return result = true
        }else{
         return result = false
        }
      },
       // 公用弹窗
      open(a,b){
        this.$message({
          message: a,
          type: b
        });
      },
       // 默认时间
      change(t){
            if(t<10){
                return "0"+t;
            }else{
                return t;
            }
        },
    },
    created(){
      let d=new Date();
      let year=d.getFullYear();
      let month=this.change(d.getMonth()+1);
      let day=this.change(d.getDate());
      this.today = `${year}${month}${day}`
      this.getTabledata(); 
    },
    watch: {
		  $route(to) {
        if(!this.$route.params.id){

        }else{
          this.getTabledata(); 
        }
		  }
	  }
  }
</script>
<style scoped lang="less">

</style>
<template>
  <div class="box">
    <label>时间筛选:</label>
    <el-date-picker v-model="time" type="daterange" range-separator="至" start-placeholder="开始日期" value-format="timestamp" end-placeholder="结束日期">
    </el-date-picker>
    <el-input v-model="name" style="width:100px;margin-left:20px;" placeholder="姓名"></el-input>
    <el-select v-model="type" placeholder="类型" style="margin-left:20px;width:150px">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
    </el-select>
    <el-button style="margin-left:20px" @click="seach">搜索</el-button> 
    <el-table :data="tableData">
      <el-table-column prop="dep_name" label="部门" width="110px"></el-table-column>
      <el-table-column prop="name" label="销售员" width="100px"></el-table-column>
      <el-table-column prop="add_time" label="时间" width="170px"></el-table-column>
      <el-table-column prop="customer_name" label="客户" width="90px">
      </el-table-column>
      <el-table-column label="类型" width="100px">
        <template slot-scope="scope">
            <span>{{scope.row.type.type_text}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="content" label="内容">
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

  </div>
</template>

<script>
  export default {
    data () {
      return {
        time:null,
        name:'',
        type:'',
        tableData:[], // 表格
        dialogRecord:false, // 弹窗
        
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
        this.axios.get('/crm.Customer/customer_record').then(res => {
            this.tableData = res.data.customer.data;
            this.currentPage = res.data.customer.current_page;
            this.total = res.data.customer.total;
            this.per_page = res.data.customer.per_page;
            this.last_page = res.data.customer.last_page;
        })
      },
      // 分页
      handleCurrentChange(val) {
          let a,b;
          if(this.time == null){
            a='';
            b=''
          }else{
            a=this.time[0]/1000;
            b=this.time[1]/1000
          }
        const loading = this.$loading({
          lock: true,
          text: '拼命加载中',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        this.axios.post('/crm.Customer/customer_record',{
            page:val,
            start_time:a,
            end_time:b,
            name:this.name,
            type:this.type,
          }).then(res => {
          // this.customerListInfo = res.data.customer.data;
          // this.currentPage = res.data.customer.current_page;
          this.tableData = res.data.customer.data;
          this.currentPage = res.data.customer.current_page;
          this.total = res.data.customer.total;
          this.per_page = res.data.customer.per_page;
          this.last_page = res.data.customer.last_page;
          loading.close();
          //console.log(this.customerListInfo)
        })  
      },

      seach(){// 搜索
          let a,b;
          if(this.time == null){
            a='';
            b=''
          }else{
            a=this.time[0]/1000;
            b=this.time[1]/1000
          }
          this.axios.post('/crm.Customer/customer_record',{
            customer_id:this.$route.params.id,
            name:this.name,
            type:this.type,
            start_time:a,
            end_time:b,
          }).then(res => {
          // this.customerListInfo = res.data.customer.data;
          // this.currentPage = res.data.customer.current_page;
          this.tableData = res.data.customer.data;
          this.currentPage = res.data.customer.current_page;
          this.total = res.data.customer.total;
          this.per_page = res.data.customer.per_page;
          this.last_page = res.data.customer.last_page;
          //console.log(this.customerListInfo)
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
    activated(){
      this.getTabledata(); 
    },
  }
</script>
<style scoped lang="less">

</style>
<!-- 模板组件，用于模拟不同路由下的组件显示 -->
<template>
  <div class="box">
    <div class="box_head">
      <label>筛选：</label>
      <el-input v-model="value" placeholder="业务员" style="width:120px"></el-input>
      <el-input v-model="value1" placeholder="客户" style="width:120px;margin-left:20px;"></el-input>
      <el-input v-model="value3" placeholder="部门" style="width:120px;margin-left:20px;"></el-input>
      <el-select v-model="value4" placeholder="类型" clearable style="width:100px;margin-left:20px;">
        <el-option label="传统" value="1"></el-option>
        <el-option label="线上" value="2"></el-option>
        <el-option label="京东" value="3"></el-option>
        <el-option label="国美" value="4"></el-option>
        <el-option label="负数" value="5"></el-option>
      </el-select>
      <el-select v-model="value5" placeholder="状态" clearable style="width:100px;margin-left:20px;">
        <el-option label="待审核" value="1"></el-option>
        <el-option label="审核通过" value="10"></el-option>
        <el-option label="审核拒绝" value="9"></el-option>
      </el-select>
      <el-date-picker v-model="value2" type="daterange" format="yyyy-MM-dd" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="margin-left:20px;"></el-date-picker>
      <el-button @click="seach" style="margin-left:20px;">搜索</el-button>
    </div>

    <div class="box_content">
      <el-table
        :data="tableData"
        style="width: 100%;"
        show-summary
      >
        <el-table-column
          prop="id"
          label="编号"
          sortable
          width="80px"
        >
        </el-table-column>
        <el-table-column
          prop="dep_title"
          label="部门"
          width="100px"
        >
        </el-table-column>
        <el-table-column
          prop="user_name"
          label="业务员"
          width="100px"
        >
        </el-table-column>
        <el-table-column
          prop="customer_name"
          label="客户姓名"
        >
        </el-table-column>
        <el-table-column label="销售类型" width="80px">
          <template slot-scope="scope">
            <span v-if="scope.row.class_id == 1">传统</span>
            <span v-if="scope.row.class_id == 2">线上</span>
            <span v-if="scope.row.class_id == 3">京东</span>
            <span v-if="scope.row.class_id == 4">国美</span>
            <el-button type="text" size="mini" v-if="scope.row.class_id == 5" @click="seeFushu(scope.row.pid)">负数</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="sales_time"
          label="销售日期"
        >
        </el-table-column>
        <el-table-column
          prop="total_price"
          label="销售金额"
        >
        </el-table-column>

        <el-table-column
          label="预计利润"
          prop="li"
        >
          <template slot-scope="scope">
            <span>{{ Number(scope.row.total_price) - Number(scope.row.total_cost_price)- Number(scope.row.user_price) - Number(scope.row.logistics_price) | keepTowNum}}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="状态"
        >
          <template slot-scope="scope">
              <span v-if="scope.row.status >= 15" style="color:red">通过,已打印</span>
              <span v-if="scope.row.status == 10">审核通过</span>
              <span v-if="scope.row.status == 1"> 审核中</span>
              <el-tooltip v-if="scope.row.status == 9" class="item" effect="dark" :content="scope.row.status_txt" placement="top-start">
                <span style="color:#409EFF">审核拒绝</span>
              </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column
          prop="invoice_type"
          label="发票"
        >
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="examine(scope.row)" type="primary" size="small">{{scope.row.status == 1?'审核':'查看'}}</el-button>
          </template>  
        </el-table-column>
      </el-table>
    </div>

  </div>
</template>

<script>
import { mapActions } from "vuex";
import { watch } from 'fs';

export default {
  filters:{
      keepTowNum:function(value){
        value = Number(value);
        return value.toFixed(2)
      }
    },
  data() {
    return {
      value:'',
      value1:'',
      value2:['',''],
      value3:'',
      value4:'',
      value5:'',
      start_time:'',

      options: [
        {
          value: "",
          label: "全部"
        },
        {
          value: "人保财险",
          label: "人保财险"
        },
        {
          value: "人保寿险",
          label: "人保寿险"
        },
        {
          value: "中国人寿",
          label: "中国人寿"
        },
        {
          value: "中国太平",
          label: "中国太平"
        },
        {
          value: "新华保险",
          label: "新华保险"
        },
        {
          value: "阳光保险",
          label: "阳光保险"
        }
      ],
      options1: [
        {
          value: "1",
          label: "湖南"
        },
        {
          value: "2",
          label: "广西"
        },
        {
          value: "3",
          label: "上海"
        }
      ],
      options2: [
        {
          value: "1",
          label: "一级"
        },
        {
          value: "2",
          label: "二级"
        },
        {
          value: "3",
          label: "三级"
        }
      ],
      tableData:[], // 订单数据
    };
  },
  methods: {
    // vuex tab显示
    ...mapActions("customerList", ["triggerReplaceId"]),
    ...mapActions("Tabs", ["triggerAddTabs", "triggerSetActiveIndex"]),
    // 修改订单
    examine(a){
      //alert(a.id);
      this.triggerReplaceId(a.id);
      this.$router.push({ path: `/Finance/auditDetails/${a.id}`,params:{userId:a.id,name:`/Finance/auditDetails/${a.id}`}});
      let ins1 = {
        route: `/Finance/auditDetails/${a.id}`,
        name: "订单审核详情",
        id: a.id
      };
      let ins2 = `/Finance/auditDetails/${a.id}`;
      this.triggerAddTabs(ins1);
      this.triggerSetActiveIndex(ins2);
    },
    seeFushu(a){
      this.triggerReplaceId(a);
      this.$router.push({ path: `/Finance/auditDetails/${a}`,params:{userId:a,name:`/Finance/auditDetails/${a.id}`}});
      let ins1 = {
        route: `/Finance/auditDetails/${a}`,
        name: "订单审核详情",
        id: a
      };
      let ins2 = `/Finance/auditDetails/${a}`;
      this.triggerAddTabs(ins1);
      this.triggerSetActiveIndex(ins2);
    },
  
    getOrderList(){
      this.axios.post('/Finance/finance_order_audit_list',{
        start_time: this.start_time,
        end_time: this.start_time,
      }).then(res => {
        this.tableData = res.data;
      })
    },
    seach(){
        const loading = this.$loading({
          lock: true,
          text: '拼命加载中',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        this.axios.post('/Finance/finance_order_audit_list',{
            username:this.value,
            name:this.value1,
            start_time: this.value2[0],
            end_time: this.value2[1],
            dep_title:this.value3,
            class_id:this.value4,
            status:this.value5
          }).then(res => {
          this.tableData = res.data;
          loading.close();
          //console.log(this.customerListInfo)
        })
      },
      // 自定义合计
      getSummaries(param) {
        const { columns, data } = param;
        console.log(param)
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '总价';
            return;
          }
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                // console.log(prev)
                // console.log(curr)
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            sums[index] += ' 元';
          } else {
            sums[index] = 'N/A';
          }
        });

        return sums;
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
    getTimestamp (mytime){
            let dateTmp = mytime.replace(/-/g,'/')
            return Date.parse(dateTmp)
        },
  },
  created(){
    let d=new Date();
        let year=d.getFullYear();
        let month=this.change(d.getMonth()+1);
        let day=this.change(d.getDate());
        this.shi = year+'-'+month+'-'+day;
        this.start_time = year+'-'+month+'-'+day;
        //this.start_time = this.getTimestamp(bb)/1000;
        this.getOrderList();
  },
};
</script>
<style lang="less" scoped>
.box {
  min-width: 890px;
}
</style>

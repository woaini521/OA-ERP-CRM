<!-- 模板组件，用于模拟不同路由下的组件显示 -->
<template>
  <div class="box">
    <div>
      <el-select v-model="value2" placeholder="公司查询" filterable clearable style="width:180px;">
        <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>
      <el-select v-model="sta" placeholder="状态查询" filterable clearable style="margin-left: 10px;width:150px;">
        <el-option v-for="item in options1" :key="item.status" :label="item.status_txt" :value="item.status"></el-option>
      </el-select>
      <el-input v-model="value"  placeholder="客户名称"  @keyup.enter.native="seach" style="margin-left: 10px;width:100px;"></el-input>
      <el-input v-model="value3"  placeholder="销售员"  @keyup.enter.native="seach" style="margin-left: 10px;width:100px;"></el-input>
      <el-input v-model="value4"  placeholder="销售金额"  @keyup.enter.native="seach" style="margin-left: 10px;width:100px;"></el-input>
      <el-date-picker v-model="value1" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="margin-left: 10px;"></el-date-picker>
      <el-button @click="seach" style="margin-left:20px;">搜索</el-button>
    </div>

    <div class="box_content">
      <p style="margin-top:10px;margin-bottom:10px">未回款金额：<span style="color:red">{{ weihukuan }}</span> <span style="margin-left:20px">回款金额：{{ huikuan }}</span><span style="margin-left:20px">认款金额：{{ renkuan}}</span></p>
      <el-table :data="tableData" style="width: 100%;" show-summary>
        <el-table-column type="index" width="50px"></el-table-column>
        <el-table-column label="订单编号" width="50px">
          <template slot-scope="scope">
            <span>{{scope.row.id}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="customer_name" label="客户" width="70px"></el-table-column>
        <el-table-column prop="" label="客户电话" width="120px">
          <template slot-scope="scope">
            <span>{{scope.row.customer_working_phone}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="sales_time" label="销售日期" width="110px"></el-table-column>

        <el-table-column prop="total_price" label="总销售额">
          <template slot-scope="scope">
            <span>{{ Number(scope.row.total_price) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="total_cost_price" label="总成本">
          <template slot-scope="scope">
            <span>{{ Number(scope.row.total_cost_price) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="logistics_price" label="运费" width="60px"></el-table-column>
        <el-table-column prop="user_name" label="销售员">
          <template slot-scope="scope">
            <span>{{scope.row.dep_title}}/{{scope.row.user_name}}</span>
          </template>
        </el-table-column>

        <el-table-column prop="user_price" label="销售提成"></el-table-column>

        <el-table-column label="利润">
          <template slot-scope="scope">
            <span>{{Number(scope.row.total_price) - Number(scope.row.total_cost_price) - Number(scope.row.user_price) - Number(scope.row.logistics_price) - Number(scope.row.extra_price)| keepTowNum }}</span>
          </template>
        </el-table-column>

        <el-table-column label="状态" width="100px">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 0">草稿</span>
            <span v-if="scope.row.status == 1">已提交订单</span>
            <el-tooltip
              v-if="scope.row.status == 9"
              class="item"
              effect="dark"
              :content="scope.row.status_txt"
              placement="top-start"
            >
              <span style="color:#409EFF">审核拒绝</span>
            </el-tooltip>
            <span v-if="scope.row.status == 10">财务通过</span>
            <span v-if="scope.row.status == 15">已打印信息</span>
            <span v-if="scope.row.status == 20">采购完成</span>
            <span v-if="scope.row.status == 30">预付款处理</span>
            <span v-if="scope.row.status == 40">等待发货</span>
            <span v-if="scope.row.status == 50">全部收到货等开票</span>
            <span v-if="scope.row.status == 60">开过票</span>
            <span v-if="scope.row.status == 70">认过款项</span>
            <span v-if="scope.row.status == 90">结束</span>
            <span v-if="scope.row.status == 999">作废</span>
            <br>
            <span v-if="scope.row.status != 9" style="color:red;">{{scope.row.status_txt}}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button @click="See(scope.row)" type="primary" size="small">查看</el-button>
            <el-button
              @click="edit(scope.row)"
              v-if="scope.row.status <= 15"
              type="info"
              size="small"
            >修改</el-button>
            <el-button
              @click="deletes(scope.row)"
              v-if="scope.row.status <= 10"
              type="danger"
              size="small"
            >作废</el-button>

            <el-button
              @click="afterSale(scope.row)"
              v-if="scope.row.status >= 30"
              type="primary"
              size="small"
            >售后</el-button>
            <el-button
              @click="additional(scope.row)"
              v-if="scope.row.status >= 10"
              type="primary"
              size="small"
            >额外费用</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="额外费用" :visible.sync="dialogAdditional">
      <el-form :model="AdditionalForm">
        <el-form-item label="费用" label-width="90px">
          <el-input v-model="AdditionalForm.money" style="width:217px;"></el-input>
        </el-form-item>
        <el-form-item label="备注" label-width="90px">
          <el-input type="textarea" v-model="AdditionalForm.remark" style="width:217px;"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAdditional = false">取 消</el-button>
        <el-button type="primary" @click="AddAdditional">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  filters: {
    keepTowNum: function(value) {
      value = Number(value);
      return value.toFixed(2);
    }
  },
  data() {
    return {
      starttime:'',
      value: "",
      value1: null,
      value2: "",
      value3: "",
      value4:'',
      sta:'',
      options: [],
      options1:[],

      tableData: [], // 订单数据
      currentPage: 0, //当前页
      total: 0, //总数
      per_page: 0, //每页多少条
      last_page: 0, //总页数

      AdditionalForm: {
        // 额外费用表单
        money: "",
        remark: "",
        id: ""
      },
      dialogAdditional: false, // 额外费用弹窗
      weihukuan:'',
      huikuan:'',
      renkuan:'',
    };
  },
  methods: {
    // vuex tab显示
    ...mapActions("customerList", ["triggerReplaceId"]),
    ...mapActions("Tabs", ["triggerAddTabs", "triggerSetActiveIndex"]),
    // 搜索订单
    seach() {
      const loading = this.$loading({
        lock: true,
        text: "拼命加载中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      if (this.value1 == null) {
        this.axios
          .post("/crm.Order/order_list", {
            name: this.value,
            company_id: this.value2,
            user_name:this.value3,
            status:this.sta,
            start_time: '',
            end_time: '',
            total_price:this.value4,
          })
          .then(res => {
            this.tableData = res.data.order;
            this.options1 = res.data.order_status;
            if(res.data.order_receivables != null ){
              this.weihukuan = res.data.order_receivables.total_price;
            }else{
              this.weihukuan = '0';
            }
            loading.close();
          });
      } else {
        this.axios
          .post("/crm.Order/order_list", {
            name: this.value,
            company_id: this.value2,
            user_name:this.value3,
            status:this.sta,
            start_time: this.value1[0],
            end_time: this.value1[1],
            total_price:this.value4,
          })
          .then(res => {
            this.tableData = res.data.order;
            this.options1 = res.data.order_status;
            if(res.data.order_receivables != null ){
              this.weihukuan = res.data.order_receivables.total_price;
            }else{
              this.weihukuan = '0';
            }
            loading.close();
          });
      }
    },
    // 修改订单
    edit(a) {
      this.triggerReplaceId(a.id);
      this.$router.push({
        path: `/crm/Order/editOrder/${a.id}`,
        params: { userId: a.id, name: `/crm/Order/editOrder/${a.id}` }
      });
      let ins1 = {
        route: `/crm/Order/editOrder/${a.id}`,
        name: "修改订单",
        id: a.id
      };
      let ins2 = `/crm/Order/editOrder/${a.id}`;
      this.triggerAddTabs(ins1);
      this.triggerSetActiveIndex(ins2);
    },

    // 查看 订单详情
    See(a) {
      this.triggerReplaceId(a.id);
      this.$router.push({
        path: `/crm/Order/seeOrder/${a.id}`,
        params: { userId: a.id }
      });
      let ins1 = {
        route: `/crm/Order/seeOrder/${a.id}`,
        name: "查看订单",
        id: a.id
      };
      let ins2 = `/crm/Order/seeOrder/${a.id}`;
      this.triggerAddTabs(ins1);
      this.triggerSetActiveIndex(ins2);
    },

    // 删除订单
    deletes(a) {
      this.axios
        .post("/crm.Order/order_delete", {
          id: a.id
        })
        .then(res => {
          if (res.data.code == 2000) {
            this.open(res.data.msg, "success");
            this.getOrderList();
          } else {
            this.open(res.data.msg, "error");
          }
        });
    },
    getOrderList() {
      const loading = this.$loading({
        lock: true,
        text: "拼命加载中……",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      this.axios.post("/crm.Order/order_list",{
        start_time:this.starttime,
        end_time:this.starttime
      }).then(res => {
        this.options = res.data.company;
        this.tableData = res.data.order;
        this.options1 = res.data.order_status;
        if(res.data.order_receivables != null ){
              this.weihukuan = res.data.order_receivables.total_price;
              this.huikuan = res.data.order_receivables.total_price_day;
              this.renkuan = res.data.order_receivables.total_price_day_order;
            }else{
              this.weihukuan = '0';
              this.huikuan = '0';
              this.renkuan = '0';
            }
        loading.close();
      });
    },
    // 售后按钮
    afterSale(a) {
      this.triggerReplaceId(a.id);
      this.$router.push({
        path: `/crm/Order/afterSale/${a.id}`,
        params: { userId: a.id }
      });
      let ins1 = {
        route: `/crm/Order/afterSale/${a.id}`,
        name: "售后",
        id: a.id
      };
      let ins2 = `/crm/Order/afterSale/${a.id}`;
      this.triggerAddTabs(ins1);
      this.triggerSetActiveIndex(ins2);
    },
    // 额外费用按钮
    additional(a) {
      this.dialogAdditional = true;
      this.AdditionalForm.money = "";
      this.AdditionalForm.remark = "";
      this.AdditionalForm.id = a.id;
    },
    //
    AddAdditional() {
      this.axios
        .post("/crm.Order/order_list_extra_add", {
          money: this.AdditionalForm.money,
          remarks: this.AdditionalForm.remark,
          customer_order_id: this.AdditionalForm.id
        })
        .then(res => {
          if (res.data.code == 2000) {
            this.open(res.data.msg, "success");
            this.getOrderList();
            this.dialogAdditional = false;
          } else {
            this.open(res.data.msg, "error");
          }
        });
    },

    // 公用弹窗
    open(a, b) {
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
  created() {
      let d=new Date();
      let year=d.getFullYear();
      let month=this.change(d.getMonth()+1);
      let day=this.change(d.getDate());
      this.starttime = year+'-'+month+'-'+day;
      this.getOrderList();
  },
};
</script>
<style lang="less" scoped>
.box{
  min-width: 1000px;
}
</style>

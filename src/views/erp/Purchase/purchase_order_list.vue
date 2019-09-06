<!-- 模板组件，用于模拟不同路由下的组件显示 -->
<template>
  <div class="box">
    <div>
      <label>筛选：</label>
      <el-date-picker
        v-model="time"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        value-format="timestamp"
        end-placeholder="结束日期"
      ></el-date-picker>
      <el-input v-model="value" style="width:130px;margin-left:10px;" placeholder="业务员姓名"></el-input>
      <el-input v-model="value1" style="width:130px;margin-left:10px;" placeholder="客户姓名"></el-input>
      <el-input v-model="value2" style="width:130px;margin-left:10px;" placeholder="订单编号"></el-input>
      <el-input v-model="value3" style="width:130px;margin-left:10px;" placeholder="采购员"></el-input>
      <el-button type="primary" @click="seach" style="margin-left:20px">搜索</el-button>
    </div>

    <div class="box_content">
      <el-table :data="tableData" style="width: 100%;" show-summary>
        <el-table-column prop="id" label="订单编号" width="80px"></el-table-column>
        <el-table-column label="业务员" width="150px">
          <template slot-scope="scope">
            <span>{{scope.row.dep_title}} {{scope.row.user_name}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="customer_name" label="客户姓名" width="80px"></el-table-column>
        <el-table-column prop="sales_time" label="销售日期"></el-table-column>
        <el-table-column prop="total_price" label="销售金额"></el-table-column>
        <el-table-column prop="purchase_money" label="采购金额"></el-table-column>
        <el-table-column prop="commission_users" label="采购"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 0">草稿</span>
            <span v-if="scope.row.status == 1">已经提交订单</span>
            <span v-if="scope.row.status == 10">财务审核完毕</span>
            <span v-if="scope.row.status == 15">已打单</span>
            <span v-if="scope.row.status == 20">采购设置完成</span>
            <span v-if="scope.row.status == 30">预付款处理中</span>
            <span v-if="scope.row.status == 40">等待发货</span>
            <span v-if="scope.row.status == 50">全部发完后变</span>
            <span v-if="scope.row.status == 60">全部收到货 等开票</span>
            <span v-if="scope.row.status == 70">开完票后等回款</span>
            <span v-if="scope.row.status == 90">结束</span>
            <span v-if="scope.row.status == 999">作废</span>
          </template>
        </el-table-column>
        <el-table-column label="发票">
          <template slot-scope="scope">
            <span>{{ scope.row.invoice_tax ==0 ?'收据':'增值' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status == 10 || scope.row.status == 15"
              @click="examine(scope.row)"
              type="danger"
              size="small"
            >采购</el-button>
            <el-button
              v-if="15 < scope.row.status && scope.row.status < 90"
              @click="SeeExamine(scope.row)"
              type="text"
              size="small"
            >查看</el-button>
            <!-- <el-button v-if="15 < scope.row.status && scope.row.status < 90" type="text" size="small" @click="daochu(scope.row)">导出</el-button> -->
            <span v-if="scope.row.status == 90">结束</span>
            <span v-if="scope.row.status == 999">已作废</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { format } from "path";

export default {
  data() {
    return {
      value: "", //搜索
      value1: "",
      value2: "",
      value3: "",
      time: null,
      tableData: [], // 订单数据

      list: [],
      liebiao: [] // 导出数据表格
    };
  },
  methods: {
    // vuex tab显示
    ...mapActions("customerList", ["triggerReplaceId"]),
    ...mapActions("Tabs", ["triggerAddTabs", "triggerSetActiveIndex"]),

    // 采购订单
    examine(a) {
      this.triggerReplaceId(a.id);
      this.$router.push({
        path: `/erp/Purchase/Purchaseorder/${a.id}`,
        params: { userId: a.id, name: `/erp/Purchase/Purchaseorder/${a.id}` }
      });
      let ins1 = {
        route: `/erp/Purchase/Purchaseorder/${a.id}`,
        name: "采购详情",
        id: a.id
      };
      let ins2 = `/erp/Purchase/Purchaseorder/${a.id}`;
      this.triggerAddTabs(ins1);
      this.triggerSetActiveIndex(ins2);
    },

    // 获取列表数据
    getOrderList(a) {
      const loading = this.$loading({
        lock: true,
        text: "拼命加载中……",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      this.axios
        .post("/erp.purchase/purchase_order_list", {
          start_time: a,
          end_time: a
        })
        .then(res => {
          this.tableData = res.data;
          loading.close();
        });
    },

    // 查看
    SeeExamine(a) {
      this.triggerReplaceId(a.id);
      this.$router.push({
        path: `/erp/Purchase/seePurchase/${a.id}`,
        params: { userId: a.id, name: `/erp/Purchase/seePurchase/${a.id}` }
      });
      let ins1 = {
        route: `/erp/Purchase/seePurchase/${a.id}`,
        name: "采购查看",
        id: a.id
      };
      let ins2 = `/erp/Purchase/seePurchase/${a.id}`;
      this.triggerAddTabs(ins1);
      this.triggerSetActiveIndex(ins2);
    },
    seach() {
      let a, b;
      const loading = this.$loading({
        lock: true,
        text: "拼命加载中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      if (this.time == null) {
        a = "";
        b = "";
      } else {
        a = this.time[0] / 1000;
        b = this.time[1] / 1000;
      }
      this.axios
        .post("/erp.purchase/purchase_order_list", {
          start_time: a,
          end_time: b,
          user_name: this.value,
          id: this.value2,
          customer_name: this.value1,
          commission_name: this.value3
        })
        .then(res => {
          this.tableData = res.data;
          loading.close();
        });
    },
    // 导出数据
    daochu(a) {
      let arr = [];
      let sku = [];
      this.axios
        .get("/erp.Purchase/purchase_order_product_sku_select?id=" + a.id)
        .then(res => {
          sku = res.data.product_sku;
        });
      this.axios
        .get("/erp.Purchase/purchase_order_address_product_select?id=" + a.id)
        .then(res => {
          let B = res.data.address;
          var abjArr = [];
          for (let i1 = 0; i1 < B.length; i1++) {
            //address
            for (let i2 = 0; i2 < B[i1].purchase.length; i2++) {
              //purchase
              for (let i3 = 0; i3 < B[i1].purchase[i2].product.length; i3++) {
                //product:
                // obj['gy']= B[i1].purchase[i2].product;
                let obj = new Object();
                obj["address_name"] = B[i1].name;
                obj["address_phone"] = B[i1].phone;
                obj["address_city"] = B[i1].city;
                obj["address_county"] = B[i1].county;
                obj["address_address"] = B[i1].address;
                obj["address_id"] = B[i1].customer_address_id;
                obj["delivery"] = B[i1].delivery;
                obj["payment"] = B[i1].payment;
                let shuju = B[i1].purchase[i2].product;
                obj["supplier_id"] = shuju[i3].supplier_id;
                obj["customer_order_product_sku_id"] =
                  shuju[i3].customer_order_product_sku_id;
                let aa = `${shuju[i3].customer_order_product_sku_id}`;
                arr.push(aa);
                // cosole.log(arr);
                (obj["supplier_id"] = shuju[i3].supplier_id),
                  (obj["supplier_name"] = shuju[i3].supplier_name),
                  (obj[
                    "supplier_address"
                  ] = `${shuju[i3].supplier_province}${shuju[i3].supplier_city}${shuju[i3].supplier_county}`),
                  (obj[aa] = shuju[i3].number);
                // console.log(shuju[i3].number);
                // cc[aa] = shuju[i3].number;
                // Object.assign(cc, obj);
                abjArr.push(obj);
              }
            }
          }

          //  console.log(abjArr)
          // 数组=地址  供应商 产品
          var arr1 = {};
          for (let item = 0; item < abjArr.length; item++) {
            //数组不存在
            let bb = abjArr[item]; // v
            // console.log(bb)
            if (!arr1[`${bb.address_id}${bb.supplier_id}`]) {
              arr1[`${bb.address_id}${bb.supplier_id}`] = bb;
            } else {
              //console.log(sku)
              for (let id = 0; id < sku.length; id++) {
                let cc = sku[id]; // v1s

                if (arr1[`${bb.address_id}${bb.supplier_id}`]) {
                  // console.log(`${bb.address_id}${bb.supplier_id}`)
                  if (arr1[`${bb.address_id}${bb.supplier_id}`][`${cc.id}`]) {
                    // console.log(arr1[`${bb.address_id}${bb.supplier_id}`][`${bb.customer_order_product_sku_id}`]+'------1');

                    //console.log(bb.customer_order_product_sku_id+'-------'+cc.id)
                    // console.log(bb[`${cc.id}`]+'------2');

                    arr1[`${bb.address_id}${bb.supplier_id}`][`${cc.id}`] +=
                      bb[`${cc.id}`];
                  } else {
                    //            arr1[`${bb.address_id}${bb.supplier_id}`][`${bb.customer_order_product_sku_id}`] = arr1[`${bb.address_id}${bb.supplier_id}`][`${cc.id}`]
                  }
                }
              }
            }
            // console.log(arr1)
            //产品的组合数组存在

            //   //判断组合唯一值是否存在
            //   if($v[address_id+supplier_id+$v1.id]){
            //     if(arr[address_id+supplier_id][$v.id]){
            //       //本身有值 数量相加
            //      arr[address_id+supplier_id][$v.name+$v.sku_name]= arr[address_id+supplier_id][$v.id]+$v[address_id+supplier_id+$v1.id]
            //      }else{
            //        //没有值 直接赋值
            //         arr[address_id+supplier_id][$v.id]=$v[address_id+supplier_id+$v1.id]
            //      }
            //   }
          }
          // var record = {};
          // this.list.forEach(function(val){
          //     if(val.supplier_id in record && val.supplier_id in record){
          //         Object.assign(val)
          //         record[val.supplier_id].push(val)

          //     }else{
          //         record[val.supplier_id] = [val]
          //     }
          // })
          // console.log(record)
          // adderess_id=0
          // supplier_id=0
          // sku_id=0
          // console.log(arr1)
          for (let key in arr1) {
            this.liebiao.push(arr1[key]);
          }
        });

      // console.log(this.liebiao)
      require.ensure([], () => {
        const {
          export_json_to_excel
        } = require("@/assets/vendor/Export2Excel");
        let tHeader = [
          "收货人",
          "电话",
          "省",
          "市",
          "区",
          "具体地址",
          "付款方式",
          "送货方式",
          "供应商",
          "供应商省份",
          "供应商市",
          "供应商区",
          "是否含票"
        ];
        let filterVal = [
          "address_name",
          "address_phone",
          "address_province",
          "address_city",
          "address_county",
          "address_address",
          "payment",
          "delivery",
          "supplier_name",
          "supplier_address",
          "transfer"
        ];

        this.axios
          .get("/erp.Purchase/purchase_order_product_sku_select?id=" + a.id)
          .then(res => {
            let A = res.data.product_sku;

            for (let z = 0; z < A.length; z++) {
              let name = `${A[z].name}${A[z].sku_name}${A[z].class_name}`;
              tHeader.unshift(name);
              filterVal.unshift(arr[z]);
              // console.log(filterVal);
            }

            const list = this.liebiao;
            const data = this.formatJson(filterVal, list);
            export_json_to_excel(tHeader, data, "数据");
          });
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },
    // 公用弹窗
    open(a, b) {
      this.$message({
        message: a,
        type: b
      });
    },
    // 默认时间
    change(t) {
      if (t < 10) {
        return "0" + t;
      } else {
        return t;
      }
    },
    getTimestamp(mytime) {
      let dateTmp = mytime.replace(/-/g, "/");
      return Date.parse(dateTmp);
    }
  },
  created() {
    let d = new Date();
    let year = d.getFullYear();
    let month = this.change(d.getMonth() + 1);
    let day = this.change(d.getDate());
    let starttime = year + "-" + month + "-" + day;
    starttime = this.getTimestamp(starttime) / 1000;
    this.getOrderList(starttime);
  }
  // watch:{
  //   $route(to){
  //     this.getOrderList();
  //   }
  // }
};
</script>
<style lang="less" scoped>
.box {
  min-width: 890px;
  .box_head {
    margin-top: 20px;
  }
}
</style>

<!-- 模板组件，用于模拟不同路由下的组件显示 -->
<template>
  <div class="box">
    <div>
      <label>筛选：</label>
      <el-select
        v-model="value"
        placeholder="请选择"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <el-select
        v-model="value1"
        collapse-tags
        style="margin-left: 20px;"
        placeholder="请选择"
      >
        <el-option
          v-for="item in options1"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <el-select
        v-model="value2"
        collapse-tags
        style="margin-left: 20px;"
        placeholder="请选择"
      >
        <el-option
          v-for="item in options2"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </div>

    <div class="box_content">
      <el-table
        :data="tableData"
        height="318"
      >
        <el-table-column
          prop="companyName"
          label="企业名称"
          fixed
        >
        </el-table-column>
        <el-table-column
          prop="abbreviation"
          label="简称"
        >
        </el-table-column>
        <el-table-column
          prop="province"
          label="省份"
        >
        </el-table-column>
        <el-table-column
          prop="city"
          label="市区"
        >
        </el-table-column>
        <el-table-column
          prop="address"
          label="县/区"
        >
        </el-table-column>
        <el-table-column
          prop="customer"
          label="客户数"
        >
        </el-table-column>
        <el-table-column
          prop="order"
          label="订单数"
        >
        </el-table-column>
        <el-table-column
          prop="contact"
          label="月联系"
        >
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
          <el-button
            @click.native="deleteRow(scope.row)"
            type="text"
            size="small"
          >
            查看
          </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-table
        :data="customerInfo"
        style="width: 100%;margin-top:40px;text-align: center;"
        border
      >
        <el-table-column
          prop="customerName"
          label="姓名"
          fixed
        >
        </el-table-column>
        <el-table-column
          prop="customerSex"
          label="性别"
          width="50"
        >
        </el-table-column>
        <el-table-column
          prop="customerBumen"
          label="部门"
        >
        </el-table-column>
        <el-table-column
          prop="customerZhiwei"
          label="职位"
        >
        </el-table-column>
        <el-table-column
          prop="customerAge"
          label="年龄"
          width="50"
        >
        </el-table-column>
        <el-table-column
          prop="customerBrith"
          label="生日"
        >
        </el-table-column>
        <el-table-column
          prop="customerPhone"
          label="手机号"
        >
        </el-table-column>
        <el-table-column
          prop="customerZphone"
          label="座机号码"
        >
        </el-table-column>
        <el-table-column
          prop="customerJibie"
          label="客户级别"
        >
        </el-table-column>
        <el-table-column
          prop="customerXiadan"
          label="最后下单"
        >
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
          <el-button
            @click.native="update(scope.row)"
            type="text"
            size="small"
          >
            更新
          </el-button>
          </template>
        </el-table-column>

      </el-table>
    </div>

    <el-dialog
      title="修改信息"
      :visible.sync="dialogFormVisible"
      width="70%"
    >
      <el-form :model="form" :inline="true">
        <el-form-item
          label="姓名"
          :label-width="formLabelWidth"
         
        >
          <el-input
            style="width:180px"
            v-model="form.customerName"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="性别"
          :label-width="formLabelWidth"
        
        >
          <el-select
            v-model="form.customerSex"
            placeholder="性别"
            style="width:180px"
          >
            <el-option
              label="男"
              value="男"
            ></el-option>
            <el-option
              label="女"
              value="女"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="部门"
          :label-width="formLabelWidth"
        >
          <el-input
            style="width:180px"
            v-model="form.customerBumen"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="职位"
          :label-width="formLabelWidth"
        
        >
          <el-input
            style="width:180px"
            v-model="form.customerZhiwei"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="年龄"
          :label-width="formLabelWidth"
        
        >
          <el-input
            style="width:180px"
            v-model="form.customerAge"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="生日"
          :label-width="formLabelWidth"
        
        >
          <el-date-picker
            type="date"
            placeholder="选择日期"
            v-model="form.customerBrith"
            style="width: 180px;"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item
          label="手机"
          :label-width="formLabelWidth"
        
        >
          <el-input
            style="width:180px"
            v-model="form.customerPhone"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="座机"
          :label-width="formLabelWidth"
        
        >
          <el-input
            style="width:180px"
            v-model="form.customerZphone"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="级别"
          :label-width="formLabelWidth"
        
        >
           <el-select
            v-model="form.customerJibie"
            placeholder="性别"
            style="width:180px"
          >
            <el-option
              label="合作客户"
              value="合作客户"
            ></el-option>
            <el-option
              label="意向客户"
              value="意向客户"
            ></el-option>
            <el-option
              label="普通客户"
              value="普通客户"
            ></el-option>
            <el-option
              label="已离职"
              value="已离职"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          label="最后下单"
          label-width="80px"
        >
          <el-date-picker
            type="date"
            placeholder="选择日期"
            v-model="form.customerXiadan"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            style="width: 180px;"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="dialogFormVisible = false"
        >确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
export default {
  data() {
    return {
      // 筛选数据
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
      value: "",//筛选
      value1: "",
      value2: "",
      tableData: [],
      customerInfo: [],
      dialogFormVisible: false,
      // 二级弹窗表单
      form: {
        customerName: "",
        customerSex: "",
        customerBumen: "",
        customerZhiwei: "",
        customerAge: "",
        customerBrith: "",
        customerPhone: "",
        customerZphone: "",
        customerJibie: "",
        customerXiadan: ""
      },
      formLabelWidth: "50px"
    }
  },
  methods: {
    deleteRow() {
      this.axios.get("/api/customerInfo.json").then(res => {
        this.customerInfo = res.data.data;
      });
    },
    update(a) {
      this.dialogFormVisible=true;
      this.form = a;
    }
  },
  created() {
    this.axios.get("/api/tableData.json").then(res => {
      this.tableData = res.data.data;
    });
  },
  
};
</script>
<style scoped lang="less">
.box_content {
  margin-top: 20px;
  table {
    text-align: center;
  }
}
.el-dialog{
  width: 700px;
}
</style>

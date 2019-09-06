<!-- 模板组件，用于模拟不同路由下的组件显示 -->
<template>
  <div class="box">
    <div class="box_head">
      <div class="box_head_left">
        <label>筛选：</label>
        <el-button @click="aaaa">选择机构</el-button>
        <el-button @click="bbbb">清空选择</el-button>
        <el-select
          v-model="value1"
          collapse-tags
          clearable
          style="margin-left: 20px;width:120px;"
          placeholder="请选择"
          @change="retrievalCity"
        >
          <el-option
            v-for="item in province"
            :key="item.id"
            :label="item.value"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-select
          v-model="value2"
          collapse-tags
          clearable
          style="margin-left: 20px;width:120px;"
          placeholder="请选择"
          @change="retrievalJibie"
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
      <div class="box_head_right">
        <el-form
          :inline="true"
          :model="form"
          class="demo-form-inline"
        >
          <el-form-item>
            <el-input
              v-model="form.name"
              placeholder="姓名"
              style="width:100px;"
              clearable
              @keyup.enter.native="character"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="form.phone"
              placeholder="手机号"
              clearable
              @keyup.enter.native="character"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="character">搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <el-dialog title="客户公司" :visible.sync="dialogTableVisible" width="60%">
      <el-input v-model="search" placeholder="请输入内容" style="width:217px;margin-left:10px"></el-input>
      <el-table :data="Customercompany.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))" height="450px">
        <el-table-column label="名称" prop="name" width="350px"></el-table-column>
        <el-table-column label="级别" align="center" sortable prop="level" width="180px">
          <template slot-scope="scope">
            <span v-if="scope.row.level == 1">一级机构</span>
            <span v-if="scope.row.level == 2">二级机构</span>
            <span v-if="scope.row.level == 3">三级机构</span>
            <span v-if="scope.row.level == 4">四级机构</span>
            <span v-if="scope.row.level == 5">五级机构</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button @click="xuanze(scope.row.id)" size="mini">选择</el-button>
          </template>
        </el-table-column>
        
      </el-table>
    </el-dialog>
    <el-table :data="customerListInfo">
      <el-table-column label="姓名" prop="name" width="80px"></el-table-column>
      <el-table-column label="公司" prop="company_name"></el-table-column>
      <el-table-column label="职位" prop="position"  width="170px"></el-table-column>
      <el-table-column label="部门" prop="department"  width="130px"></el-table-column>
      <el-table-column label="电话" prop="working_phone" width="120px"></el-table-column>
      <el-table-column label="合作" prop="customer_order_count" width="50px">
        <template slot-scope="scope">
          <span style="color:red" v-if="scope.row.customer_order_count>0">{{ scope.row.customer_order_count }}</span>
          <span v-else>{{ scope.row.customer_order_count }}</span>
        </template>
      </el-table-column>
       <el-table-column label="级别" width="100px">
         <template slot-scope="scope">
           <span v-if="scope.row.level == ''">未分配</span>
           <span v-if="scope.row.level == 1">一般客户</span>
           <span v-if="scope.row.level == 2">意向客户</span>
           <span v-if="scope.row.level == 3">合作客户</span>
           <span v-if="scope.row.level == 9">不联系</span>
         </template>
       </el-table-column>
      
      <el-table-column label="操作" width="280px">
          <template slot-scope="scope">
            <el-button
                type="primary"
                size="mini"
                @click="lianxi(scope.row)"
              >联系</el-button>
              <el-button
                type="primary"
                size="mini"
                @click="gengxin(scope.row)"
              >更新</el-button>
              <el-button
                type="primary"
                size="mini"
                @click="dingdan(scope.row)"
              >订单</el-button>
              <el-button
                type="primary"
                size="mini"
                @click="address(scope.row)"
              >地址</el-button>
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
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  data() {
    return {
      Customercompany: [
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
      province: "",
      value: "", //筛选
      value1: "",
      value2: "",
      form: {
        name: "",
        phone: ""
      },
      customerListInfo: [],
      currentPage:0,//当前页
      total:0,//总数
      per_page:0,//每页多少条
      last_page:0,//总页数
      dialogTableVisible:false,
      search:'',
    };
  },
  methods: {
    ...mapActions("customerList", ["triggerReplaceId"]),
    ...mapActions("Tabs", ["triggerAddTabs", "triggerSetActiveIndex"]),
    aaaa(){
      this.dialogTableVisible = true
    },
    bbbb(){
      this.value = '';
      this.search = '';
      this.retrieval(this.value);
    },
    xuanze(a){
      this.retrieval(a);
      this.value = a;
      this.dialogTableVisible = false;
    },
    lianxi(a) {
      this.triggerReplaceId(a);
      this.$router.push({ path: `/CRM/Customer/lianxi/${a.id}` });
      let ins1 = {
        route: `/CRM/Customer/lianxi/${a.id}`,
        name: "联系记录",
        id: a.id
      };
      let ins2 = `/CRM/Customer/lianxi/${a.id}`;
      this.triggerAddTabs(ins1);
      this.triggerSetActiveIndex(ins2);
    },
    gengxin(a) {
      this.triggerReplaceId(a.id);
      this.$router.push({ path: `/CRM/Customer/gengxin/${a.id}`,params:{userId:a.id}});
      let ins1 = {
        route: `/CRM/Customer/gengxin/${a.id}`,
        name: "更新记录",
        id: a.id
      };
      let ins2 = `/Customer/gengxin/${a.id}`;
      this.triggerAddTabs(ins1);
      this.triggerSetActiveIndex(ins2);
    },
    dingdan(a) {
      this.triggerReplaceId(a.id);
      this.$router.push({ path: `/CRM/Customer/dingdan/${a.name}`});
      let ins1 = {
        route: `/CRM/Customer/dingdan/${a.name}`,
        name: "订单详情",
        id: a.name
      };
      let ins2 = `/Customer/dingdan/${a.name}`;
      this.triggerAddTabs(ins1);
      this.triggerSetActiveIndex(ins2);
    },
    address(a) {
      this.triggerReplaceId(a.id);
      this.$router.push({ path: `/CRM/Customer/address/${a.id}`,params:{userId:a.id}});
      let ins1 = {
        route: `/CRM/Customer/address/${a.id}`,
        name: "收货地址",
        id: a.id
      };
      let ins2 = `/CRM/Customer/address/${a.id}`;
      this.triggerAddTabs(ins1);
      this.triggerSetActiveIndex(ins2);
    },
    See(a){
      // 原本为see 点击客户头像 查看用户
      this.triggerReplaceId(a.id);
      this.$router.push({ path: `/CRM/Customer/gengxin/${a.id}`,params:{userId:a.id} });
      let ins1 = {
        route: `/CRM/Customer/gengxin/${a.id}`,
        name: "更新记录",
        id: a.id
      };
      let ins2 = `/CRM/Customer/gengxin/${a.id}`;
      this.triggerAddTabs(ins1);
      this.triggerSetActiveIndex(ins2);
    },
    handleCurrentChange(val) {
        const loading = this.$loading({
          lock: true,
          text: '拼命加载中',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        this.axios.post('/crm.Customer/customer_list',{
            page:val,
            company_id:this.value,
            name:this.form.name,
            phone:this.form.phone
          }).then(res => {
          this.customerListInfo = res.data.customer.data;
          this.currentPage = res.data.customer.current_page;
          this.total = res.data.customer.total;
          this.per_page = res.data.customer.per_page;
          this.last_page = res.data.customer.last_page;
          loading.close();
        })  
      },
    getData(){
      this.axios.get('/crm.Customer/customer_list').then(res => {
        this.customerListInfo = res.data.customer.data;
        this.currentPage = res.data.customer.current_page;
        this.total = res.data.customer.total;
        this.per_page = res.data.customer.per_page;
        this.last_page = res.data.customer.last_page;
        // console.log(this.customerListInfo)
        // loading.close();
      })
    },
    // 公司下拉框
    getCustomer(){
          this.axios.get('/crm.Customer/company_list').then(res => {
         // this.Customercompany = res.data.company
          let Customercompany = res.data.company
          for(let i=0;i<Customercompany.length;i++){
            let ins = {
                name:`${Customercompany[i].name}`,
                id:Customercompany[i].id,
                level:Customercompany[i].level,
            }
                  this.Customercompany.push(ins);
            if(Customercompany[i].hasOwnProperty('child')){
              for(let z=0;z<Customercompany[i].child.length;z++){
                  let ins1 = {
                      name:`　${Customercompany[i].child[z].name}`,
                      id:Customercompany[i].child[z].id,
                      level:Customercompany[i].child[z].level,
                  }
                  this.Customercompany.push(ins1);
                  if(Customercompany[i].child[z].hasOwnProperty('child')){
                    for(let y = 0; y < Customercompany[i].child[z].child.length; y++){
                      let ins2 = {
                        name:`　　${Customercompany[i].child[z].child[y].name}`,
                        id:Customercompany[i].child[z].child[y].id,
                        level:Customercompany[i].child[z].child[y].level,
                      }
                      this.Customercompany.push(ins2);
                      if(Customercompany[i].child[z].child[y].hasOwnProperty('child')){
                        for(let e = 0; e < Customercompany[i].child[z].child.length; e++){
                          if(Customercompany[i].child[z].child[y].child[e] == undefined){

                          }else{
                            let ins3 = {
                              name:`　　　${Customercompany[i].child[z].child[y].child[e].name}`,
                              id:Customercompany[i].child[z].child[y].child[e].id,
                              level:Customercompany[i].child[z].child[y].child[e].level,
                            }
                            this.Customercompany.push(ins3);
                          }
                          
                          
                        }
                      }
                    }
                  }  
                }
              }
          }
         // console.log(this.Customercompany);
        })
      },
    // 获取省
    getCityData:function(){
        var that = this
        that.axios.get("./api/map.json").then(function(response){
          if (response.status==200) {
            var data = response.data;
            that.province = [];
            // 省市区数据分类
            for (var item in data) {
              if (item.match(/0000$/)) {//省
                that.province.push({id: item, value: data[item], children: []});
              } 
            } 
          }
          else{
            //console.log(response.status)
          }
          })
        // .catch(function(error){console.log(typeof+ error)})
      },
    age(a){
      // console.log(a);
        let b = a.substring(0,4);
        let ri = new Date();
      //  console.log(ri);
        let year = ri.getFullYear();
        return Number(year)-Number(b);
    },
    // 公司检索
    retrieval(a){
      const loading = this.$loading({
          lock: true,
          text: '拼命加载中',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
      this.axios.post('/crm.Customer/customer_list',{
            company_id:a
        }).then(res => {
          loading.close();
          this.customerListInfo = res.data.customer.data;
          this.currentPage = res.data.customer.current_page;
          this.total = res.data.customer.total;
          this.per_page = res.data.customer.per_page;
          this.last_page = res.data.customer.last_page;
        })
    },
    // 地方检索
    retrievalCity:function(value){
        const loading = this.$loading({
          lock: true,
          text: '拼命加载中',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
       this.axios.post('/crm.Customer/customer_list',{
            province:value
        }).then(res => {
           loading.close();
          this.customerListInfo = res.data.customer.data;
          this.currentPage = res.data.customer.current_page;
          this.total = res.data.customer.total;
          this.per_page = res.data.customer.per_page;
          this.last_page = res.data.customer.last_page;
        })
    },
    // 级别检索
    retrievalJibie:function(value){
       const loading = this.$loading({
          lock: true,
          text: '拼命加载中',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
      this.axios.post('/crm.Customer/customer_list',{
            level:value
        }).then(res => {
          loading.close();
          this.customerListInfo = res.data.customer.data;
          this.currentPage = res.data.customer.current_page;
          this.total = res.data.customer.total;
          this.per_page = res.data.customer.per_page;
          this.last_page = res.data.customer.last_page;
        })
    },
    //人物检索
    character(){
       const loading = this.$loading({
          lock: true,
          text: '拼命加载中',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
      this.axios.post('/crm.Customer/customer_list',{
            company_id:this.value,
            name:this.form.name,
            phone:this.form.phone
        }).then(res => {
          loading.close();
          this.customerListInfo = res.data.customer.data;
          this.currentPage = res.data.customer.current_page;
          this.total = res.data.customer.total;
          this.per_page = res.data.customer.per_page;
          this.last_page = res.data.customer.last_page;
        })
    },
  },
  created() {
    this.$nextTick(()=>{
        this.getData();
        this.getCustomer();
        this.getCityData();
    })
  },
  // watch: {
	// 	  $route(){
	// 		  this.$nextTick(()=>{
  //           this.getData();
  //       })
	// 	  }
	//   }
}
</script>
<style scoped lang="less">
.box{
  min-width: 1100px;
  overflow: hidden;
  .box_head {
    overflow: hidden;
    width: 100%;
    min-width: 890px;
    .box_head_left {
      float: left;
      label {
        margin-right: 5px;
      }
    }
    .box_head_right {
      float: right;
    }
  }
  .box_content {
    width: 100%;
    min-width: 890px;
    .InfoInner {
      height: 120px;
      border: 1px solid rgb(242, 242, 242);
      margin-top: 10px;
      border-radius: 10px;
      .InfoInnerLeft {
        .InfoInnerLeftImg {
          float: left;
          margin-top: 10px;
          margin-left: 20px;
          width: 100px;
          height: 100px;
          cursor: pointer;
          img {
            width: 100px;
            height: 100px;
            border-radius: 50%;
          }
        }
        .InfoInnerLeftText {
          float: left;
          margin-top: 10px;
          margin-left: 30px;
          .geInformation {
            font-size: 22px;
            span {
              margin-left: 15px;
              font-size: 16px;
            }
            span:nth-child(5) {
              margin-left: 90px;
            }
          }
          .companyInformation {
            font-size: 16px;
            margin-top: 25px;
            span:nth-child(1) {
              margin-left: 87px;
            }
            span:nth-child(3) {
              margin-left: 42px;
            }
            span {
              margin-left: 15px;
            }
          }
          .companyAddress {
            font-size: 16px;
            margin-top: 5px;
            span {
              margin-left: 87px;
            }
          }
        }
      }
      .InfoInnerRight {
        float: right;
        overflow: hidden;
        margin-right: 10px;
        .InfoInnerRightLeft {
          float: left;
          overflow: hidden;
          width: 21px;
          height: 120px;
          margin-right: 40px;
        }
        .InfoInnerRightRight {
          float: right;
        }
      }
    }
  }
}

</style>

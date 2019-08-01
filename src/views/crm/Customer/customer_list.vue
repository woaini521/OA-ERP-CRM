<!-- 模板组件，用于模拟不同路由下的组件显示 -->
<template>
  <div class="box">
    <div class="box_head">
      <div class="box_head_left">
        <label>筛选：</label>
        <el-select
          v-model="value"
          filterable
          placeholder="请选择"
          style="width:217px"
          @change="retrieval(value)"
        > 
          <el-option label="空" value=""></el-option>
          <el-option v-for="item in Customercompany" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
        <el-select
          v-model="value1"
          collapse-tags
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
    <div class="box_content">
      <div
        class="InfoInner"
        v-for="item in customerListInfo"
        :key="item.id"
      >
        <div class="InfoInnerLeft">
          <div class="InfoInnerLeftImg">
            <img
              :src="item.headimg"
              @click="See(item)"
              style="width:100px;heigt:100px;"
            >
          </div>
          <div class="InfoInnerLeftText">
            <p class="geInformation">{{ item.name }}
              <span>{{item.gender == 1 ? '男' : '女'}}</span>
              <span>{{ age(item.birthday) }}岁</span>
              <span>{{ item.department }}</span>
              <span>{{ item.position }}</span>
              <span>最近联系：1小时前</span>
            </p>
            <p class="companyInformation">
              <span>{{ item.company_name }}</span>
              <!-- <span>{{ item.customerCompanyFen }}</span> -->
              <span>{{ item.level }}级客户</span>
            </p>
            <p class="companyAddress">
              <span>
                <i
                  class="el-icon-location-outline"
                  type="Brand"
                ></i>
                {{ item.company_province }}{{ item.company_city }}{{ item.company_county }}{{item.address}}
              </span>

            </p>
          </div>
        </div>
        <div class="InfoInnerRight">
          <div class="InfoInnerRightLeft">
            <el-tooltip
              class="item"
              effect="dark"
              :content="String(item.wechatid)"
              placement="top"
              style="margin-top:8px;"
            >
              <img
                src="@/assets/qq.png"
                alt=""
              >
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              :content="String(item.wechatid)"
              placement="top"
              style="margin-top:5px;"
            >
              <img
                src="@/assets/wx.png"
                alt=""
              >
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              :content="String(item.working_phone)"
              placement="top"
              style="margin-top:5px;"
            >
              <img
                src="@/assets/phone.png"
                alt=""
              >
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              :content="String(item.telephone)"
              placement="top"
              style="margin-top:5px;"
            >
              <img
                src="@/assets/zphone.png"
                alt=""
              >
            </el-tooltip>
          </div>
          <div class="InfoInnerRightRight">
            <el-row style="margin-top:10px;">
              <el-button
                type="primary"
                size="small"
                @click="lianxi(item)"
              >联系<br>记录</el-button>
              <el-button
                type="primary"
                size="small"
                @click="gengxin(item)"
              >更新<br>记录</el-button>
            </el-row>
            <el-row style="margin-top:10px;">
              <el-button
                type="primary"
                size="small"
                @click="dingdan(item)"
              >订单<br>详情</el-button>
              <el-button
                type="primary"
                size="small"
                @click="address(item)"
              >收货<br>地址</el-button>
            </el-row>
          </div>
        </div>
      </div>
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
      last_page:0//总页数
    };
  },
  methods: {
    ...mapActions("customerList", ["triggerReplaceId"]),
    ...mapActions("Tabs", ["triggerAddTabs", "triggerSetActiveIndex"]),
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
      this.$router.push({ path: `/CRM/Customer/dingdan/${a.id}`});
      let ins1 = {
        route: `/CRM/Customer/dingdan/${a.id}`,
        name: "订单详情",
        id: a.id
      };
      let ins2 = `/Customer/dingdan/${a.id}`;
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
          }).then(res => {
          this.customerListInfo = res.data.customer.data;
          this.currentPage = res.data.customer.current_page;
          loading.close();
          //console.log(this.customerListInfo)
        })  
      },
      openFullScreen() {
        this.fullscreenLoading = true;
        setTimeout(() => {
          this.fullscreenLoading = false;
        }, 2000);
      },
    getData(){
      // const loading = this.$loading({
      //     lock: true,
      //     text: '拼命加载中',
      //     spinner: 'el-icon-loading',
      //     background: 'rgba(0, 0, 0, 0.7)'
      //   });
      this.axios.get('/crm.Customer/customer_list').then(res => {
        this.customerListInfo = res.data.customer.data;
        this.currentPage = res.data.customer.current_page;
        this.total = res.data.customer.total;
        this.per_page = res.data.customer.per_page;
        this.last_page = res.data.customer.last_page;
        //console.log(this.customerListInfo)
        // loading.close();
      })
    },
    // 公司下拉框
    getCustomer(){
          this.axios.get('/crm.Customer/company_list').then(res => {
          // this.qiye = res.data.company;
          let Customercompany = res.data.company
          this.Customercompany = Customercompany;
          for(let i=0;i<Customercompany.length;i++){
            if(Customercompany[i].hasOwnProperty('child')){
              for(let z=0;z<Customercompany[i].child.length;z++){
                  this.Customercompany.push(Customercompany[i].child[z])
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
  watch: {
		  $route(){
			  this.$nextTick(()=>{
            this.getData();
        })
		  }
	  }
}
</script>
<style scoped lang="less">
.box_head {
  margin-top: 10px;
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
</style>

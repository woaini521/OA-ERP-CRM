<template>
  <div class="box">
    <label>收货地址,默认第一个为收货地址</label>
    <el-button type="primary" style="float:right;margin-right:20px;" @click="add">新增地址</el-button>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="name" label="收货人">
      </el-table-column>
      <el-table-column prop="phone" label="电话号码">
      </el-table-column>
      <el-table-column prop="province" label="省份">
      </el-table-column>
      <el-table-column prop="city" label="市区">
      </el-table-column>
      <el-table-column prop="county" label="地区">
      </el-table-column>
      <el-table-column prop="address" label="具体地址">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="modify(scope.row)">修改</el-button>
          <el-button type="danger" size="mini" @click="edit(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>


    <el-dialog title="新增修改地址" :visible.sync="dialogFormModify">
      <el-form :model="form">
        <el-form-item label="收货人" :label-width="formLabelWidth">
          <el-input v-model="form.name"></el-input>
         </el-form-item>
         <el-form-item label="电话号码" :label-width="formLabelWidth">
          <el-input v-model="form.phone"></el-input>
         </el-form-item>
         <el-form-item label="省份"  :label-width="formLabelWidth">
          <el-select v-model="sheng" @change="choseProvince" placeholder="省级地区"  style="width:200px;">
            <el-option v-for="item in province" :key="item.id" :label="item.value" :value="item.id"></el-option>
          </el-select>
        </el-form-item>  

        <el-form-item label="市区"  :label-width="formLabelWidth">
          <el-select v-model="shi" @change="choseCity" placeholder="市级地区"  style="width:200px;">
            <el-option v-for="item in shi1" :key="item.id" :label="item.value" :value="item.id"></el-option>
          </el-select>
        </el-form-item> 

        <el-form-item label="地区" :label-width="formLabelWidth">
          <el-select v-model="qu" @change="choseBlock" placeholder="区级地区"  style="width:200px;">
            <el-option v-for="item in qu1" :key="item.id" :label="item.value" :value="item.id"></el-option>
          </el-select>
        </el-form-item> 
         <el-form-item label="具体地址" :label-width="formLabelWidth">
          <el-input v-model="form.address"></el-input>
         </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormModify = false">取 消</el-button>
        <el-button type="primary" @click="addAddress">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        tableData:[
        ],
        formLabelWidth: '120px',
        dialogFormModify:false,
        form:{
            id:'',
            name:'',
            phone:'',
            sheng:'',
            shi:'',
            qu:'',
            address:''
        },
        province:'',
        city:'',
        block:'', 
        sheng: '',
        shi: '',
        shi1: [],
        qu: '',
        qu1: [],
      };
    },
    created(){
      this.getCityData();
      this.getData();
    },
    methods:{
      modify(a){
        console.log(a.id);
        this.dialogFormModify = true;
        this.form.id = a.id;
        this.form.name = a.name;
        this.form.phone = a.phone;
        this.form.sheng = a.province;
        this.form.shi = a.city;
        this.form.qu = a.county;
        this.form.address = a.address;
        this.sheng = a.province;
        this.shi = a.city;
        this.qu = a.county;
      },
      // 删除
      edit(a){
         this.axios.post('/crm.Customer/customer_address_delete',{
           id:a.id,
         }).then(res => {
           if(res.data.code == 2000){
              this.open(res.data.msg,'success');
              this.dialogFormModify = false;
              this.getData();
           }else{
             this.open(res.data.msg,'error');
           }
         })
      },
      add(){
        this.dialogFormModify = true;
        this.form.id = '';
        this.form.name = '';
        this.form.phone = '';
        this.form.sheng = '';
        this.form.shi = '';
        this.form.qu = '';
        this.form.address = '';
        this.sheng = '';
        this.shi = '';
        this.qu = '';
      },
      //加载地址数据
      getData(){
        //  const loading = this.$loading({
        //   lock: true,
        //   text: '拼命加载中',
        //   spinner: 'el-icon-loading',
        //   background: 'rgba(0, 0, 0, 0.7)'
        // });
        this.axios.get('/crm.Customer/customer_address_list?id='+this.$route.params.id).then(res => {
          //console.log(res);
          this.tableData = res.data.customer_address;
          //loading.close();
        })
      },
      addAddress(){
        if(this.form.id == ''){
          this.axios.post('/crm.Customer/customer_address_add',{
           id:'',
           customer_id:this.$route.params.id,
           name:this.form.name,
           phone :this.form.phone,
           province:this.form.sheng,
           city:this.form.shi,
           county:this.form.qu,
           address:this.form.address,
         }).then(res => {
           if(res.data.code == 2000){
              this.open(res.data.msg,'success');
              this.dialogFormModify = false;
              this.getData();
           }else{
             this.open(res.data.msg,'error');
           }
         })
        }else{
          this.axios.post('/crm.Customer/customer_address_update',{
           id:this.form.id,
           customer_id:this.$route.params.id,
           name:this.form.name,
           phone :this.form.phone,
           province:this.form.sheng,
           city:this.form.shi,
           county:this.form.qu,
           address:this.form.address,
         }).then(res => {
           if(res.data.code == 2000){
              this.open(res.data.msg,'success');
              this.dialogFormModify = false;
              this.getData();
           }else{
             this.open(res.data.msg,'error');
           }
         })
        }
         
      },

      // 加载china地点数据，三级
      getCityData:function(){
        var that = this
        that.axios.get("./api/map.json").then(function(response){
          if (response.status==200) {
            var data = response.data;
            that.province = [];
            that.city = [];
            that.block = [];
            // 省市区数据分类
            for (var item in data) {
              if (item.match(/0000$/)) {//省
                that.province.push({id: item, value: data[item], children: []});
              } else if (item.match(/00$/)) {//市
                that.city.push({id: item, value: data[item], children: []});
              } else {//区
                that.block.push({id: item, value: data[item]});
              }
            }
            // 分类市级
            for (var index in that.province) {
              for (var index1 in that.city) {
                if (that.province[index].id.slice(0, 2) === that.city[index1].id.slice(0, 2)) {
                  that.province[index].children.push(that.city[index1]);
                }
              }
            }
            // 分类区级
            for(var item1 in that.city) {
              for(var item2 in that.block) {
                if (that.block[item2].id.slice(0, 4) === that.city[item1].id.slice(0, 4)) {
                  that.city[item1].children.push(that.block[item2]);
                }
              }
            }
          }
          else{
            //console.log(response.status)
          }
          })
        // .catch(function(error){console.log(typeof+ error)})
      },
      // 省
      choseProvince:function(e) {
        for (var index2 in this.province) {
          if (e === this.province[index2].id) {
            // console.log(this.province[index2].id)//你选择的省级编码
            //console.log(this.province[index2].value)//省级编码 对应的汉字 
            this.shi1 = this.province[index2].children;
            this.shi = this.province[index2].children[0].value;
            this.qu1 =this.province[index2].children[0].children;
            this.qu = this.province[index2].children[0].children[0].value;
            this.E = this.qu1[0].value;
            this.form.sheng = this.province[index2].value;
            this.form.shi = this.province[index2].children[0].value;
            this.form.qu = this.province[index2].children[0].children[0].value;
            //console.log(this.form.sheng);
            //console.log(this.form.shi);
            //console.log(this.form.qu);
          }
        }
      },
      // 选市
      choseCity:function(e) {
        for (var index3 in this.city) {
          if (e === this.city[index3].id) {
            this.qu1 = this.city[index3].children;
            this.qu = this.city[index3].children[0].value;
            this.E = this.qu1[0].id;
            this.form.shi = this.city[index3].value;;
            //console.log(this.form.shi)
          }
        }
      },
       // 选区
      choseBlock:function(e) {
        this.E=e;
         for (var index4 in this.block) {
          if (e === this.block[index4].id) {
            this.form.qu = this.block[index4].value;
            //console.log(this.form.qu)
          }
        }
      },
      // 提示框
      open(a,b){
        this.$message({
          showClose: true,
          message: a,
          type: b
        });
      }
    },
    watch:{
      $route (to) {
        if(!this.$route.params.id){

        }else{
          this.getData(); // 这是我ajax获取用户信息的方法
        }
      }
    }
  }
</script>
<style scoped lang="less">
.box{
  margin-top:10px;
  overflow: hidden;
  min-width: 900px;
}
</style>
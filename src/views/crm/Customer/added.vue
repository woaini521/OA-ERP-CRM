<!-- 模板组件，用于模拟不同路由下的组件显示 -->
<template>
  <div class="box">
    <el-form
      ref="form"
      :model="form"
      label-width="80px"
      :rules="rules"
      inline
    >
     <el-form-item label="企业" prop="company">
        <el-select v-model="form.company" placeholder="选择所在企业" filterable  style="width:200px;">
          <el-option v-for="item in Customercompany" :key="item.id" :label="item.name" :value="item.id"></el-option>
          <!-- <el-option label="一" value="1"></el-option> -->
        </el-select>
     </el-form-item>

      <el-form-item label="姓名" prop="name">
        <el-input v-model="form.name"  style="width:200px;"></el-input>
      </el-form-item>

      <el-form-item label="客户级别" prop="level">
        <el-select v-model="form.level" placeholder="选择客户级别" style="width:200px;">
          <el-option label="一般客户" value="1"></el-option>
          <el-option label="意向客户" value="2"></el-option>
          <el-option label="合作客户" value="3"></el-option>
          <el-option label="不联系" value="9"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="身份证号" prop="card">
        <el-input v-model="form.card"  style="width:200px;"></el-input>
      </el-form-item>

      <el-form-item label="部门" prop="Bumen">
        <el-input v-model="form.Bumen"  style="width:200px;"></el-input>
      </el-form-item>

      <el-form-item label="职位" prop="Zhiwei">
        <el-input v-model="form.Zhiwei"  style="width:200px;"></el-input>
      </el-form-item>

      <el-form-item label="性别" prop="sex">
        <el-radio-group v-model="form.sex" style="width:200px;">
          <el-radio label="1">男</el-radio>
          <el-radio label="2">女</el-radio>
        </el-radio-group>
      </el-form-item>
    
      <el-form-item label="客户生日" prop="brith">
          <el-date-picker v-model="form.brith" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="选择日期时间" style="width:200px;"></el-date-picker>
      </el-form-item>

       <el-form-item label="手机号" prop="phone">
         <el-input v-model="form.phone"  style="width:200px;"></el-input>
       </el-form-item>

       <el-form-item label="座机号" prop="Zphone">
         <el-input v-model="form.Zphone"  style="width:200px;"></el-input>
       </el-form-item>

       <el-form-item label="家庭电话" prop="Homephone">
         <el-input v-model="form.Homephone"  style="width:200px;"></el-input>
       </el-form-item>

      <el-form-item label="客户照片" style="float:left;margin-left:20px;" prop="imageUrl">
          <el-upload class="avatar-uploader" 
          :multiple="true"
          accept="image/jpeg,image/gif,image/png,image/bmp"
          :show-file-list="false" 
          action="/File/customer_headimg/"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
       </el-form-item>

        <el-form-item label="QQ" prop="QQ">
         <el-input v-model="form.QQ"  style="width:200px;"></el-input>
        </el-form-item>  

        <el-form-item label="微信" prop="wx">
         <el-input v-model="form.wx"  style="width:200px;"></el-input>
        </el-form-item>  

        <el-form-item label="邮箱" prop="Email">
         <el-input v-model="form.Email"  style="width:200px;"></el-input>
        </el-form-item>  

        <el-form-item label="省">
          <el-select v-model="sheng" @change="choseProvince" placeholder="省级地区"  style="width:200px;">
            <el-option v-for="item in province" :key="item.id" :label="item.value" :value="item.id"></el-option>
          </el-select>
        </el-form-item>  

        <el-form-item label="市">
          <el-select v-model="shi" @change="choseCity" placeholder="市级地区"  style="width:200px;">
            <el-option v-for="item in shi1" :key="item.id" :label="item.value" :value="item.id"></el-option>
          </el-select>
        </el-form-item> 

        <el-form-item label="地区">
          <el-select v-model="qu" @change="choseBlock" placeholder="区级地区"  style="width:200px;">
            <el-option v-for="item in qu1" :key="item.id" :label="item.value" :value="item.id"></el-option>
          </el-select>
        </el-form-item> 

        <el-form-item label="具体地址"  prop="address">
          <el-input v-model="form.address"  style="width:780px;"></el-input>
        </el-form-item>
        <br>
         <el-form-item label="备注信息"  prop="desc">
           <el-input type="textarea" v-model="form.desc"  style="width:780px;"></el-input>
         </el-form-item>

         <el-form-item style="display: block;margin-left:20px">
            <el-button type="primary" @click="add">立即创建</el-button>
            <el-button @click="resetForm('form')">重置</el-button>
          </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    var IDcard = (rule, value, callback) => {
        let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;  
        if (value === '') {
          callback(new Error('请输入身份证号码'));
        } else {
          if (!reg.test(value)) {
             callback(new Error('请输入正确的身份证号码')); 
          }
          callback();
        }
      };
    var Phone = (rule, value, callback) => {
        let reg = /^1[3-5789]\d{9}$/;  
        if (value === '') {
          callback(new Error('请输入手机号码'));
        } else {
          if (!reg.test(value)) {
             callback(new Error('请输入正确的手机号码')); 
          }
          callback();
        }
      };
    return {
      form: {
        name: "",
        company: "",
        level: "",
        card: "",
        Bumen: "",
        Zhiwei: "",
        sex: "",
        brith: "",
        phone: "",
        Zphone: "",
        Homephone: "", 
        headImg: "",
        QQ: "",
        wx: "",
        Email: "",
        sheng: "",
        shi: "",
        qu: "",
        address: "",
        desc:"",
        regin:"",
        imageUrl:""
      },
      rules: {
          name: [
            { required: true, message: '请输入姓名', trigger: 'blur' },
          ],
          company: [
            { required: true, message: '请选择公司', trigger: 'blur' }
          ],
          level: [
            {required: true, message: '请选择级别', trigger: 'blur' }
          ],
          sheng: [
            { required: true, trigger: 'blur' },
          ],
          shi: [
            { required: true, trigger: 'blur' },
          ],
          qu: [
            { required: true, trigger: 'blur' },
          ],
        },
      imageUrl: "",
      province:'',
      city:'',
      block:'', 
      sheng: '',
      shi: '',
      shi1: [],
      qu: '',
      qu1: [],
      Customercompany:[

      ],
    }
  },
  methods:{
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
         console.log(res);
         this.form.headImg = res.src;
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isJPG) {
          this.$message.error('上传图片必须是JPG/PNG格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
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
           if(this.city[index3].children.length == 0){
                  this.form.qu = ' ';
                  this.qu = '';
                  this.qu1 = [];
            }else{
                this.qu1 = this.city[index3].children;
                this.qu = this.city[index3].children[0].value;
            }
            this.form.shi = this.city[index3].value;
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
      resetForm(a) {
        this.$refs[a].resetFields(); 
        this.shi = '';
        this.qu = '';
        this.sheng = '';
        this.imageUrl = '';
      },
      getCustomer(){
          this.axios.get('/crm.Customer/company_list').then(res => {
          // this.qiye = res.data.company;
          let Customercompany = res.data.company;
          for(let i=0;i<Customercompany.length;i++){
            let ins = {
                name:`└${Customercompany[i].name}`,
                id:Customercompany[i].id
            }
                  this.Customercompany.push(ins);
            if(Customercompany[i].hasOwnProperty('child')){
              for(let z=0;z<Customercompany[i].child.length;z++){
                  let ins1 = {
                      name:`└└${Customercompany[i].child[z].name}`,
                      id:Customercompany[i].child[z].id
                  }
                  this.Customercompany.push(ins1);
                  if(Customercompany[i].child[z].hasOwnProperty('child')){
                    for(let y = 0; y < Customercompany[i].child[z].child.length; y++){
                      let ins2 = {
                        name:`└└└${Customercompany[i].child[z].child[y].name}`,
                        id:Customercompany[i].child[z].child[y].id
                      }
                      this.Customercompany.push(ins2);
                      if(Customercompany[i].child[z].child[y].hasOwnProperty('child')){
                        for(let e = 0; e < Customercompany[i].child[z].child.length; e++){
                          //console.log(Customercompany[i].child[z].child[e]);
                          //console.log(Customercompany[i].child[z].child[e].name);
                          if(Customercompany[i].child[z].child[y].child[e] == undefined){

                          }else{
                            let ins3 = {
                              name:`└└└└${Customercompany[i].child[z].child[y].child[e].name}`,
                              id:Customercompany[i].child[z].child[y].child[e].id
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
      add(){
        if(this.form.company == '' || this.form.name == ''){
          this.open();
        }else{
          this.axios.post('/crm.Customer/customer_add',{
          company_id:this.form.company,
          name:this.form.name,
          department:this.form.Bumen,
          position:this.form.Zhiwei,
          gender:this.form.sex,
          level:this.form.level,
          headimg:this.form.headImg,
          idcard:this.form.card,
          working_phone:this.form.phone,
          family_phone:this.form.Homephone,
          telephone:this.form.Zphone,
          email:this.form.Email,
          wechatid:this.form.wx,
          province:this.form.sheng,
          city:this.form.shi,
          county:this.form.qu,
          address:this.form.address,
          //remarks:this.form.company,
          birthday:this.form.brith,
         }).then(res => {
           //console.log(res);
           if(res.data.code == 2000){
              this.open1(res.data.msg,'success');
              this.resetForm('form');
           }else{
              this.open1(res.data.msg,'error');
           }
         })
         .catch(function (error) {
            this.open1('请联系管理员','error');
          });
        }

         
      },
      open(){
        this.$message({
          showClose: true,
          message: '请填写完整带*号的！',
          type: 'warning'
        });
      },
       open1(a,b){
        this.$message({
          showClose: true,
          message: a,
          type: b
        });
      }
    },
    created:function(){
      this.getCityData();
      this.getCustomer();
    }
}
</script>
<style scoped lang="less">
.box {
  margin-top: 10px;
  min-width: 900px;
  max-width: 1380px;
}
.avatar-uploader,.el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader,.el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 160px;
    height: 160px;
    line-height: 160px;
    text-align: center;
  }
  .avatar {
    width: 170px;
    height: 170px;
    display: block;
  }
</style>

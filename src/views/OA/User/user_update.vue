<template>
    <div class="box">
        <el-tabs style="margin-top: 20px;" v-model="activeName">
            <el-tab-pane label="基本资料" name="1">
                <el-form :model="formData1" style="margin-top:10px;">
                    <el-form-item label="姓名" label-width="100px">
                        <el-input v-model="formData1.name" style="width:217px"></el-input>
                    </el-form-item>
                    <el-form-item label="部门" label-width="100px">
                        <el-cascader v-model="formData1.bumen" :options="options" :props="props" change-on-select></el-cascader>
                    </el-form-item>
                    <el-form-item label="负责公司" label-width="100px">
                        <el-select v-model="formData1.company" multiple placeholder="选择所在企业" filterable  style="width:217px;">
                            <el-option v-for="item in Customercompany" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="角色" label-width="100px">
                        <el-select v-model="formData1.proson" placeholder="选择职位" multiple style="width:217px;">
                            <el-option v-for="item in options1" :key="item.id" :label="item.title" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="手机号码" label-width="100px">
                        <el-input v-model="formData1.phone" style="width:217px"></el-input>
                    </el-form-item>
                    <el-form-item label="工作手机" label-width="100px">
                        <el-input v-model="formData1.Gphone" style="width:217px"></el-input>
                    </el-form-item>
                    <el-form-item label="性别" label-width="100px">
                        <el-radio v-model="formData1.sex" label="1">男</el-radio>
                        <el-radio v-model="formData1.sex" label="2">女</el-radio>
                    </el-form-item>
                    <el-form-item label="状态" label-width="100px">
                        <el-radio v-model="formData1.status" label="1">在职</el-radio>
                        <el-radio v-model="formData1.status" label="0">离职</el-radio>
                    </el-form-item>
                    <el-form-item label="密码" label-width="100px">
                        <el-input v-model="formData1.pwd" style="width:217px"></el-input>
                    </el-form-item>
                    <el-form-item label="" label-width="100px">
                        <el-button type="primary" @click="add1">保存</el-button>
                    </el-form-item>
                </el-form>
            </el-tab-pane>

            <el-tab-pane label="附加信息" name="2">
                <el-form :model="formData2" style="margin-top:10px;">
                    <el-form-item label="入职时间" label-width="100px">
                        <el-date-picker v-model="formData2.hiredate" type="date" placeholder="选择日期" format='yyyy-MM-dd' value-format='timestamp' style="width:217px"></el-date-picker>
                    </el-form-item>    
                    <el-form-item label="离职时间" label-width="100px">
                        <el-date-picker v-model="formData2.leavedate" type="date" format='yyyy-MM-dd' value-format='timestamp' placeholder="选择日期" style="width:217px"></el-date-picker>
                    </el-form-item> 
                    <el-form-item label="员工生日" label-width="100px">
                        <el-date-picker v-model="formData2.birthday" type="date" placeholder="选择日期" style="width:217px" format='yyyy-MM-dd' value-format='timestamp'></el-date-picker>
                    </el-form-item>
                    <el-form-item label="转正日期" label-width="100px">
                        <el-date-picker v-model="formData2.formaldate" type="date" placeholder="选择日期" style="width:217px" format='yyyy-MM-dd' value-format='timestamp'></el-date-picker>
                    </el-form-item>

                    <el-form-item label="工资" label-width="100px">
                        <el-input v-model="formData2.salary" style="width:217px" placeholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item label="绩效" label-width="100px">
                        <el-input v-model="formData2.jixiao" style="width:217px" placeholder="请输入"></el-input>
                    </el-form-item>

                    <el-form-item label="合同截止日" label-width="100px">
                        <el-date-picker v-model="formData2.contractdate" type="date" placeholder="选择日期" style="width:217px" format='yyyy-MM-dd' value-format='timestamp'></el-date-picker>
                    </el-form-item>
                    <el-form-item label="禅修时间" label-width="100px">
                        <el-date-picker v-model="formData2.templedate" type="date" placeholder="选择日期" style="width:217px" format='yyyy-MM-dd' value-format='timestamp'></el-date-picker>
                    </el-form-item>
                    <el-form-item label="学历" label-width="100px">
                        <el-input v-model="formData2.education" style="width:217px" placeholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item label="政治面貌" label-width="100px">
                        <el-input v-model="formData2.politics" style="width:217px" placeholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item label="推荐人" label-width="100px">
                        <el-input v-model="formData2.recommend" style="width:217px" placeholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item label="身份证号码" label-width="100px">
                        <el-input v-model="formData2.idcard" style="width:217px" placeholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item label="身份证地址" label-width="100px">
                        <el-input v-model="formData2.idcard_address" style="width:217px" placeholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item label="现住址" label-width="100px">
                        <el-input v-model="formData2.address" style="width:217px" placeholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item label="父亲姓名" label-width="100px">
                        <el-input v-model="formData2.dad_name" style="width:217px" placeholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item label="母亲姓名" label-width="100px">
                        <el-input v-model="formData2.mom_name" style="width:217px" placeholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item label="父亲生日" label-width="100px">
                        <el-date-picker v-model="formData2.dad_birthday" type="date" placeholder="选择日期" style="width:217px" format='yyyy-MM-dd' value-format='timestamp'></el-date-picker>
                    </el-form-item>
                    <el-form-item label="母亲生日" label-width="100px">
                        <el-date-picker v-model="formData2.mom_birthday" type="date" placeholder="选择日期" style="width:217px" format='yyyy-MM-dd' value-format='timestamp'></el-date-picker>
                    </el-form-item>
                    <el-form-item label="父母现住址" label-width="100px">
                        <el-input v-model="formData2.parent_address" style="width:217px" placeholder="请输入"></el-input>
                    </el-form-item>
                    
                    <el-form-item label="" label-width="100px">
                        <el-button @click="add1" type="primary">提交</el-button>
                    </el-form-item>
                </el-form>
            </el-tab-pane>

            <el-tab-pane label="个人历程" name="3">
                <el-button @click="tianjia" style="margin-top:20px;">添加</el-button>
                <el-table :data="courseData">
                    <el-table-column prop="" label="时间"></el-table-column>
                    <el-table-column prop="" label="内容"></el-table-column>
                </el-table>
                
                <el-dialog title="提示" :visible.sync="dialogTianjia">
                    <el-form :model="dialogTianjiaForm">
                        <el-form-item label="时间" label-width="90px">
                            <el-date-picker v-model="dialogTianjiaForm.time" value-format="timestamp" type="date" placeholder="选择日期" style="width:300px"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="内容" label-width="90px">
                            <el-input type="textarea" v-model="dialogTianjiaForm.content"  style="width:300px"></el-input>
                        </el-form-item>
                        <el-form-item label="" label-width="90px">
                            <el-button @click="send">确认</el-button>
                        </el-form-item>
                    </el-form>
                </el-dialog>


            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import {mapActions} from 'vuex';

export default {
    data(){
        return{
            activeName:'1',
            formData1:{  // 基本信息
                name:'',
                bumen:[],
                company:[],
                proson:[],
                phone:'',
                Gphone:'',
                sex:'1',
                status:'1',
                pwd:''
            },
            options:[], // 部门信息
            options1:[],//职位信息
            props:{
                value:'id',
                label:'title',
                children:'child'
            },
            Customercompany:[], // 公司信息

            formData2:{ // 附加信息
                birthday:'',
                hiredate :'',
                leavedate :'',
                contractdate :'',
                templedate :'',
                formaldate :'',
                education :'',
                politics :'',
                recommend :'',
                idcard :'',
                idcard_address :'',
                address :'',
                dad_name :'',
                mom_name :'',
                dad_birthday :'',
                mom_birthday :'',
                parent_address :'',
                salary:'',
                jixiao:'',
            },

            dialogTianjia:false, // 弹窗
            dialogTianjiaForm:{
                time:'',
                content:'',
            },
            courseData:[], // 个人历程数据

        }
    },
    methods:{
        ...mapActions("Tabs", ['triggerDeleteTabs']),
        // 获取数据
        getData(){
            this.axios.get('/oa.User/user_update?user_id='+this.$route.params.id).then(res => {
                this.options1 = res.data.role_list;
                let Customercompany = res.data.company;
                // 循环公司列表
                if(this.Customercompany.length == 0){
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
                    };
                } 
                
                //  基本表格数据
                this.formData1.name = res.data.name;
                this.formData1.phone = res.data.phone;
                this.formData1.Gphone = res.data.work_phone;
                this.formData1.proson = res.data.group_id.split(',').map(Number);                
                this.formData1.sex = String(res.data.gender);
                this.formData1.status = String(res.data.status);
                this.formData1.pwd = '';
                // 附加表格信息
                if(res.data.birthday == 0){
                    this.formData2.birthday = '';
                }else{
                    this.formData2.birthday = res.data.birthday*1000;
                };

                if(res.data.hiredate == 0){
                    this.formData2.hiredate = '';
                }else{
                    this.formData2.hiredate = res.data.hiredate*1000;
                };

                if(res.data.leavedate == 0){
                    this.formData2.leavedate = '';
                }else{
                    this.formData2.leavedate = res.data.leavedate*1000;
                };
                if(res.data.contractdate == 0){
                    this.formData2.contractdate = '';
                }else{
                    this.formData2.contractdate = res.data.contractdate*1000;
                };
                if(res.data.templedate == 0){
                    this.formData2.templedate = '';
                }else{
                    this.formData2.templedate = res.data.templedate*1000;
                };

                if(res.data.formaldate == 0){
                    this.formData2.formaldate = '';
                }else{
                    this.formData2.formaldate = res.data.formaldate*1000;
                };
                if(res.data.contractdate == 0){
                    this.formData2.contractdate = '';
                }else{
                    this.formData2.contractdate = res.data.contractdate*1000;
                };
                if(res.data.dad_birthday == 0){
                    this.formData2.dad_birthday = '';
                }else{
                    this.formData2.dad_birthday = res.data.dad_birthday*1000;
                };
                if(res.data.mom_birthday == 0){
                    this.formData2.mom_birthday = '';
                }else{
                    this.formData2.mom_birthday = res.data.mom_birthday*1000;
                }; 

                this.formData2.salary = res.data.salary;    
                this.formData2.jixiao = res.data.jixiao; 
                this.formData2.education = res.data.education;    
                this.formData2.politics = res.data.politics;  
                this.formData2.recommend = res.data.recommend;  
                this.formData2.idcard = res.data.idcard;
                this.formData2.idcard_address = res.data.idcard_address;  
                this.formData2.address = res.data.address; 
                this.formData2.mom_name = res.data.mom_name; 
                this.formData2.dad_name = res.data.dad_name; 
                this.formData2.parent_address = res.data.parent_address; 

                // 判断 公司部门
                if(res.data.company_id == "0"){
                    this.formData1.company  = [];
                }else{
                    this.formData1.company = res.data.company_id.split(',').map(Number);
                }

                this.options = res.data.user_dep[0].child[0].child;
                //console.log(this.options)
                if(res.data.dep_id > 4 && res.data.dep_id != 17){
                    for(var z = 0;z<this.options.length;z++){
                        if(this.options[z].hasOwnProperty('child')){
                            this.options[z].child.filter(item => {
                                if(item.id == res.data.dep_id){
                                    this.formData1.bumen = [Number(this.options[z].id),Number(res.data.dep_id)];
                                }
                            }) 
                        }  
                    }
                }else{
                    if(res.data.dep_id == 17){
                        this.formData1.bumen = [17]
                    }else{
                        this.formData1.bumen = [Number(res.data.dep_id)];
                    }
                 
                }
   
            })
        },
        // 新增数据
        getData1(){
            this.axios.get('/oa.User/user_update').then(res => {
                this.options1 = res.data.role_list;
                let Customercompany = res.data.company;
                // 循环公司列表
                if(this.Customercompany.length == 0){
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
                                                if(Customercompany[i].child[z].child[y].child[e] !== undefined){
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
                    };
                } 
                //  基本表格数据
                this.formData1.name = '';
                this.formData1.phone = '';
                this.formData1.Gphone = '';
                this.formData1.proson = [];                
                this.formData1.sex = '1';
                this.formData1.status = '1';
                this.formData1.pwd = '123456';
                // 附加表格信息
                this.formData2.birthday = '';
                this.formData2.hiredate = '';
                this.formData2.leavedate = '';
                this.formData2.contractdate = '';
                this.formData2.templedate = '';
                this.formData2.formaldate = '';
                this.formData2.contractdate = '';
                this.formData2.education = '';    
                this.formData2.politics = '';  
                this.formData2.recommend = '';  
                this.formData2.idcard = '';
                this.formData2.idcard_address = '';  
                this.formData2.address = ''; 
                this.formData2.mom_name = ''; 
                this.formData2.dad_name = ''; 
                this.formData2.dad_birthday = '';
                this.formData2.mom_birthday = '';
                this.formData2.parent_address = ''; 
                this.formData2.salary = '';
                this.formData2.jixiao = ''; 
                // 判断 公司部门
                this.options = res.data.user_dep[0].child;

                
   
            })
        },
        // 基本信息添加按钮
        add1(){
            if(this.$route.params.id == 0){
                this.axios.post('/oa.User/user_add',{
                    name:this.formData1.name,
                    dep_id:this.formData1.bumen[this.formData1.bumen.length - 1],
                    company_id:String(this.formData1.company),
                    group_id:this.formData1.proson.join(','),
                    phone:this.formData1.phone,
                    work_phone:this.formData1.Gphone,
                    gender:this.formData1.sex,
                    status:this.formData1.status,
                    pwd:this.formData1.pwd,
                    birthday:this.formData2.birthday / 1000,
                    hiredate :this.formData2.hiredate / 1000,
                    leavedate :this.formData2.leavedate / 1000,
                    contractdate :this.formData2.contractdate / 1000,
                    templedate :this.formData2.templedate / 1000,
                    formaldate :this.formData2.formaldate / 1000,
                    education :this.formData2.education,
                    politics :this.formData2.politics,
                    recommend :this.formData2.recommend,
                    idcard :this.formData2.idcard,
                    idcard_address :this.formData2.idcard_address,
                    address :this.formData2.address,
                    dad_name :this.formData2.dad_name,
                    mom_name :this.formData2.mom_name,
                    dad_birthday :this.formData2.dad_birthday / 1000,
                    mom_birthday :this.formData2.mom_birthday / 1000,
                    parent_address :this.formData2.parent_address, 
                    salary :this.formData2.salary, 
                    jixiao :this.formData2.jixiao, 
                }).then(res => {
                    if(res.data.code == 2000){
                        this.open(res.data.msg,'success');
                        console.log(this.$route.path);
                        this.triggerDeleteTabs(this.$route.path);
                        this.$router.push({ path: "/oa/User/user_lists" });
                    }else{
                        this.open(res.data.msg,'error');
                    } 
                })
            }else{
                this.axios.post('/oa.User/user_update',{
                    user_id:this.$route.params.id,
                    name:this.formData1.name,
                    dep_id:this.formData1.bumen[this.formData1.bumen.length - 1],
                    company_id:String(this.formData1.company),
                    group_id:this.formData1.proson.join(','),
                    phone:this.formData1.phone,
                    work_phone:this.formData1.Gphone,
                    gender:this.formData1.sex,
                    status:this.formData1.status,
                    pwd:this.formData1.pwd,
                    birthday:this.formData2.birthday / 1000,
                    hiredate :this.formData2.hiredate / 1000,
                    leavedate :this.formData2.leavedate / 1000,
                    contractdate :this.formData2.contractdate / 1000,
                    templedate :this.formData2.templedate / 1000,
                    formaldate :this.formData2.formaldate / 1000,
                    education :this.formData2.education,
                    politics :this.formData2.politics,
                    recommend :this.formData2.recommend,
                    idcard :this.formData2.idcard,
                    idcard_address :this.formData2.idcard_address,
                    address :this.formData2.address,
                    dad_name :this.formData2.dad_name,
                    mom_name :this.formData2.mom_name,
                    dad_birthday :this.formData2.dad_birthday / 1000,
                    mom_birthday :this.formData2.mom_birthday / 1000,
                    parent_address :this.formData2.parent_address, 
                    salary :this.formData2.salary, 
                    jixiao :this.formData2.jixiao,
                }).then(res => {
                    if(res.data.code == 2000){
                        this.open(res.data.msg,'success');
                        this.triggerDeleteTabs(this.$route.path);
                        this.$router.push({ path: "/oa/User/user_lists" });
                    }else{
                        this.open(res.data.msg,'error');
                    } 
                }) 
            }
        },
        // 获取个人历程数据
        getcourseData(){
            this.axios.get('/oa.User/user_story_select?user_id='+this.$route.params.id).then(res => {

            })
        },
        // 添加个人历程
        tianjia(){
            this.dialogTianjia = true;
            this.dialogTianjiaForm.time = '';
            this.dialogTianjiaForm.content = '';
        },
        // 提交个人历程
        send(){

        },
        open(a,b){
            this.$message({
                message: a,
                type: b
            });
        },  
    },
    created(){
        this.activeName = '1';
        if(this.$route.params.id == 0){
            this.getData1();
        }else{
            this.getData();
            this.getcourseData()
        }
    },
    watch:{
        $route(to){
            if(!this.$route.params.id){

            }else{
                this.activeName = '1';
                if(this.$route.params.id == 0){
                
                    this.getData1();
                    
                }else{
                    this.getData();
                    this.getcourseData()
                }
                
            }
        }
    },
    filters: {
     formatDate: function (value) {
        let date = new Date(value);
        let y = date.getFullYear();
        let MM = date.getMonth() + 1;
        MM = MM < 10 ? ('0' + MM) : MM;
        let d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        let h = date.getHours();
        h = h < 10 ? ('0' + h) : h;
        let m = date.getMinutes();
        m = m < 10 ? ('0' + m) : m;
        let s = date.getSeconds();
        s = s < 10 ? ('0' + s) : s;
        return y + '-' + MM + '-' + d;
      }
    },
}
</script>

<style lang="less" scoped>
.box{

}
</style>

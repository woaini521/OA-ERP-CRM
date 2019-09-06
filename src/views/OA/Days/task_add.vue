<template>
    <div class="box">
        <el-form :model="formData">
            <el-form-item label="名称" label-width="90px">
                <el-input v-model="formData.name" style="width:217px"></el-input>
            </el-form-item>
            <el-form-item label="类型" label-width="90px">
                <el-radio v-model="formData.type" label="1">技术委托</el-radio>
            </el-form-item>
            <el-form-item label="部门" label-width="90px">
                <el-select v-model="formData.dep_id" clearable @change="xuanze" placeholder="请选择">
                    <el-option v-for="item in dep" :key="item.id" :label="item.dep_name" :value="item.id">
                    </el-option>
                  </el-select>
            </el-form-item>
            <el-form-item label="接收人" label-width="90px">
                <el-select v-model="formData.user_id" clearable placeholder="请选择">
                    <el-option v-for="item in user" :key="item.user_id" :label="item.name" :value="item.user_id">
                    </el-option>
                  </el-select>
            </el-form-item>
            <el-form-item label="任务类型" label-width="90px">
                <el-select v-model="formData.value" filterable allow-create default-first-option
                    placeholder="请选择任务类型或手动输入按下Enter键" style="width:300px;">
                    <el-option  v-for="item in options" :key="item.id" :label="item.name" :value="item.name">
                    </el-option>
                </el-select>            
            </el-form-item>
            <el-form-item label="参与角色" label-width="90px">
                <el-checkbox-group v-model="formData.role">
                    <el-checkbox label="4">设计</el-checkbox>
                    <el-checkbox label="5">策划</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="内容" label-width="90px">
                <el-input type="textarea" v-model="formData.remarks" style="width:300px"></el-input>
            </el-form-item>
            <el-form-item label="完成时间" label-width="90px">
                <el-date-picker v-model="formData.end_time" value-format="timestamp" type="date" placeholder="选择日期"></el-date-picker>            
            </el-form-item>
            <el-form-item label="" label-width="90px">
                <el-button @click="confirm">提交</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import {mapActions} from 'vuex';
export default {
    data(){
        return {
            formData:{
              name:'', 
              type:'1',
              dep_id:'',
              user_id:'', 
              role:[],
              value:'',
              remarks:'',
              end_time:'',
            },
            options: [],
            dep:[
                {
                    id:3,
                    dep_name:'研发中心'
                },
            ],// 部门
            user:[],// renyuan
        }
    },
    methods:{
        ...mapActions("Tabs", ['triggerDeleteTabs']),
        xuanze(value){
            this.axios.post('/oa.Days/task_user_list',{
                id:value
            }).then(res => {
                this.user = res.data
            })
        },
        confirm(){
            if(this.$route.params.id == 0){
                if(this.formData.name == '' || this.formData.user_id == '' || this.formData.value == '' || this.formData.remarks == '' || this.formData.role == '' || this.formData.end_time == ''){
                   this.open('填写完整','error'); 
                }else{
                    this.axios.post('/oa.Days/task_add',{
                        task_name:this.formData.name,
                        receive_user:this.formData.user_id,
                        type:this.formData.type,
                        task_type:this.formData.value,
                        role:this.formData.role.join(","),
                        content:this.formData.remarks,
                        dep_id:this.formData.dep_id,
                        end_time:this.formData.end_time/1000
                    }).then(res => {
                        if(res.data.code == 2000){
                            this.open(res.data.msg,'success')
                            this.triggerDeleteTabs(this.$route.path);
                            this.$router.push({ path: "/oa/Days/task_select" });
                        }else{
                            this.open(res.data.msg,'error');
                        } 
                    })
                } 
            }else{
                this.axios.post('/oa.Days/task_update',{
                    task_name:this.formData.name,
                    receive_user:this.formData.user_id,
                    type:this.formData.type,
                    task_type:this.formData.value,
                    role:this.formData.role.join(","),
                    content:this.formData.remarks,
                    dep_id:this.formData.dep_id,
                    end_time:this.formData.end_time/1000,
                    id:this.$route.params.id
                }).then(res => {
                    if(res.data.code == 2000){
                        this.open(res.data.msg,'success')
                        this.triggerDeleteTabs(this.$route.path);
                        this.$router.push({ path: "/oa/Days/task_select" });
                    }else{
                        this.open(res.data.msg,'error');
                    } 
                })
            }
            
        },
        getoptions(){
            this.axios.get('/oa.Days/task_add').then(res => {
                this.options = res.data.task_type_list;
            })
        },
        // 公用弹窗
        open(a,b){
            this.$message({
            message: a,
            type: b
            });
        },

        getupdata(a){
            this.axios.get('/oa.Days/task_update?id='+a).then(res => {
                this.xuanze(res.data.dep_id);
                this.formData.name = res.data.task_name
                this.formData.user_id = res.data.receive_user
                this.formData.type = "1";
                this.formData.value = res.data.task_type_name;
                this.formData.role = res.data.role.split(",");
                this.formData.remarks = res.data.content;
                this.formData.dep_id = res.data.dep_id;
                this.formData.end_time = res.data.end_time*1000;
            })
        }, 
    },
    activated(){
       if(this.$route.params.id>0){
           this.getoptions();
           this.getupdata(this.$route.params.id);
       }else{
           this.getoptions();
            this.formData.name='';
            this.formData.type='1';
            this.formData.dep_id='';
            this.formData.user_id='' ;
            this.formData.role=[];
            this.formData.value='';
            this.formData.remarks='';
            this.formData.end_time='';
       }
    }
}
</script>

<style lang="less" scoped>

</style>


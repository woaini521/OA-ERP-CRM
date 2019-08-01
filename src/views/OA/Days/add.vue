<template>
    <div class="box">
        <div class="content_box">
            <el-tabs v-model="activeName">
                <el-tab-pane label="请假申请" name="1">
                    <div class="leave">
                        <el-form :model="leaveForm">
                            <el-form-item label="预算" label-width="100px">
                                <el-input v-model="leaveForm.budget" style="width:300px;"></el-input>
                            </el-form-item>
                            <el-form-item label="时间" label-width="100px">
                                <el-input v-model="leaveForm.timeT" type="number" placeholder="请输入天数" style="width:150px;"></el-input>
                                <el-input style="margin-left:20px;width:150px;" type="number" v-model="leaveForm.timeH" placeholder="请输入小时数"></el-input>
                            </el-form-item>
                             <el-form-item label="开始时间" label-width="100px">
                                <el-date-picker v-model="leaveForm.startTime" type="datetime" placeholder="选择日期时间" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                            </el-form-item>
                            <el-form-item label="结束时间" label-width="100px">
                                <el-date-picker v-model="leaveForm.endTime" type="datetime" placeholder="选择日期时间" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                            </el-form-item>
                            <el-form-item label="备注" label-width="100px">
                                <el-input type="textarea" v-model="leaveForm.remark" style="width:300px;"></el-input>
                            </el-form-item>
                            <el-form-item label=" " label-width="100px">
                                <el-button @click="add1">保存</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="外出申请" name="3">
                    <div class="egress">
                        <el-form :model="egressForm">
                            <el-form-item label="预算" label-width="100px">
                                <el-input v-model="egressForm.budget" style="width:300px;"></el-input>
                            </el-form-item>
                            <el-form-item label="时间" label-width="100px">
                                <el-input type="number" v-model="egressForm.timeT" placeholder="请输入天数" style="width:150px;"></el-input>
                                <el-input type="number" style="margin-left:20px;width:150px;" v-model="egressForm.timeH" placeholder="请输入小时数"></el-input>
                            </el-form-item>
                             <el-form-item label="开始时间" label-width="100px">
                                <el-date-picker v-model="egressForm.startTime" type="datetime" placeholder="选择日期时间" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                            </el-form-item>
                            <el-form-item label="结束时间" label-width="100px">
                                <el-date-picker v-model="egressForm.endTime" type="datetime" placeholder="选择日期时间" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                            </el-form-item>
                            <el-form-item label="备注" label-width="100px">
                                <el-input type="textarea" v-model="egressForm.remark" style="width:300px;"></el-input>
                            </el-form-item>
                            <el-form-item label=" " label-width="100px">
                                <el-button @click="add1">保存</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="加班申请" name="4">
                    <div class="overtime">
                        <el-form :model="overtimeForm">
                            <el-form-item label="预算" label-width="100px">
                                <el-input v-model="overtimeForm.budget" style="width:300px;"></el-input>
                            </el-form-item>
                            <el-form-item label="时间" label-width="100px">
                                <el-input type="number" v-model="overtimeForm.timeT" placeholder="请输入天数" style="width:150px;"></el-input>
                                <el-input type="number" style="margin-left:20px;width:150px;" v-model="overtimeForm.timeH" placeholder="请输入小时数"></el-input>
                            </el-form-item>
                             <el-form-item label="开始时间" label-width="100px">
                                <el-date-picker v-model="overtimeForm.startTime" type="datetime" placeholder="选择日期时间" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                            </el-form-item>
                            <el-form-item label="结束时间" label-width="100px">
                                <el-date-picker v-model="overtimeForm.endTime" type="datetime" placeholder="选择日期时间" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                            </el-form-item>
                            <el-form-item label="备注" label-width="100px">
                                <el-input type="textarea" v-model="overtimeForm.remark" style="width:300px;"></el-input>
                            </el-form-item>
                            <el-form-item label=" " label-width="100px">
                                <el-button @click="add1">保存</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="出差申请" name="2">
                    <div class="business">
                        <el-form :model="businessForm">
                            <el-form-item label="预算" label-width="100px">
                                <el-input v-model="businessForm.budget" style="width:300px;"></el-input>
                            </el-form-item>
                            <el-form-item label="时间" label-width="100px">
                                <el-input type="number" v-model="businessForm.timeT" placeholder="请输入天数" style="width:150px;"></el-input>
                                <el-input type="number" style="margin-left:20px;width:150px;" v-model="businessForm.timeH" placeholder="请输入小时数"></el-input>
                            </el-form-item>
                             <el-form-item label="开始时间" label-width="100px">
                                <el-date-picker v-model="businessForm.startTime" type="datetime" placeholder="选择日期时间" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                            </el-form-item>
                            <el-form-item label="结束时间" label-width="100px">
                                <el-date-picker v-model="businessForm.endTime" type="datetime" placeholder="选择日期时间" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                            </el-form-item>
                            <el-form-item label="备注" label-width="100px">
                                <el-input type="textarea" v-model="businessForm.remark" style="width:300px;"></el-input>
                            </el-form-item>
                            <el-form-item label=" " label-width="100px">
                                <el-button  @click="add1">保存</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
        
    </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
    data(){
        return{
          activeName:'1', 
          leaveForm:{ //请假表单
             budget:'',
             timeT:'',
             timeH:'',
             startTime:'',
             endTime:'',
             remark:'', 
          },
          rules:{
            budget: [
                {type: 'number',message: '预算必须为数字',trigger: 'blur'}
            ],
            timeT:[
                {type: 'number',message: '天数必须为数字',trigger: 'blur'}
            ],
            timeH:[
                {type: 'number',message: '小时必须为数字',trigger: 'blur'}
            ],
          },
          egressForm:{ // 外出表单
             budget:'',
             timeT:'',
             timeH:'',
             startTime:'',
             endTime:'',
             remark:'',
          },
          overtimeForm:{ //加班表单
             budget:'',
             timeT:'',
             timeH:'',
             startTime:'',
             endTime:'',
             remark:'',
          }, 
          businessForm:{ // 出差表单
             budget:'',
             timeT:'',
             timeH:'',
             startTime:'',
             endTime:'',
             remark:'',
          }, 
        }
    },
    methods:{
        ...mapActions("Tabs", ['triggerDeleteTabs']),
        add1(){
            if(this.activeName == 1){
                if(this.leaveForm.timeT == '' || this.leaveForm.timeH == '' || this.leaveForm.startTime == '' || this.leaveForm.endTime == '' ){
                    this.open('填写完整','error');
                }else{
                this.axios.post('/oa.Days/leave_add',{
                    leave_type:this.activeName,
                    money: this.leaveForm.budget,
                    day:this.leaveForm.timeT,
                    hour:this.leaveForm.timeH,
                    start_time:this.leaveForm.startTime,
                    end_time:this.leaveForm.endTime,
                    content:this.leaveForm.remark,
                }).then(res => {
                        if(res.data.code == 2000){
                            this.open(res.data.msg,'success'); 
                            this.triggerDeleteTabs(this.$route.params.name);
                            this.$router.push({ path: "/oa/Days/leave_select" });
                        }else{
                            this.open(res.data.msg,'error'); 
                        }
                    })   
                }
            }else if(this.activeName == 2){
                if(this.businessForm.timeT == '' || this.businessForm.timeH == '' || this.businessForm.startTime == '' || this.businessForm.endTime == '' ){
                    this.open('填写完整','error');
                }else{
                this.axios.post('/oa.Days/leave_add',{
                    leave_type:this.activeName,
                    money: this.businessForm.budget,
                    day:this.businessForm.timeT,
                    hour:this.businessForm.timeH,
                    start_time:this.businessForm.startTime,
                    end_time:this.businessForm.endTime,
                    content:this.businessForm.remark,
                }).then(res => {
                        if(res.data.code == 2000){
                            this.open(res.data.msg,'success'); 
                            this.triggerDeleteTabs(this.$route.params.name);
                            this.$router.push({ path: "/oa/Days/leave_select" });
                        }else{
                            this.open(res.data.msg,'error'); 
                        }
                    })   
                }
            }else if(this.activeName == 3){
                if(this.egressForm.timeT == '' || this.egressForm.timeH == '' || this.egressForm.startTime == '' || this.egressForm.endTime == '' ){
                    this.open('填写完整','error');
                }else{
                this.axios.post('/oa.Days/leave_add',{
                    leave_type:this.activeName,
                    money: this.egressForm.budget,
                    day:this.egressForm.timeT,
                    hour:this.egressForm.timeH,
                    start_time:this.egressForm.startTime,
                    end_time:this.egressForm.endTime,
                    content:this.egressForm.remark,
                }).then(res => {
                        if(res.data.code == 2000){
                            this.open(res.data.msg,'success'); 
                            this.triggerDeleteTabs(this.$route.params.name);
                            this.$router.push({ path: "/oa/Days/leave_select" });
                        }else{
                            this.open(res.data.msg,'error'); 
                        }
                    })   
                }
            }else if(this.activeName == 4){
                if(this.overtimeForm.timeT == '' || this.overtimeForm.timeH == '' || this.overtimeForm.startTime == '' || this.overtimeForm.endTime == '' ){
                    this.open('填写完整','error');
                }else{
                this.axios.post('/oa.Days/leave_add',{
                    leave_type:this.activeName,
                    money: this.overtimeForm.budget,
                    day:this.overtimeForm.timeT,
                    hour:this.overtimeForm.timeH,
                    start_time:this.overtimeForm.startTime,
                    end_time:this.overtimeForm.endTime,
                    content:this.overtimeForm.remark,
                }).then(res => {
                        if(res.data.code == 2000){
                            this.open(res.data.msg,'success'); 
                            this.triggerDeleteTabs(this.$route.params.name);
                            this.$router.push({ path: "/oa/Days/leave_select" });
                        }else{
                            this.open(res.data.msg,'error'); 
                        }
                    })   
                }
            }
              
        },
        open(a,b){
            this.$message({
                message: a,
                type: b
            });
        },
    },
    created(){

    }
}
</script>

<style lang="less" scoped>
.box{
    .content_box{
        margin-top: 20px;
    }
    .leave{
        margin-top: 20px;
    }
    .egress{
        margin-top: 20px;
    }
    .overtime{
        margin-top: 20px;
    }
    .business{
        margin-top: 20px;
    }
}
</style>

<template>
    <div class="box" style="padding-bottom:20px;overflow: hidden;">
        <div style="float: left;margin-top:0px;">
            <label>筛选发起人：</label>
            <el-input v-model="name" style="width:217px"></el-input>
            <el-button style="margin-left:20px" @click="seach">确定</el-button>
        </div>
        <el-button @click="send" style="float: right;margin-right:20px;">发起</el-button>
        <el-table :data="tableData"  style="width: 100%;padding-top: 10px;">
            <el-table-column prop="task_name"  label="名称"></el-table-column>
            <el-table-column prop="apply_name"  label="发起人"></el-table-column>
            <el-table-column label="参与人" prop="task_user_list"> 
                <template slot-scope="scope">
                    <span v-for="item in scope.row.task_user_list" :key="item">
                        {{item}} 
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="接收部门/负责人">
                <template slot-scope="scope">
                    <span>{{scope.row.dep_name}}/{{scope.row.receive_name}}</span>
                </template>
            </el-table-column>
            <el-table-column label="类型">
                <template slot-scope="scope">
                    <span>{{scope.row.type.type_text}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="start_time"  label="时间" width="155px"></el-table-column>
            <el-table-column label="内容" align="center">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark"  placement="top">
                        <div slot="content" style="width:500px;">{{scope.row.content}}</div>
                        <el-button type="text" size="mini">查看</el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column label="状态">
                <template slot-scope="scope">
                    <span>{{scope.row.status.status_text}}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="210px">
                <template slot-scope="scope" >
                   <el-button size="mini" type="primary" v-if="scope.row.receive_user == zt && scope.row.status.status <= 1" @click="linqu(scope.row)">分配</el-button>
                   <el-button size="mini" type="primary" v-if="scope.row.status.status >= 1" @click="see(scope.row)">查看</el-button>
                   <el-button size="mini" type="primary" v-if="scope.row.status.status == 1 && scope.row.apply_user == zt" @click="wancheng(scope.row)">完成</el-button>
                   <el-button size="mini" type="primary" @click="updata(scope.row)" v-if="scope.row.apply_user == zt && scope.row.status.status <= 0">修改</el-button>  
                   <el-button size="mini" type="danger" @click="deteles(scope.row)" v-if=" (scope.row.apply_user == zt && scope.row.status.status <= 0) || (scope.row.receive_user == 183 && scope.row.status.status <= 0)">删除</el-button>   
                   <el-button size="mini" type="success" @click="shenhe(scope.row)" v-if="BZ == 1 && scope.row.status.status == -1">审核</el-button>  
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

        <el-dialog title="分配任务" :visible.sync="dialogVisible">
            <h2>{{task_name}}</h2>
            <p style="margin-top:10px;">技术委托</p>
            <p style="margin-top:10px;"><span>部门：</span>{{dep_name}}  <span>负责人：</span>{{name}}</p>
            <p style="margin-top:10px;">任务类型：{{task_type_name}}</p>
            <p style="margin-top:10px;margin-bottom:5px;">参与角色</p>
            <template></template>
            <el-form v-for="(item,index) in Options" :key="index" :model="item">
                <el-form-item :label="item.name">
                    <el-select :disabled="show1" v-model="designForm.user_id[index]" placeholder="请选择人员">
                        <el-option v-for="items in item.list" :key="items.user_id" :label="items.name" :value="items.user_id"></el-option>
                    </el-select>
                    <el-input :disabled="show1" type="number" v-model="designForm.work_time1[index]" style="width:100px;margin-left:10px;" :placeholder="item.name == '策划'? '字数1' :'工时1'"></el-input>
                    <el-input :disabled="show1" type="number" v-model="designForm.work_time2[index]" style="width:100px;margin-left:10px;" :placeholder="item.name == '策划'? '字数2' :'工时2'"></el-input>
                </el-form-item>
            </el-form>
           
            <p style="margin-top:10px;">任务明细</p>
            <p>{{ content }}</p>
            

            <p style="margin-top:30px;">需要完成时间：<el-date-picker v-model="end_time" value-format="timestamp" disabled type="date" placeholder="选择日期"></el-date-picker></p>

            <el-button v-show="show"  style="margin-top:20px;" @click="Submission">提交</el-button>
        </el-dialog>

    </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
    data(){
        return{
            show:true,
            show1:true,
            tableData: [], // 表格数据
            name:'',
            currentPage:0,//当前页
            total:0,//总数
            per_page:0,//每页多少条
            last_page:0,//总页数  
            dialogVisible:false, 

            designForm:{
                user_id:[],
                work_time1:[],
                work_time2:[],
            },

            task_id:'',   

            zt:0,
            BZ:'',
            name:'',
            task_name:'',
            dep_name:'',
            task_type_name:'',
            end_time:'',
            content:'',
            Options:[]
            
        }
    },
    methods:{  
        ...mapActions("customerList", ["triggerReplaceId"]),
        ...mapActions("Tabs", ["triggerAddTabs", "triggerSetActiveIndex"]),
         gettableData(){
            this.axios.get('/oa.Days/task_select').then(res => {
                this.tableData = res.data.data.data; 
                this.currentPage = res.data.data.current_page;
                this.total = res.data.data.total;
                this.per_page = res.data.data.per_page;
                this.last_page = res.data.data.last_page;
                this.zt = res.data.user_id;
                this.BZ= res.data.bazhang;
            })
        },
        // 分页 
        handleCurrentChange(val) {
            const loading = this.$loading({
            lock: true,
            text: '拼命加载中',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
            });
            this.axios.post('/oa.Days/task_select',{
                page:val,
                task_user:this.$route.params.name
            }).then(res => {
                this.tableData = res.data.data.data;
                this.currentPage = res.data.data.current_page;
                this.total = res.data.data.total;
                this.per_page = res.data.data.per_page;
                this.last_page = res.data.data.last_page;
                loading.close();
            })  
        },
        seach(){
            this.axios.post('/oa.Days/task_select',{
                name:this.name
            }).then(res => {
                this.tableData = res.data.data.data; 
                this.currentPage = res.data.data.current_page;
                this.total = res.data.data.total;
                this.per_page = res.data.data.per_page;
                this.last_page = res.data.data.last_page;
            })
        },
        // 统计跳转 获取数据
        tongData(a){
            this.axios.post('/oa.Days/task_select',{
                task_user:a
            }).then(res => {
                this.tableData = res.data.data.data; 
                this.currentPage = res.data.data.current_page;
                this.total = res.data.data.total;
                this.per_page = res.data.data.per_page;
                this.last_page = res.data.data.last_page;
            })  
        },
        // 发起
        send(a){
            this.$router.push({ path:'/oa/Days/task_add/0'});
            let ins1 = {
                route: `/oa/Days/task_add/0`,
                name: "任务发起/修改",
                id: a.id
            };
            let ins2 = `/oa/Days/task_add/0`;
            this.triggerAddTabs(ins1);
            this.triggerSetActiveIndex(ins2);  
        },
        updata(a){
            this.$router.push({ path:`/oa/Days/task_add/${a.id}`});
            let ins1 = {
                route: `/oa/Days/task_add/${a.id}`,
                name: "任务发起/修改",
                id: a.id
            };
            let ins2 = `/oa/Days/task_add/${a.id}`;
            this.triggerAddTabs(ins1);
            this.triggerSetActiveIndex(ins2);
        },
        deteles(a){
          this.axios.post('/oa.Days/task_delete',{
              id:a.id
          }).then(res => {
                 if(res.data.code == 2000){
                        this.open(res.data.msg,'success');
                        
                        this.gettableData();
                }else{
                        this.open(res.data.msg,'error');
                    } 
          })  
        },
        // 审核
        shenhe(a){
            this.axios.post('/oa.Days/task_done',{
                id:a.id,
                status:'0',
            }).then(res => {
                if(res.data.code == 2000){
                    this.open(res.data.msg,'success');
                    this.gettableData();
                }else{
                    this.open(res.data.msg,'error');
                } 
            })
        },
        // 领取
        linqu(a){
            this.designForm.user_id=[]
            this.designForm.work_time1=[]
            this.designForm.work_time2=[]
            this.axios.get('/oa.Days/task_assign?id='+a.id).then(res => {
                this.show = true;
                this.show1 = false;
                this.Options = res.data.role_list;
                this.name= res.data.data.name;
                this.task_name = res.data.data.task_name;
                this.task_type_name = res.data.data.task_type_name;
                this.end_time = res.data.data.end_time*1000;
                this.content = res.data.data.content;
                this.dep_name = res.data.data.dep_name;
                this.dialogVisible = true;
                this.task_id = res.data.data.id;
                let arr = res.data.task_user_list
                arr.map(item => {
                  this.designForm.user_id.push(item.task_user)
                  this.designForm.work_time1.push(item.work_time1)
                  this.designForm.work_time2.push(item.work_time2)
                })
            })
        },
        see(a){
            this.designForm.user_id= []
            this.designForm.work_time1=[]
            this.designForm.work_time2=[]
            this.axios.get('/oa.Days/task_assign?id='+a.id).then(res => {
                this.show = false;
                this.show1 = true;
                this.Options = res.data.role_list;
                this.name= res.data.data.name;
                this.task_name = res.data.data.task_name;
                this.task_type_name = res.data.data.task_type_name;
                this.end_time = res.data.data.end_time*1000;
                this.content = res.data.data.content;
                this.dep_name = res.data.data.dep_name;
                this.dialogVisible = true;
                this.task_id = a.id
                let arr = res.data.task_user_list
                arr.map(item => {
                  this.designForm.user_id.push(item.task_user)
                  this.designForm.work_time1.push(item.work_time1)
                  this.designForm.work_time2.push(item.work_time2)
                })
            })
        },
        Submission(){
            let b = [];
            let i = this.designForm.user_id.length;
            for(let z = 0 ;z< i ;z ++){
                let bb = {
                  user_id:this.designForm.user_id[z],
                  work_time1:this.designForm.work_time1[z],
                  work_time2:this.designForm.work_time2[z],
                }
                b.push(bb);
            }      
            this.axios.post('/oa.Days/task_assign',{
                task_id:this.task_id,
                task_user:b,
            }).then(res => {
                if(res.data.code == 2000){
                        this.open(res.data.msg,'success');
                        this.dialogVisible = false;
                        this.gettableData();
                    }else{
                        this.open(res.data.msg,'error');
                    } 
            })
        },
        // 完成
        wancheng(a){
            this.axios.post('/oa.Days/task_done',{
                id:a.id,
                status:'2',
            }).then(res => {
                if(res.data.code == 2000){
                    this.open(res.data.msg,'success');
                    this.gettableData();
                }else{
                    this.open(res.data.msg,'error');
                } 
            })
        },
        // 公用弹窗
        open(a,b){
            this.$message({
            message: a,
            type: b
            });
        },
    },
    activated(){
        console.log(this.$route.params.name)
        if(this.$route.params.name != undefined){
            this.tongData(this.$route.params.name)
        }else{
            this.gettableData();
        }
        
    }
}
</script>

<style lang="less" scoped>

</style>





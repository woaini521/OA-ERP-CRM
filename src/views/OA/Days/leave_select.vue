<template>
    <div class="box">
        <el-button @click="add">发起</el-button>
        <div class="box_head">
            <label>姓名：</label>
            <el-input placeholder="名称" v-model="seachName" style="width:180px;margin-left:10px"></el-input>
            <label>开始日期：</label>
            <el-date-picker v-model="seachStart" type="date"  style="width:180px;" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd"></el-date-picker>
            <label>结束日期：</label>
            <el-date-picker v-model="seachEnd" type="date" style="width:180px;" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd"></el-date-picker>
            <label>审批情况：</label>
            <el-select v-model="value" placeholder="请选择" clearable style="width:100px;">
                <el-option label="巴长审批中" value="1"></el-option>
                <el-option label="人事审批中" value="2"></el-option>
                <el-option label="完成" value="3"></el-option>
            </el-select>
            <el-button type="primary" @click="seach"  style="margin-left:20px;">搜索</el-button>
           
             
        </div>
        <div class="content_box">
            <el-table :data="tableData">
                <el-table-column label="名字" prop="name" width="80"></el-table-column>
                <el-table-column label="类型" width="60">
                    <template slot-scope="scope">
                        <span>{{ scope.row.leave_type.leave_type_text }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="开始时间" width="155">
                    <template slot-scope="scope">
                        <span>{{ scope.row.start_time }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="结束时间" width="155">
                    <template slot-scope="scope">
                        <span>{{ scope.row.end_time }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="预算" prop="money"  width="70"></el-table-column>
                <el-table-column label="天数"  width="135">
                    <template slot-scope="scope">
                        <span>{{scope.row.day}}天/{{scope.row.hour}}小时</span>
                    </template>
                </el-table-column>
                <el-table-column label="进度" prop="leave_flow_text"  width="110">
                    <template slot-scope="scope">
                        <span>{{scope.row.leave_flow.leave_flow_text}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="备注" prop="content"></el-table-column>
                <el-table-column label="状态" prop="status"  width="90">
                    <template slot-scope="scope">
                        <span>{{ scope.row.status.status_text }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="210">
                    <template slot-scope="scope">
                        <el-button type="primary" v-if="scope.row.status.status == 0 && zt == scope.row.user_id" @click="update(scope.row)" size="mini">修改</el-button>
                        <el-button type="success" :disabled="scope.row.shenpi == 0" @click="shenhe(scope.row)" size="mini">审核</el-button>
                        <el-button type="danger" @click="shanchu(scope.row)" :disabled="scope.row.status.status > 2" size="mini">删除</el-button>
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

        <el-dialog title="审批" :visible.sync="dialogshenp">
            <el-form :model="shenpForm">
                <el-form-item label="原因">
                    <p style="font-weight:bold">{{yuanyin}}</p>
                </el-form-item>
                <el-form-item label="选项">
                      <el-radio v-model="shenpForm.radio" label="1">同意</el-radio>
                      <el-radio v-model="shenpForm.radio" label="2">拒绝</el-radio>
                </el-form-item>
                <el-form-item label="备注">
                      <el-input type="textarea" v-model="shenpForm.text" style="width:320px"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogshenp = false">取 消</el-button>
                <el-button type="primary" @click="confirm">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
    data(){
        return{
            seachName:'',
            seachStart:'',
            seachEnd:'',
            value:'',
            
            tableData:[],
            currentPage:0,//当前页
            total:0,//总数
            per_page:0,//每页多少条
            last_page:0,//总页数
            dialogshenp:false,
            shenpForm:{
               id:'',
               radio:'', 
               text:'',
            },
            yuanyin:'',
            VS:'',
            zt:'',
        }
    },
    methods:{
        ...mapActions("customerList", ["triggerReplaceId"]),
        ...mapActions("Tabs", ["triggerAddTabs", "triggerSetActiveIndex"]),
        gettableData(){
            this.axios.get('/oa.Days/leave_select').then(res =>{
                this.tableData = res.data.data.data;
                this.currentPage = res.data.data.current_page;
                this.total = res.data.data.total;
                this.per_page = res.data.data.per_page;
                this.last_page = res.data.data.last_page;
                this.zt = res.data.user_id;
            })
        },
         // 分页切换
        handleCurrentChange(val) {
            this.VS = val;
            const loading = this.$loading({
                lock: true,
                text: '拼命加载中',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            this.axios.post('/oa.Days/leave_select',{
                page:val,
                name:this.seachName,
                start_time:this.seachStart,
                end_time:this.seachEnd,
                leave_flow:this.value,
            }).then(res => {
                this.tableData = res.data.data.data;
                this.currentPage = res.data.data.current_page;
                this.total = res.data.data.total;
                this.per_page = res.data.data.per_page;
                this.last_page = res.data.data.last_page;
                loading.close();
            })  
        },
        // 筛选 
        seach(){
            const loading = this.$loading({
                lock: true,
                text: '拼命加载中',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            this.axios.post('/oa.Days/leave_select',{
                name:this.seachName,
                start_time:this.seachStart,
                end_time:this.seachEnd,
                leave_flow:this.value,
            }).then(res => {
                this.tableData = res.data.data.data;
                this.currentPage = res.data.data.current_page;
                this.total = res.data.data.total;
                this.per_page = res.data.data.per_page;
                this.last_page = res.data.data.last_page;
                loading.close();
            })  
        },
        // 发起
        add(){
          this.$router.push({ path:'/oa/Days/add'});
          let ins1 = {
            route: `/oa/Days/add`,
            name: "发起申请",
          };
          let ins2 = `/oa/Days/add`;
          this.triggerAddTabs(ins1);
          this.triggerSetActiveIndex(ins2);  
        },
        update(a){
            this.$router.push({ name:'发起申请',params:{id:a.id,type:a.leave_type.leave_type,} });
            let ins1 = {
                route: `/oa/Days/add`,
                name: "发起申请",
            };
            let ins2 = `/oa/Days/add`;
            this.triggerAddTabs(ins1);
            this.triggerSetActiveIndex(ins2); 
        },
        // 审核
        shenhe(a){
            this.axios.post('/oa.Days/leave_check',{
                id:a.id
            }).then(res => {
                if(res.data.code == 1){
                    this.dialogshenp = true;
                    this.shenpForm.id = a.id;
                    this.yuanyin = res.data.data;
                }else{
                    this.open(res.data.msg,'error'); 
                } 
            })
        },
        confirm(){
            if(this.shenpForm.radio == 2){
                if(this.shenpForm.text == ''){
                    this.open('填写拒绝原因','error')
                }else{
                    this.axios.post('/oa.Days/leave_check_submit',{
                        id:this.shenpForm.id,
                        status:this.shenpForm.radio,
                        remark:this.shenpForm.text
                    }).then(res => {
                        if(res.data.code == 2000){
                            this.dialogshenp = false;
                            this.handleCurrentChange(this.VS);
                            this.open(res.data.msg,'success'); 
                        }else{
                            this.open(res.data.msg,'error'); 
                        }  
                    })
                }  
            }else{
                this.axios.post('/oa.Days/leave_check_submit',{
                        id:this.shenpForm.id,
                        status:this.shenpForm.radio,
                        remark:this.shenpForm.text
                    }).then(res => {
                        if(res.data.code == 2000){
                            this.dialogshenp = false;
                            this.handleCurrentChange(this.VS);
                            this.open(res.data.msg,'success'); 
                        }else{
                            this.open(res.data.msg,'error'); 
                        }  
                    })
            }
            
        },
        open(a,b){
            this.$message({
                message: a,
                type: b
            });
        },
        // 删除
        shanchu(a){
            this.axios.post('/oa.Days/leave_delete',{
                id:a.id
            }).then(res => {
                if(res.data.code == 2000){
                    this.gettableData();
                    this.open(res.data.msg,'success'); 
                }else{
                    this.open(res.data.msg,'error'); 
                }
            })
        }
    },
    activated(){
        this.gettableData();
    },
    // watch:{
    //     $route(to){
    //         this.gettableData();  
    //     }
    // },
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
    .box_head{
        margin-top: 20px;
    }
    .content_box{
        margin-top: 20px;
    }
}
</style>

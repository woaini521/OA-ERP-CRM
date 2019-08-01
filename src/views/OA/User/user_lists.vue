<template>
    <div class="box">
        <el-button type="warning" @click="add" style="margin-top:10px;">添加员工</el-button>
        <div class="box_head">
            <label>姓名：</label>
            <el-input v-model="seachName" style="width:200px;margin-right:30px;"></el-input>
            <label>手机：</label>
            <el-input v-model="seachPhone" style="width:200px;margin-right:30px;"></el-input>
            <label>在职情况：</label>
            <el-select v-model="seachState" placeholder="请选择" style="width:80px;margin-right:30px;">
                <el-option label="全部" value="0"></el-option>
                <el-option label="在职" value="1"></el-option>
                <el-option label="离职" value="2"></el-option>
            </el-select>
            <label>总人数：{{ total }}</label>
            <el-button type="primary" @click="seach"  style="margin-left:20px;">搜索</el-button>
        </div>

        <div class="content_box">
            <el-table :data="tableData">
                <el-table-column label="姓名" prop="name"></el-table-column>
                <el-table-column label="部门" prop="dep_title"></el-table-column>
                <el-table-column label="手机" prop="phone"></el-table-column>
                <el-table-column label="角色" prop="role_name"></el-table-column>
                <el-table-column label="工作手机" prop="work_phone"></el-table-column>
                <el-table-column label="入职日期">
                    <template slot-scope="scope">
                        <span>{{ scope.row.hiredate*1000 | formatDate }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="员工生日">
                    <template slot-scope="scope">
                        <span>{{ scope.row.birthday*1000 | formatDate }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="状态">
                        <template slot-scope="scope">
                            <span v-if="scope.row.status == 1">在职</span>
                            <span v-if="scope.row.status == 0">离职</span>
                        </template>
                </el-table-column>
                <el-table-column label="操作" width="180px">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" @click="updata(scope.row)">修改</el-button>
                        <el-button type="danger" size="mini" @click="daily(scope.row)">日常权限</el-button>
                    </template>
                </el-table-column>
            </el-table>
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
        <!-- 日常权限 -->
        <el-dialog title="日常权限" :visible.sync="dialogDaily">
            <el-form :model="formDaily">
                <el-form-item label="级别" label-width="90px">
                    <el-select v-model="formDaily.level" placeholder="请选择">
                        <el-option v-for="item in options_level" :key="item.id" :label="item.title" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="审核部门" label-width="90px">
                    <el-select v-model="formDaily.dep" multiple  placeholder="请选择">
                        <el-option v-for="item in options_dep" :key="item.id" :label="item.title" :value="item.id"></el-option>
                    </el-select>  
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogDaily = false">取 消</el-button>
                <el-button type="primary" @click="addDaily">确 定</el-button>
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
            seachPhone:'',
            seachState:'0',
            tableData:[],// 表格数据
            currentPage:0,//当前页
            total:0,//总数
            per_page:0,//每页多少条
            last_page:0,//总页数
            page:0,
            dialogDaily:false,
            formDaily:{
                level:'',
                dep:[],
                user_id:'',
                id:'',
            },
            options_level:[
                {
                    id:1,
                    title:'巴长'
                },
                {
                    id:2,
                    title:'人事'
                },
                {
                    id:3,
                    title:'副总'
                },
                {
                    id:4,
                    title:'总经理'
                },
            ],
            options_dep:[],
        }
    },
    methods:{
         ...mapActions("customerList", ["triggerReplaceId"]),
        ...mapActions("Tabs", ["triggerAddTabs", "triggerSetActiveIndex"]),
        // 获取表格数据
        gettableData(){
            // const loading = this.$loading({
            //     lock: true,
            //     text: '拼命加载中',
            //     spinner: 'el-icon-loading',
            //     background: 'rgba(0, 0, 0, 0.7)'
            // });
           this.axios.get('/oa.User/user_lists').then(res => {
                this.tableData = res.data.data;
                this.currentPage = res.data.current_page;
                this.total = res.data.total;
                this.per_page = res.data.per_page;
                this.last_page = res.data.last_page;
               // loading.close();
           }) 
        },
        // 分页切换
        handleCurrentChange(val) {
            const loading = this.$loading({
                lock: true,
                text: '拼命加载中',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            this.page = val;
            this.axios.post('/oa.User/user_lists',{
                page:val,
                name:this.seachName,
                phone:this.seachPhone,
                status:this.seachState,
            }).then(res => {
                this.tableData = res.data.data;
                this.currentPage = res.data.current_page;
                loading.close();
            })  
        },
        // 搜索
        seach(){
            this.axios.post('/oa.User/user_lists',{
                name:this.seachName,
                phone:this.seachPhone,
                status:this.seachState,
            }).then(res => {
                this.tableData = res.data.data;
                this.currentPage = res.data.current_page;
                this.total = res.data.total;
                this.per_page = res.data.per_page;
                this.last_page = res.data.last_page; 
            })
        },
        updata(a){
            this.triggerReplaceId(a.user_id);
            this.$router.push({ path: `/oa/User/user_update/${a.user_id}`,params:{userId:a.user_id,name:`/oa/User/user_update/${a.user_id}`}});
            let ins1 = {
                route: `/oa/User/user_update/${a.user_id}`,
                name: "员工信息修改",
                id: a.user_id
            };
            let ins2 = `/oa/User/user_update/${a.user_id}`;
            this.triggerAddTabs(ins1);
            this.triggerSetActiveIndex(ins2);
        },
        // 添加员工
        add(){
            this.triggerReplaceId('0');
            this.$router.push({ path: `/oa/User/user_update/0`,params:{userId:'0',name:`/oa/User/user_update/0`}});
            let ins1 = {
                route: `/oa/User/user_update/0`,
                name: "员工信息修改",
                id: '0'
            };
            let ins2 = `/oa/User/user_update/0`;
            this.triggerAddTabs(ins1);
            this.triggerSetActiveIndex(ins2);   
        },
        // 日常权限
        daily(a){
            this.axios.get('/oa.User/verify_update?user_id='+a.user_id).then(res => {
                this.options_dep = res.data.user_dep;
                if(res.data.verify !== null){
                    this.formDaily.level = res.data.verify.level;
                    let d = res.data.verify.dep;
                    this.formDaily.dep = d.split(',').map(Number);
                    this.formDaily.id = res.data.verify.id;
                }else{
                    this.formDaily.level = '';  
                    this.formDaily.dep = []
                }     
            });
           
            this.formDaily.user_id = a.user_id;    
            this.dialogDaily = true;
        },
        // 提交日常权限
        addDaily(){
            this.axios.post('/oa.User/verify_update',{
                id:this.formDaily.id,
                user_id:this.formDaily.user_id,
                level:this.formDaily.level,
                dep:this.formDaily.dep.join(','),
            }).then(res => {
                if(res.data.code == 2000){
                    this.$message({
                        message: res.data.msg,
                        type: 'success'
                    });
                    this.dialogDaily = false;
                }else{
                    this.$message({
                        message: res.data.msg,
                        type: 'error'
                    });
                }
            })
        },


    },
    created(){
        this.gettableData();
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
    watch:{
        $route(to){
           this.handleCurrentChange(this.page);  
        }
    }
}
</script>

<style lang="less" scoped>
.box{
    min-width: 998px;
    .box_head{
        margin-top: 10px;

    }
}
</style>

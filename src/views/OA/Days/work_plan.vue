<template>
    <div class="box">
        <div style="float: left;">
            <label>筛选:</label>
            <el-date-picker v-model="time" value-format="timestamp" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>
            <el-button @click="seach" style="margin-left:20px">搜索</el-button>
        </div>
        <el-button @click="add" style="float: right;" type="primary">新增</el-button>
        <el-table :data="tableData" class="work">
            <el-table-column type="index" width="50"></el-table-column>
            <el-table-column label="部门" prop="dep_name" width="120px"></el-table-column>
            <el-table-column label="销售员" prop="name" width="70px"></el-table-column>
            <el-table-column label="计划日期" prop="add_time" width="120px"></el-table-column>
            <el-table-column label="电话量" prop="phone_sum" width="70px"></el-table-column>
            <el-table-column label="回款额" prop="back_money" width="80px"></el-table-column>
            <el-table-column label="销售额" prop="sell_money" width="80px"></el-table-column>
            <el-table-column label="计划内容" prop="content"></el-table-column>
            <el-table-column label="操作" width="100px">
                <template slot-scope="scope">
                    <el-button type="danger" size="mini" v-if="ID == scope.row.user_id && shi ===scope.row.add_time" @click="update(scope.row)">删除</el-button>
                </template>    
            </el-table-column>   
        </el-table>
        <el-dialog title="新增修改" :visible.sync="dialogUpdate">
            <el-form :model="dialogUpdateForm">
                <el-form-item label="计划日期" label-width="90px">
                    <el-date-picker v-model="dialogUpdateForm.add_time" disabled type="date" placeholder="选择日期" value-format="timestamp"></el-date-picker>
                </el-form-item>
                <el-form-item label="电话量" label-width="90px">
                    <el-input type="number" v-model="dialogUpdateForm.phone_sum" style="width:40%"></el-input>
                </el-form-item>
                <el-form-item label="回款额" label-width="90px">
                    <el-input type="number" v-model="dialogUpdateForm.back_money"  style="width:40%"></el-input>
                </el-form-item>
                <el-form-item label="销售额" label-width="90px">
                     <el-input type="number" v-model="dialogUpdateForm.sell_money" style="width:40%"></el-input>
                </el-form-item>
                <el-form-item label="计划内容" label-width="90px">
                    <el-input type="textarea" v-model="dialogUpdateForm.content" style="width:70%"></el-input>
                </el-form-item>
                <el-form-item label=" " label-width="90px">
                   <el-button @click="comfile" v-if="show">提交</el-button>
                   <el-button :loading="true" disabled v-if="!show">提交中</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            ID:'',
            shi:'',
            time1:Number,
            time:null,
            bb_time:'',
            tableData:[],
            dialogUpdate:false,
            dialogUpdateForm:{
                id:'',
                add_time:Number,
                phone_sum:'',
                back_money:'',
                sell_money:'',
                content:'',
            },
            show:true
        }
    },
    methods:{
        //获取数据
        gettableData(){
            this.axios.post('/oa.Days/work_plan_select',{
                start_time:this.bb_time,
                end_time:this.bb_time,
            }).then(res => {
                this.tableData = res.data.data;
                this.ID = res.data.user_id
            })
        },
        // 新增 工作计划
        add(){
            this.dialogUpdate = true;
            let d=new Date();
            let year=d.getFullYear();
            let month=this.change(d.getMonth()+1);
            let day=this.change(d.getDate());
            let bb = year+'-'+month+'-'+day;
            this.dialogUpdateForm.add_time = this.getTimestamp(bb);
            this.dialogUpdateForm.id = '';
            this.dialogUpdateForm.phone_sum = '';
            this.dialogUpdateForm.back_money = '';
            this.dialogUpdateForm.sell_money = '';
            this.dialogUpdateForm.content = '';
        },
        // 新增 修改  数据提交
        comfile(){
            this.show = false;
            if(this.dialogUpdateForm.id == ''){
                if(this.dialogUpdateForm.phone_sum == '' || this.dialogUpdateForm.back_money == '' || this.dialogUpdateForm.sell_money == '' || this.dialogUpdateForm.content == ''){
                    this.$message({
                            showClose: true,
                            message: '请填写完整',
                            type: 'error'
                        });
                }else{
                    this.axios.post('/oa.Days/work_plan_add',{
                        add_time:this.dialogUpdateForm.add_time/1000,
                        phone_sum:this.dialogUpdateForm.phone_sum,
                        back_money:this.dialogUpdateForm.back_money,
                        sell_money:this.dialogUpdateForm.sell_money,
                        content:this.dialogUpdateForm.content,
                    }).then(res => {
                        if(res.data.code == 2000){
                            this.dialogUpdate = false;
                            this.show = true;
                            this.gettableData();
                            this.$message({
                                showClose: true,
                                message: res.data.msg,
                                type: 'success'
                            });
                        }else{
                            this.show = true;
                            this.$message({
                                showClose: true,
                                message: res.data.msg,
                                type: 'error'
                            });
                        }
                    })
                }
                
            }else{
                this.axios.post('/oa.Days/work_plan_update',{
                   add_time:this.dialogUpdateForm.add_time/1000,
                   phone_sum:this.dialogUpdateForm.phone_sum,
                   back_money:this.dialogUpdateForm.back_money,
                   sell_money:this.dialogUpdateForm.sell_money,
                   content:this.dialogUpdateForm.content,
                   id:this.dialogUpdateForm.id
                }).then(res => {
                    if(res.data.code == 2000){
                        this.gettableData();
                        this.dialogUpdate = false;
                        this.$message({
                            showClose: true,
                            message: res.data.msg,
                            type: 'success'
                        });
                    }else{
                        this.$message({
                            showClose: true,
                            message: res.data.msg,
                            type: 'error'
                        });
                    }
                })
            }
        },
        // 修改按钮
        update(a){
           this.axios.post('/oa.Days/work_plan_delete',{
                id:a.id
            }).then(res => {
                if(res.data.code == 2000){
                    this.gettableData();
                    this.$message({
                        showClose: true,
                        message: res.data.msg,
                        type: 'success'
                    });
                }else{
                    this.$message({
                        showClose: true,
                        message: res.data.msg,
                        type: 'error'
                    });
                }
            })
        },
        // 搜索
        seach(){
            let a,b ;
            if(this.time == null){
                a='';
                b='';
            }else{
                a=this.time[0]/1000;
                b=this.time[1]/1000;
            }
            this.axios.post('/oa.Days/work_plan_select',{
                start_time:a,
                end_time:b
            }).then(res => {
                this.tableData = res.data.data;
            })
        },
        // 默认时间
        change(t){
            if(t<10){
                return "0"+t;
            }else{
                return t;
            }
        },
        getTimestamp (mytime){
            let dateTmp = mytime.replace(/-/g,'/')
            return Date.parse(dateTmp)
        },
    },
    activated(){
        let d=new Date();
        let year=d.getFullYear();
        let month=this.change(d.getMonth()+1);
        let day=this.change(d.getDate());
        this.shi = year+'-'+month+'-'+day;
        let bb = year+'-'+month+'-'+day;
        this.bb_time = this.getTimestamp(bb)/1000;
        this.gettableData()
    }
}
</script>

<style lang="less">
.work td,.work th{
    padding-top: 0px !important;
    padding-bottom: 0px !important;
}
</style>
<template>
    <div class="box">
        <div class="head_box">
            <label>选择月份：</label>
            <el-date-picker v-model="value" value-format="yyyy-MM" type="month" placeholder="选择月"></el-date-picker>
            <el-button style="margin-left:20px" @click="confirm">确定</el-button>
        </div>
        <el-table :data="shuju" style="margin-top:20px">
            <el-table-column label="名称" width="140px">
                <template slot-scope="scope">
                    <span>{{ scope.row.dep_name }}/{{ scope.row.name }}</span>
                </template>
            </el-table-column> 
            <el-table-column label="请假" >
                <el-table-column label="次数" prop="qj_cishu"  width="80px" align="center"></el-table-column>
                <el-table-column label="天数" prop="qj_tian"  width="80px" align="center"></el-table-column>
                <el-table-column label="小时" prop="qj_xiaoshi"  width="80px" align="center"></el-table-column>
            </el-table-column>
            <el-table-column label="出差">
                <el-table-column label="次数" prop="cc_cishu" width="80px" align="center"></el-table-column>
                <el-table-column label="天数" prop="cc_tian"  width="80px" align="center"></el-table-column>
                <el-table-column label="小时" prop="cc_xiaoshi"  width="80px" align="center"></el-table-column>
            </el-table-column>
            <el-table-column label="外出">
                <el-table-column label="次数" prop="wc_cishu"  width="80px" align="center"></el-table-column>
                <el-table-column label="天数" prop="wc_tian"  width="80px" align="center"></el-table-column>
                <el-table-column label="小时" prop="wc_xiaoshi"  width="80px" align="center"></el-table-column>
            </el-table-column>
            <el-table-column label="考勤天数">
                <template slot-scope="scope">
                    <el-input type="number" v-model="scope.row.chuqin" @change="Psotcount(scope.row)"></el-input>
                </template>
            </el-table-column>
            <el-table-column label="迟到扣款">
                <template slot-scope="scope">
                    <el-input type="number" v-model="scope.row.money" @change="Psottime(scope.row)"></el-input>
                </template>
            </el-table-column>

        </el-table>
    </div>
</template>

<script>
export default {
    data(){
        return{
            shuju:[],
            options:[
                {
                    lable:'1月份',
                    value:'01'
                },
                {
                    lable:'2月份',
                    value:'02'
                },
                {
                    lable:'3月份',
                    value:'03'
                },
                {
                    lable:'4月份',
                    value:'04'
                },
                {
                    lable:'5月份',
                    value:'05'
                },
                {
                    lable:'6月份',
                    value:'06'
                },
                {
                    lable:'7月份',
                    value:'07'
                },
                {
                    lable:'8月份',
                    value:'08'
                },
                {
                    lable:'9月份',
                    value:'09'
                },
                {
                    lable:'10月份',
                    value:'10'
                },
                {
                    lable:'11月份',
                    value:'11'
                },
                {
                    lable:'12月份',
                    value:'12'
                },
            ],
            value:'',
            times:null,
        }
    },
    methods:{
        getshuju(){
            this.axios.get('/report.User/leave_count').then(res => {
                this.shuju = res.data
            })
        },
        confirm(){
            this.axios.post('/report.User/leave_count',{
                month:this.value,
            }).then(res => {
                this.shuju = res.data
            })
        },
        Psotcount(val){
            //console.log(val)
            val['month'] = this.value
            this.axios.post('/report.User/leave_count_add',val).then(res => {

            })
        },
        Psottime(val){
            val['month'] = this.value
            this.axios.post('/report.User/leave_count_add',val).then(res => {
                
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
    },
    created(){
        let d=new Date();
        let year=d.getFullYear();
        let mouth=this.change(d.getMonth()+1);
        this.value = year+'-'+mouth
        this.getshuju()
    }
}
</script>

<style lang="less" scoped>

</style>
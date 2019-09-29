<template>
    <div class="box">
        <div class="head_box">
            <label>选择月份：</label>
            <el-date-picker v-model="value" value-format="yyyy-MM" type="month" placeholder="选择月"></el-date-picker>
            <el-button style="margin-left:20px" @click="confirm">确定</el-button>
        </div>
        <el-table :data="shuju" style="margin-top:20px"  :height="fullHeight">
            <el-table-column label="名称" width="150">
                <template slot-scope="scope">
                    <span>{{ scope.row.dep_name }}/{{ scope.row.name }}</span>
                </template>
            </el-table-column> 
            <el-table-column label="请假" >
                <el-table-column label="次数" prop="qj_cishu"  width="80" align="center"></el-table-column>
                <el-table-column label="天数" prop="qj_tian"  width="80" align="center"></el-table-column>
                <el-table-column label="小时" prop="qj_xiaoshi"  width="80" align="center"></el-table-column>
            </el-table-column>
            <el-table-column label="出差">
                <el-table-column label="次数" prop="cc_cishu" width="80" align="center"></el-table-column>
                <el-table-column label="天数" prop="cc_tian"  width="80" align="center"></el-table-column>
                <el-table-column label="小时" prop="cc_xiaoshi"  width="80" align="center"></el-table-column>
            </el-table-column>
            <el-table-column label="外出">
                <el-table-column label="次数" prop="wc_cishu"  width="80" align="center"></el-table-column>
                <el-table-column label="天数" prop="wc_tian"  width="80" align="center"></el-table-column>
                <el-table-column label="小时" prop="wc_xiaoshi"  width="80" align="center"></el-table-column>
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
            value:'',
            tableHeader:[
                {
                    label:'部门',
                    porps:'dep_name',
                },
                {
                    label:'名称',
                    porps:'name',
                },
                {
                    label:'请假',
                    porps:'请假',
                    child:[
                        {
                           label:'次数',
                           porps:'qj_cishu',  
                        },
                        {
                           label:'天数',
                           porps:'qj_tian',  
                        },
                        {
                           label:'小时',
                           porps:'qj_xiaoshi',  
                        },
                    ]
                },
                {
                    label:'出差',
                    porps:'出差',
                    child:[
                        {
                           label:'次数',
                           porps:'cc_cishu',  
                        },
                        {
                           label:'天数',
                           porps:'cc_tian',  
                        },
                        {
                           label:'小时',
                           porps:'cc_xiaoshi',  
                        },
                    ]
                },
                {
                    label:'外出',
                    porps:'外出',
                    child:[
                        {
                           label:'次数',
                           porps:'wc_cishu',  
                        },
                        {
                           label:'天数',
                           porps:'wc_tian',  
                        },
                        {
                           label:'小时',
                           porps:'wc_xiaoshi',  
                        },
                    ]
                },
                {
                    label:'考勤天数',
                    porps:'考勤天数',
                },
                {
                    label:'迟到扣款',
                    porps:'迟到扣款',
                },
            ],
            fullHeight:document.documentElement.clientHeight-200,
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
        input(e){
          this.times = e;
        },
        chuqin(e){
             this.times = e;
        },
        tableColumn(h,col){
            const slotScope = {
               scopedSlots:{
                    default(scope){
                        console.log(scope.row[col.porps])
                        return scope.row[col.porps]
                    }
                }
            }
            if(col.child){
                return (<el-table-column label={col.label} {...slotScope}>
                            {col.child.map(item => {
                                return this.tableColumn(h,item)
                            })}
                        </el-table-column>
                ) 
            }else {
                return (<el-table-column label={col.label} porps={col.porps} {...slotScope}>
                            
                        </el-table-column>
                )
            }
        }
    },
    // render(){
    //     return(
    //         <div class="box">
    //             <div class="head_box">
    //                 <label>选择月份：</label>
    //                 <el-date-picker  value={this.value} onInput={this.input} value-format="yyyy-MM" type="month" placeholder="选择月"></el-date-picker>
    //                 <el-button style="margin-left:20px" onClick={this.confirm}>确定</el-button>
    //             </div>
    //             <el-table data={this.shuju} style="margin-top:20px">
    //                 {this.tableHeader.map(item => {
    //                     return this.tableColumn(h,item)
    //                 })}
    //             </el-table>
    //         </div>
    //     )
    // },
    created(){
        const that = this;
        window.onresize = () => {
            return (() => {
              window.fullHeight = document.documentElement.clientHeight;
              that.fullHeight = window.fullHeight
            })()
        };
        let d=new Date();
        let year=d.getFullYear();
        let mouth=that.change(d.getMonth()+1);
        that.value = year+'-'+mouth
        that.getshuju()
    }
}
</script>

<style lang="less" scoped>

</style>
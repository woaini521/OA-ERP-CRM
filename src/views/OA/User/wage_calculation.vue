<template>
    <div class="box">
        <div>
            <label>筛选：</label>
            <el-date-picker v-model="time" value-format="yyyy-MM" type="month" placeholder="选择月"></el-date-picker>
            <el-button style="margin-left:20px" @click="seach">搜索</el-button>
        </div>
        <el-table :data="tableData" :height="fullHeight" border style="margin-top:5px">
            <el-table-column label="职位" prop="group_name" width="110"></el-table-column>
            <el-table-column label="名称" prop="dep_id" sortable width="150">
                <template slot-scope="scope">
                    <span>{{ scope.row.dep_title }}/{{ scope.row.name }}</span>
                </template>
            </el-table-column>
            <el-table-column label="入职日期" prop="hiredate"  width="110">
                <template slot-scope="scope">
                    <span>{{ scope.row.hiredate*1000 | formatDate}}</span>
                </template>
            </el-table-column>
            <el-table-column label="基本工资" prop="salary"  width="130">
                <template slot-scope="scope">
                    <span>{{scope.row.salary}}</span><el-button v-if="scope.row.group_name != '电销'" type="text" @click="xishu(scope.row)" size="mini">系数</el-button>
                </template>
            </el-table-column>
            <el-table-column label="实际的基本工资" prop="jiben_money" width="120" align="center">
                <template slot-scope="scope">
                    <el-button style="margin-left:5px" v-if="scope.row.group_name == '巴长,电销'" type="text" @click="jiben(scope.row)" size="mini">{{ Number(scope.row.jiben_money) | si }}</el-button>
                    <el-button style="margin-left:5px" v-else-if="scope.row.group_name == '电销'" type="text" @click="jiben(scope.row)" size="mini">{{ Number(scope.row.jiben_money) | si }}</el-button>
                    <span v-else>{{ Number(scope.row.jiben_money) | si }}</span>
                </template>
            </el-table-column>
            <el-table-column label="提成" prop="ticheng_money" width="100" align="center">
                <template slot-scope="scope">
                    <el-button style="margin-left:5px" v-if="scope.row.group_name == '电销'" type="text" @click="tichen(scope.row)" size="mini">{{ Number(scope.row.ticheng_money) | si }}</el-button>
                    <el-button style="margin-left:5px" v-else-if="scope.row.group_name == '巴长,电销'" type="text" @click="tichen(scope.row)" size="mini">{{ Number(scope.row.ticheng_money) | si }}</el-button>
                    <el-button style="margin-left:5px" v-else-if="scope.row.group_name == '策划'" type="text" @click="CStichen(scope.row)" size="mini">{{ Number(scope.row.ticheng_money) | si }}</el-button>
                    <el-button style="margin-left:5px" v-else-if="scope.row.group_name == '巴长,策划'" type="text" @click="CStichen(scope.row)" size="mini">{{ Number(scope.row.ticheng_money) | si }}</el-button>
                    <el-button style="margin-left:5px" v-else-if="scope.row.group_name == '设计'" type="text" @click="CStichen(scope.row)" size="mini">{{ Number(scope.row.ticheng_money) | si }}</el-button>
                    <span v-else>{{ Number(scope.row.ticheng_money) | si }}</span>
                </template>
            </el-table-column>
            <el-table-column label="绩效" prop="jixiao" width="100"></el-table-column>
            <el-table-column label="实际绩效工资" prop="jixiao_money"  width="130"></el-table-column>
            <el-table-column label="其他" prop="qt"  width="100">
                <template slot-scope="scope">
                    <el-button type="text" size="mini" @click="qita(scope.row)">{{scope.row.qt}}</el-button>
                </template>
            </el-table-column>
            <el-table-column label="工龄工资" prop="seniority_wage"  width="100"></el-table-column>
            <el-table-column label="出勤" prop="chuqin" width="100"></el-table-column>
            <el-table-column label="请假天数扣款" prop="qj_tianshu"  width="110"></el-table-column>
            <el-table-column label="请假小时扣款" prop="qj_xiaoshi"  width="110"></el-table-column>
            <el-table-column label="迟到金额" prop="chidao_money"  width="100"></el-table-column>
            <el-table-column label="社保扣款" prop="shebao" width="150">
                <template slot-scope="scope">
                    <el-input type="number" v-model="scope.row.shebao"  @change="Psotshebao(scope.row)"></el-input>
                </template>
            </el-table-column>
            <el-table-column label="住房公积金" prop="gongjijin" width="150">
                <template slot-scope="scope">
                    <el-input type="number" v-model="scope.row.gongjijin" @change="Psotgongjijin(scope.row)"></el-input>
                </template>
            </el-table-column>
            <el-table-column label="实发工资" prop="" width="100">
                <template slot-scope="scope">
                    <span>{{ (Number(scope.row.jiben_money)+Number(scope.row.ticheng_money)+Number(scope.row.jixiao)+Number(scope.row.seniority_wage)-Number(scope.row.qj_tianshu)-Number(scope.row.gongjijin)-Number(scope.row.qj_xiaoshi)-Number(scope.row.shebao)+Number(scope.row.qt)) | si}}</span>
                </template>
            </el-table-column>
        </el-table>
        <!-- 系数弹窗 -->
        <el-dialog title="系数" :visible.sync="dialogXishu">
            <el-form :model="XishuForm">
                <el-form-item label="工作实效性" label-width="100px">
                    <el-radio v-model="XishuForm.salary_coefficient_a" label="0.9">超过两项工作未能及时完成0.9</el-radio>
                    <el-radio v-model="XishuForm.salary_coefficient_a" label="0.95">超过一项工作未能及时完成0.95</el-radio>
                    <el-radio v-model="XishuForm.salary_coefficient_a" label="1.0">全部按时按标准完成1</el-radio>
                </el-form-item>
                <el-form-item label="工作零差错" label-width="100px">
                    <el-radio v-model="XishuForm.salary_coefficient_b" label="0.9">超过两次以上差错0.9</el-radio>
                    <el-radio v-model="XishuForm.salary_coefficient_b" label="0.95">超过一次以上差错0.95</el-radio>
                    <el-radio v-model="XishuForm.salary_coefficient_b" label="1.0">0差错1</el-radio>
                </el-form-item>
                
                <el-form-item label="上传文件" label-width="100px">
                    <el-upload
                    class="upload-demo"
                    drag
                    action="/"
                    multiple>
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                        <div class="el-upload__tip" slot="tip">只能上传Excel表格</div>
                    </el-upload>
                </el-form-item>
                <el-form-item label=" " label-width="100px">
                    <el-button @click="btnXishu">提交</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!-- 基本工资明细弹窗 -->
        <el-dialog title="基本工资明细" :visible.sync="dialogMingxi">
            <el-form :model="MingxiForm">
                <el-form-item label="基本工资" label-width="100px">
                    <span>{{MingxiForm.salary}}</span>
                </el-form-item>
                <el-form-item label="出勤天数" label-width="100px">
                    <span>{{MingxiForm.chuqin}}</span>
                </el-form-item>
                <el-form-item label="电话量" label-width="100px">
                    <span>{{MingxiForm.user_customer_record}}</span>
                </el-form-item>
                <el-form-item label="百分比" label-width="100px">
                    <span>{{MingxiForm.salary_bfb}}</span>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!-- 提成弹窗 -->
        <el-dialog title="提成" :visible.sync="dialogTichen">
            <p>基本业绩:{{TichenForm.jiben_yeji }} <span style="margin-left:20px">总销售额:{{TichenForm.total_price }}</span><span style="margin-left:20px">总成本:{{TichenForm.total_cost_price}}</span><span style="margin-left:20px">总提成:{{TichenForm.ticheng_money}}</span><span style="margin-left:20px">业绩比例:{{TichenForm.yj}}</span></p>

            <p v-if="TichenForm.depticheng_money != null">部门总业绩：{{ TichenForm.deptotal_price }}<span style="margin-left:20px">部门业绩比例:{{TichenForm.dep_yj }}</span><span style="margin-left:20px">部门提成:{{TichenForm.depticheng_money }}</span></p>
            <el-table :data="TichenData" height="400" show-summary>
                <el-table-column label="订单编号" prop="id"></el-table-column>
                <el-table-column label="销售时间" prop="sales_time"></el-table-column>
                <el-table-column label="成本" prop="total_cost_price"></el-table-column>
                <el-table-column label="销售额" prop="total_price"></el-table-column>
                <el-table-column label="运费" prop="logistics_price"></el-table-column>
                <el-table-column label="认款时间">
                    <template slot-scope="scope">
                        <span v-if="scope.row.receivables_add_time > 0">{{ scope.row.receivables_add_time*1000 | formatDate}}</span>
                        <span v-else>{{ scope.row.receivables_add_time }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="认款金额" prop="receivables_amount"></el-table-column>
            </el-table>
        </el-dialog>
        <!-- 其他弹窗 -->
        <el-dialog title="提成" :visible.sync="dialogQita">
            <el-form :model="QitaForm">
                <el-form-item label="金额" label-width="80px">
                    <el-input v-model="QitaForm.qt" style="width:217px"></el-input>
                </el-form-item>
                <el-form-item label="备注" label-width="80px">
                    <el-input type="textarea" v-model="QitaForm.qt_remarks" style="width:400px"></el-input>
                </el-form-item>
                <el-form-item label=" " label-width="80px">
                    <el-button @click="QitaBtn">提交</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

        <!-- 策划设计弹窗  -->
        <el-dialog title="提成" :visible.sync="dialogCS">
             <p v-if="dialogCSX">字数:{{CForm.work_time }} <span style="margin-left:20px">新品:{{CForm.jixiao_a }}</span><span style="margin-left:20px">销售:{{CForm.jixiao_b }}</span></p>  
             <p v-if="!dialogCSX">工时:{{SForm.work_time }} <span style="margin-left:20px">新品:{{SForm.jixiao_a }}</span><span style="margin-left:20px">销售:{{SForm.jixiao_b }}</span></p>  
        </el-dialog>
    </div>
</template>

<script>
export default {
    filters: {
      formatDate(value) {
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
        return y + '-' + MM + '-' + d
      },
      si(value){
          return parseFloat(value).toFixed(3)
      }
    },
    data(){
        return {
            time:'',
            tableData:[],
            fullHeight:document.documentElement.clientHeight-180,
            dialogXishu:false,
            XishuForm:{
                salary_coefficient_a:'',
                salary_coefficient_b:'',
                user_id:'',
                date:'',
            },
            dialogMingxi:false,
            MingxiForm:{
               salary:'', 
               chuqin:'',
               user_customer_record:'',
               salary_bfb:'',
               
            },  
            dialogTichen:false,
            TichenData:[], 
            TichenForm:{
                jiben_yeji:'',
                total_cost_price:'',
                total_price:'',
                yj:'',
                ticheng_money:'',
                dep_yj: 0,
                depticheng_money: 0,
                deptotal_price:'',
            },
            dialogQita:false,
            QitaForm:{
                qt:'',
                qt_remarks:'',
                user_id:'',
            },
            dialogCS:false,
            dialogCSX:true,
            CForm:{
               work_time:'', 
               jixiao_a:'',
               jixiao_b:'',
            },
            SForm:{
               work_time:'', 
               jixiao_a:'',
               jixiao_b:'',
            }

        }
    },
    methods:{
        gettableData(){
            const loading = this.$loading({
                lock: true,
                text: '数据计算中……',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            this.axios.post('/oa.User/wage_calculation',{
                mouth:this.time
            }).then(res => {
                this.tableData = res.data.user;
                loading.close();
            })
        },
        seach(){
             this.axios.post('/oa.User/wage_calculation',{
                mouth:this.time
             }).then(res => {
                this.tableData = res.data.user;
            })
        },
        //提成系数按钮
        xishu(a){
            this.XishuForm.salary_coefficient_a = '';
            this.XishuForm.salary_coefficient_b = '';
            this.XishuForm.user_id = a.user_id;
            this.XishuForm.date = this.trim(this.time);
            this.dialogXishu = true;
        },
        // 提成提交
        btnXishu(){
            if(this.XishuForm.salary_coefficient_a == '' || this.XishuForm.salary_coefficient_b == ''){
                this.open('请勾选！','error')
            }else{
                this.axios.post('/oa.User/pay_slip_update',this.XishuForm).then(res => {
                    if(res.data.code == 2000){
                        this.open(res.data.msg,'success');
                        this.gettableData();
                        this.dialogXishu = false;
                    }else{
                        this.open(res.data.msg,'error');
                    }
                })
            }  
        },
        // 明细按钮
        jiben(a){
            this.MingxiForm.salary = a.xiaoshou.salary
            this.MingxiForm.chuqin = a.chuqin
            this.MingxiForm.user_customer_record = a.xiaoshou.user_customer_record
            this.MingxiForm.salary_bfb = a.xiaoshou.salary_bfb
            this.dialogMingxi = true;
        },
        // 提成
        tichen(a){
            this.TichenForm.jiben_yeji = a.xiaoshou.jiben_yeji;
            this.TichenForm.total_cost_price = a.xiaoshou.total_cost_price;
            this.TichenForm.total_price = a.xiaoshou.total_price;
            this.TichenForm.yj = a.xiaoshou.yj;
            this.TichenForm.ticheng_money = a.xiaoshou.ticheng_money;
            if(a.dep_yj != undefined || a.depticheng_money != undefined ||a.deptotal_price != undefined ){
                this.TichenForm.dep_yj = a.dep_yj
                this.TichenForm.depticheng_money = a.depticheng_money
                this.TichenForm.deptotal_price = a.deptotal_price
                console.log(a.dep_yj)
            }else{
                this.TichenForm.dep_yj = null
                this.TichenForm.depticheng_money = null
                this.TichenForm.deptotal_price = null
            }
            this.axios.post('/oa.User/wage_xiaoshou_ticheng',{
                mouth:this.time,
                user_id:a.user_id,
            }).then(res => {
                this.TichenData = res.data.order;
                this.dialogTichen = true;
            })
        },
        // 策划设计提成
        CStichen(a){
            if(a.group_name == '策划'){
                this.CForm = a.cehua;
                this.SForm.work_time = '';
                this.SForm.jixiao_a = '';
                this.SForm.jixiao_b = '';
                this.dialogCS = true;
                this.dialogCSX =true;
            }else if(a.group_name == '设计'){
                this.SForm = a.sheji;
                this.CForm.work_time = '';
                this.CForm.jixiao_a = '';
                this.CForm.jixiao_b = '';
                this.dialogCS = true;
                this.dialogCSX =false;
            }else if(a.group_name == '巴长,策划'){
                this.CForm = a.cehua;
                this.SForm.work_time = '';
                this.SForm.jixiao_a = '';
                this.SForm.jixiao_b = '';
                this.dialogCS = true;
                this.dialogCSX =true;
            }
        },
        // 其他费用
        qita(a){
            this.QitaForm.qt = '';
            this.QitaForm.qt_remarks = '';
            this.QitaForm.user_id = a.user_id;
            this.dialogQita = true;
        },
        QitaBtn(){
          this.QitaForm['date']  = this.trim(this.time); 
          this.axios.post('/oa.User/pay_slip_update',this.QitaForm).then(res => {
                if(res.data.code == 2000){
                    this.open(res.data.msg,'success');
                    this.gettableData();   
                    this.dialogQita = false;
                }else{
                    this.open(res.data.msg,'error');
                }
            })
        },
        //公积金提交
        Psotgongjijin(a){
            this.axios.post('/oa.User/pay_slip_update',{
                date:this.trim(this.time),
                user_id:a.user_id,
                gongjijin:a.gongjijin,
            }).then(res => {
                if(res.data.code == 2000){
                    this.open(res.data.msg,'success');
                    this.gettableData();   
                }else{
                    this.open(res.data.msg,'error');
                }
            })
        },
        // 社保提交
        Psotshebao(a){
            this.axios.post('/oa.User/pay_slip_update',{
                date:this.trim(this.time),
                user_id:a.user_id,
                shebao:a.shebao,
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
        // 默认时间
        change(t){
            if(t<10){
                return "0"+t;
            }else{
                return t;
            }
        },
        trim(value) {
            /**去除首尾空白 */
            let reg = new RegExp('-')
            return value.replace(reg, "");
        },
    },
    created(){
        const that = this;
        let d=new Date();
        d=d.setDate(d.getMonth()-1);
        let dd=new Date(d);
        let year=dd.getFullYear();
        let month=this.change(dd.getMonth());
        that.time = year+'-'+month;
        
        window.onresize = () => {
            return (() => {
              window.fullHeight = document.documentElement.clientHeight;
              that.fullHeight = window.fullHeight
            })()
        };
        this.gettableData();
    },
}
</script>

<style lang="less" scoped>

</style>
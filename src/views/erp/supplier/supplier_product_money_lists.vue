<template>
    <div class="box">
        <div>
            <label>筛选:</label>
            <el-date-picker v-model="time" value-format="timestamp" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>
            <el-input v-model="name" placeholder="供应商名称" style="width:217px;margin-left:20px"></el-input>
            <el-button @click="seach" style="margin-left:20px">搜索</el-button>
            <el-button @click="daoshuju" style="margin-left:30px">导出数据</el-button>
        </div>
        <el-table :data="tableData" class="gys" show-summary>
            <el-table-column type="expand">
                <template slot-scope="props">
                    <el-form label-position="left" class="demo-table-expand">
                        <el-form-item label="供应商地址" label-width="90px">
                            <span>{{ props.row.province }}{{ props.row.city }}{{ props.row.county }}{{ props.row.address }}</span>
                        </el-form-item>
                        <el-form-item label="备注" label-width="90px">
                            <span>{{ props.row.purchase_remarks }}</span>
                        </el-form-item>
                    </el-form>
                    <label>配货产品</label>
                    <el-table :data="props.row.customer_order_purchase">
                        <el-table-column label="产品名称" prop="name"></el-table-column>
                        <el-table-column label="数量" prop="number"></el-table-column>
                        <el-table-column label="单位" prop="unit"></el-table-column>
                        <el-table-column label="采购单价" prop="purchase_price"></el-table-column>
                        <el-table-column label="运费" prop="freight_price"></el-table-column>
                        <el-table-column label="采购员" prop="purchase_user_name"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button size="mini" @click="see(scope.row.customer_order_id)" type="info">查看订单</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <label>采购产品</label>
                    <el-table :data="props.row.customer_order_advance_charge">
                        <el-table-column label="采购时间" prop="add_time"></el-table-column>
                        <el-table-column label="产品名称" prop="name"></el-table-column>
                        <el-table-column label="付款金额" prop="prepayment"></el-table-column>
                        <el-table-column label="类型" width="70px">
                            <template slot-scope="scope">
                                <span>{{ scope.row.class == 0 ? '订单' : '运费'}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="结算方式" width="80px">
                            <template slot-scope="scope">
                                <span>{{ scope.row.settlement == 0 ? '现结' : '月结'}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="仓库" prop="type" width="80px">
                            <template slot-scope="scope">
                                <span v-if="scope.row.type ==1">本地仓库</span>
                                <span v-if="scope.row.type ==2">供应商</span>
                            </template>
                        </el-table-column>
                        
                        <el-table-column label="备注" prop="remarks"></el-table-column>
                        <el-table-column label="采购员" prop="user_name"  width="80px"></el-table-column>
                        <el-table-column label="操作" width="110px">
                            <template slot-scope="scope">
                                <el-button size="mini" @click="see(scope.row.customer_order_id)" type="info">查看订单</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </template>
                </el-table-column>
            <el-table-column label="供应商名称" prop="name" width="400px"></el-table-column>
            <el-table-column label="采购金额">
                <template slot-scope="scope">
                    <span>{{ Number(scope.row.purchase_wf_money) + Number(scope.row.purchase_sf_money) }}</span>
                </template>
            </el-table-column>
            <el-table-column label="实付金额" prop="purchase_sf_money"></el-table-column>
            <el-table-column label="余额" prop="purchase_wf_money"></el-table-column>
            <el-table-column label="采购日期" prop="purchase_add_time"></el-table-column>
            <el-table-column label="供应商联系人">
                <template slot-scope="scope">
                    <span>{{ scope.row.supplier_user_name }}</span>
                </template>
            </el-table-column>
            <el-table-column label="联系电话">
                <template slot-scope="scope">
                    <span>{{ scope.row.supplier_user_phone }}</span>
                </template>
            </el-table-column>
            <el-table-column label="采购员" prop="purchase_user_name"></el-table-column>
        </el-table>
    </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
    data(){
        return {
            time:null,
            name:'',
            tableData:[],
            start_time:'',
        }
    },
    methods:{
        // vuex tab显示
        ...mapActions("customerList", ["triggerReplaceId"]),
        ...mapActions("Tabs", ["triggerAddTabs", "triggerSetActiveIndex"]),
        seach(){
            let a,b ;
            if(this.time == null){
                a='';
                b='';
            }else{
                a=this.time[0]/1000;
                b=this.time[1]/1000;
            }   
            this.axios.post('/erp.supplier/supplier_product_money_lists',{
                start_time:a,
                end_time:b,
                name:this.name
            }).then(res => {
                this.tableData = res.data.supplier;
            })   
        },
        gettableData(){
            this.axios.post('/erp.supplier/supplier_product_money_lists',{
                start_time:this.start_time,
                end_time:this.start_time,
            }).then(res => {
                this.tableData = res.data.supplier;
            })
        },
        // 查看订单
        see(a){
            this.triggerReplaceId(a);
            this.$router.push({ path: `/erp/Purchase/seePurchase/${a}`,params:{userId:a,name:`/erp/Purchase/seePurchase/${a}`}});
            let ins1 = {
                route: `/erp/Purchase/seePurchase/${a}`,
                name: "采购查看",
                id: a
            };
            let ins2 = `/erp/Purchase/seePurchase/${a}`;
            this.triggerAddTabs(ins1);
            this.triggerSetActiveIndex(ins2);
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

        daoshuju(){
            require.ensure([], () => {
                const {export_json_to_excel} = require('@/assets/vendor/Export2Excel');
                let tHeader = ['供应商名称','采购金额','实付金额','余额','采购日期','供应商联系人','联系电话','采购员'];
                let filterVal = ['name','lei','purchase_sf_money','purchase_wf_money', 'purchase_add_time','supplier_user_name','supplier_user_phone','purchase_user_name'];
                for(let i =0;i<this.tableData.length;i++){
                    this.tableData[i]['lei'] = (Number(this.tableData[i].purchase_wf_money) + Number(this.tableData[i].purchase_sf_money)).toFixed(4);
                }
                const list = this.tableData;
                const data = this.formatJson(filterVal, list);
                export_json_to_excel(tHeader, data, '数据');
            })
        },
        formatJson(filterVal, jsonData) {
            return jsonData.map(v => filterVal.map(j => v[j]))
        },
    },
    created(){
        let d=new Date();
        let year=d.getFullYear();
        let month=this.change(d.getMonth()+1);
        let day=this.change(d.getDate());
        this.shi = year+'-'+month+'-'+day;
        let bb = year+'-'+month+'-'+day;
        this.start_time = this.getTimestamp(bb)/1000;
        this.gettableData();
    }
    
}
</script>

<style lang="less">
.box{
    .gys{
        .demo-table-expand {
            font-size: 0;
        }
        .demo-table-expand label {
            width: 90px;
            color: #99a9bf;
        }
        .demo-table-expand .el-form-item {
            margin-right: 0;
            margin-bottom: 0;
            width: 50%;
        }
    }
}
</style>
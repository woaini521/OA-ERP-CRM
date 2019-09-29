<template>
    <div class="box">
        <div v-for="(item,index) in Account" :key="index" style="margin-top:10px;">
            <i class="el-icon-plus" @click="push"></i>
            <el-select v-model="item.id" filterable clearable placeholder="请选择" @change="aa">
                <el-option
                    v-for="items in options"
                    :key="items.id"
                    :label="`${items.receiving_name}:${items.receiving_account}`"
                    :value="items.id">
                </el-option>
            </el-select>
            <el-input v-model="item.money" @change="aa" style="width:100px;margin-left:10px;" placeholder="金额"></el-input>
            <i class="el-icon-minus" @click="deteles(index)"></i>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            Account:[
                {
                    id:'',
                    money:'',
                },
            ],
            options:[]
        }
    },
    props:['a'],
    methods:{
        getoptions(){
            this.Account = [{id:'', money:''}]
            this.axios.get('/Finance/payee_lists').then(res=>{
                this.options = res.data;
            })
        },
        push(){
            let a = {
                id:'',
                money:'',
            };
            this.Account.push(a);
        },
        deteles(a){
            if(this.Account.length == 1){

            }else{
                this.Account.splice(a, 1);
                this.$emit('func',this.Account)
            }
        },
        aa(){
            this.$emit('func',this.Account) 
        },
    },
    created(){
        this.getoptions();
    },
    watch:{
        a(newValue, oldValue){
            this.getoptions();
        } 
    }
}
</script>

<style lang="less" scoped>

</style>
<template>
    <div>
        <div id="myChart" ref="myChart"></div>  
        <div id="myChart2" ref="myChart2"></div>
        <div id="myChart4" ref="myChart4"></div>

        <div id="myChart1" ref="myChart1"></div>
        <div id="myChart3" ref="myChart3"></div>
        <div id="myChart5" ref="myChart5"></div>
    </div>
    
</template>

<script>
import echarts from 'echarts'
export default {
    data(){
        return {
            data:'',
            data1:'',
            dataName:'',
            datadep:'',
            datadepName:'',
            datadepMoney:'',
            datadep1:'',
            datadepMoney1:'',
        }
    },
    methods:{
        getdata(){
          let myChart = echarts.init(this.$refs.myChart);
          let myChart1 = echarts.init(this.$refs.myChart1);
          let myChart2 = echarts.init(this.$refs.myChart2);
          let myChart3 = echarts.init(this.$refs.myChart3);
          let myChart4 = echarts.init(this.$refs.myChart4);
          let myChart5 = echarts.init(this.$refs.myChart5);
          this.axios.get('/report.User/order_count').then(res => {
              let data = [];
              let data1 = [];
              let datadep = [];
              let datadepMoney = [];
              let dataName = [];
              let datadepName = [];
              let datadep1=[];
              let datadepMoney1=[];
              
              for(let i in res.data.week) {
                   let shuju = res.data.week[i];
                   let name = `${shuju[0].date}至${shuju[shuju.length-1].date}`;
                   let da = {
                        name:name,
                        type:'line',
                        stack: `${name}订单数`,
                    };
                    let da1 = {
                        name:name,
                        type:'line',
                        stack:`${name}销售金额`,
                    };
                   let number = [];
                   let total_price = [];
                   for(let k = 0; k<shuju.length;k++){
                       number.push(shuju[k].number);  
                       total_price.push(shuju[k].total_price);  
                   }
                   da['data']=number; 
                   da1['data']=total_price;
                   data.push(da);
                   data1.push(da1);
                   dataName.push(name);
                }
                for(let i in res.data.company){
                   let shuju = res.data.company[i]; 
                   let name = shuju.dep_title;
                   let one1 = { 
                      name:name, 
                      type:'line',
                      stack: `${name}订单数`,
                      data:shuju.week_one.number,
                   }
                   let da1 = { 
                      name:name, 
                      type:'line',
                      stack: `${name}订单数`,
                      data:shuju.week_one.money,
                   }
                   let one2 = { 
                      name:name, 
                      type:'line',
                      stack: `${name}订单数`,
                      data:shuju.week_two.number,
                   }
                   let da2 = { 
                      name:name, 
                      type:'line',
                      stack: `${name}订单数`,
                      data:shuju.week_two.money,
                   }

                  // console.log(shuju.money)
                   datadepMoney.push(da1);
                   datadep.push(one1);
                   datadepName.push(name);
                   datadep1.push(one2);
                   datadepMoney1.push(da2);
                }
                

                this.data = data;
                this.data1 = data1;
                this.dataName = dataName;
                this.datadep = datadep;
                this.datadepName = datadepName;
                this.datadepMoney = datadepMoney;
                this.datadep1 = datadep1;
                this.datadepMoney1 = datadepMoney1;

                this.draw('订单笔数',myChart,this.dataName,this.data)
                this.draw('销售金额',myChart1,this.dataName,this.data1)

                this.draw('本周部门订单',myChart2,this.datadepName,this.datadep)
                this.draw('上周部门订单',myChart4,this.datadepName,this.datadep1)

                this.draw('本周部门销售',myChart3,this.datadepName,this.datadepMoney)
                this.draw('上周部门销售',myChart5,this.datadepName,this.datadepMoney1)
            })
        },
        draw (text,myChart,a,b) {
          myChart.setOption({
                title: {
                    text: text
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data:a
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                toolbox: {
                    feature: {
                       
                        dataView: {readOnly: false},
                        magicType: {type: ['line', 'bar']},
                       
                        saveAsImage: {}
                    }
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: ['周一','周二','周三','周四','周五','周六','周日']
                },
                yAxis: {
                    type: 'value'
                },
                series:b,
            })
        },
        
    },
    created () {
		// 调用绘制图表的方法
		this.$nextTick(()=> { this.getdata()})
	},
    watch:{
       $route(to){
         this.$nextTick(()=> { this.getdata()})  
       } 
    }
}
</script>

<style lang="less" scoped>
#myChart {
		width: 95%;
		height: 300px;
		margin: 20px auto;
      }
#myChart1 {
		width: 95%;
		height: 300px;
		margin: 20px auto;
      }
#myChart2 {
		width: 95%;
		height: 300px;
		margin: 20px auto;
      }
#myChart3 {
		width: 95%;
		height: 300px;
		margin: 20px auto;
      }
#myChart4 {
		width: 95%;
		height: 300px;
		margin: 20px auto;
      }
#myChart5 {
		width: 95%;
		height: 300px;
		margin: 20px auto;
      }
</style>


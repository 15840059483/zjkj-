<template>
  <div class="dashboard-editor-container">
    <panel-group v-if="isReady" :panel-group-data="panelGroupData" @handleSetLineChartData="handleSetLineChartData" />

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart v-if="isReady" :chart-data="lineChartData" />
    </el-row>

    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <raddar-chart v-if="isReady" :raddar-chart-data="raddarChartData" />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <pie-chart v-if="isReady" :pie-chart-data="pieChartData" />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <bar-chart v-if="isReady" :bar-chart-data="barChartData" />
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="8">
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 12}" :xl="{span: 12}" style="padding-right:8px;margin-bottom:30px;">
        <transaction-table v-if="isReady" :data="orderPageData" />
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="margin-bottom:30px;">
        <todo-list />
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="margin-bottom:30px;">
        <box-card v-if="isReady" :userInfo="userInfo" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
import RaddarChart from './components/RaddarChart'
import PieChart from './components/PieChart'
import BarChart from './components/BarChart'
import TransactionTable from './components/TransactionTable'
import TodoList from './components/TodoList'
import BoxCard from './components/BoxCard'
import { home } from '@/api/dashboard'

const lineChartData = {
  newVisitis: {
    expectedData: [],
    actualData: []
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130]
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130]
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130]
  }
}

export default {
  name: 'DashboardAdmin',
  components: {
    PanelGroup,
    LineChart,
    RaddarChart,
    PieChart,
    BarChart,
    TransactionTable,
    TodoList,
    BoxCard
  },
  data() {
    return {
      loading: false,
      isReady: false,
      panelGroupData: undefined, //
      orderPageData: undefined, // 表格数据
      userInfo: undefined, // 用户信息
      lineChartData: lineChartData.newVisitis, // 折线图数据
      barChartData: [],
      pieChartData: [],
      raddarChartData: []
    }
  },
  mounted() {
    this.getHomeData();
  },
  methods: {
    handleSetLineChartData(type) {
      // this.lineChartData = lineChartData[type]
    },
    getHomeData() {
      this.loading = true;
      const params = {};
      home(params).then((data) => {
        if (data && data.data) {
          this.panelGroupData = data.data;
          lineChartData.newVisitis.actualData = data.data.fee30DayCount.blue;
          lineChartData.newVisitis.expectedData = data.data.fee30DayCount.red;
          let barData = [];
          for (const key in data.data.monthCount) {
            barData.push(data.data.monthCount[key])
          }
          this.barChartData = barData;
          console.log(this.barChartData);
          let pieData = [];
          data.data.quarterCount.forEach(item =>{
            switch (item.QUARTER) {
              case '1':
                pieData.push({value: item.FEECOUNT, name: '第一季度'});
                break;
              case '2':
                pieData.push({value: item.FEECOUNT, name: '第二季度'});
                break;
              case '3':
                pieData.push({value: item.FEECOUNT, name: '第三季度'});
                break;
              case '4':
                pieData.push({value: item.FEECOUNT, name: '第四季度'});
                break;
            }
          })
          this.pieChartData = pieData;
          this.orderPageData = data.data.orderPage;
          this.userInfo = data.data.user;
          this.isReady = true;
        }
        this.loading = false;
      }).catch(() => {
        this.loading = false
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>

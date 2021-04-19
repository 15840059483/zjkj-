<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row :gutter="20">
        <el-col :span="8" class="search-col">
          <el-select v-model="searchSelectCostType" @change="getTableList" style="width: 100%" class="filter-item">
            <el-option label="请选择缴费类型" value=""></el-option>
            <el-option label="挂号" value="4010" />
            <el-option label="门诊" value="4011" />
            <el-option label="住院" value="4012" />
          </el-select>
        </el-col>
        <el-col :span="8" class="search-col">
          <el-select v-model="searchSelectEquipment" @change="getTableList" style="width: 100%" class="filter-item">
            <el-option label="请选择设备类型" value=""></el-option>
            <el-option label="自助机" value="0" />
            <el-option label="手机" value="1" />
          </el-select>
        </el-col>
        <el-col :span="8" class="search-col">
          <el-select v-model="searchSelectPayType" @change="getTableList" style="width: 100%" class="filter-item">
            <el-option label="请选择支付类型" value=""></el-option>
            <el-option label="微信" value="wx" />
            <el-option label="支付宝" value="al" />
            <el-option label="银行" value="bank" />
          </el-select>
        </el-col>
        <el-col :span="8" class="search-col">
          <el-input v-model="orderNo" @input="getTableList" type="text" placeholder="单号" name="orderNo"></el-input>
        </el-col>
        <el-col :span="8" class="search-col">
          <el-input v-model="patientName" @input="getTableList" type="text" placeholder="患者姓名" name="patientName"></el-input>
        </el-col>
        <el-col :span="8" class="search-col">
          <el-input v-model="patientNo" @input="getTableList" type="text" placeholder="患者卡号" name="patientNo"></el-input>
        </el-col>
        <el-col :span="8" class="search-col">
          <el-select v-model="searchSelectPaymentStatusId" @change="getTableList" style="width: 100%" class="filter-item">
            <el-option label="请选择支付状态" value=""></el-option>
            <el-option label="支付" value="3010" />
            <el-option label="未支付" value="3011" />
            <el-option label="半退" value="3012" />
            <el-option label="全退" value="3013" />
            <el-option label="未知" value="3014" />
          </el-select>
        </el-col>
        <el-col :span="16" class="search-col">
          <el-date-picker
            style="width: 100%"
            v-model="searchDate"
            type="daterange"
            @change="getTableList"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-col>
      </el-row>
    </div>

    <el-table
      v-loading="listLoading"
      :data="tableListData"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="订单号" width="180" align="center">
        <template slot-scope="scope">
          {{ scope.row.orderNo}}
        </template>
      </el-table-column>
      <el-table-column label="患者姓名" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.patientName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="患者编码" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.patientNo }}
        </template>
      </el-table-column>
      <el-table-column label="微信id" width="210" align="center">
        <template slot-scope="scope">
          {{ scope.row.wxOpenId }}
        </template>
      </el-table-column>
      <el-table-column label="缴费类型" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.costName }}
        </template>
      </el-table-column>
      <el-table-column label="支付状态" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.paymentstatusName}}
        </template>
      </el-table-column>
      <el-table-column label="余额" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.balanceFee }}
        </template>
      </el-table-column>
      <el-table-column label="支付金额" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.payMount }}
        </template>
      </el-table-column>
      <el-table-column label="退款金额" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.refundFee }}
        </template>
      </el-table-column>
      <el-table-column label="设备类型" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.equipment  | equipmentFilter}}
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                @pagination="getTableList"/>
  </div>
</template>

<script>
  import Pagination from "@/components/Pagination/index";
  import { Loading } from 'element-ui';
  import { orderInfoPage } from '@/api/hospital-information-maintenance'
  export default {
    name: "order-information",
    components: {Pagination},
    filters: {
      equipmentFilter(val) {
        if (val === '1') {
          return '手机';
        } else if (val === '0') {
          return '自助机'
        }
        return '';
      }
    },
    data() {
      return {
        total: 0,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20,
          importance: undefined,
          title: undefined,
          type: undefined,
          sort: '+id'
        },
        tableListData: [],

        // searchInput
        orderNo: '',
        patientName: '',
        patientNo: '',
        searchDate: '',
        searchSelectCostType: '',
        searchSelectEquipment: '',
        searchSelectPayType: '',
        searchSelectPaymentStatusId: '',
      }
    },
    created() {
      this.getTableList()
    },
    methods: {
      getTableList() {
        this.listLoading = true;
        let params = 'pageNo=' + this.listQuery.page + '&pageSize=' + this.listQuery.limit;
        if (this.searchSelectCostType) {
          params = params + '&costType=' + this.searchSelectCostType;
        }
        if (this.searchSelectEquipment !== '') {
          params = params + '&equipment=' + this.searchSelectEquipment;
        }
        if (this.searchSelectPayType) {
          params = params + '&pay_type=' + this.searchSelectPayType;
        }
        if (this.searchSelectPaymentStatusId) {
          params = params + '&paymentstatusId=' + this.searchSelectPaymentStatusId;
        }
        if (this.orderNo) {
          params = params + '&orderNo=' + this.orderNo;
        }
        if (this.patientName) {
          params = params + '&patientName=' + this.patientName;
        }
        if (this.patientNo) {
          params = params + '&patientNo=' + this.patientNo;
        }
        if (this.searchDate) {
          const startDate = this.searchDate[0].getFullYear() + '-' + (this.searchDate[0].getMonth() + 1) + '-' + this.searchDate[0].getDate();
          const endDate = this.searchDate[1].getFullYear() + '-' + (this.searchDate[1].getMonth() + 1) + '-' + this.searchDate[1].getDate();
          params = params + '&beginTime=' + startDate + '&endTime=' + endDate;
        }
        orderInfoPage(params).then((data) => {
           console.log(data.data)
          if (data && data.data) {
            this.tableListData = data.data.records;
            this.total = Number(data.data.total);
          }
          this.listLoading = false;
        }).catch(() => {
          this.listLoading = false;
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .filter-container {
    .search-col {
      margin: 5px 0;
    }
  }
</style>

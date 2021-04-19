<template>
  <el-table :data="data" style="width: 100%;padding-top: 15px;">
    <el-table-column label="订单号" min-width="200">
      <template slot-scope="scope">
        {{ scope.row.orderNo }}
      </template>
    </el-table-column>
    <el-table-column label="金额" width="195" align="center">
      <template slot-scope="scope">
        ¥{{ scope.row.payMount }}
      </template>
    </el-table-column>
    <el-table-column label="状态" width="100" align="center">
      <template slot-scope="{row}">
        <el-tag :type="row.paymentstatusName | statusFilter">
          {{ row.paymentstatusName }}
        </el-tag>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
// import { transactionList } from '@/api/remote-search'

export default {
  props: ['data'],
  filters: {
    statusFilter(status) {
      const statusMap = {
        success: 'success',
        pending: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      // transactionList().then(response => {
      //   this.list = response.data.items.slice(0, 8)
      // })
    }
  }
}
</script>

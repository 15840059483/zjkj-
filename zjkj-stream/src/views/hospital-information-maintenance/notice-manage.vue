<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row :gutter="20">
        <el-col :span="6" class="search-col">
          <el-select
            v-model="searchSelectLevelId"
            @change="getTableList"
            placeholder="选择级别"
            style="width: 100%"
            class="filter-item"
          >
            <el-option label="请选择级别" value=""></el-option>
            <el-option label="普通" value="0" />
            <el-option label="开发公告" value="1" />
          </el-select>
        </el-col>

        <el-col :span="12" class="search-col">
          <el-date-picker
            style="width: 100%"
            v-model="searchDate"
            type="daterange"
            @change="getTableList"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-col>
        <el-col :span="6" class="search-col">
          <el-button
            class="filter-item"
            style="float: right"
            type="primary"
            icon="el-icon-edit"
            @click="handleCreateNotice"
          >
            添加公告
          </el-button>
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
      <el-table-column label="有效时间" width="180" align="center">
        <template slot-scope="scope">
          {{ scope.row.activeTime | dateFilter }}
        </template>
      </el-table-column>
      <el-table-column label="描述" width="180" align="center">
        <template slot-scope="scope">
          {{ scope.row.description }}
        </template>
      </el-table-column>
      <el-table-column label="级别" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.noticeLevel | noticeLevel }}</span>
        </template>
      </el-table-column>
      <el-table-column label="文章" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.text }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="230"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row, $index }">
          <el-button
            type="primary"
            size="mini"
            @click="handleEdit(row, $index)"
          >
            编辑
          </el-button>
          <el-button size="mini" type="success"> 发布 </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(row, $index)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getTableList"
    />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :model="createNoticInput"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="有效时间">
          <el-date-picker
            v-model="createNoticInput.activeTime"
            type="datetime"
            placeholder="选择日期时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="文章">
          <el-input
            v-model="createNoticInput.text"
            type="text"
            autosize
            placeholder="文章"
            name="doctorName"
          ></el-input>
        </el-form-item>
        <el-form-item label="级别">
          <el-select
            v-model="createNoticInput.notice_level"
            placeholder="选择级别"
            style="width: 100%"
            class="filter-item"
          >
            <el-option label="请选择级别" value=""></el-option>
            <el-option label="普通" value="0" />
            <el-option label="开发公告" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            v-model="createNoticInput.description"
            type="textarea"
            autosize
            placeholder="描述"
            name="description"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false"> 取消 </el-button>
        <el-button type="primary" @click="saveNotice"> 保存 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination/index";
import { Loading } from "element-ui";
import {
  noticeOrderInfoPage,
  deleteNotice,
  createNotice,
  updateNotice,
} from "@/api/hospital-information-maintenance";

export default {
  name: "notice-manage",
  components: { Pagination },
  filters: {
    dateFilter(val) {
      if (val) {
        return val.split("T").join(" ");
      }
    },
    noticeLevel(val) {
      return val === "0" ? "普通" : "开发公告";
    },
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
        sort: "+id",
      },
      tableListData: [],

      // 添加/修改模态框
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "修改",
        create: "添加",
      },

      // 搜索
      searchSelectLevelId: null,
      searchDate: "",

      createNoticInput: {
        id: null,
        text: "",
        notice_level: null,
        description: "",
        activeTime: "",
      },
    };
  },
  created() {
    this.getTableList();
  },
  methods: {
    getTableList() {
      const params = {
        pageNo: this.listQuery.page,
        pageSize: this.listQuery.limit,
      };
      console.log(this.searchSelectLevelId);
      if (
        this.searchSelectLevelId === "0" ||
        this.searchSelectLevelId === "1"
      ) {
        params.notice_level = this.searchSelectLevelId;
      }
      if (this.searchDate) {
        const startDate =
          this.searchDate[0].getFullYear() +
          "-" +
          (this.searchDate[0].getMonth() + 1) +
          "-" +
          this.searchDate[0].getDate();
        const endDate =
          this.searchDate[1].getFullYear() +
          "-" +
          (this.searchDate[1].getMonth() + 1) +
          "-" +
          this.searchDate[1].getDate();
        params.beginTime = startDate;
        params.endTime = endDate;
      }
      noticeOrderInfoPage(params)
        .then((data) => {
          if (data && data.data) {
            this.tableListData = data.data.records;
            this.total = Number(data.data.total);
          }
          this.listLoading = false;
        })
        .catch(() => {
          this.listLoading = false;
        });
    },
    // 删除公告
    handleDelete(row, index) {
      this.$confirm("确认删除该公告信息?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let loadingInstance = Loading.service({});
          deleteNotice(row.id)
            .then((data) => {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              this.getTableList();
              loadingInstance.close();
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "删除失败，请重试!",
              });
              loadingInstance.close();
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    resetCreateNoticeInput() {
      this.createNoticInput = {
        id: null,
        text: "",
        notice_level: null,
        description: "",
        activeTime: "",
      };
    },
    // 打开添加公告模态框
    handleCreateNotice() {
      this.resetCreateNoticeInput();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    // 打开修改公告模态框
    handleEdit(item) {
      this.resetCreateNoticeInput();
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });

      this.createNoticInput.id = item.id;
      this.createNoticInput.text = item.text;
      this.createNoticInput.notice_level = item.notice_level;
      this.createNoticInput.description = item.description;
      this.createNoticInput.activeTime = item.activeTime;
    },
    check() {
      //   if (!this.createNoticInput.activeTime) {
      //     this.$message({
      //       type: "info",
      //       message: "请选择有效时间!",
      //     });
      //     return false;
      //   }
      if (!this.createNoticInput.text) {
        this.$message({
          type: "info",
          message: "请输入文章!",
        });
        return false;
      }
      if (!this.createNoticInput.notice_level) {
        this.$message({
          type: "info",
          message: "请选择级别!",
        });
        return false;
      }
      if (!this.createNoticInput.description) {
        this.$message({
          type: "info",
          message: "请输入描述!",
        });
        return false;
      }
      return true;
    },
    saveNotice() {
      if (!this.check()) {
        return;
      }
      if (this.dialogStatus === "update") {
        this.updateNoticeApi();
      } else {
        this.createNoticeApi();
      }
    },
    updateNoticeApi() {
      let loadingInstance = Loading.service({});
      updateNotice(this.createNoticInput)
        .then((res) => {
          console.log(res);
          if (res.code !== 200) {
            this.$message({
              type: "info",
              message: data.msg,
            });
          } else {
            this.$message({
              type: "success",
              message: "修改成功！",
            });
            this.dialogFormVisible = false;
            this.getTableList();
          }
          loadingInstance.close();
        })
        .catch((err) => {
          loadingInstance.close();
        });
    },
    createNoticeApi() {

        this.createNoticInput = {
          id: null,
          text: '',
          notice_level: null,
          description: '',
          activeTime: ''
      }
      let fd = new FormData(); // FormData 对象
      fd.append("id", this.createNoticInput.id); // 文件对象
      fd.append("text", this.createNoticInput.text);
      fd.append("notice_level", this.createNoticInput.notice_level);
      fd.append("description", this.createNoticInput.description);
      fd.append("activeTime", this.createNoticInput.activeTime);
      createNotice(fd)
        .then((res) => {
          console.log(res);
          if (res.code !== 200) {
            this.$message({
              type: "info",
              message: data.msg,
            });
          } else {
            this.$message({
              type: "success",
              message: "添加成功！",
            });
            this.dialogFormVisible = false;
            this.getTableList();
          }
          loadingInstance.close();
        })
        .catch((err) => {
          loadingInstance.close();
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.filter-container {
  .search-col {
    margin: 5px 0;
  }
}
</style>
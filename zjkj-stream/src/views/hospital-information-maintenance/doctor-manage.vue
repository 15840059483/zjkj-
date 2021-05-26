<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row :gutter="20">
        <el-col :span="6" class="search-col">
          <el-input
            v-model="doctorName"
            @input="getTableList"
            type="text"
            placeholder="医生姓名"
            name="doctorName"
          ></el-input>
        </el-col>
        <el-col :span="6" class="search-col">
          <el-input
            v-model="doctorId"
            @input="getTableList"
            type="text"
            placeholder="医生ID"
            name="doctorId"
          ></el-input>
        </el-col>
        <el-col :span="6" class="search-col">
          <el-select
            v-model="searchSelectDeptId"
            @change="getTableList"
            placeholder="选择科室"
            style="width: 100%"
            class="filter-item"
          >
            <el-option label="请选择科室" value=""></el-option>
            <el-option
              v-for="item in deptList"
              :key="item.id"
              :label="item.deptName"
              :value="item.id"
            />
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
        <el-col :span="6" class="search-col"> </el-col>
        <el-col :span="6" class="search-col">
          <el-button
            class="filter-item"
            style="float: right"
            type="primary"
            icon="el-icon-edit"
            @click="handleCreateDoctor"
          >
            添加医生
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
      <el-table-column label="创建时间" width="180" align="center">
        <template slot-scope="scope">
          {{ scope.row.createTime | dateFilter }}
        </template>
      </el-table-column>
      <el-table-column label="描述" width="180" align="center">
        <template slot-scope="scope">
          {{ scope.row.description }}
        </template>
      </el-table-column>
      <el-table-column label="医生姓名" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.doctorName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="医生编码" width="180" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.doctorId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="介绍" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.introduce }}
        </template>
      </el-table-column>
      <el-table-column label="号源级别名称" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.regLevelName }}
        </template>
      </el-table-column>
      <el-table-column label="医生级别名称" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.scheduleName }}
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
        :model="createDoctorInput"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="医生姓名">
          <el-input
            v-model="createDoctorInput.doctorName"
            type="text"
            autosize
            placeholder="医生姓名"
            name="doctorName"
          ></el-input>
        </el-form-item>
        <el-form-item label="医生编码">
          <el-input
            v-model="createDoctorInput.doctorId"
            type="text"
            autosize
            placeholder="医生编码"
            name="doctorId"
          ></el-input>
        </el-form-item>
        <el-form-item label="医生级别名称">
          <el-input
            v-model="createDoctorInput.scheduleName"
            type="text"
            autosize
            placeholder="医生级别名称"
            name="scheduleName"
          ></el-input>
        </el-form-item>
        <el-form-item label="号源级别名称">
          <el-input
            v-model="createDoctorInput.regLevelName"
            type="text"
            autosize
            placeholder="号源级别名称"
            name="regLevelName"
          ></el-input>
        </el-form-item>
        <!-- <el-form-item label="科室名称">
          <el-select v-model="createDoctorInput.deptName" @change="selectChange" placeholder="请选择科室名称" style="width: 90%"
                     class="filter-item">
            <el-option v-for="item in deptList" :key="item.deptId" :label="item.deptName" :value="item.deptName"/>
          </el-select>
        </el-form-item> -->
        <el-form-item label="图片">
          <div class="dialog-img-div">
            <input
              type="file"
              class="dialog-img-input"
              id="img"
              name="img"
              accept="image/*"
              @change="updateImg"
            />
            <img
              v-if="isShowImg"
              style="width: 150px; height: 150px"
              :src="src"
              class="dialog-img"
            />
            <span v-if="!isShowImg">+</span>
          </div>
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            v-model="createDoctorInput.description"
            type="textarea"
            autosize
            placeholder="描述"
            name="description"
          ></el-input>
        </el-form-item>
        <el-form-item label="介绍">
          <el-input
            v-model="createDoctorInput.introduce"
            type="textarea"
            autosize
            placeholder="介绍"
            name="introduce"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false"> 取消 </el-button>
        <el-button type="primary" @click="saveDept"> 保存 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination/index";
import { Loading } from "element-ui";
import {
  getDoctorPage,
  deptAll,
  deleteDoctor,
  createDoctor,
  updateDoctor,
} from "@/api/hospital-information-maintenance"
import axios from 'axios'

export default {
  name: "doctor-manage",
  components: { Pagination },
  filters: {
    dateFilter(date) {
      return date.split("T").join(" ");
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
      deptList: [], // 科室列表

      // 添加/修改模态框
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "修改",
        create: "添加",
      },

      // 搜索
      doctorName: "",
      doctorId: "",
      searchSelectDeptId: null,
      searchDate: "",

      // 添加/编辑
      createDoctorInput: {
        id: "",
        doctorName: null,
        doctorId: null,
        scheduleName: null,
        regLevelName: null,
        description: null,
        introduce: null,
        file: undefined,
      },
      fromData: new FormData(),
      isShowImg: false,
      src: "",
    };
  },
  created() {
    this.getTableList();
    this.getDeptList();
  },
  methods: {
    getTableList() {
      const params = {
        pageNo: this.listQuery.page,
        pageSize: this.listQuery.limit,
      };
      if (this.doctorName) {
        params.doctorName = this.doctorName;
      }
      if (this.doctorId) {
        params.doctorId = this.doctorId;
      }
      if (this.searchSelectDeptId) {
        params.deptId = this.searchSelectDeptId;
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
        params.startDate = startDate;
        params.endDate = endDate;
      }
      getDoctorPage(params)
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
    getDeptList() {
      let loadingInstance = Loading.service({});
      deptAll()
        .then((data) => {
          console.log(data);
          if (data && data.data) {
            this.deptList = data.data;
          }
          loadingInstance.close();
        })
        .catch(() => {
          loadingInstance.close();
        });
    },
    // 删除医生
    handleDelete(row, index) {
      this.$confirm("确认删除该医生信息?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let loadingInstance = Loading.service({});
          deleteDoctor(row.id)
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
    // 打开添加医生模态框
    handleCreateDoctor() {
      this.resetCreateDoctorInput();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    resetCreateDoctorInput() {
      this.fromData = new FormData();
      this.createDoctorInput = {
        id: "",
        doctorName: null,
        doctorId: null,
        scheduleName: null,
        regLevelName: null,
        description: null,
        introduce: null,
        file: {},
      };
      this.src = "";
      this.isShowImg = false;
    },
    // 打开修改医生模态框
    handleEdit(item) {
      this.resetCreateDoctorInput();
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });

      this.createDoctorInput.id = item.id;
      this.createDoctorInput.doctorName = item.doctorName;
      this.createDoctorInput.doctorId = item.doctorId;
      this.createDoctorInput.scheduleName = item.scheduleName;
      this.createDoctorInput.regLevelName = item.regLevelName;
      this.createDoctorInput.description = item.description;
      this.src = process.env.VUE_APP_BASE_API+ `/hospt/doctorImg/${item.id}`; // base.sq +
      this.isShowImg = true;
    },
    updateImg(param) {
      let _this = this;
      let files = param.target.files[0];
      this.createDoctorInput.file = files;
      if (!param || !window.FileReader) return; // 看支持不支持FileReader
      let reader = new FileReader();
      reader.readAsDataURL(files); // 这里是最关键的一步，转换就在这里
      reader.onloadend = function () {
        _this.src = this.result;
        _this.isShowImg = true;
      };
    },
    check() {
      if (!this.createDoctorInput.doctorName) {
        this.$message({
          type: "info",
          message: "请输入医生姓名!",
        });
        return false;
      }
      if (!this.createDoctorInput.doctorId) {
        this.$message({
          type: "info",
          message: "请输入医生编码!",
        });
        return false;
      }
      if (!this.createDoctorInput.scheduleName) {
        this.$message({
          type: "info",
          message: "请输入医生级别名称!",
        });
        return false;
      }
      if (!this.createDoctorInput.regLevelName) {
        this.$message({
          type: "info",
          message: "请输入号源级别名称!",
        });
        return false;
      }
      if (!this.createDoctorInput.file.name) {
        this.$message({
          type: "info",
          message: "请选择图片!",
        });
        return false;
      }
      return true;
    },
    saveDept() {
      if (!this.check()) {
        return;
      }
      if (this.dialogStatus === "update") {
        this.updateDoctorApi();
      } else {
        this.createDoctorApi();
      }
    },
    createDoctorApi() {
      let fd = new FormData(); // FormData 对象
      fd.append("file", this.createDoctorInput.file); // 文件对象
      fd.append("doctorName", this.createDoctorInput.doctorName);
      fd.append("doctorId", this.createDoctorInput.doctorId);
      fd.append("scheduleName", this.createDoctorInput.scheduleName);
      fd.append("regLevelName", this.createDoctorInput.regLevelName);
      fd.append("description", this.createDoctorInput.description);
      fd.append("introduce", this.createDoctorInput.introduce);
      let loadingInstance = Loading.service({});
      const params = this.createDoctorInput;

      axios.post(process.env.VUE_APP_BASE_API+'/hospt/create', fd, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then(res => {
            console.log(res.data)
            if (res.data.code !== 200) {
              this.$message({
                type: "info",
                message: res.data.msg,
              });
            } else {
              console.log(1)
              this.$message({
                type: "success",
                message: "添加成功！",
              });
              console.log(1)
              this.dialogFormVisible = false;
              this.getTableList();
            }
          loadingInstance.close();
      })
      .catch(err => {
          loadingInstance.close();
      })

    //   createDoctor(fd)
    //     .then((data) => {
    //       if (data && data.data) {
    //         if (data.data.code !== 200) {
    //           this.$message({
    //             type: "info",
    //             message: data.data.msg,
    //           });
    //         } else {
    //           this.$message({
    //             type: "success",
    //             message: "添加成功！",
    //           });
    //           this.dialogFormVisible = false;
    //           this.getTableList();
    //         }
    //       }
    //       loadingInstance.close();
    //     })
    //     .catch(() => {
    //       loadingInstance.close();
        // });
    },
    updateDoctorApi() {
      let fd = new FormData(); // FormData 对象
      fd.append("id", this.createDoctorInput.id);
      fd.append("file", this.createDoctorInput.file); // 文件对象
      fd.append("doctorName", this.createDoctorInput.doctorName);
      fd.append("doctorId", this.createDoctorInput.doctorId);
      fd.append("scheduleName", this.createDoctorInput.scheduleName);
      fd.append("regLevelName", this.createDoctorInput.regLevelName);
      fd.append("description", this.createDoctorInput.description);
      fd.append("introduce", this.createDoctorInput.introduce);
      let loadingInstance = Loading.service({});
      axios.post(process.env.VUE_APP_BASE_API+'/hospt/update', fd, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
        .then((data) => {
          if (data && data.data) {
            if (data.data.code !== 200) {
              this.$message({
                type: "info",
                message: data.data.msg,
              });
            } else {
              this.$message({
                type: "success",
                message: "修改成功！",
              });
              this.dialogFormVisible = false;
              this.getTableList();
            }
          }
          loadingInstance.close();
        })
        .catch(() => {
          loadingInstance.close();
        })
    },
  },
}
</script>
<style lang="scss" scoped>
  .filter-container {
    .search-col {
      margin: 5px 0;
    }
  }
  .dialog-img-div {
    width: 150px;
    height: 150px;
    text-align: center;
    font-size: 30px;
    line-height: 150px;
    position: relative;
    border-radius: 4px;
    border: 1px solid #DCDFE6;

    .dialog-img-input {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
      z-index: 99;
    }

    .dialog-img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 98;
    }
  }
</style>
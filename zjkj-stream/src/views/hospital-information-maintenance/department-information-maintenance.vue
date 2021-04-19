<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row :gutter="20">
        <el-col :span="6" class="search-col">
          <el-input v-model="searchDeptName" @input="getTableList" type="text" placeholder="科室名称" name="searchDeptName"></el-input>
        </el-col>
        <el-col :span="6" class="search-col">
          <el-input v-model="searchDeptCode" @input="getTableList" type="text" placeholder="科室编码" name="searchDeptCode"></el-input>
        </el-col>
        <el-col :span="6" class="search-col">
          <el-input v-model="searchName" @input="getTableList" type="text" placeholder="添加人姓名" name="name"></el-input>
        </el-col>
        <el-col :span="6" class="search-col">
          <el-select v-model="searchSelectDeptType" @change="getTableList" placeholder="选择类型" style="width: 100%" class="filter-item">
            <el-option label="请选择科室类型" value=""></el-option>
            <el-option v-for="item in deptType" :key="item.value" :label="item.title" :value="item.value" />
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
            end-placeholder="结束日期">
          </el-date-picker>
        </el-col>
        <el-col :span="6" class="search-col">
        </el-col>
        <el-col :span="6" class="search-col">
          <el-button class="filter-item" style="float: right;" type="primary" icon="el-icon-edit"
                     @click="handleCreateDept">
            添加科室
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
      <el-table-column label="日期" width="180" align="center">
        <template slot-scope="scope">
          {{ scope.row.createTime | dateFilter}}
        </template>
      </el-table-column>
      <el-table-column label="介绍" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.introduce }}</span>
        </template>
      </el-table-column>
      <el-table-column label="作者" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.creatorName }}
        </template>
      </el-table-column>
      <el-table-column label="科室名称" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.deptName }}
        </template>
      </el-table-column>
      <el-table-column label="科室ID" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.deptCode }}
        </template>
      </el-table-column>
      <el-table-column label="状态" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.delFlag | delFlagFilter}}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini"  @click="handleEdit(row,$index)">
            编辑
          </el-button>
          <el-button size="mini" type="success">
            发布
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                @pagination="getTableList"/>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :model="createDeptInput" label-position="left" label-width="70px"
               style="width: 400px; margin-left:50px;">
        <el-form-item label="科室名称">
          <el-select v-model="createDeptInput.deptName" @change="selectChange" placeholder="请选择科室名称" style="width: 90%"
                     class="filter-item">
            <el-option v-for="item in deptList" :key="item.deptId" :label="item.deptName" :value="item.deptName"/>
          </el-select>
        </el-form-item>
        <el-form-item label="科室编码">
          <el-input v-model="createDeptInput.deptCode" type="text" placeholder="科室编码" name="deptCode"
                    disabled></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="selectDeptType" placeholder="选择类型" style="width: 90%" class="filter-item">
            <el-option v-for="item in deptType" :key="item.value" :label="item.title" :value="item"/>
          </el-select>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="createDeptInput.deptMobile" type="text" placeholder="电话" name="deptMobile"></el-input>
        </el-form-item>
        <el-form-item label="图片">
          <div class="dialog-img-div">
            <input type="file" class="dialog-img-input" id='img' name='img' accept="image/*" @change="updateImg"/>
            <img v-if="isShowImg" style="width: 150px; height: 150px" :src="src" class="dialog-img">
            <span v-if="!isShowImg">+</span>
          </div>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="createDeptInput.description" type="textarea"
                    autosize placeholder="备注" name="description"></el-input>
        </el-form-item>
        <el-form-item label="介绍">
          <el-input v-model="createDeptInput.introduce" type="textarea"
                    autosize placeholder="介绍" name="introduce"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="saveDept">
          保存
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import Pagination from "@/components/Pagination/index";
  import { Loading } from 'element-ui';
  import { deptPage, getDeptInfo, createDept, updateDept, deleteDept } from '@/api/hospital-information-maintenance'

  export default {
    name: 'department-information-maintenance',
    components: {Pagination},
    filters: {
      dateFilter(date) {
        return date.split("T").join(' ');
      },
      delFlagFilter(statue) {
        if (statue === '0') {
          return '已发布';
        } else {
          return '已删除';
        }
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

        // 添加/修改模态框
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '修改',
          create: '添加'
        },

        deptList: [], // 科室列表
        deptType: [ // 科室类型
          {value: 1, title: '门诊'},
          {value: 2, title: '住院'}
        ],
        selectDeptType: {value: 1, title: '门诊'}, // 选中的科室类型

        searchName: '',
        searchDeptName: '',
        searchDeptCode: '',
        searchSelectDeptType: '',
        searchDate: '',

        createDeptInput: {
          id: '',
          deptName: '', // 科室名称
          deptCode: '', // 科室编码
          deptMobile: '', // 电话
          deptType: '1', // 类型
          description: '', // 备注
          introduce: '', // 介绍
          file: undefined,
        },
        fromData: new FormData(),
        isShowImg: false,
        src: '',
      }
    },
    created() {
      this.getTableList()
      this.getDeptList()
    },
    methods: {
      getTableList() {
        this.listLoading = true;
        let params = 'pageNo=' + this.listQuery.page + '&pageSize=' + this.listQuery.limit;
        if (this.searchDeptName) {
          params = params + '&deptName=' + this.searchDeptName;
        }
        if (this.searchDeptCode) {
          params = params + '&deptCode=' + this.searchDeptCode;
        }
        if (this.searchSelectDeptType === 1 || this.searchSelectDeptType === 2) {
          params = params + '&deptType=' + this.searchSelectDeptType;
        }
        if (this.searchDate) {
          const startDate = this.searchDate[0].getFullYear() + '-' + (this.searchDate[0].getMonth() + 1) + '-' + this.searchDate[0].getDate();
          const endDate = this.searchDate[1].getFullYear() + '-' + (this.searchDate[1].getMonth() + 1) + '-' + this.searchDate[1].getDate();
          params = params + '&startDate=' + startDate + '&endDate=' + endDate;
        }
        if (this.searchName) {
          params = params + '&creatorName=' + this.searchName;
        }
        deptPage(params).then((data) => {
          if (data && data.data) {
            this.tableListData = data.data.records;
            this.total = Number(data.data.total);
          }
          this.listLoading = false;
        }).catch(() => {
          this.listLoading = false;
        })
      },
      getDeptList() {
        const params = {
          hospId: '1'
        }
        let loadingInstance = Loading.service({});
        getDeptInfo(params).then((data) => {
          if (data && data.data) {
            this.deptList = data.data;
          }
          loadingInstance.close();
        }).catch(() => {
          loadingInstance.close();
        })
      },
      resetCreateDeptInput() {
        this.fromData = new FormData();
        this.createDeptInput = {
          id: '',
          deptName: '', // 科室名称
          deptCode: '', // 科室编码
          deptMobile: '', // 电话
          deptType: '1', // 类型
          description: '', // 备注
          introduce: '', // 介绍
          file: {},
        }
        this.src = '';
        this.isShowImg = false;
      },
      selectChange(value) {
        this.deptList.forEach(item => {
          if (item.deptName === value) {
            this.createDeptInput.deptCode = item.deptId;
          }
        })
      },
      // 打开添加/修改科室模态框
      handleCreateDept() {
        this.resetCreateDeptInput();
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      updateImg(param) {

        let _this = this;
        let files = param.target.files[0];
        this.createDeptInput.file = files;
        if (!param || !window.FileReader) return; // 看支持不支持FileReader
        let reader = new FileReader();
        reader.readAsDataURL(files); // 这里是最关键的一步，转换就在这里
        reader.onloadend = function () {
          _this.src = this.result;
          _this.isShowImg = true;
        }

        //先获取用户上传的文件对象
        // this.createDeptInput.file = e.target.files;
        // let fileObj = param.file // 相当于input里取得的files
        // let fd = new FormData()// FormData 对象
        // fd.append('file', fileObj)// 文件对象
        // fd.append('deptName', this.createDeptInput.deptName);
        // fd.append('deptCode', this.createDeptInput.deptCode);
        // fd.append('deptMobile', this.createDeptInput.deptMobile);
        // fd.append('deptType', this.selectDeptType.value);
        // fd.append('description', this.createDeptInput.description);
        // fd.append('introduce', this.createDeptInput.introduce);
        // if (this.dialogStatus === 'update') {
        //   fd.append('id', this.createDeptInput.id);
        //   this.updateDeptApi(fd);
        // } else {
        //   this.createDeptApi(fd);
        // }
      },
      check() {
        if (!this.createDeptInput.deptName) {
          this.$message({
            type: 'info',
            message: '请选择科室名称!'
          });
          return false;
        }
        if (!this.selectDeptType.value) {
          this.$message({
            type: 'info',
            message: '请选择科室类型!'
          });
          return false;
        }
        if (!this.createDeptInput.deptMobile) {
          this.$message({
            type: 'info',
            message: '请输入电话!'
          });
          return false;
        }
        if (!this.createDeptInput.file.name) {
          this.$message({
            type: 'info',
            message: '请选择图片!'
          });
          return false;
        }
        return true;
      },
      saveDept() {
        if (!this.check()) {
          return;
        }
        if (this.dialogStatus === 'update') {
          this.updateDeptApi();
        } else {
          this.createDeptApi();
        }
      },
      // 添加科室
      createDeptApi() {
        let fd = new FormData()// FormData 对象
        fd.append('file', this.createDeptInput.file)// 文件对象
        fd.append('deptName', this.createDeptInput.deptName);
        fd.append('deptCode', this.createDeptInput.deptCode);
        fd.append('deptMobile', this.createDeptInput.deptMobile);
        fd.append('deptType', this.selectDeptType.value);
        fd.append('description', this.createDeptInput.description);
        fd.append('introduce', this.createDeptInput.introduce);
        let loadingInstance = Loading.service({});
        createDept(fd).then(data => {
          if (data && data.data) {
            if (data.data.code !== 200) {
              this.$message({
                type: 'info',
                message: data.data.msg
              });
            } else {
              this.$message({
                type: 'success',
                message: '添加成功！'
              });
              this.dialogFormVisible = false;
              this.getTableList();
            }
          }
          loadingInstance.close();
        }).catch(() => {
          loadingInstance.close();
        })
      },
      // 修改科室
      updateDeptApi() {
        let fd = new FormData()// FormData 对象
        fd.append('file', this.createDeptInput.file)// 文件对象
        fd.append('deptName', this.createDeptInput.deptName);
        fd.append('deptCode', this.createDeptInput.deptCode);
        fd.append('deptMobile', this.createDeptInput.deptMobile);
        fd.append('deptType', this.selectDeptType.value);
        fd.append('description', this.createDeptInput.description);
        fd.append('introduce', this.createDeptInput.introduce);
        fd.append('id', this.createDeptInput.id);

        let loadingInstance = Loading.service({});
        updateDept(fd).then(data => {
          if (data && data.data) {
            if (data.data.code !== 200) {
              this.$message({
                type: 'info',
                message: data.data.msg
              });
            } else {
              this.$message({
                type: 'success',
                message: '修改成功！'
              });
              this.dialogFormVisible = false;
              this.getTableList();
            }
          }
          loadingInstance.close();
        }).catch(() => {
          loadingInstance.close();
        })
      },
      // 编辑科室
      handleEdit(item) {
        this.resetCreateDeptInput();
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })

        this.createDeptInput.id = item.id;
        this.createDeptInput.deptName = item.deptName;
        this.createDeptInput.deptMobile = item.deptMobile;
        if (item.deptType === '1') {
          this.selectDeptType = {value: 1, title: '门诊'}
        } else {
          this.selectDeptType = {value: 2, title: '住院'}
        }
        // this.createDeptInput.deptType = item.deptType;
        this.createDeptInput.deptCode = item.deptCode;
        this.createDeptInput.introduce = item.introduce;
        this.createDeptInput.description = item.description;
        this.src = 'http://127.0.0.1:8088' + `/hospt/dptImg/${item.id}`; // base.sq + 
        this.isShowImg = true;
      },
      // 删除科室
      handleDelete(row, index) {
        this.$confirm('确认删除该科室?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let loadingInstance = Loading.service({});
          deleteDept(row.id).then((data) => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.getTableList();
            loadingInstance.close();
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '删除失败，请重试!'
            });
            loadingInstance.close();
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
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

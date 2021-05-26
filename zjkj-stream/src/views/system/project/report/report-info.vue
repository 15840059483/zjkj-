<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row :gutter="24">
        <el-col :span="8" class="search-col">
          <el-input v-model="equModle" @input="getTableList" type="text" placeholder="设备号" name="equModle"></el-input>
        </el-col>
        <el-col :span="8" class="search-col">
          <el-input v-model="insCategory" @input="getTableList" type="text" placeholder="仪器类别" name="insCategory"></el-input>
        </el-col>
        <el-col :span="8" class="search-col">
          <el-select v-model="conMode" @change="getTableList" style="width: 100%" class="filter-item">
            <el-option label="连接类型" value=""></el-option>
            <el-option label="单向" value="1" />
            <el-option label="双向" value="0" />
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
        <el-col :span="8" class="search-col">
          <el-button
            class="filter-item"
            style="width: 100%;float: right"
            type="primary"
            icon="el-icon-edit"
            @click="handleCreateItemInfo"
          >
            添加设备信息
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
      <el-table-column label="设备型号" width="180" align="center">
        <template slot-scope="scope">
          {{ scope.row.equModle}} 
        </template>
      </el-table-column>
      <el-table-column label="仪器类别" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.insCategory }}</span>
        </template>
      </el-table-column>
      <el-table-column label="连接方式" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.conMethod | conMethodFilter}}
        </template>
      </el-table-column>
      <el-table-column label="所属小组" width="210" align="center">
        <template slot-scope="scope">
          {{ scope.row.team }}
        </template>
      </el-table-column>
      <el-table-column label="设备厂家" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.manufacturer }}
        </template>
      </el-table-column>
      <el-table-column label="院区" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.hospital }}
        </template>
      </el-table-column>
      <el-table-column label="设备数量" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.equNum}}
        </template>
      </el-table-column>
      <el-table-column label="连接模式" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.conMode | conModeFilter }}
        </template>
      </el-table-column>
      <el-table-column label="备注" width="110" align="center"  v-if="dialogStatus=='check'">
        <template slot-scope="scope">
          {{ scope.row.description }}
        </template>
      </el-table-column>
      <el-table-column label="录入人员" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.creatorName | nameFilter }}
        </template>
      </el-table-column>
      <el-table-column label="修改人员" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.operatorName | nameFilter }}
        </template>
      </el-table-column>
      <el-table-column label="日期" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.createTime  | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}
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
          <el-button
            size="mini"
            type="danger"
           @click="handleDelete(row , $index)"
          >
            删除
          </el-button>

          <el-button
            size="mini"
            type="danger"
           @click="handleDelete(row , $index)"
           v-if="dialogStatus=='check'"
          >
            审核
          </el-button>

        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                @pagination="getTableList"/>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :model="createItemInfo"
        :rules="rules"
        label-width="100px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="厂家" prop="manufacturer">
          <el-input
            v-model="createItemInfo.manufacturer"
            type="text"
            autosize
            placeholder="厂家"
            name="manufacturer"
          ></el-input>
        </el-form-item>
         <el-form-item label="院区" prop="hospital">
          <el-input
            v-model="createItemInfo.hospital"
            type="text"
            autosize
            placeholder="院区"
            name="hospital"
          ></el-input>
        </el-form-item>
        <el-form-item label="设备型号" prop="equModle">
          <el-input
            v-model="createItemInfo.equModle"
            type="text"
            autosize
            placeholder="设备型号"
            name="equModle"
          ></el-input>
        </el-form-item>
        <el-form-item label="仪器类别" prop="insCategory">
          <el-input
            v-model="createItemInfo.insCategory"
            type="text"
            autosize
            placeholder="仪器类别"
            name="insCategory"
          ></el-input>
        </el-form-item>
        <el-form-item label="设备数量" prop="equNum">
          <el-input
            v-model.number="createItemInfo.equNum"
            autosize
            placeholder="设备数量"
            name="equNum"
          ></el-input>
        </el-form-item>
        <el-form-item label="连接方式">
          <el-select
            v-model="createItemInfo.conMethod"
            placeholder="选择方式"
            style="width: 100%"
            class="filter-item"
          >
            <el-option label="网口" value="1"></el-option>
            <el-option label="串口" value="0" />
            <el-option label="读数据库" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="连接模式">
          <el-select
            v-model="createItemInfo.conMode"
            placeholder="选择模式"
            style="width: 100%"
            class="filter-item"
          >
            <el-option label="单向" value="1"></el-option>
            <el-option label="双向" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="所属小组" prop="team">
          <el-input
            v-model="createItemInfo.team"
            type="text"
            autosize
            placeholder="所属小组"
            name="team"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('organizationTable.area')" prop="province">
          <el-cascader v-model="createItemInfo.areas" :options="provinceOptions" :props="props" clearable filterable change-on-select style="width:100%;" />
        </el-form-item>
        <el-form-item :label="$t('organizationTable.street')" prop="street">
          <el-input v-model="createItemInfo.street" placeholder="详细地址" maxlength="120" />
        </el-form-item>
        <el-form-item label="备注" prop="description">
          <el-input
            v-model="createItemInfo.description"
            type="textarea"
            autosize
            placeholder="备注"
            name="description"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false"> 取消 </el-button>
        <el-button type="primary" @click="saveItemInfo"> 保存 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import Pagination from "@/components/Pagination/index";
  import { Loading } from 'element-ui';
  import { getEquipmentInfo , updateItemInfo , createItemInfo , deleteItemInfo} from '@/api/system/common/item'
  import Data from '@/api/pcaa'
  import { parseTime } from '@/utils'
  export default {
    name: "order-information",
    components: {Pagination},
    filters: {
      conMethodFilter(val) {
        if (val === '1') {
          return '网口';
        } else if (val === '0') {
          return '串口'
        }else if(val=='2'){
          return '读数据库'
        }
        return '';
      },
      conModeFilter(val) {
        if (val === '1') {
          return '单向';
        } else if (val === '0') {
          return '双向'
        }
        return '';
      },
      nameFilter(val){
        if(val){
          
          return val
        }
        return '无'
      }
    },
    data() {
      return {
        provinceOptions: null,
        props: {
        children: 'children'
        },
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
        equModle: '',
        insCategory: '',
        conMode: '',
        searchDate: '',

        // 添加/修改模态框
        dialogFormVisible: false,
        dialogStatus: "",
        textMap: {
          update: "修改",
          create: "添加",
        },
        //添加信息
        createItemInfo:{
          id:null,
          conMethod: '',
          conMode: '',
          del: '',
          department: '',
          equModle: '',
          equNum: '',
          genre:'',
          hospital:'',
          insCategory:'',
          manufacturer:'',
          description:'',
          province:'',
          team:'',
          areas: [],
          street: '',
          children: [], // 必须加，否则新增的节点不显示
          street:'',
        },
        rules: {
        insCategory:[
          { required: true, message: '请输入仪器类别', trigger: 'blur' },
          { min: 2, max: 32, message: '长度在 2 到 32 个字符', trigger: 'blur' },
        ],
        team:[
          { required: true, message: '请输入所属小组', trigger: 'blur' },
          { min: 2, max: 32, message: '长度在 2 到 32 个字符', trigger: 'blur' },
        ],
        manufacturer:[
          { required: true, message: '请输入厂家', trigger: 'blur' },
          { min: 2, max: 32, message: '长度在 2 到 32 个字符', trigger: 'blur' },
        ],
        conMode: [
          { required: true, message: '请输入设备型号', trigger: 'blur' },
          { min: 2, max: 32, message: '长度在 2 到 32 个字符', trigger: 'blur' },
          //{ validator: validOrganizationKey, trigger: 'blur' }
        ],
        equModle: [
          { required: true, message: '请选择设备型号', trigger: 'blur' },
          { min: 2, max: 32, message: '长度在 2 到 32 个字符', trigger: 'blur' },
        ],
        equNum: [
          { required: true, message: '请输入数字', trigger: 'blur' ,type:'number'}
        ],
        hospital: [
          { required: true, message: '请输入阮区', trigger: 'blur' },
          { min: 2, max: 32, message: '长度在 2 到 32 个字符', trigger: 'blur' },
        ],
        description: [
          {  message: '请填写备注信息', trigger: 'blur' }
        ]
      },
      args: [null, null, null],
      }
    },
    created() {
      this.getTableList()
      this.getAreaList()
    },
    methods: { 
    //获取地区
    getAreaList() {
      var options = []
      for (var key in Data['86']) {
        var citys = []
        for (var keyc in Data[key]) {
          var areas = []
          for (var keya in Data[keyc]) {
            var area = { value: keya, label: Data[keyc][keya] }
            areas.push(area)
          }
          var city = { value: keyc, label: Data[key][keyc], children: areas }
          citys.push(city)
        }
        var province = { value: key, label: Data['86'][key], children: citys }
        options.push(province)
      }
      this.provinceOptions = options
    },
      // 打开添加医生模态框
    handleCreateItemInfo() {
      this.resetCreateItemInfoInput();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    resetCreateItemInfoInput() {
      this.createItemInfo = {
          id:null,
          conMethod: '',
          conMode: '',
          del: '',
          department: '',
          equModle: '',
          equNum: '',
          genre:'',
          hospital:'',
          insCategory:'',
          manufacturer:'',
          description:'',
          province:'',
          team:'',
          areas: [],
          street: '',
          children: [], // 必须加，否则新增的节点不显示
          street:'',
      };
      this.src = "";
      this.isShowImg = false;
    },
     // 打开修改模态框
    handleEdit(item) {
      this.createItemInfo = Object.assign({}, item)
      if (!this.createItemInfo.areas || this.createItemInfo.areas.length === 0) {
        this.createItemInfo.areas = [
          this.createItemInfo.province,
          this.createItemInfo.city,
          this.createItemInfo.area
        ]
      }
      // JSON不接受循环对象——引用它们自己的对象
      delete this.createItemInfo.children
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    //修改信息
    updateItemInfo(){
      let loadingInstance = Loading.service({});
      console.log(this.createItemInfo.areas)
      console.log(this.createItemInfo)
      updateItemInfo(this.createItemInfo).
        then((res) => {
          
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
    addItemInfo(){
       let loadingInstance = Loading.service({});
      createItemInfo(this.createItemInfo).
        then((res) => {
          
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
    // 删除项目信息
    handleDelete(row, index) {
      this.$confirm("确认删除该设备信息?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let loadingInstance = Loading.service({});
          deleteItemInfo(row.id)
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
    saveItemInfo(){
      if (this.dialogStatus === "update") {
        this.updateItemInfo();
      } else {
        this.addItemInfo();
      }
    },
      //获取信息
      getTableList() {
        console.log(this.$store.getters.roles.indexOf('SPADMIN'))
        if(this.$store.getters.roles.indexOf('SPADMIN')!=-1){
            this.dialogStatus='check'
        }
        console.log(this.$store.getters.roles.indexOf('SPADMIN'))
        this.listLoading = true;
        const params = {
        conMode:this.conMode,
        equModle:this.equModle,
        insCategory:this.insCategory,
        pageNo: this.listQuery.page,
        pageSize: this.listQuery.limit,
      };
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
        getEquipmentInfo(params).then((data) => {
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

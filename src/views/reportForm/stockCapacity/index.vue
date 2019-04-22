<template>
  <div class="app-container">
    <v-pageSearch>
      <el-form :inline="true">
        <el-form-item label="仓库：" label-width="70px">
          <select-basics
            v-model="formSearch.deptId"
            type="dept"
            clearable
            placeholder="请选择"
          />
        </el-form-item>
        <el-form-item>
          <el-button size="mini" type="primary" icon="el-icon-search" @click="getTableData">查询</el-button>
        </el-form-item>
      </el-form>
    </v-pageSearch>

    <v-pageToolbar align="left">
      <el-button>
        <i class="iconfont icon">&#xe67b;</i>导出
      </el-button>
    </v-pageToolbar>

    <v-pageTable>
      <el-table
        v-loading="table.loading"
        :header-cell-style="$store.state.element.headerBg"
        :data="table.body"
        :max-height="table.autoHeight"
      >
        <el-table-column prop="employeeCode" label="库位编号"/>
        <el-table-column prop="employeeName" label="库位名称"/>
        <el-table-column prop="employeeRealName" label="库位类型"/>
        <el-table-column prop="mail" label="仓库"/>
        <el-table-column prop="phone" label="库存数"/>
        <el-table-column prop="employeeName" label="体积"/>
        <el-table-column prop="shipperName" label="重量"/>
        <el-table-column prop="employeeTypeName" label="托盘"/>
      </el-table>
      <template slot="pagination" slot-scope="props">
        <el-pagination
          :layout="props.layout"
          :total="table.paginationTotal"
          :current-page.sync="table.currentPage"
          :page-size="table.pageSize"
          :page-sizes="props.sizes"
          background
          @size-change="sizeChange"
          @current-change="pageChange"
        />
      </template>
    </v-pageTable>
  </div>
</template>

<script>
export default {
  name: 'StockCapacity',
  data() {
    return {
      table: {
        body: [],
        page: 1,
        pageSize: 15,
        currentPage: 1,
        paginationTotal: 15,
        autoHeight: 749,
        loading: false
      },
      formSearch: {
        employeeCode: '', // 工号
        employeeName: '', // 用户名
        deptId: '', // 部门Id
        rid: '' // 角色Id
      }
    }
  },
  mounted() {
    this.getTableData()
  },
  methods: {
    // 分页查询
    getTableData(val, flag) {
      const this_ = this
      if (flag === 'pageSize') {
        this.table.pageSize = val
      } else if (flag === 'page') {
        this.table.page = val
      }
      const url = 'kaili-basic/v1/baseEmployee'
      const params = this.formSearch
      params.page = this.table.page
      params.pageSize = this.table.pageSize
      this.table.loading = true
      this.getRequestParams(url, params).then(data => {
        this_.table.loading = false
        this.table.body = data.data.records
        this.table.paginationTotal = data.data.total
      })
    },
    // 表格条数改变
    sizeChange(val) {
      this.getTableData(val, 'pageSize')
    },
    // 表格页数改变
    pageChange(val) {
      this.getTableData(val, 'page')
    }
  }
}
</script>

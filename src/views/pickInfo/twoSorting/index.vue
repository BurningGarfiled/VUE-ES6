<template>
  <div class="app-container">
    <v-pageSearch>
      <el-form :inline="true">

        <el-form-item :label="'波次单号：'">
          <el-input
            v-model="formSearch.boxName"
            style="width:150px;padding-right:0;"
            placeholder="请输入"
          />
        </el-form-item>

        <el-form-item label="租赁时间：" >
          <el-date-picker
            v-model="formSearch.leaseTime"
            type="datetime"
            placeholder="选择日期时间"
            style="width:180px;padding-right:0;"/>
        </el-form-item>

        <el-button
          type="primary"
          icon="el-icon-search"
          @click="onSearch"
        >查询</el-button>
      </el-form>

    </v-pageSearch>
    <v-pageToolbar align="left">
      <el-button :disabled="!table.body.length > 0" @click="onExport">导出</el-button>
    </v-pageToolbar>

    <v-pageTable>
      <el-table v-loading="table.loading" :data="table.body" :max-height="table.autoHeight" :header-cell-style="$store.state.element.headerBg" tooltip-effect="dark" style="width: 100%" @selection-change="selec" >
        <el-table-column type="selection" fixed width="55"/>
        <el-table-column prop="depotName" min-width="80" label="波次单号"/>
        <el-table-column prop="boxName" min-width="80" label="货主"/>
        <el-table-column prop="boxNo" min-width="80" label="仓库"/>
        <el-table-column prop="isEnable" min-width="80" label="状态"/>
        <el-table-column prop="createTime" min-width="80" label="创建时间">
          <template slot-scope="scope">
            {{ timeToStr(scope.row.createTime,'{y}-{m}-{d}') }}
          </template>
        </el-table-column>
        <el-table-column prop="createTime" min-width="80" label="拣货时间">
          <template slot-scope="scope">
            {{ timeToStr(scope.row.createTime,'{y}-{m}-{d}') }}
          </template>
        </el-table-column>
        <el-table-column prop="createTime" min-width="80" label="结束时间">
          <template slot-scope="scope">
            {{ timeToStr(scope.row.createTime,'{y}-{m}-{d}') }}
          </template>
        </el-table-column>
        <el-table-column prop="boxName" min-width="80" label="拣货人"/>
        <el-table-column :label="'操作'" fixed="right" width="200">
          <template slot-scope="scope">
            <el-button :title="'分配'" type="primary" size="mini" icon="el-icon-edit" @click="onCompile(scope.row)"/>
            <el-button :title="'结束'" type="primary" size="mini" icon="el-icon-delete" @click="onDelete(scope.row)"/>
          </template>
        </el-table-column>
      </el-table>
      <template slot="pagination" slot-scope="props">
        <el-pagination :layout="props.layout" :page-sizes="props.sizes" :current-page.sync="table.currentPage" :total="table.paginationTotal" background @current-change="pageChange" @size-change="sizeChange" />
      </template>
    </v-pageTable>

  </div>
</template>

<script>
export default {
  name: 'TwoSorting',
  data() {
    return {
      // 验证规则
      formSearch: {
        depotId: '',
        boxName: '',
        boxNo: ''
      },
      table: {
        body: [],
        page: 1,
        pageSize: 15,
        paginationTotal: 0,
        autoHeight: 749,
        loading: false,
        currentPage: 1
      },
      Export: {}
    }
  },
  mounted() {
    this.onSearch()
  },
  methods: {
    // 勾选
    selec() {},
    // 查询
    onSearch() {
      this.getTableData(1, 'page')
      this.table.currentPage = 1
    },
    // 查询请求
    onRequest() {
      const url = 'kaili-basic/v1/pickBox'
      const params = {
        depotId: this.formSearch.depotId,
        boxName: this.formSearch.boxName,
        boxNo: this.formSearch.boxNo
      }
      this.Export = Object.assign({}, params)
      params.page = this.table.page
      params.pageSize = this.table.pageSize
      this.table.loading = true
      this.getRequestParams(url, params).then((res) => {
        this.table.loading = false
        this.table.body = res.data.records
        this.table.paginationTotal = res.data.total
        this.table.pageSize = res.data.size
      })
    },

    // 分配
    onCompile(row) {

    },

    // 结束
    onDelete(row) {
      const this_ = this
      this.$confirm('确认结束吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this_.table.loading = true
        const url = `kaili-basic/v1/pickBox/${row.boxId}`
        this.deleteRequest(url, '').then((res) => {
          this_.onRequest()
          this_.table.loading = false
          this_.$message({
            message: '结束成功',
            type: 'success'
          })
        })
      })
    },

    // ========================
    // 导出
    onExport() {
      const arr = []
      for (const key in this.Export) {
        arr.push(key + '=' + this.Export[key])
      }
      const params = arr.join('&')
      window.location.href = `/api/kaili-basic/v1/pickBox/export?` + params
    },
    sizeChange(val) {
      this.getTableData(val, 'pageSize')
    },
    pageChange(val) {
      this.getTableData(val, 'page')
    },
    getTableData(val, flag) {
      if (flag === 'pageSize') {
        this.table.pageSize = val
      } else if (flag === 'page') {
        this.table.page = val
      }
      this.onRequest()
    }
  }
}
</script>


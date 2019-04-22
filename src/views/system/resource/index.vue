<template>
  <div class="app-container">
    <v-pageSearch>
      <el-form :inline="true">
        <el-form-item label="编号：" label-width="70px">
          <el-input v-model="formSearch.code" clearable placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="名称：" label-width="70px">
          <el-input v-model="formSearch.name" clearable placeholder="请输入"/>
        </el-form-item>
        <el-form-item>
          <el-button size="mini" type="primary" icon="el-icon-search">查询</el-button>
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
        <el-table-column prop="code" label="编号"/>
        <el-table-column prop="menuName" label="菜单名称"/>
        <el-table-column prop="chiefMenu" label="父级菜单"/>
        <el-table-column prop="type" label="类型"/>
        <el-table-column prop="style" label="样式" min-width="200"/>
        <el-table-column prop="sort" label="排序"/>
        <el-table-column prop="path" label="路径" min-width="200"/>
        <el-table-column prop="createTime" label="创建时间" min-width="90">
          <template slot-scope="scope">{{ scope.row.createTime | parseTime('{y}-{m}-{d}') }}</template>
        </el-table-column>
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
  name: 'Resource',
  data() {
    return {
      table: {
        body: [
          {
            code: 'wj',
            menuName: '100000',
            chiefMenu: '王京',
            type: '异步请求',
            style: '15869111464',
            sort: '8022456',
            path: '',
            createTime: new Date().getTime()
          }
        ],
        page: 1,
        pageSize: 15,
        currentPage: 1,
        paginationTotal: 15,
        autoHeight: 749,
        loading: false
      },
      formSearch: {
        code: '', // 编号
        name: '' // 名称
      }
    }
  },
  methods: {
    sizeChange(val) {},
    pageChange(val) {}
  }
}
</script>


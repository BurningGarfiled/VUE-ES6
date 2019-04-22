<template>
  <div class="app-container">
    <v-pageSearch>
      <el-form :inline="true">
        <el-form-item label="部门：" label-width="70px">
          <el-input v-model="formSearch.name" clearable placeholder="请输入"/>
        </el-form-item>
        <el-form-item>
          <el-button size="mini" type="primary" icon="el-icon-search" @click="getTableData">查询</el-button>
        </el-form-item>
      </el-form>
    </v-pageSearch>

    <v-pageToolbar align="left">
      <el-button type="primary" icon="el-icon-plus" @click="onAdd">新增</el-button>
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
        <el-table-column prop="name" label="部门名称"/>
        <el-table-column prop="parentName" label="上级部门"/>
        <el-table-column prop="createTime" label="创建时间" min-width="90">
          <template slot-scope="scope">{{ scope.row.createTime | parseTime('{y}-{m}-{d}') }}</template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="200">
          <template slot-scope="scope">
            <el-button type="primary" title="编辑" icon="el-icon-edit" @click="editHandle(scope.row)"/>
            <el-button type="primary" title="删除" icon="el-icon-delete" @click="deleteHandle(scope.row)"/>
          </template>
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
    <!--新增弹窗-->
    <el-dialog :close-on-click-modal="false" :visible.sync="popDetail" :title="title" top="10vh" width="320px">
      <el-form ref="popForm" :model="popData" :rules="rules" label-width="120px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="部门名称：" prop="name">
              <el-input v-model="popData.name" placeholder=""/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="上级部门：" prop="parentId">
              <el-select v-model="formSearch.parentId" placeholder="请选择">
                <el-option
                  v-for="item in departmentOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="editLoading" type="primary" @click.native="submitForm('popForm')">确定</el-button>
        <el-button @click.native="popDetail = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Department',
  data() {
    return {
      rules: {
        name: [
          { required: true, message: '请输入部门名称', trigger: 'blur' }
        ]
      },
      table: {
        body: [
          {
            name: 'wj',
            parentName: '',
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
        name: '' // 部门名称
      },
      departmentOptions: [
        {
          value: '0',
          label: '全部'
        },
        {
          value: '1',
          label: '软件部'
        }
      ], // 部门列表
      title: '新增部门',
      isAdd: true, // 新增：true; 编辑：false
      editLoading: false, // 提交按钮禁用状态
      popDetail: false, // 弹窗显示状态
      popData: {
        name: '',
        parentId: ''
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
      const url = 'kaili-basic/v1/getPageDeps'
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
    // 新增
    onAdd() {
      const this_ = this
      this_.isAdd = true
      this_.title = '新增部门'
      this_.popDetail = true
      this_.resetForm('popForm')
      this_.$nextTick(() => {
        this_.$refs['popForm'].clearValidate()
      })
    },
    // 编辑
    editHandle(row) {
      const this_ = this
      this_.isAdd = false
      this_.title = '编辑部门'
      this_.popDetail = true
      this_.resetForm('popForm')
      this.popData = this.$gFun.arrDeepCopy(row)
      this_.$nextTick(() => {
        this_.$refs['popForm'].clearValidate()
      })
    },
    // 删除
    deleteHandle(row) {
      const this_ = this
      this.$confirm('确认删除？', '提示', {
        type: 'warning'
      }).then(() => {
        const url = 'kaili-basic/v1/deleteDep'
        const params = {
          did: row.id
        }
        this_.postRequest(url, params).then((data) => {
          this_.$message({
            message: '删除成功',
            type: 'success'
          })
          this_.getTableData()
        })
      })
    },
    // 提交表单
    submitForm(formName) {
      const this_ = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this_.editLoading = true
          const params = this_.$gFun.arrDeepCopy(this_.popData)
          let message = ''
          if (this_.isAdd) {
            const url = 'kaili-basic/v1/addDep'
            message = '新增成功'
            this_.postRequest(url, params).then(data => {
              this_.editLoading = false
              this_.$message({
                message: message,
                type: 'success'
              })
              this_.getTableData()
              this_.popDetail = false
            })
          } else {
            const url = 'kaili-basic/v1/modifyDep'
            message = '修改成功'
            this_.putRequest(url, params).then(data => {
              this_.editLoading = false
              this_.$message({
                message: message,
                type: 'success'
              })
              this_.getTableData()
              this_.popDetail = false
            })
          }
          setTimeout(function() {
            this_.editLoading = false
          }, 2000)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 重置表单
    resetForm(formName) {
      this.popData = {
        name: '',
        parentId: ''
      }
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


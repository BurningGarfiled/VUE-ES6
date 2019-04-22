<template>
  <div class="page-table">
    <slot/>
    <div class="page-table-pagination">
      <template v-if="pagination">
        <el-pagination
          :layout="pageLayout"
          :total="paginationTotal"
          :current-page.sync="currentPage"
          :page-sizes="pageSizes"
          :page-size="pageSize"
          :class="align"
          background
          @size-change="sizeChange"
          @current-change="pageChange"
        />
        <div class="text">
          <span class="text-title">{{ title }}</span><span class="text-content">{{ text }}</span>
        </div>
      </template>
      <template v-else>
        <slot :conten="conten" :sizes="sizes" :layout="layout" name="pagination"/>
      </template>
    </div>
  </div>
</template>

<script>

export default {
  name: 'VPageTable',
  props: {
    pagination: {
      type: Boolean,
      default: function() {
        return false
      }
    },
    paginationAlign: {
      type: String,
      default: function() {
        return 'right'
      }
    },
    pageSize: {
      type: Number,
      default: function() {
        return 15
      }
    },
    pageSizes: {
      type: Function,
      default: function() {
        return [10, 15, 30, 60, 100]
      }
    },
    paginationTotal: {
      type: Number,
      default: function() {
        return 0
      }
    },
    sizeChange: {
      type: Function,
      default: function() {
        return null
      }
    },
    pageChange: {
      type: Function,
      default: function() {
        return null
      }
    },
    pageLayout: {
      type: Function,
      default: function() {
        return 'total, sizes, prev, pager, next, jumper'
      }
    },
    title: {
      type: String,
      default: function() {
        return ''
      }
    },
    text: {
      type: String,
      default: function() {
        return ''
      }
    }
  },
  data() {
    return {
      conten: '我是子组件的数据',
      sizes: [10, 15, 30, 60, 100],
      layout: 'total, sizes, prev, pager, next, jumper'
    }
  },
  computed: {
    align() {
      let res
      switch (this.paginationAlign) {
        case 'right':
          res = 'textR'
          break
        case 'center':
          res = 'textC'
          break
        default:
          res = ''
      }
      return res
    }
  }
}
</script>

<style lang="scss" scoped>
    .page-table{
      padding:0 0 10px 0;
      background:#fff;
    }
    .page-table-pagination{
        position:relative;
        margin-top: 10px;
        text-align: right;
        .text{
            position:absolute;
            left:10px;
            bottom:8px;
            color:#098FFF;
            font-size:14px;
            font-weight:700;
            text-align:left;
            // .text-title{
            //     font-weight:normal;
            // }
        }
    }
</style>

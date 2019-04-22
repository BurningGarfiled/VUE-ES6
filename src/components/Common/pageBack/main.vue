<template>
  <div :class="align" class="reply">
    <el-button type="primary" class="fa fa-mail-reply" @click="goBack"> &nbsp;&nbsp;返回</el-button>
    <slot/>
  </div>
</template>

<script>
export default {
  name: 'VPageBack',
  props: {
    align: {
      type: String,
      default: function() {
        return 'right'
      }
    }
  },
  methods: {
    goBack() {
      history.back(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
    .reply{
        margin-bottom: 10px;
        padding: 20px 20px;
        background-color: #fff;
        &.right{
            text-align: right;
        }
        &.left{
            text-align: left;
        }
        &.center{
            text-align: center;
        }
    }
</style>

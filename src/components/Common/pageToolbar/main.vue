<template>
  <div :class="align" class="toolbar">
    <slot/>
  </div>
</template>

<script>
export default {
  name: 'VPageToolbar',
  props: {
    align: {
      type: String,
      default: function() {
        return 'right'
      }
    }
  }
}
</script>

<style lang="scss" scoped>

    .toolbar{
        margin-bottom: 10px;
        padding: 0px ;
        background-color: #ffffff;
        &.right{
            text-align: right;
        }
        &.left{
            text-align: left;
        }
    }
</style>

<!-- 引用或解释说明组件 -->
<template>
  <div v-once class="page-notes">
    <slot/>
  </div>
</template>

<script>
export default {
  name: 'VPageNotes'
}
</script>

<style lang="scss" scoped>

    .page-notes{
        display: block;
        padding: 15px 10px 15px 14px;
        margin-bottom: 10px;
        border-left: 4px solid #003266;
        background: #f2f2f2;
        line-height: 22px;
    }
</style>

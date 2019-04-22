<!-- 引用或解释说明组件 -->
<template>
  <div class="page-header">
    <slot/>
  </div>
</template>

<script>
export default {
  name: 'VPageHeader'
}
</script>

<style lang="scss" scoped>
    .page-header{
        display: block;
        padding: 10px 10px 10px 10px;
        margin-bottom: 10px;
        background: #f2f2f2;
        line-height: 22px;
    }
</style>

<template>
  <div class="page-search">
    <slot/>
  </div>
</template>

<script>
export default {
  name: 'VPageSearch',
  mounted() {

  }
}
</script>

<style lang="scss" scoped>
    .page-search{
        display: block;
        width: 100%;
        //padding: 5px 20px;
        background: #FAFAFA;
        border:1px solid #e9e9e9;
        border-radius: 3px;
        padding:18px 10px 0px;
        margin-bottom: 10px;
    }
</style>

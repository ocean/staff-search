<template>
  <tr class="row">
    <td class="group">{{ result.grp }}</td>
    <td class="division"><router-link :to="{ path: '/organisation', query: { div: result.div }}">{{ result.div }}</router-link></td>
    <td class="directorate"><router-link :to="{ path: '/organisation', query: { directorate: result.directorate }}">{{ result.directorate }}</router-link></td>
    <td class="branch"><router-link :to="{ path: '/organisation', query: { bran: result.bran }}">{{ result.bran }}</router-link></td>
    <td class="section"><router-link :to="{ path: '/organisation', query: { sect: result.sect }}">{{ result.sect }}</router-link></td>
  </tr>
</template>

<script>
export default {
  props: {
    result: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style scoped>
.centered {
  text-align: center;
}
.secondary {
  font-size: 14px;
}
</style>

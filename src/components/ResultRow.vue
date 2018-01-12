<template>
  <tr class="row">
    <td>
      <router-link :to="{ path: `/person/${result.userid}`}">{{ staffFullName }}</router-link> ({{ result.userid }})<br>
      <span class="secondary">{{ result.position_title }}</span>
    </td>
    <td>{{ formatPhone }}</td>
    <td>
      {{ result.sect }}<br>
      <span class="secondary">{{ result.bran }}</span>
    </td>
    <td>
      {{ result.location_name }}<!-- <br>
      {{ result.sublocation_name }} -->
    </td>
  </tr>
</template>

<script>
export default {
  props: ['result'],
  // data() {
  //   return {
  //     staffMember: this.$parent.result,
  //   };
  // },
  computed: {
    staffFullName() {
      const upcaseSurname = this.result.surname.toUpperCase();
      return `${upcaseSurname}, ${this.result.preferred_name}`;
    },
    formatPhone() {
      return `${this.result.phone.slice(0, 4)} ${this.result.phone.slice(4)}`;
    },
  },
};
</script>

<style scoped>
.secondary {
  font-size: 14px;
}
</style>

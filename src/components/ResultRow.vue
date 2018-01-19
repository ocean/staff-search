<template>
  <tr class="row">
    <td>
      <router-link :to="{ path: `/person/${lowerUserId}`}">{{ staffFullName }}</router-link><br>
      <span class="secondary">{{ result.position_title }}</span>
    </td>
    <td class="centered">{{ formattedPhone }}</td>
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
  computed: {
    staffFullName() {
      const upcaseSurname = this.result.surname.toUpperCase();
      return `${upcaseSurname}, ${this.result.preferred_name}`;
    },
    formattedPhone() {
      return `${this.result.phone.slice(0, 4)} ${this.result.phone.slice(4)}`;
    },
    lowerUserId() {
      return this.result.userid.toLowerCase();
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

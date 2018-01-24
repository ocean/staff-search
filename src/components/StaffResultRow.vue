<template>
  <tr class="row">
    <td>
      <router-link :to="{ path: `/person/${lowerUserId}`}">{{ staffFullName }}</router-link><br>
      <span class="secondary">{{ result.position_title }}</span>
    </td>
    <!-- <td class="centered">{{ formattedPhone }}</td> -->
    <td class="centered"><span v-html="formattedPhone"></span></td>
    <td>
      <router-link :to="{ path: '/organisation', query: { sect: result.sect }}">{{ result.sect }}
      </router-link><br>
      <span class="secondary">
        <router-link :to="{ path: '/organisation', query: { bran: result.bran }}">{{ result.bran }}</router-link>
      </span>
    </td>
    <td>
      {{ result.location_name }}<!-- <br>
      {{ result.sublocation_name }} -->
    </td>
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
  computed: {
    staffFullName() {
      const upcaseSurname = this.result.surname.toUpperCase();
      return `${upcaseSurname}, ${this.result.preferred_name}`;
    },
    formattedPhone() {
      const rawPhone = this.result.phone.trim();
      let formattedPhone = this.result.phone.trim();
      if (rawPhone.length === 16) {
        formattedPhone = `${rawPhone.slice(-16, -12)} ${rawPhone.slice(-12, -8)}<br>${rawPhone.slice(-8, -4)} ${rawPhone.slice(-4)}`;
      } else if (rawPhone.length === 8) {
        formattedPhone = `${rawPhone.slice(-8, -4)} ${rawPhone.slice(-4)}`;
      }
      return formattedPhone;
    },
    lowerUserId() {
      return encodeURI(this.result.userid.toLowerCase());
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

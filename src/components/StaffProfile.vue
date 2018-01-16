<template>
  <div class="staffProfile">
    <h3>Details</h3>
    <div id="profileTable">
      <section>
        <p id="messageArea" v-if="errors && errors.length">
          {{ errors }}
        </p>
        <table style="width: 100%;">
          <tbody>
            <tr>
              <td class="heading">Name</td>
              <td> {{ profile.formattedName }}</td>
              <td class="staffImage" rowspan="10"><img width="250" height="250" class="staffProfile" v-bind:src="profileImageSrc" v-bind:alt="'Staff photo of ' + profile.formattedName"></td>
            </tr>
            <tr>
              <td class="heading">Email</td>
              <td><a v-bind:href="'mailto:' + profile.formattedEmail">{{ profile.formattedEmail }}</a></td>
            </tr>
            <tr>
              <td class="heading">Phone</td>
              <td>{{ profile.formattedPhone }}</td>
            </tr>
            <tr>
              <td class="heading">Mobile</td>
              <td v-if="profile.mobile">{{ profile.formattedMobile }}</td>
              <td v-else>N/A</td>
            </tr>
            <tr>
              <td class="heading">Group</td>
              <td>{{ profile.grp }}</td>
            </tr>
            <tr>
              <td class="heading">Division</td>
              <td>{{ profile.div }}</td>
            </tr>
            <tr>
              <td class="heading">Branch</td>
              <td>{{ profile.bran }}</td>
            </tr>
            <tr>
              <td class="heading">Section</td>
              <td>{{ profile.sect }}</td>
            </tr>
            <tr>
              <td class="heading">Position</td>
              <td>{{ profile.position_title }}</td>
            </tr>
            <tr>
              <td class="heading">Location</td>
              <td>{{ profile.location_name }}</td>
            </tr>
          </tbody>
        </table>
        <p><a href="javascript:history.back();">&lt;- Back to search</a></p>
      </section>
    </div>
  </div>
</template>

<script>
import Axios from 'axios';

const baseApiUrl = process.env.API_BASE_URL;

export default {
  name: 'StaffProfile',
  data() {
    return {
      profile: [],
      errors: [],
    };
  },
  props: {
    userid: {
      type: String,
      required: true,
    },
  },
  created() {
    this.loadProfile();
  },
  watch: {
    $route: 'loadProfile',
  },
  methods: {
    async loadProfile() {
      const profileUrl = `${baseApiUrl}/census/employee/${this.userid}`;
      try {
        const response = await Axios.get(profileUrl);
        // This is not how it should work, but
        // don't know why async computed properties
        // are REFUSING to work  >:-|
        // console.dir(response.data); // eslint-disable-line
        const rawProfile = response.data;
        rawProfile.formattedEmail = rawProfile.email.toLowerCase();
        const upcaseSurname = rawProfile.surname.toUpperCase();
        rawProfile.formattedName = `${upcaseSurname}, ${rawProfile.preferred_name}`;
        const rawPhone = rawProfile.phone;
        rawProfile.formattedPhone = `${rawPhone.slice(-16, -12)} ${rawPhone.slice(-12, -8)} ${rawPhone.slice(-8, -4)} ${rawPhone.slice(-4)}`;
        const rawMobile = rawProfile.mobile;
        rawProfile.formattedMobile = `${rawMobile.slice(0, 4)} ${rawMobile.slice(4, 7)} ${rawMobile.slice(7)}`;
        this.profile = rawProfile;
      } catch (err) {
        console.error(err); // eslint-disable-line
        this.errors.push(err);
      }
    },
  },
  computed: {
    profileImageSrc() {
      return `${baseApiUrl}/census/employee/${this.userid}/avatar?size=250`;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
table {
  border: 0;
}
thead tr {
  background-color: #cccccc;
  height: 50px;
  font-weight: bold;
}
th {
  font-size: 13px;
}
tbody td {
  /* border-bottom: 1px solid #dae9f4; */
  margin: 0;
  padding: 4px 2px 6px 2px;
  font-size: 13px;
}
td {
  width: 45%;
}
td.heading {
  width: 19%;
}
td.staffImage {
  width: 36%;
  border-bottom: 0;
}
</style>

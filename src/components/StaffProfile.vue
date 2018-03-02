<template>
  <div class="staffProfile">
    <h3>Details</h3>
    <div id="profileTable">
      <section>
        <div id="messageArea" v-if="errors && errors.length">
          <p><strong>Sorry, an error occurred...</strong><p>
          <p v-for="error in errors" :key="error.response.data.message">
          Status: {{ error.response.status }} {{ error.response.statusText }}<br>
          Message: {{ error.response.data.message }}
          </p>
        </div>
        <table style="width: 100%;">
          <tbody>
            <tr>
              <td class="heading">Name</td>
              <td> {{ profile.formattedName }}</td>
              <td class="staffImage" rowspan="12"><img width="250" height="250" class="staffProfile" v-bind:src="profileImageSrc" v-bind:alt="'Staff photo of ' + profile.formattedName"></td>
            </tr>
            <tr>
              <td class="heading">Email</td>
              <td>
                <a v-bind:href="'mailto:' + profile.formattedEmail">{{ profile.formattedEmail }}</a>
                <span v-if="generatedEmail">**</span>
              </td>
            </tr>
            <tr>
              <td class="heading">Phone</td>
              <td><span v-html="profile.formattedPhone"></span></td>
            </tr>
            <tr v-if="profile.mobile">
              <td class="heading">Mobile</td>
              <td>{{ profile.formattedMobile }}</td>
            </tr>
            <tr v-if="profile.grp">
              <td class="heading">Group</td>
              <td>{{ profile.grp }}</td>
            </tr>
            <tr v-if="profile.div">
              <td class="heading">Division</td>
              <td>
                <router-link :to="{ path: '/organisation', query: { div: profile.div }}">{{ profile.div }}</router-link>
              </td>
            </tr>
            <tr v-if="profile.directorate">
              <td class="heading">Directorate</td>
              <td>
                <router-link :to="{ path: '/organisation', query: { directorate: profile.directorate }}">{{ profile.directorate }}</router-link>
              </td>
            </tr>
            <tr v-if="profile.bran">
              <td class="heading">Branch</td>
              <td>
                <router-link :to="{ path: '/organisation', query: { bran: profile.bran }}">{{ profile.bran }}</router-link>
              </td>
            </tr>
            <tr v-if="profile.sect">
              <td class="heading">Section</td>
              <td>
                <router-link :to="{ path: '/organisation', query: { sect: profile.sect }}">{{ profile.sect }}</router-link>
              </td>
            </tr>
            <tr v-if="profile.team">
              <td class="heading">Team</td>
              <td>{{ profile.team }}</td>
            </tr>
            <tr>
              <td class="heading">Position</td>
              <td>{{ profile.position_title }}</td>
            </tr>
            <tr>
              <td class="heading">Location</td>
              <td v-if="profile.sublocation_name">{{ profile.sublocation_name }}, {{ profile.location_name }}</td>
              <td v-else>{{ profile.location_name }}</td>
            </tr>
          </tbody>
        </table>
        <span v-if="generatedEmail"><small><em>** Note: this email address is missing from the supplied staff data, so it has been auto-generated.</em></small></span>
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
      generatedEmail: false,
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
    if (this.requireHashchangePopstatePatch()) {
      window.addEventListener('hashchange', this.callOnHashChange);
    }
  },
  watch: {
    $route: 'loadProfile',
  },
  methods: {
    async loadProfile() {
      const fetcher = Axios.create({
        baseURL: baseApiUrl,
      });
      try {
        const response = await fetcher.get(`/census/employee/${this.userid}`);
        // This is not how it should work, but
        // don't know why async computed properties
        // are REFUSING to work  >:-|
        const rawProfile = response.data;
        // rawProfile.formattedEmail = rawProfile.email.trim().toLowerCase();
        rawProfile.formattedEmail = this.emailAddressHandler(rawProfile);
        const upcaseSurname = rawProfile.surname.trim().toUpperCase();
        rawProfile.formattedName = `${upcaseSurname}, ${rawProfile.preferred_name.trim()}`;
        const rawPhone = rawProfile.phone.trim();
        let formattedPhone = rawProfile.phone.trim();
        if (rawPhone.length === 16) {
          formattedPhone = `${rawPhone.slice(-16, -12)} ${rawPhone.slice(-12, -8)}<br>${rawPhone.slice(-8, -4)} ${rawPhone.slice(-4)}`;
        } else if (rawPhone.length === 8) {
          formattedPhone = `${rawPhone.slice(-8, -4)} ${rawPhone.slice(-4)}`;
        }
        rawProfile.formattedPhone = formattedPhone;
        const rawMobile = rawProfile.mobile.trim();
        rawProfile.formattedMobile = `${rawMobile.slice(0, 4)} ${rawMobile.slice(4, 7)} ${rawMobile.slice(7)}`;
        this.profile = rawProfile;
      } catch (err) {
        console.error(err); // eslint-disable-line
        this.errors.push(err);
      }
    },
    emailAddressHandler(profileData) {
      if (profileData.email.trim().length > 0) {
        // return included email address
        return profileData.email.trim().toLowerCase();
      }
      // generate email address from names
      const generated = `${profileData.preferred_name.trim().toLowerCase()}.${profileData.surname.trim().toLowerCase()}@dmirs.wa.gov.au`;
      this.generatedEmail = true;
      return generated;
    },
    callOnHashChange() {
      if (window.location.hash.indexOf('q=') > -1) {
        const queryString = window.location.hash.split('=')[1].trim();
        this.$router.push({ path: '/', query: { q: queryString } });
      } else if (window.location.hash.indexOf('person') > -1) {
        const param = window.location.hash.split('/')[2].trim();
        this.$router.push({ path: `/person/${param}` });
      } else if (window.location.hash.indexOf('organisation') > -1) {
        const queryKey = window.location.hash.split('?')[1].split('=')[0];
        const queryValue = window.location.hash.split('?')[1].split('=')[1];
        this.$router.push({ path: `/organisation?${queryKey}=${queryValue}` });
      }
    },
    requireHashchangePopstatePatch() {
      return navigator.userAgent.match(/Trident.*rv[ :]*11\./);
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
tbody td {
  border-bottom: 1px solid #dae9f4;
  margin: 0;
  padding: 4px 2px 6px 2px;
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

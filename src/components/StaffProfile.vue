<template>
  <div class="staffProfile">
    <h2>Staff Profile</h2>
    <!-- <div id="searchFormContainer">
      <form id="searchForm" @submit="searchForStaff(query)" v-on:submit.prevent>
        <input v-model="query" placeholder="Type your search">
        <input type="submit" value="Search" id="searchButton">
      </form>
    </div> -->
    <div id="profileTable">
      <section>
        <table style="width: 100%;">
          <tbody>
            <tr>
              <td class="heading">Name</td>
              <td>Name</td>
              <td class="staffImage" rowspan="8"><img src="http://via.placeholder.com/120x120"></td>
            </tr>
            <tr>
              <td class="heading">Email</td>
              <td>Email</td>
            </tr>
            <tr>
              <td class="heading">Phone</td>
              <td>Phone</td>
            </tr>
            <tr>
              <td class="heading">Mobile</td>
              <td>Mobile</td>
            </tr>
            <tr>
              <td class="heading">Group</td>
              <td>Group</td>
            </tr>
            <tr>
              <td class="heading">Division</td>
              <td>Division</td>
            </tr>
            <tr>
              <td class="heading">Branch</td>
              <td>Branch</td>
            </tr>
            <tr>
              <td class="heading">Section</td>
              <td>Section</td>
            </tr>
            <tr>
              <td class="heading">Position</td>
              <td>Position</td>
            </tr>
            <tr>
              <td class="heading">Location</td>
              <td>Location</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  </div>
</template>

<script>
import Axios from 'axios';

const baseApiUrl = 'http://localhost:3000/api/v1';

export default {
  name: 'StaffProfile',
  data() {
    return {
      title: 'Staff Profile',
      userid: '',
      profile: [],
      errors: [],
    };
  },
  mounted() {
    // this.getQueryString();
    // Or will the Vue router do this for me?
    // if (this.queryFromUrl) {
    //   this.searchForStaff(queryFromUrl);
    // }
    this.loadProfile(this.$route.params.id);
  },
  methods: {
    async loadProfile(userid) {
      const profileUrl = `${baseApiUrl}/census/employee/${userid}`;
      try {
        const response = await Axios.get(profileUrl);
        this.profile = response.data;
        // console.dir(this.results); // eslint-disable-line
      } catch (err) {
        console.error(err); // eslint-disable-line
        this.errors.push(err);
      }
    },
  },
  computed: {
    // queryFromUrl() {
    //   if (this.$router.query && this.$router.query.q) {
    //     // return this.$router.params.q;
    //     this.query = this.$router.query.q.trim();
    //   // } else {
    //   //   return false;
    //   }
    // },
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
  border-bottom: 1px solid #dae9f4;
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
}
</style>

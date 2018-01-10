<template>
  <div class="staffSearch">
    <h2>{{ title }}</h2>
    <div id="searchFormContainer">
      <form id="searchForm" @submit="searchForStaff(query)" v-on:submit.prevent>
        <!-- <table>
          <tbody>
            <tr>
              <td>
                <input v-model="query" placeholder="enter search here..." @change="searchForStaff(query)">
              </td>
              <td>
                <input type="submit" value="Search" id="searchButton">
              </td>
            </tr>
          </tbody>
        </table> -->
        <input v-model="query" placeholder="Type your search">
        <input type="submit" value="Search" id="searchButton">
      </form>
    </div>
    <div id="searchResults">
      <h3>Results for "{{ query }}"</h3>
      <section>
        <div class="row" v-for="result in results" :key="result.userid">
          <p>Name: {{ result.preferred_name }} {{ result.surname }}, user ID: {{ result.userid }}</p>
          <p>{{ filledOut(result).position }}, {{ filledOut(result).phone }}</p>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import Axios from 'axios';

const baseApiUrl = 'http://localhost:3000/api/v1';

export default {
  name: 'StaffSearch',
  data() {
    return {
      title: 'Staff Directory',
      query: '',
      results: [],
      errors: [],
    };
  },
  mounted() {
    // this.getQueryString();
    // Or will the Vue router do this for me?
  },
  methods: {
    async searchForStaff(query) {
      const queryUrl = `${baseApiUrl}/census/employees/search?q=${query}`;
      try {
        const response = await Axios.get(queryUrl);
        this.results = response.data;
        console.dir(this.results); // eslint-disable-line
      } catch (err) {
        console.error(err); // eslint-disable-line
        this.errors.push(err);
      }
    },
  },
  asyncComputed: {
    async fillOutStaff() {
      try {
        if (this.results.length > 2) {
          const filledOut = await this.results.map(async (item) => {
            const fillUrl = `${baseApiUrl}/census/employee/${item.userid}`;
            const staffMemberData = await Axios.get(fillUrl);
            const staffMemberInfo = {
              first_name: staffMemberData.data.first_name,
              preferred_name: staffMemberData.data.preferred_name,
              surname: staffMemberData.data.surname,
              userid: staffMemberData.data.userid,
              position: staffMemberData.data.position_title,
              phoneNumber: staffMemberData.data.phone,
              location: staffMemberData.data.location_name,
              grp: staffMemberData.data.grp,
              div: staffMemberData.data.div,
              bran: staffMemberData.data.bran,
              sect: staffMemberData.data.sect,
            };
            return staffMemberInfo;
          });
          // this.results = response.data;
          this.results = await filledOut;
          console.dir(this.results); // eslint-disable-line
        }
      } catch (err) {
        console.error(err); // eslint-disable-line
        this.errors.push(err);
      }
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
  border-bottom: 1px solid #dae9f4;
  margin: 0;
  padding: 4px 2px 6px 2px;
  font-size: 13px;
}
#searchForm table td {
  border: 0;
}
#searchForm tr {
  background-color: transparent;
}
</style>

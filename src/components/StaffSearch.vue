<template>
  <div class="staffSearch">
    <div id="searchFormContainer">
      <form id="searchForm" @submit="updateQuery()" v-on:submit.prevent>
        <label title="Type your staff search terms here">
          <input v-model="searchQuery" placeholder="Type your search" size="35">
        </label>
        <input type="submit" value="  Search  " id="searchButton">
      </form>
    </div>
    <div id="searchResults" v-if="query && query.length">
      <h3 v-if="searching === true">Searching, please wait...</h3>
      <h3 v-if="searching === false">Search results for "{{ query }}"</h3>
      <div id="switcher">
        <a href="#staffSearchResults" class="staffSearchResults activeTitle" @click="switchTabs('staffSearchResults')" v-on:click.prevent>
          <h4>Staff search results ({{ staffResults.length }})</h4>
        </a>
        <a href="#organisationSearchResults" class="organisationSearchResults" @click="switchTabs('organisationSearchResults')" v-on:click.prevent>
          <h4>Organisation search results ({{ organisationResults.length }})</h4>
        </a>
      </div>
      <section id="staffSearchResults" class="active">
        <div v-if="searching === false && staffResults.length == 0">
          <p>Sorry, no staff members found. Please search again.</p>
        </div>
        <div id="messageArea" v-if="errors && errors.length">
          <p><strong>Sorry, an error occurred...</strong><p>
          <p v-for="error in errors" :key="error.response.data.message">
          Status: {{ error.response.status }} {{ error.response.statusText }}<br>
          Message: {{ error.response.data.message }}
          </p>
        </div>
        <table v-if="staffResults.length > 0" style="width: 100%;">
            <thead>
                <tr>
                    <th style="width: 25%;">Name &amp; Position</th>
                    <th style="width: 25%;">Phone number</th>
                    <th style="width: 25%;">Section &amp; Branch</th>
                    <th style="width: 20%;">Location</th>
                </tr>
            </thead>
            <tbody id="listContents">
              <!-- <tr
                is="result-row"
                v-for="result in staffResults"
                :key="result.userid"
                v-bind:result="result"
              ></tr> -->
              <staff-result-row
                v-for="result in staffResults"
                :key="result.userid"
                v-bind:result="result"
              ></staff-result-row>
            </tbody>
        </table>
      </section>
      <section id="organisationSearchResults" class="inactive">
        <div v-if="searching === false && organisationResults.length == 0">
          <p>No business units found for this search.</p>
        </div>
        <table v-if="organisationResults.length > 0" style="width: 100%;">
            <thead>
                <tr>
                    <th style="width: 20%;">Group</th>
                    <th style="width: 20%;">Division</th>
                    <th style="width: 20%;">Directorate</th>
                    <th style="width: 20%;">Branch</th>
                    <th style="width: 20%;">Section</th>
                </tr>
            </thead>
            <tbody id="organisationlistContents">
              <organisation-result-row
                v-for="(result, index) in organisationResults"
                :key="index"
                v-bind:result="result"
              ></organisation-result-row>
            </tbody>
        </table>
      </section>
    </div>
  </div>
</template>

<script>
import Axios from 'axios';
import StaffResultRow from './StaffResultRow';
import OrganisationResultRow from './OrganisationResultRow';

const baseApiUrl = process.env.API_BASE_URL;

export default {
  name: 'StaffSearch',
  data() {
    return {
      searchQuery: '',
      query: '',
      staffResults: [],
      organisationResults: [],
      errors: [],
      searching: false,
    };
  },
  components: {
    StaffResultRow,
    OrganisationResultRow,
  },
  created() {
    if (this.requireHashchangePopstatePatch()) {
      window.addEventListener('hashchange', this.callOnHashChange);
    }
  },
  mounted() {
    this.queryFromUrl();
  },
  watch: {
    $route: 'queryFromUrl',
  },
  methods: {
    async searchForStaff() {
      this.searching = true;
      const fetcher = Axios.create({
        baseURL: baseApiUrl,
        params: {
          q: this.query,
        },
      });
      try {
        const staffResponse = await fetcher.get('/census/employees/search');
        this.searching = false;
        this.staffResults = staffResponse.data;
      } catch (err) {
        this.searching = false;
        console.error(err); // eslint-disable-line
        this.errors.push(err);
      }
    },
    async searchForOrganisation() {
      this.searching = true;
      const fetcher = Axios.create({
        baseURL: baseApiUrl,
        params: {
          q: this.query,
        },
      });
      try {
        const organisationResponse = await fetcher.get('/census/organisation/search');
        this.searching = false;
        this.organisationResults = organisationResponse.data;
      } catch (err) {
        this.searching = false;
        console.error(err); // eslint-disable-line
        this.errors.push(err);
      }
    },
    queryFromUrl() {
      if (this.$route.query && this.$route.query.q) {
        this.query = this.$route.query.q.trim();
        this.searchQuery = this.query;
        this.searchForStaff();
        this.searchForOrganisation();
      }
    },
    updateQuery() {
      this.query = this.searchQuery;
      this.$router.push({ path: '/', query: { q: this.query } });
    },
    callOnHashChange() {
      if (window.location.hash.indexOf('=') > -1) {
        const queryString = window.location.hash.split('=')[1].trim();
        this.searchQuery = queryString;
        this.query = queryString;
        this.searchForStaff();
        this.searchForOrganisation();
      }
    },
    requireHashchangePopstatePatch() {
      return navigator.userAgent.match(/Trident.*rv[ :]*11\./);
    },
    switchTabs: (tabName) => {
      const previousTab = document.getElementsByClassName('active')[0];
      const previousTabTitle = document.getElementById('switcher').getElementsByClassName(previousTab.id)[0];
      const activeTab = document.getElementById(tabName);
      const activeTabTitle = document.getElementById('switcher').getElementsByClassName(tabName)[0];
      if (previousTab !== activeTab) {
        previousTab.setAttribute('class', 'inactive');
        previousTabTitle.setAttribute('class', `${previousTab.id}`);
        // console.dir(previousTab); // eslint-disable-line
        // console.dir(previousTabTitle); // eslint-disable-line
        activeTab.setAttribute('class', 'active');
        activeTabTitle.setAttribute('class', `${tabName} activeTitle`);
        // console.dir(activeTab); // eslint-disable-line
        // console.dir(activeTabTitle); // eslint-disable-line
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
tbody td {
  border-bottom: 1px solid #dae9f4;
  margin: 0;
  padding: 4px 2px 6px 2px;
  /* font-size: 13px; */
}
#staffSearch {
  margin-top: 20px;
}
#searchForm input {
  font-size: 1.25em;
}
#switcher {
  margin-bottom: 5px;
}
#switcher h4 {
  display: inline;
  color: #2c3e50;
}
#switcher a {
  background-color: #eeeeee;
  border: 1px solid #cccccc;
  border-bottom: 0;
  margin-right: 20px;
  padding: 6px 20px 5px 20px;
  text-decoration: unset;
}
#switcher .activeTitle {
  background-color: #cccccc;
  text-decoration: underline;
}
section.inactive {
  display: none;
}
</style>

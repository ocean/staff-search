<template>
  <div class="staffSearch">
    <h2>{{ title }}</h2>
    <div id="searchFormContainer">
      <form id="searchForm" @submit="updateQuery()" v-on:submit.prevent>
        <input v-model="searchQuery" placeholder="Type your search">
        <input type="submit" value="Search" id="searchButton">
      </form>
    </div>
    <div id="searchResults">
      <h3>Results for "{{ query }}"</h3>
      <section>
        <p id="messageArea" v-if="errors && errors.length">
          {{ errors }}
        </p>
        <table style="width: 100%;">
            <thead>
                <tr>
                    <th style="width: 25%;">Name &amp; Title</th>
                    <th style="width: 25%;">Phone number</th>
                    <th style="width: 25%;">Team &amp; Branch</th>
                    <th style="width: 20%;">Location</th>
                </tr>
            </thead>
            <tbody id="listContents">
              <tr
                is="result-row"
                v-for="result in results"
                :key="result.userid"
                v-bind:result="result"
              ></tr>
              <!-- <result-row
                v-for="result in results"
                :key="result.userid"
                v-bind:result="result"
              ></result-row> -->
            </tbody>
        </table>
      </section>
    </div>
  </div>
</template>

<script>
import Axios from 'axios';
import Config from '../config';
import ResultRow from './ResultRow';

const baseApiUrl = Config.baseApiUrl;

export default {
  name: 'StaffSearch',
  data() {
    return {
      title: 'Staff Directory',
      searchQuery: '',
      query: '',
      results: [],
      errors: [],
    };
  },
  watch: {
    $route: 'queryFromUrl',
  },
  mounted() {
    // this.getQueryString();
    // Or will the Vue router do this for me?
    this.queryFromUrl();
  },
  methods: {
    async searchForStaff() {
      const queryUrl = `${baseApiUrl}/census/employees/search?q=${this.query}`;
      try {
        const response = await Axios.get(queryUrl);
        this.results = response.data;
        // console.dir(this.results); // eslint-disable-line
      } catch (err) {
        console.error(err); // eslint-disable-line
        this.errors.push(err);
      }
    },
    queryFromUrl() {
      if (this.$route.query && this.$route.query.q) {
        this.query = this.$route.query.q.trim();
        this.searchQuery = this.query;
        this.searchForStaff();
      }
    },
    updateQuery() {
      this.query = this.searchQuery;
      this.$router.push({ path: '/', query: { q: this.query } });
    },
  },
  components: {
    ResultRow,
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

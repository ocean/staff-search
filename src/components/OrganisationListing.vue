<template>
  <div class="organisationListing">
    <h3>Staff in the "{{ orgUnitTitle }}" {{ orgUnitType}}</h3>
    <div id="listingTable">
      <section>
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
              <staff-result-row
                v-for="result in staffResults"
                :key="result.userid"
                v-bind:result="result"
              ></staff-result-row>
            </tbody>
        </table>
        <p><a href="javascript:history.back();">&lt;- Back to search</a></p>
      </section>
    </div>
  </div>
</template>

<script>
import Axios from 'axios';
import StaffResultRow from './StaffResultRow';

const baseApiUrl = process.env.API_BASE_URL;

export default {
  name: 'OrganisationListing',
  data() {
    return {
      staffResults: [],
      errors: [],
    };
  },
  props: {
    query: {
      type: Object,
      required: true,
    },
  },
  components: {
    StaffResultRow,
  },
  mounted() {
    this.loadListing();
    if (this.requireHashchangePopstatePatch()) {
      window.addEventListener('hashchange', this.callOnHashChange);
    }
  },
  watch: {
    $route: 'loadListing',
  },
  methods: {
    queryFromUrl() {
      if (this.$route.query) {
        this.query = this.$route.query;
        this.loadListing();
      }
    },
    async loadListing() {
      const queryURLParams = new URLSearchParams(this.query);
      queryURLParams.append('limit', '60');
      const fetcher = Axios.create({
        baseURL: baseApiUrl,
        params: queryURLParams,
      });
      try {
        const response = await fetcher.get('/census/employees');
        this.staffResults = response.data.results;
      } catch (err) {
        console.error(err); // eslint-disable-line
        this.errors.push(err);
      }
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
    orgUnitTitle() {
      const queryAsArray = Object.entries(this.query);
      return `${queryAsArray[0][1]}`;
    },
    orgUnitType() {
      const queryAsArray = Object.entries(this.query);
      const unitCode = queryAsArray[0][0];
      if (unitCode === 'div') {
        return 'division';
      } else if (unitCode === 'directorate') {
        return 'directorate';
      } else if (unitCode === 'bran') {
        return 'branch';
      } else if (unitCode === 'sect') {
        return 'section';
      }
      return 'team';
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

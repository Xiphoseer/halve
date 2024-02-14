import HalveUtil from './HalveUtil.js';

const HalveLoading = {
  props: ['data'],
  template: `<div>Loading...</div>`
};

const HalveRequestInvalid = {
  props: ['data'],
  template: `<div class="alert alert-danger">Invalid Request: [{{ data.status }}] {{ data.statusText }}</div>`
};

const HalveParsingFailed = {
  props: ['data'],
  template: `<div>
    <div class="alert alert-warning">{{data.error.name}}: {{data.error.message}}</div>
    <pre><code>{{ data.text }}</code></pre>
  </div>`
};

const HalResourceDisplay = {
  props: ['data', 'resDefault', 'url'],
  template: `<component :is="component" :self="self" :meta="meta" :links="links" :embedded="embedded" :url="url"></component>`,
  computed: {
    meta: function () {
      return this.data ? this.data._meta || {} : null;
    },
    component: function() {
      return (this.meta && this.meta.component) || this.resDefault;
    },
    links: function () {
      return this.data ? this.data._links : [];
    },
    embedded: function () {
      return this.data ? this.data._embedded : null;
    },
    self: function () {
      return HalveUtil.removeKeys(this.data, ['_links', '_meta', '_embedded']);
    }
  }
};

const GuessingDisplay = {
  props: ['data', 'resDefault', 'url'],
  components: {
    'hal-resource-display': HalResourceDisplay
  },
  template: `<component :is="display.component" :data="data" v-bind="display.options" :url="url"></component>`,
  computed: {
    display: function () {
      console.log("Guessing");
      if (this.data && this.data.hasOwnProperty('$id') && this.data.hasOwnProperty('$schema')) {
        console.log("Schema");
        // This is likely a json-schema.org schema
        return {component: 'hal-resource-display', options: {'resDefault': 'schema-resource'}};
      }
      // Use the generic HAL display and resource
      return {component: 'hal-resource-display', options: {'resDefault': 'hal-resource'}};
    }
  }
};

export default {
  components: {
    'halve-loading': HalveLoading,
    'halve-request-invalid': HalveRequestInvalid,
    'halve-parsing-failed': HalveParsingFailed,
    'hal-resource-display': HalResourceDisplay,
    'guessing-display': GuessingDisplay
  },
  props: ['url', 'dispDefault', 'resDefault'],
  data: function (url) {
    return {
      component: `halve-loading`,
      data: {},
    };
  },
  template: `<component :is="component" :data="data" :url="url" :res-default="resDefault"></component>`,
  created: function () {
    this.processUrl();
  },
  methods: {
    onUrlUpdate: function (url) {
      this.component = 'halve-loading';
      this.data = {};
      console.log("URL change: " + url)
      this.processUrl();
    },
    processUrl: function () {
      let url = this.url;
      console.log("Loading Resource: " + url);
      fetch(url) //
        .then(this.processJSON, this.loadFailed)
        .then(this.processResource, this.resourceFailed);
    },
    loadFailed: function (e) {
      this.data = e;
      this.component = 'halve-request-invalid';
    },
    resourceFailed: function (data) {
      this.data = data;
      this.component = 'halve-parsing-failed';
    },
    processJSON: function (data) {
      console.log("processJSON", data);
      return new Promise(function(accept, reject) {
        data.text().then(function(text){
          try {
            accept(JSON.parse(text));
          } catch (ex) {
            reject({error: ex, text: text});
          }
        });
      });
    },
    processResource: function (data) {
      console.log("processResource", data);
      this.data = data;
      this.component = this.dispDefault || 'hal-resource-display';
    }
  },
  watch: {
    url: function (val) {
      this.onUrlUpdate(val);
    }
  }
};

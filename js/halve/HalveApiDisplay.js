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
    <div class="alert alert-warning">JSON Parsing failed: HTTP {{ data.status }} {{ data.statusText }}</div>
    <pre><code>{{ data.responseText }}</code></pre>
  </div>`
};

const HalResourceDisplay = {
  props: ['data', 'resDefault', 'url'],
  template: `<component :is="component" :self="self" :meta="meta" :links="links" :embedded="embedded" :url="url"></component>`,
  computed: {
    meta: function () {
      return this.data._meta || {};
    },
    component: function() {
      return this.meta.component || this.resDefault;
    },
    links: function () {
      return this.data._links;
    },
    embedded: function () {
      return this.data._embedded;
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
      if (this.data.hasOwnProperty('$id') && this.data.hasOwnProperty('$schema')) {
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
      $.getJSON(url, this.processResource).fail(this.resourceFailed);
    },
    resourceFailed: function (e) {
      this.data = e;
      if (e.readyState == 0) {
        // Request invalid
        this.component = 'halve-request-invalid';
      } else if (e.readyState == 4) {
        // Request successful, parsing unsuccessful
        this.component = 'halve-parsing-failed';
      } else {
        // Something else happened
        this.component = 'halve-json-display';
      }
    },
    processResource: function (data) {
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

function removeKeys(data, keys) {
  return Object.keys(data).reduce((res, key) => {
    if (keys.indexOf(key) < 0) {
      res[key] = data[key];
    }
    return res;
  }, {});
}

var VJsonDisplay = {
  props: ['data', 'exclude', 'empty'],
  template: `<pre v-if="empty ? Object.keys(json).length > 0 : true"><code>{{json}}</code></pre>`,
  data: function() {
    return {}
  },
  computed: {
    json: function () {
      return removeKeys(this.data, this.exclude);
    }
  }
};

var VTableDisplay = {
  props: ['data', 'exclude', 'empty'],
  template: `<table class="table table-condensed" v-if="empty ? Object.keys(json).length > 0 : true">
    <tr v-for="(value, key) in json"><td>{{key}}</td><td>{{value}}</td></tr>
  </table>`,
  data: function() {
    return {}
  },
  computed: {
    json: function () {
      return removeKeys(this.data, this.exclude);
    }
  }
};

var VRuntimeComponent = {
  props: {
    url: String,
    self: Object
  },
  template: `<v-runtime-template :template='content'><slot></slot></v-runtime-template>`,
  data: function () {
    return {
      error: {},
      content: "<div>Loading...</div>"
    }
  },
  created: function () {
    $.ajax(this.url).done(this.processTemplate).fail(this.templateFailed);
  },
  methods: {
    processTemplate: function (data) {
      this.content = data;
    },
    templateFailed: function (e) {
      this.error = e;
      this.content = "<div class='alert alert-danger'>{{error}}</div>";
    }
  }
};

var VApiDisplay = {
  props: {
    url: String,
    template: String
  },
  data: function (url) {
    return {
      content: `<div>Loading...</div>`,
      self: {},
      links: {},
      embedded: {},
      progress: 0,
      urlDecay: null
    };
  },
  template: "<v-runtime-template :template='content'><slot></slot></v-runtime-template>",
  created: function () {
    this.processUrl();
  },
  methods: {
    onUrlUpdate: function (url) {
      this.progress = 25;
      this.content = `<div>Loading...</div>`;
      this.self = {};
      this.links = {};
      this.embedded = [];
      console.log("URL change: " + url)
      clearTimeout(this.urlDecay);
      this.urlDecay = setTimeout(this.processUrl, 400);
    },
    processUrl: function () {
      let url = this.url;
      console.log("Loading Resource: " + url);
      $.getJSON(url, this.processResource).fail(this.resourceFailed);
    },
    resourceFailed: function (e) {
      this.self = e;
      if (e.readyState == 0) {
        // Request invalid
        this.content = `<div class="alert alert-danger">Invalid Request: [{{ self.status }}] {{self.statusText}}</div>`
      } else if (e.readyState == 4) {
        // Request successful, parsing unsuccessful
        this.content = `<div>
          <div class="alert alert-warning">Loading Failed: HTTP {{ self.status }} {{self.statusText}}</div>
          <pre><code>{{self.responseText}}</code></pre>
        </div>`;
      } else {
        this.content = `<div>{{self}}</div>`;
      }

    },
    remKey: removeKeys,
    processResource: function (data) {
      this.self = this.remKey(data, ["_links", "_embedded"]);
      this.links = data._links;
      this.embedded = data._embedded;
      this.progress = 50;
      var template = this.template;
      for (let rel in data._links) {
        let link = data._links[rel];
        if (link.type == "application/x-hal-template" && rel == "template") {
          template = link.href;
          break;
        }
      }
      $.ajax(template).done(this.processTemplate).fail(this.templateFailed);
    },
    templateFailed: function (e) {
      this.self = e;
      this.content = "<div>{{self}}</div>";
    },
    processTemplate: function (template) {
      this.progress = 75;
      this.content = template;
    }
  },
  watch: {
    url: function (val) {
      this.onUrlUpdate(val);
    }
  }
};

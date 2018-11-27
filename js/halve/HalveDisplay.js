import HalveUtil from './HalveUtil.js';

const HalveLink = {
  props: ['href', 'title', 'type', 'rel'],
  template: `<a href="#" @click="clicked" :title="linkTitle">{{linkText}}</a>`,
  computed: {
    linkTitle: function () {
      return this.type ? "Type: " + this.type : "";
    },
    linkText: function () {
      return this.title || this.rel;
    }
  },
  methods: {
    clicked: function(e) {
      if (e) e.preventDefault();
      console.log("Link: " + this.href);
      this.$root.$emit('linkClicked', this.href);
    }
  }
};

const HalveJsonDisplay = {
  props: ['data', 'exclude', 'empty'],
  template: `<pre v-if="display"><code>{{json}}</code></pre>`,
  computed: {
    json: function () {
      return HalveUtil.removeKeys(this.data, this.exclude);
    },
    display: function () {
      return this.empty ? Object.keys(this.json).length > 0 : true;
    }
  }
};

const HalveTableDisplay = {
  props: ['data', 'exclude', 'empty'],
  template: `<table class="table table-condensed" v-if="display">
    <tr v-for="(value, key) in json"><td>{{key}}</td><td>{{value}}</td></tr>
  </table>`,
  computed: {
    json: function () {
      return HalveUtil.removeKeys(this.data, this.exclude);
    },
    display: function () {
      return this.empty ? Object.keys(this.json).length > 0 : true
    }
  }
};

export { HalveJsonDisplay, HalveTableDisplay, HalveLink };

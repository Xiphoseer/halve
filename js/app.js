import HalResource from './hal/HalResource.js';

import SchemaResource from './json-schema/SchemaResource.js';

import PagesRender from './pages/PagesRender.js';
import PagesResource from './pages/PagesResource.js';

import HalveNavbar from './halve/HalveNavbar.js';
import HalveApiDisplay from './halve/HalveApiDisplay.js';
import HalveRuntimeComponent from './halve/HalveRuntimeComponent.js';
import { HalveJsonDisplay, HalveTableDisplay, HalveLink } from './halve/HalveDisplay.js';

Vue.component('v-runtime-template', VRuntimeTemplate);
Vue.component('v-runtime-component', HalveRuntimeComponent);

Vue.component('hal-resource', HalResource);
Vue.component('schema-resource', SchemaResource);

Vue.component('halve-link', HalveLink);
Vue.component('halve-api-display', HalveApiDisplay);
Vue.component('halve-navbar', HalveNavbar);
Vue.component('halve-json-display', HalveJsonDisplay);
Vue.component('halve-table-display', HalveTableDisplay);


Vue.component('pages-resource', PagesResource);
Vue.component('pages-render', PagesRender);

function getLocation () {
  return location.hash.replace(/^#/, '') || '/halve/index.json'
}

var app = new Vue({
  el: '#app',
  data: {
    url: getLocation()
  },
  created: function () {
    window.addEventListener('hashchange', this.hashchange);
    this.$on('linkClicked', this.changeUrl);
  },
  destroyed: function () {
    window.removeEventListener('hashchange', this.hashchange);
    this.$off('linkClicked', this.changeUrl);
  },
  methods: {
    hashchange: function (e) {
      console.log("HASH");
      this.url = location.hash.replace(/^#/, '');
    },
    changeUrl: function (url) {
      console.log(url);
      this.url = url;
    }
  },
  watch: {
    url: function (val) {
      location.hash = val;
    }
  }
});

import HalveUtil from '../halve/HalveUtil.js';

const PagesRenderObject = {
  props: { content: Object },
  template: `<component :is="content.is" v-bind="data">
      <pages-render v-if="data.content" :content="data.content"></pages-render>
  </component>`,
  computed: {
    data: function () {
      return HalveUtil.removeKeys(this.content, 'is');
    }
  }
};

const PagesRenderText = {
  props: { content: String },
  template: `<span>{{content}}</span>`
};

const PagesRenderArray = {
  props: [ 'content' ],
  template: `<div><pages-render v-for="(component,key) in content" :key="key" :content="component"></pages-render></div>`
};

export default {
  components: {
    'pages-render-object': PagesRenderObject,
    'pages-render-array': PagesRenderArray,
    'pages-render-text': PagesRenderText
  },
  props: [ 'content' ],
  name: 'pages-render',
  computed: {
    render: function() {
      if (Array.isArray(this.content)) {
        return "pages-render-array";
      } else if (this.content && this.content.hasOwnProperty("is")) {
        return "pages-render-object";
      } else /*if (this.content == 'string')*/ {
        return "pages-render-text";
      }
    }
  },
  template: `<component :is="render" :content="content"></component>`
};

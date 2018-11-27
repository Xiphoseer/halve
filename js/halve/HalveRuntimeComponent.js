export default {
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

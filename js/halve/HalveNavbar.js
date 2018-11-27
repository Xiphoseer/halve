export default {
  props: ['title', 'links', 'url'],
  name: 'halve-navbar',
  template: `<nav class="navbar navbar-light navbar-expand-sm bg-light mb-3">
    <halve-link class="navbar-brand" rel="self" :href="url" :title="title"></halve-link>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav">
        <li v-if="rel != 'self'" class="nav-item" v-for="(link, rel) in links">
          <halve-link class="nav-link" :rel="rel" v-bind="link"></halve-link>
        </li>
      </ul>
    </div>
  </nav>`,
  data: function() {
    return {};
  }
};

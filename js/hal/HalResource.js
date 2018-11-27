const HalResourceCard = {
  props: ['item'],
  template: `<div v-else class="card">
    <div class="card-body">
      <h5 class="card-title">{{item.title}}</h5>
      <p class="card-text">{{item.description}}</p>
      <halve-table-display class="mb-0" :data="item" :exclude="['_links', 'title', 'description']" :empty="true"></halve-table-display>
    </div>
    <div class="card-footer">
      <a class="card-link" v-for="(link, rel) in item._links" :href="'#' + link.href">{{ rel }}</a>
    </div>
  </div>`
};

export default {
  props: ['self', 'embedded', 'links', 'meta', 'url'],
  components: {
    'hal-resource-card': HalResourceCard
  },
  name: 'hal-resource',
  template: `<div>
    <halve-navbar :title="self.title" :links="links" :url="url"></halve-navbar>
    <p v-if="self.description" class="lead">{{self.description}}</p>
    <halve-json-display :data="self" :exclude="['title', 'description']" :empty="true"></halve-json-display>
    <div class="card-columns">
      <template v-for="(item,key) in embedded">
        <hal-resource-card :item="item" v-if="Array.isArray(item)" v-for="(item, ikey) in item" :key="ikey"></hal-resource-card>
        <hal-resource-card :item="item" v-else></hal-resource-card>
      </template>
    </div>
  </div>`
}

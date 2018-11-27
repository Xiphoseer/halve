const SchemaCardHeader = {
  props: ['title', 'type'],
  template: `<div class="card-header">
    <span v-if="title">{{title}}</span>
    <small>({{type}})</small>
  </div>`
};

const SchemaCardBody = {
  props: ['self'],
  template: `<div class="card-body">
    <p class="lead" v-if="self.description">{{self.description}}</p>
    <dl class="row mb-0">
      <template v-if="self.$id">
        <dt class="col-sm-2">ID</dt>
        <dd class="col-sm-10"><halve-link :href="self.$id" :title="self.$id"/></dd>
      </template>
      <template v-if="self.$schema">
        <dt class="col-sm-2">Schema</dt>
        <dd class="col-sm-10"><halve-link :href="self.$schema" :title="self.$schema"/></dd>
      </template>
      <template v-if="self.required">
        <dt class="col-sm-2">Required</dt>
        <dd class="col-sm-10">
          <span v-for="attr in self.required" class="badge badge-primary mr-2">{{attr}}</span>
        </dd>
      </template>
    </dl>
  </div>`
};

const SchemaProperties = {
  props: ['properties'],
  template: `<table class="table mb-0">
    <thead>
      <tr>
        <th>Name</th>
        <th>Type</th>
        <th>Description</th>
        <th>Other Attributes</th>
      </tr>
    </thead>
    <tr v-for="(prop, name) in properties">
      <td>{{name}}</td>
      <td>{{prop.type}}</td>
      <td>{{prop.description}}</td>
      <td>
        <dl class="row mb-0">
          <template v-for="(attr, key) in prop" v-if="['type', 'description'].indexOf(key) < 0">
            <dt class="col-5">{{key}}</dt>
            <dd class="col-7">{{attr}}</dd>
          </template>
        </dl>
      </td>
    </tr>
  </table>`
};

const SchemaDefinitions = {
  props: ['definitions'],
  template: `<div v-if="definitions">
    <hr>
    <div class="card-body">
      <h4>Definitions</h4>
      <schema-resource :self="Object.assign(def, {title: key})" v-for="(def, key) in definitions" :key="key">
      </schema-resource>
    </div>
  </div>`
};

export default {
  props: ['self', 'embedded', 'links', 'meta', 'url'],
  name: 'schema-resource',
  components: {
    'schema-card-header': SchemaCardHeader,
    'schema-card-body': SchemaCardBody,
    'schema-properties': SchemaProperties,
    'schema-definitions': SchemaDefinitions
  },
  template: `<div>
    <halve-navbar :title="self.title" :links="links" :url="url"></halve-navbar>
    <div class="card mb-4">
      <schema-card-header :title="self.title" :type="self.type"></schema-card-header>
      <schema-card-body :self="self"></schema-card-body>
      <schema-properties :properties="self.properties"></schema-properties>
      <schema-definitions :definitions="self.definitions"></schema-definitions>
    </div>
  </div>`
};

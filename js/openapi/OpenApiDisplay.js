const OpenApiComponents = {
  props: ['components'],
  template: `<section>
    <h2>Components</h2>
    <halve-json-display :data="components" :exclude="['schemas', 'requestBodies', 'securitySchemes']" :empty="true"></halve-json-display>
    <section v-if="components.schemas">
      <h3>Schemas</h3>
      <section v-for="(schema, id) in components.schemas">
        <h4>{{id}}</h4>
        <halve-json-display :data="schema" :exclude="[]" :empty="true"></halve-json-display>
      </section>
    </section>
    <section v-if="components.requestBodies">
      <h3>Request Bodies</h3>
      <section v-for="(requestBody, id) in components.requestBodies">
        <h4>{{id}}</h4>
        <p v-if="requestBody.description">{{requestBody.description}}</p>
        <halve-json-display :data="requestBody" :exclude="['description']" :empty="true"></halve-json-display>
      </section>
    </section>
    <section v-if="components.securitySchemes">
      <h3>Security Schemes</h3>
      <section v-for="(securityScheme, id) in components.securitySchemes">
        <h4>{{id}} <b-badge variant="info">{{securityScheme.type}}</b-badge></h4>
        <halve-json-display :data="securityScheme" :exclude="['type']" :empty="true"></halve-json-display>
      </section>
    </section>
  </section>`
};

const OpenApiRequestBody = {
  props: ['requestBody'],
  template: `<section>
    <h4>Request Body <b-badge v-if="requestBody.required" variant="info">required</b-badge></h4>
    <p v-if="requestBody.description">{{requestBody.description}}</p>
    <halve-json-display :data="requestBody" :exclude="['required', 'description']" :empty="true"></halve-json-display>
  </section>`
};

const OpenApiPath = {
  props: ['id', 'method', 'operation'],
  components: {
    'openapi-request-body': OpenApiRequestBody,
  },
  computed: {
    httpMethod: function() {
      return this.method.toUpperCase();
    }
  },
  template: `<div>
    <h3>{{httpMethod}} {{id}}
      <span style="font-size: 70%" v-if="operation.summary">{{operation.summary}}</span>
      <b-badge v-for="tag in operation.tags">{{tag}}</b-badge>
    </h3>
    <code v-if="operation.operationId">{{operation.operationId}}</code>
    <p v-if="operation.description">{{operation.description}}</p>
    <halve-json-display :data="operation" :exclude="['tags', 'summary', 'description', 'operationId', 'requestBody', 'security', 'responses', 'parameters']" :empty="true"></halve-json-display>
    <openapi-request-body v-if="operation.requestBody" :requestBody="operation.requestBody"></openapi-request-body>
    <section v-if="operation.parameters">
      <h4>Parameters</h4>
      <halve-json-display v-for="param in operation.parameters" :data="param" :exclude="[]" :empty="true"></halve-json-display>
    </section>
    <section v-if="operation.security">
      <h4>Security</h4>
      <halve-json-display v-for="sec in operation.security" :data="sec" :exclude="[]" :empty="true"></halve-json-display>
    </section>
    <section>
      <h4>Responses</h4>
      <section v-for="(response, code) in operation.responses">
        <h5>{{code}}</h5>
        <p v-if="response.description">{{response.description}}</p>
        <halve-json-display :data="response" :exclude="['description']" :empty="true"></halve-json-display>
      </section>
    </section>
  </div>`
};

const OpenApiTag = {
  props: ['tag'],
  template: `<b-card :title="tag.name">
  <b-card-text>{{tag.description}}</b-card-text>
  <b-button v-if="tag.externalDocs" :href="tag.externalDocs.url">{{tag.externalDocs.description}}</b-button>
</b-card>`
};

export default {
  components: {
    "openapi-path": OpenApiPath,
    "openapi-tag": OpenApiTag,
    "openapi-components": OpenApiComponents,
  },
  props: ['data', 'url'],
  template: `<div>
    <halve-navbar :title="data.info.title" :links="links" :url="url"></halve-navbar>
    <p style="white-space: break-spaces;">{{ data.info.description }}</p>
    <b-button-group>
      <b-button v-if="data.info.termsOfService" :href="data.info.termsOfService">Terms of Service</b-button>
      <b-button v-if="data.info.license" :href="data.info.license.url">{{data.info.license.name}}</b-button>
      <b-button v-if="data.info.contact.email" :href="'mailto:' + data.info.contact.email">Contact</b-button>
      <b-button v-if="data.externalDocs" :href="data.externalDocs.url">{{data.externalDocs.description}}</b-button>
    </b-button-group>
    <halve-json-display :data="data" :exclude="['info', 'externalDocs', 'openapi', 'tags', 'paths', 'servers', 'components']" :empty="true"></halve-json-display>
    <h2>Servers</h2>
    <ul>
      <li v-for="server in data.servers"><a :href="server.url">{{server.url}}</a></li>
    </ul>
    <h2>Tags</h2>
    <b-card-group>
      <openapi-tag v-for="tag in data.tags" :tag="tag"></openapi-tag>
    </b-card-group>
    <h2>Paths</h2>
    <div v-for="(path,id) in data.paths">
      <openapi-path v-for="(operation,method) in path" :id="id" :method="method" :operation="operation"></openapi-path>
    </div>
    <openapi-components v-if="data.components" :components="data.components"></openapi-components>
  </div>`,
  computed: {
    links: function () {
      const _links = [];
      /*if (this.data && this.data.info && this.data.info.termsOfService) {
        _links.push({ "href": this.data.info.termsOfService, "title": "Terms of Service" });
      }*/
      return _links;
    }
  }
};
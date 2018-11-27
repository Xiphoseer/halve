export default {
  props: ['self', 'embedded', 'links', 'meta', 'url'],
  name: 'pages-resource',
  template: `<div>
    <pages-render :content="embedded.item"></pages-render>
  </div>`
};

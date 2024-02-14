export default {
  removeKeys: function (data, keys) {
    if (!data) return {};
    return Object.keys(data).reduce((res, key) => {
      if (keys.indexOf(key) < 0) {
        res[key] = data[key];
      }
      return res;
    }, {});
  },
  fixLink: function (href) {
    let curr = location.hash.replace(/^#/, '')
    if (href.startsWith('/')) {
      if (curr.startsWith('/')) {
        return "#" + href;
      } else {
        let m = curr.match(/^(https?:\/\/[^/]+)\//);
        return "#" + m[1] + href;
      }
    } else {
      return "#" + href;
    }
  }
};

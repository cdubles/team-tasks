//replace all HTML key charecters with their charecter code to stop XXS
var sanitize = {
  sanitize: function (string) {
    const map = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#x27;",
      "/": "&#x2F;",
    };
    const reg = /[&<>"'/]/gi;
    return string.replace(reg, (match) => map[match]);
  },
};

module.exports = sanitize;

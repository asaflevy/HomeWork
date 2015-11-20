function CookieHelper(cookieName) {
  this.cookieName = cookieName || "kaminario_data";
  this.init();
}

/**
 * check if cookieName exist if not creat one
 */
CookieHelper.prototype.init = function () {
  $.cookie.json = true;
  var simpleData = [{"firstname":"John","lastname":"Doe","email":"john@example.com","age":"17"},{"firstname":"Mary","lastname":"Moe","email":"mary@example.com","age":"32"},{"firstname":"July","lastname":"Dooley","email":"july@example.com","age":"14"}];
  if (typeof $.cookie(this.cookieName) === 'undefined') {
    $.cookie(this.cookieName, JSON.stringify(simpleData), {path: '/', expires: 365});
  } else {
    return $.cookie(this.cookieName);
  }
};


/**
 * save data to cookie
 * @param data
 * @returns {*}
 */
CookieHelper.prototype.save = function (data) {
  return $.cookie(this.cookieName, JSON.stringify(data));
};

/**
 * read data from cookie
 * @param data
 */
CookieHelper.prototype.read = function () {
  return $.parseJSON($.cookie(this.cookieName));
};
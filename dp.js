/*
* JavaScript常用的设计模式
*/


/*
* 1. 单例模式
*/

// 普通单例模式
var Singleton = function (name) {
  this.name = name;
}

Singleton.prototype.getName = function () {
  alert(this.name);
}

Singleton.prototype.getInstance = function (name) {
  // 核心代码
  if (!this.instance) {
    return this.instance = new Singleton(name);
  }
  return this.instance;
}

// 透明的单例模式
var CreateDiv = (function () {

  var instance;

  var CreateDiv = function (html) {
    if (instance) {
      return instance;
    }
    this.html = html;
    this.init();
    return instance = this;
  }

  CreateDiv.prototype.init = function () {
    var div = document.createElement('div');
    div.innerHTML = this.html;
    document.body.appendChild(div);
  }

  return CreateDiv;
})();

// 用代理模式实现单例模式
var CreateDiv = function (html) {
  this.html = html;
  this.init();
}
CreateDiv.prototype.init = function () {
  var div = document.createElement('div');
  div.innerHTML = this.html;
  document.body.appendChild(div);
}
// 创建代理类
var ProxySingletonCreateDiv = (function () {

  var instance;
  return function (html) {
    if (!instance) {
      instance = new CreateDiv(html);
    }

    return instance;
  }
})();

// 惰性单例模式

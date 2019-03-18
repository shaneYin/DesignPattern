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
// 见SinglePattenForWebQQ.html

/*
* 2. 策略模式
*/

// 计算奖金代码（垃圾版本）   拓展性、复用性低
var calculateBouns = function (level, salary) {
  if (level === 'S') {
    return salary * 4;
  }

  if (level === 'A') {
    return salary * 3;
  }

  if (level === 'B') {
    return salary * 2;
  }
}

calculateBouns('S', 10000);

// 计算奖金代码-策略者模式（静态语言类型）

// 三个策略对象
var LevelS = function () {}
LevelS.prototype.calculate = function (salary) {
  return salary * 4
}

var LevelA = function () {}
LevelS.prototype.calculate = function (salary) {
  return salary * 3
}

var Levelb = function () {}
LevelS.prototype.calculate = function (salary) {
  return salary * 2
}

var Bouns = function () {
  this.salary = null;
  this.strategy = null;
}

Bouns.prototype.setSalary = function (salary) {
  this.salary = salary;
}
Bouns.prototype.setStrategy = function (strategy) { 
  this.strategy = strategy;
}
Bouns.prototype.getBouns = function () {
  // 计算方式委托给策略对象
  return this.strategy.calculate(this.salary);
}

// 计算奖金代码-策略者模式（JavaScript语言类型）

var strategies = {
  "S": function (salary) {
    return salary * 4;
  },
  "A": function (salary) {
    return salary * 3;
  },
  "B": function (salary) {
    return salary * 2
  }
};

var getBouns = function (level, salary) {
  return strategies[level](salary);
}


// 策略模式实现缓动动画
// 见
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
// 见StrategyPatternAnimate.html

// 策略模式实现表单验证
// 见StrategyPatternFormValidation.html


/*
* 3. 代理模式
*/

// 业务场景：图片预加载
var myImage = (function () {
  var imgNode = document.createElement('img');
  document.body.appendChild(imgNode);
  return {
    setSrc: function (src) {
      imgNode.src = src;
    }
  }
})();

myImage.setSrc('http:// imgcache.qq.com/music/photo/k/000GGDys0yA0Nk.jpg');

// 引入代理对象
var myImage = (function () {
  var imgNode = document.createElement('img');
  document.body.appendChild(imgNode);
  return {
    setSrc: function (src) {
      imgNode.src = src;
    }
  }
})();

var proxyImage = (function () {
  var img = new Image();
  img.onload = function () {
    // 这里面的this代表img元素
    myImage.setSrc(this.src);
  }
  return {
    setSrc: function (src) {
      myImage.setSrc('base64;xdidadlkf');
      img.src = src;
    }
  }
})();

proxyImage.setSrc('http://imgcache.qq.com/music/photo/k/000GGDys0yA0Nk.jpg');

// 代码模式常用有 虚拟代理和缓存代理

// 动态创建缓存代理

/******************计算乘积******************/
var mult = function () {
  var a = 1;
  for (var i = 0; i < arguments.length; i++) {
    a = a * arguments[i];
  }
  return a;
}

/******************计算加和******************/
var plus = function () {
  var a = 0;
  for (var i = 0; i < arguments.length; i++) {
    a = a + arguments[i]
  }
  return a;
}

/***************创建缓存代理工厂***************/
var createProxyFactory = function (fn) {
  var cache = {};
  return function () {
    var args = Array.prototype.join.call(arguments, ',');
    if (args in cache) {
      return cache[args];
    }
    return cache[args] = fn.apply(this, arguments);
  }
}

var proxyMult = createProxyFactory(mult);


/*
* 4. 迭代器模式
*/

// 内部迭代（[].forEach）
var each = function (arr, callback) {
  for (var i = 0; i < arr.length; i++) {
    callback.call(arr[i], i, arr[i]);
  }
}

each([1,2,3], function (key, value) { console.log(value) });

// 外部迭代
var Iterator = function (obj) {
  var current = 0;

  var next = function () {
    current += 1;
  }

  var isDone = function () {
    return current === obj.length;
  }

  var getCurrItem = function () {
    return obj[current];
  }

  return {
    next: next,
    isDone: isDone,
    getCurrItem: getCurrItem
  }
}

// 迭代器模式应用场景举例
// 文件上传，根据不同浏览器获取相应的上传组件对象
var getUploadObj = function () {
  try {
    return new ActiveXObject("TXFTNActiveX.FTNUpload");  // ie上传控件
  } catch(e) {
    if (supportFlash()) {
      var str = '<object type="application/x-shockwave-flash"></object>';
      return $( str ).appendTo( $('body') );
    } else {
      var str = '<input name="file" type="file"/>'; // 表单上传
      return $( str ).appendTo( $('body') );
    }
  }
}

// 使用迭代器模式，对每一个策略进行迭代
var getActiveUploadObj = function () {
  try {
    return new ActiveXObject("TXFTNActiveX.FTNUpload");  // ie上传控件
  } catch(e) {
    return false;
  }
}

var getFlashUploadObj = function () {
  if (supportFlash()) {
    var str = '<object type="application/x-shockwave-flash"></object>';
    return $( str ).appendTo( $('body') );
  } else {
    return false;
  }
}

var getFormUploadObj = function () {
  var str = '<input name="file" type="file"/>'; // 表单上传
  return $( str ).appendTo( $('body') );
}

var iteratorUploadObj = function () {
  for (var i = 0, fn; fn = arguments[i++];) {
    var uploadObj = fn();
    if (uploadObj !== false) {
      return uploadObj;
    }
  }
}

var uploadObj = iteratorUploadObj( getActiveUploadObj, getFlashUploadObj, getFormUpladObj );

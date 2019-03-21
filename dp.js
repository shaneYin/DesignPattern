/*
* JavaScript常用的设计模式
*/


/*
* 1. 单例模式
*/

// **普通单例模式
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

// **透明的单例模式
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

// **用代理模式实现单例模式
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

// **计算奖金代码（垃圾版本）   拓展性、复用性低
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

// **计算奖金代码-策略者模式（静态语言类型）

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

// **计算奖金代码-策略者模式（JavaScript语言类型）

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

// **业务场景：图片预加载
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

// **动态创建缓存代理

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

// **内部迭代（[].forEach）
var each = function (arr, callback) {
  for (var i = 0; i < arr.length; i++) {
    callback.call(arr[i], i, arr[i]);
  }
}

each([1,2,3], function (key, value) { console.log(value) });

// **外部迭代
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

// **迭代器模式应用场景举例
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

/*
* 5. 观察者模式
*/

// **用售楼处业务场景实现观察者模式

var salesOffices = {};         // 发布者

salesOffices.clientList = {};  // 存放订阅者的 回调函数

salesOffices.listen = function (key, fn) {
  if (!this.clientList[key]) {                       // 如果还没订阅过此类消息，就给该类消息创建一个缓存列表
    this.clientList[key] = [];
  }
  this.clientList[key].push(fn);                     // 订阅的消息加进缓存列表
}

salesOffices.trigger = function () {                 // 发布消息
  var key = Array.prototype.shift.call(arguments);   // 取出消息类型
  var fns = this.clientList[key]                     // 取出消息类型对应的函数集合列表

  if (!fns || fns.length === 0) {                    // 没有列表或者列表内无函数集合则返回空
    return false;
  }

  for (var i = 0, fn; fn = fns[i++];) {
    fn.apply(this, arguments);
  }
}

// A订阅 100平米的房源信息
salesOffices.listen('100', function (price) {
  consle.log('100平米房源价格为：' + price);
});
// B订阅 120平米的房源信息
salesOffices.listen('120', function (price) {
  console.log('120平米房源价格：' + price);
});

// 发布者发布
salesOffices.tigger('100', 20000);
salesOffices.tigger('120', 30000);


// **抽象出发布-订阅的对象来
var event = {
  clientList: {},
  listen: function (key, fn) {
    if (!this.clientList[key]) {
      this.clientList[key] = [];
    }
    this.clientList[key].push(fn);
  },
  trigger: function () {
    var key = Array.prototype.shift.call(arguments),
        fns = this.clientList[key];

    if (!fns ||fns.length === 0) {
      return false;
    }

    for (var i = 0, fn; fn = fns[i++];) {
      fn.apply(this, arguments);
    }
  }
}

// 添加取消订阅方法
event.remove = function (key, fn) {
  var fns = this.clientList[key];

  // 如果key对应的订阅函数为空，则直接返回
  if (!fns) {
    return false;
  }

  // 如果传入fn为空，则直接取消key对应的订阅函数列表
  if (!fn) {
    fns && (fns.length = 0);
  } else {
    for (var l = fns.length - 1; l >= 0; l--) {
      var _fn = fns[l];
      if (_fn === fn) {
        // 删除订阅函数
        fns.splice(l, 1);
      }
    }
  }
}
// 定义函数使任何一个对象都能抽象成 发布订阅模式对象
var installEvent = function (obj) {
  for (var i in event) {
    obj[i] = event[i];
  }
}

var salesOffices1 = {};
installEvent(salesOffices1);

// ** 抽象出发布者对象来，任何订阅函数都可用同一个对象

var Event = (function () {

  var clientList = {},
      trigger,
      listen,
      remove;

  listen = function (key, fn) {
    if (!clientList[key]) {
      clientList[key] = [];
    }
    clientList[key].push(fn);
  };

  trigger = function () {

    var key = Array.prototype.shift.call(arguments);
    var fns = clientList[key];
    if (!fns || fns.length === 0) {
      return false;
    }

    for (var i = 0, fn; fn = fns[i++]) {
      fn.apply(this, arguments);
    }
  };

  remove = function (key, fn) {
    var fns = clientList[key];

    if (!fns) {
      return false;
    }

    if (!fn) {
      fns && fns.length = 0;
    } else {
      for (var l = fns.length; l >= 0; l--) {
        var _fn = fns[l];
        if (_fn === fn) {
          fns.splice(l, 1);
        }
      }
    }
  };

  return {
    listen: listen,
    trigger: trigger,
    remove: remove
  }
})();

Event.listen('squareMeter88', function(price) {

  console.log('价格= ' + price);
}
Event.trigger('squareMeter88', 2000000);

// ** 添加先发布后订阅功能，和提供创建命名空间功能

var Event = (function () {

  var global = this,
      Event,
      _default = 'default';

  Event = function () {
    var _listen,
        _trigger,
        _remove,
        _create,
        _slice = Array.prototype.slice,
        _shift = Array.prototype.shift,
        _unshift = Array.prototype.unshift,
        nameSpaceCache = {},
        find,
        each = function (arr, fn) {
          var ret;
          for (var i = 0, l = arr.length; i < l; i++) {
            var n = arr[i];
            ret = fn.call(n, i, n);
          }
          return ret;
        };

        _listen = function (key, fn, cache) {
          if (!chche[key]) {
            cache[key] = [];
          }
          cache[key].push(fn);
        };

        _trigger = function () {
          var cache = _shift.call(arguments),
              key = _shift.call(arguments),
              args = arguments,
              _self = this,
              ret,
              stack = cache[key];

          if (!stack || stack.length === 0) {
            return;
          }

          return each(stack, function () {
            return this.apply(_self, args);
          });
        };

        _remove = function (key, cache, fn) {
          if (cache[key]) {
            if (fn) {
              for (var i = cache[key].length; i >= 0; i--) {
                if (cache[key][i] === fn) {
                  cache[key].splice(i, 1);
                }
              }
            } else {
              cache[key] = [];
            }
          }
        };

        _create = function (namespace) {
          var namespace = namespace || default;

          var cache = {},
              offlineStack = [],          // 离线事件
              ret = {
                listen: function (key, fn, last) {
                  _listen(key, fn, cache);
                  if (offlineStack === null) {
                    return;
                  }
                  if (last === 'last') {
                    offlineStack && offlineStack.pop()();
                  } else {
                    each(offlineStack, function () {
                      this();
                    });
                  }
                  offlineStack = null;
                },
                one: function (key, fn, last) {
                  _remove(key, cache);
                  this.listen(key, fn, last);
                },
                remove: function (key, fn) {
                  _remove(key, cache, fn);
                },
                trigger: function () {
                  var fn,
                      args,
                      _self = this;

                  _unshift.call(arguments, cache);
                  args = arguments;
                  fn = function () {
                    return _trigger.apply(_self, args);
                  };

                  if (offlineStack) {
                    return offlineStack.push(fn);
                  }
                  return fn();
                }
              };

          return namespace ?
              (nameSpaceCache[namespace] ? nameSpaceCache[name]:
                nameSpaceCache[namespace] = ret) :
                ret;
        };

        return {
          create: _create,
          one: function (key, fn, last) {
            var event = this.create();
            event.one(key, fn, last);
          },
          remove: function (key, fn) {
            var event = this.create();
            event.remove(key, fn);
          },
          listen: function (key, fn, last) {
            var event = this.create();
            event.listen(key, fn, last);
          },
          trigger: function () {
            var event = this.create();
            event.trigger.apply(this, arguments);
          }
        }
  }
  return Event;
})();

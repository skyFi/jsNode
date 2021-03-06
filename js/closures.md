<h1>JavaScript内部原理系列－闭包（Closures）</h1>
<h2>概要</h2>
<p>本文将介绍一个在JavaScript经常会拿来讨论的话题 —— 闭包（closure）。
    闭包其实已经是个老生常谈的话题了； 有大量文章都介绍过闭包的内容， 尽管如此，这里还是要试着从理论角度来讨论下闭包，
    看看ECMAScript中的闭包内部究竟是如何工作的。</p>
<h2>概论</h2>
<p>在讨论ECMAScript闭包之前，先来介绍下函数式编程（与ECMA-262-3 标准无关）中一些基本定义。 然而，为了更好的解释这些定义，这里还是拿ECMAScript来举例。</p>
<p>众所周知，在函数式语言中（ECMAScript也支持这种风格），函数即是数据。就比方说，函数可以保存在变量中，可以当参数传递给其他函数，还可以当返回值返回等等。 这类函数有特殊的名字和结构。</p>
<h2>定义</h2>
<p>函数式参数（“Funarg”） —— 是指值为函数的参数。</p>
<p>如下例子：</p>
<pre><code>
    function exampleFunc(funArg) {
        funArg();
    }

    exampleFunc(function () {
        alert('funArg');
    });
</code></pre>
<p>上述例子中funArg的实参是一个传递给exampleFunc的匿名函数。</p>
<p>反过来，接受函数式参数的函数称为 高阶函数（high-order function 简称：HOF）。还可以称作：函数式函数 或者 偏数理的叫法：操作符函数。 上述例子中，exampleFunc 就是这样的函数。</p>
<p>此前提到的，函数不仅可以作为参数，还可以作为返回值。这类以函数为返回值的函数称为 _带函数值的函数（functions with functional value or function valued functions）。</p>
<pre><code>
    (function functionValued() {
        return function () {
            alert('returned function is called');
            };
    })()();//这种()直接执行的方式要熟悉。
</code></pre>
<p>可以以正常数据形式存在的函数（比方说：当参数传递，接受函数式参数或者以函数值返回）都称作 第一类函数（一般说第一类对象）。 在ECMAScript中，所有的函数都是第一类对象。</p>
<p>接受自己作为参数的函数，称为 自应用函数（auto-applicative function 或者 self-applicative function）：</p>
<pre><code>
    (function selfApplicative(funArg) {

        if (funArg && funArg === selfApplicative) {
            alert('self-applicative');
            return;
        }

        selfApplicative(selfApplicative);

    })();
</code></pre>
<p>以自己为返回值的函数称为 自复制函数（auto-replicative function 或者 self-replicative function）。 通常，“自复制”这个词用在文学作品中：</p>
<pre><code>
    (function selfReplicative() {
        return selfReplicative;
    })();
</code></pre>
<p>在函数式参数中定义的变量，在“funArg”激活时就能够访问了（因为存储上下文数据的变量对象每次在进入上下文的时候就创建出来了）：</p>
<pre><code>
    function testFn(funArg) {

        // 激活funArg, 本地变量localVar可访问
        funArg(10); // 20
        funArg(20); // 30

    }

    testFn(function (arg) {

        var localVar = 10;
        alert(arg + localVar);

    });
</code></pre>
<p>然而，我们知道，在ECMAScript中，函数是可以封装在父函数中的，并可以使用父函数上下文的变量。 这个特性会引发 funArg问题。</p>
<h2>FunArg问题</h2>
<p>在<b>面向堆栈</b>的编程语言中，函数的本地变量都是保存在堆栈上的， 每当函数激活的时候，这些变量和函数参数都会压栈到该堆栈上。</p>
<p>当函数返回的时候，这些参数又会从堆栈中移除。这种模型对将函数作为函数式值使用的时候有很大的限制（比方说，作为返回值从父函数中返回）。 绝大部分情况下，问题会出现在当函数有 <b>自由变量</b>的时候。</p>
<p><b>自由变量</b>是指在函数中使用的，但既不是函数参数也不是函数的局部变量的变量</p>
<p>如下所示：</p>
<pre><code>
    function testFn() {

        var localVar = 10;

        function innerFn(innerParam) {
            alert(innerParam + localVar);
        }

        return innerFn;
    }

    var someFn = testFn();
    someFn(20); // 30
</code></pre>
<p>上述例子中，对于innerFn函数来说，localVar就属于自由变量。</p>
<p>对于采用 面向堆栈模型来存储局部变量的系统而言，就意味着当testFn函数调用结束后，其局部变量都会从堆栈中移除。 这样一来，当从外部对innerFn进行函数调用的时候，就会发生错误（因为localVar变量已经不存在了）。</p>
<p>而且，上述例子在 面向堆栈实现模型中，要想将innerFn以返回值返回根本是不可能的。 因为它也是testFn函数的局部变量，也会随着testFn的返回而移除。</p>
<p>还有一个函数对象问题和当系统采用动态作用域，函数作为函数参数使用的时候有关。</p>
<p>看如下例子：</p>
<pre><code>
    var z = 10;

    function foo() {
        alert(z);
    }

    foo(); // 10 – 静态作用域和动态作用域情况下都是

    (function () {

        var z = 20;
        foo(); // 10 – 静态作用域情况下, 20 – 动态作用域情况下

    })();

    // 将foo函数以参数传递情况也是一样的

    (function (funArg) {

        var z = 30;
        funArg(); // 10 – 静态作用域情况下, 30 – 动态作用域情况下

    })(foo);
</code></pre>
<p>我们看到，采用动态作用域，变量（标识符）处理是通过动态堆栈来管理的。 因此，<b>自由变量</b>是在当前活跃的动态链中查询的，而不是在函数创建的时候保存起来的静态作用域链中查询的。</p>
<p>这样就会产生冲突。比方说，即使Z仍然存在（与之前从堆栈中移除变量的例子相反），还是会有这样一个问题： 在不同的函数调用中，Z的值到底取哪个呢（从哪个上下文，哪个作用域中查询）？</p>
<p>上述描述的就是两类 funArg问题 —— 取决于是否将函数以返回值返回（第一类问题）以及是否将函数当函数参数使用（第二类问题）。</p>
<p>为了解决上述问题，就引入了 闭包的概念。下面重点来了，闭包的面纱就此揭开。</p>
<h2>闭包</h2>
<p><b>闭包是代码块和创建该代码块的上下文中数据的结合。</b></p>
<p>让我们来看下面这个例子：</p>
<pre><code>
    var x = 20;

    function foo() {
        alert(x); // 自由变量 "x" == 20
    }

    // foo的闭包
    fooClosure = {
        call: foo // 对函数的引用
        lexicalEnvironment: {x: 20} // 查询自由变量的上下文
    };
</code></pre>
<p>上述例子中，“fooClosure”部分是伪代码。对应的，在ECMAScript中，“foo”函数已经有了一个内部属性——创建该函数上下文的作用域链。</p>
<p>这里“lexical”是不言而喻的，通常是省略的。上述例子中是为了强调在闭包创建的同时，上下文的数据就会保存起来。 当下次调用该函数的时候，自由变量就可以在保存的（闭包）上下文中找到了，正如上述代码所示，变量“z”的值总是10。</p>
<p>定义中我们使用的比较广义的词 —— “代码块”，然而，通常（在ECMAScript中）会使用我们经常用到的函数。 当然了，并不是所有对闭包的实现都会将闭包和函数绑在一起，比方说，在Ruby语言中，闭包就有可能是： 一个程序对象（procedure object）, 一个lambda表达式或者是代码块。</p>
<p>对于要实现将局部变量在上下文销毁后仍然保存下来，基于堆栈的实现显然是不适用的（因为与基于堆栈的结构相矛盾）。 因此在这种情况下，上层作用域的闭包数据是通过 动态分配内存的方式来实现的（基于“堆”的实现），配合使用垃圾回收器（garbage collector简称GC）和 引用计数（reference counting）。 这种实现方式比基于堆栈的实现性能要低，然而，任何一种实现总是可以优化的： 可以分析函数是否使用了自由变量，函数式参数或者函数式值，然后根据情况来决定 —— 是将数据存放在堆栈中还是堆中。</p>
<h2>ECMAScript闭包的实现</h2>
<p>讨论完理论部分，接下来让我们来介绍下ECMAScript中闭包究竟是如何实现的。 这里还是有必要再次强调下：ECMAScript只使用静态（词法）作用域（而诸如Perl这样的语言，既可以使用静态作用域也可以使用动态作用域进行变量声明）。</p>
<pre><code>
    var x = 10;

    function foo() {
        alert(x);
    }

    (function (funArg) {

        var x = 20;

        // funArg的变量 "x" 是静态保存的，在该函数创建的时候就保存了

        funArg(); // 10, 而不是 20

    })(foo);
</code></pre>
<p>从技术角度来说，创建该函数的上层上下文的数据是保存在函数的内部属性<a href="#allScope" id="back">[[Scope]]</a>中的。如果你对[[Scope]]和作用域链的知识完全理解了的话，那对闭包也就完全理解了。</p>
<p>根据函数创建的算法，我们看到 在ECMAScript中，所有的函数都是闭包，因为它们都是在创建的时候就保存了上层上下文的作用域链（除开异常的情况） （不管这个函数后续是否会激活 —— [[Scope]]在函数创建的时候就有了）：</p>
<pre><code>
    var x = 10;

    function foo() {
        alert(x);
    }

    // foo is a closure
    foo: FunctionObject = {
        [[Call]]: code block of foo,
        [[Scope]]: [
            global: {
                x: 10
            }
        ],
        ... // other properties
    };
</code></pre>
<p>正如此前提到过的，出于优化的目的，当函数不使用自由变量的时候，实现层可能就不会保存上层作用域链。 然而，ECMAScript-262-3标准中并未对此作任何说明；因此，严格来说 —— 所有函数都会在创建的时候将上层作用域链保存在[[Scope]]中。</p>
<h2 id="scope">“万能”的[[Scope]]</h2>
<p>这里不得不说<a href="">JavaScript的作用域链</a></p>
<p>这里还要注意的是：在ECMAScript中，<b>同一个上下文中创建的闭包是共用一个[[Scope]]属性的</b>。 也就是说，某个闭包对其中的变量做修改会影响到其他闭包对其变量的读取：</p>
<pre><code>
    var firstClosure;
    var secondClosure;

    function foo() {

        var x = 1;

        firstClosure = function () { return ++x; };
        secondClosure = function () { return --x; };

        x = 2; // 对AO["x"]产生了影响, 其值在两个闭包的[[Scope]]中

        alert(firstClosure()); // 3, 通过 firstClosure.[[Scope]]
    }

    foo();

    alert(firstClosure()); // 4
    alert(secondClosure()); // 3
</code></pre>
<p>正因为这个特性，很多人都会犯一个非常常见的错误： 当在循环中创建了函数，然后将循环的索引值和每个函数绑定的时候，通常得到的结果不是预期的（预期是希望每个函数都能够获取各自对应的索引值）。这个错误也是题目中说提到的那段代码的最大错误的地方，下面我们来揭秘为啥button点击弹出来的都是5.</p>
<pre><code>
    var data = [];

    for (var k = 0; k < 3; k++) {
        data[k] = function () {
            alert(k);
        };
    }

    data[0](); // 3, 而不是 0
    data[1](); // 3, 而不是 1
    data[2](); // 3, 而不是 2
</code></pre>
<p>上述例子就证明了 —— 同一个上下文中创建的闭包是共用一个[[Scope]]属性的。因此上层上下文中的变量“k”是可以很容易就被改变的。</p>
<p>如下所示：</p>
<pre><code>
    activeContext.Scope = [
        ... // higher variable objects
        {data: [...], k: 3} // activation object
    ];

    data[0].[[Scope]] === Scope;
    data[1].[[Scope]] === Scope;
    data[2].[[Scope]] === Scope;
</code></pre>
<p>这样一来，在函数激活的时候，最终使用到的k就已经变成了3了。</p>
<p>如下所示，<b title="这个方法，就是解决我们题中出现的问题的一解决方案。">创建一个额外的闭包就可以解决这个问题了</b>：</p>
<pre><code>
    var data = [];

    for (var k = 0; k < 3; k++) {
        data[k] = (function _helper(x) {
            return function () {
                alert(x);
            };
        })(k); // 将 "k" 值传递进去
    }

    // 现在就对了
    data[0](); // 0
    data[1](); // 1
    data[2](); // 2
</code></pre>
<p>上述例子中，函数“_helper”创建出来之后，通过参数“k”激活。其返回值也是个函数，该函数保存在对应的数组元素中。 这种技术产生了如下效果： 在函数激活时，每次“_helper”都会创建一个新的变量对象，其中含有参数“x”，“x”的值就是传递进来的“k”的值。 这样一来，返回的函数的[[Scope]]就成了如下所示：</p>
<pre><code>
    data[0].[[Scope]] === [
        ... // 更上层的变量对象
        上层上下文的AO: {data: [...], k: 3},
        _helper上下文的AO: {x: 0}
    ];

    data[1].[[Scope]] === [
        ... // 更上层的变量对象
        上层上下文的AO: {data: [...], k: 3},
        _helper上下文的AO: {x: 1}
    ];

    data[2].[[Scope]] === [
        ... // 更上层的变量对象
        上层上下文的AO: {data: [...], k: 3},
        _helper上下文的AO: {x: 2}
    ];
</code></pre>
<p>我们看到，这个时候函数的[[Scope]]属性就有了真正想要的值了，为了达到这样的目的，我们不得不在[[Scope]]中创建额外的变量对象。 要注意的是，<b>在返回的函数中，如果要获取“k”的值，那么该值还是会是3</b>。</p>
<p>顺便提下，大量介绍JavaScript的文章都认为只有额外创建的函数才是闭包，这种说法是错误的(我也差点有这个错误的认识，再次感谢作者指出。)。 实践得出，这种方式是最有效的，然而，从理论角度来说，在ECMAScript中所有的函数都是闭包。</p>
<p>然而，上述提到的方法并不是唯一的方法。通过其他方式也可以获得正确的“k”的值，如下所示：</p>
<pre><code>
    var data = [];

    for (var k = 0; k < 3; k++) {
        (data[k] = function () {
            alert(arguments.<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/arguments/callee" target="_blank">callee</a>.x);
        }).x = k; // 将“k”存储为函数的一个属性
    }

    // 同样也是可行的
    data[0](); // 0
    data[1](); // 1
    data[2](); // 2
</code></pre>
<p><b>然而，arguments.callee从ECMAScript (ES5)中移除了，所以这个方法了解下就行了。</b></p>
<h2>FunArg和return</h2>
<p>另外一个特性是从闭包中返回。在ECMAScript中，闭包中的返回语句会将控制流返回给调用上下文（调用者）。 而在其他语言中，比如，Ruby，有很多中形式的闭包，相应的处理闭包返回也都不同，下面几种方式都是可能的：可能直接返回给调用者，或者在某些情况下——直接从上下文退出。</p>
<p>ECMAScript标准的退出行为如下：</p>
<pre><code>
    function getElement() {

        [1, 2, 3].forEach(function (element) {

            if (element % 2 == 0) {
                // 返回给函数"forEach"，
                // 而不会从getElement函数返回
                alert('found: ' + element); // found: 2
                return element;
            }

        });

        return null;
    }

    alert(getElement()); // null, 而不是 2
</code></pre>
<p>然而，在ECMAScript中通过try catch可以实现如下效果(这个方法简直太棒了！)：</p>
<pre><code>
    var $break = {};

    function getElement() {

        try {

            [1, 2, 3].forEach(function (element) {

                if (element % 2 == 0) {
                    // 直接从getElement"返回"
                    alert('found: ' + element); // found: 2
                    $break.data = element;
                    throw $break;
                }

            });

        } catch (e) {
            if (e == $break) {
                return $break.data;
            }
        }

        return null;
    }

    alert(getElement()); // 2
</code></pre>
<h2>理论版本</h2>
<p>通常，程序员会错误的认为，只有匿名函数才是闭包。其实并非如此，正如我们所看到的 —— 正是因为作用域链，使得所有的函数都是闭包（与函数类型无关： 匿名函数，FE，NFE，FD都是闭包）， 这里只有一类函数除外，那就是通过Function构造器创建的函数，因为其[[Scope]]只包含全局对象。 为了更好的澄清该问题，我们对ECMAScript中的闭包作两个定义（即两种闭包）：</p>
<p>ECMAScript中，闭包指的是：</p>
<ul>
    <li>从理论角度：所有的函数。因为它们都在创建的时候就将上层上下文的数据保存起来了。哪怕是简单的全局变量也是如此，因为函数中访问全局变量就相当于是在访问自由变量，这个时候使用最外层的作用域。</li>
    <li>从实践角度：以下函数才算是闭包：
        <ul>
            <li>即使创建它的上下文已经销毁，它仍然存在（比如，内部函数从父函数中返回）</li>
            <li>在代码中引用了<b>自由变量</b></li>
        </ul>
    </li>
</ul>
<h2>闭包实践</h2>
<p>实际使用的时候，闭包可以创建出非常优雅的设计，允许对funArg上定义的多种计算方式进行定制。 如下就是数组排序的例子，它接受一个排序条件函数作为参数：</p>
<pre><code>
    [1, 2, 3].sort(function (a, b) {
        ... // 排序条件
    });
</code></pre>
<p>同样的例子还有，数组的map方法（并非所有的实现都支持数组map方法，SpiderMonkey从1.6版本开始有支持），该方法根据函数中定义的条件将原数组映射到一个新的数组中：</p>
<pre><code>
    [1, 2, 3].map(function (element) {
        return element * 2;
    }); // [2, 4, 6]
</code></pre>
<p>使用函数式参数，可以很方便的实现一个搜索方法，并且可以支持无穷多的搜索条件：</p>
<pre><code>
    someCollection.find(function (element) {
        return element.someProperty == 'searchCondition';
    });
</code></pre>
<p>还有应用函数，比如常见的forEach方法，将funArg应用到每个数组元素：</p>
<pre><code>
    [1, 2, 3].forEach(function (element) {
        if (element % 2 != 0) {
            alert(element);
        }
    }); // 1, 3
</code></pre>
<p>顺便提下，函数对象的 apply 和 call方法，在函数式编程中也可以用作应用函数。这里，我们将它们看作是应用函数 —— 应用到参数中的函数（在apply中是参数列表，在call中是独立的参数）：</p>
<pre><code>
    (function () {
        alert([].join.call(arguments, ';')); // 1;2;3
    }).apply(this, [1, 2, 3]);
</code></pre>
<p>闭包还有另外一个非常重要的应用 —— 延迟调用：</p>
<pre><code>
    var a = 10;
    setTimeout(function () {
        alert(a); // 10, 一秒钟后
    }, 1000);
</code></pre>
<p>也可以用于回调函数：</p>
<pre><code>
    ...
    var x = 10;
    // only for example
    xmlHttpRequestObject.onreadystatechange = function () {
        // 当数据就绪的时候，才会调用;
        // 这里，不论是在哪个上下文中创建，变量“x”的值已经存在了
        alert(x); // 10
    };
    ..
</code></pre>
<p>还可以用于封装作用域来隐藏辅助对象：</p>
<pre><code>
    var foo = {};

    // initialization
    (function (object) {

        var x = 10;

        object.getX = function _getX() {
            return x;
        };

    })(foo);

    alert(foo.getX()); // get closured "x" – 10
</code></pre>
<h2>几个闭包样例</h2>
<p>感谢<a href="http://blog.morrisjohns.com/javascript_closures_for_dummies.html" target="_blank">JavaScript Closures For Dummies(镜像)</a></p>
<strong>例子1:闭包中局部变量是引用而非拷贝</strong>
<pre><code>
    function say667() {
        // Local variable that ends up within closure
        var num = 666;
        var sayAlert = function() {
            alert(num);
        }
        num++;
        return sayAlert;
    }

    var sayAlert = say667();
    sayAlert()
</code></pre>
<p>因此执行结果应该弹出的667而非666。</p>
<strong>例子2：多个函数绑定同一个闭包，因为他们定义在同一个函数内。</strong>
<pre><code>
    function setupSomeGlobals() {
        // Local variable that ends up within closure
        var num = 666;
        // Store some references to functions as global variables
        gAlertNumber = function() { alert(num); }
        gIncreaseNumber = function() { num++; }
        gSetNumber = function(x) { num = x; }
    }
    setupSomeGlobals();         // 为三个全局变量赋值
    gAlertNumber();             //666
    gIncreaseNumber();
    gAlertNumber();             // 667
    gSetNumber(12);             //
    gAlertNumber();             //12
</code></pre>
<strong>例子3：当在一个循环中赋值函数时，这些函数将绑定同样的闭包</strong>
<pre><code>
    function buildList(list) {
        var result = [];
        for (var i = 0; i < list.length; i++) {
            var item = 'item' + list[i];
            result.push( function() {alert(item + ' ' + list[i])} );
        }
        return result;
    }

    function testList() {
        var fnList = buildList([1,2,3]);
        // using j only to help prevent confusion - could use i
        for (var j = 0; j < fnList.length; j++) {
            fnList[j]();
        }
    }
</code></pre>
<p>testList的执行结果是弹出item3 undefined窗口三次，因为这三个函数绑定了同一个闭包，而且item的值为最后计算的结果，但是当i跳出循环时i值为4，所以list[4]的结果为undefined.(再具体原因，前面有解释过。)</p>
<strong>例子4：外部函数所有局部变量都在闭包内，即使这个变量声明在内部函数定义之后。</strong>
<pre><code>
    function sayAlice() {
        var sayAlert = function() { alert(alice); }
        // Local variable that ends up within closure
        var alice = 'Hello Alice';
        return sayAlert;
    }
    var helloAlice=sayAlice();
    helloAlice();
</code></pre>
<p>执行结果是弹出”Hello Alice”的窗口。即使局部变量声明在函数sayAlert之后，局部变量仍然可以被访问到。</p>
<strong>例子5：每次函数调用的时候创建一个新的闭包</strong>
<pre><code>
    function newClosure(someNum, someRef) {
        // Local variables that end up within closure
        var num = someNum;
        var anArray = [1,2,3];
        var ref = someRef;
        return function(x) {
            num += x;
            anArray.push(num);
            alert('num: ' + num +
                '\nanArray ' + anArray.toString() +
                '\nref.someVar ' + ref.someVar);
        }
    }
    closure1=newClosure(40,{someVar:'closure 1'});
    closure2=newClosure(1000,{someVar:'closure 2'});

    closure1(5); // num:45 anArray[1,2,3,45] ref:'someVar closure1'
    closure2(-10);// num:990 anArray[1,2,3,990] ref:'someVar closure2'
</code></pre>
<strong>Singleton 单件：</strong>
<pre><code>
    var singleton = function () {
        var privateVariable;
        function privateFunction(x) {
            ...privateVariable...
        }

        return {
            firstMethod: function (a, b) {
                ...privateVariable...
            },
            secondMethod: function (c) {
                ...privateFunction()...
            }
    };
</code></pre>
<p>这个单件通过闭包来实现。通过闭包完成了私有的成员和方法的封装。匿名主函数返回一个对象。对象包含了两个方法，方法1可以方法私有变量，方法2访 问内部私有函数。需要注意的地方是匿名主函数结束的地方的’()’，如果没有这个’()’就不能产生单件。因为匿名函数只能返回了唯一的对象，而且不能被 其他地方调用。这个就是利用闭包产生单件的方法。</p>
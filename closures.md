<h1>{<a href="http://segmentfault.com/a/1190000002452587#articleHeader6" target="_blank">转</a>}JavaScript内部原理系列－闭包（Closures）</h1>
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
<h2 id="scope"><a href="#back" id="allScope">“万能”的[[Scope]]</a></h2>
<p>这里还要注意的是：在ECMAScript中，<b>同一个上下文中创建的闭包是共用一个[[Scope]]属性的</b>。 也就是说，某个闭包对其中的变量做修改会影响到其他闭包对其变量的读取：</p>
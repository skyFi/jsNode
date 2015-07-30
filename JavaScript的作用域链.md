<h1>JavaScript的作用域链</h1>
<p>这是一个非常重要的知识点了，了解了JavaScript的作用域链的话，能帮助我们理解很多‘异常’问题。</p>
<p>下面我们来看一个小例子，前面我说过的声明提前的例子。</p>
<pre><code>
    var name = 'skylor';
    function echo() {
        alert(name);
        var name = 'mm';
        alert(name);
        alert(age);
    }

    echo();
</code></pre>
<p>对于这个例子，没有接触过这方面的时候，第一反应是会纠结下，这第一个的name，到底调用全局变量的name，还是函数内部的name呢，如果调用全局的，可是函数内部也用定义和赋值啊，
如果调用函数内部的局部变量的话，那么他的值是mm吗？还是引用全局的skylor呢？</p>
<P>于是这个小例子就会有这样的错误答案：</P>
<pre><code>
    skylor
    mm
    [脚本出错]
</code></pre>
<p>其实不然，知道函数内的提前说明，就知道这是不正确的。</p>
<pre><code>
    undefined
    mm
    [脚本出错]
</code></pre>
<p>应该是这样的，那到底为什么是这个答案呢，提前声明这又是什么呢？一切的一切，涉及到JavaScript的作用域链。</p>
<h2>原理</h2>
<p>首先来说说，JavaScript的作用域的原理：</p>
<p>在JavaScript权威指南中有一句很精辟的描述：
    <strong>JavaScript中的函数运行在它们被定义的作用域里，而不是它们被运行的作用域里。</strong>
</p>
<p>另外在JavaScript中有个很重要的概念，那就是：
    <strong>在JavaScript中，一切皆对象，函数也是。</strong>
</p>
<p>在JS中，作用域的概念和其他语言差不多， 在每次调用一个函数的时候 ，就会进入一个函数内的作用域，当从函数返回以后，就返回调用前的作用域</p>
<p>JS的语法风格和C/C++类似, 但作用域的实现却和C/C++不同，并非用“堆栈”方式，而是使用列表，具体过程如下(ECMA262中所述):</p>
<ul>
    <li>任何执行上下文时刻的作用域, 都是由作用域链(scope chain, 后面介绍)来实现</li>
    <li>在一个函数被定义的时候, 会将它定义时刻的scope chain链接到这个函数对象的[[scope]]属性</li>
    <li>在一个函数对象被调用的时候，会创建一个活动对象(也就是一个对象), 然后对于每一个函数的形参，都命名为该活动对象的命名属性, 然后将这个活动对象做为此时的作用域链(scope chain)最前端, 并将这个函数对象的[[scope]]加入到scope chain中.</li>
</ul>
<p>看个例子吧：</p>
<pre><code>
    var func = function(lps, rps){
        var name = 'skylor';
        ........
    }
    func();
</code></pre>
<p>在执行func的定义语句的时候, 会创建一个这个函数对象的[[scope]]属性(内部属性,只有JS引擎可以访问, 但FireFox的几个引擎(SpiderMonkey和Rhino)提供了私有属性__parent__来访问它), 并将这个[[scope]]属性, 链接到定义它的作用域链上(后面会详细介绍), 此时因为func定义在全局环境, 所以此时的[[scope]]只是指向全局活动对象window active object.</p>
<p>在调用func的时候, 会创建一个活动对象(假设为aObj, 由JS引擎预编译时刻创建, 后面会介绍)，并创建arguments属性, 然后会给这个对象添加俩个命名属性aObj.lps, aObj.rps; 对于每一个在这个函数中申明的局部变量和函数定义, 都作为该活动对象的同名命名属性.</p>
<p>然后将调用参数赋值给形参数，对于缺少的调用参数，赋值为undefined。</p>
<p>然后将这个活动对象做为scope chain的最前端, 并将func的[[scope]]属性所指向的,定义func时候的顶级活动对象, 加入到scope chain.</p>
<p>有了上面的作用域链, 在发生标识符解析的时候, 就会逆向查询当前scope chain列表的每一个活动对象的属性，如果找到同名的就返回。找不到，那就是这个标识符没有被定义。</p>
<p>注意到, 因为<strong>函数对象的[[scope]]属性是在定义一个函数的时候决定的, 而非调用的时候</strong>, 所以如下面的例子:</p>
<pre><code>
    var name = 'skylor';
    function echo() {
        alert(name);
    }

    function env() {
        var name = 'mm';
        echo();
    }

    env();
</code></pre>
<p>他的运行结果是：skylor</p>
<p>结合上面的知识, 我们来看看下面这个例子,还记得那句JavaScript权威指南中的经典，<strong>JavaScript中的函数运行在它们被定义的作用域里，而不是它们被运行的作用域里。</strong>:</p>
<pre><code>
    function factory() {
        var name = 'skylor';
        var intro = function(){
            alert('I am ' + name);
        }
        return intro;
    }

    function app(para){
        var name = para;
        var func = factory();
        func();
    }

    app('mm');
</code></pre>
<p>当调用app的时候, scope chain是由: {window活动对象(全局)}->{app的活动对象} 组成.</p>
<p>在刚进入app函数体时, app的活动对象有一个arguments属性, 其他俩个值为undefined的属性: name和func. 和一个值为’mm’的属性para;</p>
<p>此时的scope chain如下:</p>
<pre><code>
    [[scope chain]] = [
        {
            para : 'mm',
            name : undefined,
            func : undefined,
            arguments : []
        }, {
            window call object
        }
    ]
</code></pre>
<p>当调用进入factory的函数体的时候, 此时的factory的scope chain为:</p>
<pre><code>
    [[scope chain]] = [
        {
            name : undefined,
            intor : undefined
        }, {
            window call object
        }
    ]
</code></pre>
<p>注意到, 此时的作用域链中, 并不包含app的活动对象.</p>
<p>在定义intro函数的时候, intro函数的[[scope]]为:</p>
<pre><code>
    [[scope chain]] = [
        {
            name : 'skylor',
            intor : undefined
        }, {
            window call object
        }
    ]
</code></pre>
<p>从factory函数返回以后,在app体内调用intor的时候, 发生了标识符解析, 而此时的sope chain是:</p>
<pre><code>
    [[scope chain]] = [
        {
            intro call object
        }, {
            name : 'skylor',
            intor : undefined
        }, {
            window call object
        }
    ]
</code></pre>
<p>因为scope chain中,并不包含factory活动对象. 所以, name标识符解析的结果应该是factory活动对象中的name属性, 也就是’skylor’.</p>
<p>所以运行结果是: I am skylor</p>
<p>至此，完整的一个运行流程，很清晰的能读懂“<strong>JavaScript中的函数运行在它们被定义的作用域里，而不是它们被运行的作用域里。</strong>”这句话讲的是什么了。</p>
<p>为了解释上面的一些问题，还得说说JavaScript的预编译。</p>
<h1>JavaScriptの预编译</h1>
<p>预编译，学过C等的我们都知道，可是问题来了，JavaScript是脚本语言，JavaScript的执行过程是一种翻译执行的过程，那在JavaScript的执行中，有没有类似编译的过程呢？</p>
<p>如果不是很确定，先通过一个例子：</p>
<pre><code>
    alert(typeof fun); //function
    function fun() {
        alert('I am skylor');
    };
</code></pre>
<p>这时候弹出来的是？-----我去，是“I am skylor”然而这时为什么呢，为啥不是undefined呢。</p>
<p>恩, 对, 在JS中, 是有预编译的过程的, JS在执行每一段JS代码之前, 都会首先处理var关键字和function定义式(函数定义式和函数表达式).</p>
<p>如上文所说, 在调用函数执行之前, 会首先创建一个活动对象, 然后搜寻这个函数中的局部变量定义,和函数定义, 将变量名和函数名都做为这个活动对象的同名属性, 对于局部变量定义,变量的值会在真正执行的时候才计算, 此时只是简单的赋为undefined.</p>
<p>而对于函数的定义,是一个要注意的地方:</p>
<pre><code>
    alert(typeof fun); //结果:function
    alert(typeof fn); //结果:undefined
    function fun() { //函数定义式
        alert('I am skylor');
    };
    var fn = function() { //函数表达式
    }
    alert(typeof fn); //结果:function
</code></pre>
<p>这就是函数定义式和函数表达式的不同, 对于函数定义式, 会将函数定义提前. 而函数表达式, 会在执行过程中才计算.</p>
<p>说到这里, 顺便说一个问题 :</p>
<pre><code>
    var name = 'skylor';
    age = 25;
</code></pre>
<p>我们都知道不使用var关键字定义的变量, 相当于是全局变量, 联系到我们刚才的知识:</p>
<p>在对age做标识符解析的时候, 因为是写操作, 所以当找到到全局的window活动对象的时候都没有找到这个标识符的时候, 会在window活动对象的基础上, 返回一个值为undefined的age属性.</p>
<p>也就是说, age会被定义在顶级作用域中.</p>
<p>现在, 也许你注意到了我刚才说的: JS在<strong>执行<i>每一段</i>JS代码之前, 都会首先处理var关键字和function定义式(函数定义式和函数表达式).</strong></p>
<p>对, 让我们看看下面的例子:</p>
<pre><code>
    < script >
        alert(typeof mm); //结果:undefined
    < /script >
    < script >
        function mm() {
            alert('I am skylor');
        }
    < /script >
</code></pre>

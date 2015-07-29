<h1>JavaScript的作用域链</h1>
<p>这是一个非常重要的知识点了，了解了JavaScript的作用域链的话，能帮助我们理解很多‘异常’问题。</p>
<p>下面我们来看一个小例子，前面我说过的声明提前的例子。</p>
<pre><code>
    var name = 'laruence';
    function echo() {
        alert(name);
        var name = 'eve';
        alert(name);
        alert(age);
    }

    echo();
</code></pre>
<p>对于这个例子，没有接触过这方面的时候，第一反应是会纠结下，这第一个的name，到底调用全局变量的name，还是函数内部的name呢，如果调用全局的，可是函数内部也用定义和赋值啊，
如果调用函数内部的局部变量的话，那么他的值是eve吗？还是引用全局的laruence呢？</p>
<P>于是这个小例子就会有这样的错误答案：</P>
<pre><code>
    laruence
    eve
    [脚本出错]
</code></pre>
<p>其实不然，知道函数内的提前说明，就知道这是不正确的。</p>
<pre><code>
    undefined
    eve
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
    <li></li>
    <li></li>
</ul>
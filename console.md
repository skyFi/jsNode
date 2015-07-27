<h1>使用console进行性能测试和计算代码运行时间</h1>
<p>对于前端开发人员，在开发过程中经常需要监控某些表达式或变量的值，如果使用用debugger会显得过于笨重，最常用的方法是会将值输出到控制台上方便调试。最常用的语句就是console.log(expression)了。</p>
<p>从早前一道阿里实习生招聘笔试题目入手：</p>
<pre><code>
    function f1() {
        console.time('time span');
    }
    function f2() {
        console.timeEnd('time span');
    }
    setTimeout(f1, 100);
    setTimeout(f2, 200);

    function waitForMs(n) {
        var now = Date.now();
        while (Date.now() - now < n) {
        }//空while
    }
    waitForMs(500);//输出什么？

    //->time span: 0ms
    //实际测试输出的是 time span: 0.023ms
    //实际的time是不确定的接近于0ms的，而不是0ms;
</code></pre>
<p>我们先说说关于console的高级操作，最后在一起分析这道题目。</p>
<h2>trace</h2>
<h3>console.trace()用来追踪函数的调用过程。</h3>
<p>在大型项目尤其是框架开发中，函数的调用轨迹可以十分复杂，console.trace()方法可以将函数的被调用过程清楚地输出到控制台上。</p>
<pre><code>
    function tracer(a) {
        console.trace();
        return a;
    }

    function foo(a) {
        return bar(a);
    }

    function bar(a) {
        return tracer(a);
    }

    var a = foo('tracer');
</code></pre>
<p>输出chrome:</p>
<pre><code>
console.trace()
    tracer                          @ VM127:3
    bar                             @ VM127:12
    foo                             @ VM127:8
    (anonymous function)            @ VM127:15
    InjectedScript._evaluateOn      @ VM116:895
    InjectedScript._evaluateAndWrap @ VM116:828
    InjectedScript.evaluate         @ VM116:694
</code></pre>
<h2>table</h2>
<h3>使用console将对象以表格呈现</h3>
<p>可将传入的对象，或数组以表格形式输出，相比传统树形输出，这种输出方案更适合内部元素排列整齐的对象或数组，不然可能会出现很多的 undefined。</p>
<pre><code>
    var people = {
        flora: {
            name: 'floraLam',
            age: '12'
        },
        john: {
            name: 'johnMa',
            age: '45'
        },
        ray:{
            name:'rayGuo',
            age:'22'
        }
    };

    console.table(people);
</code></pre>
<pre><code>
    <table>
        <tr>
            <td>(index)</td>
            <td>name</td>
            <td>age</td>
        </tr>
        <tr>
            <td>flora</td>
            <td>"floraLam"</td>
            <td>"12"</td>
        </tr>
        <tr>
            <td>john</td>
            <td>"johnMa"</td>
            <td>"45"</td>
        </tr>
        <tr>
            <td>ray</td>
            <td>"rayGuo"</td>
            <td>"22"</td>
        </tr>
    </table>
</code></pre>
<h2>time和timeEnd</h2>
<h3>计算程序的执行时间（成对出现）</h3>
<p>可以将成对的console.time()和console.timeEnd()之间代码的运行时间输出到控制台上</p>
<pre><code>
    console.time('计时器');
    for (var i = 0; i < 1000; i++) {
        for (var j = 0; j < 1000; j++) {
            //空
        }
    }
    console.timeEnd('计时器');
    //->计时器: 725.726ms
</code></pre>
<h2>profile</h2>
<h3>使用console测试程序性能</h3>
<pre><code>
    function parent() {
        for (var i = 0; i < 10000; i++) {
            childA()
        }
    }

    function childA(j) {
        for (var i = 0; i < j; i++) {}
    }

    console.profile('性能分析');
    parent();
    console.profileEnd();
</code></pre>
<p>现在说回笔试题目题目考察对console.time的了解和js单线程的理解。</p>
<pre><code>
    function f1() {
        console.time('time span');
    }
    function f2() {
        console.timeEnd('time span');
    }
    setTimeout(f1, 100);
    setTimeout(f2, 200);

    function waitForMs(n) {
        var now = Date.now();
        while (Date.now() - now < n) {
        }//空while
    }
    waitForMs(500);//->time span: 0ms
</code></pre>
<p>console.time()语句和console.timeEnd()语句是用来对程序的执行进行计时的。</p>
<p>setTimeout()接受两个参数，第一个是回调函数，第二个是推迟执行的毫秒数。setTimeout()只是将事件插入了"任务队列"，必须等到当前代码（执行栈）执行完，主线程才会去执行它指定的回调函数。</p>
<p>因为f1和f2被都setTimeout事先设置的定时器装到一个事件队列里面。本来 f1应该在100ms后就要执行了，但是因为waitForMs占用了线程，而执行JavaScript是单线程的，所以就没办法在100ms后执行那个 f1，所以需要等500ms等waitForMs执行完，然后在执行f1和f2，这时候f1和f2就几乎同时执行了。</p>
<p>还有一种说法：setTimeout()的第二个参数告诉javascript再过多长时间把当前任务添加到队列中。</p>
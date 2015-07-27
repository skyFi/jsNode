
<h1>1)  <code>["1","2","3"].map(parseInt);</code>的运行结果是？</h1>
<pre>A.["1","2","3"]
B.[1,2,3]
C.[0,1,2]
D.其他</pre>
<h2>分析：</h2>
<p style="color:red;">D</p>
map对数组的每个元素调用定义的回调函数并返回包含结果的数组。["1","2","3"].map(parseInt)对于数组中每个元素调用paresInt。但是该题目不同于：<pre>
function testFuc(a){
        return parseInt(a);
}
console.info(["1","2","3"].map(testFuc));</pre>
题目等同于：
<pre>
function testFuc(a,x){
        return parseInt(a,x);
}
console.info(["1","2","3"].map(testFuc));</pre>
map中回调函数的语法如下所示：<code>function callbackfn(value, index, array1)</code>，可使用最多三个参数来声明回调函数。第一参数value，数组元素的值；第二个参数index，数组元素的数组所以；array1，包含该元素的数组对象。
因此，题目等同于<code>[parseInt(1,0),parseInt(2,1),parseInt(3,2)]</code>
最终返回[1, NaN, NaN].
<h3><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt" target="_blank">parseInt()</a>:</h3>
<code>parseInt(string, radix);</code>接受两个参数<code>string</code>和<code>radix</code>。
<h4>string</h4>
需要解析的一串‘类数字’string。<blockquote>(The value to parse. If string is not a string, then it is converted to one. Leading whitespace in the string is ignored.)</blockquote>
<h4>radix</h4>
解析string的基数设置，可取值范围在2~36之间[闭区间]。<blockquote>(An integer between 2 and 36 that represents the radix (the base in mathematical numeral systems) of the above mentioned string. Specify 10 for the decimal numeral system commonly used by humans. Always specify this parameter to eliminate reader confusion and to guarantee predictable behavior. Different implementations produce different results when a radix is not specified.)</blockquote>
<p>从parseInt的定义中可以得出一个方便的理解，parseInt的第一个参数一定要小于第二个参数，当然它们都是数字的String的比较。否则结果就是NaN。</p>
<p>一个意外：当<code>radix</code>取值为0的时候，相当于默认的parseInt(string)而没有<code>radix</code>.eg:</p>
<pre><code>
parseInt(1,0);//相当于parseInt(1); ->1
parseInt(0123,0);//相当于parseInt(0123); ->83
</code>
</pre>
<h1>2)  <code>[typeof null, null instanceof Object]</code>的运行结果是？</h1>
<pre>
A.["object",false]
B.[null,false]
C.["object",true]
D.其他
</pre>
<h2>分析</h2>
<p>A</p>
typeof用以获取一个变量或者表达式的类型，typeof一般只能返回如下几个结果：
<p>number,boolean,string,function（函数）,object（NULL,数组，对象）,undefined。</p>
instanceof 表示某个变量是否是某个对象的实例，null是个特殊的Object类型的值 ，表示空引用的意思 。但null返回object这个其实是最初JavaScript的实现的一个错误，
然后被ECMAScript沿用了，成为了现在的标准，不过我们把null可以理解为尚未存在的对象的占位符，这样就不矛盾了 ，虽然这是一种“辩解”。<br>
对于我们开发人员 还是要警惕这种“语言特性”。最终返回：["object", false]
<h1>3) [[3,2,1].reduce(Math.pow),[].reduce(Math.pow)]的运行结果是？</h1>
<pre>
A.报错
B.[9,0]
C.[9,NaN]
D.[9,undefined]
</pre>
<h2>分析</h2>
<p>A</p>
pow() 方法可返回 x 的 y 次幂的值。[3,2,1].reduce(Math.pow);等同于：
<pre><code>
function testFuc(x,y){
        console.info(x +" : "+y);
        return Math.pow(x,y);
}
console.info([3,2,1].reduce(testFuc));
</code></pre>
执行<code>Math.pow(3,2)</code>和<code>Math.pow(9,1)</code，最终返回9。
但是要注意pow的参数都是必须的，<code>[].reduce(Math.pow)</code>，等同于执行<code>Math.pow();</code>会导致错误。
<h3>这里要介绍下<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce" target="_blank"><code>arr.reduce(callback[, initialValue])</code></a>了</h3>
国际惯例，官方解释：
<blockquote><pre>
<b>Parameters</b>

<b>allback</b>
      Function to execute on each value in the array, taking four arguments:
      <b>previousValue</b>
         The value previously returned in the last invocation of the callback,
         or initialValue, if supplied.
      <b>currentValue</b>
         The current element being processed in the array.
      <b>index</b>
         The index of the current element being processed in the array.
      <b>array</b>
         The array reduce was called upon.
         
<b>initialValue</b>
      Optional. Object to use as the first argument to the first call of the callback.
</pre></blockquote>
<h1>4) 以下代码的运行结果是：</h1>
<pre><code>
var name = 'World';
(function(){
    if(typeof name === 'undefined'){
      var name = "Jack";
      console.info('Goodbye '+ name);
    }else{
      console.info('Hello ' + name);
    }
})();
</code></pre>
<pre>
A.Goodbye Jack
B.Hello Jack
C.Goodbye undefined
D.Hello undefined
</pre>
<h2>分析</h2>
<p>A</p>
<p>js函数内有个叫做【声明提前】的东西。故选A。</p>
<h1>5) 以下代码的运行结果是：</h1>
<pre><code>
var arr = [0,1,2];
arr[10] = 10;
arr.filter(function(x){return x === undefined});
</code></pre>
<pre><code>
A.[undefined x 7]
B.[0,1,2,10]
C.[]
D.[undefined]
</code></pre>
<h2>分析</h2>
<p>C</p>
<p>filter会接触到没有被赋值的元素，即在arr中，长度为10但实际数值元素列表为[0, 1, 2, 10]，因此，最终返回一个空的数组[]</p>
<h3>又有机会解释js函数了哈<code><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter" target="_blank">arr.filter(callback[, thisArg])</a></code></h3>
国际惯例，官方解释：
<pre><blockquote>
<b>Parameters</b>

    callback
        Function to test each element of the array. Invoked with arguments (element, index, array).
        Return true to keep the element, false otherwise.
    thisArg
        Optional. Value to use as this when executing callback.
</blockquote></pre>
<p>简单的来。就是filter返回arr中callback(value)结果为true的值。over</p>

<h1>6)  以下代码运行结果是：</h1>
<pre><code>
var two = 0.2;
var one = 0.1;
var eight = 0.8;
var six = 0.6;
[two -one == one,eight- six == two];
</code></pre>
<pre>
A.[true,true]
B.[false,false]
C.[true,false]
D.其他
</pre>
<h2>分析</h2>
<p>C</p>
<p>两个浮点数相加或者相减，将会导致一定的正常的数据转换造成的精度丢失问题eight-six = 0.20000000000000007。
JavaScript中的小数采用的是双精度(64位)表示的，由三部分组成：　符 + 阶码 + 尾数，在十进制中的 1/10，在十进制中可以简单写为 0.1 ，但在二进制中，他得写成：0.0001100110011001100110011001100110011001100110011001…..（后面全是 1001 循环）。因为浮点数只有52位有效数字，从第53位开始，就舍入了。这样就造成了“浮点数精度损失”问题。</p><p>
更严谨的做法是(eight-six ).totoFiexd(1)或者用用Math.round方法回归整数运算。判断两个浮点数是否相等，还是建议用逼近的比较，比如if((a-b) < 1E-10)</p>
<p>值得注意的是，0.2-0.1却是==0.1的。</p>

<h1>7)  以下代码运行的结果是：</h1>
<pre><code>
function showCase(value){
      switch(value){
           case 'A':
                 console.info('Case A');
                 break;
            case 'B':
                 console.info('Case B');
                 break;
            case undefined :
                 console.info('undefined');
                 break;
            default:
                 console.info('Do not know!');
     }
}
showCase(new String('A'));
</code></pre>
<pre>
A.Case A
B.Case B
C.Do not know
D.undefined
</pre>
<h2>分析</h2>
<p style="color: #f1f1f1">C</p>
<p>使用new String()使用构造函数调用讲一个全新的对象作为this变量的值，并且隐式返回这个新对象作为调用的结果，因此showCase()接收的参数为String {0: "A"}为不是我们所认为的“A”</p>
但是，其实显然，此时的new String('A') == 'A';虽然new出来的是个String对象。
<pre>
var a = new String('A');
                    //->a == String {0: "A", length: 1, [[PrimitiveValue]]: "A"}
a == 'A';       //-> true
</pre>
<p>从上面我们可以知道，即使把题中的<code>showCase(new String('A'));</code>改为<code>var a = new String('A');showCase(a);</code>，它传进去的依然是个<code>String{0:'A'...}</code>对象。结果依然是C。</p>

<h1>8) 以下表达式的运行结果是：</h1>
<pre><code>
Array.isArray(Array.prototype)
</code></pre>
<pre>
A.true
B.false
C.报错
D.其他
</pre>
<h2>分析</h2>
<p>A</p>
<p>
Array.prototype为[]，Array.isArray(a)是一个判断a是否为数组的方法。
判断对象是否为数组的方法：</p><ul><li>
1）ES5函数isArray(),该函数测试对象的内部[[Class]]属性是否为Array:
<code>Arrray.isArray(a);</code></li><li>
2）判断对象的构造函数是否为Array:
<code>a.constructor === Array</code></li><li>
3）使用对象内部[[Class]]属性创建结果字符串：
<code>Object.prototype.toString.call(a)</code></li><li>
4）使用instanceof操作符测试对象是否继承自Array：
（但由于，一个页面的iframe不会继承自另外一个页面的iframe，该方法不可靠）
<code>a instanceof Array</code></li></ul>

<h1>9)  [] == [] 的运行结果是：</h1>
<pre>
A.true
B.false
C.报错
D.其他
</pre>
<h2>分析</h2>
<p>B</p>
<p>数组，在 Javascript 中是对象，<b>对象使用 == 比较都是比较的引用</b>。简单的说，就是，如果是同一个对象，就相等，如果不是同一个对象，就不等。每次使用 [] 都是新建一个数组对象，所以 [] == [] 这个语句里建了两个数据对象，它们不等。</p>
<h3>那么问题来了，如何判断两个数组相等呢？</h3>
<p>lodash中用<a href="https://lodash.com/docs#isEqual" target="_blank">_.isEqual(value, other, [customizer], [thisArg])</a>来比较即可。</p>

<h1>10) <code>[3.toString(),3..toString(),3...toString()]</code>的运行结果是：</h1>
<pre>
A.["3",error,error]
B.["3","3.0",error]
C.[error,"3",error]
D.其他
</pre>
<h2>分析</h2>
<p>C</p>
<p>Number中的<code>toString(a)</code>能够将数值转化成为a进制的值。但a缺省时，默认转化为十进制,一般使用方法为：
<pre><code>
var n = 3;
n.toString();
</code></pre>
执行<code>3.toString()</code>，因为3只是为数值型变量，为非Number实例，因此对于3不能直接调用Number方法。而执行<code>3..toString()</code>，会强制将3转化为数字实例，因此能够被解释，输出'3'，同样可以使用<code>(3).toString()</code>。</p>
<h1>11) 列举IE和FF脚本兼容性的问题:</h1>
<h2>分析</h2>
<p>列举IE和FF脚本兼容性的问题</p>
<ul>
<li>（1）window.event
表示当前的事件对象，IE有这个对象，FF没有</li>
<li>（2）获取事件源
IE用srcElement获取事件源，而FF用target获取事件源</li>
<li>（3）添加、移除事件
<pre>
         IE：element.attachEvent("onclick",function)
             element.detachEvent("onclick",function)
         FF: element.addEventListener("click",function,true)
             element.removeEventListener("click",function,true)
</pre></li>
</ul>

<h1>11) 以下函数有什么问题？如何改进？</h1>
<pre>
    <code>
        function initButtons(){
            var body = document.body,button,i;
            for(i =0;i<5;i++){
                button = document.createElement("button");
                button.innerHTML = "Button" + i;
                button.addEventListener("click",function(e){
                    alert(i);
                },false);
                body.appendChild(button);
            }
        }
        initButtons();
    </code>
</pre>
<h2>分析</h2>
<p>题目所给出的代码，除了有addEventListener不兼容IE浏览器的问题之外，最突出的一个问题是：</p>
<p>虽然在页面上会显示值为button+i的按钮，但是点击任意一个按钮，最终都会显示5。
    要想点击相关按钮，弹出相应的1，2，3，4，5的值，需要理解闭包原理实现和使用立即回调函数。修改后的代码如下：</p>
<pre><code>
    function initButtons(){
        var body = document.body,button,i;
        for(i =0;i<5;i++){
            (function(i){
                button = document.createElement("button");
                button.innerHTML = "Button" + i;
                button.addEventListener("click",function(e){
                    alert(i);
                },false);
                body.appendChild(button);
            })(i);
        }
    }
    initButtons();
</code></pre>
<p>涉及绑定和赋值得到区别。在运行时，进入一个作用域，javascript会为每一个绑定到该作用域的变量在内存中分配一个“槽”（slot）。
    函数中，创建变量document.body,button,i，因此当函数体（创建按钮，并为按钮绑定事件）被调用时，函数会为每个变量分配一个“槽”。
    在循环的每次迭代中，循环体都会为嵌套函数分配一个闭包。我们可能理解为，该函数存储的是嵌套函数创建时变量i的值。
    但事实上，他存储的是i的引用。由于每次函数创建后变量i的值都发生变化，因此函数内部最终看到的是变量i的引用。闭包存储的是外部变量的引用而非值。
    立即调用的函数表达式，是一种不可或缺的解决javascript缺少块级作用域的方法。</p>
<p>如此这样，我们就要来说一下js中的闭包了啊。</p>
<h3>闭包</h3>
<p>鉴于这个篇幅可能有点长，放另外一个<a href="https://github.com/skyFi/jsNode/blob/master/closures.md" target="_blank">Closures</a>文件中。</p>
<h1>12) 写一段代码，判断一个字符串中出现次数最多的字符，并统计出现的次数。</h1>
<h2>分析</h2>
<pre><code>
    /*写一段代码。判断一个字符串中出现次数最多的字符串，并统计出现的次数*/

    //常规方法
    function toGetTheMostCharsByArray(s){
        var r={};
        for(var i=0;i< s.length;i++){

            if(!r[s[i]]){
                r[s[i]] = 1;
            }else{
                r[s[i]]++;
            }
        }
        var max = {
            "value": s[0],
            "num": r[s[0]]
        };

        for(var n in r){
            if(r[n]>max.num){
                max.num = r[n];
                max.value = n;
            }
        }
        return max;
    }
    //使用正则方法
    function toGetTheMostCharsByRegex(s){
        var a = s.split('');
        a.sort();
        s = a.join('');
        var regex = /(\w)\1+/g ; // \1+代表重复的
        var max = {
            "value"　:s[0],
            "num" :  0
        };

        s.replace(regex,function(a,b){//a是重复的string:eg:'aaa',b是重复的字母char:eg:'a';
            if(max.num < a.length){
                max.num = a.length;
                max.value= b;
            }
        });
        return max;
    }
    var test = "efdfssssfrhth";
    console.info("使用常规方法，出现最多的字符串为："+toGetTheMostCharsByArray(test).value+" ，出现次数："+toGetTheMostCharsByArray(test).num);
    console.info("使用字符串匹配，出现最多的字符串为："+toGetTheMostCharsByRegex(test).value+" ，出现次数："+toGetTheMostCharsByRegex(test).num);
</code></pre>
<p>注意这里的正则判断重复字母，先留个位置为介绍正则......</p>
<h1>13) 请问一下两段代码有什么不同？</h1>
<pre><code>
    //1.
    setTimeout(function(){
        /*代码块*/
        setTimeout(arguments.callee,10);
    },10);

    //2.
    setInterval(function(){
        /*代码块*/
    },10);
</code></pre>
<h2>分析</h2>
<p>javascript的引擎是单线程的</p>
<p>javascript的引擎是基于事件驱动的</p>
<p>setTimeout和setInterval都是往事件队列中增加一个待处理时间而已，setTimeout只触发一次，而setInterval是循环触发</p>
<pre><code>
    setTimeout(function(){
        //代码块
        setTimeout(arguments.callee,10);
    },10);
    //上段代码可使得setTimeout循环触发。但是，执行完这段代码块才挂起时间，所以两次执行时间会大于10ms

    setInterval(function(){
     /*代码块*/
    },10);
    //而上段代码，是自动在10ms的时候挂上这个事件，所以两次事件的相隔会小于等于10ms。
</code></pre>
<p>当线程阻塞在一个事件的时候，不管是使用setInterval还是setTimeout都需要等待当前事件处理完才能执行。</p>
<p>由这个问题，我们引入下面这个话题：</p>
<p><a href="console.md" target="_blank">使用console进行<b>性能测试</b>和<b>计算代码运行时间</b></a></p>
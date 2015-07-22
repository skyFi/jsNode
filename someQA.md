
<h1>1)  ["1","2","3"].map(parseInt);的运行结果是？</h1>
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
<p>一个意外：当<code>radix</code>取值为0的时候，相当于默认的parseInt(string)而没有<code>radix</code>。eg:</p>
<pre><code>
parseInt(1,0);//相当于parseInt(1); ->1
parseInt(0123,0);//相当于parseInt(0123); ->83
</code>
</pre>
<h1>2)  [typeof null, null instanceof Object]的运行结果是？</h1>
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
<blockquote>
<b>Parameters</b>

callback
Function to execute on each value in the array, taking four arguments:
previousValue
The value previously returned in the last invocation of the callback, or initialValue, if supplied. (See below.)
currentValue
The current element being processed in the array.
index
The index of the current element being processed in the array.
array
The array reduce was called upon.
initialValue
Optional. Object to use as the first argument to the first call of the callback.
</blockquote>

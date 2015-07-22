
<h1>1)  ["1","2","3"].map(parseInt);的运行结果是？</h1>
<pre>A.["1","2","3"]
B.[1,2,3]
C.[0,1,2]
D.其他</pre>.
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
H3><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt" target="_blank">parseInt()</a>:</h3>
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
<h1>2)  </h1>

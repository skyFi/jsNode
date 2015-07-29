###1.利用toString()里面的参数，实现各进制之间的快速转换：
<pre><code>
var n = 17;
binary_string = n.toString(2);
//->二进制"10001"
octal_tring = n.toString(8);
//->八进制"021"
hex_string = n.toString(16);
//->十六进制"0x11"</code>
</pre>
###2.parseInt()可以接受第二个可选参数，这个参数是指定数字转换的基数，合法的取值范围是2~36.（进制）
<pre>
<code>
parseInt('11', 2); //->3 (1*2 + 1)
parseInt('ff', 16); //->255 (15*16 + 15)
parseInt('zz', 36); //->1295 (35*36 + 35)
parseInt('077', 8); //->63 (7*8 + 7)
parseInt('077', 10); //->77 (7*10 +7)
</code>
</pre>
###3.申明提前（预编译时进行的）：即JavaScript函数里声明的所有变量（但不涉及赋值）都被‘提前’至函数体的顶部。
#####在函数体内的局部变量覆盖了同名的全局变量。（JavaScript没有块级作用域）
###4.当使用var声明一个变量的时候，这个变量是不可配置的，也就是说这个变量无法通过delete运算符进行删除操作。
###5.一元加法（+）和一元减法（-）
#####一元加法（+）：一元加法操作符把操作数转换为数字或者NaN，并返回这个转换后的数字。如果操作数本身就是个数字，则直接返回这个数字。（可用来简单的把‘数字字符串’转换为数字）
#####一元减法（-）：当‘-’用作一元运算符的时候，它会根据需要把操作数转换为数字，然后改变运算结果的符号。
###6.NaN和任何值都不想等，包括它本身。
#####通过X!===X来判断X是否为NaN，只有在X为NaN的时候这个表达式的结果才为true.(用isNaN()来判断一个变量是否为NaN)
###7.Infinity (无限大)、-Infinity (无限小)
###8.JavaScript实现的几种排序算法。
####1>快速排序算法：
<pre><code>
/*快速排序法*/
        function quickSort(a) {
                if (a.length <= 1) {
                        return a;
                }
                var midLength = Math.floor(a.length / 2);
                var midValue = a.splice(midLength,1);
                var left = [];
                var right = [];
                for (var i = 0; i < a.length; i++) {
                        if (a[i] < midValue) {
                                left.push(a[i]);
                        } else {
                                right.push(a[i]);
                        }
                }
                return quickSort(left).concat(midValue,quickSort(right));
        }
        console.log(quickSort([1,5,3,6,2,4,0]));
</code></pre>
####2>冒泡排序算法：
<pre><code>
/*冒泡排序法*/
        function bubbleSort(a) {
                var length = a.length;
                var sortArray;
                for (var i = 0; i < length-1; i++) {
                        for (var j = 0; j < length-i-1 ; j++) {
                                if (a[j] > a[j+1]) {
                                        sortArray = a[j];
                                        a[j] = a[j+1];
                                        a[j+1] = sortArray;
                                }
                        }
                }
                return a;
        }
        console.log(bubbleSort([2,1,3,6,5,4,7,0]));
</code></pre>
####3>插入排序算法：
<pre><code>
/*插入排序法*/
        function insertSort(a) {
                var length = a.length;
                var sortArray;
                for (var i = 1; i < length; i++) {
                        for (var j = 0; j < i ; j++) {
                                if (a[i] < a[j]) {
                                        sortArray = a[i];
                                        a[i] = a[j];
                                        a[j] = sortArray;
                                }
                        }
                }
                return a;
        }
        console.log(insertSort([0,6,5,3,4,2,1,7]));
</code></pre>
####4>选择排序算法：
<pre><code>
/*选择排序法*/
        function selectSort(a) {
                for (var i = 0; i < a.length; i++) {
                        var min = a[i];
                        var k = i;
                        for (var j = i + 1; j < a.length; j++) {
                                if (min > a[j]) {
                                        min = a[j];
                                        k = j;
                                }
                        }
                        a[k] = a[i];
                        a[i] = min;
                }
                return a;
        }
        console.log(selectSort([5,1,4,0,3,2,7,6]));
</code></pre>
<h2>9) 不要在循环内部使用try-catch-finally</h2>
<p>try-catch-finally中catch部分在执行时会将异常赋给一个变量，这个变量会被构建成一个运行时作用域内的新的变量。</p>
<p>切忌：</p>
<pre><code>
    var object = ['foo', 'bar'], i;
    for (i = 0, len = object.length; i < len; i++) {
        try {
            // do something that throws an exception
        }
        catch (e) {
            // handle exception
        }
    }
</code></pre>
<p>而应该：</p>
<pre><code>
    var object = ['foo', 'bar'], i;
    try {
        for (i = 0, len = object.length; i <len; i++) {
            // do something that throws an exception
        }
    }
    catch (e) {
        // handle exception
    }
</code></pre>
<h2>10) 使用XMLHttpRequests时注意设置超时</h2>
<p>XMLHttpRequests在执行时，当长时间没有响应（如出现网络问题等）时，应该中止掉连接，可以通过setTimeout()来完成这个工作：</p>
<pre><code>
    var xhr = new XMLHttpRequest ();
    xhr.onreadystatechange = function () {
        if (this.readyState == 4) {
            clearTimeout(timeout);
            // do something with response data
        }
    }
    var timeout = setTimeout( function () {
        xhr.abort(); // call error callback
    }, 60*1000 /* timeout after a minute */ );
    xhr.open('GET', url, true);
    xhr.send();
</code></pre>
<p>同时需要注意的是，不要同时发起多个XMLHttpRequests请求。</p>
<h2>11) 处理WebSocket的超时</h2>
<p>通常情况下，WebSocket连接创建后，如果30秒内没有任何活动，服务器端会对连接进行超时处理，防火墙也可以对单位周期没有活动的连接进行超时处理。</p>
<p>为了防止这种情况的发生，可以每隔一定时间，往服务器发送一条空的消息。可以通过下面这两个函数来实现这个需求，一个用于使连接保持活动状态，另一个专门用于结束这个状态。</p>
<pre><code>
    var timerId = 0;
    function keepAlive() {
        var timeout = 15000;
        if (webSocket.readyState == webSocket.OPEN) {
            webSocket.send('');
        }
        timerId = setTimeout(keepAlive, timeout);
    }
    function cancelKeepAlive() {
        if (timerId) {
            cancelTimeout(timerId);
        }
    }
</code></pre>
<p>keepAlive()函数可以放在WebSocket连接的onOpen()方法的最后面，cancelKeepAlive()放在onClose()方法的最末尾。</p>
<h2>12) 注意原始操作符比函数调用快</h2>
<p>比如，一般不要这样：</p>
<pre><code>
    var min = Math.min(a,b);
    A.push(min);
</code></pre>
<p>可以这样来代替：</p>
<pre><code>
    var min = a < b ? a : b;
    A[A.length] = min;
</code></pre>


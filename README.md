# jsNode
## javaScript(动态语言) Node

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
###9.一些小问题：
####1)["1","2","3"].map(parseInt);的运行结果是？
A.["1","2","3"]
B.[1,2,3]
C.[0,1,2]
D.其他
#####分析：
D
map对数组的每个元素调用定义的回调函数并返回包含结果的数组。["1","2","3"].map(parseInt)对于数组中每个元素调用paresInt。但是该题目不同于：<pre>
function testFuc(a){
        return parseInt(a);
}
console.info(["1","2","3"].map(testFuc));</pre>
题目等同于：
<pre>function testFuc(a,x){
        return parseInt(a,x);
}
console.info(["1","2","3"].map(testFuc));</pre>
map中回调函数的语法如下所示：function callbackfn(value, index, array1)，可使用最多三个参数来声明回调函数。第一参数value，数组元素的值；第二个参数index，数组元素的数组所以；array1，包含该元素的数组对象。
因此，题目等同于[parseInt(1,0),parseInt(2,1),parseInt(3,2)]
最终返回[1, NaN, NaN]




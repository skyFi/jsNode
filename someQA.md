
###1)  ["1","2","3"].map(parseInt);的运行结果是？
<pre>A.["1","2","3"]
B.[1,2,3]
C.[0,1,2]
D.其他</pre>
####分析：
<b style="color:red;">D</b>
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

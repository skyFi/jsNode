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
###7.Infinity (无限大)、-Infinity (无线小)
###8.


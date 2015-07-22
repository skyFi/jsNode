# jsNode
## javaScript Node

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

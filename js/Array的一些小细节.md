<h1>Array的一些小细节</h1>
<p>在看到权威指南中对数组的介绍中，发现了一些小细节，整理下来，便是这边文章了。</p>
<h2>引入</h2>
<p>先来个小问题：</p>
<pre><code>
    [,,].length
</code></pre>
<p>这行代码的结果是什么，对，答案是2.</p>
<strong>这是因为，再数组直接量的语法中，是允许有可选的结尾的逗号的，故[,,]只有两个元素而非三个。</strong>
<p>在我们对数组进行增删改查的过程，是不是有种感觉，这和对对象的操作是如此的类似，请记住，在js中，数组是对象的特殊形式。</p>
<p>其实，之前的文章里，我也提到过，js中，一切皆对象。</p>
<strong>稀疏数组的length是大于实际元素个数的。（为最大索引+1）</strong>
<p>如果一不小心对数组用了for in 循环，或者你特别喜欢for in呢，咋办</p>
<p>for in循环能够枚举继承的属性名，如添加到Array.prototype中的方法，其实，由于这个原因，再数组上不应该使用for in循环，除非使用额外的检测方法来过滤不想要的属性</p>
<p>如下</p>
<pre><code>
    for(var i in a){
        if (!a.hasOwnProperty(i)) continue; //跳过继承的属性
        //循环体
    }
</code></pre>
<pre><code>
    for(var i in a) {
        //跳过不是非负整数的i
        if (String(Math.floor(Math.abs(Number(i)))) !== i) continue;
    }
</code></pre>
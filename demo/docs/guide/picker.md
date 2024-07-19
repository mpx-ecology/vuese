
## Props

<!-- @vuese:[name]:props:start -->
|参数|说明|类型|可选值|默认值|
|---|---|---|---|---|
|delay||`Number`|-|<pre v-pre class="language-typescript inside-td"><code><span class="hljs-number">15</span></code></pre>|
|min||`Number`|-|<pre v-pre class="language-typescript inside-td"><code><span class="hljs-title class_">Date</span>.<span class="hljs-title function_">now</span>()</code></pre>|
|max||`Number`|-|<pre v-pre class="language-typescript inside-td"><code><span class="hljs-number">0</span></code></pre>|
|now||`Number`|-|<pre v-pre class="language-typescript inside-td"><code><span class="hljs-title class_">Date</span>.<span class="hljs-title function_">now</span>()</code></pre>|
|day||`Object`|-|<pre v-pre class="language-typescript inside-td"><code>{<br>  <span class="hljs-string">&quot;len&quot;</span>: <span class="hljs-number">3</span>,<br>  <span class="hljs-string">&quot;filter&quot;</span>: [<br>    <span class="hljs-string">&quot;今天&quot;</span>,<br>    <span class="hljs-string">&quot;明天&quot;</span>,<br>    <span class="hljs-string">&quot;后天&quot;</span><br>  ],<br>  <span class="hljs-string">&quot;format&quot;</span>: <span class="hljs-string">&quot;&quot;</span><br>}</code></pre>|
|showNow||`String`|-|-|
|minuteStep||`Number`|-|<pre v-pre class="language-typescript inside-td"><code><span class="hljs-number">10</span></code></pre>|
|start||`String`|-|<pre v-pre class="language-typescript inside-td"><code>{<br>  <span class="hljs-string">&quot;9&quot;</span>: <span class="hljs-number">30</span><br>}</code></pre>|
|end||`String`|-|<pre v-pre class="language-typescript inside-td"><code>{<br>  <span class="hljs-string">&quot;18&quot;</span>: <span class="hljs-number">0</span><br>}</code></pre>|
|startSecond||`String`|-|-|
|endSecond||`String`|-|-|
|selectedIndex||`Array`|-|<pre v-pre class="language-typescript inside-td"><code>[<span class="hljs-number">0</span>, <span class="hljs-number">0</span>, <span class="hljs-number">0</span>]</code></pre>|
|selectedTime||`Number`|-|<pre v-pre class="language-typescript inside-td"><code><span class="hljs-number">0</span></code></pre>|
|themeType||`String`|-|<pre v-pre class="language-typescript inside-td"><code>dd</code></pre>|
|weekCfg||`Array`|-|<pre v-pre class="language-typescript inside-td"><code>[<span class="hljs-string">&#x27;周日&#x27;</span>, <span class="hljs-string">&#x27;周一&#x27;</span>, <span class="hljs-string">&#x27;周二&#x27;</span>, <span class="hljs-string">&#x27;周三&#x27;</span>, <span class="hljs-string">&#x27;周四&#x27;</span>, <span class="hljs-string">&#x27;周五&#x27;</span>, <span class="hljs-string">&#x27;周六&#x27;</span>]</code></pre>|
|immediateChange||`Boolean`|-|-|

<!-- @vuese:[name]:props:end -->


## Events

<!-- @vuese:[name]:events:start -->
|事件名|说明|参数|
|---|---|---|
|pickstart|-|-|
|pickend|-|-|
|change|-|-|
|columnChange|-|-|

<!-- @vuese:[name]:events:end -->



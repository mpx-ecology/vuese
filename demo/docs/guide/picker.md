## Props

<!-- @vuese:[name]:props:start -->
|参数|说明|类型|可选值|默认值|
|---|---|---|---|---|
|delay||`Number`|-|<pre v-pre class="language-typescript inside-td"><code><span class="hljs-number">15</span></code></pre>|
|day||`Object`|-|<pre v-pre class="language-typescript inside-td"><code>{<br>  <span class="hljs-string">&quot;len&quot;</span>: <span class="hljs-number">3</span>,<br>  <span class="hljs-string">&quot;filter&quot;</span>: [<br>    <span class="hljs-string">&quot;今日&quot;</span><br>  ],<br>  <span class="hljs-string">&quot;format&quot;</span>: <span class="hljs-string">&quot;M月D日&quot;</span><br>}</code></pre>|
|showNow||`Boolean`|-|<pre v-pre class="language-typescript inside-td"><code><span class="hljs-literal">true</span></code></pre>|
|minuteStep||`Number`|-|<pre v-pre class="language-typescript inside-td"><code><span class="hljs-number">10</span></code></pre>|
|hourSpan||`Array`|-|<pre v-pre class="language-typescript inside-td"><code>[<span class="hljs-number">0</span>, <span class="hljs-number">24</span>]</code></pre>|
|timezone|时区，北京为8|`Number`|-|<pre v-pre class="language-typescript inside-td"><code><span class="hljs-number">8</span></code></pre>|
|useTimezone||`Boolean`|-|<pre v-pre class="language-typescript inside-td"><code><span class="hljs-literal">false</span></code></pre>|

<!-- @vuese:[name]:props:end -->


## Events

<!-- @vuese:[name]:events:start -->
|事件名|说明|参数|
|---|---|---|
|change|-|-|

<!-- @vuese:[name]:events:end -->


## Slots

<!-- @vuese:[name]:slots:start -->
|插槽名|说明|
|---|---|
|header|-|

<!-- @vuese:[name]:slots:end -->



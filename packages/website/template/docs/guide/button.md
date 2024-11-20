## Cube-Button 按钮

<card>

### 介绍

操作按钮，提供了不同的样式、状态以及小程序的按钮功能，常用于触发一个点击操作。

</card>

## 示例

<card>

### 样式

除了默认样式外，可以通过设置 `primary`、`bolder` 、`outline`、`inline`、<!-- @theme: passenger -> start -->`light`<!-- @theme: passenger -> end -->属性来改变按钮的样子，也可以组合多重属性呈现不同的效果。


<collapse-wrapper>

```vue
<cube-button>默认按钮</cube-button>

<cube-button primary>主要按钮</cube-button>
<cube-button bolder>粗体文字</cube-button>
<cube-button outline>细框按钮</cube-button>
<cube-button inline>内联按钮</cube-button>
<cube-button light>明亮按钮</cube-button>
<cube-button outline primary>outline - primary</cube-button>
<cube-button inline outline>inline - outline</cube-button>
<cube-button inline primary>inline - primary</cube-button>
<cube-button active>激活态1234</cube-button>
<cube-button>
  <div>12345hhhh</div>
</cube-button>
<div>1234</div>
```

</collapse-wrapper>


</card>

## Props

<!-- @vuese:[name]:props:start -->
|参数|说明|类型|可选值|默认值|
|---|---|---|---|---|
|active|激活状态|`Boolean`|true/false|<pre v-pre class="language-typescript inside-td"><code><span class="hljs-literal">false</span></code></pre>|
|disabled|禁用状态|`Boolean`|true/false|<pre v-pre class="language-typescript inside-td"><code><span class="hljs-literal">false</span></code></pre>|
|loading|加载状态|`Boolean`|true/false|<pre v-pre class="language-typescript inside-td"><code><span class="hljs-literal">false</span></code></pre>|
|primary|主要的|`Boolean`|true/false|<pre v-pre class="language-typescript inside-td"><code><span class="hljs-literal">false</span></code></pre>|
|outline|外边框|`Boolean`|true/false|<pre v-pre class="language-typescript inside-td"><code><span class="hljs-literal">false</span></code></pre>|
|light|轻按钮|`Boolean`|true/false|<pre v-pre class="language-typescript inside-td"><code><span class="hljs-literal">false</span></code></pre>|
|inline|是否内联|`Boolean`|true/false|<pre v-pre class="language-typescript inside-td"><code><span class="hljs-literal">false</span></code></pre>|
|icon|图标 Icon，参阅[内置 Icon](https://www.mpxjs.cn/mpx-cube-ui/demo-theme-default/index.html#/pages/icon/index)|`String`|-|-|
|iconSize|图标尺寸大小|`Number`|-|-|
|tip|辅助文案|`String`|-|-|
|bolder|文本粗体|`Boolean`|-|<pre v-pre class="language-typescript inside-td"><code><span class="hljs-literal">false</span></code></pre>|
|openType|微信相关的属性，具体参阅微信[Button文档](https://developers.weixin.qq.com/miniprogram/dev/component/button.html)和支付宝[Button文档](https://opendocs.alipay.com/mini/component/button)|`String`|-|-|
|appParameter|打开 APP 时，向 APP 传递的参数，open-type=launchApp时有效|`String`|-|-|
|lang|小程序语言|`String`|-|<pre v-pre class="language-typescript inside-td"><code>zh_CN</code></pre>|
|sessionFrom|会话来源，open-type="contact"时有效|`String`|-|-|
|sendMessageTitle|当前标题|`String`|-|-|
|sendMessagePath|当前分享路径|`String`|-|-|
|sendMessageImg|截图|`String`|-|-|
|showMessageCard|微信小程序客服会话卡片|`Boolean`|-|<pre v-pre class="language-typescript inside-td"><code><span class="hljs-literal">false</span></code></pre>|
|formType|用于 form 组件|`String`|-|-|
|scope|支付宝小程序中当 open-type 为 getAuthorize 时有效|`String`|phoneNumber/userInfo|-|
|publicId|支付宝生活号 id，必须是当前小程序同主体且已关联的生活号，open-type="lifestyle" 时有效|`String`|-|-|
|styleConfig|通过 wx:style透传样式|`Object`|styleConfig.btn 用于透传给组件最外层 / styleConfig.content 用于透传给组件内容区域|<pre v-pre class="language-typescript inside-td"><code>{}</code></pre>|

<!-- @vuese:[name]:props:end -->


## Events

<!-- @vuese:[name]:events:start -->
|事件名|说明|参数|
|---|---|---|
|error|报错后触发|-|
|openSetting|打开授权设置页后触发|CustomEvent|
|chooseAvatar|微信小程序获取用户头像后触发|CustomEvent ttt|
|contact|打开客服会话后触发|CustomEvent|
|launchApp|打开 APP 成功后触发|CustomEvent|
|getPhoneNumber|-|-|

<!-- @vuese:[name]:events:end -->


## Slots

<!-- @vuese:[name]:slots:start -->
|插槽名|说明|
|---|---|
|— (默认插槽)|默认插槽 11|

<!-- @vuese:[name]:slots:end -->


## Methods

<!-- @vuese:[name]:methods:start -->
|组件实例方法|说明|参数 1|参数 2|返回值|
|---|---|---|---|---|
|testApi|更新 picker 的数据及选中值|list 为每一列的数据|index 为每一列的数据选中的索引|分别表示被选中的索引、文案、值。|

<!-- @vuese:[name]:methods:end -->



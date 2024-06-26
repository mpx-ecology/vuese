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
```

</collapse-wrapper>


</card>

<card>

### 状态

除了默认的正常状态，还可以设置激活、禁用<!-- @theme: passenger -> start -->以及加载中<!-- @theme: passenger -> end -->等状态。


<collapse-wrapper>

```vue
<cube-button active>激活态</cube-button>
  <cube-button>
    <div>12345hhhh</div>
  </cube-button>
<cube-button disabled>置灰态</cube-button>
```

</collapse-wrapper>


<!-- @theme: passenger -> start -->
<collapse-wrapper>

```vue
<template>
  <cube-button
    outline
    loading="{{ loading }}"
    bind:click="clickBtn"
  >加载按钮</cube-button>
</template>

<script>
import { createComponent } from '@mpxjs/core'

createComponent({
  data: {
    loading: false
  },
  methods: {
    clickBtn(index) {
      if (this.loading) {
        return
      }
      this.loading = true
      setTimeout(() => {
        this.loading = false
      }, 5000)
    }
  }
})
</script>
```

</collapse-wrapper>
<!-- @theme: passenger -> end -->

</card>

<card>

### 图标<!-- @theme: passenger -> start -->、辅助文案<!-- @theme: passenger -> end -->

可以设置 Icon 的 class，具体可以查看Icon demo。

<!-- @theme: passenger -> start -->可以设置 Tip 属性添加辅助文案。<!-- @theme: passenger -> end -->

- With Icon 按钮

<collapse-wrapper>

```vue
<cube-button primary icon="like">图标按钮</cube-button>
```

</collapse-wrapper>


<!-- @theme: passenger -> start -->
- With Tip 按钮

<collapse-wrapper>

```vue
<cube-button
  class="mt10"
  icon="like"
  tip="辅助文案"
  primary
  outline
>主要文案</cube-button>
```

</collapse-wrapper>

<!-- @theme: passenger -> end -->

</card>

<card>

### 功能

可以通过设置 `openType`、`formType` 等属性，使用小程序的功能并绑定回调。详情参阅[微信 Button 文档](https://developers.weixin.qq.com/miniprogram/dev/component/button.html)以及[支付宝 Button 文档](https://opendocs.alipay.com/mini/component/button)。使用方式如：

- 分享（微信、支付宝）

<collapse-wrapper>

```vue
<cube-button
  primary
  open-type="share"
  tip="需在小程序环境下预览"
>分享</cube-button>
```

</collapse-wrapper>


- 获取用户手机号（微信、支付宝）

  微信设置 `open-type` 为 `getPhoneNumber`；支付宝设置 ` open-type` 为 `getAuthorize`，设置 `scope` 为 `phoneNumber`。

  由于涉及用户隐私，手机号的获取需要满足一定的条件，详情参见[微信小程序获取手机号](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/getPhoneNumber.html)以及[支付宝小程序获取手机号](https://opendocs.alipay.com/mini/api/getphonenumber)。


<collapse-wrapper>

```vue
<cube-button
  outline
  primary
  open-type@wx="getPhoneNumber"
  open-type@ali="getAuthorize"
  scope="phoneNumber"
  tip="需在小程序环境下预览"
  bind:getPhoneNumber="onGetPhoneNumber"
>获取手机号</cube-button>
```

</collapse-wrapper>


- 获取用户信息（微信、支付宝）

  微信设置 `open-type` 为 `getUserInfo`；支付宝设置 ` open-type` 为 `getAuthorize`，设置 `scope` 为 `userInfo`。

  功能使用有一定的限制，详情参见[支付宝小程序获取基础信息](https://opendocs.alipay.com/mini/api/ch8chh)。


<collapse-wrapper>

```vue
<cube-button
  outline
  open-type@wx="getUserInfo"
  open-type@ali="getAuthorize"
  scope="userInfo"
  tip="需在小程序环境下预览"
  bind:getUserInfo="onGetUserInfo"
>获取用户信息</cube-button>
```

</collapse-wrapper>


- 打开授权设置页面（微信、支付宝）

<collapse-wrapper>

```vue
<cube-button
  open-type="openSetting"
  tip="需在微信小程序环境预览"
  bind:openSetting="onOpenSetting"
>打开授权设置页面</cube-button>
```

</collapse-wrapper>


- 打开客服会话（微信）

<collapse-wrapper>

```vue
<cube-button
  open-type="contact"
  show-message-card="{{ true }}"
  send-message-img="https://dpubstatic.udache.com/static/dpubimg/e7207fae-28de-4b5f-b082-329ff0b01ce0.png"
  send-message-title="点击返回mpx-cube-ui组件库"
  send-message-path="/pages/button/index"
  tip="需在微信小程序环境预览"
>客服会话</cube-button>
```

</collapse-wrapper>


- 获取用户头像（微信）

<collapse-wrapper>

```vue
<cube-button
  open-type="chooseAvatar"
  tip="需在微信小程序环境预览"
  bind:chooseAvatar="onChooseAvatar"
>获取头像</cube-button>
```

</collapse-wrapper>


- 打开 APP（微信）

<collapse-wrapper>

```vue
<cube-button
  open-type="launchApp"
  app-parameter="xxx"
  tip="需在微信小程序环境预览"
  bind:launchApp="onLaunchApp"
>打开 APP</cube-button>
```

</collapse-wrapper>


- 关注生活号（支付宝）

<collapse-wrapper>

```vue
<cube-button
  public-id="xxxxxx"
  open-type="lifestyle"
  tip="需在支付宝小程序环境预览"
  bind:followLifestyle="onFollowLifestyle"
>关注生活号</cube-button>
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
|chooseAvatar|微信小程序获取用户头像后触发|CustomEvent|
|contact|打开客服会话后触发|CustomEvent|
|launchApp|打开 APP 成功后触发|CustomEvent|
|getPhoneNumber|-|-|

<!-- @vuese:[name]:events:end -->


## Slots

<!-- @vuese:[name]:slots:start -->
|插槽名|说明|
|---|---|
|— (默认插槽)|-|

<!-- @vuese:[name]:slots:end -->


## Methods

<!-- @vuese:[name]:methods:start -->
|组件实例方法|说明|参数|返回值|
|---|---|---|---|
|onClick|点击|-|-|
|onGetUserInfo|获取用户信息|-|-|
|onGetPhoneNumber|获取用户手机号|-|-|
|onError|失败回调|-|-|
|onContact|微信小程序打开客服会话|-|-|
|onOpenSetting|微信小程序中在打开授权设置页后回调，open-type="openSetting" 时有效|-|-|
|onLaunchApp|微信小程序打开 APP 成功的回调，open-type=launchApp时有效(参见[微信小程序打开 APP](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/launchApp.html))|-|-|
|onChooseAvatar|微信小程序获取用户头像回调，open-type=chooseAvatar时有效|-|-|
|onFollowLifestyle|支付宝小程序中当 open-type 为 lifestyle 时有效。当点击按钮时触发。|-|-|

<!-- @vuese:[name]:methods:end -->



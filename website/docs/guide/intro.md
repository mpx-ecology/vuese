# 介绍
本项目 fork 自 [vuese](https://vuese.github.io/website/zh/)，用于 [mpx](https://www.mpxjs.cn/) 项目的文档定制化生成。(感谢 [vuese](https://vuese.github.io/website/zh/) 的相关开发者)

## 快速上手

<card>

### 安装

```bash
npm install @mpxjs/vuese-website -g
```

### 项目配置

假设你所在的目录为基于组件库搭建的`example`目录，这个目录主要是为了演示组件库组件的用法，启动后的效果如右边模拟器所示。👉

在`example`目录下新建`website.js`，并写入以下内容：
```javascript
const path = require('path')
const website = require('@mpxjs/vuese-website').default

website({
  srcDirPath: path.resolve(__dirname, '组件库src目录下的components目录'),
  exampleDirPath: path.resolve(__dirname, './pages'),
  outputPath: path.resolve(__dirname, './docs/components'),
  doscPath: path.resolve(__dirname, './docs'),
})

```

其中`组件库src目录下的components目录`结构如下所示：
```plaintext
src/components
├── button
|  ├── index.mpx
|  ├── index.ts
└── button-group
   ├── index.mpx
   └── index.ts
```
`exampleDirPath`中的`pages`目录结构如下所示：
```plaintext
example/pages
├── button
|  ├── README.md
|  ├── btn-bolder.mpx
|  ├── btn-choose-avatar.mpx
|  ├── btn-contact.mpx
|  ├── btn-disabled.mpx
|  ├── btn-follow-lifestyle.mpx
|  ├── btn-get-phone-number.mpx
|  ├── btn-get-user-info.mpx
|  ├── btn-icon.mpx
|  ├── btn-inline-icon.mpx
|  ├── btn-inline-outline.mpx
|  ├── btn-inline-primary.mpx
|  ├── btn-inline.mpx
|  ├── btn-launch-app.mpx
|  ├── btn-light-active.mpx
|  ├── btn-light-disabled.mpx
|  ├── btn-light.mpx
|  ├── btn-loading.mpx
|  ├── btn-open-setting.mpx
|  ├── btn-outline-active.mpx
|  ├── btn-outline-disabled.mpx
|  ├── btn-outline-loading.mpx
|  ├── btn-outline-primary-active.mpx
|  ├── btn-outline-primary-disabled.mpx
|  ├── btn-outline-primary.mpx
|  ├── btn-outline.mpx
|  ├── btn-primary-active.mpx
|  ├── btn-primary-disabled.mpx
|  ├── btn-primary.mpx
|  ├── btn-secondary-active.mpx
|  ├── btn-secondary.mpx
|  ├── btn-share.mpx
|  ├── btn-with-tip.mpx
|  └── index.mpx
├── button-group
|  ├── README.md
|  ├── button-group-one.mpx
|  ├── button-group-two.mpx
|  ├── button-group-vertical-two.mpx
|  ├── button-group-with-context.mpx
|  └── index.mpx
├── index.mpx
└── index.ts
```

### 文档生成

文档由[vitepress](https://vitepress.dev/zh/guide/what-is-vitepress)驱动，需要在`example`目录中安装对应的依赖：
```bash
npm install vitepress@^1.2.3
```

然后在`example`目录下执行以下命令：

```bash
vuese-website
```
即可在项目根目录下生成基础的docs配置：
```plaintext
docs
├── .vitepress
|  ├── config.mjs
|  ├── sidebar
|  |  └── sidebar.js
|  └── theme
|     └── index.mjs
├── components
|  ├── button-group.md
|  └── button.md
├── guide
|  └── intro.md
└── index.md
```

在`example`的`package.json`中添加一条命令：
```diff
+  "serve:doc": "node website.js"
```

然后在目录下执行以下命令即可构建文档。

```bash
npm run serve:doc
```

文档启动后，默认的访问路径为：
```bash
http://localhost:5173/mpx-ui/guide/intro.html
```

### 模拟器

模拟器的默认路由为`http://localhost:8090`，可以通过更改`docs/.vitepress/config.mjs`中的`iframeConfig`来配置预览路径：
```javascript
iframeConfig: {
  path: {
    dev: 'http://localhost:8090',
    prod: '8090'
  }
}
```

**注意：这里的端口要和你的`example`项目`vue.config.js`中配置的端口号一致**
```javascript
devServer: {
  port: 8090
}
```

检查无误后启动example项目即可完成文档中模拟器的展示。

### 父子路由同步

父子路由同步涉及到`iframe`通信，为此我们提供了以下方法来进行路由同步：
```javascript
declare module '@mpxjs/vuese-website/iframe-sync' {
/**
  * 监听子路由的变化
  * @param callback
  * @returns
  */
export const onPathchange: (callback?: (path: string) => void) => () => void;
/**
  * 同步路由到子窗口
  * @param to
  */
export const syncPathToChild: (to: string) => void;
}
```

你需要在项目的`app.ts`中，监听主窗口路由的变化：
```typescript
import mpx, { createApp } from '@mpxjs/core'
import { onPathchange } from '@mpxjs/vuese-website/dist/iframe-sync'

const isIframe = __mpx_mode__ === 'web' && window.parent !== window
if (isIframe) {
  onPathchange((to) => {
    mpx.redirectTo({
      // 这里需要适配你的项目路径
      url: `/pages/${to && to !== 'intro' ? `${to}/` : ''}index`
    })
  })
}
```

同时如果`example`中涉及到路由变化，也需要同步给主窗口：
```typescript
const isIframe = __mpx_mode__ === 'web' && window.parent !== window
if (isIframe) {
  syncPathToChild(componentName)
}
```

### markdown扩展语法
为了完成[文档示例一体化](https://www.mpxjs.cn/mpx-cube-ui/guide/intro.html#%E6%96%87%E6%A1%A3%E7%A4%BA%E4%BE%8B%E4%B8%80%E4%BD%93%E5%8C%96)的目标，我们制定了一些语法来提取模块儿源代码。

假设你的`example`目录有如下结构：
```plaintext
example/pages
├── button
|  ├── README.md
|  ├── btn-icon.mpx
|  ├── btn-inline.mpx
|  ├── btn-light.mpx
|  ├── btn-loading.mpx
|  ├── btn-outline.mpx
|  ├── btn-primary.mpx
|  ├── btn-secondary.mpx
|  └── index.mpx
├── button-group
|  ├── README.md
|  ├── button-group-one.mpx
|  ├── button-group-two.mpx
|  ├── button-group-vertical-two.mpx
|  ├── button-group-with-context.mpx
|  └── index.mpx
├── index.mpx
└── index.ts
```

基本的替换语法如下：

```markdown
<!-- @example: ${README.md同级目录下的文件名称} -->
```


#### 提取文件代码
用于提取目标文件的所有代码

```markdown
<!-- @example: btn-primary -->
```

#### 提取`template`代码
用于提取目标文件中的`template`代码

```markdown
<!-- @example: btn-primary -> template -->
```

#### 提取`script`代码
用于提取目标文件中的`script`代码

```markdown
<!-- @example: btn-primary -> script -->
```

#### 提取`style`代码
用于提取目标文件中的`style`代码

```markdown
<!-- @example: btn-primary -> style -->
```

#### 代码成组
用于把不同文件的代码提取到同一个代码块儿中

```markdown
<!-- @group: group-name -> start -->

<!-- @example: btn-primary -> template no-wrap -->
<!-- @example: btn-secondary -> template no-wrap -->
<!-- @example: btn-light -> template -->

<!-- @group: group-name -> end -->
```

其中`no-wrap`会去掉代码块的包裹，如：

```markdown
<!-- @example: btn-primary -> template no-wrap -->
```

渲染结果如下：

```html
<cube-button primary>主要按钮</cube-button>
```

而去掉`no-wrap`后，则会渲染如下代码：

```html
<template>
  <cube-button primary>主要按钮</cube-button>
</template>
```

这样能够更好的将多个模块儿的代码组织到一起。

</card>

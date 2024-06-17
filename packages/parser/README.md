# `@mpxjs/vuese-parser`

## mixin 逻辑

```typescript
export interface ParserResult {
  props?: PropsResult[]
  events?: EventResult[]
  slots?: SlotResult[]
  mixIns?: MixInResult[]
  methods?: MethodResult[]
  computed?: ComputedResult[]
  data?: DataResult[]
  watch?: WatchResult[]
  name?: string
  componentDesc?: CommentResult
  externalClasses?: ExternalClassesResult[]
}
```

基于 vue2.x mergeOptions 策略

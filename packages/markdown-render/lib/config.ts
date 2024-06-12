export interface HeadOption {
  type: string
  zh: string
  en: string
}
export const propsHeadOptions: HeadOption[] = [
  {
    type: 'name',
    zh: '参数',
    en: 'Name'
  },
  {
    type: 'description',
    zh: '说明',
    en: 'Description'
  },
  {
    type: 'type',
    zh: '类型',
    en: 'Type'
  },
  // {
  //   type: 'required',
  //   zh: '必需值',
  //   en: 'Required'
  // },
  {
    type: 'optional',
    zh: '可选值',
    en: 'Optional'
  },
  {
    type: 'default',
    zh: '默认值',
    en: 'Default'
  },
  {
    type: 'wx',
    zh: '微信',
    en: 'WeChat'
  },
  {
    type: 'web',
    zh: 'web',
    en: 'web'
  },
  {
    type: 'ali',
    zh: '支付宝',
    en: 'Alipay'
  }
]

export const slotsHeadOptions: HeadOption[] = [
  {
    type: 'name',
    zh: '参数',
    en: 'Name'
  },
  {
    type: 'description',
    zh: '参数',
    en: 'Description'
  },
  {
    type: 'default',
    zh: '默认值',
    en: 'Default Slot Content'
  },
]

export const mixinsHeadOptions: HeadOption[] = [
  {
    type: 'name',
    zh: '参数',
    en: 'Name'
  },
]
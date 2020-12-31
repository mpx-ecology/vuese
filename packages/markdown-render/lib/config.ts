export interface PropOption {
  type: string
  zh: string
  en: string
}
export const propsHeadOptions: PropOption[] = [
  {
    type: 'name',
    zh: '参数',
    en: 'Name'
  },
  {
    type: 'wx',
    zh: '微信',
    en: 'WeChat'
  },
  {
    type: 'web',
    zh: 'H5',
    en: 'H5'
  },
  {
    type: 'ali',
    zh: '支付宝',
    en: 'Alipay'
  },
  {
    type: 'describe',
    zh: '说明',
    en: 'Describe'
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
  }
]
import { shallowRef } from 'vue'
import { useQueryForm } from '../src'

interface Query {
  keyword: string
  status: 'all' | 'enabled'
}

const form = useQueryForm<Query>({
  model: shallowRef({
    keyword: '',
    status: 'all',
  }),
  rules: {
    keyword: [{ required: true, message: '请输入关键词' }],
  },
})

form.setField('keyword', 'fizz')
form.setField('status', 'enabled')
form.setRules({
  status: [{ required: true, message: '请选择状态' }],
})

// @ts-expect-error missing is not a key of Query
form.setField('missing', 'value')

// @ts-expect-error status only accepts known values
form.setField('status', 'disabled')

useQueryForm<Query>({
  model: {
    keyword: '',
    status: 'all',
  },
  rules: {
    // @ts-expect-error missing is not a key of Query
    missing: [{ required: true }],
  },
})

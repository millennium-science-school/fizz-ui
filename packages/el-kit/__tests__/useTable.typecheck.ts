import { shallowRef } from 'vue'
import { useTable } from '../src'

interface User {
  name: string
  age: number
}

useTable<User>({
  columns: [
    { prop: 'name', label: '姓名' },
    { prop: 'age', label: '年龄' },
  ],
  data: shallowRef([{ name: 'Tom', age: 18 }]),
})

useTable<User>({
  columns: [
    // @ts-expect-error email is not a key of User
    { prop: 'email', label: '邮箱' },
  ],
  data: shallowRef([{ name: 'Tom', age: 18 }]),
})

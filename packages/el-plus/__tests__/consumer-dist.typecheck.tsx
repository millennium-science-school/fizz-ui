import type { FeButtonProps, FeTableColumnProps } from '@fizz/el-plus'
import {
  FeAlert,
  FeAnchor,
  FeButton,

  FeCheckbox,
  FeConfigProvider,
  FeDialog,
  FeForm,
  FeFormItem,
  FeInput,
  FeOption,
  FeSelect,
  FeTable,
  FeTableColumn,

  FeTag,
  FeTooltip,
} from '@fizz/el-plus'
import '@fizz/el-plus/styles'

import '@fizz/el-plus/styles/scss'

const buttonProps: FeButtonProps = {
  type: 'primary',
}

const invalidButtonProps: FeButtonProps = {
  // @ts-expect-error public props from the dist entry should reject invalid button type
  type: 'not-real',
}

const tableColumnProps: FeTableColumnProps = {
  label: '姓名',
  prop: 'name',
}

const invalidTableColumnProps: FeTableColumnProps = {
  label: '姓名',
  // @ts-expect-error the Fizz-maintained table column facade should reject unknown props
  notReal: true,
}

const consumerUsage = (
  <FeConfigProvider>
    <FeForm model={{ keyword: '' }} inline>
      <FeFormItem label="关键词" prop="keyword">
        <FeInput modelValue="Fizz" />
      </FeFormItem>
    </FeForm>
    <FeSelect modelValue="enabled" placeholder="状态">
      <FeOption label="启用" value="enabled" />
    </FeSelect>
    <FeTable data={[{ name: 'Tom' }]}>
      <FeTableColumn label="姓名" prop="name" />
    </FeTable>
    <FeDialog modelValue={false} title="详情" />
    <FeTooltip content="提示" placement="top">
      <FeButton type="primary">保存</FeButton>
    </FeTooltip>
    <FeAlert title="成功" type="success" />
    <FeTag type="success">完成</FeTag>
    <FeCheckbox modelValue>同意</FeCheckbox>
    <FeAnchor lowFrequencyPassthrough={123} />
  </FeConfigProvider>
)

const invalidConsumerUsage = [
  // @ts-expect-error dist component type should reject invalid select prop
  <FeSelect notReal modelValue="enabled" />,
  // @ts-expect-error dist component type should reject invalid dialog prop
  <FeDialog notReal modelValue={false} />,
  // @ts-expect-error dist component type should reject invalid tooltip placement
  <FeTooltip content="提示" placement="not-real" />,
  // @ts-expect-error dist component type should reject invalid tag type
  <FeTag type="not-real">失败</FeTag>,
]

void buttonProps
void invalidButtonProps
void tableColumnProps
void invalidTableColumnProps
void consumerUsage
void invalidConsumerUsage

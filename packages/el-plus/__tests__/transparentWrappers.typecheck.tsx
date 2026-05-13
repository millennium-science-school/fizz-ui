import {
  FeAlert,
  FeBadge,
  FeButton,
  FeCard,
  FeCheckbox,
  FeCheckboxGroup,
  FeDatePicker,
  FeDialog,
  FeDrawer,
  FeEmpty,
  FeForm,
  FeFormItem,
  FeInput,
  FeInputNumber,
  FeLink,
  FeOption,
  FePagination,
  FePopconfirm,
  FePopover,
  FeProgress,
  FeRadio,
  FeRadioButton,
  FeRadioGroup,
  FeSelect,
  FeSwitch,
  FeTable,
  FeTableColumn,
  FeTabPane,
  FeTabs,
  FeTag,
  FeText,
  FeTooltip,
  FeUpload,
} from '../src'

const wrapperUsage = [
  <FeButton type="primary">保存</FeButton>,
  // @ts-expect-error invalid button type should be rejected by the public Element Plus props type
  <FeButton type="not-real">保存</FeButton>,

  <FeForm model={{ keyword: '' }} inline />,
  <FeFormItem label="关键词" prop="keyword" />,
  <FeInput modelValue="keyword" />,
  <FeInputNumber modelValue={1} />,
  <FeTable data={[{ name: 'Tom' }]} />,
  <FeTableColumn prop="name" label="姓名" />,
  // @ts-expect-error invalid table column prop should be rejected by the Fizz-maintained facade
  <FeTableColumn notReal label="姓名" />,
  <FePagination currentPage={1} pageSize={10} total={20} />,
  <FeSelect modelValue="enabled" placeholder="状态">
    <FeOption label="启用" value="enabled" />
  </FeSelect>,
  // @ts-expect-error invalid select prop should be rejected by the public Element Plus props type
  <FeSelect notReal modelValue="enabled" />,
  <FeDialog modelValue={false} title="详情" />,
  // @ts-expect-error invalid dialog prop should be rejected by the public Element Plus props type
  <FeDialog notReal modelValue={false} />,
  <FeDrawer modelValue={false} direction="rtl" />,
  // @ts-expect-error invalid drawer direction should be rejected by the public Element Plus props type
  <FeDrawer modelValue={false} direction="sideways" />,
  <FeDatePicker modelValue="" type="date" />,
  // @ts-expect-error invalid date picker type should be rejected by the public Element Plus props type
  <FeDatePicker modelValue="" type="not-real" />,
  <FeUpload action="/upload" listType="text" />,
  // @ts-expect-error invalid upload list type should be rejected by the public Element Plus props type
  <FeUpload action="/upload" listType="not-real" />,
  <FeTooltip content="提示" placement="top">
    <FeButton>提示</FeButton>
  </FeTooltip>,
  // @ts-expect-error invalid tooltip placement should be rejected by the public Element Plus props type
  <FeTooltip content="提示" placement="not-real" />,
  <FeTag type="success">成功</FeTag>,
  // @ts-expect-error invalid tag type should be rejected by the public Element Plus props type
  <FeTag type="not-real">失败</FeTag>,
  <FeCheckbox modelValue>同意</FeCheckbox>,
  <FeCheckboxGroup modelValue={['read']} />,
  // @ts-expect-error invalid checkbox prop should be rejected by the public Element Plus props type
  <FeCheckbox notReal />,
  <FeRadio modelValue="day" value="day">白天</FeRadio>,
  <FeRadioGroup modelValue="day" />,
  // @ts-expect-error invalid radio prop should be rejected by the public Element Plus props type
  <FeRadio notReal />,
  <FeSwitch modelValue />,
  // @ts-expect-error invalid switch prop should be rejected by the public Element Plus props type
  <FeSwitch notReal />,
  <FeAlert title="提示" type="success" />,
  // @ts-expect-error invalid alert type should be rejected by the public Element Plus props type
  <FeAlert title="提示" type="not-real" />,
  <FeCard shadow="never">卡片</FeCard>,
  // @ts-expect-error invalid card shadow should be rejected by the public Element Plus props type
  <FeCard shadow="not-real">卡片</FeCard>,
  <FeLink type="primary">链接</FeLink>,
  // @ts-expect-error invalid link type should be rejected by the public Element Plus props type
  <FeLink type="not-real">链接</FeLink>,
  <FeText type="success">文本</FeText>,
  // @ts-expect-error invalid text type should be rejected by the public Element Plus props type
  <FeText type="not-real">文本</FeText>,
  <FeTabs modelValue="overview">
    <FeTabPane name="overview" label="概览" />
  </FeTabs>,
  // @ts-expect-error invalid tabs prop should be rejected by the public Element Plus props type
  <FeTabs notReal />,
  <FePopover placement="top" content="弹层" />,
  // @ts-expect-error invalid popover placement should be rejected by the public Element Plus props type
  <FePopover placement="not-real" />,
  <FePopconfirm title="确认删除?" />,
  // @ts-expect-error invalid popconfirm prop should be rejected by the public Element Plus props type
  <FePopconfirm notReal />,
  <FeProgress percentage={50} status="success" />,
  // @ts-expect-error invalid progress status should be rejected by the public Element Plus props type
  <FeProgress percentage={50} status="not-real" />,
  <FeEmpty description="暂无数据" />,
  // @ts-expect-error invalid empty prop should be rejected by the public Element Plus props type
  <FeEmpty notReal />,
  <FeBadge value={3} type="primary" />,
  // @ts-expect-error invalid badge type should be rejected by the public Element Plus props type
  <FeBadge value={3} type="not-real" />,
  <FeRadioButton value="day">白天</FeRadioButton>,
  // @ts-expect-error invalid radio button prop should be rejected by the public Element Plus props type
  <FeRadioButton notReal />,
]

void wrapperUsage

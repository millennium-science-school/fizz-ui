import antfu from '@antfu/eslint-config'

export default antfu(
  {
    vue: true,
    formatters: true,
  },
  {
    ignores: ['**/*_REVIEW.md', '**/ARCHITECTURE_REVIEW.md'],
  },
  {
    rules: {
      'vue/max-attributes-per-line': [
        'error',
        {
          singleline: { max: 3 },
          multiline: { max: 1 },
        },
      ],
    },
    files: ['**/*.vue'],
  },
  {
    rules: {
      'pnpm/yaml-enforce-settings': 'off',
    },
    files: ['**/*.yaml', '**/*.yml'],
  },
)

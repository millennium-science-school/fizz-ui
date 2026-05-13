export const FIZZ_ELEMENT_NAMESPACE = 'fe' as const

export const FIZZ_WRAPPER_CLASS_PREFIX = 'fe' as const

// This config is consumed by app/template setup through Element Plus
// ElConfigProvider. The same namespace must also be configured in
// Element Plus Sass via $namespace.
export const fizzElementNamespaceConfig = {
  namespace: FIZZ_ELEMENT_NAMESPACE,
} as const

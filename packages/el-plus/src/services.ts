import type {
  ElMessageBoxOptions,
  LoadingOptions,
  MessageOptions,
  MessageOptionsWithType,
  MessageParams,
  MessageParamsWithType,
  NotificationOptions,
  NotificationOptionsTyped,
  NotificationParams,
  NotificationParamsTyped,
} from 'element-plus'
import type { AppContext, MaybeRef, VNode } from 'vue'
import {
  ElLoadingService,
  ElMessage,
  ElMessageBox,
  ElNotification,
} from 'element-plus'
import { isVNode, unref } from 'vue'
import { FIZZ_WRAPPER_CLASS_PREFIX } from './namespace'

interface CustomClassOptions {
  customClass?: MaybeRef<string>
}

const CLASS_TOKEN_RE = /\s+/

const FIZZ_SERVICE_CLASS = {
  loading: `${FIZZ_WRAPPER_CLASS_PREFIX}-loading`,
  message: `${FIZZ_WRAPPER_CLASS_PREFIX}-message`,
  messageBox: `${FIZZ_WRAPPER_CLASS_PREFIX}-message-box`,
  notification: `${FIZZ_WRAPPER_CLASS_PREFIX}-notification`,
} as const

function mergeCustomClass(customClass: MaybeRef<string> | undefined, fizzClass: string) {
  return [...new Set([fizzClass, ...(unref(customClass)?.split(CLASS_TOKEN_RE).filter(Boolean) ?? [])])].join(' ')
}

function withFizzCustomClass<T extends CustomClassOptions>(
  options: T | undefined,
  fizzClass: string,
) {
  return {
    ...(options ?? {}),
    customClass: mergeCustomClass(options?.customClass, fizzClass),
  } as T
}

function isOptionsObject(value: unknown): value is CustomClassOptions {
  return typeof value === 'object' && value !== null && !isVNode(value)
}

function isAppContext(value: unknown): value is AppContext {
  return typeof value === 'object' && value !== null && 'app' in value && 'config' in value
}

function normalizeMessageParams(options: MessageParams | undefined): MessageOptions {
  if (isOptionsObject(options)) {
    return withFizzCustomClass(options as MessageOptions, FIZZ_SERVICE_CLASS.message)
  }

  return {
    customClass: FIZZ_SERVICE_CLASS.message,
    message: options,
  }
}

function normalizeTypedMessageParams(options: MessageParamsWithType | undefined): MessageOptionsWithType {
  if (isOptionsObject(options)) {
    return withFizzCustomClass(options as MessageOptionsWithType, FIZZ_SERVICE_CLASS.message)
  }

  return {
    customClass: FIZZ_SERVICE_CLASS.message,
    message: options,
  }
}

function normalizeNotificationParams(options: NotificationParams | undefined): Partial<NotificationOptions> {
  if (isOptionsObject(options)) {
    return withFizzCustomClass(options as Partial<NotificationOptions>, FIZZ_SERVICE_CLASS.notification)
  }

  return {
    customClass: FIZZ_SERVICE_CLASS.notification,
    message: options as string | VNode | undefined,
  }
}

function normalizeTypedNotificationParams(
  options: NotificationParamsTyped | undefined,
): Partial<NotificationOptionsTyped> {
  if (isOptionsObject(options)) {
    return withFizzCustomClass(options as Partial<NotificationOptionsTyped>, FIZZ_SERVICE_CLASS.notification)
  }

  return {
    customClass: FIZZ_SERVICE_CLASS.notification,
    message: options as string | VNode | undefined,
  }
}

function normalizeMessageBoxOptions(options: ElMessageBoxOptions | undefined) {
  return withFizzCustomClass(options, FIZZ_SERVICE_CLASS.messageBox)
}

function createMessageBoxShortcut(
  shortcut: typeof ElMessageBox.alert,
) {
  return ((
    message: ElMessageBoxOptions['message'],
    titleOrOptions?: ElMessageBoxOptions['title'] | ElMessageBoxOptions,
    optionsOrAppContext?: ElMessageBoxOptions | AppContext | null,
    appContext?: AppContext | null,
  ) => {
    if (isOptionsObject(titleOrOptions)) {
      return shortcut(
        message,
        normalizeMessageBoxOptions(titleOrOptions as ElMessageBoxOptions),
        optionsOrAppContext as AppContext | null | undefined,
      )
    }

    if (isAppContext(optionsOrAppContext) || optionsOrAppContext === null) {
      return shortcut(
        message,
        titleOrOptions,
        normalizeMessageBoxOptions(undefined),
        optionsOrAppContext,
      )
    }

    return shortcut(
      message,
      titleOrOptions,
      normalizeMessageBoxOptions(optionsOrAppContext),
      appContext,
    )
  }) as typeof ElMessageBox.alert
}

export const FeMessage = Object.assign(
  ((options?: MessageParams, appContext?: AppContext | null) => {
    return ElMessage(normalizeMessageParams(options), appContext)
  }) as typeof ElMessage,
  {
    closeAll: ElMessage.closeAll,
    closeAllByPlacement: ElMessage.closeAllByPlacement,
    primary: (options?: MessageParamsWithType, appContext?: AppContext | null) => {
      return ElMessage.primary(normalizeTypedMessageParams(options), appContext)
    },
    success: (options?: MessageParamsWithType, appContext?: AppContext | null) => {
      return ElMessage.success(normalizeTypedMessageParams(options), appContext)
    },
    info: (options?: MessageParamsWithType, appContext?: AppContext | null) => {
      return ElMessage.info(normalizeTypedMessageParams(options), appContext)
    },
    warning: (options?: MessageParamsWithType, appContext?: AppContext | null) => {
      return ElMessage.warning(normalizeTypedMessageParams(options), appContext)
    },
    error: (options?: MessageParamsWithType, appContext?: AppContext | null) => {
      return ElMessage.error(normalizeTypedMessageParams(options), appContext)
    },
  },
)

export const FeNotification = Object.assign(
  ((options?: NotificationParams, appContext?: AppContext | null) => {
    return ElNotification(normalizeNotificationParams(options), appContext)
  }) as typeof ElNotification,
  {
    closeAll: ElNotification.closeAll,
    primary: (options?: NotificationParamsTyped, appContext?: AppContext | null) => {
      return ElNotification.primary(normalizeTypedNotificationParams(options), appContext)
    },
    success: (options?: NotificationParamsTyped, appContext?: AppContext | null) => {
      return ElNotification.success(normalizeTypedNotificationParams(options), appContext)
    },
    info: (options?: NotificationParamsTyped, appContext?: AppContext | null) => {
      return ElNotification.info(normalizeTypedNotificationParams(options), appContext)
    },
    warning: (options?: NotificationParamsTyped, appContext?: AppContext | null) => {
      return ElNotification.warning(normalizeTypedNotificationParams(options), appContext)
    },
    error: (options?: NotificationParamsTyped, appContext?: AppContext | null) => {
      return ElNotification.error(normalizeTypedNotificationParams(options), appContext)
    },
    updateOffsets: ElNotification.updateOffsets,
  },
)

export const FeMessageBox = Object.assign(
  ((options: ElMessageBoxOptions, appContext?: AppContext | null) => {
    return ElMessageBox(normalizeMessageBoxOptions(options), appContext)
  }) as typeof ElMessageBox,
  {
    alert: createMessageBoxShortcut(ElMessageBox.alert),
    close: ElMessageBox.close,
    confirm: createMessageBoxShortcut(ElMessageBox.confirm),
    prompt: createMessageBoxShortcut(ElMessageBox.prompt),
  },
)

export const FeLoadingService = ((options?: LoadingOptions, context?: AppContext | null) => {
  return ElLoadingService(
    withFizzCustomClass(options, FIZZ_SERVICE_CLASS.loading),
    context,
  )
}) as typeof ElLoadingService

export type {
  LoadingInstance as FeLoadingInstance,
  LoadingOptions as FeLoadingOptions,
  ElMessageBoxOptions as FeMessageBoxOptions,
  MessageHandler as FeMessageHandler,
  MessageOptions as FeMessageOptions,
  NotificationHandle as FeNotificationHandle,
  NotificationOptions as FeNotificationOptions,
} from 'element-plus'

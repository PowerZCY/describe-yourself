import { createCommonAppConfig, createI18nHelpers, LOCALE_PRESETS } from "@windrun-huaiin/lib/common-app-config";

// 创建应用配置
export const appConfig = {
  ...createCommonAppConfig(LOCALE_PRESETS.EN_ONLY),
  openrouterAI: {
    appName: process.env.NEXT_PUBLIC_APP_NAME || 'Describe Yourself',
    timeoutSeconds: Number(process.env.OPENROUTER_TIMEOUT_SECONDS) || 30,
    apiKey: process.env.OPENROUTER_API_KEY || '',
    modelName: process.env.NEXT_PUBLIC_OPENROUTER_MODEL_NAME || '',
    translationModelName: process.env.NEXT_PUBLIC_OPENROUTER_TRANSLATION_MODEL_NAME || 'deepseek/deepseek-chat-v3-0324:free',
    // 默认启用mock，防止DEV飞速消耗token数量
    enableMock: process.env.OPENROUTER_ENABLE_MOCK !== 'false',
    enableMockAds: process.env.OPENROUTER_ENABLE_MOCK_ADS === 'true',
    enableMockTimeout: process.env.OPENROUTER_ENABLE_MOCK_TIMEOUT === 'true',
    mockTimeoutSeconds: Number(process.env.OPENROUTER_MOCK_TIMEOUT_SECONDS) || 3,
    // 单词请求限制消耗的token数量
    limitMaxWords: 500
  },
};

// 导出国际化辅助函数
export const { isSupportedLocale, getValidLocale, generatedLocales } = createI18nHelpers(appConfig.i18n);

export const { localePrefixAsNeeded, defaultLocale } = appConfig.i18n;

// 便捷常量直接从 shortcuts 导出
export const { iconColor, watermark, showBanner, clerkPageBanner, clerkAuthInModal, placeHolderImage } = appConfig.shortcuts;

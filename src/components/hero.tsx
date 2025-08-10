/* eslint-disable react/no-unescaped-entities */

import { getTranslations } from 'next-intl/server'
import { HeroClient } from './hero-client'
import { globalLucideIcons as icons } from '@windrun-huaiin/base-ui/components/server'

interface ContextConfig {
  id: string
  title: string
  icon: keyof typeof icons
  placeholder: string
  description: string
}

export async function Hero({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'hero' });
  const contexts = t.raw('contexts') as ContextConfig[]
  
  const translations = {
    chooseContext: t('chooseContext'),
    shareBrief: t('shareBrief'),
    inputTip: t('inputTip'),
    wordUnitTitle: t('wordUnitTitle'),
    outputTitle: t('outputTitle'),
    outputEmpty: t('outputEmpty')
  }

  return (
    <section className="px-16 mx-16 md:mx-32 space-y-8">
      {/* 标题区 */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl md:text-5xl font-bold leading-tight">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            {t('mainTitle')}
          </span>
        </h1>
        <span className="text-base md:text-2xl leading-tight text-gray-400">
          {t('mainSubtitle')}
        </span>
      </div>

      <HeroClient contexts={contexts} translations={translations} />
    </section>
  )
}


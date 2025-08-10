'use client';

import { Hero } from "@/components/hero";
import { pricePlanConfig } from "@/lib/price-config";
import { FAQ, Features, PricePlan, SeoContent, Usage } from "@windrun-huaiin/third-ui/main/server";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <>
      <Hero locale={locale} />
      <Usage locale={locale} />
      <Features locale={locale} />
      <PricePlan locale={locale} pricePlanConfig={pricePlanConfig} currency="￥" />
      <SeoContent locale={locale} />
      <FAQ locale={locale} />
    </>
  )
}


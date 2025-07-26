'use client';

import { Hero } from "@/components/hero";
import { pricePlanConfig } from "@/lib/price-config";
import { FAQ, Features, PricePlan, SeoContent, Usage } from "@windrun-huaiin/third-ui/main";

export default function Home() {
  return (
    <>
      <Hero />
      <Usage />
      <Features />
      <PricePlan pricePlanConfig={pricePlanConfig} currency="￥" />
      <SeoContent />
      <FAQ />
    </>
  )
}


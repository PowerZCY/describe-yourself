 
'use client'

import { globalLucideIcons as icons } from '@windrun-huaiin/base-ui/components/server'
import { GradientButton } from '@windrun-huaiin/third-ui/fuma/mdx'
import { AdsAlertDialog, AIPromptTextarea, XButton } from '@windrun-huaiin/third-ui/main'
import { useState } from 'react'

interface ContextConfig {
  id: string
  title: string
  icon: keyof typeof icons
  placeholder: string
  description: string
}

interface HeroClientProps {
  contexts: ContextConfig[]
  translations: {
    chooseContext: string
    shareBrief: string
    inputTip: string
    wordUnitTitle: string
    outputTitle: string
    outputEmpty: string
  }
}

export function HeroClient({ contexts, translations }: HeroClientProps) {
  const [selectedContext, setSelectedContext] = useState<string | null>(null)
  const [userInput, setUserInput] = useState('')
  const [isWordLimit, setIsWordLimit] = useState(false)
  const [generatedDescription, setGeneratedDescription] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [showOutput, setShowOutput] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [generatedContextTitle, setGeneratedContextTitle] = useState<string | null>(null)

  // 统一错误弹窗管理
  const [errorDialog, setErrorDialog] = useState<{ open: boolean, title: string, description: string }>({ open: false, title: '', description: '' });

  const selectedContextConfig = contexts.find(c => c.id === selectedContext)
  const maxWords = 400

  // 处理单词限制变化
  const handleWordLimitChange = (isLimit: boolean) => {
    setIsWordLimit(isLimit)
  }

  const handleGenerate = async () => {
    if (!selectedContext) return

    setIsGenerating(true)
    try {
      const response = await fetch('/api/ai-generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          context: selectedContext,
          prompt: userInput.trim()
        }),
      })

      const data = await response.json()
      if (data.text) {
        setGeneratedDescription(data.text)
        setGeneratedContextTitle(selectedContextConfig?.title ?? '')
        setShowOutput(true)
      }
    } catch (error) {
      setErrorDialog({
        open: true,
        title: 'Generate Failed',
        description: 'Failed to generate description, please try again later.'
      })
      console.error('Failed to generate description:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedDescription)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (error) {
      setErrorDialog({
        open: true,
        title: 'Copy Failed',
        description: 'Failed to copy text, please try again later.'
      })
      console.error('Failed to copy text: ', error);
    }
  }

  const handleRegenerate = () => {
    handleGenerate()
  }

  const resetForm = () => {
    setSelectedContext(null)
    setUserInput('')
    setGeneratedDescription('')
    setShowOutput(false)
    setIsCopied(false)
    setGeneratedContextTitle(null)
    setIsWordLimit(false)
  }

  const canRegenerate = selectedContextConfig?.title === generatedContextTitle;

  return (
    <>
      {/* 错误弹窗 */}
      <AdsAlertDialog
        open={errorDialog.open}
        onOpenChange={open => {
          if (!open) setErrorDialog({ open: false, title: '', description: '' });
        }}
        title={errorDialog.title}
        description={errorDialog.description}
        imgSrc="https://r2.d8ger.com/Ad-Pollo.webp"
        imgHref="https://pollo.ai/home?ref=mzmzndj&tm_news=news"
      />

      {/* 上下分区：上下两行 */}
      <div className="flex flex-col space-y-4 md:space-y-6">
        {/* 上：上下文选择 */}
        <div className="space-y-3">
          <div className="border-2 border-border rounded-lg bg-card/30 p-3 md:p-5 h-full flex flex-col">
            <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-foreground">{translations.chooseContext}</h2>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-6 md:gap-2 flex-1">
              {contexts.map((context) => {
                const Icon = icons[context.icon]
                const isSelected = selectedContext === context.id;
                
                return (
                  <button
                    key={context.id}
                    onClick={() => setSelectedContext(context.id)}
                    className={`
                      relative overflow-hidden transition-all duration-300 rounded-lg
                      
                      /* Mobile Styles: Tag-like, compact, solid background when selected */
                      p-1.5 font-medium flex items-center justify-center
                      ${isSelected 
                        ? 'bg-linear-to-r from-purple-400 to-pink-500 text-white border border-transparent shadow-md' 
                        : 'bg-card border border-border text-foreground hover:border-purple-300'}

                      /* Desktop Styles: Card-like, vertical, border highlight */
                      md:p-2 md:border-2 md:flex-col md:justify-start md:space-y-2 md:text-base
                      md:${isSelected 
                        ? 'bg-transparent text-foreground border-purple-500' 
                        : 'bg-transparent hover:border-purple-500'}
                    `}
                  >
                    {/* Icon: Hidden on mobile, visible on desktop */}
                    <div className={`hidden md:block p-2 rounded-full transition-colors ${
                      isSelected
                        ? 'bg-linear-to-r from-purple-400 to-pink-500'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                       <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : ''}`} />
                    </div>
                    
                    {/* Text */}
                    <span className="truncate w-full text-center md:whitespace-normal">
                      {context.title}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* 下：输入区 */}
        <div className="space-y-3 flex flex-col">
          <div className="border-2 border-border rounded-lg bg-card/30 p-3 md:p-5 flex-1 flex flex-col">
            <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-foreground">{translations.shareBrief}</h2>
            <p className="text-muted-foreground text-sm md:text-base mb-3 md:mb-4">{translations.inputTip}</p>
            <div
              className={`grid transition-all duration-300 ease-in-out ${
                selectedContext ? 'grid-rows-[1fr] opacity-100 mb-3 md:mb-4' : 'grid-rows-[0fr] opacity-0'
              }`}
            >
              <div className="overflow-hidden">
                <p className="text-muted-foreground text-sm md:text-base p-3 md:p-4 bg-background rounded-lg border border-border">
                  <icons.Info className="w-5 h-5 inline mr-2 text-purple-500" />
                  {selectedContextConfig?.description || contexts[0]?.description}
                </p>
              </div>
            </div>
            <AIPromptTextarea
              value={userInput}
              onChange={setUserInput}
              placeholder={selectedContext ? selectedContextConfig?.placeholder : contexts[0]?.placeholder}
              disabled={!selectedContext}
              maxWords={maxWords}
              wordUnitTitle={translations.wordUnitTitle}
              minHeight={150}
              maxHeight={300}
              isWordLimit={isWordLimit}
              onWordLimitChange={handleWordLimitChange}
              extraScrollSpace={100}
            />
            <div className="flex flex-col sm:flex-row justify-between items-center mt-3 gap-3">
              <div className="flex items-center space-x-2 w-full sm:w-auto">
                {selectedContext && (
                   <GradientButton
                    title="Generate Description"
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    icon={<icons.Sparkles/>}
                    iconClassName="w-4 h-4 sm:w-4 sm:h-4"
                    className="w-full sm:w-auto text-sm md:text-base font-medium"
                  />
                )}
                {userInput.trim() && (
                  <button
                    onClick={() => setUserInput('')}
                    className="text-sm md:text-base text-muted-foreground hover:rounded-full hover:bg-neutral-300 dark:hover:bg-neutral-600 px-4 py-2 md:px-6 md:py-3 w-full sm:w-auto"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 结果区：单独一行 */}
      <div className="space-y-4">
        <div className="border-2 border-border bg-card/30 rounded-lg p-3 md:p-5">
          <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-foreground">{translations.outputTitle}</h2>
          {showOutput ? (
            <div>
              <div className="bg-background rounded-lg border border-border p-3 md:p-4 mb-3 md:mb-4">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <span className="text-xs md:text-sm text-muted-foreground bg-background px-2 md:px-3 py-1 rounded-full border border-border truncate max-w-[150px] sm:max-w-[200px] md:max-w-none">
                    {generatedContextTitle} Context
                  </span>
                  <XButton
                    type="single"
                    minWidth="min-w-[100px]  sm:min-w-[120px]"
                    button={{
                      icon: isCopied ? <icons.CheckCheck/> : <icons.Copy/>,
                      text: isCopied ? 'Copied' : 'Copy',
                      onClick: handleCopy,
                    }}
                    className="w-auto shrink-0 justify-center text-xs md:text-sm px-2 md:px-4 h-8 md:h-10 whitespace-nowrap"
                    iconClassName="w-4 h-4 sm:w-4 sm:h-4 mr-1"
                  />
                </div>
                <div className="prose prose-sm md:prose-base max-w-none">
                  <p className="text-foreground/90 leading-relaxed whitespace-pre-wrap text-sm md:text-base m-0">{generatedDescription}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 md:gap-3">
                <GradientButton
                  title="Regenerate"
                  onClick={handleRegenerate}
                  disabled={isGenerating || !canRegenerate}
                  icon={<icons.RefreshCcw/>}
                  iconClassName="w-4 h-4 sm:w-4 sm:h-4"
                  className="text-xs md:text-sm px-6 py-2 md:px-6 md:py-2.5"
                />
                
                <GradientButton
                  title="Start Over"
                  disabled={isGenerating}
                  onClick={resetForm}
                  icon={<icons.BookX/>}
                  iconClassName="w-4 h-4 sm:w-4 sm:h-4"
                  className="text-xs md:text-sm px-6 py-2 md:px-6 md:py-2.5"
                />
              </div>
            </div>
          ) : (
            <div className="border-2 border-border rounded-lg text-center space-y-3 py-8 bg-background">
              <div className="mx-auto w-12 h-12 bg-linear-to-r from-purple-400 to-pink-600 rounded-full flex items-center justify-center">
                <icons.Sparkles className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">{translations.outputEmpty}</h3>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span>
                  {isGenerating ? 'Generating...' : 'Waiting for your input'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
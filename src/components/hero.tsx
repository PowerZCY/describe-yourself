/* eslint-disable react/no-unescaped-entities */
'use client'

import { useState } from 'react'
import { globalLucideIcons as icons } from '@windrun-huaiin/base-ui/components/server'
import { GradientButton } from '@windrun-huaiin/third-ui/fuma/mdx'
import React from 'react'
import { XButton } from '@windrun-huaiin/third-ui/main'


type Context = 'professional' | 'social' | 'academic' | 'self-discovery' | 'creative-writing' | 'language-learning'

interface ContextConfig {
  id: Context
  title: string
  icon: keyof typeof icons
  placeholder: string
  description: string
}

const contexts: ContextConfig[] = [
  {
    id: 'professional',
    title: 'Professional',
    icon: 'Building2',
    placeholder: 'e.g., leadership skills, 5+ years experience, increased sales by 20%',
    description: 'Provide a short description of your professional skills, experiences, or achievements. Include strengths like leadership or analytical thinking, years of experience, or accomplishments like leading a team or boosting sales by 20%.'
  },
  {
    id: 'social',
    title: 'Social',
    icon: 'HandHeart',
    placeholder: 'e.g., outgoing, loves hiking, coffee enthusiast, adventure seeker',
    description: 'Share a short description of your personality traits, hobbies, or passions. Include what makes you fun or unique, like being outgoing or loving hiking. Mention activities or interests that show your vibe.'
  },
  {
    id: 'academic',
    title: 'Academic',
    icon: 'LibraryIcon',
    placeholder: 'e.g., 3.8 GPA, published research, computer science major, aspiring PhD',
    description: 'Offer a short description of your academic background, achievements, or aspirations. Include accomplishments like a 3.8 GPA or published research, your field of study, or goals like pursuing a PhD.'
  },
  {
    id: 'self-discovery',
    title: 'Self-Discovery',
    icon: 'Search',
    placeholder: 'e.g., empathetic, curious, values honesty, volunteered abroad',
    description: 'Reflect with a short description of your personal values, traits, or experiences. Include characteristics like empathy or curiosity, core beliefs, or moments that shaped you, like volunteering abroad. Share what feels true to you.'
  },
  {
    id: 'creative-writing',
    title: 'Creative Writing',
    icon: 'Pencil',
    placeholder: 'e.g., brave warrior, mysterious past, dystopian world, hidden powers',
    description: 'Create a short description of your character\'s traits, background, or motivations. Include details like bravery or a mysterious past, or story context like a warrior in a dystopian world. Make it vivid yet simple.'
  },
  {
    id: 'language-learning',
    title: 'Language Learning',
    icon: 'Globe',
    placeholder: 'e.g., friendly, enjoys music, likes soccer, helpful person',
    description: 'Write a short description of your traits, interests, or experiences in the target language. Use simple words like friendly or enjoys music. Focus on clear, easy phrases to practice your language skills.'
  }
]

export function Hero() {
  const [selectedContext, setSelectedContext] = useState<Context | null>(null)
  const [userInput, setUserInput] = useState('')
  const [generatedDescription, setGeneratedDescription] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [showOutput, setShowOutput] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [isWordLimit, setIsWordLimit] = useState(false)

  const selectedContextConfig = contexts.find(c => c.id === selectedContext)
  const wordArray = userInput.trim().split(/\s+/).filter(Boolean)
  const wordCount = wordArray.length
  const maxWords = 400

  // 处理输入，限制最大单词数
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    const words = value.trim().split(/\s+/).filter(Boolean)
    // 如果已经达到最大单词数，并且本次输入会导致超限，则不更新
    if (wordCount >= maxWords && words.length > maxWords) {
      setIsWordLimit(true)
      return
    }
    if (words.length > maxWords) {
      setUserInput(words.slice(0, maxWords).join(' '))
      setIsWordLimit(true)
    } else {
      setUserInput(value)
      setIsWordLimit(false)
    }
  }

  // 粘贴时也做单词数判断
  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const paste = e.clipboardData.getData('text')
    const currentWords = userInput.trim().split(/\s+/).filter(Boolean)
    const pasteWords = paste.trim().split(/\s+/).filter(Boolean)
    if (currentWords.length >= maxWords) {
      e.preventDefault()
      setIsWordLimit(true)
      return
    }
    // 只允许粘贴剩余单词数
    const allowed = maxWords - currentWords.length
    if (pasteWords.length > allowed) {
      e.preventDefault()
      const newWords = currentWords.concat(pasteWords.slice(0, allowed))
      setUserInput(newWords.join(' '))
      setIsWordLimit(true)
    }
  }

  const handleGenerate = async () => {
    if (!selectedContext || !userInput.trim()) return

    setIsGenerating(true)
    try {
      const response = await fetch('/api/generate-description', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          context: selectedContext,
          userInput: userInput.trim(),
          prompt: `Generate a describe yourself paragraph for ${selectedContext} context`
        }),
      })

      const data = await response.json()
      if (data.description) {
        setGeneratedDescription(data.description)
        setShowOutput(true)
      }
    } catch (error) {
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
      console.error('Failed to copy text:', error)
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
  }

  return (
    <section className="px-16 mx-16 md:mx-32 space-y-8">
      {/* 标题区 */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl md:text-5xl font-bold leading-tight">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            Describe Yourself
          </span>
        </h1>
        <span className="text-base md:text-2xl font-bold leading-tight text-foreground">
          Generate personalized self-description paragraphs tailored to your context and goals
        </span>
      </div>

      {/* 上下分区：上下两行 */}
      <div className="flex flex-col space-y-6">
        {/* 上：上下文选择 */}
        <div className="space-y-3">
          <div className="border-2 border-border rounded-lg bg-card/30 p-5 h-full flex flex-col">
            <h2 className="text-xl font-semibold mb-4 text-foreground">Choose Your Context</h2>
            <div className="grid grid-cols-6 gap-3 flex-1">
              {contexts.map((context) => {
                const Icon = icons[context.icon]
                return (
                  <button
                    key={context.id}
                    onClick={() => setSelectedContext(context.id)}
                    className={`p-3 rounded-lg border-2 transition-all duration-300 ${
                      selectedContext === context.id
                        ? 'border-purple-500  scale-105'
                        : 'border-border hover:border-purple-500'
                    }`}
                  >
                    <div className="flex flex-col items-center text-center space-y-2">
                      <div className={`p-2 rounded-full transition-colors ${
                        selectedContext === context.id
                          ? 'bg-gradient-to-r from-purple-400 to-pink-500'
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {selectedContext === context.id ? <Icon className="w-5 h-5 text-white" /> : <Icon className="w-5 h-5" />}
                      </div>
                      <h3 className="font-medium text-sm text-foreground">{context.title}</h3>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* 下：输入区 */}
        <div className="space-y-3 flex flex-col">
          <div className="border-2 border-border rounded-lg bg-card/30 p-5 flex-1 flex flex-col">
            <h2 className="text-xl font-semibold mb-4 text-foreground">Share a Brief Description</h2>
            <p className="text-muted-foreground text-base mb-4">Just a few keywords or phrases about yourself - keep it simple and comfortable!</p>
            {selectedContext && (
              <div className="mb-4">
                <p className="text-muted-foreground text-base p-4 bg-background rounded-lg border border-border">
                  <icons.Info className="w-5 h-5 inline mr-2 text-purple-400" />
                  {selectedContextConfig?.description}
                </p>
              </div>
            )}
            <textarea
              value={userInput}
              onChange={handleInputChange}
              onPaste={handlePaste}
              placeholder={selectedContext ? selectedContextConfig?.placeholder : "Please select a context first..."}
              rows={5}
              disabled={!selectedContext}
              className="w-full flex-1 p-4 bg-transparent border-2 border-border rounded-lg hover:border-purple-500 transition-colors text-foreground placeholder-muted-foreground placeholder:text-base min-h-[120px] disabled:bg-muted disabled:cursor-not-allowed"
            />
            <div className="flex justify-between items-center mt-3">
              <div className="flex items-center space-x-1">
                {selectedContext && (
                   <GradientButton
                    title="Generate Description"
                    onClick={handleGenerate}
                    disabled={isGenerating || !userInput.trim()}
                    icon={<icons.Sparkles className="h-4 w-4"/>}
                  />
                )}
                {wordCount > 0 && (
                  <button
                    onClick={() => setUserInput('')}
                    className="text-base text-muted-foreground hover:rounded-full hover:bg-neutral-300 dark:hover:bg-neutral-600 px-6 py-3"
                  >
                    Clear
                  </button>
                )}
              </div>
             <span
               className={`text-base ${
                 wordCount >= maxWords ? 'text-red-500' : wordCount > 300 ? 'text-orange-500' : 'text-muted-foreground'
               } ${isWordLimit ? 'animate-bounce' : ''}`}
               onAnimationEnd={() => setIsWordLimit(false)}
             >
               {wordCount}/{maxWords} words
             </span>
            </div>
          </div>
        </div>
      </div>

      {/* 结果区：单独一行 */}
      <div className="space-y-4">
        <div className="border-2 border-border bg-card/30 rounded-lg p-5">
          <h2 className="text-xl font-semibold mb-4 text-foreground">Your Description</h2>
          {showOutput ? (
            <div>
              <div className="bg-background rounded-lg border border-border p-4 mb-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground bg-background px-3 py-1 rounded-full border border-border">
                    {selectedContextConfig?.title} Context
                  </span>
                  <XButton
                    type="single"
                    minWidth="min-w-[110px]"
                    button={{
                      icon: isCopied ? <icons.CheckCheck className="w-5 h-5 mr-1" /> : <icons.Copy className="w-5 h-5 mr-1" />,
                      text: isCopied ? 'Copied' : 'Copy',
                      onClick: handleCopy
                    }}
                  />
                </div>
                <div className="prose prose-base max-w-none">
                  <p className="text-foreground/90 leading-relaxed text-base m-0">{generatedDescription}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <GradientButton
                  title="Regenerate"
                  onClick={handleRegenerate}
                  disabled={isGenerating}
                  icon={<icons.RefreshCcw className="h-4 w-4"/>}
                />
                
                <GradientButton
                  title="Start Over"
                  onClick={resetForm}
                  icon={<icons.BookX className="h-4 w-4"/>}
                />
              </div>
            </div>
          ) : (
            <div className="border-2 border-border rounded-lg text-center space-y-3 py-8 bg-background">
              <div className="mx-auto w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-600 rounded-full flex items-center justify-center">
                <icons.Sparkles className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Your generated description will appear here</h3>
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
    </section>
  )
}


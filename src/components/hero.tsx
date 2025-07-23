/* eslint-disable react/no-unescaped-entities */
'use client'

import { useState } from 'react'
import { globalLucideIcons as icons } from '@windrun-huaiin/base-ui/components/server'

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

  const selectedContextConfig = contexts.find(c => c.id === selectedContext)
  const wordCount = userInput.trim().split(/\s+/).filter(Boolean).length

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
    <section className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent mb-4">
          Describe Yourself
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Generate personalized self-description paragraphs tailored to your context and goals
        </p>
      </div>

      <div className="space-y-6">
        {/* Context Selection */}
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h2 className="text-xl font-semibold mb-4">Choose Your Context</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {contexts.map((context) => {
              const Icon = icons[context.icon]
              return (
                <button
                  key={context.id}
                  onClick={() => setSelectedContext(context.id)}
                  className={`p-3 rounded-lg border-2 transition-all duration-300 hover:scale-105 hover:shadow-md ${
                    selectedContext === context.id
                      ? 'border-blue-500 bg-blue-50 shadow-md scale-105'
                      : 'border-gray-200 hover:border-blue-300 bg-white'
                  }`}
                >
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className={`p-2 rounded-full transition-colors ${
                      selectedContext === context.id
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-medium text-sm">{context.title}</h3>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h2 className="text-xl font-semibold mb-4">Share a Brief Description</h2>
          <p className="text-gray-600 text-base mb-4">Just a few keywords or phrases about yourself - keep it simple and comfortable!</p>
          
          {selectedContext && (
            <div className="mb-4">
              <p className="text-gray-600 text-base p-4 bg-blue-50 rounded-lg border border-blue-100">
                <icons.Info className="w-5 h-5 inline mr-2 text-blue-500" />
                {selectedContextConfig?.description}
              </p>
            </div>
          )}
          
          <textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder={selectedContext ? selectedContextConfig?.placeholder : "Please select a context first..."}
            maxLength={400}
            rows={5}
            disabled={!selectedContext}
            className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-300 resize-none text-base text-gray-700 placeholder-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed"
          />
          <div className="flex justify-between items-center mt-3">
            <span className={`text-base ${
              wordCount > 380 ? 'text-red-500' : wordCount > 300 ? 'text-orange-500' : 'text-gray-500'
            }`}>
              {wordCount}/400 words
            </span>
            <div className="flex items-center space-x-3">
              {wordCount > 0 && (
                <button
                  onClick={() => setUserInput('')}
                  className="text-base text-gray-500 hover:text-red-500 transition-colors"
                >
                  Clear
                </button>
              )}
              {selectedContext && (
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !userInput.trim()}
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-teal-500 text-white font-medium text-base rounded-lg hover:from-blue-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  {isGenerating ? (
                    <div className="flex items-center">
                      <icons.Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Generating...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <icons.Sparkles className="w-5 h-5 mr-2" />
                      Generate
                    </div>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Output Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h2 className="text-xl font-semibold mb-4">Your Description</h2>
          
          {showOutput ? (
            <div>
              <div className="bg-gray-50 rounded-lg border border-gray-100 p-4 mb-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full border">
                    {selectedContextConfig?.title} Context
                  </span>
                  <button
                    onClick={handleCopy}
                    className={`px-4 py-2 rounded-lg font-medium text-base transition-all duration-300 ${
                      isCopied 
                        ? 'bg-green-100 text-green-700 border border-green-200' 
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    {isCopied ? (
                      <div className="flex items-center">
                        <icons.Check className="w-4 h-4 mr-2" />
                        Copied!
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <icons.Copy className="w-4 h-4 mr-2" />
                        Copy
                      </div>
                    )}
                  </button>
                </div>
                <div className="prose prose-base max-w-none">
                  <p className="text-gray-700 leading-relaxed text-base m-0">{generatedDescription}</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleRegenerate}
                  disabled={isGenerating}
                  className="px-5 py-2.5 bg-blue-500 text-white font-medium text-base rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors shadow-sm hover:shadow-md"
                >
                  {isGenerating ? (
                    <div className="flex items-center">
                      <icons.Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Regenerating...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <icons.RefreshCcw className="w-4 h-4 mr-2" />
                      Try Another
                    </div>
                  )}
                </button>
                
                <button
                  onClick={resetForm}
                  className="px-5 py-2.5 bg-gray-500 text-white font-medium text-base rounded-lg hover:bg-gray-600 transition-colors shadow-sm hover:shadow-md"
                >
                  <div className="flex items-center">
                    <icons.RefreshCcw className="w-4 h-4 mr-2" />
                    Start Over
                  </div>
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <icons.Sparkles className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p className="text-base">Your generated description will appear here</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}


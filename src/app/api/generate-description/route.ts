import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { prompt, context, userInput } = await request.json()

    if (!prompt || !context || !userInput) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // For now, return a mock response since we don't have AI integration set up
    // In a real implementation, this would call an AI service like OpenAI, Claude, etc.
    const mockDescriptions = {
      'professional': `I am a dedicated professional with ${userInput.includes('years') ? 'extensive' : 'valuable'} experience in my field. ${userInput.includes('leadership') ? 'As a natural leader, I excel at guiding teams toward success and fostering collaborative environments.' : ''} My key strengths include analytical thinking, problem-solving, and the ability to adapt quickly to new challenges. ${userInput.includes('marketing') ? 'With a strong background in marketing, I have successfully developed and executed campaigns that drive measurable results.' : ''} I am committed to continuous learning and bringing innovative solutions to complex business challenges. My approach combines strategic thinking with practical execution, ensuring that projects are completed efficiently and exceed expectations.`,
      
      'social': `Hey there! I'm someone who loves life and all it has to offer. ${userInput.includes('hiking') ? 'You can often find me exploring nature trails and soaking up the great outdoors.' : ''} ${userInput.includes('coffee') ? 'I\'m a total coffee enthusiast - always on the hunt for the perfect brew!' : ''} I believe in making genuine connections and bringing positive energy wherever I go. ${userInput.includes('outgoing') ? 'I\'m naturally outgoing and love meeting new people.' : ''} Whether it's trying new restaurants, binge-watching great shows, or having deep conversations about life, I'm always up for an adventure. Looking for someone who shares my enthusiasm for living life to the fullest!`,
      
      'academic': `I am a dedicated student pursuing excellence in my academic journey. ${userInput.includes('computer science') ? 'My passion for computer science drives me to explore innovative solutions and stay current with emerging technologies.' : ''} ${userInput.includes('3.8 GPA') ? 'With a strong academic record including a 3.8 GPA, I have consistently demonstrated my commitment to learning.' : 'I maintain high academic standards while actively engaging in research and extracurricular activities.'} ${userInput.includes('research') ? 'My research experience has provided me with valuable insights and hands-on problem-solving skills.' : ''} ${userInput.includes('PhD') ? 'I am committed to pursuing advanced study at the doctoral level to contribute meaningfully to my field.' : 'I am eager to continue my educational journey and make meaningful contributions to my field of study.'} My goal is to leverage my academic foundation to make a positive impact in my chosen field.`,
      
      'self-discovery': `I am on a journey of continuous self-discovery and personal growth. ${userInput.includes('empathetic') ? 'Empathy is one of my core strengths - I find deep fulfillment in understanding and connecting with others.' : ''} ${userInput.includes('curious') ? 'My natural curiosity drives me to explore different perspectives and learn from every experience.' : ''} I believe in the power of authenticity and living in alignment with my values. ${userInput.includes('volunteering') ? 'My experience volunteering has shaped my worldview and reinforced my commitment to making a positive difference.' : ''} ${userInput.includes('honesty') ? 'Honesty and integrity guide my decisions and relationships.' : ''} I embrace both my strengths and areas for growth, understanding that self-awareness is an ongoing process. Through reflection and mindful living, I continue to evolve into the person I aspire to be.`,
      
      'creative-writing': `${userInput.includes('warrior') ? 'Born in the shadows of a crumbling world, this warrior carries the weight of countless battles in their weathered hands.' : 'This character emerges from a complex tapestry of experiences that have shaped their very essence.'} ${userInput.includes('mysterious') ? 'Behind their eyes lies a mysterious past, fragments of memories that surface only in quiet moments.' : ''} ${userInput.includes('brave') ? 'Courage flows through their veins like liquid fire, driving them forward even when hope seems lost.' : 'They possess an inner strength that has been forged through adversity.'} ${userInput.includes('dystopian') ? 'In this dystopian landscape, they have learned to navigate both the harsh realities of survival and the delicate threads of human connection.' : ''} ${userInput.includes('hidden powers') ? 'Unknown even to themselves, they harbor abilities that could shift the very fabric of their reality.' : 'Their true power lies not in supernatural abilities, but in their unwavering determination.'} Every scar tells a story, every choice defines their destiny.`,
      
      'language-learning': `I am a friendly person who enjoys learning about different cultures and languages. ${userInput.includes('music') ? 'I love listening to music from around the world.' : ''} ${userInput.includes('reading') ? 'Reading books helps me improve my language skills.' : ''} ${userInput.includes('soccer') ? 'I like to play soccer with my friends on weekends.' : 'I enjoy spending time with friends and family.'} I am always curious about new things and like to ask questions. Learning a new language is exciting for me because I can talk to more people and understand different ways of thinking. ${userInput.includes('friendly') ? 'People often say I am easy to talk to and helpful.' : 'I try to be kind and helpful to everyone I meet.'} I believe that practicing every day makes me better, and I am not afraid to make mistakes because they help me learn.`
    }

    const description = mockDescriptions[context as keyof typeof mockDescriptions] || 
      "I am a unique individual with diverse interests and experiences that shape who I am today."

    return NextResponse.json({ description })
  } catch (error) {
    console.error('Error generating description:', error)
    return NextResponse.json(
      { error: 'Failed to generate description' },
      { status: 500 }
    )
  }
}
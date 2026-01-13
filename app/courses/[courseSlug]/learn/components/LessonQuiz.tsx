'use client'

 import * as React from 'react'
 import { Button } from '@/components/ui/Button'
 import { RadioGroup, RadioGroupItem } from '@/src/components/ui/radio-group'
 import { Label } from '@/src/components/ui/label'
 import { Alert, AlertDescription, AlertTitle } from '@/src/components/ui/alert'
 import { CheckCircle, XCircle } from 'lucide-react'

 interface QuizQuestion {
   id: string
   question: string
   options: string[]
   correctIndex: number
   explanation?: string
 }

 interface LessonQuizProps {
   questions: QuizQuestion[]
 }

 export function LessonQuiz({ questions }: LessonQuizProps) {
   const [selectedAnswers, setSelectedAnswers] = React.useState<Record<string, number>>({})
   const [submitted, setSubmitted] = React.useState(false)

   if (!questions || questions.length === 0) {
     return null
   }

   const handleSelectAnswer = (questionId: string, optionIndex: number) => {
     setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIndex }))
   }

   const handleSubmit = () => {
     setSubmitted(true)
   }

   return (
     <div className="mt-12 border-t pt-8">
       <h2 className="text-3xl font-bold mb-6">Test Your Knowledge</h2>
       {questions.map((q, index) => (
         <div key={q.id} className="mb-8 p-6 bg-neutral-900 rounded-lg">
           <p className="font-semibold mb-4">
             {index + 1}. {q.question}
           </p>
           <RadioGroup
             onValueChange={(value: string) => handleSelectAnswer(q.id, parseInt(value, 10))}
             disabled={submitted}
           >
             {q.options.map((option, i) => (
               <div key={i} className="flex items-center space-x-2 mb-2">
                 <RadioGroupItem value={i.toString()} id={`${q.id}-${i}`} />
                 <Label htmlFor={`${q.id}-${i}`}>{option}</Label>
               </div>
             ))}
           </RadioGroup>
           {submitted && (
             <div className="mt-4">
               {selectedAnswers[q.id] === q.correctIndex ? (
                 <Alert variant="default" className="bg-green-900/50 border-green-700">
                   <CheckCircle className="h-4 w-4" />
                   <AlertTitle>Correct!</AlertTitle>
                   {q.explanation && <AlertDescription>{q.explanation}</AlertDescription>}
                 </Alert>
               ) : (
                 <Alert variant="destructive">
                   <XCircle className="h-4 w-4" />
                   <AlertTitle>Incorrect</AlertTitle>
                   <AlertDescription>
                     The correct answer was: {q.options[q.correctIndex]}.
                     {q.explanation && ` ${q.explanation}`}
                   </AlertDescription>
                 </Alert>
               )}
             </div>
           )}
         </div>
       ))}
       {!submitted && (
         <Button onClick={handleSubmit} disabled={Object.keys(selectedAnswers).length !== questions.length}>
           Submit Answers
         </Button>
       )}
     </div>
   )
 }

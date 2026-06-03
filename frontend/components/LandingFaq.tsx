'use client'

const faqs = [
  { question: 'How do I file a complaint?', answer: 'Register, describe the issue, choose a category, and submit your grievance.' },
  { question: 'Can I track my complaint status?', answer: 'Yes, access the complaint tracker to see updates and resolution progress.' },
  { question: 'Who can access the admin dashboard?', answer: 'Officers, department heads and super admins can view analytics and assign cases.' }
]

export function LandingFaq() {
  return (
    <div className="space-y-6">
      {faqs.map((item) => (
        <div key={item.question} className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
          <h3 className="text-lg font-semibold text-white">{item.question}</h3>
          <p className="mt-2 text-slate-300">{item.answer}</p>
        </div>
      ))}
    </div>
  )
}

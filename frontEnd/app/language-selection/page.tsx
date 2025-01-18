import LanguageSelectionScreen from '@/components/LanguageSelectionScreen'

export default function LanguageSelection() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
        Select Languages for Translation
      </h1>
      <LanguageSelectionScreen />
    </main>
  )
}


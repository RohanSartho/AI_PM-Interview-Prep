import LandingHeader from '@/components/landing/LandingHeader'
import HeroSection from '@/components/landing/HeroSection'
import UploadSection from '@/components/landing/UploadSection'
import HowItWorksSection from '@/components/landing/HowItWorksSection'
import TestimonialsSection from '@/components/landing/TestimonialsSection'
import PricingSection from '@/components/landing/PricingSection'
import Footer from '@/components/landing/Footer'

export default function Landing() {
  return (
    <div className="min-h-screen bg-gray-50">
      <LandingHeader />
      <HeroSection />
      <UploadSection />
      <HowItWorksSection />
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">See It In Action</h2>
          <p className="text-gray-600 mb-8">
            Desktop and mobile mockups coming soon
          </p>
        </div>
      </div>
      <TestimonialsSection />
      <PricingSection />
      <Footer />
    </div>
  )
}

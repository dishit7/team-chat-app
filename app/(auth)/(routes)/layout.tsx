import { Button } from "@/components/ui/button"
import { ArrowRight, Code, Globe, Lock } from "lucide-react"

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="grad-main min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-7xl w-full grid md:grid-cols-2 gap-12 bg-black/30 backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl border border-primary/20">
        {/* Left Side - Landing Content */}
        <div className="p-12 flex flex-col justify-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00fff9] to-[#ff2ec4]">
              CommSphere
            </h1>
            <p className="text-xl text-gray-300">
              Reimagine communication in the digital frontier
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-4 text-white/80">
              <Code className="w-8 h-8 text-cyan-400" />
              <span>Advanced Communication Protocols</span>
            </div>
            <div className="flex items-center space-x-4 text-white/80">
              <Globe className="w-8 h-8 text-pink-400" />
              <span>Global, Secure Connectivity</span>
            </div>
            <div className="flex items-center space-x-4 text-white/80">
              <Lock className="w-8 h-8 text-purple-400" />
              <span>End-to-End Encryption</span>
            </div>
          </div>

          <div className="flex space-x-4">
            <Button 
              variant="outline" 
              className="border-cyan-400 text-cyan-400 hover:bg-cyan-400/10"
            >
              Learn More
            </Button>
            <Button 
              className="bg-gradient-to-r from-[#00fff9] to-[#ff2ec4] hover:from-[#ff2ec4] hover:to-[#00fff9] transition-all"
            >
              Get Started <ArrowRight className="ml-2" />
            </Button>
          </div>
        </div>

        {/* Right Side - Authentication */}
        <div className="bg-black/30 p-12 flex items-center justify-center">
          <div className="w-full max-w-md">
            {children}
          </div>
        </div>
      </div>

      {/* Floating Cyberpunk Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse"></div>
      </div>
    </div>
  )
}

export default AuthLayout
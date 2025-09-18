export default function ThreeDIllustration() {
  return (
    <div className="w-80 h-80 relative" data-testid="three-d-illustration">
      {/* Background gradient */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 animate-pulse" />
      
      {/* Main floating element */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-32 h-32 relative">
          {/* Central torus-like shape */}
          <div 
            className="absolute inset-4 border-8 border-cyan-400 rounded-full animate-spin"
            style={{ 
              animation: 'spin 8s linear infinite',
              borderStyle: 'solid solid transparent transparent'
            }}
          />
          <div 
            className="absolute inset-6 border-6 border-purple-400 rounded-full"
            style={{ 
              animation: 'spin 6s linear infinite reverse',
              borderStyle: 'transparent solid solid transparent'
            }}
          />
        </div>
      </div>

      {/* Floating orbs */}
      <div className="absolute top-16 right-8 w-4 h-4 bg-emerald-400 rounded-full animate-bounce" 
           style={{ animationDelay: '0s', animationDuration: '3s' }} />
      <div className="absolute bottom-20 left-8 w-3 h-3 bg-purple-400 rounded-full animate-bounce" 
           style={{ animationDelay: '1s', animationDuration: '4s' }} />
      <div className="absolute bottom-8 right-16 w-2 h-2 bg-cyan-400 rounded-full animate-bounce" 
           style={{ animationDelay: '2s', animationDuration: '5s' }} />

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent pointer-events-none rounded-full" />
    </div>
  );
}

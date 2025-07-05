export default function FeatureCard({ icon, title, desc, neonColor, style, onMouseEnter, onMouseLeave }) {
  return (
    <div
      className="relative rounded-2xl p-10 flex flex-col items-center text-center overflow-hidden"
      style={{
        ...style,
        background: "linear-gradient(145deg, #1a1a1a, #0f0f0f)",
        border: `1px solid ${neonColor}30`,
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Neon border effect */}
      <div 
        className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300"
        style={{
          background: `linear-gradient(45deg, transparent, ${neonColor}20, transparent)`,
          boxShadow: `inset 0 0 20px ${neonColor}20`,
        }}
      />
      
      {/* Icon with neon glow */}
      <div className="relative mb-8">
        <div 
          className="w-16 h-16 rounded-2xl flex items-center justify-center"
          style={{
            background: `linear-gradient(145deg, #2a2a2a, #1a1a1a)`,
            border: `1px solid ${neonColor}40`,
            boxShadow: `0 0 15px ${neonColor}30, inset 0 1px 0 ${neonColor}20`,
          }}
        >
          <div style={{ color: neonColor }}>
            {icon}
          </div>
        </div>
        {/* Icon glow */}
        <div 
          className="absolute inset-0 rounded-2xl blur-md opacity-50"
          style={{ background: neonColor }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <h3 
          className="text-xl font-bold mb-4"
          style={{ color: neonColor }}
        >
          {title}
        </h3>
        <p className="text-gray-300 text-base leading-relaxed">
          {desc}
        </p>
      </div>
    </div>
  );
}

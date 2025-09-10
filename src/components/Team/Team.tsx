import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '../../lib/gsap-config' // ScrollTrigger ya queda registrado en gsap-config
import { MessageCircle, Crown } from 'lucide-react'
import siteConfig from '../../config/site.config.json'
import { cn } from '../../utils/cn'
import { getAssetUrl } from '../../utils/assetUrl'

const roleIcons: Record<string, React.ReactNode> = {
  'Dueño': <Crown className="w-4 h-4" />,
  'Próximamente': <MessageCircle className="w-4 h-4" />
}

const roleColors: Record<string, string> = {
  'Dueño': 'from-yellow-400 to-orange-500',
  'Próximamente': 'from-gray-400 to-gray-600'
}

export const Team = () => {
  const containerRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)

  useGSAP(() => {
    // Animar título al entrar en viewport (usa ScrollTrigger ya registrado)
    gsap.from(titleRef.current, {
      y: 50,
      opacity: 0,
      duration: 1,
      scrollTrigger: {
        trigger: titleRef.current!,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      }
    })
  }, { scope: containerRef })

  return (
    <section ref={containerRef} id="team" className="relative py-20 overflow-hidden">
      <div className="section-container relative z-10">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2
            ref={titleRef}
            className="text-4xl md:text-6xl font-gaming font-bold mb-4"
          >
            <span className="gradient-text">Nuestro equipo</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Conoce al equipo dedicado detrás del servidor
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {siteConfig.team.map((member, index) => (
            <div key={member.id} className="team-card group" style={{ perspective: '1000px' }}>
              <div className="card-inner relative transform-gpu transition-transform duration-300">
                <div className="card-cyber h-full text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/5 to-neon-magenta/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Avatar */}
                  <div className="avatar-container mb-4 relative inline-block">
                    <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-neon-cyan to-neon-magenta p-[2px]">
                      <img
                        src={getAssetUrl(member.avatar)}
                        alt="Próximamente"
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>

                    {/* Role badge */}
                    <div
                      className={cn(
                        'absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-medium',
                        'bg-gradient-to-r text-white flex items-center gap-1',
                        index === 0 ? roleColors['Dueño'] : roleColors['Próximamente']
                      )}
                    >
                      {index === 0 ? roleIcons['Dueño'] : roleIcons['Próximamente']}
                      <span>{index === 0 ? 'Dueño' : 'Próximamente'}</span>
                    </div>
                  </div>

                  {/* Member info */}
                  <h3 className="text-lg font-gaming font-semibold mb-1 mt-4 text-neon-cyan">
                    {index === 0 ? 'Dueño' : 'Próximamente'}
                  </h3>
                  <p className="text-sm text-gray-400 mb-3">Próximamente</p>

                  {/* Discord username */}
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                    <span>@proximamente</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Join Team CTA */}
        <div className="mt-16 text-center">
          <p className="text-gray-400 mb-4">¿Quieres unirte al equipo?</p>
          <a
            href={siteConfig.social.discord}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            Postular en Discord
          </a>
        </div>
      </div>
    </section>
  )
}

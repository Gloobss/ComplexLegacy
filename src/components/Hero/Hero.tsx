import { useRef, useEffect, useState } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, ScrollTrigger } from '../../lib/gsap-config'
import siteConfig from '../../config/site.config.json'
import { getAssetUrl } from '../../utils/assetUrl'

export const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const characterRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)

  const [isLoading, setIsLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [playerCount, setPlayerCount] = useState(0)
  const [tipIndex, setTipIndex] = useState(0)

  // Pantalla de carga (fake)
  useEffect(() => {
    const timer = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          setIsLoading(false)
          clearInterval(timer)
          return 100
        }
        return prev + 2
      })
    }, 30)
    return () => clearInterval(timer)
  }, [])

  // Counter de jugadores
  useEffect(() => {
    const min = Math.min(100, siteConfig.server.maxPlayers)
    const targetCount = Math.floor(Math.random() * (siteConfig.server.maxPlayers - min)) + min
    const duration = 2000
    const increment = targetCount / (duration / 16)
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= targetCount) {
        setPlayerCount(targetCount)
        clearInterval(timer)
      } else {
        setPlayerCount(Math.floor(current))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [])

  // Tips rotativos
  useEffect(() => {
    if (!siteConfig.server.loadingTips?.length) return
    const t = setInterval(() => {
      setTipIndex(i => (i + 1) % siteConfig.server.loadingTips.length)
    }, 4000)
    return () => clearInterval(t)
  }, [])

  // Animaciones GSAP
  useGSAP(() => {
    if (!isLoading) {
      const tl = gsap.timeline()

      // Limpia estilos inline antiguos
      gsap.set([characterRef.current, contentRef.current, statsRef.current], { clearProps: 'all' })

      tl.from(characterRef.current, {
        x: -100,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out'
      })
        .fromTo(
          contentRef.current,
          { opacity: 0, x: 50 },
          {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: 'power3.out',
            immediateRender: false
          },
          '-=0.8'
        )
        .from(
          '.stat-item',
          {
            y: 30,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power2.out'
          },
          '-=0.4'
        )

      // Evitar que el parallax empuje/solape en pantallas bajas
      const enableParallax = typeof window !== 'undefined' && window.innerHeight > 700

      if (enableParallax) {
        ScrollTrigger.create({
          id: 'hero-character-parallax',
          trigger: containerRef.current!,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5,
          animation: gsap.to(characterRef.current, {
            yPercent: 30,
            ease: 'none'
          })
        })

        ScrollTrigger.create({
          id: 'hero-content-parallax',
          trigger: containerRef.current!,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
          animation: gsap.to(contentRef.current, {
            yPercent: 20,
            ease: 'none'
          })
        })
      }

      // Cleanup
      return () => {
        ScrollTrigger.getById('hero-character-parallax')?.kill()
        ScrollTrigger.getById('hero-content-parallax')?.kill()
      }
    }
  }, [isLoading])

  // Refrescar ScrollTrigger al cargar imágenes
  useEffect(() => {
    const onLoad = () => ScrollTrigger.refresh()
    window.addEventListener('load', onLoad)
    return () => window.removeEventListener('load', onLoad)
  }, [])

  // Loading Screen
  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <h1 className="text-7xl md:text-9xl font-bebas text-white mb-4 animate-fade-in">
            {siteConfig.server.name}
          </h1>
          <div className="w-96 max-w-full mx-auto mb-8">
            <div className="progress-bar">
              <div
                className="h-full bg-gta-gold transition-all duration-300"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
            <p className="text-gta-light text-sm mt-2">Cargando... {loadingProgress}%</p>
          </div>
          <p className="text-gta-light text-sm animate-pulse">Presiona cualquier tecla para continuar</p>
        </div>
      </div>
    )
  }

  // Helpers UI derecha
  const featurePills = (siteConfig.features || []).slice(0, 3)
  const miniImages = (siteConfig.gallery?.images || []).slice(0, 4)

  return (
    <section
      ref={containerRef}
      id="home"
      className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gta-black via-gta-graphite to-gta-black"
    >
      {/* Fondo */}
      <div className="absolute inset-0 z-0">
        <img
          src={getAssetUrl('/images/hero/legacyf.png')}
          alt="Complex Legacy"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-gta-black via-transparent to-gta-black/80" />
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-gta-black via-transparent to-transparent" />
      </div>

      {/* Contenido */}
      <div ref={heroRef} className="relative z-20 min-h-screen flex items-center">
        <div className="container-gta">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Izquierda: tarjeta visual */}
            <div ref={characterRef} className="relative z-10">
              <div className="aspect-[3/4] bg-gradient-to-br from-gta-dark to-gta-graphite rounded-lg overflow-hidden shadow-2xl">
                <img
                  src="https://r2.fivemanage.com/kMtLpNIqKRhMGpzrcZnQY/imagen1.png"
                  alt="GTA Character"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-gta-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 p-8">
                  <h2 className="text-4xl font-bebas text-gta-gold mb-2">Bienvenido a</h2>
                  <h1 className="text-6xl font-bebas text-white text-shadow-lg">Complex Legacy</h1>
                </div>
              </div>
            </div>

            {/* Derecha: información servidor */}
            <div ref={contentRef} className="relative z-20 pt-6 lg:pt-10">
              {/* Encabezado */}
              <div className="mb-6">
                <h1 className="text-5xl md:text-7xl font-bebas text-white mb-2">{siteConfig.server.name}</h1>
                <p className="text-xl text-gta-gold font-inter">{siteConfig.server.tagline}</p>
              </div>

              {/* Tips */}
              {siteConfig.server.loadingTips?.length > 0 && (
                <div className="mb-6 p-3 rounded bg-gta-graphite/50 backdrop-blur-xs border border-gta-medium">
                  <p className="text-sm text-gta-light">
                    <span className="text-gta-gold mr-2">Sugerencia:</span>
                    {siteConfig.server.loadingTips[tipIndex]}
                  </p>
                </div>
              )}

              {/* Descripción */}
              <p className="text-gta-light mb-6 text-lg leading-relaxed">{siteConfig.server.description}</p>

              {/* Pills de features */}
              {featurePills.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {featurePills.map(f => (
                    <span
                      key={f.id}
                      className="feature-pill inline-flex items-center gap-2 px-3 py-1 rounded border border-gta-medium bg-gta-graphite/50 text-sm text-white"
                    >
                      <span className="uppercase tracking-wider text-gta-gold text-xs">{f.title}</span>
                    </span>
                  ))}
                </div>
              )}

              {/* Stats */}
              <div ref={statsRef} className="grid grid-cols-2 gap-4 mb-8">
                <div className="stat-item">
                  <p className="stat-label">Jugadores Online</p>
                  <p className="stat-value">
                    {playerCount}/{siteConfig.server.maxPlayers}
                  </p>
                </div>
                <div className="stat-item">
                  <p className="stat-label">Estado del Servidor</p>
                  <p className="stat-value text-gta-green">ONLINE</p>
                </div>
                <div className="stat-item">
                  <p className="stat-label">Trabajos Activos</p>
                  <p className="stat-value">{siteConfig.jobs.list.length}+</p>
                </div>
                <div className="stat-item">
                  <p className="stat-label">Uptime</p>
                  <p className="stat-value">99.9%</p>
                </div>
              </div>

              {/* Mini-galería */}
              {miniImages.length > 0 && (
                <div className="mb-8">
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {miniImages.map(img => (
                      <div
                        key={img.id}
                        className="mini-thumb relative w-28 h-16 flex-shrink-0 rounded overflow-hidden border border-gta-medium"
                      >
                        <img src={getAssetUrl(img.src)} alt={img.alt} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-gta-black/40 to-transparent" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CTAs */}
              <div className="flex flex-wrap gap-4">
                <button className="btn-gta">Conectar al Servidor</button>
                <a
                  href={siteConfig.server.discord}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gta-outline"
                >
                  Unirse a Discord
                </a>
                {siteConfig.whitelist.enabled && (
                  <a
                    href={siteConfig.whitelist.applicationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-gta-gold"
                  >
                    Aplicar a Whitelist
                  </a>
                )}
              </div>

              {/* Dirección de conexión */}
              <div className="mt-8 p-4 bg-gta-graphite/50 backdrop-blur-sm rounded">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gta-light text-sm">Dirección del Servidor</p>
                    <p className="text-white font-mono text-lg">{siteConfig.server.ip}</p>
                  </div>
                  <button
                    onClick={() => navigator.clipboard.writeText(siteConfig.server.ip)}
                    className="px-4 py-2 bg-gta-dark hover:bg-gta-medium transition-colors rounded"
                  >
                    Copiar IP
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Indicador de scroll */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30">
        <div className="flex flex-col items-center gap-2 animate-bounce">
          <p className="text-gta-light text-sm uppercase tracking-wider">Scroll</p>
          <svg className="w-6 h-6 text-gta-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  )
}

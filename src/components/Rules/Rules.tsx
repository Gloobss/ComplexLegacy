import { useMemo, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, ScrollTrigger } from '../../lib/gsap-config'
import { AlertTriangle, Shield, Link as LinkIcon, Search } from 'lucide-react'
import siteConfig from '../../config/site.config.json'

function slugify(text: string) {
  return String(text || '')
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

/** Renderiza texto con soporte simple de listas por líneas que inician con "- " */
function RichText({ text }: { text: string }) {
  // Separamos por doble salto de línea para bloques
  const blocks = String(text || '').split(/\n\s*\n/)
  return (
    <div className="space-y-3">
      {blocks.map((blk, i) => {
        const lines = blk.split('\n').map(l => l.trim()).filter(Boolean)
        const isList = lines.length > 0 && lines.every(l => l.startsWith('- '))
        if (isList) {
          return (
            <ul key={i} className="list-disc pl-6 text-gta-light leading-relaxed">
              {lines.map((l, idx) => <li key={idx}>{l.replace(/^- /, '')}</li>)}
            </ul>
          )
        }
        return (
          <p key={i} className="text-gta-light leading-relaxed whitespace-pre-line">
            {blk}
          </p>
        )
      })}
    </div>
  )
}

export const Rules = () => {
  const containerRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const [query, setQuery] = useState('')

  // Prepara datos con anclas estables
  const rules = useMemo(() => {
    const list = siteConfig.rules || []
    return list.map((r: any) => {
      const base = r?.id ? String(r.id) : slugify(r?.title ?? 'regla')
      return { ...r, _anchor: `regla-${base}` }
    })
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return rules
    return rules.filter((r: any) =>
      String(r.title ?? '').toLowerCase().includes(q) ||
      String(r.description ?? '').toLowerCase().includes(q)
    )
  }, [rules, query])

  useGSAP(() => {
    gsap.from(titleRef.current, {
      y: 50, opacity: 0, duration: 1,
      scrollTrigger: { trigger: titleRef.current, start: 'top 85%', toggleActions: 'play none none reverse' }
    })
    const cards = gsap.utils.toArray('.rule-card') as HTMLElement[]
    cards.forEach((rule, index) => {
      gsap.from(rule, {
        y: 60, opacity: 0, duration: 0.8, delay: index * 0.06,
        scrollTrigger: { trigger: rule, start: 'top 85%', toggleActions: 'play none none reverse' }
      })
      const badge = rule.querySelector('.rule-number')
      if (badge) {
        gsap.from(badge, {
          scale: 0, rotation: 180, duration: 0.6, delay: index * 0.06 + 0.15,
          scrollTrigger: { trigger: rule, start: 'top 85%', toggleActions: 'play none none reverse' }
        })
      }
    })
    return () => {
      ScrollTrigger.getAll().forEach(t => {
        if (t.trigger && containerRef.current?.contains(t.trigger as Element)) t.kill()
      })
    }
  }, { scope: containerRef })

  const copyLink = (hash: string) => {
    const url = `${window.location.origin}${window.location.pathname}#${hash}`
    navigator.clipboard?.writeText(url)
  }

  return (
    <section ref={containerRef} id="rules" className="relative py-20 bg-gradient-to-b from-gta-black to-gta-graphite">
      <div className="container-gta">
        {/* Encabezado */}
        <div ref={titleRef} className="text-center mb-12">
          <Shield className="w-16 h-16 text-gta-gold mx-auto mb-4" />
          <h2 className="text-5xl md:text-7xl font-bebas text-white mb-4">
            Normativas del Servidor
          </h2>
          <p className="text-xl text-gta-light max-w-2xl mx-auto">
            Reglas completas, organizadas por secciones, con índice y búsqueda.
          </p>
        </div>

        {/* Layout con índice + contenido */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-3 h-fit lg:sticky lg:top-24 bg-gta-graphite/60 border border-gta-medium/10 rounded-xl p-4 shadow-card">
            <div className="flex items-center gap-2 bg-gta-black/60 border border-gta-medium/20 rounded-lg px-3 py-2">
              <Search className="w-4 h-4 text-gta-light" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar normativa…"
                className="w-full bg-transparent outline-none text-sm"
              />
            </div>
            <nav className="mt-4 space-y-1 max-h-[60vh] overflow-auto pr-1">
              {rules.map((r: any, i: number) => (
                <a
                  key={r._anchor}
                  href={`#${r._anchor}`}
                  className="block px-3 py-2 rounded-md text-gta-light hover:text-white hover:bg-gta-black/60 transition"
                >
                  <span className="text-gta-gold/80 mr-2">{String(i + 1).padStart(2, '0')}</span>
                  {r.title}
                </a>
              ))}
            </nav>
          </aside>

          {/* Contenido */}
          <div className="lg:col-span-9 space-y-6">
            {filtered.map((rule: any, index: number) => (
              <div key={rule._anchor} id={rule._anchor} className="rule-card scroll-mt-28">
                <div className="card-gta overflow-hidden">
                  <div className="flex items-start gap-6">
                    {/* Número */}
                    <div className="rule-number flex-shrink-0">
                      <div className="relative w-20 h-20">
                        <div className="absolute inset-0 bg-gradient-to-br from-gta-gold/20 to-gta-gold/5 rounded-lg" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-4xl font-bebas text-gta-gold">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                        </div>
                      </div>
                    </div>
                    {/* Texto */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-2xl font-bebas text-white mb-2">{rule.title}</h3>
                        <button
                          onClick={() => copyLink(rule._anchor)}
                          className="flex items-center gap-1 text-[11px] px-2 py-1 rounded bg-gta-black/60 border border-gta-medium/20 hover:bg-gta-black text-gta-light"
                          title="Copiar enlace directo"
                        >
                          <LinkIcon className="w-3 h-3" /> Copiar
                        </button>
                      </div>
                      <RichText text={String(rule.description || '')} />
                      <div className="flex items-center gap-2 text-gta-gold/80 text-sm mt-4">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="uppercase tracking-wider">Su incumplimiento puede conllevar sanción</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Footer */}
            <div className="rule-card">
              <div className="card-gta bg-gradient-to-br from-gta-dark to-gta-graphite text-center p-12">
                <AlertTriangle className="w-16 h-16 text-gta-gold mx-auto mb-6" />
                <h3 className="text-3xl font-bebas text-white mb-4">Recuerda</h3>
                <p className="text-gta-light mb-8 max-w-2xl mx-auto">
                  El staff puede actuar según la gravedad y el contexto. Lee el reglamento completo y mantén el fair-play.
                </p>
                <a
                  href={siteConfig.social.discord}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gta-gold inline-block"
                >
                  Abrir reglamento en Discord
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

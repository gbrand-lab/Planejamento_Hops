import { useEffect, useState } from 'react'
import { referenceMedia } from '../../data/index.js'

export default function ReferenceGallery() {
  const [lightboxIndex, setLightboxIndex] = useState(null)

  const openLightbox = (index) => setLightboxIndex(index)
  const closeLightbox = () => setLightboxIndex(null)

  const showPrev = () => {
    setLightboxIndex((i) => (i - 1 + referenceMedia.length) % referenceMedia.length)
  }
  const showNext = () => {
    setLightboxIndex((i) => (i + 1) % referenceMedia.length)
  }

  useEffect(() => {
    if (lightboxIndex === null) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeLightbox()
      else if (e.key === 'ArrowLeft') showPrev()
      else if (e.key === 'ArrowRight') showNext()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lightboxIndex])

  const current = lightboxIndex !== null ? referenceMedia[lightboxIndex] : null

  return (
    <section>
      <h2>Referências enviadas pelo cliente</h2>
      <p className="section-desc">
        Material de estilo pra orientar a captação, não são posts finais, são exemplo do tipo de imagem e
        vídeo que a marca já usa.
      </p>
      {referenceMedia.length === 0 ? (
        <div className="empty-state">
          <h3>Nenhuma referência enviada ainda</h3>
          <p>
            Assim que a Hops Beer enviar fotos/vídeos de estilo (produto, ambiente, evento), coloque os
            arquivos em <code>public/media/</code> e liste-os em <code>src/data/references.js</code> —
            essa seção preenche sozinha.
          </p>
        </div>
      ) : (
        <div className="reference-grid">
          {referenceMedia.map((m, i) => (
            <div key={m.src} className="reference-item">
              {m.type === 'video' ? (
                <video src={m.src} controls preload="metadata" />
              ) : (
                <img
                  src={m.src}
                  alt="Referência visual enviada pelo cliente"
                  loading="lazy"
                  onClick={() => openLightbox(i)}
                  style={{ cursor: 'zoom-in' }}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {current && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <button
            className="lightbox-close"
            onClick={closeLightbox}
            aria-label="Fechar tela cheia"
          >
            ×
          </button>
          <button
            className="lightbox-nav lightbox-nav--prev"
            onClick={(e) => {
              e.stopPropagation()
              showPrev()
            }}
            aria-label="Referência anterior"
          >
            ‹
          </button>
          {current.type === 'video' ? (
            <video
              src={current.src}
              controls
              autoPlay
              className="lightbox-media"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <img
              src={current.src}
              alt="Referência visual enviada pelo cliente"
              className="lightbox-media"
              onClick={(e) => e.stopPropagation()}
            />
          )}
          <button
            className="lightbox-nav lightbox-nav--next"
            onClick={(e) => {
              e.stopPropagation()
              showNext()
            }}
            aria-label="Próxima referência"
          >
            ›
          </button>
        </div>
      )}
    </section>
  )
}

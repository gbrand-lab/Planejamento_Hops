import { useRef, useState } from 'react'

const MAX_IMAGE_BYTES = 4 * 1024 * 1024
const CLIENTE = 'hopsbeer-feed'

function formatDateLong(iso) {
  const [year, month, day] = iso.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return date.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })
}

function readImageFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error('Falha ao ler a imagem.'))
    reader.readAsDataURL(file)
  })
}

function downloadImage(dataUri, filename) {
  const link = document.createElement('a')
  link.href = dataUri
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
}

function ImageThumb({ img, label, index, onRemove, onPreview }) {
  return (
    <div className="image-grid-item">
      <img
        src={img}
        alt={`${label} ${index + 1}`}
        className="image-grid-thumb image-preview-clickable"
        onClick={() => onPreview(img)}
      />
      <button
        type="button"
        className="image-grid-download"
        onClick={(e) => {
          e.stopPropagation()
          downloadImage(img, `${label.toLowerCase().replace(/\s+/g, '-')}-${index + 1}.png`)
        }}
        aria-label={`Baixar ${label.toLowerCase()}`}
        title="Baixar"
      >
        ⬇
      </button>
      {onRemove && (
        <button
          type="button"
          className="image-grid-remove"
          onClick={(e) => {
            e.stopPropagation()
            onRemove(index)
          }}
          aria-label={`Remover ${label.toLowerCase()}`}
        >
          ×
        </button>
      )}
    </div>
  )
}

function ImageSection({ label, hint, images, onAdd, onRemove, onPreview, allowPaste, large }) {
  const [dragActive, setDragActive] = useState(false)
  const [imageError, setImageError] = useState(null)
  const fileInputRef = useRef(null)

  async function addImageFiles(fileList) {
    const files = Array.from(fileList)
    if (files.length === 0) return
    setImageError(null)

    const validos = []
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        setImageError('Selecione apenas arquivos de imagem.')
        continue
      }
      if (file.size > MAX_IMAGE_BYTES) {
        setImageError('Cada imagem deve ter no máximo 4MB.')
        continue
      }
      validos.push(file)
    }
    if (validos.length === 0) return

    try {
      const novas = await Promise.all(validos.map(readImageFile))
      onAdd(novas)
    } catch {
      setImageError('Falha ao ler uma ou mais imagens.')
    }
  }

  function handleInputChange(e) {
    if (e.target.files) addImageFiles(e.target.files)
    e.target.value = ''
  }

  function handleDragOver(e) {
    e.preventDefault()
    setDragActive(true)
  }

  function handleDragLeave(e) {
    e.preventDefault()
    setDragActive(false)
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragActive(false)
    if (e.dataTransfer.files) addImageFiles(e.dataTransfer.files)
  }

  function handlePaste(e) {
    if (!allowPaste) return
    const items = e.clipboardData?.items
    if (!items) return
    const files = []
    for (const item of items) {
      if (item.type && item.type.startsWith('image/')) {
        const file = item.getAsFile()
        if (file) files.push(file)
      }
    }
    if (files.length > 0) {
      e.preventDefault()
      addImageFiles(files)
    }
  }

  return (
    <div className={`image-section ${large ? 'image-section--large' : ''}`}>
      <span className="image-section-label">{label}</span>
      <div
        className={dragActive ? 'dropzone dropzone-active' : 'dropzone'}
        tabIndex={allowPaste ? 0 : undefined}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onPaste={allowPaste ? handlePaste : undefined}
      >
        <span>{hint}{allowPaste ? ' — ou clique aqui e cole (Ctrl+V)' : ''}</span>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleInputChange}
          className="dropzone-input"
        />
      </div>
      {imageError && <span className="field-error">{imageError}</span>}

      {images.length > 0 && (
        <div className="image-grid">
          {images.map((img, index) => (
            <ImageThumb
              key={index}
              img={img}
              label={label}
              index={index}
              onRemove={onRemove ? (i) => onRemove(i) : null}
              onPreview={onPreview}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function PostPage({ date, post, onSave, onDelete, onCancel, onPreview, confirming }) {
  const [dataPost, setDataPost] = useState(post?.data ?? date)
  const [descricao, setDescricao] = useState(post?.descricao ?? '')
  const [referenciaImagens, setReferenciaImagens] = useState(post?.referenciaImagens ?? [])
  const [materialImagens, setMaterialImagens] = useState(post?.materialImagens ?? [])
  const [fotoProntaImagens, setFotoProntaImagens] = useState(post?.fotoProntaImagens ?? [])
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  function addTo(setter) {
    return (novas) => setter((prev) => [...prev, ...novas])
  }

  function removeFrom(setter) {
    return (index) => setter((prev) => prev.filter((_, i) => i !== index))
  }

  async function handleSave() {
    if (!descricao.trim()) {
      setError('A legenda é obrigatória.')
      return
    }
    setError(null)
    setSubmitting(true)
    try {
      await onSave({
        data: dataPost,
        cliente: CLIENTE,
        descricao: descricao.trim(),
        referenciaImagens,
        materialImagens,
        fotoProntaImagens,
      })
    } catch {
      // erro já é exibido pelo componente pai
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="post-page">
      <div className="post-page-header">
        <input
          type="date"
          className="post-page-date"
          value={dataPost}
          onChange={(e) => setDataPost(e.target.value)}
        />
        <div className="post-page-header-actions">
          {post && (
            <button
              className={confirming ? 'btn-link btn-danger' : 'btn-link'}
              onClick={onDelete}
              type="button"
            >
              {confirming ? 'confirmar exclusão?' : 'excluir'}
            </button>
          )}
          {!post && (
            <button className="btn-link" onClick={onCancel} type="button">
              cancelar
            </button>
          )}
        </div>
      </div>

      <div className="post-page-columns">
        <div className="post-page-col">
          <div className="field">
            <label htmlFor={`copy-${post?.id ?? 'new'}`}>Copy</label>
            <textarea
              id={`copy-${post?.id ?? 'new'}`}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              rows={5}
              placeholder="Legenda / texto do post"
            />
            {error && <span className="field-error">{error}</span>}
          </div>

          <ImageSection
            label="Referência"
            hint="Arraste a referência aqui ou clique para escolher"
            images={referenciaImagens}
            onAdd={addTo(setReferenciaImagens)}
            onRemove={removeFrom(setReferenciaImagens)}
            onPreview={onPreview}
          />

          <ImageSection
            label="Material"
            hint="Arraste o material aqui ou clique para escolher"
            images={materialImagens}
            onAdd={addTo(setMaterialImagens)}
            onRemove={removeFrom(setMaterialImagens)}
            onPreview={onPreview}
          />
        </div>

        <div className="post-page-col">
          <ImageSection
            label="Material pronto"
            hint="Arraste a foto pronta aqui"
            images={fotoProntaImagens}
            onAdd={addTo(setFotoProntaImagens)}
            onRemove={removeFrom(setFotoProntaImagens)}
            onPreview={onPreview}
            allowPaste
            large
          />
        </div>
      </div>

      <div className="post-page-actions">
        <button type="button" className="btn-primary" onClick={handleSave} disabled={submitting}>
          {submitting ? 'Salvando...' : 'Salvar'}
        </button>
      </div>
    </div>
  )
}

export default function PostDrawer({ date, posts, onClose, onCreate, onUpdate, onDelete }) {
  const [addingNew, setAddingNew] = useState(posts.length === 0)
  const [confirmingId, setConfirmingId] = useState(null)
  const [fullscreenImage, setFullscreenImage] = useState(null)

  async function handleCreateNew(input) {
    await onCreate(input)
    setAddingNew(false)
  }

  function handleDeleteClick(id) {
    if (confirmingId === id) {
      onDelete(id)
      setConfirmingId(null)
      return
    }
    setConfirmingId(id)
    setTimeout(() => setConfirmingId((current) => (current === id ? null : current)), 4000)
  }

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer drawer--wide" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <h2>{formatDateLong(date)}</h2>
          <button className="btn-secondary" onClick={onClose}>fechar</button>
        </div>

        <div className="drawer-posts">
          {posts.map((post) => (
            <PostPage
              key={post.id}
              date={date}
              post={post}
              onSave={(input) => onUpdate(post.id, input)}
              onDelete={() => handleDeleteClick(post.id)}
              onPreview={setFullscreenImage}
              confirming={confirmingId === post.id}
            />
          ))}

          {addingNew && (
            <PostPage
              date={date}
              post={null}
              onSave={handleCreateNew}
              onCancel={() => setAddingNew(false)}
              onPreview={setFullscreenImage}
            />
          )}
        </div>

        {!addingNew && (
          <button className="btn-primary drawer-add-btn" onClick={() => setAddingNew(true)}>
            + Adicionar post neste dia
          </button>
        )}
      </div>

      {fullscreenImage && (
        <div
          className="image-fullscreen-overlay"
          onClick={(e) => {
            e.stopPropagation()
            setFullscreenImage(null)
          }}
        >
          <button
            className="btn-secondary image-fullscreen-download"
            onClick={(e) => {
              e.stopPropagation()
              downloadImage(fullscreenImage, 'foto.png')
            }}
          >
            baixar
          </button>
          <button
            className="btn-secondary image-fullscreen-close"
            onClick={(e) => {
              e.stopPropagation()
              setFullscreenImage(null)
            }}
          >
            fechar
          </button>
          <img src={fullscreenImage} alt="Foto em tela cheia" className="image-fullscreen-img" />
        </div>
      )}
    </div>
  )
}

export { CLIENTE }

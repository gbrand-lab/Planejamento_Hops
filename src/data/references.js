// Material de referência enviado pelo cliente, vive em /public/media e é
// servido como arquivo estático (Vite copia public/ pra raiz do build).
// Nenhuma referência foi enviada ainda pra Hops Beer — adicione os arquivos
// em public/media/ e liste-os aqui quando chegarem.
const files = []

export const referenceMedia = files.map((f) => ({
  ...f,
  src: `/media/${encodeURIComponent(f.file)}`,
}))

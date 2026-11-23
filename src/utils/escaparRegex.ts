export function escaparRegex(texto: string) {
  return texto.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
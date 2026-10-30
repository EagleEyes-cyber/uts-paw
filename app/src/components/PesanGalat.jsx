export default function PesanGalat({ pesan }) {
  if (!pesan) return null
  return <p role="alert">{pesan}</p>
}
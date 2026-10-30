export default function FieldForm({ id, label, nilai, onUbah, tipe = 'text' }) {
  return (
    <>
      <label htmlFor={id}>{label}</label>
      <input id={id} name={id} type={tipe} value={nilai} onChange={onUbah} />
    </>
  )
}
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useKoleksi from '../hooks/useKoleksi.js'
import FieldForm from '../components/FieldForm.jsx'
import PesanGalat from '../components/PesanGalat.jsx'
import './Tambah.css'

const AWAL = { judul: '', kategori: '', teknologi: '', tahun: '', tautan: '' }

export default function Tambah() {
  const { tambah } = useKoleksi()
  const navigate = useNavigate()
  const [form, setForm] = useState(AWAL)
  const [galat, setGalat] = useState('')

  const ubah = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const simpan = (e) => {
    e.preventDefault()
    if (form.judul.trim().length < 3) {
      setGalat('Judul wajib diisi, minimal 3 karakter.')
      return
    }
    tambah({ ...form, judul: form.judul.trim(), tahun: Number(form.tahun) || form.tahun })
    navigate('/koleksi')
  }

  return (
    <form className="formulir" onSubmit={simpan} noValidate>
      <h1>Tambah Proyek</h1>

      <FieldForm id="judul" label="Judul" nilai={form.judul} onUbah={ubah} />
      <PesanGalat pesan={galat} />

      <label htmlFor="kategori">Kategori</label>
      <select id="kategori" name="kategori" value={form.kategori} onChange={ubah}>
        <option>Web</option>
        <option>Mobile</option>
        <option>Data</option>
        <option>Desain</option>
        <option>Desktop</option>
      </select>

      <FieldForm id="teknologi" label="Teknologi" nilai={form.teknologi} onUbah={ubah} />
      <FieldForm id="tahun" label="Tahun" tipe="number" nilai={form.tahun} onUbah={ubah} />
      <FieldForm id="tautan" label="Tautan" nilai={form.tautan} onUbah={ubah} />

      <button type="submit">Simpan</button>
    </form>
  )
}
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, expect, test } from 'vitest'
import App from './App.jsx'

const DATA = [
  { id: '1', judul: 'Toko Online Sembako', kategori: 'Web', teknologi: 'React', tahun: 2025, tautan: 'https://a.test' },
  { id: '2', judul: 'Pelacak Kebugaran', kategori: 'Mobile', teknologi: 'Flutter', tahun: 2026, tautan: 'https://b.test' },
  { id: '3', judul: 'Dasbor Penjualan', kategori: 'Web', teknologi: 'Vue', tahun: 2024, tautan: 'https://c.test' },
]

beforeEach(() => {
  localStorage.setItem('uts-paw-koleksi', JSON.stringify(DATA))
})

function buka(path) {
  const user = userEvent.setup()
  render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  )
  return user
}

test('rute tidak dikenal menampilkan 404', () => {
  buka('/tidak-ada')
  expect(screen.getByRole('heading', { name: '404' })).toBeInTheDocument()
})

test('beranda hanya punya satu judul utama', () => {
  buka('/')
  expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
})

test('koleksi menampilkan item dan pencarian menyaring berdasarkan judul', async () => {
  const user = buka('/koleksi')
  expect(screen.getByText('Toko Online Sembako')).toBeInTheDocument()
  expect(screen.getByText('Pelacak Kebugaran')).toBeInTheDocument()
  await user.type(screen.getByRole('searchbox'), 'kebugaran')
  expect(screen.getByText('Pelacak Kebugaran')).toBeInTheDocument()
  expect(screen.queryByText('Toko Online Sembako')).not.toBeInTheDocument()
})

test('detail dengan id yang tidak ada menampilkan pesan tidak ditemukan', () => {
  buka('/koleksi/xyz')
  expect(screen.getByText(/tidak ditemukan/i)).toBeInTheDocument()
})

test('form tambah menolak judul kosong dengan pesan error', async () => {
  const user = buka('/tambah')
  await user.click(screen.getByRole('button', { name: /simpan/i }))
  expect(screen.getByRole('alert')).toBeInTheDocument()
})

test('form tambah menyimpan proyek baru yang lalu muncul di koleksi', async () => {
  const user = buka('/tambah')
  await user.type(screen.getByLabelText('Judul'), 'Aplikasi Baru')
  await user.type(screen.getByLabelText('Teknologi'), 'Svelte')
  await user.type(screen.getByLabelText('Tahun'), '2026')
  await user.click(screen.getByRole('button', { name: /simpan/i }))
  expect(await screen.findByText('Aplikasi Baru')).toBeInTheDocument()
})

test('statistik menampilkan tabel jumlah item per kategori', () => {
  buka('/statistik')
  const baris = within(screen.getByRole('table')).getByRole('row', { name: /Web/ })
  expect(within(baris).getByText('2')).toBeInTheDocument()
})
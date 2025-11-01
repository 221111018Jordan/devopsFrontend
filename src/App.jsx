import { useState, useEffect } from 'react'; // <-- Impor useEffect
import './App.css';

// Tentukan URL API backend Anda
const API_URL = 'http://localhost:4000/tasks';

function App() {
  // --- STATE ---
  // State tasks sekarang dimulai dengan array kosong
  const [tasks, setTasks] = useState([]);

  // State lain tetap sama
  const [inputText, setInputText] = useState('');
  const [editingId, setEditingId] = useState(null);

  // --- EFEK (READ) ---
  /**
   * [READ]
   * Gunakan useEffect untuk mengambil data dari API saat komponen dimuat.
   */
  useEffect(() => {
    fetchTasks();
  }, []); // Array dependensi kosong berarti ini hanya berjalan sekali

  // Fungsi untuk mengambil data
  const fetchTasks = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setTasks(data); // Set state dengan data dari server
    } catch (error) {
      console.error('Gagal mengambil tugas:', error);
    }
  };

  // --- HANDLERS (LOGIKA CRUD) ---

  /**
   * Menangani submit form (CREATE dan UPDATE)
   * Sekarang menjadi fungsi 'async'
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    if (editingId !== null) {
      // --- UPDATE ---
      try {
        const response = await fetch(`${API_URL}/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: inputText }),
        });
        const updatedTask = await response.json();

        // Update state lokal
        setTasks(
          tasks.map((task) =>
            task.id === editingId ? updatedTask : task
          )
        );
        setEditingId(null);

      } catch (error) {
        console.error('Gagal mengupdate tugas:', error);
      }
    } else {
      // --- CREATE ---
      try {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: inputText }),
        });
        const newTask = await response.json(); // Dapatkan tugas baru (dgn ID) dari server

        // Tambahkan ke state lokal
        setTasks([...tasks, newTask]);

      } catch (error) {
        console.error('Gagal menambah tugas:', error);
      }
    }

    setInputText('');
  };

  /**
   * Menyiapkan form untuk mode UPDATE.
   * (Tidak perlu diubah, ini murni logika state lokal)
   */
  const handleEdit = (task) => {
    setEditingId(task.id);
    setInputText(task.text);
  };

  /**
   * [DELETE]
   * Menghapus tugas berdasarkan ID.
   * Sekarang menjadi fungsi 'async'
   */
  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus tugas ini?')) {
      try {
        // Kirim request DELETE ke server
        await fetch(`${API_URL}/${id}`, {
          method: 'DELETE',
        });

        // Jika berhasil, update state lokal
        setTasks(tasks.filter((task) => task.id !== id));

        if (id === editingId) {
          setEditingId(null);
          setInputText('');
        }
      } catch (error) {
        console.error('Gagal menghapus tugas:', error);
      }
    }
  };

  /**
   * Membatalkan mode edit.
   * (Tidak perlu diubah)
   */
  const handleCancelEdit = () => {
    setEditingId(null);
    setInputText('');
  };

  // --- RENDER (VIEW) ---
  // Bagian JSX (return) sama persis dengan kode Anda sebelumnya!
  // Tidak perlu ada perubahan di sini.
  return (
    <div className="app-container">
      <h1>Daftar Tugas (Full Stack CRUD)</h1>

      <form onSubmit={handleSubmit} className="task-form">
        <input
          type="text"
          placeholder="Masukkan tugas baru..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <button type="submit">
          {editingId !== null ? 'Update' : 'Tambah'}
        </button>
        {editingId !== null && (
          <button type="button" onClick={handleCancelEdit} className="cancel-btn">
            Batal
          </button>
        )}
      </form>

      <ul className="task-list">
        {/* Tambahkan pesan jika tidak ada tugas */}
        {tasks.length === 0 && (
          <p style={{ textAlign: 'center', color: '#888' }}>
            Belum ada tugas...
          </p>
        )}

        {tasks.map((task) => (
          <li key={task.id}>
            <span>{task.text}</span>
            <div className="task-buttons">
              <button onClick={() => handleEdit(task)} className="edit-btn">
                Edit
              </button>
              <button onClick={() => handleDelete(task.id)} className="delete-btn">
                Hapus
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
import { useState } from 'react';
import './App.css';

function App() {
  // --- STATE ---
  // State untuk menyimpan daftar tugas
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Belajar React' },
    { id: 2, text: 'Mengerjakan Proyek CRUD' },
  ]);

  // State untuk menyimpan input dari form
  const [inputText, setInputText] = useState('');

  // State untuk melacak ID tugas yang sedang diedit
  // null berarti kita sedang dalam mode "Tambah" (Create)
  // angka berarti kita sedang dalam mode "Edit" (Update)
  const [editingId, setEditingId] = useState(null);

  // --- HANDLERS (LOGIKA CRUD) ---

  /**
   * Menangani submit form.
   * Ini akan berfungsi sebagai CREATE atau UPDATE tergantung pada state 'editingId'.
   */
  const handleSubmit = (e) => {
    e.preventDefault(); // Mencegah refresh halaman
    if (!inputText.trim()) return; // Jangan tambahkan jika input kosong

    if (editingId !== null) {
      // --- UPDATE ---
      // Jika 'editingId' ada, kita sedang mengedit.
      setTasks(
        tasks.map((task) =>
          task.id === editingId ? { ...task, text: inputText } : task
        )
      );
      // Kembalikan ke mode "Tambah"
      setEditingId(null);
    } else {
      // --- CREATE ---
      // Jika 'editingId' null, kita sedang menambah tugas baru.
      const newId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
      const newTask = { id: newId, text: inputText };
      setTasks([...tasks, newTask]);
    }

    // Bersihkan input setelah submit
    setInputText('');
  };

  /**
   * Menyiapkan form untuk mode UPDATE.
   */
  const handleEdit = (task) => {
    // Set 'editingId' ke ID tugas yang dipilih
    setEditingId(task.id);
    // Isi form input dengan teks tugas yang ada
    setInputText(task.text);
  };

  /**
   * Menghapus tugas berdasarkan ID.
   * Ini adalah operasi DELETE.
   */
  const handleDelete = (id) => {
    // Konfirmasi sebelum menghapus
    if (window.confirm('Apakah Anda yakin ingin menghapus tugas ini?')) {
      setTasks(tasks.filter((task) => task.id !== id));
      
      // Jika tugas yang dihapus adalah yang sedang diedit, reset form
      if (id === editingId) {
        setEditingId(null);
        setInputText('');
      }
    }
  };

  /**
   * Membatalkan mode edit.
   */
  const handleCancelEdit = () => {
    setEditingId(null);
    setInputText('');
  };

  // --- RENDER (VIEW) ---
  return (
    <div className="app-container">
      <h1>Daftar Tugas (CRUD Sederhana)</h1>

      {/* Form untuk CREATE dan UPDATE */}
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
        {/* Tampilkan tombol "Batal" hanya saat mode edit */}
        {editingId !== null && (
          <button type="button" onClick={handleCancelEdit} className="cancel-btn">
            Batal
          </button>
        )}
      </form>

      {/* Daftar Tugas (Operasi READ) */}
      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task.id}>
            <span>{task.text}</span>
            <div className="task-buttons">
              {/* Tombol untuk masuk mode UPDATE */}
              <button onClick={() => handleEdit(task)} className="edit-btn">
                Edit
              </button>
              {/* Tombol untuk DELETE */}
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
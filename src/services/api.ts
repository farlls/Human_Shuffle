import axios from "axios";
import type { User } from "@/types/user"; // Impor tipe data yang sudah kita buat

// Buat instance axios dengan baseURL agar lebih rapi
const apiClient = axios.create({
  baseURL: "https://randomuser.me/api",
});

// Definisikan tipe untuk response dari API
interface ApiResponse {
  results: User[];
}

/**
 * Fungsi reusable untuk mengambil data pengguna dari API.
 * @param count Jumlah pengguna yang ingin diambil (default 6).
 * @returns Sebuah promise yang akan resolve dengan array berisi objek User.
 */
export const fetchUsers = async (count: number = 27): Promise<User[]> => {
  try {
    // Gunakan instance apiClient untuk membuat GET request
    // Axios secara otomatis akan melempar error jika status response bukan 2xx
    const response = await apiClient.get<ApiResponse>(`/?results=${count}`);
    return response.data.results;
  } catch (error) {
    // Log error asli untuk debugging
    console.error("Gagal mengambil data dari API:", error);
    // Lempar error baru dengan pesan yang lebih ramah untuk ditangkap oleh komponen
    throw new Error("Tidak dapat memuat data pengguna. Coba lagi nanti.");
  }
};

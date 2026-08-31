// Background removal needs either a client-side ML model (tens of MB of
// WASM/ONNX — at odds with this app's "ringan, initial bundle kecil"
// principle, see the lazy-loading pattern used everywhere else) or a
// server-side API. Neither is wired up yet. This is the single place that
// will change once one is: swap the throw below for a real call, e.g.
//   const res = await fetch(import.meta.env.VITE_BG_REMOVE_ENDPOINT, {...})
// A real API key belongs in that backend endpoint's own environment, never
// in this frontend bundle.
export async function removeBackground(/* file */) {
  throw new Error(
    "Background Remover belum tersedia — fitur ini butuh model AI atau API eksternal yang belum dikonfigurasi. Coba tools lain seperti Image Cropper atau Kompres Foto."
  );
}

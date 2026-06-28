window.addEventListener("load", () => {

  setTimeout(() => {

    document
      .getElementById("splashScreen")
      .classList
      .add("splash-hide");

  }, 3000);

});

let isSubmitting = false;

document
  .getElementById("formPermohonan")
  .addEventListener("submit", async function (e) {

    e.preventDefault();

    if (isSubmitting) return;

    isSubmitting = true;

    const submitBtn =
      document.querySelector(
        '#formPermohonan button[type="submit"]'
      );

    submitBtn.disabled = true;
    submitBtn.textContent = "Mengirim Permohonan...";

    const data = {

      namaDriver: "",

      noBadge: "",

      fleetCode: "",

      jenisKendaraan: "",

      drivercontact: "",

      tanggalPermintaan:
        document.getElementById("tglPermohonan").value,

      department: "",

      statusJabatan: "",

      tanggalAwalPekerjaan:
        document.getElementById("tglMulai").value,

      jamAwalPekerjaan:
        document.getElementById("jamMulai").value,

      jamAkhirPekerjaan:
        document.getElementById("jamSelesai").value,

      pemberiPekerjaan: "",

      pemintaPekerjaan:
        document.getElementById("pemohon").value,
      
     fungsi:
  document.getElementById("fungsi").value,

      tanggalAkhirPekerjaan:
        document.getElementById("tglSelesai").value,

      summaryPekerjaan:
        document.getElementById("summaryPekerjaan").value,

      status: "Pending"
    };

    try {

      const jumlah = parseInt(
  document.getElementById("jumlahkendaraan").value
) || 1;

let semuaBerhasil = true;

for (let i = 0; i < jumlah; i++) {

  const response = await fetch(
    "https://script.google.com/macros/s/AKfycbwNb9HlH8Xa5chSINIUb7Ti1OjA_4PoAqJ5p3u6qbTbbe-w39JIlPgK-J6QnRreFvUwdA/exec",
    {
      method: "POST",
      body: JSON.stringify(data)
    }
  );

  const result = await response.json();

  if (!result.success) {
    semuaBerhasil = false;
    break;
  }

}

if (semuaBerhasil) {
  // ================= SIMPAN TOKEN USER =================

  if (window.fcmToken) {

    fetch(
      "https://script.google.com/macros/s/AKfycbwNb9HlH8Xa5chSINIUb7Ti1OjA_4PoAqJ5p3u6qbTbbe-w39JIlPgK-J6QnRreFvUwdA/exec",
      {

        method: "POST",

        body: JSON.stringify({

          action: "saveToken",

          namaPemohon: data.pemintaPekerjaan,

          token: window.fcmToken

        })

      }

    )
    .then(res => res.json())
    .then(res => console.log("Token berhasil disimpan", res))
    .catch(err => console.error("Gagal simpan token:", err));

  }

  document
    .getElementById("successScreen")
    .classList
    .add("show");

  document
    .getElementById("formPermohonan")
    .reset();

  setTimeout(() => {

    document
      .getElementById("successScreen")
      .classList
      .remove("show");

  }, 7000);

}
      
    } catch (error) {

      alert("Gagal mengirim data");

      console.error(error);

    } finally {

      submitBtn.disabled = false;
      submitBtn.textContent = "Simpan Permohonan";

      isSubmitting = false;

    }

  });

function toggleReservationSearch() {

  const box = document.getElementById("reservationSearchBox");

  if (
    box.style.display === "none" ||
    box.style.display === ""
  ) {

    box.style.display = "block";

  } else {

    box.style.display = "none";

    document.getElementById("reservationResult").style.display = "none";

  }

}

// menyimpan data reservasi yang sedang dibuka
let currentReservation = null;

// ======================
// CEK STATUS RESERVASI
// ======================

async function cekReservasi() {

  const nama =
    document
      .getElementById("searchReservation")
      .value
      .trim();

  if (!nama) {
    alert("Masukkan nama pemohon.");
    return;
  }

  const result =
    document.getElementById("reservationResult");

  result.style.display = "block";
  result.innerHTML = "<p>Memeriksa reservasi...</p>";

  try {

    // ==========================
    // AMBIL DATA STJ
    // ==========================

    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbwNb9HlH8Xa5chSINIUb7Ti1OjA_4PoAqJ5p3u6qbTbbe-w39JIlPgK-J6QnRreFvUwdA/exec?action=search&nama=" +
      encodeURIComponent(nama)
    );

    const data = await response.json();

    console.log("DATA RESERVASI:", data);
    
    console.log(data);
console.log(data.reservations);

    if (!data || !data.success) {

      result.innerHTML = `
      <div class="status-card pending">
        <h3>Reservasi Tidak Ditemukan</h3>
        <p>Pastikan nama pemohon benar.</p>
      </div>
      `;
      return;
    }

   currentReservation = data.reservations;

    // ==========================
    // STATUS CHECK AMAN
    // ==========================

  const status = String(
  data.reservations[0].status || ""
).toLowerCase();

    if (status === "pending") {

      result.innerHTML = `
      <div class="status-card pending">
        <h3>🟡 Permohonan Sedang Diproses</h3>
        <p>Dispatcher sedang menyiapkan Driver dan Kendaraan.</p>
      </div>
      `;

      return;
    }

    // ==========================
    // FOTO DRIVER
    // ==========================

   // ==========================
// FOTO DRIVER
// ==========================

const defaultPhoto =
  "https://i.postimg.cc/NMRDPgT5/GS-dispacer.jpg";

let biodata = [];

try {

  const biodataResponse = await fetch(
    "https://script.google.com/macros/s/AKfycbyxB_Bo2GNbb3EMc2JcPuUNmHHXMCSZndSjGDHiQFJ5R6GW49BxJsdjDCdcgtliZAE/exec?action=readBiodata"
  );

  biodata = await biodataResponse.json();

} catch (err) {

  console.log("Error biodata:", err);

}

// ==========================
// TAMPILKAN UI
// ==========================

let html = "";

for (const item of data.reservations) {

  // Cari driver berdasarkan badge
  const driver = biodata.find(d =>
    String(d.badge || "").trim() ===
    String(item.badge || "").trim()
  );

  // Foto driver
  const photoDriver =
    driver?.photo || defaultPhoto;

  // Nomor driver
  const driverContact =
    driver?.contact || item.driverContact;

  html += `

<div class="status-card open">

  <div style="text-align:center;">

    <img
      src="${photoDriver}"
      style="
        width:120px;
        height:160px;
        object-fit:cover;
        border-radius:8px;
        border:2px solid #ccc;
        margin-bottom:15px;
      ">

    <h3>🟢 Driver & Kendaraan Sudah Disiapkan</h3>

  </div>

  <table style="width:100%;">

    <tr>
      <td><b>Driver</b></td>
      <td>: ${item.driver || "-"}</td>
    </tr>

    <tr>
      <td><b>Driver Contact</b></td>
      <td>:
        ${
          driverContact
            ? `<a href="https://wa.me/${driverContact.replace(/^0/, "62").replace(/\D/g, "")}?text=${encodeURIComponent(`Halo Mas ${item.driver}, saya diarahkan oleh dispatcher kepada Mas terkait reservasi kendaraan.`)}"
                 target="_blank"
                 style="color:#25D366;font-weight:bold;text-decoration:none;">
                 ${driverContact}
               </a>`
            : "-"
        }
      </td>
    </tr>

    <tr>
      <td><b>Fleet</b></td>
      <td>: ${item.fleet || "-"}</td>
    </tr>

    <tr>
      <td><b>Kendaraan</b></td>
      <td>: ${item.vehicle || "-"}</td>
    </tr>

    <tr>
      <td><b>Dispatcher</b></td>
      <td>: ${item.dispatcher || "-"}</td>
    </tr>

  </table>

</div>

`;

}

result.innerHTML = html;
  } catch (err) {

    console.error("ERROR CEK RESERVASI:", err);

    result.innerHTML = `
    <div class="status-card pending">
      <h3>Terjadi Kesalahan</h3>
      <p>Gagal mengambil data reservasi.</p>
    </div>
    `;
  }
}

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
  
   const pemohon = document
  .getElementById("pemohon")
  .value
  .trim();

// Cari nomor HP Indonesia
const nomorHP = pemohon.match(/(?:\+62|62|0)8\d[\d\s-]{7,}/);

if (!nomorHP) {

  alert("Silakan isi nama anda beserta nomor handphone.\n\nContoh:\nBudi 0852 1234 4321");

  submitBtn.disabled = false;
  submitBtn.textContent = "Kirim Permohonan";
  isSubmitting = false;

  document.getElementById("pemohon").focus();

  return;
}

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

function openReservationModal(){

    document.getElementById("reservationModal").style.display="block";

}

function closeReservationModal(){

    document.getElementById("reservationModal").style.display="none";

}

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

  const pemohon = document
    .getElementById("searchReservation")
    .value
    .trim();

  // Wajib diisi
  if (!pemohon) {

    alert(
      "Silakan isi nama beserta nomor handphone.\n\nContoh:\nBudi 0852 1234 4321"
    );

    document.getElementById("searchReservation").focus();
    return;
  }

  // Cari nomor HP Indonesia
  const nomorHP = pemohon.match(/(?:\+62|62|0)8\d[\d\s-]{7,}/);

  if (!nomorHP) {

    alert(
      "Silakan isi nama beserta nomor handphone yang didaftarkan di form.\n\nContoh:\nBudi 0852 1234 4321"
    );

    document.getElementById("searchReservation").focus();
    return;
  }

  openReservationModal();

  const result =
    document.getElementById("reservationResult");

  result.innerHTML = `
  <div style="text-align:center;padding:40px;">
      <h3>Memeriksa Data Reservasi...</h3>
  </div>
  `;

  try {

    // ==========================
    // AMBIL DATA STJ
    // ==========================

    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbwNb9HlH8Xa5chSINIUb7Ti1OjA_4PoAqJ5p3u6qbTbbe-w39JIlPgK-J6QnRreFvUwdA/exec?action=search&nama=" +
      encodeURIComponent(pemohon)
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
).trim().toLowerCase();

// ==========================
// STATUS PENDING
// ==========================

if (status === "pending") {

  result.innerHTML = `
  <div class="status-card pending">
    <h3>🟡 Permohonan Sedang Diproses</h3>
    <p>Dispatcher sedang menyiapkan Driver dan Kendaraan.
    Terimakasih sudah aktif mengecek reservasi anda</p>
  </div>
  `;

  return;
}

// ==========================
// STATUS FULL JOB
// ==========================

if (
  status === "kendaraan full job" ||
  status === "kendaraan full job"
) {

  result.innerHTML = `
  <div class="status-card rejected">
    <h3>🔴 Permohonan Ditolak</h3>
    <p>
      Mohon maaf, seluruh Armada kami saat ini sedang beroprasi
      (<b>kendaraan full job</b>), sehingga permohonan reservasi anda tidak dapat diproses.     
    </p>
    
     <p>      
     silakan di lakukan pengecakan di (<b>Status kendaraan</b>).
     untuk pengecekan kendaraan yang stanby
     </p>
     
  </div>
  `;

  return;
}
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
     <h4> Silakan Klik No Driver berikut </h4>

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
            ? `<a href="https://wa.me/${driverContact.replace(/^0/, "62").replace(/\D/g, "")}?text=${encodeURIComponent(`Halo Mas ${item.driver}, saya diarahkan oleh dispatcher kepada Mas ${item.driver} terkait reservasi kendaraan.`)}"
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

async function openstatuskendaraan() {

    const daftarKendaraan = [
        "JBI-05 BH 8578 NA",       
        "JBI-07 BH 8582 NA",
        "JBI-08 BH 8629 NA",
        "JBI-09 BH 8610 NA",
        "JBI-17 BH 8634 NA",
        "JBI-21 BH 8621 NA",
        "JBI-27 BH 8586 NA",
        "JBI-48 BH 8625 NA",
        "JBI-062 BH 8631 NA",
        "JBI-64 BH 8572 NA",
        "PSU-11 BK 1076 PZ",
        "PHR1-04 BH 1289 YR",
        "PHR1-17 BH 1271 YR",
        "PHR1-22 BH 7419 AI",
        "PHR1-23 BH 7420 AI"
    ];

    const modal = document.getElementById("kendaraanModal");
    const list = document.getElementById("kendaraanList");

    modal.style.display = "block";

    list.innerHTML = `
        <div style="padding:35px;text-align:center;">
            <div class="loader"></div>
            <div style="margin-top:15px;font-weight:600;color:#607d8b;">
                Mengambil data kendaraan...
            </div>
        </div>
    `;

    const kendaraanAktif = [];

    const statusOnJob = [
        "open",
        "on job",
        "progress",
        "running"
    ];

    try {

        const response = await fetch(
            "https://script.google.com/macros/s/AKfycbwNb9HlH8Xa5chSINIUb7Ti1OjA_4PoAqJ5p3u6qbTbbe-w39JIlPgK-J6QnRreFvUwdA/exec?t=" + Date.now()
        );

        const data = await response.json();

        data.forEach(item => {

            const fleet = String(item.fleetCode || "").trim();

            const status = String(item.status || "")
                .trim()
                .toLowerCase();

            if (
                statusOnJob.includes(status) &&
                !kendaraanAktif.includes(fleet)
            ) {
                kendaraanAktif.push(fleet);
            }

        });

        const sekarang = new Date();

        const tanggalUpdate =
            String(sekarang.getDate()).padStart(2, "0") +
            "-" +
            String(sekarang.getMonth() + 1).padStart(2, "0") +
            "-" +
            sekarang.getFullYear();

        list.innerHTML = `
            <div class="kendaraan-header">
                <div> No Lambung</div>
                <div style="text-align:center;">Update</div>
                <div style="text-align:right;">Status</div>
            </div>
        `;

        daftarKendaraan.forEach(kendaraan => {

            const aktif = kendaraanAktif.includes(kendaraan);

            list.innerHTML += `

                <div class="kendaraan-item">

                    <div class="fleet-col">
                         ${kendaraan}
                    </div>

                    <div class="tanggal-col">
                        ${tanggalUpdate}
                    </div>

                    <div class="status ${aktif ? "status-on" : "status-standby"}">

                        <div class="dot ${aktif ? "onjob" : "standby"}"></div>

                        <strong>${aktif ? "ON JOB" : "STANDBY"}</strong>

                    </div>

                </div>

            `;

        });

    } catch (err) {

        console.error(err);

        list.innerHTML = `
            <div style="
                padding:40px;
                text-align:center;
                color:#e53935;
                font-weight:600;
            ">
                ❌ Gagal mengambil data kendaraan.
            </div>
        `;

    }

}

function closeKendaraanModal() {

    document.getElementById("kendaraanModal").style.display = "none";

}
window.addEventListener("click", function(e){

    const modal = document.getElementById("kendaraanModal");

    if(e.target === modal){

        closeKendaraanModal();

    }

});

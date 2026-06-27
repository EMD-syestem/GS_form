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

      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbzVfz2--NNW5j4DerQtkhrX3zarQkUoHyPnyqYZUJIQ3ALVEXWNY2gBG6XtOnQfrrbx/exec",
        {
          method: "POST",
          body: JSON.stringify(data)
        }
      );

      const result = await response.json();

      if (result.success) {

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
      "https://script.google.com/macros/s/AKfycbzVfz2--NNW5j4DerQtkhrX3zarQkUoHyPnyqYZUJIQ3ALVEXWNY2gBG6XtOnQfrrbx/exec?action=search&nama=" +
      encodeURIComponent(nama)
    );

    const data = await response.json();

    console.log("DATA RESERVASI:", data);

    if (!data || !data.success) {

      result.innerHTML = `
      <div class="status-card pending">
        <h3>Reservasi Tidak Ditemukan</h3>
        <p>Pastikan nama pemohon benar.</p>
      </div>
      `;
      return;
    }

    currentReservation = data;

    // ==========================
    // STATUS CHECK AMAN
    // ==========================

    const status = String(data.status || "").toLowerCase();

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

    let photoDriver =
      "https://i.postimg.cc/NMRDPgT5/GS-dispacer.jpg";

    try {

      const biodataResponse = await fetch(
        "https://script.google.com/macros/s/AKfycbyxB_Bo2GNbb3EMc2JcPuUNmHHXMCSZndSjGDHiQFJ5R6GW49BxJsdjDCdcgtliZAE/exec?action=readBiodata"
      );

      const biodata = await biodataResponse.json();

      const driver = biodata.find(item =>
        String(item.badge || "").trim() ===
        String(data.badge || "").trim()
      );

      if (driver) {
        photoDriver = driver.photo || photoDriver;

        currentReservation.photoDriver = photoDriver;
        currentReservation.driverContact = driver.contact || data.contact;
      }

    } catch (err) {
      console.log("Error biodata:", err);
    }

    // ==========================
    // TAMPILKAN UI
    // ==========================

    result.innerHTML = `

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
      <td>: ${data.driver || "-"}</td>
    </tr>
      
     <tr>
      <td><b>Driver contact</b></td>
      <td>: ${data.driverContact || "-"}</td>
     </tr>

    <tr>
      <td><b>Fleet Code</b></td>
      <td>: ${data.fleet || "-"}</td>
    </tr>

    <tr>
      <td><b>Kendaraan</b></td>
      <td>: ${data.vehicle || "-"}</td>
    </tr>

    <tr>
      <td><b>Dispatcher</b></td>
      <td>: ${data.dispatcher || "-"}</td>
    </tr>

  </table>

</div>

`;

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

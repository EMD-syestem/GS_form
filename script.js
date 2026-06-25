window.addEventListener("load", () => {

  setTimeout(() => {

    document
      .getElementById("splashScreen")
      .classList
      .add("splash-hide");

  }, 3000);

});

document
  .getElementById("formPermohonan")
  .addEventListener("submit", async function (e) {

    e.preventDefault();

    const data = {

      namaDriver:"",
        
      noBadge: "",

      fleetCode: "",

      jenisKendaraan: "",

      drivercontact: "",

      tanggalPermintaan:
        document.getElementById("tglPermohonan").value,

      department: "General Service",

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

      tanggalAkhirPekerjaan:
        document.getElementById("tglSelesai").value,

      summaryPekerjaan:
        document.getElementById("summaryPekerjaan").value,

      status: "Pending"
    };

    try {

      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbxyTOkKDvhFmQnyFzB1BfK4ZVocf3X7wVQKwAtyvR2i-JrqGekMkgXqwTwQWMop_rOgsA/exec",
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

      } else {

        alert(
          "Gagal menyimpan data: " +
          (result.error || "")
        );

      }

    } catch (error) {

      console.error(error);

      alert(
        "Tidak dapat terhubung ke server."
      );

    }

  });
let mails = JSON.parse(localStorage.getItem("sentMails") || "[]");
let table = document.getElementById("list");

function renderTable() {
  // Hapus isi tabel kecuali header
  table.innerHTML = `
    <tr>
      <th>No</th>
      <th>Kepada</th>
      <th>Subjek</th>
      <th>Tanggal</th>
      <th>Isi</th>
      <th>Aksi</th>
    </tr>
  `;

  mails.forEach((m, i) => {
    let row = table.insertRow();
    row.insertCell().innerText = i + 1;
    row.insertCell().innerText = m.to;
    row.insertCell().innerText = m.subj;
    row.insertCell().innerText = m.date;
    row.insertCell().innerText = m.body;

    // Tombol Delete
    let delCell = row.insertCell();
    let btn = document.createElement("button");
    btn.innerText = "Delete";
    btn.onclick = () => deleteMail(i);
    delCell.appendChild(btn);
  });
}

function deleteMail(index) {
  // Ambil pesan yang mau dihapus
  let mail = mails[index];

  // Simpan ke Trash
  let trash = JSON.parse(localStorage.getItem("trashMails") || "[]");
  trash.push(mail);
  localStorage.setItem("trashMails", JSON.stringify(trash));

  // Hapus dari Sent
  mails.splice(index, 1);
  localStorage.setItem("sentMails", JSON.stringify(mails));

  // Render ulang tabel
  renderTable();
}

// Pertama kali render
renderTable();

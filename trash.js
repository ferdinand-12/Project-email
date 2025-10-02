let trash = JSON.parse(localStorage.getItem("trashMails") || "[]");
let table = document.getElementById("trashList");

// Render isi trash
function renderTrash() {
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

  trash.forEach((m, i) => {
    let row = table.insertRow();
    row.insertCell().innerText = i + 1;
    row.insertCell().innerText = m.to;
    row.insertCell().innerText = m.subj;
    row.insertCell().innerText = m.date;
    row.insertCell().innerText = m.body;

    // Tombol Restore
    let action = row.insertCell();
    let btn = document.createElement("button");
    btn.innerText = "Restore";
    btn.onclick = () => restoreMail(i);
    action.appendChild(btn);
  });
}

function restoreMail(index) {
  let mail = trash[index];

  // Balikin ke Sent
  let sent = JSON.parse(localStorage.getItem("sentMails") || "[]");
  sent.push(mail);
  localStorage.setItem("sentMails", JSON.stringify(sent));

  // Hapus dari Trash
  trash.splice(index, 1);
  localStorage.setItem("trashMails", JSON.stringify(trash));

  renderTrash();
}

renderTrash();

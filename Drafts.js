// Ambil draft dari localStorage
function loadDrafts(){
  let drafts = JSON.parse(localStorage.getItem("drafts")) || [];
  const container = document.getElementById("draftsList");
  container.innerHTML = "";

  if(drafts.length === 0){
    container.innerHTML = "<p style='color:gray;'>Tidak ada draft tersimpan.</p>";
    return;
  }

  drafts.forEach((d, i) => {
    let div = document.createElement("div");
    div.className = "draft-item";
    div.innerHTML = `
      <strong>To:</strong> ${d.to || "(kosong)"} <br>
      <strong>Subject:</strong> ${d.subject || "(tanpa subjek)"} <br>
      <small>Saved: ${d.date}</small><br><br>
      <button onclick="viewDraft(${i})">View</button>
      <button onclick="deleteDraft(${i})">Delete</button>
    `;
    container.appendChild(div);
  });
}

function viewDraft(i){
  let drafts = JSON.parse(localStorage.getItem("drafts")) || [];
  let d = drafts[i];
  alert(`To: ${d.to}\nSubject: ${d.subject}\n\n${d.body}`);
}

function deleteDraft(i){
  let drafts = JSON.parse(localStorage.getItem("drafts")) || [];
  drafts.splice(i,1);
  localStorage.setItem("drafts", JSON.stringify(drafts));
  loadDrafts();
}

// load saat buka page
loadDrafts();

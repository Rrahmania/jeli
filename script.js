const state = JSON.parse(localStorage.getItem("jeliState") || '{"xp":0,"missions":[false,false,false],"sim":0}');
let simIndex = state.sim || 0;
const cases = [
  {
    title:"Hadiah Game",
    text:"🎉 Selamat! Kamu mendapat 500 diamond GRATIS! Buruan klaim sebelum 10 menit habis.",
    link:"https://hadiah-gratis.example/claim",
    correct:"adult",
    good:"Hebat! Kalau ragu, jangan buru-buru. Tunjukkan pesan kepada orang tua atau guru.",
    bad:"Jangan terburu-buru. Pesan hadiah yang mendesak kita untuk klik bisa menjadi tanda bahaya."
  },
  {
    title:"Voucher Murah",
    text:"🔥 TOP UP 90% lebih murah! Masukkan nomor HP dan kode OTP untuk mendapatkan bonus.",
    link:"https://bonus-voucher.example/login",
    correct:"ignore",
    good:"Benar! OTP adalah kode rahasia. Jangan pernah membagikannya melalui link atau pesan.",
    bad:"Hati-hati! OTP tidak boleh diberikan kepada siapa pun. Jangan isi data pada halaman yang mencurigakan."
  },
  {
    title:"Pesan dari Teman",
    text:"Lihat foto ini! Aku dapat dari grup. Klik ya supaya kamu bisa melihatnya.",
    link:"https://lihat-foto.example/open",
    correct:"adult",
    good:"Pilihan aman. Kalau link terasa aneh atau kamu tidak yakin, berhenti dan tanyakan kepada orang dewasa.",
    bad:"Tidak apa-apa kalau ragu. Pilihan paling aman adalah tidak membuka link dan meminta bantuan orang dewasa."
  }
];

function save(){ localStorage.setItem("jeliState", JSON.stringify(state)); updateUI(); }
function updateUI(){
  document.getElementById("xpValue").textContent = `${state.xp} XP`;
  state.missions.forEach((v,i)=> document.getElementById(`mission${i+1}`).textContent = v ? "1/1" : "0/1");
  const done = state.missions.filter(Boolean).length;
  const pct = Math.round(done/3*100);
  document.getElementById("badgeText").textContent = `${pct}%`;
  document.getElementById("badgeBar").style.width = `${pct}%`;
}
function scrollToId(id){document.getElementById(id)?.scrollIntoView({behavior:"smooth"});}
function toast(msg){const t=document.getElementById("toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2200)}
function addXP(n){state.xp += n; save(); toast(`⭐ +${n} XP! Hebat!`)}
function completeMission(n){
  if(state.missions[n-1]){toast("Misi ini sudah selesai!"); return}
  state.missions[n-1]=true; addXP(25);
}
function openLesson(type){
  const data = {
    money:{title:"💰 Kenalan dengan Uang Digital",html:"<p>Uang digital adalah nilai uang yang digunakan melalui perangkat atau layanan digital. Contohnya bisa kamu lihat saat orang tua melakukan pembayaran atau membeli sesuatu secara online.</p><ul><li><b>Kebutuhan</b> adalah sesuatu yang memang diperlukan.</li><li><b>Keinginan</b> adalah sesuatu yang ingin dimiliki tetapi tidak selalu harus dibeli.</li><li>Sebelum membeli sesuatu, tanyakan kepada orang tua.</li></ul><p><b>Jadi Anak Jeli:</b> pikirkan dulu, “Aku butuh atau hanya ingin?”</p>"},
    privacy:{title:"🔐 Rahasia Data Pribadi",html:"<p>Data seperti password, PIN, dan OTP harus dijaga. Jangan membagikannya melalui pesan, link, atau kepada orang yang tidak kamu kenal.</p><ul><li>OTP = kode rahasia sekali pakai.</li><li>Jangan menuliskan password pada link yang mencurigakan.</li><li>Kalau ada yang meminta data rahasia, <b>berhenti dan tanyakan orang dewasa.</b></li></ul>"},
    shopping:{title:"🛒 Cermat Sebelum Beli",html:"<p>Sebelum membeli sesuatu secara digital, biasakan bertanya: apakah aku benar-benar membutuhkannya? Apakah orang tua sudah mengizinkan? Apakah sumber pembeliannya jelas?</p><p><b>Ingat:</b> jangan menggunakan saldo atau akun orang lain tanpa izin.</p>"}
  };
  showModal(data[type].title,data[type].html);
  if(!state.missions[type==="money"?0:type==="privacy"?1:0]) { state.missions[type==="money"?0:type==="privacy"?1:0]=true; state.xp+=15; save(); }
}
function showModal(title,html){document.getElementById("modalContent").innerHTML=`<h2>${title}</h2>${html}`;document.getElementById("modal").classList.remove("hidden")}
function closeModal(){document.getElementById("modal").classList.add("hidden")}
function showInfo(who){
  const isTeacher=who==="guru";
  showModal(isTeacher?"👩‍🏫 Panduan Guru":"👨‍👩‍👧 Panduan Orang Tua",
    isTeacher
    ? "<p>Jeli dapat digunakan sebagai aktivitas kelas. Mulai dari modul singkat, lanjutkan dengan simulasi, lalu diskusikan alasan setiap pilihan siswa.</p><ul><li>Gunakan contoh kasus yang dekat dengan siswa.</li><li>Jangan meminta siswa memasukkan data pribadi asli.</li><li>Gunakan pre-test dan post-test untuk melihat perubahan pemahaman.</li></ul>"
    : "<p>Dampingi anak dengan percakapan sederhana. Tekankan bahwa anak tidak perlu takut menggunakan teknologi, tetapi perlu berhenti ketika ragu.</p><ul><li>Ajarkan anak bertanya sebelum klik.</li><li>Jelaskan bahwa OTP dan password adalah rahasia.</li><li>Jika anak menemukan pesan mencurigakan, bantu periksa tanpa menyalahkan anak.</li></ul>");
}
function renderSimulation(){
  const c=cases[simIndex];
  document.querySelector(".message b").textContent=c.title;
  document.querySelector(".message p").innerHTML=c.text;
  document.querySelector(".fake-link").textContent=c.link;
  document.getElementById("simProgressBar").style.width=`${((simIndex+1)/cases.length)*100}%`;
  document.getElementById("simFeedback").className="feedback hidden";
  document.getElementById("nextSim").classList.add("hidden");
  document.getElementById("simChoices").classList.remove("hidden");
}
function startSimulation(){scrollToId("simulasi");setTimeout(renderSimulation,250)}
function answerSim(answer){
  const c=cases[simIndex], fb=document.getElementById("simFeedback");
  const good=answer===c.correct;
  fb.textContent=(good?"✅ ":"⚠️ ")+(good?c.good:c.bad);
  fb.className=`feedback ${good?"good":"bad"}`;
  document.getElementById("simChoices").classList.add("hidden");
  if(good){state.xp+=30;state.missions[2]=true;save();toast("🕵️ Kamu berhasil menangkap tanda bahaya! +30 XP");}
  document.getElementById("nextSim").classList.remove("hidden");
}
function nextSimulation(){
  simIndex=(simIndex+1)%cases.length;state.sim=simIndex;save();renderSimulation();
}
document.getElementById("modal").addEventListener("click",e=>{if(e.target.id==="modal")closeModal()});
updateUI();
renderSimulation();

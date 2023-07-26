const profilePic = document.getElementById('profilePic');
const changeRoleBtn = document.getElementById('changeRoleBtn');
const panelBtn = document.getElementById('panelBtn');

async function setButtons() {
    const res = await fetch(`api/sessions/current`, { method: "GET" });
    const data = await res.json();
    if (data.payload.role == 'admin') {
        changeRoleBtn.style.display = "none"
        panelBtn.style.display = "inline"
    }
}

async function setProfilePic() {
    const res = await fetch(`api/sessions/current`, { method: "GET" });
    const data = await res.json();
    if (data.payload.documents.profile_pic.status) {
        let src = data.payload.documents.profile_pic.reference.split('public')
        profilePic.src = `${src[1]}`;
        profilePic.alt = `${data.payload.documents.name}`
    }
}

async function changeRole(uid) {
    const res = await fetch(`/api/users/premium/${uid}`, { method: "GET" });
    switch (res.status) {
        case 401:
            Toastify({
                text: "No tienes los permisos necesarios para hacer esto.",
                style: { background: "#dc3545" },
                gravity: "bottom"
            }).showToast();
            break;
        case 400:
            Toastify({
                text: "No tienes todos los archivos necesarios para hacerte premium. ",
                style: { background: "#dc3545" },
                gravity: "bottom"
            }).showToast();
            break;
        default:
            location.reload();
            break;
    }
}
async function deleteDocuments(uid) {
    await fetch(`/api/users/${uid}/documents`, { method: "DELETE" });
    location.reload();
}

window.onload = async function () {
    setButtons();
    setProfilePic();
}
async function generateText() {
    const current = await fetch(`api/sessions/current`, { method: "GET" });
    const user = await current.json();
    if (user.payload.role == 'premium') {
        return "No puedes agregar al carrito un producto que te pertenece."
    } else {
        return "Los administradores no pueden agregar productos al carrito."
    }
}

async function addToCart(pid, cid) {
    const res = await fetch(`/api/carts/${cid}/product/${pid}`, { method: "POST" });
    switch (res.status) {
        case 401:
            Toastify({
                text: await generateText(),
                style: { background: "#dc3545" },
                gravity: "bottom"
            }).showToast();
            break;
        default:
            Toastify({
                text: "Producto agregado al carrito!",
                style: { background: "#0d6efd" },
                gravity: "bottom"
            }).showToast();
            break;
    }
}
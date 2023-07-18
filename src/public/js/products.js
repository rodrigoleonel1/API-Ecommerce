async function addToCart(pid, cid){
    const res = await fetch(`/api/carts/${cid}/product/${pid}`, { method: "POST" });
    switch (res.status) {
        case 401:
            Toastify({
                text: "No tienes los permisos necesarios para hacer esto.",
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
async function clearCart(cid) {
    await fetch(`/api/carts/${cid}`, { method: "DELETE" });
    location.reload();
}

async function deleteProduct(cid, pid) {
    await fetch(`http://localhost:8080/api/carts/${cid}/products/${pid}`, { method: "DELETE" });
    location.reload();
}

async function purchase(cid) {
    await fetch(`http://localhost:8080/api/carts/${cid}/purchase`, { method: "POST" });
    location.replace('http://localhost:8080/products');
}
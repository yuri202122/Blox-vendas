const products=[
{id:1,game:"Blox Fruits",name:"Pacote de itens demonstrativo",price:19.90,icon:"🍎"},
{id:2,game:"Blox Fruits",name:"Bundle de acessórios",price:24.90,icon:"⚔️"},
{id:3,game:"Steal a Brainrot",name:"Coleção de itens virtuais",price:14.90,icon:"🧠"},
{id:4,game:"Steal a Brainrot",name:"Pacote especial",price:29.90,icon:"💎"},
{id:5,game:"Grow a Garden",name:"Kit de decoração",price:12.90,icon:"🌱"},
{id:6,game:"Grow a Garden",name:"Coleção de sementes",price:17.90,icon:"🌻"}
];
let cart=JSON.parse(localStorage.getItem("godblox_cart")||"[]"), user=JSON.parse(localStorage.getItem("godblox_user")||"null"), filter="Todos";
const $=id=>document.getElementById(id), money=n=>n.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
function save(){localStorage.setItem("godblox_cart",JSON.stringify(cart))}
function renderFilters(){let games=["Todos",...new Set(products.map(p=>p.game))];$("filters").innerHTML=games.map(g=>`<button class="filter ${g===filter?"active":""}" data-g="${g}">${g}</button>`).join("");document.querySelectorAll(".filter").forEach(b=>b.onclick=()=>{filter=b.dataset.g;render()})}
function renderProducts(){let q=$("search").value.toLowerCase();let list=products.filter(p=>(filter==="Todos"||p.game===filter)&&(p.name.toLowerCase().includes(q)||p.game.toLowerCase().includes(q)));$("products").innerHTML=list.map(p=>`<article class="product"><div class="pic">${p.icon}</div><div class="body"><span class="tag">${p.game}</span><h3>${p.name}</h3><div class="row"><b class="price">${money(p.price)}</b><button class="add" onclick="add(${p.id})">Adicionar</button></div></div></article>`).join("")||`<div class="empty">Nenhum produto encontrado.</div>`}
function add(id){cart.push(products.find(p=>p.id===id));save();renderCart();toast("Adicionado ao carrinho.")}
function remove(i){cart.splice(i,1);save();renderCart()}
function renderCart(){$("cartCount").textContent=cart.length;$("cartItems").innerHTML=cart.length?cart.map((p,i)=>`<div class="cart-row"><span class="cart-icon">${p.icon}</span><div class="cart-info"><b>${p.name}</b><br><small>${p.game} · ${money(p.price)}</small></div><button class="remove" onclick="remove(${i})">Remover</button></div>`).join(""):`<div class="orders empty">Carrinho vazio.</div>`;$("cartTotal").textContent=money(cart.reduce((s,p)=>s+p.price,0))}
function renderOrders(){if(!user){$("orders").className="orders empty";$("orders").textContent="Entre na sua conta para visualizar pedidos.";return}let orders=JSON.parse(localStorage.getItem("godblox_orders")||"[]");$("orders").className="orders";$("orders").innerHTML=orders.length?orders.map(o=>`<div class="order"><b>Pedido #${o.id}</b> · ${o.status}<br><small>${new Date(o.date).toLocaleString("pt-BR")} · ${money(o.total)}</small></div>`).join(""):"Nenhum pedido ainda."}
function openLogin(){showModal(`<h2>${user?"Minha conta":"Entrar"}</h2>${user?`<p>Você está conectado como <b>${user.email}</b>.</p><button class="primary" onclick="logout()">Sair</button>`:`<input id="email" type="email" placeholder="Seu e-mail"><input id="password" type="password" placeholder="Senha"><button class="primary" onclick="login()">Entrar</button><p style="color:#777;margin-top:12px;font-size:12px">Demonstração local. Para produção, use autenticação no servidor.</p>`}`)}
function login(){let email=$("email").value.trim();if(!email)return toast("Digite um e-mail.");user={email};localStorage.setItem("godblox_user",JSON.stringify(user));closeModal();renderOrders();toast("Login demonstrativo realizado.")}
function logout(){user=null;localStorage.removeItem("godblox_user");closeModal();renderOrders();toast("Você saiu da conta.")}
function showModal(c){$("modalContent").innerHTML=c;$("modal").classList.remove("hidden")}
function closeModal(){$("modal").classList.add("hidden")}
function checkout(){if(!cart.length)return toast("Carrinho vazio.");if(!user){closeCart();openLogin();return toast("Entre na conta antes de continuar.")}let orders=JSON.parse(localStorage.getItem("godblox_orders")||"[]"),order={id:Math.floor(Math.random()*900000+100000),date:new Date().toISOString(),status:"Aguardando pagamento",total:cart.reduce((s,p)=>s+p.price,0)};orders.unshift(order);localStorage.setItem("godblox_orders",JSON.stringify(orders));cart=[];save();renderCart();closeCart();renderOrders();toast("Pedido criado. Pagamento ainda não integrado.")}
function closeCart(){ $("drawer").classList.remove("open");$("shade").classList.remove("show")}
function toast(t){let x=$("toast");x.textContent=t;x.classList.add("show");setTimeout(()=>x.classList.remove("show"),2200)}
$("search").oninput=renderProducts;$("cartBtn").onclick=()=>{$("drawer").classList.add("open");$("shade").classList.add("show")};$("closeCart").onclick=closeCart;$("shade").onclick=closeCart;$("loginBtn").onclick=openLogin;$("closeModal").onclick=closeModal;$("checkout").onclick=checkout;
function render(){renderFilters();renderProducts();renderCart();renderOrders()}render();
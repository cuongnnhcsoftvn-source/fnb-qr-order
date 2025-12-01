import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "https://fnb-qr-order-backend.onrender.com";

export default function Menu({ tableId }) {
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [noteItem, setNoteItem] = useState(null);
  const [filteredMenu, setFilteredMenu] = useState([]);

  // Load menu
  useEffect(() => {
    axios.get(`${API}/api/menu`)
      .then(res => {
        setMenu(res.data);
        setFilteredMenu(res.data);
      })
      .catch(err => console.error("Error fetching menu:", err));
  }, []);

  // Filter menu by category
  const filterMenu = (type) => {
    setActiveFilter(type);
    if (type === "all") return setFilteredMenu(menu);
    setFilteredMenu(menu.filter(item => item.category === type));
  };

  // Add item to cart
  const addToCart = (item) => {
    const exist = cart.find(i => i.menu_item_id === item.id);
    if (exist) {
      setCart(cart.map(i =>
        i.menu_item_id === item.id ? { ...i, quantity: i.quantity + 1 } : i
      ));
    } else {
      setCart([...cart, { menu_item_id: item.id, name: item.name, price: item.price, quantity: 1, note: "" }]);
    }
  };

  // Update note for cart item
  const updateNote = (id, note) => {
    setCart(cart.map(i => i.menu_item_id === id ? { ...i, note } : i));
  };

  // Send order to backend
  const sendOrder = () => {
    if (cart.length === 0) return alert("Giỏ hàng trống!");
    axios.post(`${API}/api/orders`, { table_id: tableId, items: cart })
      .then(() => {
        alert("Order đã gửi!");
        setCart([]);
      })
      .catch(err => {
        console.error(err);
        alert("Lỗi gửi order!");
      });
  };

  const totalPrice = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <div className="flex gap-6 p-4">
      {/* MENU */}
      <div className="w-3/4">
        <h1 className="text-2xl font-bold mb-4">Menu</h1>

        <div className="flex gap-3 mb-5">
          {["all", "food", "drink", "combo"].map(type => (
            <button
              key={type}
              onClick={() => filterMenu(type)}
              className={`px-4 py-1 rounded-full border ${activeFilter === type ? "bg-black text-white" : "bg-gray-100"}`}
            >
              {type.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {filteredMenu.map(item => (
            <div key={item.id} className="border p-3 rounded-xl shadow-sm">
              <img src={item.image_url} alt={item.name} className="w-full h-32 object-cover rounded-lg" />
              <h3 className="font-semibold mt-2">{item.name}</h3>
              <p className="text-sm text-gray-500">{item.description}</p>
              <p className="font-bold mt-1">{item.price.toLocaleString()} VND</p>
              <button onClick={() => addToCart(item)} className="mt-2 w-full bg-black text-white py-1 rounded-lg">
                Thêm vào giỏ
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* CART */}
      <div className="w-1/4 border p-4 rounded-xl shadow-lg sticky top-4 bg-white">
        <h2 className="text-xl font-bold mb-3">Giỏ hàng</h2>

        {cart.length === 0 && <p className="text-gray-500">Chưa có món nào</p>}

        <div className="flex flex-col gap-3">
          {cart.map(item => (
            <div key={item.menu_item_id} className="border rounded-lg p-3">
              <div className="flex justify-between">
                <span>{item.name}</span>
                <span>x{item.quantity}</span>
              </div>
              <p className="text-sm text-gray-500">{item.price.toLocaleString()} VND</p>
              <button onClick={() => setNoteItem(item)} className="text-blue-500 text-sm mt-1 underline">
                Ghi chú
              </button>
              {item.note && (
                <p className="text-xs bg-yellow-100 p-1 rounded mt-1">Note: {item.note}</p>
              )}
            </div>
          ))}
        </div>

        {cart.length > 0 && (
          <>
            <div className="border-t mt-3 pt-3 font-bold">Tổng: {totalPrice.toLocaleString()} VND</div>
            <button onClick={sendOrder} className="mt-3 w-full bg-green-600 text-white py-2 rounded-lg">
              Gửi Order
            </button>
          </>
        )}
      </div>

      {/* MODAL NOTE */}
      {noteItem && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-5 rounded-xl w-80">
            <h3 className="text-lg font-bold mb-2">Ghi chú món</h3>
            <textarea
              value={noteItem.note}
              onChange={(e) => updateNote(noteItem.menu_item_id, e.target.value)}
              className="w-full border rounded p-2"
              rows={4}
            />
            <button onClick={() => setNoteItem(null)} className="mt-3 w-full bg-black text-white py-1 rounded-lg">
              Xong
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

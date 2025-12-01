import React, { useEffect, useState } from "react";
import axios from "axios";

const API = process.env.REACT_APP_API;

export default function Menu({ tableId }) {
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    axios.get(`${API}/api/menu`).then(res => setMenu(res.data));
  }, []);

  const addToCart = (item) => {
    const exist = cart.find(i => i.menu_item_id === item.id);
    if (exist) {
      setCart(cart.map(i => i.menu_item_id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
    } else {
      setCart([...cart, { menu_item_id: item.id, quantity: 1, note: "" }]);
    }
  };

  const sendOrder = () => {
    axios.post(`${API}/api/orders`, { table_id: tableId, items: cart })
      .then(() => alert("Order sent!"))
      .catch(() => alert("Error"));
  };

  return (
    <div>
      <h1>Menu</h1>
      <div className="grid grid-cols-2 gap-4">
        {menu.map(item => (
          <div key={item.id} className="border p-2">
            <h3>{item.name}</h3>
            <p>{item.price} VND</p>
            <button onClick={() => addToCart(item)}>Add</button>
          </div>
        ))}
      </div>
      <button onClick={sendOrder}>Send Order</button>
    </div>
  );
}

let mockOrders = [
  {
    id: "ORD-9821",
    date: "Aug 18, 2026",
    status: "Delivered",
    total: 129.99,
    items: [
      { name: "Wireless Headphones", qty: 1, price: 99.99 },
      { name: "Protective Case", qty: 1, price: 30.0 },
    ],
  },
  {
    id: "ORD-9104",
    date: "Jul 02, 2026",
    status: "Processing",
    total: 45.5,
    items: [{ name: "USB-C Fast Charger", qty: 2, price: 22.75 }],
  },
];

const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

export const orderApi = {
  async fetchOrders() {
    await delay();
    return [...mockOrders];
  },

  async cancelOrder(id) {
    await delay();
    const order = mockOrders.find((o) => o.id === id);
    if (!order) {
      throw new Error("Order not found");
    }
    if (order.status === "Delivered") {
      throw new Error("Cannot cancel a delivered order");
    }
    order.status = "Cancelled";
    return { ...order };
  },
};

// 1. استيراد الحزم المطلوبة
import express from 'express';
import redis from 'redis';
import { promisify } from 'util';

// 2. إعداد اتصال Redis
const client = redis.createClient();  // الاتصال بـ Redis
const setAsync = promisify(client.set).bind(client);  // تحويل set إلى دالة غير متزامنة باستخدام promisify
const getAsync = promisify(client.get).bind(client);  // تحويل get إلى دالة غير متزامنة

// 3. إنشاء تطبيق Express
const app = express();
const port = 1245;  // تحديد رقم المنفذ


// 4. إنشاء قائمة المنتجات
const listProducts = [
  { id: 1, name: "Suitcase 250", price: 50, stock: 4 },
  { id: 2, name: "Suitcase 450", price: 100, stock: 10 },
  { id: 3, name: "Suitcase 650", price: 350, stock: 2 },
  { id: 4, name: "Suitcase 1050", price: 550, stock: 5 }
];


// 5. دالة للحصول على منتج بناءً على الـ id
function getItemById(id) {
  return listProducts.find(product => product.id === id);
}


// 6. إعداد المسار لإرجاع قائمة المنتجات
app.get('/list_products', (req, res) => {
  const products = listProducts.map(product => ({
    itemId: product.id,
    itemName: product.name,
    price: product.price,
    initialAvailableQuantity: product.stock
  }));
  res.json(products);  // إرجاع المنتجات بصيغة JSON
});


// 7. دالة لحجز كمية المنتج في Redis
async function reserveStockById(itemId, stock) {
  await setAsync(`item.${itemId}`, stock);  // تخزين الكمية المحجوزة في Redis
}


// 8. دالة للحصول على الكمية المحجوزة من Redis
async function getCurrentReservedStockById(itemId) {
  const reservedStock = await getAsync(`item.${itemId}`);
  return reservedStock || 0;  // إذا لم يكن هناك حجز، تعود الكمية 0
}


// 9. إعداد المسار لعرض تفاصيل المنتج بناءً على itemId
app.get('/list_products/:itemId', async (req, res) => {
  const { itemId } = req.params;
  const product = getItemById(Number(itemId));  // البحث عن المنتج باستخدام ID

  if (!product) {
    return res.json({ status: "Product not found" });
  }

  const currentStock = await getCurrentReservedStockById(itemId);
  res.json({
    itemId: product.id,
    itemName: product.name,
    price: product.price,
    initialAvailableQuantity: product.stock,
    currentQuantity: product.stock - currentStock
  });
});


// 10. إعداد المسار لحجز المنتج
app.get('/reserve_product/:itemId', async (req, res) => {
  const { itemId } = req.params;
  const product = getItemById(Number(itemId));  // البحث عن المنتج باستخدام ID

  if (!product) {
    return res.json({ status: "Product not found" });
  }

  const currentStock = await getCurrentReservedStockById(itemId);
  const availableStock = product.stock - currentStock;

  if (availableStock <= 0) {
    return res.json({
      status: "Not enough stock available",
      itemId: product.id
    });
  }

  await reserveStockById(itemId, currentStock + 1);  // حجز منتج واحد
  res.json({
    status: "Reservation confirmed",
    itemId: product.id
  });
});


// 11. تشغيل الخادم للاستماع على المنفذ المحدد
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


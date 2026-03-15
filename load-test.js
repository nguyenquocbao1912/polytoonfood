import http from 'k6/http';
import { check, sleep } from 'k6';

// Cấu hình k6: Thử nghiệm tăng tốc 50 Users ảo cùng lúc
export const options = {
    stages: [
        { duration: '10s', target: 50 }, // Tăng dần lên 50 người dùng
        { duration: '40s', target: 50 }, // Giữ nguyên tải để đo mức ổn định
        { duration: '10s', target: 0 }   // Rút quân
    ],
};

export default function () {
    const BASE_URL = 'http://localhost:3000';

    // 1. NGƯỜI DÙNG VÀO TRANG CHỦ (Xem các món hot & sale)
    const homeRes = http.get(`${BASE_URL}/`);
    check(homeRes, { 'Home status is 200': (r) => r.status === 200 });
    sleep(1); 

    // 2. NGƯỜI DÙNG TÌM KIẾM MÓN ĂN
    const searchRes = http.get(`${BASE_URL}/search?q=pizza`);
    check(searchRes, { 'Search status is 200': (r) => r.status === 200 });
    sleep(1); 

    // 3. NGƯỜI DÙNG VÀO TRANG DANH MỤC
    const categoryRes = http.get(`${BASE_URL}/category/burgers`);
    check(categoryRes, { 'Category status is 200': (r) => r.status === 200 });
    sleep(1);

    // 4. K6 BẮN RANDOM ĐƠN HÀNG LÊN GOOGLE FIRESTORE
    // Để gọi qua K6 (Môi trường Console/Terminal không có SDK JS), 
    // chúng ta sẽ gửi dữ liệu trực tiếp bằng Firestore REST API.

    const projectID = "polytoonfood";
    const firestoreURL = `https://firestore.googleapis.com/v1/projects/${projectID}/databases/(default)/documents/orders`;
    
    // Giả lập một Data Hóa đơn ảo (Format gửi lên API của Google rất khắt khe cần stringValue, integerValue...)
    const orderPayload = JSON.stringify({
      fields: {
        userId: { stringValue: `k6-virtual-user-${__VU}` },
        total: { doubleValue: Math.floor(Math.random() * 50) + 10 },
        status: { stringValue: "processing" },
        createdAt: { timestampValue: new Date().toISOString() },
        items: {
          arrayValue: {
            values: [
              {
                mapValue: {
                  fields: {
                    quantity: { integerValue: "2" },
                    selectedSize: { stringValue: "L" },
                    food: {
                      mapValue: {
                        fields: {
                          id: { stringValue: "api-test" },
                          name: { stringValue: "K6 Load Test Burger" },
                          price: { doubleValue: 12.5 },
                          image: { stringValue: "🍔" }
                        }
                      }
                    }
                  }
                }
              }
            ]
          }
        }
      }
    });

    const params = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    // Thực hiện hàm POST (Đặt hàng) lên Google Cloud
    const firestoreRes = http.post(firestoreURL, orderPayload, params);
    
    // Kiểm tra xem đơn hàng có được ghi nhận thành công (Status 200 là OK)
    check(firestoreRes, {
        'Firebase Write status is 200': (r) => r.status === 200,
    });
    
    sleep(2);
}
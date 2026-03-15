BÁO CÁO GIẢI THÍCH CHI TIẾT CÁC CHỨC NĂNG LÕI TRONG DỰ ÁN POLYTOON FOOD
---

Chào bạn, dưới đây sẽ là bài viết giải thích cách thức hoạt động của các hệ thống logic, xử lý dữ liệu và chức năng của app bằng ngôn ngữ dễ hiểu và bình dân nhất. Nó sẽ trả lời câu hỏi "Khi tôi bấm cái nút này, đằng sau màn hình máy tính đang lén lút làm gì?".

# 1. HỆ THỐNG LẤY MÓN ĂN (DATA FETCHING - READ)
- Ở Đâu: File `lib/api.ts`
- Hoạt động: Dự án này không có CSDL đồ ăn của riêng mình, thay vào đó nó "đi mượn" của nền tảng TheMealDB (một kho data mở miễn phí). 
- Quy trình: 
  1. Khi người dùng vào trang (ví dụ Trang Chủ), Máy chủ của Next.js gọi hàm `fetchHomeFoods()`.
  2. Next.js đóng vai trò giống ông shipper, chạy sang nhà TheMealDB xin 3 danh mục: Pizza, Sushi, Dessert.
  3. TheMealDB trả về dữ liệu nguyên thủy (thực tế chỉ có Tên và Ảnh). Hàm `mapMealToFoodItem()` của ta liền trổ tài "hô biến": lấy tên cắt ra tính giá tiền ảo, cắt ID lấy số review ảo, cho ra mắt cái "Food Card" đầy đủ gia vị.
  4. Máy chủ in ra HTML rồi dâng lên cho Trình Duyệt của khách, xong xuôi mới chạy lệnh báo "Tao cập nhật ngầm đây - ISR" (đã giải thích ở README.md trước).

# 2. HỆ THỐNG GIỎ HÀNG (CART CONTEXT & LOCAL STORAGE) 
- Ở Đâu: `context/CartContext.tsx`
- Hoạt động: Đây là quá trình lưu trữ "tạm thời" trước khi bạn xuống tiền.
- Quy trình:
  1. Khi bạn bấm nút [Add] một cái Hamburger, hàm `addItem()` được gọi. 
  2. Nó kiểm tra: Trong giỏ đang có Hamburger size M chưa? Nếu có => Căng số lượng (`quantity + 1`). Nếu chưa => Ném thêm Hamburger vào danh sách Mảng `items`.
  3. Quan trọng: Mảng `items` là dữ liệu mềm (State). Bấm F5 là mất sạch! Thế nên mình đã viết thêm một dòng code lén lút tên là `localStorage.setItem('cart')` -> Tống toàn bộ "mảng đồ ăn" thành văn bản (chữ) và giấu vào ngóc ngách siêu kín của Cốc Cốc / Chrome tên là Local Storage.
  4. Lần sau bạn quay lại, hàm `useEffect()` soi trong Local Storage xem có chữ nào không, có thì bóc ra vứt lại vào State.

# 3. HỆ THỐNG TÀI KHOẢN (FIREBASE AUTH)
- Ở Đâu: `app/login/page.tsx` và `app/signup/page.tsx`
- Hoạt động: Xác thực danh tính của bạn để biết giỏ hàng này của ông nào.
- Quy trình Đăng Ký (Create): Bạn nhập Email/Mật khẩu -> Bấm Đăng ký -> Lệnh `createUserWithEmailAndPassword(auth, email, pass)` chạy thẳng một đường cáp quang tới cụm máy chủ bảo mật của Google (Firebase) -> Google ghi sổ "Đã nhận thanh niên này" -> Gửi trả lại 1 tấm thẻ (User Token).
- Theo dõi toàn ứng dụng: File `context/AuthContext.tsx` chứa con gián điệp `onAuthStateChanged()`. Nó nằm chờ và soi liên tục xem Tấm Thẻ (Token) của Google báo về còn sống không. Còn sống -> Cho xem Profile. Hết hạn (hoặc Log out) -> Đá bay ra trang bắt Đăng Nhập.

# 4. THANH TOÁN ĐƠN HÀNG (CHECKOUT - CREATE DATA)
- Ở Đâu: `app/checkout/page.tsx`
- Hoạt động: Đổi đồ lấy tiền (ảo). Bạn gửi Đơn hàng của bạn cho Quán (Ở đây CSDL của quán là Google Firestore).
- Quy trình:
  1. Khách bấm [Place Order].
  2. Một cái gói hàng chuẩn bị (Payload) được gói lại bao gồm: ID Người mua (`user.uid`), Toàn bộ giỏ hàng (`items`), Tổng tiền (`total`) và Giờ Đặt (`createdAt`).
  3. Mã `addDoc(collection(db, "orders"), gói_hàng)` kích hoạt. Nó gửi nguyên gói này lên mây (Cloud Firestore).
  4. Firestore đóng dấu "Thành Công!", trả về ID Đơn Hàng. 
  5. Web quay sang ra lệnh "Clear" toàn bộ giỏ hàng Local Storage -> Thông báo thành công -> Đá sang tab Lịch Sử Order.

# 5. LỊCH SỬ MUA HÀNG VÀ YÊU THÍCH (READ & UPSERT DATA)
- Ở Đâu: `app/orders/page.tsx` (Lịch Sử) và `context/FavoritesContext.tsx` (Yêu Thích).
- Lịch sử (Read): Khi khách vào Tab Order, code gọi Firebase "Mày lục trong kho, mang cho anh danh sách các Hóa Đơn (`orders`) mà có tên ông (`where userId == user.uid`)". Firestore trả về -> Lưu vào Session (RAM) -> In ra màn hình.
- Yêu Thích (Upsert - Thêm/Cập nhật): 
  1. Firestore dùng khái niệm Document (Tài liệu). Mỗi người chơi sẽ được phát đúng 1 trang giấy đánh số bằng cái `user.uid` của họ trong thư mục `user_favorites`.
  2. Bấm [Heart] Thả tim một món -> Gộp món đó vào danh sách trên Màn Hình (Local State).
  3. Lệnh `setDoc(doc(db, "user_favorites", uid), danh_sách_mới)` chạy -> Chạy lên đám mây, bóc tờ giấy cũ vứt đi, và chép nguyên xi danh sách mới lên (Đè).
  4. Lần sau đăng nhập lại bằng máy tính khác -> Gọi Firebase đọc lại cái tờ giấy kia là đồ mâm xôi yêu thích của bạn lại hiện ra như phép thuật.

---
Tóm lại, dự án này mô phỏng mọi kỹ thuật thực tế nhất mà GrabFood, ShopeeFood hay Baemin đang làm (Chỉ trừ khoản Quẹt thẻ trừ tiền túi của bạn mà thôi :D)

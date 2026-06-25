// Câu 1: Sử dụng Endpoint MockAPI cá nhân của bạn
const MOCK_API_URL = "https://6a210857b1d0aaf32b4e9fa1.mockapi.io/api/product1";

/**
 * Câu 3: Hàm fetch dữ liệu danh sách sản phẩm từ Back-End
 */
export const fetchProductsAPI = async () => {
  try {
    const response = await fetch(MOCK_API_URL);
    if (!response.ok) {
      throw new Error("Lỗi kết nối phản hồi từ MockAPI server!");
    }
    return await response.json(); // Trả về danh sách mảng dữ liệu thô
  } catch (error) {
    console.error("Xảy ra lỗi khi call API:", error);
    return [];
  }
};

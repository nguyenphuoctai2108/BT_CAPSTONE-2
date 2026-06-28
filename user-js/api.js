const MOCK_API_URL = "https://6a30e3c1a7f8866418d6955b.mockapi.io/api/v1/Products";
export const fetchProductsAPI = async () => {
  try {
    const response = await fetch(MOCK_API_URL);
    if (!response.ok) {
      throw new Error("Lỗi kết nối phản hồi từ MockAPI server!");
    }
    return await response.json();
  } catch (error) {
    console.error("Xảy ra lỗi khi call API:", error);
    return [];
  }
};

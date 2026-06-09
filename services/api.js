class Services {
  getListProductsApi() {
    const url = "https://6a210857b1d0aaf32b4e9fa1.mockapi.io/api/product_1";
    const promise = axios({
      url: url,
      method: "GET",
    });
    return promise;
  }
}

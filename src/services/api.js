import axios from "axios";

// ==============================
// API Configuration
// ==============================
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

// ==============================
// Axios Instance
// ==============================
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// ==============================
// Request Interceptor
// ==============================
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("luxe_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ==============================
// Response Interceptor
// ==============================
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized. Clearing session...");

      localStorage.removeItem("luxe_token");
      localStorage.removeItem("luxe_user");
    }

    return Promise.reject(error);
  }
);

// ==============================
// Helper Functions
// ==============================
const saveAuthData = (token, user) => {
  localStorage.setItem("luxe_token", token);
  localStorage.setItem("luxe_user", JSON.stringify(user));
};

const clearAuthData = () => {
  localStorage.removeItem("luxe_token");
  localStorage.removeItem("luxe_user");
};

// ==============================
// SECTION 2: AUTHENTICATION API (KEEP AS IS)
// ==============================
export const authAPI = {
  // Register
  register: async (userData) => {
    try {
      const response = await apiClient.post("/auth/register", userData);

      const { token, user } = response.data;

      if (token) {
        saveAuthData(token, user);
      }

      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  // Customer Login
  login: async (email, password) => {
    try {
      const response = await apiClient.post("/auth/login", {
        email,
        password,
      });

      const { token, user } = response.data;

      if (token) {
        saveAuthData(token, user);
      }

      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Admin Login
  adminLogin: async (email, password) => {
    try {
      const response = await apiClient.post("/auth/admin/login", {
        email,
        password,
      });

      const { token, user } = response.data;

      if (token) {
        saveAuthData(token, user);
      }

      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Logout
  logout: async () => {
    try {
      // Call backend logout endpoint
      await apiClient.post("/auth/logout");
      
      // Clear local data
      clearAuthData();

      return {
        success: true,
        message: "Logged out successfully",
      };
    } catch (error) {
      // Even if backend fails, clear local data
      clearAuthData();
      
      return {
        success: true,
        message: "Logged out locally",
      };
    }
  },

  // Get Profile
  getProfile: async () => {
    try {
      const response = await apiClient.get("/auth/profile");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update Profile
  updateProfile: async (profileData) => {
    try {
      const response = await apiClient.put("/auth/profile", profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Change Password
  changePassword: async (passwordData) => {
    try {
      const response = await apiClient.post(
        "/auth/change-password",
        passwordData
      );

      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create Admin
  createAdmin: async (adminData) => {
    try {
      const response = await apiClient.post("/auth/admin/create", adminData);

      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

// ==============================
// SECTION 1: ROOT & HEALTH ENDPOINTS
// ==============================
export const healthAPI = {
  // Welcome Message
  getWelcome: async () => {
    try {
      const response = await axios.get("http://localhost:5001/");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Health Check
  checkHealth: async () => {
    try {
      const response = await axios.get("http://localhost:5001/health");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

// ==============================
// SECTION 3: HOME PAGE ENDPOINTS
// ==============================
export const homeAPI = {
  // Get Homepage Data (Banners, Featured Products)
  getHomeData: async () => {
    try {
      const response = await apiClient.get("/home");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get Site Statistics
  getStats: async () => {
    try {
      const response = await apiClient.get("/stats");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

// ==============================
// SECTION 4: SHOP/PRODUCTS ENDPOINTS
// ==============================
export const shopAPI = {
  // Get All Products (with pagination and filters)
  getProducts: async (params = {}) => {
    try {
      const response = await apiClient.get("/shop/products", { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get Single Product Details
  getProductById: async (id) => {
    try {
      const response = await apiClient.get(`/shop/products/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get All Categories
  getCategories: async () => {
    try {
      const response = await apiClient.get("/shop/categories");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Search Products
  searchProducts: async (query) => {
    try {
      const response = await apiClient.get("/shop/search", {
        params: { q: query },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

// ==============================
// SECTION 5: SHOPPING CART ENDPOINTS
// ==============================
export const cartAPI = {
  // Get User Cart
  getCart: async () => {
    try {
      const response = await apiClient.get("/cart");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get Cart Item Count
  getCartCount: async () => {
    try {
      const response = await apiClient.get("/cart/count");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Add Product to Cart
  addToCart: async (productId, quantity = 1, variant = null) => {
    try {
      const response = await apiClient.post("/cart/add", {
        productId,
        quantity,
        variant,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update Cart Item Quantity
  updateCartItem: async (itemId, quantity) => {
    try {
      const response = await apiClient.put(`/cart/items/${itemId}`, {
        quantity,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Remove Item from Cart
  removeCartItem: async (itemId) => {
    try {
      const response = await apiClient.delete(`/cart/items/${itemId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Clear Entire Cart
  clearCart: async () => {
    try {
      const response = await apiClient.delete("/cart/clear");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

// ==============================
// SECTION 6: CHECKOUT ENDPOINTS
// ==============================
export const checkoutAPI = {
  // Process Checkout & Create Order
  processCheckout: async (checkoutData) => {
    try {
      const response = await apiClient.post("/checkout", checkoutData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Validate Coupon Code
  validateCoupon: async (code) => {
    try {
      const response = await apiClient.post("/checkout/validate-coupon", {
        code,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Calculate Shipping Cost
  calculateShipping: async (shippingData) => {
    try {
      const response = await apiClient.post(
        "/checkout/calculate-shipping",
        shippingData
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

// ==============================
// SECTION 7: USER ORDERS ENDPOINTS
// ==============================
export const orderAPI = {
  // Get User's Orders List
  getMyOrders: async (params = {}) => {
    try {
      const response = await apiClient.get("/orders", { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get Single Order Details
  getOrderById: async (id) => {
    try {
      const response = await apiClient.get(`/orders/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Cancel User's Order
  cancelOrder: async (id, reason = "") => {
    try {
      const response = await apiClient.post(`/orders/${id}/cancel`, {
        reason,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Track Order Status
  trackOrder: async (id) => {
    try {
      const response = await apiClient.get(`/orders/${id}/track`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

// ==============================
// SECTION 8: WISHLIST ENDPOINTS
// ==============================
export const wishlistAPI = {
  // Get User Wishlist
  getWishlist: async () => {
    try {
      const response = await apiClient.get("/wishlist");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Add Product to Wishlist
  addToWishlist: async (productId) => {
    try {
      const response = await apiClient.post("/wishlist/add", { productId });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Remove Product from Wishlist
  removeFromWishlist: async (productId) => {
    try {
      const response = await apiClient.delete(`/wishlist/${productId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Clear Entire Wishlist
  clearWishlist: async () => {
    try {
      const response = await apiClient.delete("/wishlist");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Move Product to Cart
  moveToCart: async (productId) => {
    try {
      const response = await apiClient.post(
        `/wishlist/${productId}/move-to-cart`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

// ==============================
// SECTION 9: REVIEWS ENDPOINTS
// ==============================
export const reviewAPI = {
  // Get Product Reviews
  getProductReviews: async (productId, params = {}) => {
    try {
      const response = await apiClient.get(`/reviews/product/${productId}`, {
        params,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get User's Reviews
  getMyReviews: async () => {
    try {
      const response = await apiClient.get("/reviews/my-reviews");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create New Review
  createReview: async (reviewData) => {
    try {
      const response = await apiClient.post("/reviews", reviewData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update Review
  updateReview: async (id, reviewData) => {
    try {
      const response = await apiClient.put(`/reviews/${id}`, reviewData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete Review
  deleteReview: async (id) => {
    try {
      const response = await apiClient.delete(`/reviews/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

// ==============================
// SECTION 10: USER PROFILE ENDPOINTS
// ==============================
export const profileAPI = {
  // Get User Profile
  getProfile: async () => {
    try {
      const response = await apiClient.get("/profile");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update Profile Info
  updateProfile: async (profileData) => {
    try {
      const response = await apiClient.put("/profile", profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Change Account Password
  changePassword: async (passwordData) => {
    try {
      const response = await apiClient.post(
        "/profile/change-password",
        passwordData
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Upload Profile Avatar
  uploadAvatar: async (file) => {
    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const response = await apiClient.post("/profile/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Add New Address
  addAddress: async (addressData) => {
    try {
      const response = await apiClient.post("/profile/addresses", addressData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update Address
  updateAddress: async (addressId, addressData) => {
    try {
      const response = await apiClient.put(
        `/profile/addresses/${addressId}`,
        addressData
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete Address
  deleteAddress: async (addressId) => {
    try {
      const response = await apiClient.delete(`/profile/addresses/${addressId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Set Default Address
  setDefaultAddress: async (addressId) => {
    try {
      const response = await apiClient.post(
        `/profile/addresses/${addressId}/default`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

// ==============================
// SECTION 11-19: ADMIN ENDPOINTS
// ==============================
export const adminAPI = {
  // ==============================
  // SECTION 11: ADMIN DASHBOARD
  // ==============================
  dashboard: {
    // Get Dashboard Statistics
    getStats: async () => {
      try {
        const response = await apiClient.get("/admin/dashboard/stats");
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Get Recent Activity
    getRecentActivity: async () => {
      try {
        const response = await apiClient.get("/admin/dashboard/recent-activity");
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },
  },

  // ==============================
  // SECTION 12: ADMIN PRODUCTS
  // ==============================
  products: {
    // List All Products (Admin View)
    getAll: async (params = {}) => {
      try {
        const response = await apiClient.get("/admin/products", { params });
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Get Single Product (Admin View)
    getById: async (id) => {
      try {
        const response = await apiClient.get(`/admin/products/${id}`);
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Create New Product
    create: async (productData) => {
      try {
        const response = await apiClient.post("/admin/products", productData);
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Update Product
    update: async (id, productData) => {
      try {
        const response = await apiClient.put(`/admin/products/${id}`, productData);
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Delete Product
    delete: async (id) => {
      try {
        const response = await apiClient.delete(`/admin/products/${id}`);
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Delete Product Image
    deleteImage: async (productId, imageId) => {
      try {
        const response = await apiClient.delete(
          `/admin/products/${productId}/images/${imageId}`
        );
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Bulk Update Product Status
    bulkUpdateStatus: async (statusData) => {
      try {
        const response = await apiClient.post(
          "/admin/products/bulk/status",
          statusData
        );
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Bulk Upload via Excel
    bulkUpload: async (file) => {
      try {
        const formData = new FormData();
        formData.append("excelFile", file);

        const response = await apiClient.post(
          "/admin/products/bulk/upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Download Sample Excel
    getSampleExcel: () => {
      return `${API_BASE_URL}/admin/products/bulk/sample`;
    },

    // Upload History
    getUploadHistory: async () => {
      try {
        const response = await apiClient.get("/admin/products/bulk/history");
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },
  },

  // ==============================
  // SECTION 13: ADMIN INVENTORY
  // ==============================
  inventory: {
    // Get Inventory Overview
    getOverview: async () => {
      try {
        const response = await apiClient.get("/admin/inventory/overview");
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Get Inventory List
    getList: async (params = {}) => {
      try {
        const response = await apiClient.get("/admin/inventory/list", { params });
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Update Product Stock
    updateStock: async (productId, stockData) => {
      try {
        const response = await apiClient.put(
          `/admin/inventory/${productId}/stock`,
          stockData
        );
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Bulk Stock Update
    bulkUpdate: async (bulkData) => {
      try {
        const response = await apiClient.post(
          "/admin/inventory/bulk-update",
          bulkData
        );
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Get Low Stock Alerts
    getAlerts: async () => {
      try {
        const response = await apiClient.get("/admin/inventory/alerts");
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Get Stock Movement History
    getHistory: async (productId) => {
      try {
        const response = await apiClient.get(
          `/admin/inventory/${productId}/history`
        );
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },
  },

  // ==============================
  // SECTION 14: ADMIN ORDERS
  // ==============================
  orders: {
    // List All Orders
    getAll: async (params = {}) => {
      try {
        const response = await apiClient.get("/admin/orders", { params });
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Get Order Statistics
    getStats: async () => {
      try {
        const response = await apiClient.get("/admin/orders/stats");
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Get Single Order
    getById: async (id) => {
      try {
        const response = await apiClient.get(`/admin/orders/${id}`);
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Update Order Status
    updateStatus: async (id, status, notes = "") => {
      try {
        const response = await apiClient.put(`/admin/orders/${id}/status`, {
          status,
          notes,
        });
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Update Payment Status
    updatePaymentStatus: async (id, paymentStatus) => {
      try {
        const response = await apiClient.put(
          `/admin/orders/${id}/payment-status`,
          { paymentStatus }
        );
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Cancel Order
    cancel: async (id, reason = "") => {
      try {
        const response = await apiClient.post(`/admin/orders/${id}/cancel`, {
          reason,
        });
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Generate Invoice
    getInvoice: async (id) => {
      try {
        const response = await apiClient.get(`/admin/orders/${id}/invoice`);
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Send Order Update Email
    sendUpdate: async (id, updateData) => {
      try {
        const response = await apiClient.post(
          `/admin/orders/${id}/send-update`,
          updateData
        );
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },
  },

  // ==============================
  // SECTION 15: ADMIN USERS
  // ==============================
  users: {
    // List All Users
    getAll: async (params = {}) => {
      try {
        const response = await apiClient.get("/admin/users", { params });
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Get User Statistics
    getStats: async () => {
      try {
        const response = await apiClient.get("/admin/users/stats");
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Search Users
    search: async (query) => {
      try {
        const response = await apiClient.get("/admin/users/search", {
          params: { q: query },
        });
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Get Single User
    getById: async (id) => {
      try {
        const response = await apiClient.get(`/admin/users/${id}`);
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Get User's Orders
    getUserOrders: async (id) => {
      try {
        const response = await apiClient.get(`/admin/users/${id}/orders`);
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Update User Status
    updateStatus: async (id, status) => {
      try {
        const response = await apiClient.put(`/admin/users/${id}/status`, {
          status,
        });
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Update User Role
    updateRole: async (id, role) => {
      try {
        const response = await apiClient.put(`/admin/users/${id}/role`, {
          role,
        });
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Delete User
    delete: async (id) => {
      try {
        const response = await apiClient.delete(`/admin/users/${id}`);
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },
  },

  // ==============================
  // SECTION 16: ADMIN CATEGORIES
  // ==============================
  categories: {
    // List All Categories
    getAll: async () => {
      try {
        const response = await apiClient.get("/admin/categories");
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Get Category Tree Structure
    getTree: async () => {
      try {
        const response = await apiClient.get("/admin/categories/tree");
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Get Single Category
    getById: async (id) => {
      try {
        const response = await apiClient.get(`/admin/categories/${id}`);
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Create New Category
    create: async (categoryData) => {
      try {
        const response = await apiClient.post("/admin/categories", categoryData);
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Update Category
    update: async (id, categoryData) => {
      try {
        const response = await apiClient.put(
          `/admin/categories/${id}`,
          categoryData
        );
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Delete Category
    delete: async (id) => {
      try {
        const response = await apiClient.delete(`/admin/categories/${id}`);
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Update Category Order
    updateOrder: async (orderData) => {
      try {
        const response = await apiClient.post(
          "/admin/categories/update-order",
          orderData
        );
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },
  },

  // ==============================
  // SECTION 17: ADMIN BANNERS
  // ==============================
  banners: {
    // List Regular Banners
    getAll: async () => {
      try {
        const response = await apiClient.get("/admin/banners");
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Get Single Banner
    getById: async (id) => {
      try {
        const response = await apiClient.get(`/admin/banners/${id}`);
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Create Regular Banner
    create: async (bannerData) => {
      try {
        const response = await apiClient.post("/admin/banners", bannerData);
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Update Banner
    update: async (id, bannerData) => {
      try {
        const response = await apiClient.put(`/admin/banners/${id}`, bannerData);
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Delete Banner
    delete: async (id) => {
      try {
        const response = await apiClient.delete(`/admin/banners/${id}`);
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // List Hero Banners
    getHeroBanners: async () => {
      try {
        const response = await apiClient.get("/admin/banners/hero");
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Get Single Hero Banner
    getHeroById: async (id) => {
      try {
        const response = await apiClient.get(`/admin/banners/hero/${id}`);
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Create Hero Banner
    createHero: async (heroData) => {
      try {
        const response = await apiClient.post("/admin/banners/hero", heroData);
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Update Hero Banner
    updateHero: async (id, heroData) => {
      try {
        const response = await apiClient.put(
          `/admin/banners/hero/${id}`,
          heroData
        );
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Delete Hero Banner
    deleteHero: async (id) => {
      try {
        const response = await apiClient.delete(`/admin/banners/hero/${id}`);
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Update Banner Order
    updateOrder: async (orderData) => {
      try {
        const response = await apiClient.post(
          "/admin/banners/update-order",
          orderData
        );
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },
  },

  // ==============================
  // SECTION 18: ADMIN COUPONS
  // ==============================
  coupons: {
    // List All Coupons
    getAll: async (params = {}) => {
      try {
        const response = await apiClient.get("/admin/coupons", { params });
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Get Coupon Statistics
    getStats: async () => {
      try {
        const response = await apiClient.get("/admin/coupons/stats");
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Get Single Coupon
    getById: async (id) => {
      try {
        const response = await apiClient.get(`/admin/coupons/${id}`);
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Create New Coupon
    create: async (couponData) => {
      try {
        const response = await apiClient.post("/admin/coupons", couponData);
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Update Coupon
    update: async (id, couponData) => {
      try {
        const response = await apiClient.put(`/admin/coupons/${id}`, couponData);
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Delete Coupon
    delete: async (id) => {
      try {
        const response = await apiClient.delete(`/admin/coupons/${id}`);
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Validate Coupon
    validate: async (code, orderData = {}) => {
      try {
        const response = await apiClient.post("/admin/coupons/validate", {
          code,
          ...orderData,
        });
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },
  },

  // ==============================
  // SECTION 19: ADMIN SETTINGS
  // ==============================
  settings: {
    // Get All Settings
    getAll: async () => {
      try {
        const response = await apiClient.get("/admin/settings");
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Update General Settings
    updateGeneral: async (generalData) => {
      try {
        const response = await apiClient.put(
          "/admin/settings/general",
          generalData
        );
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Update Social Media Settings
    updateSocial: async (socialData) => {
      try {
        const response = await apiClient.put(
          "/admin/settings/social",
          socialData
        );
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Update Email Settings
    updateEmail: async (emailData) => {
      try {
        const response = await apiClient.put("/admin/settings/email", emailData);
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Update Payment Settings
    updatePayment: async (paymentData) => {
      try {
        const response = await apiClient.put(
          "/admin/settings/payment",
          paymentData
        );
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Update Inventory Settings
    updateInventory: async (inventoryData) => {
      try {
        const response = await apiClient.put(
          "/admin/settings/inventory",
          inventoryData
        );
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Test Email Configuration
    testEmail: async (testData) => {
      try {
        const response = await apiClient.post(
          "/admin/settings/email/test",
          testData
        );
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Reset Settings Section
    resetSection: async (section) => {
      try {
        const response = await apiClient.post("/admin/settings/reset", {
          section,
        });
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Export Settings as JSON
    exportSettings: async () => {
      try {
        const response = await apiClient.get("/admin/settings/export");
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Import Settings from JSON
    importSettings: async (settingsData) => {
      try {
        const response = await apiClient.post(
          "/admin/settings/import",
          settingsData
        );
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },
  },
};

// ==============================
// LEGACY COMPATIBILITY (Optional)
// ==============================
export const ProductService = {
  getAll: async (params) => {
    const data = await shopAPI.getProducts(params);
    return { data: { success: true, products: data.products || data } };
  },
  getById: async (id) => {
    const data = await shopAPI.getProductById(id);
    return { data: { success: true, product: data.product || data } };
  },
};

export const OrderService = {
  create: async (orderData) => {
    const data = await checkoutAPI.processCheckout(orderData);
    return { data: { success: true, orderId: data.orderId || data.id } };
  },
};

// ✅ ONLY ONE DEFAULT EXPORT
export default apiClient;
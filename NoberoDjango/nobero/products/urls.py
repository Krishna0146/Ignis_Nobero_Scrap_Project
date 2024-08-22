from django.urls import path
from .views import ProductListView, ProductDetailView

urlpatterns = [
    path('products/', ProductListView.as_view(), name='product-list'),  # List all products
    path('products/<path:product_url>/', ProductDetailView.as_view(), name='product-detail'),
]

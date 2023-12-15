# MainApi/urls.py
from django.urls import path
from .views import (
    cliente_list_create, cliente_detail,
    categoria_list_create, categoria_detail,
    producto_list_create, producto_detail,
    venta_list_create, ventas_detail
)

urlpatterns = [
    path('clientes/', cliente_list_create, name='cliente-list-create'),
    path('clientes/<int:pk>/', cliente_detail, name='cliente-detail'),
    path('categorias/', categoria_list_create, name='categoria-list-create'),
    path('categorias/<int:pk>/', categoria_detail, name='categoria-detail'),
    path('productos/', producto_list_create, name='producto-list-create'),
    path('productos/<int:pk>/', producto_detail, name='producto-detail'),
    path('ventas/', venta_list_create, name='venta-list-create'),
    path('ventas/<int:pk>/', ventas_detail, name='venta-detail'),
]

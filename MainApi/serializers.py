from rest_framework import serializers
from .models import Cliente, Categoria, Producto, Venta


class ClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cliente
        fields = '__all__'

class CategoriaSerializer(serializers.ModelSerializer):
    subcategorias = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = Categoria
        fields = '__all__'

class ProductoSerializer(serializers.ModelSerializer):
   

    imagen = serializers.ImageField(required=False)
    cantidad_vendidos = serializers.IntegerField(required=False)

    class Meta:
        model = Producto
        fields = '__all__'


class VentaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Venta
        fields = ['id', 'cliente', 'producto', 'cantidad', 'fecha']

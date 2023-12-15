from django.db import models

class Cliente(models.Model):
    id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=255)
    apellido = models.CharField(max_length=255)
    cedula = models.CharField(max_length=20)

    def __str__(self):
        return f"{self.nombre} {self.apellido}"

class Categoria(models.Model):
    id = models.AutoField(primary_key=True)
    padre = models.ForeignKey('self', null=True, blank=True, related_name='subcategorias', on_delete=models.CASCADE)
    nombre = models.CharField(max_length=255)

    def __str__(self):
        return self.nombre

class Producto(models.Model):
    id = models.AutoField(primary_key=True)
    imagen = models.ImageField(upload_to='productos/')
    nombre = models.CharField(max_length=255)
    categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE)
    precio = models.FloatField()
    descuento = models.IntegerField()
    total = models.FloatField()
    cantidad_disponibles = models.PositiveIntegerField()
    cantidad_vendidos = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return self.nombre

class Venta(models.Model):
    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE)
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)  
    cantidad = models.IntegerField()
    fecha = models.DateField()

    def __str__(self):
        return f'{self.producto} - {self.cantidad} - {self.fecha}'

    

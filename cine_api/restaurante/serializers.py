from rest_framework import serializers
from .models import Mesa, Pedido

class MesaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mesa
        fields = ["id", "name", "capacity", "is_available"]

class PedidoSerializer(serializers.ModelSerializer):
    Mesa_name = serializers.CharField(source="Mesa.name", read_only=True)

    class Meta:
        model = Pedido
        fields = ["id", "mesa", "Mesa_name", "items_summary", "total", "status", "created_at"]
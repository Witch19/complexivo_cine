from rest_framework import serializers

class MenuTypeSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=120)
    category = serializers.CharField(required=False, allow_blank=True)
    price = serializers.FloatField(required=False)
    is_available = serializers.BooleanField(default=True)
    created_at = serializers.DateField(required=False)  
    
class OrderEventSerializer(serializers.Serializer):
    order_id = serializers.IntegerField()        # ID de Pedido (Postgres)
    event_type = serializers.CharField()
    source = serializers.CharField() # ObjectId (string) de menus_types
    note = serializers.CharField(required=False, allow_blank=True)
    created_at = serializers.DateField(required=False)    # Ej: 2026-02-04

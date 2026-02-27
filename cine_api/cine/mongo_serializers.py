from rest_framework import serializers

class MovieCatalogTypeSerializer(serializers.Serializer):
    movie_title = serializers.CharField(max_length=120)
    genre = serializers.CharField(required=False, allow_blank=True)
    durantion_min = serializers.IntegerField(required=False, min_value=0)
    rating = serializers.FloatField(required=False)
    is_available = serializers.BooleanField(default=True)
    
class ReservationEventSerializer(serializers.Serializer):
    reservation_id = serializers.IntegerField()        # ID de Pedido (Postgres)
    event_type = serializers.CharField()
    source = serializers.CharField() # ObjectId (string) de menus_types
    note = serializers.CharField(required=False, allow_blank=True)
    created_at = serializers.DateField(required=False)    # Ej: 2026-02-04

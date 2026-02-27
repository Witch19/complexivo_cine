from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Show, Reservation
from .serializers import ShowSerializer, ReservationSerializer
from .permissions import IsAdminOrReadOnly


class ShowViewSet(viewsets.ModelViewSet):
    queryset = Show.objects.all().order_by("id")
    serializer_class = ShowSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ["movie_title"]
    # Ajustado al modelo obligatorio de shows
    ordering_fields = ["id", "movie_title", "room", "price", "available_seats"]


class ReservationViewSet(viewsets.ModelViewSet):
    queryset = Reservation.objects.select_related("show").all().order_by("-id")
    serializer_class = ReservationSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]

    # Si tu modelo Django tiene ForeignKey como `show = models.ForeignKey(Show, ...)`
    # esto es correcto (en SQL la columna será show_id automáticamente).
    filterset_fields = ["show"]

    # Ajustado al modelo obligatorio de reservations:
    # customer_name, seats, status, created_at y relación show_id
    search_fields = ["customer_name", "status", "show_id"]

    ordering_fields = ["id", "created_at", "seats", "status", "show_id"]

    def get_permissions(self):
        # Público: SOLO listar Reservas
        if self.action == "list":
            return [AllowAny()]
        return super().get_permissions()
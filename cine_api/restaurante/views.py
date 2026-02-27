from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Mesa, Pedido
from .serializers import MesaSerializer, PedidoSerializer
from .permissions import IsAdminOrReadOnly

class MesaViewSet(viewsets.ModelViewSet):
    queryset = Mesa.objects.all().order_by("id")
    serializer_class = MesaSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ["name"]
    ordering_fields = ["id", "name"]

class PedidoViewSet(viewsets.ModelViewSet):
    queryset = Pedido.objects.select_related("mesa").all().order_by("-id")
    serializer_class = PedidoSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ["mesa"]
    search_fields = ["mesa", "Mesa_name", "items_summary", "total", "status"]
    ordering_fields = ["id", "Mesa_name", "items_summary", "total", "status"]

    def get_permissions(self):
        # Público: SOLO listar Pedidos
        if self.action == "list":
            return [AllowAny()]
        return super().get_permissions()
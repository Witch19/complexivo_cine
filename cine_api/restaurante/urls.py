from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import MesaViewSet, PedidoViewSet
from .menu_types_views import menus_types_list_create, menus_types_detail
from .order_events_views import order_events_list_create, order_events_detail

router = DefaultRouter()
router.register(r"Mesas", MesaViewSet, basename="Mesas")
router.register(r"Pedidos", PedidoViewSet, basename="Pedidos")

urlpatterns = [
    # Mongo
    path("menu-types/", menus_types_list_create),
    path("menu-types//", menus_types_detail),
    path("order-events/", order_events_list_create),
    path("order-events//", order_events_detail),
]

urlpatterns += router.urls
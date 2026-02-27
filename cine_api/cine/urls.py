from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import ShowViewSet, ReservationViewSet
from .catalog_types_views import catalog_types_detail, catalog_types_list_create
from .reservation_events_views import reservation_events_list_create, reservation_events_detail

router = DefaultRouter()
router.register(r"Shows", ShowViewSet, basename="Shows")
router.register(r"Reservations", ReservationViewSet, basename="Reservations")

urlpatterns = [
    # Mongo
    path("catalog-types/", catalog_types_list_create),
    path("catalog-types/<str:id>/", catalog_types_detail),
    path("reservation-events/", reservation_events_list_create),
    path("reservation-events/<str:id>/", reservation_events_detail),
]

urlpatterns += router.urls
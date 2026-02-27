from django.db import models
from django.core.validators import MinValueValidator

# =========================
# TABLA: cine_shows
# =========================
class Show(models.Model):
    movie_title = models.CharField(max_length=120)
    room = models.CharField(max_length=20)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    available_seats = models.IntegerField(validators=[MinValueValidator(0)])

    class Meta:
        db_table = "cine_shows"   # 👈 importante: mapea al nombre real de tu tabla

    def __str__(self):
        return f"{self.movie_title} - {self.room} (${self.price})"


# =========================
# TABLA: cine_reservations
# =========================
class ReservationStatus(models.TextChoices):
    RESERVED = "RESERVED", "RESERVED"
    CONFIRMED = "CONFIRMED", "CONFIRMED"
    CANCELLED = "CANCELLED", "CANCELLED"


class Reservation(models.Model):
    show = models.ForeignKey(Show, on_delete=models.PROTECT, db_column="show_id")
    customer_name = models.CharField(max_length=120)
    seats = models.IntegerField(validators=[MinValueValidator(1)])
    status = models.CharField(max_length=20, choices=ReservationStatus.choices)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "cine_reservations"  # 👈 si tu tabla se llama así; si no, cámbialo

    def __str__(self):
        return f"{self.customer_name} - {self.show.movie_title} ({self.status})"
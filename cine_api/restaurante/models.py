from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

class Mesa(models.Model):
    name = models.CharField(max_length=120, unique=True)
    capacity = models.IntegerField(
        null=True, blank=True,
        validators=[MinValueValidator(0), MaxValueValidator(120)]
    )
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        f"{self.name} {self.capacity} ({self.is_available})"

class Estado(models.TextChoices):
    PENDIENTE = "pendiente", "Pendiente"
    EN_PROCESO = "en_proceso", "Enproceso"
    SERVIDO = "servido", "Servido"
    PAGADO = "pagado", "Pagado"


class Pedido(models.Model):
    mesa = models.ForeignKey(Mesa, on_delete=models.PROTECT, related_name="Pedidos")
    items_summary = models.CharField(max_length=120)
    total = models.IntegerField()
    status = models.CharField(
        max_length=20,
        choices=Estado.choices,
        default=Estado.PENDIENTE
    )
    color = models.CharField(max_length=60, blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.Mesa.name} {self.items_summary} ({self.status})"
# Usa los modelos para construir automáticamente un área dentro del sitio para crear, consultar, actualizar y borrar registros. 
from django.contrib import admin
from .models import Molecule

class moleculeAdmin(admin.ModelAdmin):
  list_display = ('fileMolecule', 'moleculeImage')

admin.site.register(Molecule, moleculeAdmin)
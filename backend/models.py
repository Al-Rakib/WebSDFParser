# A model is the single, definitive source of information about your data. It contains the essential fields and behaviors 
# of the data you are storing. Generally, each model maps to a single database table.
from django.db import models

class Molecule(models.Model):
  fileMolecule = models.TextField()
  moleculeImage = models.ImageField()

  def _str_(self):
    return self.title
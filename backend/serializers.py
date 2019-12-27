# Serializers allow complex data such as querysets and model instances to be 
# converted to native Python datatypes that can then be easily rendered into JSON, XML or other content types. 
from rest_framework import serializers
from .models import Molecule

class moleculeSerializer(serializers.ModelSerializer):
  class Meta:
    model = Molecule
    fields = ('id', 'fileMolecule', 'moleculeImage')

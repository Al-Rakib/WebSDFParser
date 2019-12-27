from django.shortcuts import render
from rest_framework import viewsets
from .serializers import moleculeSerializer
from .models import Molecule
from rest_framework.response import Response
from django.http import HttpResponse, JsonResponse
from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt

import json
import re
import requests
from PIL import Image
import io
from django.conf import settings
import uuid
import logging
from threading import Thread

# La clase de nuestra aplicación, donde gestionaremos el análisis del fichero y su conversión a formato PNG.

class webSDFRequest(viewsets.ModelViewSet):
  serializer_class = moleculeSerializer
  queryset = Molecule.objects.all()

# Expresiones regulares necesarias
END_MOL_BLOCK_PATTERN = rf"M\s*END[\s\r\n]*$"
MOL_FIELD_NAME = "Structure"
FIELD_NAME_PATTERN = rf"<.*>"
END_SDF_RECORD_BLOCK_PATTERN = rf"\$\$\$\$"
# HTTP Service en PerkinElmer
CHEM_DRAW_WEB_SERVICE = "https://chemdrawdirect.perkinelmer.cloud/rest/generateImage"

# Esta función recupera y almacena el archivo de imagen PNG de cada MOL mediante la API de PerkinElmer

def postRequest(data, result, index):
    try:
        strLabel = str(uuid.uuid4())
        fileName = settings.MEDIA_URL + "sample_"+strLabel+".png"
        result[index] = fileName

        r = requests.post(url = CHEM_DRAW_WEB_SERVICE, json = data)
        img = Image.open(io.BytesIO(r.content))
        img.save(settings.MEDIA_ROOT + "/sample_" + strLabel + ".png")
    except:
        logging.error('Error with URL check!')
        result[index] = {}
    return True

# Visor de los ficheros SDF
@csrf_exempt
@api_view(['POST'])
def SDFParserView(request):

  # Fichero subido por el usuario
  uploadedFile = request.data["file"]

  # Si el fichero está vacío...
  if len(uploadedFile) == 0:
    return HttpResponse(json.dumps([]), content_type='application/json')

  # Decodificación del fichero para su análisis
  dataFileContent = []
  for line in uploadedFile:
    dataFileContent.append(line.decode())

  i = 0
  sdfParsedFile = []

  # Eliminamos líneas en blanco 
  while re.match("\n\r", dataFileContent[i]): i += 1
  # Recuperamos registros SDF
  while i < len(dataFileContent)-1:
    fileMolecule = {}

    # Recuperamos MOL
    mol = ""
    while not re.search(END_MOL_BLOCK_PATTERN, dataFileContent[i]):
      mol += dataFileContent[i]
      i +=1

    mol += dataFileContent[i]
    fileMolecule[MOL_FIELD_NAME] = mol.rstrip("\n\r")
    i +=1

    # Eliminamos líneas en blanco 
    while re.match("\n\r", dataFileContent[i]): i += 1
    # Recuperamos nombres de campos y sus valores
    while i < len(dataFileContent)-1 and not re.search(END_SDF_RECORD_BLOCK_PATTERN, dataFileContent[i]):
      match = re.search(FIELD_NAME_PATTERN, dataFileContent[i])
      if match:
        i += 1
        fileMolecule[match.group()[1:-1].rstrip("\n\r")] = dataFileContent[i].rstrip("\n\r")
      i += 1

    i +=1

    # Eliminamos líneas en blanco 
    while i < len(dataFileContent)-1 and re.match("\n\r", dataFileContent[i]): i += 1
    sdfParsedFile.append(fileMolecule)

  # Uso de multithreading para reducir considerablemente el tiempo de espera en generar las imágenes PNG
  threads = []
  imagePath = [{} for x in sdfParsedFile]
  for index in range(0, len(sdfParsedFile)):
    data = {
      "chemData": sdfParsedFile[index][MOL_FIELD_NAME],
      "chemDataType": "chemical/x-mdl-molfile",
      "imageType": "image/png"
    }

    process = Thread(target=postRequest, args=[data, imagePath, index])
    process.start()
    threads.append(process)

  for process in threads:
    process.join()

  # Reemplazamos el texto MOL por su imagen PNG correspondiente
  for index in range(0, len(imagePath)):
    sdfParsedFile[index][MOL_FIELD_NAME] = imagePath[index]

  return HttpResponse(json.dumps(sdfParsedFile), content_type='application/json')
from rest_framework.views import APIView
from rest_framework.response import Response
import json
import os
import urllib.parse

class ProductListView(APIView):
    def get(self, request):
        # Get the path of the JSON file
        json_file_path = os.path.join(os.path.dirname(__file__), 'products.json')
        
        # Open and load the JSON file
        with open(json_file_path, 'r') as json_file:
            data = json.load(json_file)
        
        return Response(data)

class ProductDetailView(APIView):
    def get(self, request, product_url):
        decoded_url = urllib.parse.unquote(product_url)
        print("Received decoded URL:", decoded_url)  
        
        # Load the products.json file
        json_file_path = os.path.join(os.path.dirname(__file__), 'products.json')
        
        with open(json_file_path, 'r') as json_file:
            data = json.load(json_file)
        
        # Search for the product by the decoded URL
        product = next((item for item in data if item['url'] == decoded_url), None)
        
        if product:
            return Response(product)
        else:
            return Response({"error": "Product not found"}, status=404)

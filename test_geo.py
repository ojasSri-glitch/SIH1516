import urllib.request
import json
import ssl
import sys
import re

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

# Comprehensive Indian Postal Hub & Landmark PIN database
PINCODE_DATABASE = {
    # Delhi NCR
    "rohini": {"pincode": "110085", "district": "North West Delhi", "city": "Delhi", "state": "Delhi"},
    "rohini sector 14": {"pincode": "110085", "district": "North West Delhi", "city": "Delhi", "state": "Delhi"},
    "rohini sector 15": {"pincode": "110085", "district": "North West Delhi", "city": "Delhi", "state": "Delhi"},
    "connaught place": {"pincode": "110001", "district": "Central Delhi", "city": "New Delhi", "state": "Delhi"},
    "mayur vihar": {"pincode": "110091", "district": "East Delhi", "city": "Delhi", "state": "Delhi"},
    "mayur vihar phase 3": {"pincode": "110096", "district": "East Delhi", "city": "Delhi", "state": "Delhi"},
    "dwarka": {"pincode": "110075", "district": "South West Delhi", "city": "Delhi", "state": "Delhi"},
    "lajpat nagar": {"pincode": "110024", "district": "South Delhi", "city": "Delhi", "state": "Delhi"},
    "saket": {"pincode": "110017", "district": "South Delhi", "city": "Delhi", "state": "Delhi"},
    "noida": {"pincode": "201301", "district": "Gautam Buddha Nagar", "city": "Noida", "state": "Uttar Pradesh"},
    "gurugram": {"pincode": "122001", "district": "Gurugram", "city": "Gurugram", "state": "Haryana"},
    "gurgaon": {"pincode": "122001", "district": "Gurugram", "city": "Gurugram", "state": "Haryana"},
    
    # Bengaluru
    "koramangala": {"pincode": "560034", "district": "Bengaluru Urban", "city": "Bengaluru", "state": "Karnataka"},
    "indiranagar": {"pincode": "560038", "district": "Bengaluru Urban", "city": "Bengaluru", "state": "Karnataka"},
    "whitefield": {"pincode": "560066", "district": "Bengaluru Urban", "city": "Bengaluru", "state": "Karnataka"},
    "jayanagar": {"pincode": "560041", "district": "Bengaluru Urban", "city": "Bengaluru", "state": "Karnataka"},
    "electronic city": {"pincode": "560100", "district": "Bengaluru Urban", "city": "Bengaluru", "state": "Karnataka"},
    "hsr layout": {"pincode": "560102", "district": "Bengaluru Urban", "city": "Bengaluru", "state": "Karnataka"},
    
    # Chennai
    "anna nagar": {"pincode": "600040", "district": "Chennai", "city": "Chennai", "state": "Tamil Nadu"},
    "t nagar": {"pincode": "600017", "district": "Chennai", "city": "Chennai", "state": "Tamil Nadu"},
    "adyar": {"pincode": "600020", "district": "Chennai", "city": "Chennai", "state": "Tamil Nadu"},
    "velachery": {"pincode": "600042", "district": "Chennai", "city": "Chennai", "state": "Tamil Nadu"},
    "mylapore": {"pincode": "600004", "district": "Chennai", "city": "Chennai", "state": "Tamil Nadu"},
    
    # Mumbai
    "andheri": {"pincode": "400058", "district": "Mumbai Suburban", "city": "Mumbai", "state": "Maharashtra"},
    "andheri west": {"pincode": "400058", "district": "Mumbai Suburban", "city": "Mumbai", "state": "Maharashtra"},
    "bandra": {"pincode": "400050", "district": "Mumbai Suburban", "city": "Mumbai", "state": "Maharashtra"},
    "dadar": {"pincode": "400014", "district": "Mumbai", "city": "Mumbai", "state": "Maharashtra"},
    "borivali": {"pincode": "400092", "district": "Mumbai Suburban", "city": "Mumbai", "state": "Maharashtra"},
    "colaba": {"pincode": "400005", "district": "Mumbai", "city": "Mumbai", "state": "Maharashtra"},
    
    # Hyderabad
    "banjara hills": {"pincode": "500034", "district": "Hyderabad", "city": "Hyderabad", "state": "Telangana"},
    "jubilee hills": {"pincode": "500033", "district": "Hyderabad", "city": "Hyderabad", "state": "Telangana"},
    "gachibowli": {"pincode": "500032", "district": "Hyderabad", "city": "Hyderabad", "state": "Telangana"},
    "hitech city": {"pincode": "500081", "district": "Hyderabad", "city": "Hyderabad", "state": "Telangana"},
    "secunderabad": {"pincode": "500003", "district": "Hyderabad", "city": "Hyderabad", "state": "Telangana"},

    # Kolkata
    "salt lake": {"pincode": "700091", "district": "North 24 Parganas", "city": "Kolkata", "state": "West Bengal"},
    "park street": {"pincode": "700016", "district": "Kolkata", "city": "Kolkata", "state": "West Bengal"},
    "new town": {"pincode": "700156", "district": "North 24 Parganas", "city": "Kolkata", "state": "West Bengal"},
    "howrah": {"pincode": "711101", "district": "Howrah", "city": "Howrah", "state": "West Bengal"},

    # Ahmedabad
    "navrangpura": {"pincode": "380009", "district": "Ahmedabad", "city": "Ahmedabad", "state": "Gujarat"},
    "vastrapur": {"pincode": "380015", "district": "Ahmedabad", "city": "Ahmedabad", "state": "Gujarat"},
    "satellite": {"pincode": "380015", "district": "Ahmedabad", "city": "Ahmedabad", "state": "Gujarat"},

    # Pune
    "kothrud": {"pincode": "411038", "district": "Pune", "city": "Pune", "state": "Maharashtra"},
    "hinjewadi": {"pincode": "411057", "district": "Pune", "city": "Pune", "state": "Maharashtra"},
    "viman nagar": {"pincode": "411014", "district": "Pune", "city": "Pune", "state": "Maharashtra"},

    # Lucknow
    "gomti nagar": {"pincode": "226010", "district": "Lucknow", "city": "Lucknow", "state": "Uttar Pradesh"},
    "hazratganj": {"pincode": "226001", "district": "Lucknow", "city": "Lucknow", "state": "Uttar Pradesh"},
    "aliganj": {"pincode": "226024", "district": "Lucknow", "city": "Lucknow", "state": "Uttar Pradesh"}
}

def lookup_pincode(location_str: str) -> dict:
    if not location_str:
        return None
    loc_clean = location_str.lower()
    
    # Exact or substring match
    for key, data in PINCODE_DATABASE.items():
        if key in loc_clean or loc_clean in key:
            return data
            
    # Check words
    for key, data in PINCODE_DATABASE.items():
        words = key.split()
        if len(words) > 1 and all(w in loc_clean for w in words):
            return data

    return None

print("Lookup 'Rohini Sector 14':", lookup_pincode("Rohini Sector 14"))
print("Lookup 'Anna Nagar':", lookup_pincode("Anna Nagar"))
print("Lookup 'Koramangala, 5th Block':", lookup_pincode("Koramangala, 5th Block"))

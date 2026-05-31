#!/bin/bash
# Test StockX image URLs in batch
test_url() {
  local id="$1"
  local name="$2"
  local slug="$3"
  local url="https://images.stockx.com/images/${slug}-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90&dpr=2&trim=color"
  local code
  code=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>&1)
  echo "${code}|${id}|${name}|${slug}"
}

# Nike
test_url "8" "Structure Plus" "Nike-Structure-Plus-Black-White"
test_url "10" "Alphafly 3" "Nike-Alphafly-Next-3-Proto"
test_url "12" "Zoom Fly 6" "Nike-Zoom-Fly-6-Black-Smoke-Grey"
test_url "13" "Streakfly 2" "Nike-Streakfly-2-White-Black"
test_url "14" "Revolution 7" "Nike-Revolution-7-Black-White"
test_url "15" "Zegama Trail" "Nike-ZoomX-Zegama-Trail-2-Black-Grey"
test_url "16" "Kiger 10" "Nike-Kiger-10-Black-Orange"

# Adidas
test_url "19" "Boston 13" "adidas-Adizero-Boston-13-Cloud-White"
test_url "21" "Adios 9" "adidas-Adizero-Adios-9-Black-White"
test_url "22" "Prime X 2" "adidas-Adizero-Prime-X-2-Strung-White"
test_url "24" "Supernova Prima 2" "adidas-Supernova-Prima-2-Black"
test_url "25" "Ultraboost 5X" "adidas-Ultraboost-5X-Core-Black"
test_url "26" "Hyperboost Edge" "adidas-Hyperboost-Edge-White"
test_url "27" "Adistar 3" "adidas-Adistar-3-Black"
test_url "28" "Adizero SL 2" "adidas-Adizero-SL-2-Black"
test_url "29" "Galaxy 7" "adidas-Galaxy-7-Black"

# NB
test_url "32" "More v6" "New-Balance-Fresh-Foam-X-More-v6-Black"
test_url "33" "860v15" "New-Balance-Fresh-Foam-X-860v15-Black"
test_url "34" "Ellipse v1" "New-Balance-Fresh-Foam-X-Ellipse-v1-Black"
test_url "35" "Rebel v5" "New-Balance-FuelCell-Rebel-v5-Black"
test_url "36" "SC Elite v5" "New-Balance-FuelCell-SC-Elite-v5-White"
test_url "37" "SC Trainer v3" "New-Balance-FuelCell-SC-Trainer-v3-Black"
test_url "38" "SC Pacer v2" "New-Balance-FuelCell-SC-Pacer-v2-White"
test_url "39" "Kaiha Road" "New-Balance-Fresh-Foam-X-Kaiha-Road-Black"
test_url "40" "Hierro v9" "New-Balance-Fresh-Foam-X-Hierro-v9-Black"

# On
test_url "60" "Cloudsurfer Max" "On-Cloudsurfer-Max-Black"
test_url "61" "Cloudsurfer 2" "On-Cloudsurfer-2-Black"
test_url "62" "Cloudsurfer Next" "On-Cloudsurfer-Next-Black"
test_url "63" "Cloudrunner 3" "On-Cloudrunner-3-Black"
test_url "64" "Cloudflyer 5" "On-Cloudflyer-5-Black"
test_url "65" "Cloudswift 4" "On-Cloudswift-4-Black"
test_url "66" "Cloudboom Strike" "On-Cloudboom-Strike-White"
test_url "67" "Cloudflow 4" "On-Cloudflow-4-Black"
test_url "68" "Cloudvista 2" "On-Cloudvista-2-Black"
test_url "69" "Cloudsoma" "On-Cloudsoma-Black"

echo "DONE"

# Skeena Salmon Data Centre Theme

This extension replaces the CKAN theme with the SSDC theme

## Installation

To install: 
```
sudo docker exec -it ckan bash #to go into the ckan container
cd ./src
git clone https://github.com/skeenatrust/ckanext-skt_theme.git
```

Add to production.ini:
```
ckan.plugins = skt_theme
```

Restart CKAN:
```
sudo docker-compose restart ckan
```

## Motivation
A web project of datings from school 42 in MEAN stack.

## Installation
Consider that Docker and MongoDB are installed and running.
```
git clone https://github.com/hponcet/Matcha.git matcha;
cd matcha;
npm install;
docker-compose up -d && mongoimport --db matcha --collection citydb --file ./json/matcha-citydb.json
npm start;
```
If you want an users database:
```
mongoimport --db matcha --collection users --file ./json/matcha-current-users.json
```

## API Reference
Use of API [ipinfo.io/](https://ipinfo.io/)

## Contributors
- hponcet : hponcet@student.42.fr

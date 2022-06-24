## Teslo App

Aplicación construida con nexjs, mongodb y docker

1. para correr la aplicacion es necesario la base de datos en mongo.Iniciar docker descktop y correr en un cdm docker-compose corra el siguiente comando

```bash
docker-compose up -d
```

2. cadena de conexion para ambiente de desarrollo

```bash
mongodb://localhost:27017/teslodb
```

3. generar las variables de entorno en .env que son **MONGO_URL**

4. LLenar la base de datos con datos de prueba

```bash
http://localhost:3000/api/seed
```

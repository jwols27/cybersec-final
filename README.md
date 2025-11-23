# Projeto final de Cyber Security

---

**Professor:** Wagner Titon

**Alunas:**

- Ana Paula Rampanelli (404334)
- Júlia Patricia Wolschick (404691)

---

```shell
cp .env.example .env
```

Altere as variáveis de ambiente conforme necessário.

Iniciar o servidor:

```shell
npm start
```

## Certificados

### Servidor

Gerar certificados:

```shell
mkdir -p certs
cd certs
```

```shell
openssl genrsa -out ca.key 4096
```

```shell
openssl req -x509 -new -nodes \
  -key ca.key \
  -sha256 \
  -days 365 \
  -out ca.crt \
  -subj "/C=BR/ST=SC/L=Chapecó/O=CyberSecFinal/OU=Dev/CN=CyberSecCA"
```

```shell
openssl genrsa -out server.key 2048
```

```shell
openssl req -new \
  -key server.key \
  -out server.csr \
  -subj "/C=BR/ST=SC/L=Chapecó/O=CyberSecFinal/OU=Dev/CN=localhost"
```

```shell
openssl x509 -req \
  -in server.csr \
  -CA ca.crt \
  -CAkey ca.key \
  -CAcreateserial \
  -out server.crt \
  -days 365 \
  -sha256
```

Confiar no certificado (Arch Linux):

`sudo trust anchor --store certs/ca.crt`

### Cliente

Crie um certificado para o cliente:

```shell
openssl genrsa -out client.key 2048
```

```shell
 openssl req -new \
  -key client.key \ 
  -out client.csr \ 
  -subj "/C=BR/ST=SC/L=Chapecó/O=CyberSecFinal/OU=Cliente/CN=cliente1"
```

```shell
openssl x509 -req \
  -in client.csr \ 
  -CA ca.crt \  
  -CAkey ca.key \  
  -CAcreateserial \
  -out client.crt \ 
  -days 365 \
  -sha256
```

## Testar API

```shell
curl https://localhost:3443/api/data \
  --cert certs/client.crt --key certs/client.key
```
# Chroma

## Предварительные условия

Вам потребуется сервер Chroma. Вы можете:

1. Установить CLI Chroma и запустить сервер командой `chroma run`
2. Зарегистрироваться в Chroma Cloud.
3. Развернуть собственный экземпляр Chroma в Docker.

## Настройка

| Входные данные  | Описание                                                                | Значение по умолчанию   | Облако                           |
| --------------- | ----------------------------------------------------------------------- | ----------------------- | -------------------------------- |
| Document        | Можно подключать к узлам и [Загрузчик документов](../document-loaders/) |                         |                                  |
| Embeddings      | Можно подключать к узлам из [Вложения](../embeddings/)                  |                         |                                  |
| Collection Name | Название коллекции Chroma. Обратитесь сюда для правил именования        |                         |                                  |
| Chroma URL      | Укажите URL вашего экземпляра Chroma                                    | <http://localhost:8000> | <https://api.trychroma.com:8000> |

Для Chroma Cloud нужно получить ID арендатора, создать базу данных и API агента

### Дополнительные шаги

Если вы запускаете osmi\_ai и Chroma на Docker, необходимо выполнить дополнительные шаги.

1. Запустите Docker контейнер Chroma

```bash
docker compose up -d --build
```

2. Откройте файл `docker-compose.yml` в папке osmi\_ai

```bash
cd osmi_ai && cd docker
```

3. Modify the file to:

```sh
version: '3.1'

services:
    osmi_ai:
        image: osmi_ai/osmi_ai
        restart: always
        environment:
            - PORT=${PORT}
            - DEBUG=${DEBUG}
            - DATABASE_PATH=${DATABASE_PATH}
            - SECRETKEY_PATH=${SECRETKEY_PATH}
            - OSMI_AI_SECRETKEY_OVERWRITE=${osmi_ai_SECRETKEY_OVERWRITE}
            - LOG_PATH=${LOG_PATH}
            - LOG_LEVEL=${LOG_LEVEL}
            - EXECUTION_MODE=${EXECUTION_MODE}
        ports:
            - '${PORT}:${PORT}'
        volumes:
            - ~/.osmi_ai:/root/.osmi_ai
        networks:
            - osmi_ai_net
        command: /bin/sh -c "sleep 3; osmi_ai start"
networks:
    osmi_ai_net:
        name: chroma_net
        external: true
```

4. Запустите контейнер osmi\_ai

```bash
docker compose up -d
```

5. Настройка URL Chroma:
   Для Windows и MacOS используйте:
   <http://host.docker.internal:8000>
   Для Linux-систем, где host.docker.internal недоступен, используйте адрес Docker-шлюза, например:
   <http://172.17.0.1:8000>

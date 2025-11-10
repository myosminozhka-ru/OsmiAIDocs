# Chroma

## PrereqПредварительные условияuisite

Вам потребуется сервер Chroma. Вы можете:

1. Установить CLI Chroma и запустить сервер командой `chroma run`
2. Зарегистрироваться в [Chroma Cloud](https://trychroma.com/home).
3. Развернуть собственный экземпляр Chroma в [Docker](https://docs.trychroma.com/guides/deploy/docker).

## Настройка

| Входные данные  | Описание                                                                                                                                                | Значение по умолчанию   | Облако                           |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- | -------------------------------- |
| Document        | Можно подключать к узлам и [Document Loader](../document-loaders/)                                                                                      |                         |                                  |
| Embeddings      | Можно подключать к узлам из [Embeddings](../embeddings/)                                                                                                |                         |                                  |
| Collection Name | Название коллекции Chroma. Обратитесь [сюда](https://docs.trychroma.com/usage-guide#creating-inspecting-and-deleting-collections) для правил именования |                         |                                  |
| Chroma URL      | Укажите URL вашего экземпляра Chroma                                                                                                                    | <http://localhost:8000> | <https://api.trychroma.com:8000> |

Для Chroma Cloud нужно получить ID арендатора, создать базу данных и API ключ

![](/assets/image%20\(6\)%20\(1\)%20\(1\)%20\(1\)%20\(1\)%20\(2\)%20\(1\).png){width="238"}

### Дополнительные шаги

Если вы запускаете OSMI и Chroma на Docker, необходимо выполнить дополнительные шаги.

1. Запустите Docker контейнер Chroma

```bash
docker compose up -d --build
```

2. Откройте файл `docker-compose.yml` в папке OSMI

```bash
cd OSMI && cd docker
```

3. Modify the file to:

```sh
version: '3.1'

services:
    osmi:
        image: osmi/osmi
        restart: always
        environment:
            - PORT=${PORT}
            - DEBUG=${DEBUG}
            - DATABASE_PATH=${DATABASE_PATH}
            - SECRETKEY_PATH=${SECRETKEY_PATH}
            - FLOWISE_SECRETKEY_OVERWRITE=${OSMI_SECRETKEY_OVERWRITE}
            - LOG_PATH=${LOG_PATH}
            - LOG_LEVEL=${LOG_LEVEL}
            - EXECUTION_MODE=${EXECUTION_MODE}
        ports:
            - '${PORT}:${PORT}'
        volumes:
            - ~/.osmi:/root/.osmi
        networks:
            - osmi_net
        command: /bin/sh -c "sleep 3; osmi start"
networks:
    osmi_net:
        name: chroma_net
        external: true
```

4. Запустите контейнер osmi

```bash
docker compose up -d
```

5. Настройка URL Chroma:
   Для Windows и MacOS используйте:
   <http://host.docker.internal:8000>
   Для Linux-систем, где host.docker.internal недоступен, используйте адрес Docker-шлюза, например:
   <http://172.17.0.1:8000>

![](/assets/image%20\(5\)%20\(5\).png){width="256"}

## Ресурсы

- [LangChain JS Chroma](https://js.langchain.com/docs/modules/indexes/vector_stores/integrations/chroma)
- [Chroma Getting Started](https://docs.trychroma.com/getting-started)

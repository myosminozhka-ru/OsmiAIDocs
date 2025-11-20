---
description: Обновление встроенных данных и выполнение поиска по сходству с
  использованием pgvector на Postgres.
---

# Postgres

Есть несколько способов подключиться к Postgres в зависимости от вашей настройки. Ниже представлен пример локальной конфигурации с использованием преднастроенного Docker-образа, предоставленного командой pgvector.

Создайте файл с именем `docker-compose.yml` со следующим содержимым:

```yaml
# Run this command to start the database:
# docker-compose up --build
version: "3"
services:
  db:
    hostname: 127.0.0.1
    image: pgvector/pgvector:pg16
    ports:
      - 5432:5432
    restart: always
    environment:
      - POSTGRES_DB=api
      - POSTGRES_USER=myuser
      - POSTGRES_PASSWORD=ChangeMe
    volumes:
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
```

Запустите контейнер Postgres командой: `docker compose up`

Создайте новые учетные данные с использованием указанных настроек пользователя и пароля из файла `docker-compose.yml`.

Заполните поля узла (node) следующими значениями, соответствующими конфигурации из файла `docker-compose.yml`:

- Host: **localhost**
- Database: **api**
- Port: **5432**

Теперь у вас настроена база данных Postgres с поддержкой pgvector, готовая к использованию для вставки векторов и выполнения поиска по сходству.

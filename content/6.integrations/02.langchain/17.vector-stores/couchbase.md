---
description: Upsert встроенных данных и выполнение поиска по вектору с
  использованием Couchbase — платформы облачных NoSQL для критически важных
  приложений с искусственным интеллектом.
---

# Couchbase

## Предварительные условия

### Требования

1. Кластер Couchbase (Self Managed или Capella) версии 7.6+ с включенной Search Service.
2. Настройка Capella: Для подключения к кластеру Capella следуйте инструкциям.
   - Создайте учётные данные базы данных для доступа к кластеру..
   - Разрешите доступ к кластеру с IP-адреса, с которого запускается приложение.

Самостоятельная настройка:

- Следуйте параметрам установки Couchbase Installation Options для установки последней версии сервера базы данных Couchbase. Обязательно добавьте службу поиска.

3. Создайте поисковый индекс в разделе Search

### Импорт поискового индекса

#### В Couchbase Capella

- Скопируйте определение индекса в новый файл `index.json`.
- Импортируйте файл согласно документации.
- Нажмите Create Index для завершения.

#### В Couchbase Server

Перейдите в Поиск → Добавить индекс → Импорт.

- Вставьте определение индекса.
- Нажмите Создать индекс.
- Вы также можете создать векторный индекс через UI поиска на обоих платформах.

Вы также можете создать векторный индекс с помощью пользовательского интерфейса поиска как на Couchbase Capella, так и на Couchbase Self Managed Server.

### Определение индекса

Вы создаёте индекс `vector-index` на документах, где:
Поле `embedding` — вектор с 1536 измерениями, с метрикой сходства `dot_product`.
Включается индексирование и хранение всех полей внутри `metadata` в динамическом режиме.
В документах будет индексироваться и храниться поле `text`.

```json
{
  "name": "vector-index",
  "type": "fulltext-index",
  "params": {
    "doc_config": {
      "docid_prefix_delim": "",
      "docid_regexp": "",
      "mode": "scope.collection.type_field",
      "type_field": "type"
    },
    "mapping": {
      "default_analyzer": "standard",
      "default_datetime_parser": "dateTimeOptional",
      "default_field": "_all",
      "default_mapping": {
        "dynamic": true,
        "enabled": false
      },
      "default_type": "_default",
      "docvalues_dynamic": false,
      "index_dynamic": true,
      "store_dynamic": false,
      "type_field": "_type",
      "types": {
        "_default._default": {
          "dynamic": true,
          "enabled": true,
          "properties": {
            "embedding": {
              "enabled": true,
              "dynamic": false,
              "fields": [
                {
                  "dims": 1536,
                  "index": true,
                  "name": "embedding",
                  "similarity": "dot_product",
                  "type": "vector",
                  "vector_index_optimized_for": "recall"
                }
              ]
            },
            "metadata": {
              "dynamic": true,
              "enabled": true
            },
            "text": {
              "enabled": true,
              "dynamic": false,
              "fields": [
                {
                  "index": true,
                  "name": "text",
                  "store": true,
                  "type": "text"
                }
              ]
            }
          }
        }
      }
    },
    "store": {
      "indexType": "scorch",
      "segmentVersion": 16
    }
  },
  "sourceType": "gocbcore",
  "sourceName": "pdf-chat",
  "sourceParams": {},
  "planParams": {
    "maxPartitionsPerPIndex": 64,
    "indexPartitions": 16,
    "numReplicas": 0
  }
}

```

## Настройка

1. На холсте добавьте узел **Couchbase** и укажите:

- имя bucket,
- имя scope,
- имя коллекции,
- имя индекса.

2. Создайте новые учётные данные:

- Couchbase Connection String
- Cluster Username
- Cluster Password

3. Добавьте новые узлы и запустите процесс upsert (обновление/вставка данных).

- Связать документ можно с любым узлом из категории [**Загрузчик документов**](../document-loaders/).
- Связать **Вложения** — с узлом из [**Вложения** ](../embeddings/).

4. Перейдите в UI Couchbase и убедитесь, что данные успешно добавлены.

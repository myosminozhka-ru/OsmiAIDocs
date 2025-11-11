---
description: Upsert встроенных данных и выполнение поиска по вектору с
  использованием Couchbase — платформы облачных NoSQL для критически важных
  приложений с искусственным интеллектом.
---

# Couchbase

## Предварительные условия

### Требования

1. Кластер Couchbase (Self Managed или Capella) версии 7.6+ с включенной [Search Service](https://docs.couchbase.com/server/current/search/search.html).
2. Настройка Capella: Для подключения к кластеру Capella следуйте [инструкциям](https://docs.couchbase.com/cloud/get-started/connect.html?_gl=1*1yhpmel*_gcl_au*MTMzNDE3NTQxLjE3MzY5MjA5MzQ.).
   - Создайте [учётные данные базы данных](https://docs.couchbase.com/cloud/clusters/manage-database-users.html?_gl=1*19zk7vq*_gcl_au*MTMzNDE3NTQxLjE3MzY5MjA5MzQ.) для доступа к кластеру..
   - [Разрешите доступ](https://docs.couchbase.com/cloud/clusters/allow-ip-address.html?_gl=1*19zk7vq*_gcl_au*MTMzNDE3NTQxLjE3MzY5MjA5MzQ.) к кластеру с IP-адреса, с которого запускается приложение.
     :br-self Самостоятельная настройка::
   - Следуйте параметрам установки [Couchbase Installation Options](https://developer.couchbase.com/tutorial-couchbase-installation-options) для установки последней версии сервера базы данных Couchbase. Обязательно добавьте службу поиска.
3. Создайте поисковый индекс в разделе Search

### Импорт поискового индекса

#### В [Couchbase Capella](\(https:/docs.couchbase.com/cloud/search/import-search-index.html)

- Скопируйте определение индекса в новый файл `index.json`.
- Импортируйте файл согласно документации.
- Нажмите Create Index для завершения.

#### В [Couchbase Server](\(https:/docs.couchbase.com/server/current/search/import-search-index.html)

Перейдите в Search → Add Index → Import.

- Вставьте определение индекса.
- Нажмите Create Index.
- Вы также можете создать векторный индекс через UI поиска на обоих платформах.

You may also create a vector index using Search UI on both [Couchbase Capella](https://docs.couchbase.com/cloud/vector-search/create-vector-search-index-ui.html?_gl=1*1rglcpj*_gcl_au*MTMzNDE3NTQxLjE3MzY5MjA5MzQ.) and [Couchbase Self Managed Server](https://docs.couchbase.com/server/current/vector-search/create-vector-search-index-ui.html?_gl=1*t7aeet*_gcl_au*MTMzNDE3NTQxLjE3MzY5MjA5MzQ.).

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

![](/assets/couchbase_1.png)

2. Создайте новые учётные данные:

- Couchbase Connection String
- Cluster Username
- Cluster Password

![](/assets/couchbase_2.png)

3. Добавьте новые узлы и запустите процесс upsert (обновление/вставка данных).

- Связать документ можно с любым узлом из категории [**Document Loader**](../document-loaders/).
- Связать **Embeddings** — с узлом из [**Embeddings** ](../embeddings/).

![](/assets/couchbase_3.png)![](/assets/couchbase_4.png)

4. Перейдите в UI Couchbase и убедитесь, что данные успешно добавлены.

## Ресурсы

- Интеграции LangChain для Couchbase векторного хранилища
  - [Python](https://python.langchain.com/docs/integrations/vectorstores/couchbase/)
  - [NodeJS](https://js.langchain.com/docs/integrations/vectorstores/couchbase/)
- Обратитесь к документации [Couchbase Documentation](https://docs.couchbase.com/home/index.html), чтобы ознакомиться с информацией о Couchbase.

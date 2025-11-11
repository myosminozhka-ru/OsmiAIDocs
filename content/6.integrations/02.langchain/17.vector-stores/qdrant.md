# Qdrant

## Предварительные условия

[Локально запущенная инстанция Qdrant](https://qdrant.tech/documentation/quick-start/) или инстанция Qdrant в облаке.

Получение инстанции Qdrant в облаке:

1. Перейдите в раздел Clusters (Кластеров) на панели управления [Cloud Dashboard](https://cloud.qdrant.io/overview).
2. Выберите **Clusters** и нажмите **+ Create** (Создать).

![](/assets/qdrant/2.png)

3. Выберите конфигурации кластера и регион.
4. Нажмите **Create** (Создать), чтобы запустить кластер.

## Настройка

1. Получите или создайте API-ключ в разделе Data Access Control (Контроль доступа к данным) на панели [Cloud Dashboard](https://cloud.qdrant.io/overview).
2. Добавьте новый узел Qdrant на холст.
3. Создайте новые учетные данные для Qdrant, используя API-ключ.

![](/assets/qdrant/1.png){width="563"}

4. Заполните необходимые поля в узле **Qdrant**:
   - Qdrant server URL — URL сервера Qdrant.
   - Collection name — название коллекции.

![](/assets/qdrant/3.png){width="239"}

5. Документы можно подключить к любому узлу категории [**Document Loader**](../document-loaders/).
6. Векторные представления (Embeddings) можно подключить к любому узлу категории [**Embeddings**](../embeddings/).

## Фильтрация

Допустим, у вас есть несколько документов, добавленных (upserted), каждые с уникальным значением в метаданных по ключу `{source}`.

::div{align="left"}
![](/assets/Screenshot%202024-03-05%20141551.png){width="563"}![](/assets/Screenshot%202024-03-05%20141619.png){width="563"}
::

Вы хотите фильтровать по этому ключу. Qdrant поддерживает следующий [синтаксис](https://qdrant.tech/documentation/concepts/filtering/#nested-key) для фильтрации:

**UI** — через интерфейс пользователя (в случае визуальных инструментов).

![](/assets/image%20\(1\)%20\(1\)%20\(1\)%20\(1\)%20\(1\)%20\(1\)%20\(1\)%20\(2\)%20\(1\)%20\(1\)%20\(1\).png){width="338"}

**API** — через API-запрос

```json
"overrideConfig": {
    "qdrantFilter": {
        "should": [
            {
                "key": "metadata.source",
                "match": {
                    "value": "apple"
                }
            }
        ]
    }
}
```

## Ресурсы

- [Qdrant documentation](https://qdrant.tech/documentation/)
- [LangChain JS Qdrant](https://js.langchain.com/docs/integrations/vectorstores/qdrant)
- [Qdrant Filter](https://qdrant.tech/documentation/concepts/filtering/#nested-key)

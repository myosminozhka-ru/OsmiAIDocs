---
description: Обновление встроенных данных и выполнение поиска по сходству с
  использованием Pinecone — ведущей полностью управляемой облачной векторной
  базы данных.
---

# Pinecone

## Предварительные условия

1. Зарегистрируйтесь на [Pinecone](https://app.pinecone.io/)
2. Нажмите **Create index**

![](/assets/pinecone_1.png)

3. Заполните необходимые поля:
   - **Index Name**, название создаваемого индекса (например, "flowise-test").
   - **Dimensions**, размер векторов, которые будут вставлены в индекс (например, 1536).

![](/assets/pinecone_2.png){width="527"}

4. Нажмите **Create Index**

## Настройка

1. Получите или создайте ваш **API Key**

![](/assets/pinecone_3.png)

2. Добавьте новый узел **Pinecone** на холст и заполните параметры:
   - Pinecone Index - название индекса
   - Pinecone namespace (необязательно)

![](/assets/pinecone_4.png){width="279"}

3. Создайте новые учетные данные Pinecone → Введите **API Key**.

![](/assets/pinecone_5.png){width="563"}

4. Добавьте дополнительные узлы на холст и начните процесс обновления данных (upsert).
   - Документы можно подключить к любому узлу категории [**Document Loader**](../document-loaders/).
   - Векторные представления (Embeddings) можно подключить к любому узлу категории [**Embeddings** ](../embeddings/).

![](/assets/pinecone_6.png)![](/assets/pinecone_7.png)

5. Проверьте через [дашборд Pinecone](https://app.pinecone.io), чтобы убедиться, что данные успешно обновлены (upserted).

![](/assets/pinecone_8.png)

6. Ресурсы

- Интеграция Pinecone с LangChain
  - [Python](https://docs.langchain.com/oss/python/langchain/overview)
  - [NodeJS](https://docs.langchain.com/oss/javascript/langchain/retrieval)
- Интеграция [Pinecone с LangChain](https://docs.pinecone.io/integrations/langchain)
- Интеграция [Pinecone с OSMI](https://docs.pinecone.io/integrations/flowise)
- Официальные [клиенты Pinecone](https://docs.pinecone.io/reference/pinecone-clients)

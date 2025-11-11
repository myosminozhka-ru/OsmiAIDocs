# Elastic

## Предварительные условия

1. Вы можете начать с использования официального [Docker image](https://www.elastic.co/guide/en/elasticsearch/reference/current/docker.html) или воспользоваться облачным сервисом [Elastic Cloud](https://www.elastic.co/cloud/), официальной облачной платформой Elastic. В этой инструкции мы будем использовать облачную версию.
2. [Зарегистрируйтесь](https://cloud.elastic.co/registration) на Elastic Cloud или [войдите](https://cloud.elastic.co/login) в существующий аккаунт.

![](/assets/elastic1.png)

3. Нажмите **Create deployment**. Затем укажите название развертывания и выберите провайдера.

![](/assets/elastic2.png){width="563"}

4. После завершения развертывания вы увидите руководства по настройке, как показано ниже. Нажмите **Set up vector search** (Настроить векторный поиск).

![](/assets/elastic4.png)

5. Теперь откроется страница Getting started for Vector Search (Начало работы по векторному поиску).

![](/assets/elastic5.png)

6. В боковой панели слева нажмите **Indices** (Индексы). Затем — **Create a new index** (Создать новый индекс).

![](/assets/elastic6.png)

7. Выберите метод загрузки данных — API ingestion method.

![](/assets/elastic7.png)

8. Укажите название вашего поискового индекса и нажмите **Create Index** (Создать индекс).

![](/assets/elastic8.png)

9. После создания индекса сгенерируйте новый API-ключ, запомните оба: и API-ключ, и URL.

![](/assets/elastic9.png)

## Настройка OSMI

1. Добавьте новый узел **Elasticsearch** на холст и укажите имя индекса.

![](/assets/elastic10.png){width="275"}

2. Добавьте новые учетные данные через **Elasticsearch API**.

![](/assets/elastic11.png){width="429"}

3. Возьмите URL и API-ключ из ElasticSearch и заполните соответствующие поля.

![](/assets/elastic12.png){width="563"}

4. После успешного создания учетных данных можно начинать загрузку (upsert) данных.

![](/assets/Untitled%20\(1\)%20\(1\)%20\(1\).png)![](/assets/elastic13.png)

5. После успешной загрузки данных вы можете проверить их через панель управления Elastic.

![](/assets/image%20\(7\)%20\(1\)%20\(1\)%20\(1\)%20\(1\)%20\(1\)%20\(2\)%20\(1\).png)

6. Теперь вы можете задавать вопросы в чате.

![](/assets/image%20\(6\)%20\(1\)%20\(1\)%20\(1\)%20\(1\)%20\(1\)%20\(1\)%20\(2\)%20\(1\).png)

## Ресурсы

- [LangChain JS Elastic](https://js.langchain.com/docs/integrations/vectorstores/elasticsearch)
- [Vector Search (kNN) Implementation Guide - API Edition](https://www.elastic.co/search-labs/blog/articles/vector-search-implementation-guide-api-edition)

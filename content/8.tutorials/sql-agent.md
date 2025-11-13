# SQL Agent

Этот учебник проведет вас по созданию интеллектуального SQL-агента, который умеет взаимодействовать с базой данных, генерировать SQL-запросы, проверять их, выполнять и самостоятельно исправлять ошибки при необходимости.

## Обзор

Рабочий процесс SQL-агента реализует надежную систему взаимодействия с базой данных, которая:

1. Получает информацию о структуре базы данных
2. Генерирует SQL-запросы на основе вопросов пользователя
3. Проверяет сгенерированные запросы на наличие распространенных ошибок
4. Выполняет запросы к базе данных
5. Проверяет результаты на наличие ошибок и при необходимости самостягивает их
6. Формирует ответы на естественном языке на основе результатов запроса

![](/assets/image%20\(5\)%20\(1\)%20\(1\)%20\(1\)%20\(1\)%20\(1\)%20\(1\).png)

### Настройка стартового узла

Начинайте с добавления узла "Старт" на вашу панель. Этот узел служит точкой входа для вашего SQL-агента.

![](/assets/image%20\(1\)%20\(1\)%20\(1\)%20\(1\)%20\(1\)%20\(1\)%20\(1\)%20\(1\)%20\(1\)%20\(1\)%20\(1\)%20\(1\)%20\(1\).png){width="563"}

#### Конфигурация:

- **Input Type**: Выберите "Chat Input" (чат-вход), чтобы принимать вопросы пользователя
- **Flow State**: Добавьте переменную состояния с ключом `sqlQuery` и пустым значением

Этот узел инициализирует состояние потока — переменную `sqlQuery`, в которую будет записываться созданный SQL-запрос.

### Шаг 2: Получение структуры базы данных

Добавьте узел "Функция" (**Custom Function**) и соедините его со стартовым узлом.

![](/assets/image%20\(3\)%20\(1\)%20\(1\)%20\(1\)%20\(1\)%20\(1\)%20\(1\)%20\(1\)%20\(1\)%20\(1\)%20\(1\).png){width="563"}

#### Конфигурация:

- **Javascript Function**: Пример функции, которая подключается к вашей базе данных и извлекает информацию о всей структуре — таблицах, столбцах и примерных данных.

```javascript
const { DataSource } = require('typeorm');

const HOST = 'localhost';
const USER = 'testuser';
const PASSWORD = 'testpwd';
const DATABASE = 'testdatabase';
const PORT = 5432;

let sqlSchemaPrompt = '';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: HOST,
  port: PORT,
  username: USER,
  password: PASSWORD,
  database: DATABASE,
  synchronize: false,
  logging: false,
});

async function getSQLPrompt() {
  try {
    await AppDataSource.initialize();
    const queryRunner = AppDataSource.createQueryRunner();

    // Get all user-defined tables
    const tablesResult = await queryRunner.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    `);

    for (const tableRow of tablesResult) {
      const tableName = tableRow.table_name;
      const schemaInfo = await queryRunner.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = '${tableName}'
      `);

      const createColumns = [];
      const columnNames = [];

      for (const column of schemaInfo) {
        const name = column.column_name;
        const type = column.data_type.toUpperCase();
        const notNull = column.is_nullable === 'NO' ? 'NOT NULL' : '';
        columnNames.push(name);
        createColumns.push(`${name} ${type} ${notNull}`);
      }

      const sqlCreateTableQuery = `CREATE TABLE ${tableName} (${createColumns.join(', ')})`;
      const sqlSelectTableQuery = `SELECT * FROM ${tableName} LIMIT 3`;

      let allValues = [];
      try {
        const rows = await queryRunner.query(sqlSelectTableQuery);
        allValues = rows.map(row =>
          columnNames.map(col => row[col]).join(' ')
        );
      } catch (err) {
        allValues.push('[ERROR FETCHING ROWS]');
      }

      sqlSchemaPrompt +=
        sqlCreateTableQuery + '\n' +
        sqlSelectTableQuery + '\n' +
        columnNames.join(' ') + '\n' +
        allValues.join('\n') + '\n\n';
    }

    await queryRunner.release();
  } catch (err) {
    console.error(err);
    throw err;
  }
}

await getSQLPrompt();
return sqlSchemaPrompt;
```

### Шаг 3: Генерация SQL-запросов

Добавьте узел **LLM** (Large Language Model), соединённый с узлом "Получить схему базы данных".

![](/assets/image%20\(4\)%20\(1\)%20\(1\)%20\(1\)%20\(1\)%20\(1\)%20\(1\)%20\(1\)%20\(1\)%20\(1\)%20\(1\).png){width="563"}

#### Конфигурация:

- **Messages**: добавьте системное сообщение:
  :

```text
You are an agent designed to interact with a SQL database. Given an input question, create a syntactically correct sqlite query to run, then look at the results of the query and return the answer. Unless the user specifies a specific number of examples they wish to obtain, always limit your query to at most 5 results. You can order the results by a relevant column to return the most interesting examples in the database. Never query for all the columns from a specific table, only ask for the relevant columns given the question. DO NOT make any DML statements (INSERT, UPDATE, DELETE, DROP etc.) to the database.

Here is the relevant table info:
{{ customFunctionAgentflow_0 }}

Note:
- Only generate ONE SQL query
```

- \*\*JSON Здесь мы инструктируем модель возвращать только структурированный вывод, чтобы предотвратить включение моделью любого текста помимо SQL-запроса.
  Ключ: "sql\_query".
  - Ключ: "`sql_query`"
  - Тип: "string"
  - Описание: "SQL query"
- Обновить состояние потока: Установить ключ`sqlQuery`" со значением `{{ output.sql_query }}`

Этот узел преобразует вопрос пользователя на естественном языке в структурированный SQL-запрос, используя информацию о схеме базы данных.

### Шаг 4: Проверка синтаксиса

SQL-запроса Добавьте условный узел **Condition Agent**, связанный с узлом генерации SQL-запроса.

![](/assets/image%20\(5\)%20\(1\)%20\(1\)%20\(1\)%20\(1\)%20\(1\)%20\(1\)%20\(1\).png){width="563"}

#### Конфигурация:

- **Инструкции**:

```text
You are a SQL expert with a strong attention to detail. Double check the SQL query for common mistakes, including:
- Using NOT IN with NULL values
- Using UNION when UNION ALL should have been used
- Using BETWEEN for exclusive ranges
- Data type mismatch in predicates
- Properly quoting identifiers
- Using the correct number of arguments for functions
- Casting to the correct data type
- Using the proper columns for joins
```

- **Входные данные:**: `{{ $flow.state.sqlQuery }}`
- **Сценарии**:
  - Сценарий 1: "Запрос правильный и ошибок не содержи"
  - Сценарий 2: "Обнаружены ошибки в запросе"

Этот шаг помогает выявить типичные SQL-ошибки до выполнения.

### Шаг 5: Обработка ошибок и повторное формирование запроса

Для неправильных запросов (выход 1) добавьте цикл **Loop**.

![](/assets/image%20\(6\)%20\(1\)%20\(1\)%20\(1\)%20\(1\)%20\(1\).png){width="375"}

#### Конфигурация:

![](/assets/image%20\(7\)%20\(1\)%20\(1\)%20\(1\)%20\(1\)%20\(1\).png){width="526"}

- **Loop Back To**: "Генерировать SQL-запрос заново"
- **Max Loop Count**: Максимальное число итераций: 5

Это создает цикл, который позволяет повторно генерировать запрос, если обнаружены ошибки.

### Шаг 6: Выполнение валидного SQL-запроса

Добавьте узел **Custom Function** для выполнения запроса.

![](/assets/image%20\(8\)%20\(1\)%20\(1\)%20\(1\)%20\(1\).png){width="375"}

#### Конфигурация:

![](/assets/image%20\(9\)%20\(1\)%20\(1\)%20\(1\).png){width="563"}

- **Input Variables**: Здесь мы передаем сгенерированный SQL-запрос в качестве переменной для использования в функции..
  - Имя переменной: "sqlQuery"
  - Значение переменной: `{{ $flow.state.sqlQuery }}`
- **Javascript Function**: Эта функция выполняет валидированный SQL-запрос против базы данных и форматирует результаты.

```javascript
const { DataSource } = require('typeorm');

const HOST = 'localhost';
const USER = 'testuser';
const PASSWORD = 'testpwd';
const DATABASE = 'testdatabase';
const PORT = 5432;

const sqlQuery = $sqlQuery;

const AppDataSource = new DataSource({
  type: 'postgres',
  host: HOST,
  port: PORT,
  username: USER,
  password: PASSWORD,
  database: DATABASE,
  synchronize: false,
  logging: false,
});

let formattedResult = '';

async function runSQLQuery(query) {
  try {
    await AppDataSource.initialize();
    const queryRunner = AppDataSource.createQueryRunner();

    const rows = await queryRunner.query(query);
    console.log('rows =', rows);

    if (rows.length === 0) {
      formattedResult = '[No results returned]';
    } else {
      const columnNames = Object.keys(rows[0]);
      const header = columnNames.join(' ');
      const values = rows.map(row =>
        columnNames.map(col => row[col]).join(' ')
      );

      formattedResult = query + '\n' + header + '\n' + values.join('\n');
    }

    await queryRunner.release();
  } catch (err) {
    console.error('[ERROR]', err);
    formattedResult = `[Error executing query]: ${err}`;
  }

  return formattedResult;
}

await runSQLQuery(sqlQuery);
return formattedResult;
```

### Шаг 7: Проверка результатов выполнения запроса

Добавьте условный узел **Condition Agent**, который проверяет, корректны ли результаты.

![](/assets/image%20\(10\)%20\(1\)%20\(1\)%20\(1\).png){width="563"}

#### Конфигурация:

- **Инструкции**: "Вы — эксперт по SQL, проверьте, правильны ли результаты выполнения запроса или есть ошибки."
- **Входные данные**: `{{ customFunctionAgentflow_1 }}`
- **Сценарии**:
  - Сценарий 1: "Результат правильный, ошибок нет"
  - Сценарий 2: "Обнаружена ошибка при выполнении запроса"

Этот шаг помогает определить, нужно ли исправлять запрос.

### Шаг 8: Формирование финального ответа (успешный путь)

Для успешных результатов (output 0 от Condition Agent) добавьте узел **LLM**.

![](/assets/image%20\(11\)%20\(1\)%20\(1\)%20\(1\).png){width="375"}

#### Конфигурация:

- **Входящее сообщение**: `{{ customFunctionAgentflow_1 }}`

Этот узел генерирует ответ на естественном языке на основе успешных результатов запроса.

### Шаг 9: Обработка ошибок выполнения (путь при ошибке)

Для неуспешных выполнений (output 1 от Condition Agent) добавьте узел **LLM**.

![](/assets/image%20\(12\)%20\(1\)%20\(1\)%20\(1\).png){width="375"}

#### Конфигурация:

![](/assets/image%20\(13\)%20\(1\)%20\(1\)%20\(1\).png){width="399"}

- **Сообщения**: Добавьте то же системное сообщение, что и на шаге 3
- **Входящее сообщение**:

```text
Учитывая сгенерированный SQL-запрос: {{ $flow.state.sqlQuery }}
У меня возникает следующая ошибка: {{ customFunctionAgentflow_1 }}
Сгенерируйте новый SQL-запрос, который исправит ошибку
```

- **JSON-структурированный выводt**: тот же, что на шаге 3
- **Обновление состояния потока**: установить ключ `sqlQuery` со значением `{{ output.sql_query }}`

Этот узел анализирует ошибки выполнения и генерирует исправленные SQL-запросы.

### Шаг 10: Добавление второго обратного цикла

Добавьте узел **Loop**, соединённый с "Regenerate SQL Query" (Перегенерировать SQL-запрос) LLM.

![](/assets/image%20\(14\)%20\(1\)%20\(1\)%20\(1\).png){width="563"}

#### Настройка:

- **Loop Back To**: "Check SQL Query" (Повторить проверку SQL-запроса)
- **Max Loop Count**: установить значение 5

Это создает второй цикл обратной связи для исправления ошибок во время выполнения.

---

## Полная структура потока

{% file src="/assets/SQL Agent.json" %}

---

## Краткое содержание

1. Старт → Получить схему базы данных (Get DB Schema)
2. Получить схему БД → Сгенерировать SQL-запрос
3. Сгенерировать SQL-запрос → Проверить SQL-запрос
4. Проверить SQL-запрос (правильный) → Выполнить SQL-запрос
5. Проверить SQL-запрос (неверный) → Перегенерировать запрос (цикл)
6. Выполнить SQL-запрос → Проверить результат
7. Проверить результат (успешно) → Вернуть ответ
8. Проверить результат (ошибка) → Перегенерировать SQL-запрос
9. Повторная генерация SQL-запроса → Повторная проверка SQL-запроса (цикл)

---

## Тестирование вашего SQL-агента

Проверьте своего агента, ответив на различные вопросы по базе данных:

- Простые запросы: «Показать мне всех клиентов»
- Сложные запросы: «Какие 5 товаров лидируют по объему продаж?»
- Аналитические запросы: «Рассчитать среднюю стоимость заказа по месяцам»

![](/assets/image%20\(15\)%20\(1\)%20\(1\)%20\(1\).png){width="563"}

Этот поток SQL Agent обеспечивает надежную, самокорректирующуюся систему для взаимодействия с базой данных, которая может обрабатывать SQL-запросы на естественном языке.

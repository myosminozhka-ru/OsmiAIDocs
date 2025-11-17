# Взаимодействие с API

Почти все веб-приложения основываются на RESTful API. Разрешая LLM взаимодействовать с ними, расширяется его практическая полезность.

Этот урок демонстрирует, как LLM можно использовать для выполнения вызовов API через вызов интеграций.

## Требование — пример сервера управления событиями

Мы будем использовать простую серверную систему управления событиями и показать, как с ней взаимодействовать.

```javascript
const express = require('express');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5566;

// Middleware
app.use(express.json());

// Fake database - in-memory storage
let events = [
  {
    id: '1',
    name: 'Tech Conference 2024',
    date: '2024-06-15T09:00:00Z',
    location: 'San Francisco, CA'
  },
  {
    id: '2',
    name: 'Music Festival',
    date: '2024-07-20T18:00:00Z',
    location: 'Austin, TX'
  },
  {
    id: '3',
    name: 'Art Exhibition Opening',
    date: '2024-05-10T14:00:00Z',
    location: 'New York, NY'
  },
  {
    id: '4',
    name: 'Startup Networking Event',
    date: '2024-08-05T17:30:00Z',
    location: 'Seattle, WA'
  },
  {
    id: '5',
    name: 'Food & Wine Tasting',
    date: '2024-09-12T19:00:00Z',
    location: 'Napa Valley, CA'
  }
];

// Helper function to validate event data
const validateEvent = (eventData) => {
  const required = ['name', 'date', 'location'];
  const missing = required.filter(field => !eventData[field]);
  
  if (missing.length > 0) {
    return { valid: false, message: `Missing required fields: ${missing.join(', ')}` };
  }
  
  // Basic date validation
  const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/;
  if (!dateRegex.test(eventData.date)) {
    return { valid: false, message: 'Date must be in ISO 8601 format (YYYY-MM-DDTHH:mm:ssZ)' };
  }
  
  return { valid: true };
};

// GET /events - List all events
app.get('/events', (req, res) => {
  res.status(200).json(events);
});

// POST /events - Create a new event
app.post('/events', (req, res) => {
  const validation = validateEvent(req.body);
  
  if (!validation.valid) {
    return res.status(400).json({ error: validation.message });
  }
  
  const newEvent = {
    id: req.body.id || uuidv4(),
    name: req.body.name,
    date: req.body.date,
    location: req.body.location
  };
  
  events.push(newEvent);
  res.status(201).json(newEvent);
});

// GET /events/{id} - Retrieve an event by ID
app.get('/events/:id', (req, res) => {
  const event = events.find(e => e.id === req.params.id);
  
  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }
  
  res.status(200).json(event);
});

// DELETE /events/{id} - Delete an event by ID
app.delete('/events/:id', (req, res) => {
  const eventIndex = events.findIndex(e => e.id === req.params.id);
  
  if (eventIndex === -1) {
    return res.status(404).json({ error: 'Event not found' });
  }
  
  events.splice(eventIndex, 1);
  res.status(204).send();
});

// PATCH /events/{id} - Update an event's details by ID
app.patch('/events/:id', (req, res) => {
  const eventIndex = events.findIndex(e => e.id === req.params.id);
  
  if (eventIndex === -1) {
    return res.status(404).json({ error: 'Event not found' });
  }
  
  const validation = validateEvent(req.body);
  
  if (!validation.valid) {
    return res.status(400).json({ error: validation.message });
  }
  
  // Update the event
  events[eventIndex] = {
    ...events[eventIndex],
    name: req.body.name,
    date: req.body.date,
    location: req.body.location
  };
  
  res.status(200).json(events[eventIndex]);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Event Management API server is running on port ${PORT}`);
  console.log(`Available endpoints:`);
  console.log(`  GET    /events      - List all events`);
  console.log(`  POST   /events      - Create a new event`);
  console.log(`  GET    /events/{id} - Get event by ID`);
  console.log(`  PATCH  /events/{id} - Update event by ID`);
  console.log(`  DELETE /events/{id} - Delete event by ID`);
});

module.exports = app; 
```

---

## Интеграции для запросов (Request Tools)

Доступно 4 интеграции запросов, которые можно использовать. Это позволяет LLM вызывать интеграции GET, POST, PUT и DELETE по мере необходимости.

### Шаг 1: Добавьте стартовый узел

Стартовый узел — это входная точка вашего сценария.

![](/assets/image%20\(4\)%20\(1\)%20\(1\)%20\(1\)%20\(1\)%20\(1\)%20\(1\)%20\(1\)%20\(1\).png){width="324"}

### Шаг 2: Добавьте узел агент

Затем добавьте узел Agent. В этой настройке агент настроен с четырьмя основными интеграциями: GET, POST, PUT и DELETE. Каждая интеграция предназначена для выполнения конкретного типа API-запроса.

#### Интеграция 1: GET (Получение событий)

![](/assets/image%20\(1\)%20\(1\)%20\(1\)%20\(1\)%20\(1\)%20\(1\)%20\(1\)%20\(1\)%20\(1\)%20\(1\)%20\(1\)%20\(1\).png){width="335"}

- **Цель:** получить список событий или конкретное событие из API.
- **Настройки**:**:**
  - **URL:** `http://localhost:5566/events`
  - **Имя:** `get_events`
  - **Описание:** Опишите, когда использовать этот интеграцию. Например: `Use this when you need to get events`
  - **Headers (Заголовки):** (по желанию) добавьте необходимые HTTP-заголовки.
  - **Schema параметров запроса:** JSON-схема API, которая позволяет LLM знать структуру URL, а также какие параметры пути и запроса нужно генерировать.Например:
    ```json
    {
      "id": {
        "type": "string",
        "in": "path",
        "description": "ID of the item to get. /:id"
      },
      "limit": {
        "type": "string",
        "in": "query",
        "description": "Limit the number of items to get. ?limit=10"
      }
    }
    ```

#### Интеграция 2: POST (Создание события)

![](/assets/image%20\(2\)%20\(1\)%20\(1\)%20\(1\)%20\(1\)%20\(1\)%20\(1\)%20\(1\)%20\(1\)%20\(1\)%20\(1\).png){width="335"}

- **Цель:** создать новое событие в системе.
- **Настройки:**
  - **URL:** `http://localhost:5566/events`
  - **Имя:** `create_event`
  - **Описание:** Используйте, когда нужно создать новое событие.
  - **Headers: (**&#x43F;о желанию) Добавьте необходимые HTTP-заголовки.
  - **Body (Тело запроса):** Жестко заданный объект тела, который переопределит сгенерированный LLM.
  - **Schema тела:** JSON-схема запроса, которая показывает, как нужно автоматически генерировать правильный JSON. Например:
    ```json
    {
      "name": {
        "type": "string",
        "required": true,
        "description": "Name of the event"
      },
      "date": {
        "type": "string",
        "required": true,
        "description": "Date of the event"
      },
      "location": {
        "type": "string",
        "required": true,
        "description": "Location of the event"
      }
    }
    ```

#### Интеграция 3: PUT (Обновление события)

![](/assets/image%20\(3\)%20\(1\)%20\(1\)%20\(1\)%20\(1\)%20\(1\)%20\(1\)%20\(1\)%20\(1\)%20\(1\).png){width="335"}

- **Цель:** обновить данные существующего события.
- **Настройки:**
  - **URL:** `http://localhost:5566/events`
  - **Имя:** `update_event`
  - **Описание:** Используйте, когда нужно обновить событие.
  - **Headers:** (по желанию) добавьте необходимые HTTP-заголовки.
  - **Body**: Жестко заданный объект тела, который переопределит тело, генерируемое LLM.
  - **Schema тела:** JSON-схема, поясняющая, как автоматически генерировать JSON. Например:
    ```json
    {
      "name": {
        "type": "string",
        "required": true,
        "description": "Name of the event"
      },
      "date": {
        "type": "string",
        "required": true,
        "description": "Date of the event"
      },
      "location": {
        "type": "string",
        "required": true,
        "description": "Location of the event"
      }
    }
    ```

#### Интеграция 4: DELETE (Удаление события)

![](/assets/image%20\(4\)%20\(1\)%20\(1\)%20\(1\)%20\(1\)%20\(1\)%20\(1\)%20\(1\)%20\(1\)%20\(1\).png){width="335"}

- **Цель:** удалить событие из системы.
- **Настройки:**
  - **URL:** `http://localhost:5566/events`
  - **Имя:** `delete_event`
  - **Описание:** Используйте, когда нужно удалить событие.
  - **Headers:** (по желанию) добавьте необходимые HTTP-заголовки.
  - **Schema параметров запроса:** JSON-схема API, чтобы LLM знало структуру URL и какие параметры нужны. Например:
    ```json
    {
      "id": {
        "type": "string",
        "required": true,
        "in": "path",
        "description": "ID of the item to delete. /:id"
      }
    }
    ```

### Как агент использует эти интеграции

- Агент может динамически выбрать, какую интеграцию использовать, исходя из запроса пользователя или логики сценария.
- Каждая интеграция сопоставлена с конкретным HTTP-методом и конечной точкой, с четко определенными схемами ввода.
- Агент использует LLM для интерпретации пользовательского ввода, заполнения необходимых параметров и выполнения соответствующего API-вызова.

Вот несколько **примеров взаимодействий** для вашего потока, включая примеры пользовательских запросов и ожидаемое поведение для каждого из них, сопоставленное с соответствующей интеграцией (GET, POST, PUT, DELETE):

### Пример взаимодействий

#### 1.  Получение событий (GET)

Пример запроса:

> "Покажи все предстоящие события"

Ожидаемое поведение:

- Агент выбирает интеграцию **GET**.
- Отправляет запрос GET по адресу `http://localhost:5566/events`.
- Возвращает список всех событий пользователю.

---

Другой пример:

> "Получить детали события с ID 12345."

**Поведение:**

- Агент выбирает **GET**.
- Отправляет GET по адресу `http://localhost:5566/events/12345`.
- Возвращает детали этого события.

---

#### 2. Создание нового события (POST)

Пример запроса:

> "Создай новое событие 'AI Conference' на 15.07.2024 в Tech Hall."

Ожидаемое поведение:

- Выбирает **POST**.
- Отправляет POST по адресу `http://localhost:5566/events` с телом:
  ```js
  "name": "AI Conference",
  "date": "2024-07-15",
  "location": "Tech Hall"
  ```

Подтверждает, что событие создано, и возвращает его детали.

#### 3. Обновление события (PUT)

Пример запроса:

> "Измени место проведения события 'AI Conference' на 15.07.2024 на 'Main Auditorium'."

Ожидаемое поведение:

- Выбирает PUT.
- Отправляет PUT с обновленными данными:
  ```json
  {
    "name": "AI Conference",
    "date": "2024-07-15",
    "location": "Main Auditorium"
  }
  ```
- Подтверждает обновление.

---

#### 4. Удаление события (DELETE)

Пример запроса:

> "Удалить событие с ID 12345."

Ожидаемое поведение:

- Выбирает **DELETE**.
- Отправляет DELETE по адресу `http://localhost:5566/events/12345`.
- Подтверждает, что событие удалено.

---

## OpenAPI Toolkit

Интеграции Requests из 4-х работают отлично, если у вас всего несколько API, но представьте, что у вас десятки или сотни API — это может стать трудно поддерживать. Чтобы решить эту проблему, osmi предоставляет набор интеграций OpenAPI, который способен взять YAML-файл OpenAPI и преобразовать каждый API в отдельную интеграцию. Спецификация OpenAPI (OAS) — это универсальный стандарт для описания деталей RESTful API в формате, который может читать и интерпретировать машина.

Используя API управления событиями, мы можем сгенерировать YAML-файл OpenAPI:

```yaml
openapi: 3.0.0
info:
  version: 1.0.0
  title: Event Management API
  description: An API for managing event data

servers:
  - url: http://localhost:5566
    description: Local development server

paths:
  /events:
    get:
      summary: List all events
      operationId: listEvents
      responses:
        '200':
          description: A list of events
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Event'
    
    post:
      summary: Create a new event
      operationId: createEvent
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/EventInput'
      responses:
        '201':
          description: The event was created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Event'
        '400':
          description: Invalid input
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

  /events/{id}:
    parameters:
      - name: id
        in: path
        required: true
        schema:
          type: string
        description: The event ID
    
    get:
      summary: Retrieve an event by ID
      operationId: getEventById
      responses:
        '200':
          description: The event
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Event'
        '404':
          description: Event not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
    
    patch:
      summary: Update an event's details by ID
      operationId: updateEventDetails
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/EventInput'
      responses:
        '200':
          description: The event's details were updated
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Event'
        '400':
          description: Invalid input
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        '404':
          description: Event not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
    
    delete:
      summary: Delete an event by ID
      operationId: deleteEvent
      responses:
        '204':
          description: The event was deleted
        '404':
          description: Event not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

components:
  schemas:
    Event:
      type: object
      properties:
        id:
          type: string
          description: The unique identifier for the event
        name:
          type: string
          description: The name of the event
        date:
          type: string
          format: date-time
          description: The date and time of the event in ISO 8601 format
        location:
          type: string
          description: The location of the event
      required:
        - name
        - date
        - location
    
    EventInput:
      type: object
      properties:
        name:
          type: string
          description: The name of the event
        date:
          type: string
          format: date-time
          description: The date and time of the event in ISO 8601 format
        location:
          type: string
          description: The location of the event
      required:
        - name
        - date
        - location
    
    Error:
      type: object
      properties:
        error:
          type: string
          description: Error message
```

### Шаг 1: Добавьте узел Start (Старт).

![](/assets/image%20\(4\)%20\(1\)%20\(1\)%20\(1\)%20\(1\)%20\(1\)%20\(1\)%20\(1\).png){width="319"}

### Шаг 2: Добавьте узел Agent (Агент).

Далее добавьте узел Агент. В этой конфигурации агент настроен только с одной интеграции — OpenAPI Toolkit.

#### Интеграция: OpenAPI Toolkit

![](/assets/image%20\(1\)%20\(1\)%20\(1\)%20\(1\)%20\(1\)%20\(1\)%20\(1\)%20\(1\)%20\(1\)%20\(1\)%20\(1\).png){width="332"}

- **Цель:** Получить список API из YAML-файла и преобразовать каждый API в список интеграций.
- **Входные параметры конфигурации:**
  - **YAML File:** YAML-файл OpenAPI
  - **Return Direct:** Возвращать ответ API напрямую или нет
  - **Headers (опционально):** Добавить необходимые HTTP-заголовки
  - **Remove null parameters:** Удалять все ключи с null-значениями из разобранных данных
  - **Custom Code**: Настроить, как возвращается ответ

### Примеры взаимодействия:

Можно использовать те же пример запросов из предыдущего примера для тестирования.

![](/assets/image%20\(2\)%20\(1\)%20\(1\)%20\(1\)%20\(1\)%20\(1\)%20\(1\)%20\(1\)%20\(1\)%20\(1\).png){width="563"}

---

### Последовательный вызов API

Из приведённых выше примеров мы увидели, как агент может динамически вызывать интеграцию и взаимодействовать с API. В некоторых случаях может потребоваться последовательный вызов API до или после определённых действий. Например, вы можете получить список клиентов из CRM и передать его агенту. В таких случаях можно использовать узел [HTTP](../using-flowise/agentflowv2#id-6.-http-node).

![](/assets/image%20\(3\)%20\(1\)%20\(1\)%20\(1\)%20\(1\)%20\(1\)%20\(1\)%20\(1\)%20\(1\).png){width="563"}

## Лучшие практики

- Взаимодействие с API обычно используется, когда вы хотите, чтобы агент получил наиболее актуальную информацию. Например, агент может получить вашу доступность в календаре, статус проекта или другие данные в реальном времени.
- Часто бывает полезно явно включать текущую дату и время в системный запрос. OSMI предоставляет переменную {{ current_date_time }} , которая получает текущую дату и время. Это позволяет модели быть осведомлённой о настоящем моменте, поэтому, если вы спросите о своей доступности на сегодня, модель сможет использовать правильную дату. В противном случае она может опираться на дату окончания своего последнего обучения, что приведет к устаревшей информации. Например:

```text
Вы полезный помощник..

Сегодняшняя дата и время: {{current_date_time }}
```

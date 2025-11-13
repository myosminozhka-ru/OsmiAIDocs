# Customer Support

Поддержка клиентов — один из самых распространённых вариантов использования искусственного интеллекта на сегодняшний день. Однако многие склонны чрезмерно усложнять её, добавляя несколько агентов. Во многих случаях желаемого результата можно добиться с помощью одного агента, при условии наличия хорошо продуманной системы подсказок, тщательно подобранных инструментов и тщательно подобранной базы знаний. Многоагентная архитектура обычно необходима только в том случае, если ваша система должна охватывать широкий спектр областей поддержки. Например, у вас может быть агент отдела кадров, который управляет кадровыми политиками и выполняет такие задачи, как подача заявлений на отпуск или обновление личных дел сотрудников, а также финансовый агент, который занимается возмещением средств, возвратами и другими финансовыми вопросами.

Если ваша система включает более 15–20 инструментов и источников знаний, обычно не рекомендуется перегружать одного агента. Вместо этого, как правило, лучше использовать отдельных агентов для определённых областей. В зависимости от вашего варианта использования мы всегда рекомендуем начать с одного агента, оценить производительность, выявить узкие места и только затем рассматривать многоагентную архитектуру.

Anthropic предоставляет хорошее руководство по этому вопросу - <https://docs.anthropic.com/en/docs/about-claude/use-case-guides/customer-support-chat>

## Единый агент

![](/assets/image%20\(331\).png){width="361"}

Для одиночного агента подсказки — важнейшая часть. Каждая модель ведёт себя по-своему. Например, Клод работает лучше всего, когда инструкции по конкретной задаче помещаются в сообщение «Пользователь», а не в сообщение «Система» (метод, известный как ролевые подсказки ). Часто приходится методом проб и ошибок определять, что работает лучше всего. Тем не менее, хорошие подсказки включают в себя следующие основные принципы:

#### Шаг 1: Роль

Первый шаг — назначить роль и личность агенту. Например:

```text
You are John, a friendly, knowledgeable, and professional customer support agent for Acme Events, an event management company that has been delivering exceptional events since 1985.

Your job is to help customers with any inquiries related to Acme’s event services, including:

- Corporate events & conferences

- Weddings & private parties

- Public festivals & community events

- Hybrid and virtual event solutions

You are warm, helpful, and solution-oriented. Always aim to resolve customer issues efficiently while maintaining a positive tone. If a question is outside your scope, politely inform the user and escalate the matter or suggest contacting the appropriate team.
```

#### Шаг 2: Рекомендации

Как вы хотите, чтобы агент отреагировал на запрос пользователя, набор шагов или рекомендаций, которым нужно следовать.

```text
Important guidelines:

- Always introduce yourself as John from Acme Events.

- Keep your responses clear, concise, and professional.

- Ask clarifying questions when needed.

- If a customer is asking about virtual or hybrid events, highlight that Acme has specialized solutions to reach global audiences.

- For time-sensitive inquiries, suggest calling the customer service number if it's during business hours.
```

> Если агент не может вызвать определённые инструменты в ответ на определённые запросы пользователей, вы можете добавить здесь дополнительные инструкции. Например: «Используйте инструмент для создания персонализированного коммерческого предложения».

#### Шаг 3: Бизнес-контекст

Предоставьте общую информацию о компании. Например:

```text
About Acme Events:
 
At Acme Events, we believe every occasion is a story waiting to be told. Since 1985, we’ve been designing and delivering exceptional events that leave lasting impressions—from intimate gatherings to large-scale productions.  

Whether you're planning a corporate conference, a dream wedding, or a public festival, Acme is your trusted partner from concept to curtain call. Our team of seasoned planners, creative designers, and on-the-ground coordinators ensures every detail is handled with precision and flair.  

With our award-winning service, innovative solutions, and seamless execution, you can focus on enjoying the moment while we bring your vision to life. We don’t just manage events—we create experiences that resonate.

Choose Acme Events and let us turn your ideas into unforgettable memories. Because at Acme, we don’t just plan events—we celebrate life’s biggest moments with you.

Note: We also specialize in hybrid and virtual events, ensuring your message reaches audiences anywhere in the world.

Acme Events offers the following services:
- Corporate events & conferences  
- Weddings & private parties  
- Public festivals & community events  
- Hybrid and virtual event solutions  

Business hours: Monday–Friday, 9 AM – 5 PM EST  
Customer service number: 1-800-123-4567
```

#### Шаг 4: Приведите примеры

Также очень важно научить агента отвечать на запросы пользователей, приводя примеры. Этот прием известен как краткое подсказывание.

```text
Here are a few examples of how you can interact with customers:

<example 1>
H: Hi, do you organize birthday parties for kids?

A: Hi there! I'm John from Acme Events—thanks for reaching out. While we primarily focus on corporate events, weddings, and public festivals, we do occasionally organize private parties, including birthdays.

Could you share more details about the party you're planning (e.g., number of guests, location, and date)? I'd be happy to see how we can help!
</example 1>

<example 2>
H: What are your business hours?

A: Our business hours are Monday to Friday, 9 AM to 5 PM EST.

If you have any event-related questions or need planning assistance, feel free to reach out during those hours. How can I assist you today?
</example 2>

<example 3>
H: Do you handle hybrid conferences?

A: Absolutely! We specialize in hybrid and virtual event solutions, perfect for engaging both in-person and remote audiences.

We handle everything from live streaming and technical setup to audience interaction tools and post-event analytics. Are you planning a hybrid event soon? I’d love to hear more about your requirements.
</example 3>

<example 4>
H: I’m looking to plan a wedding. Can you help with that?

A: Congratulations! Yes, we’d love to help you plan your big day. At Acme Events, we offer full-service wedding planning—from venue selection and theme design to vendor coordination and on-the-day execution.

Would you like to schedule a free consultation to discuss your vision and timeline?
</example 4>

<example 5>
H: Can I get a quote for a corporate event?

A: Of course! To prepare an accurate quote, I’ll need a few details:

1. What type of corporate event are you planning (e.g., seminar, gala, retreat)?

2. Estimated number of attendees?

3. Preferred date and location?

4. Any specific services you need (e.g., catering, AV setup, branding)?

Once I have this info, I’ll use our quoting tool to generate a personalized quote for you.
</example 5>
```

#### Шаг 5: Ограждения и примечания

Наконец, чтобы агент не сбился с пути, рекомендуется четко обозначить, что можно и чего нельзя делать при взаимодействии агента с клиентом.

```text
Please adhere to the following guardrails:

1. Only provide information about the services listed in Acme Events' official offerings (e.g., corporate events, weddings, public festivals, hybrid/virtual events).
2. If asked about services we don't offer (e.g., catering-only, travel booking), politely clarify that we do not provide those services.
3. Do not speculate about future service expansions, new packages, or unannounced partnerships.
4. Never make commitments, guarantees, or enter into agreements on behalf of the company. You are here to inform and guide, not to negotiate.
5. Do not reference or compare to any competitors or their offerings.
6. If a query is sensitive, urgent, or requires escalation, kindly direct the customer to contact our team at **1-800-123-4567** during business hours.
7. Always maintain a friendly, professional tone and ensure customer privacy is respected at all times.
```

Для помощи с подсказками вы можете использовать кнопку « Сгенерировать », это сгенерирует системную подсказку в соответствии с рекомендациями, упомянутыми выше:

![](/assets/image%20\(329\).png){width="386"}![](/assets/image%20\(328\).png){width="563"}

#### Шаг 6: Наименование и описание инструментов и знаний

Большинство готовых инструментов имеют понятные названия и описания, поэтому пользователям обычно не нужно их изменять. Однако для пользовательских инструментов и баз знаний предоставление понятного и описательного названия крайне важно, чтобы LLM понимал, когда и как использовать соответствующий инструмент. См. [рекомендации по определению функций](https://platform.openai.com/docs/guides/function-calling?api-mode=chat#best-practices-for-defining-functions). Вы также можете использовать кнопку « Сгенерировать » для описания знаний:

![](/assets/image%20\(330\).png){width="397"}

## Мульти-агенты

Для многоагентной архитектуры мы создадим систему, которая автоматически сортирует запросы клиентов и направляет их специализированным агентам в зависимости от характера запроса.

Хотя эта настройка предназначена для демонстрации возможностей архитектуры, стоит отметить, что пример, который мы рассмотрим, на самом деле может быть реализован одним агентом.

### Обзор

1. Начальный узел : собирает запросы клиентов через структурированную форму.
2. Агент состояния : анализирует запрос и определяет подходящий маршрут
3. Агент по кадрам : обрабатывает запросы, связанные с кадрами, имея доступ к базе знаний по кадрам.
4. Менеджер событий : управляет запросами, связанными с событиями, с помощью возможностей интеграции API.
5. Генеральный агент : обрабатывает общие запросы и оказывает всестороннюю помощь.

![](/assets/image%20\(317\).png)

#### Шаг 1: Создание начального узла

![](/assets/image%20\(318\).png){width="161"}

1. Начните с добавления начального узла на ваш холст.
2. Настройте начальный узел с помощью формы ввода для сбора запросов клиентов.
3. Настройте форму со следующей конфигурацией:

- Тип ввода : Форма ввода
- Название формы : «Запрос»
- Описание формы : «Запрос клиента»
- Типы ввода формы : настройте два строковых ввода:
  - Тема : Имя переменнойsubject
  - Тело : Имя переменнойbody

![](/assets/image%20\(319\).png){width="410"}

#### Шаг 2: Добавьте агент условия (обнаружение намерения пользователя)

![](/assets/image%20\(320\).png){width="216"}

1. Подключите узел агента условия к узлу «Пуск»
2. Настройте системные инструкции для работы в качестве агента поддержки клиентов. Вы также можете воспользоваться подсказками, используемыми в Single Agent . Вот простой пример:

```text
You are a customer support agent. Understand and process support tickets by automatically triaging them to the correct departments or individuals, generating immediate responses for common issues, and gathering necessary information for complex queries.

Follow the following routine with the user:

1. First, greet the user and see how you can help the user
2. If question is related to HR query, handoff to HR Agent
3. If question is related to events query, handoff to Event Manager

Note: Transfers between agents are handled seamlessly in the background; do not mention or draw attention to these transfers in your conversation with the user
```

3. Настройте входные данные для анализа темы формы: `{{ $form.subject }}`
4. Настройте сценарии маршрутизации:
   - Сценарий 0 : «Запрос связан с HR»
   - Сценарий 1 : «Запрос связан с событиями»
   - Сценарий 2 : «Запрос — общий запрос»

![](/assets/image%20\(321\).png){width="407"}

#### Шаг 3: Создайте HR-агента

![](/assets/image%20\(322\).png){width="217"}

1. Добавьте узел агента и подключите его к выходу Condition 0
2. Настройте системное сообщение для специализации HR:

```text
You are an HR agent responsible for retrieving and applying internal knowledge sources to answer employee queries about HR policies, procedures, and guidelines.

When responding to HR-related questions, you must first identify the relevant policy areas, search through available internal knowledge sources, and then provide accurate, comprehensive answers based on official company documentation.

# Steps
1. **Analyze the Query**: Identify the specific HR topic, policy area, or procedure the user is asking about
2. **Retrieve Relevant Information**: Search through internal HR knowledge sources including:
   - Employee handbooks
   - Policy documents
   - Procedure manuals
   - Benefits information
   - Compliance guidelines
   - Company-specific regulations
3. **Cross-Reference Sources**: Verify information across multiple relevant documents to ensure accuracy and completeness
4. **Synthesize Response**: Combine retrieved information into a coherent, actionable answer
5. **Provide Supporting Details**: Include relevant policy numbers, effective dates, or references to specific sections when applicable

# Notes
- Always prioritize the most current version of policies and note when information may be subject to change
- If conflicting information exists across sources, flag this and recommend contacting HR directly
- For sensitive topics (discrimination, harassment, legal issues), provide both policy information and appropriate escalation contacts
- When policies vary by location, employment type, or other factors, clearly specify which version applies
- If insufficient information is available in internal sources, explicitly state this limitation and suggest alternative resources
```

4. Настройка источников знаний (RAG):
   - Добавить хранилище документов : «Закон о кадрах»
   - Описание : «Эта информация полезна при определении правовой базы и требований к реализации управления человеческими ресурсами в соответствии с кадровым законодательством 2016 года и регламентом по его внедрению 2020 года».
   - Возврат исходных документов : включено

![](/assets/image%20\(323\).png){width="400"}

#### Шаг 4: Создайте менеджера событий

![](/assets/image%20\(324\).png){width="218"}

1. Добавьте еще один узел агента и подключите его к выходу «Условие 1».
2. Настройте системное сообщение:

```text
Act as an event manager that can determine actions on events such as create, update, get, list and delete.
```

4. Инструменты настройки:

- Добавьте OpenAPI Toolkit с конфигурацией API управления событиями. Подробнее см. в разделе [OpenAPI Toolkit](interacting-with-api#tool-openapi-toolkit).

![](/assets/image%20\(325\).png){width="399"}

Менеджер событий имеет доступ к полному API управления событиями, который может:

- Список всех событий
- Создать новые события
- Получить сведения о событии по идентификатор
- Обновить информацию о событии
- Удалить события

Пример кода смотрите в разделе [Event Management Server](interacting-with-api#prerequisite).

#### Шаг 5: Создайте генерального агента

![](/assets/image%20\(326\).png){width="204"}

1. Добавьте третий узел «Агент» и подключите его к выходу «Условие 2» . Он будет действовать как резервный маршрут, который может ответить на любой нерелевантный запрос. Его также можно заменить узлом [Direct Reply](../using-flowise/agentflowv2#id-12.-direct-reply-node), если вы хотите просто вернуть ответ по умолчанию.
2. Конфигурация:
   - Для общих запросов дополнительные инструменты не требуются.
   - Источники знаний не требуются

### Тестирование потока

1. Тестовые запросы по кадрам : отправка запросов о политике компании, льготах или кадровых процедурах
2. Тестовые запросы событий : попробуйте создать, обновить или запросить информацию о событиях компании.
3. Тестирование общих запросов : задавайте общие вопросы, чтобы увидеть, как система направляет запросы к общему агенту.
4. Наблюдайте за маршрутизацией : обратите внимание, как агент условий плавно направляет запросы, не раскрывая процесс передачи.

![](/assets/image%20\(327\).png)

### Полная структура потока

{% file src="/assets/Customer Support Agents.json" %}

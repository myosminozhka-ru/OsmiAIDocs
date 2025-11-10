# Gmail

## Создание учетных данных в OSMI и Google Cloud для Gmail OAuth2

1. Создать учетные данные в OSMI.
2. Добавьте новые учетные данные Gmail OAuth2.
3. Введите название учетных данных.

<figure><img src="/assets/image (255).png" alt="" width="437"><figcaption></figcaption></figure>

4. Скопируйте URL-адрес для перенаправления OAuth (OAuth Redirect URL).
   Обратите внимание, что необходимо заполнить следующие поля:

- Client ID
- Client Secret

Создать или использовать проект в Google

1. Войдите в свой аккаунт [**Google Cloud**](https://console.cloud.google.com/).
2. Перейдите в раздел [**Google Cloud Console > APIs & Services**](https://console.cloud.google.com/apis/credentials), выберите проект из выпадающего меню в левом верхнем углу (или создайте новый проект и выберите его).
3. Настройте экран согласия OAuth, если он еще не настроен.
<figure><img src="/assets/image (256).png" alt="" width="563"><figcaption></figcaption></figure>
4. Перейдите в раздел Credentials, нажмите + CREATE CREDENTIALS > OAuth client ID.
<figure><img src="/assets/image (257).png" alt="" width="563"><figcaption></figcaption></figure>
5. В выпадающем меню Application type выберите Web application.
6. В разделе Authorized redirect URIs нажмите + ADD URI и вставьте ранее скопированный OAuth Redirect URL.
7. Нажмите Create.
<figure><img src="/assets/image (258).png" alt="" width="407"><figcaption></figcaption></figure>
8. Скопируйте Client ID и Client Secret.
<figure><img src="/assets/image (259).png" alt="" width="489"><figcaption></figcaption></figure>
Включение необходимых API

1. Перейдите в раздел Enabled APIs & Services, нажмите + ENABLE APIS AND SERVICES.
2. Найдите и включите Gmail API.

<figure><img src="/assets/image (260).png" alt="" width="538"><figcaption></figcaption></figure>

Завершение настройки

1. Вернитесь в раздел Credentials и кликните по созданному недавно учётному записям OAuth 2.0 Client ID.
2. На странице деталей найдете Client ID и Client Secret.

Настройка в OSMI

1. Заполните все ранее скопированные значения в соответствующих полях.
   <figure><img src="/assets/image (262).png" alt="" width="433"><figcaption></figcaption></figure>
2. Нажмите "Authenticate" (Авторизация).
   ![](/assets/image%20\(261\).png){width="448"}
3. Откроется окно входа в Google:

- Войдите в аккаунт Google и предоставьте разрешения.
  ![](/assets/image%20\(263\).png){width="373"}
- После подтверждения окно закроется автоматически, и учетные данные будут сохранены и готовы к использованию.

Использование в качестве инструмента агента (Agent Tool)

- Можно выбрать несколько действий, чтобы агент мог самостоятельно определить подходящее.
- Параметры можно оставить пустыми, чтобы агент сам определил значения. Если пользователь введет параметры, они перекроют автоматический выбор агента.
  ![](/assets/image%20\(264\).png)

Использование как узла инструмента (Tool Node)

- Также его можно использовать как узел инструмента в конкретном сценарии рабочего процесса, например для получения списка черновиков сообщений перед следующей операцией.
- В этом режиме аргументы ввода для инструмента должны быть явно определены и заполнены значениями.
- В отличие от варианта для [агента](gmail#use-as-agent-tool), здесь нет автоматического определения вводимых данных; пользователь должен вручную заполнить поля, либо задать фиксированные значения, либо использовать переменные в двойных фигурных скобках {{  }} .

![](/assets/image%20\(265\).png)

---
description: Обёртка вокруг SearXNG — бесплатной метапоисковой системы в интернете.
---

# SearXNG

![](/assets/up-011.png){width="283"}

### Настройка SearXNG

Следуйте официальной [документации](https://docs.searxng.org/admin/installation.html) для настройки SearXNG локально. В данном случае мы будем использовать Docker Compose для его установки.
Перейдите в репозиторий [searxng-docker](https://github.com/searxng/searxng-docker) и следуйте инструкциям по настройке.
Убедитесь, что в файле `searxng/settings.yml` установлено `server.limiter: false`, а в разделе `search.formats` включён формат `json`. Эти параметры можно настроить в файле `searxng/settings.yml`:

```yaml
server:
  limiter: false
general:
  debug: true
search:
  formats:
    - html
    - json
```

Запустите контейнер командой `docker-compose up -d`, откройте веб-браузер и перейдите по адресу <http://localhost:8080/search>. Там вы увидите страницу SearXNG.

### Использование в OSMI

Перетащите узел SearXNG на рабочее пространство. Заполните поле Base URL значением: **<http://localhost:8080>.** Также можно указать другие параметры поиска, если необходимо.
LLM автоматически определит, что нужно искать, основываясь на вопросе пользователя.

![](/assets/image%20\(171\).png)

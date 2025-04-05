# Geometr Landing Page

Современный лендинг с интеграцией Google Maps и контактной формой.

## Технологии

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Material-UI
- Google Maps API
- Docker

## Требования

- Node.js 18+
- Docker (опционально)

## Установка и запуск

### Локальный запуск

```bash
# Установка зависимостей
npm install

# Запуск в режиме разработки
npm run dev
```

### Запуск через Docker

```bash
# Сборка и запуск контейнера
docker-compose up --build

# Остановка контейнера
docker-compose down
```

## Переменные окружения

Создайте файл `.env.local` и добавьте следующие переменные:

```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

## Структура проекта

- `/app` - Основные страницы и компоненты Next.js
- `/components` - React компоненты
- `/public` - Статические файлы

## Разработка

1. Форкните репозиторий
2. Создайте ветку для новой функциональности (`git checkout -b feature/amazing-feature`)
3. Зафиксируйте изменения (`git commit -m 'Add some amazing feature'`)
4. Отправьте изменения в ветку (`git push origin feature/amazing-feature`)
5. Откройте Pull Request 
---
name: Bug
about: Что-то работает не так
type: Bug
---

## Шаги

1.

## Ожидалось

## Получилось

## Где

<!-- браузер, устройство, коммит или ссылка на деплой -->

git add .nvmrc .github/workflows/ci.yml
git commit -m "chore: pin node version"
git add .vscode/settings.json .vscode/extensions.json .gitignore
git commit -m "chore: share vscode settings"
git status
git push -u origin chore/team-setup

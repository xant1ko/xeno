import eslint from '@eslint/js'; // Подключаем базовые правила ESLint.
import prettier from 'eslint-config-prettier'; // Отключаем правила, конфликтующие с Prettier.
import globals from 'globals'; // Добавляем глобальные переменные Node.js.
import tseslint from 'typescript-eslint'; // Подключаем поддержку TypeScript.

export default tseslint.config(
  {
    ignores: ['dist/**', 'node_modules/**'], // Не проверяем сгенерированные и внешние файлы.
  },
  eslint.configs.recommended, // Включаем рекомендуемые правила JavaScript.
  ...tseslint.configs.recommended, // Включаем рекомендуемые правила TypeScript.
  prettier, // Оставляем форматирование под контролем Prettier.
  {
    files: ['src/**/*.ts'], // Ограничиваем правила исходным кодом.
    languageOptions: {
      globals: globals.node, // Разрешаем стандартные глобальные объекты Node.js.
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off', // Не запрещаем any на базовом этапе проекта.
    },
  },
);

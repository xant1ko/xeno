import plugin from '@typescript-eslint/eslint-plugin'
import vuetify from 'eslint-config-vuetify'
import pluginVue from 'eslint-plugin-vue'

export default vuetify(
  {
    ts: true,
  },
  ...pluginVue.configs['flat/recommended'],
  {
    plugins: {
      '@typescript-eslint': plugin,
    },
    rules: {
      'indent': [
        'error',
        2, // встроенное правило ESLint, которое требует ровно 2 пробела на каждый уровень вложенности
        {
          SwitchCase: 1, // без этой опции case внутри switch не отступает
          flatTernaryExpressions: false,
        },
      ],
      '@typescript-eslint/explicit-function-return-type': 'error',
      'vue/no-v-html': 'off', // разрешает атрибут v-html (неободимо для отрисовки html графиков)
      'unicorn/prefer-at': 'off',
      'unicorn/no-array-for-each': 'off',
      'unicorn/prefer-ternary': 'off',
      'vue/script-indent': 'off', //  если нужно проверять отступы и в .vue, тогда вместо этого включить vue/script-indent и оставить indent: 'off'
      'vue/no-use-v-if-with-v-for': 'off',
      'vue/multi-word-component-names': 'off',
      'vue/valid-v-for': 'off', // разрешает v-if и v-for на одном элементе
      'no-console': 'error', // консоль логи - ужасно!
      '@typescript-eslint/no-explicit-any': 'off', // предупреждает об any
      'vue/attributes-order': ['error', { // порядок атрибутов
        order: [
          'SLOT', // v-slot, slot
          'TWO_WAY_BINDING', // v-model
          'LIST_RENDERING', // v-for
          'CONDITIONALS', // v-if, v-else-if, v-else
          'EVENTS', // @click
          'OTHER_ATTR', // title, class, style
        ],
        alphabetical: false, // сортировать ли атрибуты внутри группы по алфавиту
      }],
      'vue/max-attributes-per-line': ['error', {
        singleline: 2, // На одной строке максимум атрибутов
        multiline: 2, // На каждой строке переноса максимум атрибутов
      }],
    },
  },
  {
    files: ['src/utils/generalUtils.ts'],
    rules: {
      'no-console': 'off',
    },
  },
  {
    ignores: ['src/api/generated/**', 'src/types/generated/**'],
  },
)

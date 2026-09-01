import { createVuetify } from 'vuetify'
import { VMaskInput } from 'vuetify/labs/VMaskInput'
import { currentOrg } from '@/config'
import { createTheme } from '@/plugins/themes'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

export default createVuetify({
  ...createTheme(currentOrg),
  components: {
    VMaskInput,
  },
})

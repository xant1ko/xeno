<template>
  <v-badge
    color="secondary-color-greyscale-medium"
    :content="props.count"
    location="bottom right"
    :model-value="props.count > 0"
    offset-x="13"
    offset-y="35"
    text-color="primary-color-dark"
  >
    <v-btn
      color="primary"
      :class="[props.count > 0 ? 'active' : null]"
      icon="mdi-cog"
      :size="props.sizeValue || 'large'"
    />
  </v-badge>
</template>

<script setup lang="ts">
const props = defineProps({
  count: {
    type: Number,
    default: 9999,
  },
  sizeValue: {
    type: String,
    default: '',
  },
})
</script>

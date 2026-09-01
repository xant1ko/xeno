<template>
  <v-chip
    @click="goToTg()"
    rounded
    density="compact"
    color="#27a7e7"
    variant="elevated"
  >
    <v-icon
      size="small"
      class="mr-1"
    >
      mdi-send
    </v-icon>
    {{ telegram }}
  </v-chip>
</template>

<script setup lang="ts">

const props = defineProps<{
    telegram: string
}>()

function goToTg (): void {
  window.open(`https://t.me/${props.telegram}`, '_blank')
}

</script>

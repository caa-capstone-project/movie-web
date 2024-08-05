<template>
  <UCard class="form-center">
    <template #header>
      <p>Answer following questions before start using Movie Advisor</p>
    </template>
    <UForm :schema="schema" :state="state" class="space-y-4 form-center" @submit="onSubmit">
      <UFormGroup label="Genre" name="genre" class="form-center">
        <USelectMenu v-model="state.genres" :options="genreOptions" multiple class="form-input" />
      </UFormGroup>

      <UFormGroup label="Language" name="language" class="form-center">
        <USelectMenu v-model="state.languages" :options="languageOptions" multiple class="form-input" />
      </UFormGroup>

      <UFormGroup label="Year" name="year" class="form-center">
        <USelectMenu v-model="state.years" :options="yearOptions" multiple class="form-input" />
      </UFormGroup>

      <UButton type="submit">
        Submit
      </UButton>
    </UForm>
  </UCard>
</template>

<script setup lang="ts">
import Joi from 'joi'
import type { FormSubmitEvent } from '#ui/types'

const schema = Joi.object({
  userId: Joi.number().required(),
  genres: Joi.array().min(1).required(),
  languages: Joi.array().min(1).required(),
  years: Joi.array().min(1).required(),
})

const state = reactive({
  userId: 0,
  genres: [],
  languages: [],
  years: [],
})

const genreOptions = ['Action', 'Comedy', 'Drama', 'Horror', 'Romance', 'Sci-Fi']
const languageOptions = ['English', 'Hindi', 'Spanish', 'French', 'German', 'Chinese']
const yearOptions = ['2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015']

async function onSubmit(event: FormSubmitEvent<any>) {
  // Do something with event.data
  state.userId = 8888
  console.log(event.data)

  try {
    const response = await fetch('http://127.0.0.1:4202/preference', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event.data),
    });

    if (response.ok) {
      // Handle successful response
      const data = await response.json();
      console.log(data);
    } else {
      // Handle error response
      throw new Error('Request failed');
    }
  } catch (error) {
    // Handle network error or exception
    console.error(error);
  }

  goToIndexPage()
}

const goToIndexPage = () => {
  navigateTo({ path: '/', query: { questionnaireCompleted: 'true' } })
}
</script>
<style>
.form-center {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.form-input {
  width: 20vw;
  background-color: transparent;
  border: 0px;
}
</style>

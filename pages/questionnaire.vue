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
import { jwtDecode } from 'jwt-decode';

const schema = Joi.object({
  userId: Joi.string().required(),
  genres: Joi.array().min(1).required(),
  languages: Joi.array().min(1).required(),
  years: Joi.array().min(1).required(),
})

const state = reactive({
  userId: null as string | null,
  genres: [],
  languages: [],
  years: [],
})

const genreOptions = ['Action', 'Comedy', 'Drama', 'Horror', 'Romance', 'Sci-Fi']
const languageOptions = ['English', 'Hindi', 'Spanish', 'French', 'German', 'Chinese']
const yearOptions = ['2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015']

async function onSubmit(event: FormSubmitEvent<any>) {
  // Do something with event.data
  console.log(event.data)

  try {
    const response = await fetch(`${useRuntimeConfig().public.PREFERENCE_SERVICE_URL}`, {
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

const checkLoginStatus = () => {
  const idToken = localStorage.getItem('id_token');
  if (!idToken) {
    window.location.href = useRuntimeConfig().public.COGNITO_CLIENT_URL || window.location.href;
  } else {
    validateToken(idToken);
    state.userId = getSubFromToken(idToken);
  }
}

const validateToken = (token: string) => {
  try {
    const decodedToken: any = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);
    if (decodedToken.exp < currentTime) {
      console.error('Token has expired');
      localStorage.removeItem('id_token');
      window.location.href = useRuntimeConfig().public.COGNITO_CLIENT_URL || window.location.href;
    } else {
      console.log('Token is valid');
    }
  } catch (error) {
    console.error('Invalid token', error);
    localStorage.removeItem('id_token');
    window.location.href = useRuntimeConfig().public.COGNITO_CLIENT_URL || window.location.href;
  }
}

const getSubFromToken = (token: string): string | null => {
  try {
    const decodedToken: any = jwtDecode(token);
    return decodedToken.sub;
  } catch (error) {
    console.error('Invalid token', error);
    return null;
  }
}

onMounted(() => {
  checkLoginStatus();
})
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

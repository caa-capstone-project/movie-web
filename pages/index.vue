<template>
	<UCard>
		<Swiper :modules="[SwiperFreeMode]" :slides-per-view="3" :loop="true" :free-mode="true">
			<SwiperSlide v-for="movie in movieList" :key="movie.id">
				<img :src="'https://image.tmdb.org/t/p/original/' + movie.poster_path" alt="Movie Poster"
					class="h-12 w-auto logo" />
				<NuxtRating :read-only="false" :rating-step="0.5" @rating-selected="(rate) => ratingHandler(rate, movie.id) " />
			</SwiperSlide>
		</Swiper>
	</UCard>
	<UCard class="button-card">
		<UButton @click="">Submit</UButton>
	</UCard>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	data(): { 
		movieList: { id: number, title: string, poster_path: string }[] | null,
		ratingList: { id: number, rating: number }[],
	} {
		return {
			movieList: null,
			ratingList: [],
		}
	},
	methods: {
		ratingHandler(rate: number, movieId: number) {
			const index = this.ratingList.findIndex(item => item.id === movieId);
			if (index !== -1) {
				// Update existing rating
				this.ratingList[index].rating = rate;
			} else {
				// Add new rating
				this.ratingList.push({ id: movieId, rating: rate });
			}
		},
		async submitHandler() {
		}
	},
	// created() {
	// 	console.log('Component created')
	// },
	async mounted() {
		console.log('Component mounted')
		this.movieList = await fetch('http://a69226bf1b88f482097c14f2dfe69f92-403154274.us-east-1.elb.amazonaws.com:4200/api/listmovie', {
			method: 'GET'
		}).then(res => res.json()).catch(err => console.error(err));
		console.log('Movie list:', this.movieList);
		
	},
})
</script>
<style>
.button-card {
	display: flex;
	justify-content: center;
}
</style>


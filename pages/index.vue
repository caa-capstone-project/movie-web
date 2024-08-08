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
		<UButton @click="submitHandler">Submit</UButton>
	</UCard>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	data(): { 
		movieList: { id: number, title: string, poster_path: string }[] | null,
		ratings: { movieId: number, rating: number }[],
	} {
		return {
			movieList: null,
			ratings: [],
		}
	},
	methods: {
		ratingHandler(rate: number, movieId: number) {
			const index = this.ratings.findIndex(item => item.movieId === movieId);
			if (index !== -1) {
				// Update existing rating
				this.ratings[index].rating = rate;
			} else {
				// Add new rating
				this.ratings.push({ movieId: movieId, rating: rate });
			}
		},
		async submitHandler() {
			await this.updateRatings(this.ratings);
			this.movieList = await fetch('http://127.0.0.1:4200/api/listmovie/8888', {
				method: 'GET'
			}).then(res => res.json()).catch(err => console.error(err));
		},
		async updateRatings(ratings: { movieId: number, rating: number }[]) {
			try {

				const response = await fetch('http://127.0.0.1:4203/rating', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ userId: 8888, ratings }),
				});

				if (response.ok) {
					const data = await response.json();
					console.log(data);
				} else {
					throw new Error('Request failed');
				}
			} catch (error) {
				console.error(error);
			}
		},
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

